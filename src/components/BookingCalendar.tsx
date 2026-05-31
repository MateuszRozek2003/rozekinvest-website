import { useState, useEffect } from 'react';
import { format, differenceInDays, eachDayOfInterval, parseISO } from 'date-fns';
import { pl, enUS, es, fr, de, pt } from 'date-fns/locale';
import { DayPicker, DateRange } from 'react-day-picker';
import 'react-day-picker/style.css';
import { Calendar as CalendarIcon, Clock, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

const locales: Record<string, any> = {
  pl,
  en: enUS,
  es,
  fr,
  de,
  pt
};

// Ceny testowe / cennik
import { calculateBasePrice, calculateTotalPrice, SEASONS } from '../utils/pricing';

export function BookingCalendar({ apartmentId, onClose }: { apartmentId: "nautilus" | "valefurado", onClose: () => void }) {
  const { t, language } = useLanguage();
  const dateLocale = locales[language] || pt;
  const [range, setRange] = useState<DateRange | undefined>();
  const [hoverDate, setHoverDate] = useState<Date | undefined>();
  const [status, setStatus] = useState<'idle' | 'loading'>('idle');
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);
  const [isLoadingDates, setIsLoadingDates] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRangeSelect = (newRange: DateRange | undefined) => {
    if (newRange?.from && newRange?.to) {
      try {
        const daysInInterval = eachDayOfInterval({ start: newRange.from, end: newRange.to });
        // Slices out checkout day if we want to allow overlapping arrivals/departures on same day
        const dayChecks = daysInInterval.slice(0, -1);
        const hasOverlap = dayChecks.some(day => 
          disabledDates.some(disabledDay => 
            disabledDay.toDateString() === day.toDateString()
          )
        );
        if (hasOverlap) {
          setErrorMessage("Ten przedział zawiera już zajęte daty. Wybierz wolny termin.");
          setRange(undefined);
          return;
        }
      } catch (e) {
        // Safe fallback
      }
    }
    setErrorMessage(null);
    setRange(newRange);
  };

  let effectiveFrom = range?.from;
  let effectiveTo = range?.to;
  
  if (effectiveFrom && !effectiveTo && hoverDate) {
    if (hoverDate > effectiveFrom) {
      effectiveTo = hoverDate;
    } else if (hoverDate < effectiveFrom) {
      effectiveTo = effectiveFrom;
      effectiveFrom = hoverDate;
    }
  }

  const nights = effectiveFrom && effectiveTo ? differenceInDays(effectiveTo, effectiveFrom) : 0;
  const basePrice = nights > 0 && effectiveFrom && effectiveTo ? calculateBasePrice(apartmentId, effectiveFrom, effectiveTo) : 0;
  const totalPrice = nights > 0 && effectiveFrom && effectiveTo ? calculateTotalPrice(apartmentId, effectiveFrom, effectiveTo) : 0;
  const pricePerNight = nights > 0 ? Math.round(basePrice / nights) : 0;

  // Pobierz zajęte daty przez API backendu (bezpieczne rozwiązanie unikane przez problem z permissions Firestore dla publicznych danych)
  useEffect(() => {
    async function fetchBookings() {
      try {
        const apiBase = import.meta.env.VITE_API_URL || "";
        const response = await fetch(`${apiBase}/api/bookings/${apartmentId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        let bookedDays: Date[] = [];
        
        if (data.bookings && Array.isArray(data.bookings)) {
          data.bookings.forEach((booking: any) => {
            if (booking.checkIn && booking.checkOut) {
              const start = parseISO(booking.checkIn);
              const end = parseISO(booking.checkOut);
              
              // Generuje wszystkie dni w przedziale pomiędzy przyjazdem a wyjazdem
              const daysInInterval = eachDayOfInterval({ start, end });
              // Usuwamy ostatni dzień z przedziału (dzień wyjazdu, ktoś inny może wtedy przyjechać)
              if (daysInInterval.length > 1) {
                daysInInterval.pop();
              }
              bookedDays = [...bookedDays, ...daysInInterval];
            }
          });
        }
        
        setDisabledDates(bookedDays);
      } catch (error) {
        console.error("Błąd podczas pobierania rezerwacji:", error);
      } finally {
        setIsLoadingDates(false);
      }
    }
    
    fetchBookings();
  }, [apartmentId]);

  const handleCheckout = async () => {
    if (!range?.from || !range?.to) return;
    setStatus('loading');

    try {
      const apiBase = import.meta.env.VITE_API_URL || "";
      const response = await fetch(`${apiBase}/api/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apartmentId,
          nights,
          totalPrice,
          checkIn: format(range.from, 'yyyy-MM-dd'),
          checkOut: format(range.to, 'yyyy-MM-dd'),
        }),
      });

      const data = await response.json();

      if (data.error) {
        setErrorMessage(t("booking.paymentError") + " " + data.error);
        setStatus('idle');
        return;
      }

      if (data.url) {
        // Stripe zwraca url do hostowanej strony płatności! Przekierowujemy tam klienta:
        // By default use window.open if inside iframe
        if (window.top !== window.self) {
          window.open(data.url, '_blank');
          setStatus('idle');
        } else {
          window.location.href = data.url;
        }
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(t("booking.serverError"));
      setStatus('idle');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-brand-navy/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl shadow-2xl relative w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row overflow-hidden"
      >
        {/* Lewa kolumna - Kalendarz */}
        <div className="p-8 md:w-2/3 border-r border-[#f0f0f0] calendar-container">
          <style>{`
            .calendar-container .rdp-day_selected, 
            .calendar-container .rdp-day_selected:focus-visible, 
            .calendar-container .rdp-day_selected:hover {
              background-color: var(--brand-navy) !important;
              color: white !important;
              font-weight: bold;
            }
            .dark .calendar-container .rdp-day_selected,
            .dark .calendar-container .rdp-day_selected:focus-visible, 
            .dark .calendar-container .rdp-day_selected:hover {
              background-color: #f8fafc !important;
              color: #000000 !important;
            }
            .calendar-container .rdp-day_range_start {
              border-top-left-radius: 50%;
              border-bottom-left-radius: 50%;
            }
            .calendar-container .rdp-day_range_end {
              border-top-right-radius: 50%;
              border-bottom-right-radius: 50%;
            }
            .calendar-container .rdp-day_range_middle {
              background-color: color-mix(in srgb, var(--brand-navy) 15%, transparent) !important;
              color: var(--brand-navy) !important;
              border-radius: 0;
            }
            .dark .calendar-container .rdp-day_range_middle {
              background-color: rgba(248, 250, 252, 0.15) !important;
              color: #f8fafc !important;
            }
            .dark .calendar-container .rdp-button:not(.rdp-day_selected) {
              color: #f8fafc;
            }
            .dark .calendar-container .rdp-button[disabled]:not(.rdp-day_selected) {
              color: #4b5563;
            }
          `}</style>
          <h2 className="text-2xl font-display font-semibold text-brand-navy mb-2">{t("booking.chooseDate")}</h2>
          <p className="text-slate-500 mb-6 text-sm">{t("booking.selectDates")}</p>
          
          <div className="flex justify-center bg-slate-50 p-4 rounded-2xl border border-[#e0e0e0]">
            <DayPicker
              mode="range"
              selected={range}
              onSelect={handleRangeSelect}
              onDayMouseEnter={(day) => setHoverDate(day)}
              onDayMouseLeave={() => setHoverDate(undefined)}
              modifiers={
                effectiveFrom && effectiveTo && !range?.to 
                ? {
                    hoverRange: { from: effectiveFrom, to: effectiveTo },
                    hoverRangeStart: effectiveFrom,
                    hoverRangeEnd: effectiveTo
                  }
                : {}
              }
              locale={dateLocale}
              disabled={disabledDates}
              className="font-sans"
              classNames={{
                today: 'font-bold text-brand-navy border border-brand-navy rounded-full',
              }}
              modifiersClassNames={{
                hoverRange: 'rdp-day_range_middle',
                hoverRangeStart: 'rdp-day_selected rdp-day_range_start',
                hoverRangeEnd: 'rdp-day_selected rdp-day_range_end'
              }}
            />
          </div>
        </div>

        {/* Prawa kolumna - Podsumowanie i płatność */}
        <div className="p-8 md:w-1/3 bg-slate-50 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-display font-semibold text-brand-navy mb-6">{t("booking.summary")}</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <CalendarIcon className="w-5 h-5 text-brand-copper mt-0.5" />
                <div>
                  <div className="text-sm text-slate-500">{t("booking.checkIn")}</div>
                  <div className="font-semibold text-brand-navy">
                    {effectiveFrom ? format(effectiveFrom, 'dd MMMM yyyy', { locale: dateLocale }) : t("booking.none")}
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Clock className="w-5 h-5 text-brand-copper mt-0.5" />
                <div>
                  <div className="text-sm text-slate-500">{t("booking.checkOut")}</div>
                  <div className="font-semibold text-brand-navy">
                    {effectiveTo ? format(effectiveTo, 'dd MMMM yyyy', { locale: dateLocale }) : t("booking.none")}
                  </div>
                </div>
              </div>
            </div>

            <div className="my-8 border-t border-[#e0e0e0]" />

            <div className="space-y-3">
              <div className="flex justify-between text-slate-500">
                <span>{pricePerNight} € x {nights} {t("booking.nights")}</span>
                <span>{basePrice} €</span>
              </div>
              {nights > 0 && (
                <div className="flex justify-between text-slate-500 pb-2 border-b border-slate-100">
                  <span>{t("booking.cleaningFee") || "Opłata za sprzątanie"}</span>
                  <span>140 €</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-brand-navy text-xl pt-2">
                <span>{t("booking.total")}</span>
                <span>{totalPrice} €</span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
                {errorMessage}
              </div>
            )}
            <button 
              onClick={handleCheckout}
              disabled={!range?.from || !range?.to || nights <= 0 || status === 'loading'}
              className="w-full bg-brand-navy text-white rounded-full py-4 font-semibold hover:bg-brand-copper transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {status === 'loading' ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  {t("booking.goToPayment")}
                </>
              )}
            </button>
            <p className="text-xs text-center text-slate-400 mt-4 leading-relaxed">
              {t("booking.securePayment")} <br/>
              <span className="font-semibold text-slate-500">Stripe</span>
            </p>
          </div>
        </div>
        
        {/* Przycisk zamknięcia */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 md:right-[33%] md:mr-4 z-10 w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center text-brand-navy hover:text-brand-copper transition-colors"
        >
          ✕
        </button>
      </motion.div>
    </div>
  );
}
