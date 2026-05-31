import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LanguageProvider } from "./context/LanguageContext";
import { Navbar } from "./components/Navbar";
import { Hero } from "./sections/Hero";
import { Emotional } from "./sections/Emotional";
import { Apartments } from "./sections/Apartments";
import { Pricing } from "./sections/Pricing";
import { Amenities } from "./sections/Amenities";
import { TargetAudience } from "./sections/TargetAudience";
import { Gallery } from "./sections/Gallery";
import { Location } from "./sections/Location";
import { Contact } from "./sections/Contact";
import { Rules } from "./sections/Rules";
import { Footer } from "./components/Footer";
import { ApartmentDetailsView } from "./sections/ApartmentDetailsView";
import { ContactModal } from "./sections/Apartments";
import { Chatbot } from "./components/Chatbot";
import { BookingCalendar } from "./components/BookingCalendar";

import { useLanguage } from "./context/LanguageContext";

function MobileFooter({ onNavigate }: { onNavigate?: (hash: string) => void }) {
  const { t } = useLanguage();
  return (
    <div className="md:hidden fixed bottom-6 left-6 bg-white px-4 py-2.5 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-brand-sand flex gap-3 items-center z-[80] w-max">
      <a 
        href="https://wa.me/48600323472?text=Dzie%C5%84%20dobry%2C%20chcia%C5%82bym%20zapyta%C4%87%20o%20rezerwacj%C4%99%20apartamentu..." 
        target="_blank" 
        rel="noopener noreferrer"
        className="bg-brand-whatsapp text-white p-2 rounded-full text-[13px] font-semibold flex items-center justify-center hover:opacity-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M17 10c0-1.7-1.3-3-3-3H10c-1.7 0-3 1.3-3 3v4c0 1.7 1.3 3 3 3h4c1.7 0 3-1.3 3-3v-4z"/><path d="m14 11-2.5 2.5L10 12"/></svg>
      </a>
      <button 
        onClick={() => {
          if (onNavigate) onNavigate('#contact');
          else {
             const el = document.getElementById('contact');
             if (el) {
               const y = el.getBoundingClientRect().top + window.scrollY - 80;
               window.scrollTo({ top: y, behavior: 'smooth' });
             } else window.location.hash = '#contact';
          }
        }}
        className="bg-brand-navy text-white px-5 py-2 rounded-full text-[13px] font-semibold"
      >
        {t("nav.ask")}
      </button>
    </div>
  );
}

function PaymentSuccessScreen({ onClose }: { onClose: () => void }) {
  const [timeLeft, setTimeLeft] = useState(10);
  
  useEffect(() => {
    if (timeLeft <= 0) {
      onClose();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onClose]);

  return (
    <div className="fixed inset-0 z-[100] bg-brand-navy/95 backdrop-blur-sm flex items-center justify-center p-4">
       <motion.div 
         initial={{ scale: 0.9, opacity: 0 }}
         animate={{ scale: 1, opacity: 1 }}
         className="bg-white p-8 md:p-12 rounded-3xl max-w-lg w-full text-center shadow-2xl"
       >
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
             <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <h2 className="text-3xl font-display font-medium text-brand-navy mb-4">
            Dziękujemy! Otrzymaliśmy płatność.
          </h2>
          <p className="text-brand-navy/70 text-lg mb-8">
            Twoja rezerwacja jest teraz potwierdzona i została opłacona. Wkrótce otrzymasz email z dodatkowymi informacjami dotyczącymi pobytu (w tym PIN do zamka, jeśli dotyczy).
          </p>
          <div className="text-sm font-medium text-brand-navy/50 bg-brand-sand/30 py-3 rounded-full">
            Przekierowanie na stronę główną za <span className="text-brand-navy font-bold">{timeLeft}</span> sekund...
          </div>
          <button onClick={onClose} className="mt-8 bg-brand-navy text-white px-8 py-3 rounded-full font-medium hover:bg-opacity-90 transition-colors w-full">
            Wróć na stronę główną teraz
          </button>
       </motion.div>
    </div>
  );
}

export default function App() {
  const [viewApartment, setViewApartment] = useState<string | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [contactModalApt, setContactModalApt] = useState<{isOpen: boolean, apt: string}>({ isOpen: false, apt: "nautilus" });
  const [bookingCalendarApt, setBookingCalendarApt] = useState<{isOpen: boolean, apt: string}>({ isOpen: false, apt: "nautilus" });
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get('payment');
    if (payment) {
      setPaymentStatus(payment);
    }
  }, []);

  const handleClosePaymentStatus = () => {
    setPaymentStatus(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('payment');
    window.history.replaceState({}, '', url.toString());
  };

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (e.state) {
        if (e.state.contactModal) {
          setContactModalApt({ isOpen: true, apt: e.state.contactModal });
        } else {
          setContactModalApt(prev => ({ ...prev, isOpen: false }));
        }

        if (e.state.bookingCalendar) {
          setBookingCalendarApt({ isOpen: true, apt: e.state.bookingCalendar });
        } else {
          setBookingCalendarApt(prev => ({ ...prev, isOpen: false }));
        }

        if (!e.state.contactModal && !e.state.bookingCalendar) {
          if (e.state.viewApartment) {
            setViewApartment(e.state.viewApartment);
          } else {
            setViewApartment(null);
            setTimeout(() => {
              document.documentElement.style.scrollBehavior = 'auto';
              window.scrollTo(0, scrollPosition);
              document.documentElement.style.scrollBehavior = '';
            }, 50);
          }
        }
      } else {
        setContactModalApt(prev => ({ ...prev, isOpen: false }));
        setBookingCalendarApt(prev => ({ ...prev, isOpen: false }));
        setViewApartment(null);
        setTimeout(() => {
          document.documentElement.style.scrollBehavior = 'auto';
          window.scrollTo(0, scrollPosition);
          document.documentElement.style.scrollBehavior = '';
        }, 50);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [scrollPosition]);

  const handleOpenDetails = (id: string) => {
    setScrollPosition(window.scrollY);
    setViewApartment(id);
    window.history.pushState({ viewApartment: id }, '', `#apartment-${id}`);
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    document.documentElement.style.scrollBehavior = '';
  };

  const handleCloseDetails = () => {
    window.history.back();
  };

  const handleOpenContact = (id: string) => {
    setContactModalApt({ isOpen: true, apt: id });
    const currentState = window.history.state || {};
    window.history.pushState({ ...currentState, contactModal: id }, '', `#contact-${id}`);
  };

  const handleCloseContact = () => {
    window.history.back();
  };

  const handleOpenBooking = (id: string) => {
    setBookingCalendarApt({ isOpen: true, apt: id });
    const currentState = window.history.state || {};
    window.history.pushState({ ...currentState, bookingCalendar: id }, '', `#booking-${id}`);
  };

  const handleCloseBooking = () => {
    window.history.back();
  };

  const handleNavigate = (hash: string) => {
    window.history.pushState(null, '', hash || "/");
    if (viewApartment) {
      setViewApartment(null);
      // Wait for exit animation and unmount
      setTimeout(() => {
        if (hash === "" || hash === "#" || hash === "/") {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const el = document.querySelector(hash);
          if (el) {
            const y = el.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }
      }, 500); 
    } else {
      if (hash === "" || hash === "#" || hash === "/") {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const el = document.querySelector(hash);
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col font-sans relative overflow-x-hidden">
        <Navbar onNavigate={handleNavigate} />
        <main className="flex-1 relative">
          <AnimatePresence mode="wait">
            {viewApartment ? (
              <motion.div 
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                <ApartmentDetailsView 
                  aptId={viewApartment} 
                  onBack={handleCloseDetails} 
                  onContact={handleOpenContact}
                  onBook={handleOpenBooking}
                />
              </motion.div>
            ) : (
              <motion.div 
                key="home"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
              >
                <Hero />
                <Emotional />
                <Apartments 
                  onViewDetails={handleOpenDetails} 
                  onContact={handleOpenContact} 
                  onBook={handleOpenBooking}
                />
                <Amenities />
                <Pricing />
                <TargetAudience />
                <Gallery />
                <Location />
                <Contact />
                <Rules />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
        <Footer onNavigate={handleNavigate} />
        <MobileFooter onNavigate={handleNavigate} />
        <ContactModal 
          isOpen={contactModalApt.isOpen} 
          onClose={handleCloseContact} 
          initialApartment={contactModalApt.apt} 
        />
        <AnimatePresence>
          {bookingCalendarApt.isOpen && (
            <BookingCalendar 
              apartmentId={bookingCalendarApt.apt} 
              onClose={handleCloseBooking} 
            />
          )}
        </AnimatePresence>
        <Chatbot />
        
        <AnimatePresence>
          {paymentStatus === 'success' && (
            <PaymentSuccessScreen onClose={handleClosePaymentStatus} />
          )}
        </AnimatePresence>
      </div>
    </LanguageProvider>
  );
}

// Trigger commit to correct Github repository