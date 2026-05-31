import { useLanguage } from "../context/LanguageContext";
import { motion } from "motion/react";
import { Info } from "lucide-react";

export function Rules() {
  const { t } = useLanguage();
  const items: string[] = t("rules.items") || [];

  return (
    <section className="py-16 lg:py-24 bg-brand-cream relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 lg:mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-serif text-brand-navy mb-4">
            {t("rules.title")}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-start gap-4 bg-white p-6 rounded-[20px] border border-black/5 shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
              >
                <div className="w-8 h-8 rounded-full bg-brand-sand flex items-center justify-center shrink-0">
                  <Info className="w-4 h-4 text-brand-copper" />
                </div>
                <span className="text-brand-navy/80 font-light leading-relaxed text-[14px]">
                  {item}
                </span>
              </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
}
