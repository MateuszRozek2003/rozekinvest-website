import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../components/ui/Button";
import { Users, Bed, Bath, Droplet, Wifi, CigaretteOff, ChevronLeft, ChevronRight, X, Phone, Mail, ZoomIn } from "lucide-react";
import React from "react";
import { ImageLightboxModal } from "../components/ImageLightboxModal";
import { nautilusApartmentImages, valefuradoApartmentImages } from "../data/images";

export function ContactModal({ isOpen, onClose, initialApartment }: { isOpen: boolean, onClose: () => void, initialApartment: string }) {
  const [selectedApt, setSelectedApt] = useState(initialApartment);
  const [contactMethod, setContactMethod] = useState<"phone" | "email" | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setSelectedApt(initialApartment);
      setContactMethod(null);
    }
  }, [isOpen, initialApartment]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-navy/40 backdrop-blur-sm"
         onClick={(e) => { if(e.target === e.currentTarget) onClose(); }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white rounded-[24px] p-6 md:p-8 max-w-md w-full relative shadow-2xl"
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-brand-navy/50 hover:text-brand-navy bg-slate-100 rounded-full transition-colors">
          <X className="w-5 h-5" />
        </button>
        
        <h3 className="text-2xl font-serif text-brand-navy mb-6">Skontaktuj się z nami</h3>
        
        <div className="mb-6">
          <label className="block text-[14px] font-semibold text-brand-navy mb-3">1. Wybierz apartament</label>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setSelectedApt('nautilus')}
              className={`p-3 rounded-xl border text-sm font-medium transition-colors ${selectedApt === 'nautilus' ? 'bg-brand-navy text-white border-brand-navy' : 'bg-white text-brand-navy border-slate-200 hover:border-brand-navy'}`}
            >
              Nautilus
            </button>
            <button 
              onClick={() => setSelectedApt('valefurado')}
              className={`p-3 rounded-xl border text-sm font-medium transition-colors ${selectedApt === 'valefurado' ? 'bg-brand-navy text-white border-brand-navy' : 'bg-white text-brand-navy border-slate-200 hover:border-brand-navy'}`}
            >
              Vale Furado
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-[14px] font-semibold text-brand-navy mb-3">2. Jak chcesz się skontaktować?</label>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setContactMethod('phone')}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-medium transition-colors ${contactMethod === 'phone' ? 'bg-brand-navy text-white border-brand-navy' : 'bg-white text-brand-navy border-slate-200 hover:border-brand-navy'}`}
            >
              <Phone className="w-4 h-4" /> Telefon
            </button>
            <button 
              onClick={() => setContactMethod('email')}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-medium transition-colors ${contactMethod === 'email' ? 'bg-brand-navy text-white border-brand-navy' : 'bg-white text-brand-navy border-slate-200 hover:border-brand-navy'}`}
            >
              <Mail className="w-4 h-4" /> Email
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {contactMethod === 'phone' && (
            <motion.div 
              key="phone"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-5 bg-slate-50 border border-slate-100 rounded-xl text-center"
            >
              <p className="text-sm text-brand-navy/70 mb-1">Zadzwoń do nas:</p>
              <a href="tel:+48600323472" className="text-2xl font-serif text-brand-navy hover:text-brand-copper transition-colors">
                +48 600 323 472
              </a>
            </motion.div>
          )}
          {contactMethod === 'email' && (
            <motion.div 
              key="email"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-5 bg-slate-50 border border-slate-100 rounded-xl text-center"
            >
              <p className="text-sm text-brand-navy/70 mb-1">Napisz wiadomość:</p>
              <a href="mailto:barbara@rozek.PL" className="text-xl font-serif text-brand-navy hover:text-brand-copper transition-colors">
                barbara@rozek.PL
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export function Apartments({ onViewDetails, onContact, onBook }: { onViewDetails: (id: string) => void, onContact: (id: string) => void, onBook: (id: string) => void }) {
  const { t } = useLanguage();
  const [lightboxState, setLightboxState] = useState<{
    isOpen: boolean;
    images: string[];
    initialIndex: number;
    apartmentName: string;
  }>({
    isOpen: false,
    images: [],
    initialIndex: 0,
    apartmentName: "",
  });

  // W TYM MIEJSCU MOŻESZ DODAĆ SWOJE ZDJĘCIA VALE FURADO I NAUTILUS
  // Skopiuj adres URL ze swojego zdjęcia po jego wgraniu (np. na Imgur, lub jeśli dodasz je do folderu public/ jako "/nazwa-zdjecia.jpg")
  const apts = [
    {
      id: "nautilus",
      guests: 4,
      bedrooms: 2,
      bathrooms: 2,
      images: nautilusApartmentImages,
      key: "apartments.nautilus",
      links: {
        scps: "https://www.silvercoastpropertyservices.com/en/accommodation/nautilus-silvercoast/",
      }
    },
    {
      id: "valefurado",
      guests: 4,
      bedrooms: 2,
      bathrooms: 2,
      images: valefuradoApartmentImages,
      key: "apartments.valefurado",
      links: {
        scps: "https://www.silvercoastpropertyservices.com/en/accommodation/t2-vale-furado/",
      }
    }
  ];

  return (
    <section id="apartments" className="py-16 lg:py-24 bg-brand-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 lg:mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-serif text-brand-navy mb-4">
            {t("apartments.title")}
          </h2>
        </motion.div>

        <div className="flex flex-col gap-12 lg:gap-16">
          {apts.map((apt, idx) => {
            return (
              <ApartmentCard 
                key={apt.id} 
                apt={apt} 
                idx={idx} 
                onViewDetails={onViewDetails}
                openModal={onContact} 
                onBook={onBook}
                onImageClick={(imageIdx) => {
                  setLightboxState({
                    isOpen: true,
                    images: apt.images,
                    initialIndex: imageIdx,
                    apartmentName: t(`${apt.key}.name`),
                  });
                }}
              />
            )
          })}
        </div>
      </div>

      <ImageLightboxModal 
        isOpen={lightboxState.isOpen}
        images={lightboxState.images}
        initialIndex={lightboxState.initialIndex}
        apartmentName={lightboxState.apartmentName}
        onClose={() => setLightboxState(prev => ({ ...prev, isOpen: false }))}
      />
    </section>
  );
}

function ApartmentCard({ apt, idx, openModal, onViewDetails, onBook, onImageClick }: { apt: any, idx: number, key?: React.Key, openModal: (id: string) => void, onViewDetails: (id: string) => void, onBook: (id: string) => void, onImageClick: (index: number) => void }) {
  const { t } = useLanguage();
  const [currentImg, setCurrentImg] = useState(0);

  const nextImg = () => setCurrentImg((prev) => (prev + 1) % apt.images.length);
  const prevImg = () => setCurrentImg((prev) => (prev - 1 + apt.images.length) % apt.images.length);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7 }}
      className={`bg-white items-stretch rounded-[24px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-[#f0f0f0] flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
    >
      <div className="w-full lg:w-1/2 relative group h-[240px] sm:h-[300px] md:h-[400px] lg:h-auto bg-slate-100 overflow-hidden">
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
            className="absolute inset-0 w-full h-full object-contain p-2 cursor-grab active:cursor-grabbing" 
          />
        </AnimatePresence>

        {/* Click to open Lightbox indicator */}
        <div 
          onClick={() => onImageClick(currentImg)}
          className="absolute inset-0 z-10 cursor-zoom-in bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 hover:opacity-100 duration-300"
        >
          <div className="bg-brand-navy/85 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transform translate-y-3 group-hover:translate-y-0 transition-transform shadow-lg">
            <ZoomIn className="w-4 h-4 text-brand-copper" />
            <span>Powiększ zdjęcie</span>
          </div>
        </div>
        
        {/* Gallery Controls */}
        <div className="absolute inset-x-0 h-full flex items-center justify-between px-2 sm:px-4 pointer-events-none group-hover:opacity-100 transition-opacity z-20">
          <button 
            onClick={(e) => { e.stopPropagation(); prevImg(); }} 
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center text-brand-navy hover:bg-white transition-colors pointer-events-auto opacity-100 sm:opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); nextImg(); }} 
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center text-brand-navy hover:bg-white transition-colors pointer-events-auto opacity-100 sm:opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        
        <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2 z-20">
          {apt.images.map((_: any, i: number) => (
            <button 
              key={i} 
              onClick={(e) => { e.stopPropagation(); setCurrentImg(i); }}
              className={`w-2 h-2 rounded-full transition-all ${i === currentImg ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/80'}`}
            />
          ))}
        </div>
      </div>
      
      <div className="w-full lg:w-1/2 p-5 sm:p-8 md:p-10 flex flex-col justify-center">
        <div className="text-[11px] sm:text-[12px] text-brand-copper uppercase font-semibold mb-2 tracking-wider">
          {t(`${apt.key}.location`)}
        </div>
        <h3 className="text-2xl sm:text-3xl font-serif text-brand-navy mb-2">
          {t(`${apt.key}.name`)}
        </h3>
        
        <div className="text-[14px] sm:text-[15px] font-semibold text-brand-copper mb-4 sm:mb-5 border-b border-black/5 pb-4 sm:pb-5">
          {t(`${apt.key}.priceRange`)}
        </div>
        
        <div className="flex flex-wrap gap-x-3 sm:gap-x-5 gap-y-2 sm:gap-y-3 text-[12px] sm:text-[13px] opacity-80 mb-6 font-medium text-brand-navy">
          <span className="flex items-center gap-2 bg-brand-sand/50 px-3 py-1.5 rounded-lg"><Users className="w-4 h-4" /> {apt.guests} {t("common.people")}</span>
          <span className="flex items-center gap-2 bg-brand-sand/50 px-3 py-1.5 rounded-lg"><Bed className="w-4 h-4" /> {apt.bedrooms} {t("common.bedroomsShort")}</span>
          <span className="flex items-center gap-2 bg-brand-sand/50 px-3 py-1.5 rounded-lg"><Bath className="w-4 h-4" /> {apt.bathrooms} {t("common.bathroomShort")}</span>
          <span className="flex items-center gap-2 bg-brand-sand/50 px-3 py-1.5 rounded-lg"><Droplet className="w-4 h-4" /> {t("common.pool")}</span>
        </div>

        <p className="text-[15px] leading-[1.7] text-brand-navy/80 mb-8">
          {t(`${apt.key}.desc`)}
        </p>

        <div className="flex flex-wrap gap-3 mt-auto">
          <Button onClick={() => onBook(apt.id)} variant="primary" className="rounded-full px-5 sm:px-6 bg-brand-navy hover:bg-brand-copper flex-1 sm:flex-none">
            {t("common.book")}
          </Button>
          <Button onClick={() => openModal(apt.id)} variant="outline" className="rounded-full px-5 sm:px-6 flex-1 sm:flex-none">
            {t("common.questionBtn")}
          </Button>
          <Button onClick={() => onViewDetails(apt.id)} variant="outline" className="rounded-full px-5 sm:px-6 w-full sm:w-auto">
            {t("common.details")}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
