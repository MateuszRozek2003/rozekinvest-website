import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../context/LanguageContext";
import { ChevronLeft, ChevronRight, Check, Users, Bed, Bath, Droplet, Wifi, Coffee, Car, Tv, Wind, Waves, MapPin, Camera, Utensils, Landmark, Footprints, Copy } from "lucide-react";
import { Button } from "../components/ui/Button";
import { nautilusApartmentImages, nautilusSurroundingsImages, valefuradoApartmentImages, valefuradoSurroundingsImages } from "../data/images";
import { SEASONS } from "../utils/pricing";

interface ApartmentDetailsViewProps {
  aptId: string;
  onBack: () => void;
  onContact: (aptId: string) => void;
  onBook: (aptId: string) => void;
}

export function ApartmentDetailsView({ aptId, onBack, onContact, onBook }: ApartmentDetailsViewProps) {
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [aptId]);

  const aptData: Record<string, any> = {
    nautilus: {
      id: "nautilus",
      images: nautilusApartmentImages,
      key: "apartments.nautilus",
      price: "od 450 PLN / noc",
      surroundings: nautilusSurroundingsImages,
      location: {
        name: "Nautilus",
        address: [
          "Rua Da Boavista s/n",
          "Serra dos Mangues",
          "2460-697 São Martinho do Porto",
          "Portugal"
        ],
        coordinates: "39°30'59.5\"N 9°07'47.1\"W",
        gps: "39.5165241, -9.1297446",
        query: "https://maps.google.com/?q=39.5165241,-9.1297446",
        embed: "https://maps.google.com/maps?q=39.5165241,-9.1297446&t=k&z=14&ie=UTF8&iwloc=&output=embed"
      },
      amenities: [
        { icon: <Users className="w-5 h-5" />, label: `4 ${t("common.people")}` },
        { icon: <Bed className="w-5 h-5" />, label: `2 ${t("common.bedrooms")}` },
        { icon: <Bath className="w-5 h-5" />, label: `1 ${t("common.bathroom")}` },
        { icon: <Waves className="w-5 h-5" />, label: t("common.pool") },
        { icon: <Wifi className="w-5 h-5" />, label: t("common.wifi") },
        { icon: <Car className="w-5 h-5" />, label: t("common.parking") },
        { icon: <Wind className="w-5 h-5" />, label: t("common.ac") },
        { icon: <Coffee className="w-5 h-5" />, label: t("common.kitchen") },
        { icon: <Tv className="w-5 h-5" />, label: t("common.tv") }
      ]
    },
    valefurado: {
      id: "valefurado",
      images: valefuradoApartmentImages,
      surroundings: valefuradoSurroundingsImages,
      location: {
        name: "Vale Furado",
        address: [
          "Vale Furado",
          "2445 Pataias",
          "Leiria",
          "Portugal"
        ],
        coordinates: "39°41'32.3\"N 9°03'05.6\"W",
        gps: "39.6923061, -9.0515559",
        query: "https://maps.google.com/?q=39.6923061,-9.0515559",
        embed: "https://maps.google.com/maps?q=39.6923061,-9.0515559&t=k&z=14&ie=UTF8&iwloc=&output=embed"
      },
      key: "apartments.valefurado",
      price: "od 380 PLN / noc",
      amenities: [
        { icon: <Users className="w-5 h-5" />, label: `4 ${t("common.people")}` },
        { icon: <Bed className="w-5 h-5" />, label: `2 ${t("common.bedrooms")}` },
        { icon: <Bath className="w-5 h-5" />, label: `1 ${t("common.bathroom")}` },
        { icon: <Waves className="w-5 h-5" />, label: t("common.pool") },
        { icon: <Wifi className="w-5 h-5" />, label: t("common.wifi") },
        { icon: <Car className="w-5 h-5" />, label: t("common.parking") },
        { icon: <Wind className="w-5 h-5" />, label: t("common.ac") },
        { icon: <Coffee className="w-5 h-5" />, label: t("common.kitchen") },
        { icon: <Tv className="w-5 h-5" />, label: t("common.tv") }
      ]
    }
  };

  const apt = aptData[aptId];
  const [currentImg, setCurrentImg] = useState(0);
  const [lightboxImg, setLightboxImg] = useState<{ index: number, gallery: string[] } | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const nextImg = () => setCurrentImg((prev) => (prev + 1) % apt.images.length);
  const prevImg = () => setCurrentImg((prev) => (prev - 1 + apt.images.length) % apt.images.length);
  
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!apt) return null;

  const sortedSeasons = [...SEASONS].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());


  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-brand-cream min-h-screen pt-24 pb-16 lg:pb-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-brand-navy hover:text-brand-copper font-medium transition-colors mb-8"
        >
          <ChevronLeft className="w-5 h-5" />
          {t("common.backToList")}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-10 lg:mb-16">
          {/* Main Image Carousel */}
          <div className="h-[300px] sm:h-[400px] lg:h-[600px] rounded-[32px] overflow-hidden shadow-sm relative bg-slate-100 group cursor-pointer" onClick={() => setLightboxImg({ index: currentImg, gallery: apt.images })}>
            <AnimatePresence mode="wait">
              <motion.img 
                key={currentImg}
                src={apt.images[currentImg]} 
                alt={t(`${apt.key}.name`)} 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.x > 50) prevImg();
                  else if (info.offset.x < -50) nextImg();
                }}
                className="absolute inset-0 w-full h-full object-contain p-4 cursor-grab active:cursor-grabbing" 
              />
            </AnimatePresence>

            {/* Arrows */}
            <div className="absolute inset-x-0 h-full flex items-center justify-between px-4 pointer-events-none z-10">
              <button 
                onClick={(e) => { e.stopPropagation(); prevImg(); }}
                className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center text-brand-navy hover:bg-white transition-colors pointer-events-auto opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); nextImg(); }}
                className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center text-brand-navy hover:bg-white transition-colors pointer-events-auto opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Indicators */}
            <div className="absolute bottom-6 inset-x-0 flex justify-center gap-2 z-10">
              {apt.images.map((_: any, i: number) => (
                <button 
                  key={i} 
                  onClick={() => setCurrentImg(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === currentImg ? 'bg-brand-navy w-4' : 'bg-brand-navy/30 hover:bg-brand-navy/50'}`}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-brand-navy mb-4">
              {t(`${apt.key}.name`)}
            </h1>
            <div className="text-[14px] text-brand-copper uppercase font-semibold tracking-wider mb-6">
              {t(`${apt.key}.location`)}
            </div>
            
            <p className="text-base sm:text-lg text-slate-600 font-light leading-relaxed mb-6 sm:mb-8">
              {t(`${apt.key}.desc`)}
            </p>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#f0f0f0] mb-8">
              <div className="text-sm text-slate-500 mb-1">{t("common.price")}</div>
              <div className="text-3xl font-serif text-brand-navy">{t(`${apt.key}.priceRange`)}</div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button onClick={() => onBook(apt.id)} className="w-max px-8 py-4 rounded-full text-lg bg-brand-navy hover:bg-brand-copper transition-colors">
                {t("common.bookOnline")}
              </Button>
              <Button onClick={() => onContact(apt.id)} className="w-max px-8 py-4 rounded-full text-lg bg-white text-brand-navy border border-brand-navy hover:bg-brand-sand transition-colors">
                {t(`${apt.key}.btnAsk`)}
              </Button>
              <Button variant="outline" onClick={() => {
                document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
              }} className="w-max px-8 py-4 rounded-full text-lg">
                Zdjęcia apartamentu
              </Button>
            </div>
          </div>
        </div>

        <div className="mb-10 lg:mb-16">
          <h2 className="text-3xl font-serif text-brand-navy mb-8">{t("common.amenities")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {apt.amenities.map((amenity: any, idx: number) => (
              <div key={idx} className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-[#f0f0f0]">
                <div className="text-brand-copper bg-brand-sand/30 p-2 rounded-lg">
                  {amenity.icon}
                </div>
                <span className="font-medium text-brand-navy">{amenity.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-10 lg:mb-16">
          <h2 className="text-3xl font-serif text-brand-navy mb-8">{t("pricing.title")}</h2>
          <div className="bg-white rounded-[24px] p-6 md:p-8 flex flex-col shadow-sm overflow-x-auto border border-[#f0f0f0] max-w-4xl mx-auto">
            <div className="min-w-[320px] flex flex-col gap-4">
              {sortedSeasons.map((s, idx) => {
                const daily = aptId === 'nautilus' ? s.priceNautilus : s.priceValeFurado;
                const weekly = aptId === 'nautilus' ? s.priceNautilusWeek : s.priceValeFuradoWeek;
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
              })}
            </div>
            <div className="mt-8 pt-6 border-t border-[#f0f0f0] space-y-3">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-brand-copper shrink-0 mt-0.5" />
                  <p className="text-slate-700 text-sm md:text-base font-light">
                    {t(`pricing.notes.${i}`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-10 lg:mb-16">
          <h2 className="text-3xl font-serif text-brand-navy mb-8">{t("location.title")}</h2>
          <div className="flex flex-col lg:flex-row gap-8 items-stretch">
            {/* POIs */}
            <div className="w-full lg:w-1/2 bg-white p-8 rounded-[24px] border border-[#f0f0f0]">
              <div className="space-y-8">
                {t(`location.pois.${aptId}`) && Array.isArray(t(`location.pois.${aptId}`)) && (t(`location.pois.${aptId}`) as any[]).map((poi: any, index: number) => {
                  const icons = aptId === 'nautilus' 
                    ? [Waves, Footprints, Camera, Utensils] 
                    : [Waves, Camera, Utensils, Landmark];
                  const Icon = icons[index % icons.length];
                  const colors = [
                    "bg-blue-50 text-blue-600",
                    "bg-emerald-50 text-emerald-600",
                    "bg-orange-50 text-orange-600",
                    "bg-rose-50 text-rose-600",
                    "bg-purple-50 text-purple-600"
                  ];
                  return (
                    <div key={index} className="flex gap-4 items-start">
                      <div className={`w-10 h-10 rounded-full ${colors[index % colors.length]} flex items-center justify-center shrink-0`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-brand-navy mb-1">{poi.title}</h4>
                        <p className="text-slate-600 font-light mb-2">{poi.desc}</p>
                        <p className="text-xs text-slate-400 font-mono">{poi.address}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Map */}
            <div className="w-full lg:w-1/2 h-[300px] sm:h-[400px] lg:h-auto rounded-[24px] overflow-hidden shadow-sm relative bg-slate-100">
              <iframe 
                src={apt.location.embed} 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
          
          <div className="mt-8 bg-white p-6 rounded-[24px] border border-[#f0f0f0] flex flex-col sm:flex-row items-center justify-between gap-4">
             <div className="flex flex-col">
               <span className="text-sm font-semibold text-brand-navy mb-1">{t("location.gps")}</span>
               <div className="flex gap-4 flex-wrap">
                 <button onClick={() => handleCopy(apt.location.coordinates)} className="flex items-center gap-2 text-slate-600 hover:text-brand-navy transition-colors font-mono text-sm">
                   {apt.location.coordinates}
                   {copied === apt.location.coordinates ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                 </button>
                 <button onClick={() => handleCopy(apt.location.gps)} className="flex items-center gap-2 text-slate-500 hover:text-brand-navy transition-colors font-mono text-xs">
                   {apt.location.gps}
                   {copied === apt.location.gps ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                 </button>
               </div>
             </div>
             <Button onClick={() => window.open(apt.location.query, "_blank", "noopener,noreferrer")} variant="outline" className="w-max border-brand-navy text-brand-navy">
                {t("location.btn")}
             </Button>
          </div>
        </div>

        <div id="gallery" className="mb-10 lg:mb-16">
          <h2 className="text-3xl font-serif text-brand-navy mb-8">{t("gallery.title") || "Galeria"}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {apt.images.map((imgVal: string, idx: number) => (
              <div 
                key={idx} 
                className="relative h-48 md:h-64 rounded-2xl overflow-hidden group bg-slate-100/50 cursor-pointer"
                onClick={() => setLightboxImg({ index: idx, gallery: apt.images })}
              >
                <img 
                  src={imgVal} 
                  alt={`${t(`${apt.key}.name`)} - wnętrze ${idx + 1}`} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
            ))}
          </div>
        </div>

        {apt.surroundings && apt.surroundings.length > 0 && (
          <div id="surroundings">
            <h2 className="text-3xl font-serif text-brand-navy mb-8">Okolica</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {apt.surroundings.map((imgVal: string, idx: number) => (
                <div 
                  key={idx} 
                  className="relative h-48 md:h-64 rounded-2xl overflow-hidden group bg-slate-100/50 cursor-pointer"
                  onClick={() => setLightboxImg({ index: idx, gallery: apt.surroundings })}
                >
                  <img 
                    src={imgVal} 
                    alt={`${t(`${apt.key}.name`)} - okolica ${idx + 1}`} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImg !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setLightboxImg(null)}
          >
            <button
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-50 p-2"
              onClick={() => setLightboxImg(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <div className="relative w-full max-w-5xl h-full max-h-[80vh] flex items-center justify-center" onClick={e => e.stopPropagation()}>
              <motion.img
                key={lightboxImg.index}
                src={lightboxImg.gallery[lightboxImg.index]}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="max-w-full max-h-full object-contain"
                alt="fullscreen view"
              />
              
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxImg((prev) => prev ? { ...prev, index: (prev.index - 1 + prev.gallery.length) % prev.gallery.length } : null);
                }}
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxImg((prev) => prev ? { ...prev, index: (prev.index + 1) % prev.gallery.length } : null);
                }}
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
