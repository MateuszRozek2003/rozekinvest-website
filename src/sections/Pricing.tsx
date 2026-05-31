import { useLanguage } from "../context/LanguageContext";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import { SEASONS } from "../utils/pricing";

export function Pricing() {
  const { t } = useLanguage();
  
  // Sort seasons by startDate for chronological display
  const sortedSeasons = [...SEASONS].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  const formatPriceRow = (s: typeof SEASONS[0], apartmentId: 'nautilus' | 'valefurado', idx: number) => {
    const daily = apartmentId === 'nautilus' ? s.priceNautilus : s.priceValeFurado;
    const weekly = apartmentId === 'nautilus' ? s.priceNautilusWeek : s.priceValeFuradoWeek;
    
    return (
      <div key={`${s.key}-${idx}`} className={`flex flex-row items-center justify-between pb-3 ${idx !== sortedSeasons.length - 1 ? 'border-b border-black/5' : ''}`}>
        <div className="flex flex-col pr-4">
          <span className="text-[15px] font-medium text-brand-navy">
             {t(`pricing.seasonsNautilus.${s.key}.name`) || s.name}
          </span>
          <span className="text-[13px] text-slate-500">
             {s.startDate.replace('2025-', '25-').replace('2026-', '26-').replace('2027-', '27-')} / {s.endDate.replace('2025-', '25-').replace('2026-', '26-').replace('2027-', '27-')}
          </span>
        </div>
        <div className="flex gap-4 sm:gap-10 text-right shrink-0">
          <div className="w-[70px] sm:w-[80px]">
            <div className="text-[15px] font-medium text-brand-navy">€{weekly}</div>
            <div className="text-[12px] text-slate-500">{t("common.perWeek") || "/ tydzień"}</div>
          </div>
          <div className="w-[60px]">
            <div className="text-[15px] font-medium text-brand-copper">€{daily}</div>
             <div className="text-[12px] text-slate-500">{t("common.perDay") || "/ dzień"}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="pricing" className="py-16 lg:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 lg:mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-serif text-brand-navy mb-4">
            {t("pricing.title")}
          </h2>
          <p className="text-lg text-slate-600 font-light max-w-2xl mx-auto">
            {t("pricing.subtitle")}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Apartment 1 */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-brand-sand rounded-[24px] p-6 md:p-8 flex flex-col shadow-sm overflow-x-auto"
          >
            <h3 className="text-2xl font-serif text-brand-navy mb-6 text-center">Nautilus Silver Coast</h3>
            <div className="min-w-[320px] flex flex-col gap-4">
              {sortedSeasons.map((s, idx) => formatPriceRow(s, 'nautilus', idx))}
            </div>
          </motion.div>

          {/* Apartment 2 */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[#faf8f5] rounded-[24px] p-6 md:p-8 flex flex-col shadow-sm border border-black/5 overflow-x-auto"
          >
            <h3 className="text-2xl font-serif text-brand-navy mb-6 text-center">Vale Furado</h3>
            <div className="min-w-[320px] flex flex-col gap-4">
              {sortedSeasons.map((s, idx) => formatPriceRow(s, 'valefurado', idx))}
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-brand-cream p-8 rounded-3xl space-y-3 max-w-4xl mx-auto"
        >
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-brand-copper shrink-0 mt-0.5" />
              <p className="text-slate-700 text-sm md:text-base font-light">
                {t(`pricing.notes.${i}`)}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
