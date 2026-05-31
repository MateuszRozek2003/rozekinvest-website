import { useLanguage } from "../context/LanguageContext";
import { motion } from "motion/react";
import { Users, Heart, Briefcase, Leaf } from "lucide-react";

export function TargetAudience() {
  const { t } = useLanguage();

  const blocks = [
    { key: "family", icon: <Users className="w-8 h-8 text-brand-copper" /> },
    { key: "couples", icon: <Heart className="w-8 h-8 text-brand-copper" /> },
    { key: "remote", icon: <Briefcase className="w-8 h-8 text-brand-copper" /> },
    { key: "quiet", icon: <Leaf className="w-8 h-8 text-brand-copper" /> },
  ];

  return (
    <section className="py-16 lg:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 lg:mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-serif text-brand-navy mb-4">
            {t("who.title")}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {blocks.map((b, idx) => (
            <motion.div
              key={b.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1 }}
              className="bg-brand-sand p-8 rounded-[24px] border border-black/5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all duration-300 flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 bg-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {b.icon}
              </div>
              <h3 className="text-xl font-serif text-brand-navy mb-4">
                {t(`who.${b.key}.title`)}
              </h3>
              <p className="text-[14px] text-brand-navy/80 font-light leading-relaxed">
                {t(`who.${b.key}.text`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
