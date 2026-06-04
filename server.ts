import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore";
import fs from "fs";
import { calculateBasePrice, calculateTotalPrice } from "./src/utils/pricing.js";

dotenv.config();

let firebaseApp: any = null;
let db: any = null;

function getDb() {
  if (db) return db;
  
  let firebaseConfig;

  // Próba załadowania ze zmiennej środowiskowej (np. na Render)
  if (process.env.FIREBASE_CONFIG) {
    try {
      firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
    } catch (e) {
      console.error("Nie można sparsować FIREBASE_CONFIG ze zmiennych środowiskowych:", e);
    }
  } else {
    // Fallback: lokalny plik z AI Studio
    try {
      const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
      if (fs.existsSync(configPath)) {
        const configString = fs.readFileSync(configPath, 'utf-8');
        firebaseConfig = JSON.parse(configString);
      }
    } catch (e) {
      console.error("Nie można załadować firebase-applet-config.json w backendzie:", e);
    }
  }

  if (!firebaseConfig) {
    console.warn("Brak konfiguracji Firebase. Zapis rezerwacji do bazy nie będzie działał. Skonfiguruj zmienną FIREBASE_CONFIG.");
    // Nie rzucamy wyjątku na starcie, jeśli to tylko błąd przy wywołaniu.
    // Aby nie zatrzymać serwera, ale rzucić przy użyciu:
    throw new Error("Firebase configuration not found.");
  }

  firebaseApp = initializeApp(firebaseConfig);
  db = getFirestore(firebaseApp, firebaseConfig?.firestoreDatabaseId || "ai-studio-f068a9a2-73b9-4421-a1d4-949deda8dbfc");
  return db;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Endpoint do bezpiecznego pobrania gotowego pliku ZIP bezpośrednio z serwera
  app.get("/pobierz-zip", (req, res) => {
    const zipPath = path.join(process.cwd(), "gotowa_strona_do_ftp.zip");
    if (fs.existsSync(zipPath)) {
      res.setHeader("Content-Type", "application/zip");
      res.setHeader("Content-Disposition", "attachment; filename=gotowa_strona_do_ftp.zip");
      return res.sendFile(zipPath);
    } else {
      return res.status(404).send("Plik ZIP jeszcze nie został wygenerowany.");
    }
  });

  // Obsługa CORS dla zewnętrznych zapytań z domen domyślnych i klienta (np. rozekinvest.pt)
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, stripe-signature");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  // Endpoint dla Stripe Webhooks musi używać express.raw()
  app.post("/api/stripe-webhook", express.raw({ type: "application/json" }), async (req, res) => {
    const signature = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
       console.error("Skonfiguruj STRIPE_WEBHOOK_SECRET w ustawieniach (Sekrety).");
       return res.status(500).send("No webhook secret configured");
    }

    let event;
    try {
      const Stripe = (await import("stripe")).default;
      const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY as string);
      event = stripeClient.webhooks.constructEvent(req.body, signature as string, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;
      const metadata = session.metadata;

      console.log("Płatność zakończona sukcesem dla sesji:", session.id);

      if (metadata && metadata.apartmentId) {
        // Zapisz rezerwację do Firebase
        try {
          const dbInstance = getDb();
          await addDoc(collection(dbInstance, "bookings"), {
            apartmentId: metadata.apartmentId,
            customerName: session.customer_details?.name || "Nieznany",
            customerEmail: session.customer_details?.email || "",
            customerPhone: session.customer_details?.phone || "",
            checkIn: metadata.checkIn,
            checkOut: metadata.checkOut,
            totalPrice: session.amount_total ? session.amount_total / 100 : 0,
            status: "confirmed",
            webhookSecret: "studio_webhook_secret",
            stripeSessionId: session.id,
            createdAt: Date.now()
          });
          console.log("Zapisano rezerwację w Firebase!");
        } catch (dbErr) {
          console.error("Błąd zapisu do bazy danych:", dbErr);
        }
      }
    }

    res.json({ received: true });
  });

  app.use(express.json());

  // API Czatbota Gemini
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, userText, language } = req.body;
      
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "Brak skonfigurowanego klucza GEMINI_API_KEY w zmiennych środowiskowych serwera." });
      }

      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey });

      const getSystemInstruction = (lang: string) => `Jesteś profesjonalnym, uprzejmym asystentem wirtualnym (konsjerżem) dla "Rożek Invest" - apartamentów wakacyjnych w Portugalii.
Twoje odpowiedzi muszą być BARDZO ZWIĘZŁE, a zarazem profesjonalne, kulturalne i entuzjastyczne, tak aby klient szybko i sprawnie uzyskał potrzebne informacje. Twoją rolą jest zachęcenie do wynajmu i rozwianie wątpliwości. Odpowiadaj krótko i na temat.
Masz dostęp do narzędzia wyszukiwania w Google. Używaj go, aby odpowiadać na pytania dotyczące okolicy, atrakcji turystycznych (np. "ile jest kościołów w okolicy", "gdzie zjeść w pobliżu"), lotów czy innych obiektywnych informacji nawiązujących do regionu Rożek Invest i Portugalii.
Jeśli po przeanalizowaniu dostępnych danych nadal czegoś nie wiesz, uprzejmie poinformuj, że nie znasz odpowiedzi na to pytanie. Zachęć jednocześnie klienta do kontaktu bezpośredniego z gospodarzem w celu uzyskania szczegółowych informacji - pod adresem e-mail: barbara@rozek.pl lub pod numerem telefonu: +48 600 323 472, bądź przez formularz kontaktowy na stronie.

Informacje o apartamentach:
Mamy dwa apartamenty w regionie Rożek Invest (Srebrne Wybrzeże) w Portugalii:
1. Nautilus (São Martinho do Porto):
- Przestronny apartament z 2 sypialniami na parterze.
- 1 łazienka.
- Przeznaczony dla maksymalnie 4 osób.
- Jasny salon, otwarta kuchnia, prywatny taras.
- Dostęp do wspólnego basenu oraz miejsce parkingowe w garażu podziemnym.
- Cena: od 79 € / noc.

2. Vale Furado (Vale Furado, Pataias):
- Rewelacyjny apartament typu T2 (2 sypialnie).
- 1 łazienka.
- Równie urokliwy, świetna baza do odkrywania Portugalii.
- Cena: od 87 € / noc.

Udogodnienia ogólne obu apartamentów:
- Szybkie Wi-Fi
- Bezpłatny parking
- W pełni wyposażona kuchnia
- Smart TV
- Klimatyzacja
- Ręczniki i suszarka do włosów
- Blisko morza, spokojna okolica, idealne dla rodzin i par.

Zasady i opłaty:
- Palenie jest zabronione.
- Zwierzęta - po uzgodnieniu (klient musi zapytać).
- Do każdego pobytu dodawana jest jednorazowa opłata za sprzątanie w wysokości 140 €.
- Odpowiedzi formułuj zwięźle, w sposób naturalny dla czatu. Zwykle odpowiedź powinna mieć 1-3 krótkie akapity. Nie twórz sztucznych list, chyba że klient o to prosi. 
- Mów w języku docelowym strony internetowej (aktualnie: ${language || 'pl'}), chyba że klient zadaje pytanie lub używa innego języka - wtedy bezwzględnie odpowiadaj w języku klienta.`;

      const contents = (messages || []).map((m: any) => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      contents.push({
        role: "user",
        parts: [{ text: userText }]
      });

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: contents,
        config: {
          systemInstruction: getSystemInstruction(language || 'pl'),
          temperature: 0.7,
          tools: [{ googleSearch: {} }]
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Błąd API czatu Gemini:", error);
      res.status(500).json({ error: "Przepraszam, mam w tej chwili problemy techniczne." });
    }
  });

  // Zabezpieczone API do pobierania rezerwacji bez ujawniania danych osobowych
  app.get("/api/bookings/:apartmentId", async (req, res) => {
    try {
      const { apartmentId } = req.params;
      
      const dbInstance = getDb();
      const q = query(
        collection(dbInstance, "bookings"),
        where("apartmentId", "==", apartmentId),
        where("status", "==", "confirmed")
      );
      
      const snapshot = await getDocs(q);

      const bookedRanges: { checkIn: string; checkOut: string }[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.checkIn && data.checkOut) {
          bookedRanges.push({
            checkIn: data.checkIn,
            checkOut: data.checkOut
          });
        }
      });

      res.json({ bookings: bookedRanges });
    } catch (error: any) {
      console.error("Błąd pobierania rezerwacji:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // API płatności Stripe
  app.post("/api/create-checkout-session", async (req, res) => {
    const { apartmentId, nights, checkIn, checkOut } = req.body;

    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: "Brak konfiguracji STRIPE_SECRET_KEY" });
    }

    try {
      // Sprawdź czy apartament nie jest już zarezerwowany w tym terminie (Zapobieganie double booking)
      const dbInstance = getDb();
      const bookingsCol = collection(dbInstance, "bookings");
      const q = query(
        bookingsCol,
        where("apartmentId", "==", apartmentId),
        where("status", "==", "confirmed")
      );
      const snapshot = await getDocs(q);
      const hasOverlap = snapshot.docs.some(doc => {
        const data = doc.data();
        if (data.checkIn && data.checkOut) {
          return (data.checkIn < checkOut) && (data.checkOut > checkIn);
        }
        return false;
      });

      if (hasOverlap) {
        return res.status(400).json({ error: "Przepraszamy, te daty zostały już zarezerwowane. Wybierz inny termin na kalendarzu." });
      }

      const parsedCheckIn = new Date(checkIn);
      const parsedCheckOut = new Date(checkOut);
      const calculatedBasePrice = calculateBasePrice(apartmentId, parsedCheckIn, parsedCheckOut);

      // Importujemy dynamicznie aby uniknąć błędów gdy klucz nie istnieje przy starcie serwera
      const Stripe = (await import("stripe")).default;
      const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);

      const apartmentNames: Record<string, string> = {
        nautilus: "Nautilus Silver Coast",
        valefurado: "Vale Furado"
      };

      const session = await stripeClient.checkout.sessions.create({
        payment_method_types: ["card", "blik"], // Możemy obsługiwać np. blik
        line_items: [
          {
            price_data: {
              currency: "eur",
              product_data: {
                name: `Rezerwacja: ${apartmentNames[apartmentId] || "Apartament"}`,
                description: `Pobyt od ${checkIn} do ${checkOut} (${nights} nocy)`,
              },
              unit_amount: calculatedBasePrice * 100, // Stripe oczekuje groszy (centów)
            },
            quantity: 1,
          },
          {
            price_data: {
              currency: "eur",
              product_data: {
                name: "Opłata za sprzątanie",
                description: "Jednorazowa opłata za sprzątanie po pobycie",
              },
              unit_amount: 140 * 100, // 140 euro
            },
            quantity: 1,
          }
        ],
        mode: "payment",
        metadata: {
          apartmentId,
          checkIn,
          checkOut,
          nights: nights.toString(),
        },
        success_url: `${process.env.APP_URL || "http://localhost:3000"}?payment=success`,
        cancel_url: `${process.env.APP_URL || "http://localhost:3000"}?payment=cancelled`,
      });

      res.json({ id: session.id, url: session.url });
    } catch (error: any) {
      console.error("Stripe error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // API do wysyłania emaili
  app.post("/api/contact", async (req, res) => {
    const { name, email, phone, message, apartment, subject } = req.body;

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.CONTACT_EMAIL) {
      console.error("Brak konfiguracji SMTP w zmiennych środowiskowych.");
      return res.status(500).json({ error: "Serwer nie jest poprawnie skonfigurowany do wysyłania maili." });
    }

    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_PORT === "465",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const mailOptions = {
        from: `"${name}" <${process.env.SMTP_USER}>`, // Wysłane z naszego serwera (aby uniknąć spamu)
        replyTo: email, // Możesz bezpośrednio odpisać klientowi
        to: process.env.CONTACT_EMAIL, // Twój email kontaktowy
        subject: subject || `Nowe zapytanie z aplikacji: ${apartment || 'Ogólne'}`,
        text: `Otrzymałeś nowe zapytanie z formularza kontaktowego.\n\n` +
              `Imię i nazwisko: ${name}\n` +
              `Email: ${email}\n` +
              `Telefon: ${phone || 'Nie podano'}\n` +
              `Apartament: ${apartment || 'Nie dotyczy'}\n\n` +
              `Wiadomość:\n${message}`,
        html: `
          <h3>Nowe zapytanie z formularza kontaktowego</h3>
          <p><strong>Imię i nazwisko:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Telefon:</strong> ${phone || 'Nie podano'}</p>
          <p><strong>Apartament:</strong> ${apartment || 'Nie dotyczy'}</p>
          <hr/>
          <p><strong>Wiadomość:</strong></p>
          <p>${message.replace(/\n/g, '<br/>')}</p>
        `
      };

      await transporter.sendMail(mailOptions);
      res.json({ status: "ok", message: "Wiadomość została wysłana pomyślnie." });
    } catch (error) {
      console.error("Błąd podczas wysyłania e-maila:", error);
      res.status(500).json({ error: "Wystąpił błąd podczas wysyłania wiadomości." });
    }
  });

  // Endpoint do pobierania spakowanego archiwum ZIP bezpośrednio przez przeglądarkę
  app.get("/download-zip", (req, res) => {
    const zipPath = path.join(process.cwd(), "gotowa_strona_do_ftp.zip");
    if (fs.existsSync(zipPath)) {
       res.setHeader("Content-Type", "application/zip");
       res.setHeader("Content-Disposition", "attachment; filename=gotowa_strona_do_ftp.zip");
       res.sendFile(zipPath);
    } else {
       res.status(404).send("Błąd: Plik gotowa_strona_do_ftp.zip nie istnieje na serwerze dev. Wygeneruj go najpierw.");
    }
  });

  const isProd = process.env.NODE_ENV === "production" || fs.existsSync(path.join(process.cwd(), "dist", "index.html"));

  // Vite middleware for development
  if (!isProd) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Statyczne pliki w produkcji
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      const indexPath = path.join(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send(`Zainicjowano z NODE_ENV=production, ale plik ${indexPath} nie istnieje.`);
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
