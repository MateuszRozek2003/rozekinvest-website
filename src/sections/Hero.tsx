import { useLanguage } from "../context/LanguageContext";
import { Button } from "../components/ui/Button";
import { Waves, Droplet, Wifi, ChefHat, Users, Leaf } from "lucide-react";
// Since framer-motion is usually implied when using motion, I will use motion/react
import { motion } from "motion/react";

export function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[90vh] flex items-center pt-32 sm:pt-40 pb-20 overflow-hidden">
      {/* Background Image / Video */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-black">
<img src="/tlo.jpg" className="absolute top-1/2 left-1/2 min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover" alt="Główne zdjęcie basenu" />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-serif text-white font-medium max-w-4xl leading-tight"
        >
          {t("hero.title")}
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-4 sm:mt-6 text-[15px] sm:text-lg md:text-xl text-white max-w-2xl font-light px-2"
        >
          {t("hero.subtitle")}
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          <Button onClick={() => document.getElementById('apartments')?.scrollIntoView()} size="lg">
            {t("hero.btnApartments")}
          </Button>
          <Button onClick={() => document.getElementById('pricing')?.scrollIntoView()} variant="outline" className="border-white text-white hover:bg-white hover:text-brand-navy border" size="lg">
            {t("hero.btnPricing")}
          </Button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-12 sm:mt-16 flex flex-wrap justify-center gap-2 sm:gap-4 text-white text-[11px] sm:text-[12px] font-medium"
        >
          <div className="flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-sm"><Waves className="w-4 h-4 text-white" /> {t("hero.tags.sea")}</div>
          <div className="flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-sm"><Droplet className="w-4 h-4 text-white" /> {t("hero.tags.pool")}</div>
          <div className="flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-sm"><Wifi className="w-4 h-4" /> {t("hero.tags.wifi")}</div>
          <div className="flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-sm"><ChefHat className="w-4 h-4" /> {t("hero.tags.kitchen")}</div>
          <div className="flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-sm"><Users className="w-4 h-4" /> {t("hero.tags.couples")}</div>
          <div className="flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-sm"><Leaf className="w-4 h-4 text-white" /> {t("hero.tags.quiet")}</div>
        </motion.div>
      </div>
    </section>
  );
}
