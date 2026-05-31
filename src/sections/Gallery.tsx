import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { nautilusApartmentImages, valefuradoSurroundingsImages } from "../data/images";

export function Gallery() {
  const { t } = useLanguage();
  const [lightboxData, setLightboxData] = useState<{ index: number, gallery: string[] } | null>(null);

  // Using high-quality real photos for the main gallery
  const nautilusImages = nautilusApartmentImages;

  // Images for Vale Furado from Imgur + New user images
  const valeFuradoImages = valefuradoSurroundingsImages;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxData) return;
      if (e.key === "ArrowLeft") prevImage(e as any);
      if (e.key === "ArrowRight") nextImage(e as any);
      if (e.key === "Escape") setLightboxData(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxData]);

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!lightboxData) return;
    setLightboxData({
      ...lightboxData,
      index: (lightboxData.index + 1) % lightboxData.gallery.length,
    });
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!lightboxData) return;
    setLightboxData({
      ...lightboxData,
      index: (lightboxData.index - 1 + lightboxData.gallery.length) % lightboxData.gallery.length,
    });
  };

  return (
    <section id="gallery" className="py-16 lg:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Gallery */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 lg:mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-serif text-brand-navy mb-4">
            {t("gallery.title")}
          </h2>
        </motion.div>

        {/* Nautilus Gallery Heading */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 lg:mb-12"
        >
          <h3 className="text-2xl md:text-4xl font-serif text-brand-navy mb-2">
            {t("gallery.nautilus")}
          </h3>
          <div className="w-16 h-1 bg-brand-gold mx-auto opacity-50 rounded-full" />
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-20">
          {nautilusImages.map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative aspect-[4/3] overflow-hidden rounded-2xl cursor-pointer group"
              onClick={() => setLightboxData({ index: idx, gallery: nautilusImages })}
            >
              <img 
                src={img} 
                alt={`Apartament Nautilus - wnętrze ${idx + 1}`} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-colors duration-300" />
            </motion.div>
          ))}
        </div>

        {/* Vale Furado Gallery */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 lg:mb-12"
        >
          <h3 className="text-2xl md:text-4xl font-serif text-brand-navy mb-2">
            {t("gallery.valeFurado")}
          </h3>
          <div className="w-16 h-1 bg-brand-gold mx-auto opacity-50 rounded-full" />
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {valeFuradoImages.map((img, idx) => (
            <motion.div
              key={`vale-${idx}`}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative aspect-[4/3] overflow-hidden rounded-2xl cursor-pointer group"
              onClick={() => setLightboxData({ index: idx, gallery: valeFuradoImages })}
            >
              <img 
                src={img} 
                alt={`Okolice Vale Furado - widok ${idx + 1}`} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-colors duration-300" />
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightboxData && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/95 backdrop-blur-sm p-4"
            onClick={() => setLightboxData(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-10"
              onClick={() => setLightboxData(null)}
            >
              <X className="w-8 h-8" />
            </button>
            
            <button
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-2 z-10"
              onClick={(e) => { e.stopPropagation(); prevImage(e as any); }}
            >
              <ChevronLeft className="w-8 h-8 sm:w-10 sm:h-10 drop-shadow-md" />
            </button>

            <button
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-2 z-10"
              onClick={(e) => { e.stopPropagation(); nextImage(e as any); }}
            >
              <ChevronRight className="w-8 h-8 sm:w-10 sm:h-10 drop-shadow-md" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              key={lightboxData.index}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.x > 80) prevImage();
                else if (info.offset.x < -80) nextImage();
              }}
              className="relative max-w-full max-h-full flex flex-col items-center justify-center w-full h-full cursor-grab active:cursor-grabbing"
            >
              <img 
                src={lightboxData.gallery[lightboxData.index]} 
                alt={`Zdjęcie w powiększeniu ${lightboxData.index + 1}`} 
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl pointer-events-none" 
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
