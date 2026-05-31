import React, { useState, useEffect } from "react";
import emailjs from '@emailjs/browser';
import { useLanguage } from "../context/LanguageContext";
import { motion } from "motion/react";
import { Button } from "../components/ui/Button";
import { MessageCircle, Phone, Mail } from "lucide-react";
import { calculateTotalPrice } from "../utils/pricing";

export function Contact() {
  const { t } = useLanguage();
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");
  const [apartment, setApartment] = useState("");
  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");
  
  let estimatedPrice = null;
  if ((apartment === "nautilus" || apartment === "valefurado") && arrival && departure) {
    const arrDate = new Date(arrival);
    const depDate = new Date(departure);
    if (!isNaN(arrDate.getTime()) && !isNaN(depDate.getTime()) && arrDate < depDate) {
      estimatedPrice = calculateTotalPrice(apartment as "nautilus" | "valefurado", arrDate, depDate);
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      apartment: formData.get('apartment'),
      arrival: formData.get('arrival'),
      departure: formData.get('departure'),
      message: formData.get('message')
    };

    try {
      // Pobieramy zmienne środowiskowe, które musisz dodać w ustawieniach
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        console.error('Brak konfiguracji EmailJS we wstrzykniętych zmiennych środowiskowych.');
        alert(`Funkcjonalność formularza jest włączona, ale brakuje kluczy EmailJS. Upewnij się, że dodałeś je w panelu Secrets i na pewno kliknąłeś "Apply changes". Spróbuj też przeładować stronę (F5).`);
        setStatus("idle");
        return;
      }

      const templateParams = {
        from_name: data.name,
        reply_to: data.email, // email klienta, warto użyć 'reply_to' w EmailJS by móc łatwo odpisywać naprawde
        phone: data.phone || 'Nie podano',
        apartment: data.apartment,
        arrival: data.arrival,
        departure: data.departure,
        message: data.message,
        to_email: 'barbara@rozek.pl'
      };

      await emailjs.send(serviceId, templateId, templateParams, publicKey);
      
      setStatus("success");
    } catch (error) {
      alert("Wystąpił błąd podczas wysyłania wiadomości.");
      setStatus("idle");
    }
  };

  return (
    <section id="contact" className="py-20 px-4 md:px-10 bg-white">
      <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex flex-col gap-8">
          <div>
            <h2 className="text-[32px] md:text-[42px] font-serif text-brand-navy mb-4 leading-[1.2]">
              {t("contact.title")}
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            <a href="https://wa.me/48600323472?text=Dzie%C5%84%20dobry%2C%20chcia%C5%82bym%20zapyta%C4%87%20o%20rezerwacj%C4%99%20apartamentu..." target="_blank" rel="noopener noreferrer">
              <Button asChild variant="secondary" className="gap-2 w-max bg-[#25D366] text-white hover:bg-[#20bd5a] rounded-full px-6 text-[14px]">
                <span className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  {t("contact.btns.whatsapp")}
                </span>
              </Button>
            </a>
            <a href="tel:+48600323472">
              <Button asChild variant="outline" className="gap-2 text-brand-navy border-brand-navy w-max rounded-full px-6 text-[14px]">
                <span className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  {t("contact.btns.call")}
                </span>
              </Button>
            </a>
            <a href="mailto:kontakt@silvercoast.com?subject=Zapytanie%20o%20rezerwacj%C4%99%20apartamentu&body=Dzie%C5%84%20dobry%2C%0A%0AChcia%C5%82bym%20zapyta%C4%87%20o%20rezerwacj%C4%99%20apartamentu.%0A%0AProsz%C4%99%20o%20informacj%C4%99%20o%20dost%C4%99pno%C5%9Bci%20w%20odpowiedzi%20na%20tego%20maila.">
              <Button asChild variant="outline" className="gap-2 text-brand-navy border-brand-navy w-max rounded-full px-6 text-[14px]">
                <span className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  {t("contact.btns.email")}
                </span>
              </Button>
            </a>
          </div>
        </div>

        <div>
          {status === "success" ? (
            <div className="text-center py-12 bg-slate-50 rounded-3xl">
              <div className="w-16 h-16 bg-brand-green/20 text-brand-green rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h3 className="text-2xl font-serif text-brand-navy mb-2">{t("contact.form.success")}</h3>
              <Button onClick={() => setStatus("idle")} className="mt-8 rounded-full">Wyślij kolejne zapytanie</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="block text-[13px] font-semibold text-brand-navy">{t("contact.form.name")} *</label>
                  <input required type="text" name="name" className="w-full p-[15px] border border-[#e0e0e0] rounded-[12px] font-sans text-[14px] focus:outline-none focus:border-brand-navy" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[13px] font-semibold text-brand-navy">{t("contact.form.email")} *</label>
                  <input required type="email" name="email" className="w-full p-[15px] border border-[#e0e0e0] rounded-[12px] font-sans text-[14px] focus:outline-none focus:border-brand-navy" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="block text-[13px] font-semibold text-brand-navy">{t("contact.form.apt")} *</label>
                  <select required name="apartment" 
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    className="w-full p-[15px] border border-[#e0e0e0] rounded-[12px] font-sans text-[14px] focus:outline-none focus:border-brand-navy bg-white appearance-none">
                    <option value="">Wybierz...</option>
                    <option value="nautilus">Nautilus Silvercoast C</option>
                    <option value="valefurado">Vale Furado</option>
                    <option value="any">Dowolny</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-[13px] font-semibold text-brand-navy">{t("contact.form.phone")}</label>
                  <input type="tel" name="phone" className="w-full p-[15px] border border-[#e0e0e0] rounded-[12px] font-sans text-[14px] focus:outline-none focus:border-brand-navy" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="block text-[13px] font-semibold text-brand-navy">{t("contact.form.arrival")} *</label>
                  <input required type="date" name="arrival"
                     value={arrival}
                     onChange={(e) => setArrival(e.target.value)}
                     className="w-full p-[15px] border border-[#e0e0e0] rounded-[12px] font-sans text-[14px] focus:outline-none focus:border-brand-navy" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[13px] font-semibold text-brand-navy">{t("contact.form.departure")} *</label>
                  <input required type="date" name="departure"
                    value={departure}
                    onChange={(e) => setDeparture(e.target.value)}
                    className="w-full p-[15px] border border-[#e0e0e0] rounded-[12px] font-sans text-[14px] focus:outline-none focus:border-brand-navy" />
                </div>
              </div>

              {estimatedPrice !== null && (
                <div className="bg-brand-sand/30 border border-brand-copper/30 rounded-[12px] p-4 my-2 text-brand-navy">
                   <div className="text-[13px] font-semibold mb-1 uppercase tracking-wide opacity-80">{t("contact.form.estimatedPrice")}</div>
                   <div className="text-2xl font-serif text-brand-copper">€{estimatedPrice}</div>
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-[13px] font-semibold text-brand-navy">{t("contact.form.msg")}</label>
                <textarea rows={4} name="message" className="w-full p-[15px] border border-[#e0e0e0] rounded-[12px] font-sans text-[14px] focus:outline-none focus:border-brand-navy resize-none" />
              </div>

              <div className="space-y-3 mt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input required type="checkbox" className="mt-1 w-5 h-5 rounded border-slate-300 text-brand-copper focus:ring-brand-copper" />
                  <span className="text-[12px] opacity-80 leading-[1.4] text-brand-navy">{t("contact.form.consent")}</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input required type="checkbox" className="mt-1 w-5 h-5 rounded border-slate-300 text-brand-copper focus:ring-brand-copper" />
                  <span className="text-[12px] opacity-80 leading-[1.4] text-brand-navy">{t("contact.form.rodo")}</span>
                </label>
              </div>

              <Button type="submit" size="lg" className="w-full mt-4 rounded-[12px]" disabled={status === "sending"}>
                {status === "sending" ? (t("contact.form.sending") || "Sending...") : t("contact.form.submit")}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
