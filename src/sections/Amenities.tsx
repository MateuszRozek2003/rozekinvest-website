import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { motion } from "motion/react";
import { Droplet, Waves, Wifi, ChefHat, Sun, WashingMachine, UtensilsCrossed, MonitorPlay, Coffee, Tv, Bath, CarFront, Leaf, Briefcase, Heart, BookHeart } from "lucide-react";

export function Amenities() {
  const { t } = useLanguage();

  const iconMap: Record<string, React.ReactNode> = {
    pool: <Droplet className="w-6 h-6" />,
    sea: <Waves className="w-6 h-6" />,
    wifi: <Wifi className="w-6 h-6" />,
    kitchen: <ChefHat className="w-6 h-6" />,
    terrace: <Sun className="w-6 h-6" />,
    washing: <WashingMachine className="w-6 h-6" />,
    dishwasher: <UtensilsCrossed className="w-6 h-6" />,
    oven: <ChefHat className="w-6 h-6" />,
    coffee: <Coffee className="w-6 h-6" />,
    towels: <Bath className="w-6 h-6" />,
    quiet: <Leaf className="w-6 h-6" />,
    family: <Heart className="w-6 h-6" />,
    couples: <BookHeart className="w-6 h-6" />
  };

  const amenities = Object.keys(iconMap);

  return (
    <section className="py-16 lg:py-24 bg-brand-cream relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 lg:mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-serif text-brand-navy mb-4 max-w-3xl mx-auto">
            {t("amenities.title")}
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {amenities.map((item, idx) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white p-6 rounded-[20px] flex flex-col items-center text-center shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-[#f0f0f0] hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all group"
            >
              <div className="text-brand-copper mb-4 group-hover:scale-110 transition-transform">
                {iconMap[item]}
              </div>
              <p className="text-brand-navy font-medium text-[13px] sm:text-[14px]">
                {t(`amenities.items.${item}`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
