import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../components/ui/Button";
import { MapPin, Waves, Footprints, Camera, Utensils, Landmark, Copy, Check } from "lucide-react";

export function Location() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"nautilus" | "valefurado">("nautilus");
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  const locations = {
    nautilus: {
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
    valefurado: {
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
    }
  };

  const activeLoc = locations[activeTab];

  return (
    <section id="location" className="py-16 lg:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif text-brand-navy mb-6">
            {t("location.title")}
          </h2>
          <p className="text-lg text-slate-600 font-light max-w-2xl mx-auto">
            {t("location.desc")}
          </p>
        </div>

        {/* POIs - Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Nautilus Column */}
          <div className="bg-slate-50/50 p-8 rounded-3xl border border-slate-100">
            <h3 className="text-2xl font-serif text-brand-navy mb-8 pb-4 border-b border-brand-navy/10">
              {t("location.nautilusMap")}
            </h3>
            <div className="space-y-8">
              {t("location.pois.nautilus") && Array.isArray(t("location.pois.nautilus")) && (t("location.pois.nautilus") as any[]).map((poi: any, index: number) => {
                const icons = [Waves, Footprints, Camera, Utensils];
                const Icon = icons[index % icons.length];
                const colors = [
                  "bg-blue-50 text-blue-600",
                  "bg-emerald-50 text-emerald-600",
                  "bg-orange-50 text-orange-600",
                  "bg-rose-50 text-rose-600"
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

          {/* Vale Furado Column */}
          <div className="bg-slate-50/50 p-8 rounded-3xl border border-slate-100">
            <h3 className="text-2xl font-serif text-brand-navy mb-8 pb-4 border-b border-brand-navy/10">
              {t("location.valefuradoMap")}
            </h3>
            <div className="space-y-8">
              {t("location.pois.valefurado") && Array.isArray(t("location.pois.valefurado")) && (t("location.pois.valefurado") as any[]).map((poi: any, index: number) => {
                const icons = [Waves, Camera, Utensils, Landmark];
                const Icon = icons[index % icons.length];
                const colors = [
                  "bg-blue-50 text-blue-600",
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
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-slate-100/80 p-1.5 rounded-2xl">
            {(Object.keys(locations) as Array<"nautilus" | "valefurado">).map((key) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`relative px-8 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                  activeTab === key
                    ? "text-brand-navy shadow-sm"
                    : "text-slate-500 hover:text-brand-navy"
                }`}
              >
                {activeTab === key && (
                  <motion.div
                    layoutId="activeLocationTab"
                    className="absolute inset-0 bg-white rounded-xl"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {locations[key].name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-stretch">
          <motion.div 
            className="w-full lg:w-1/3 flex flex-col"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="bg-brand-cream flex-1 p-8 rounded-3xl flex flex-col justify-center border border-[#f0f0f0]"
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                  <MapPin className="w-6 h-6 text-brand-navy" />
                </div>
                <h4 className="font-serif text-2xl text-brand-navy mb-6">
                  {activeLoc.name}
                </h4>
                <div className="space-y-1 mb-6">
                  {activeLoc.address.map((line, i) => (
                    <p key={i} className="text-slate-700 font-light text-lg">
                      {line}
                    </p>
                  ))}
                </div>
                
                <div className="mb-8 pt-6 border-t border-[#f0f0f0]">
                  <p className="text-sm font-semibold text-brand-navy mb-2">{t("location.gps")}</p>
                  <div className="space-y-2">
                    <button 
                      onClick={() => handleCopy(activeLoc.coordinates)}
                      className="group flex items-center justify-between w-full p-2.5 -ml-2.5 rounded-xl hover:bg-white/60 hover:shadow-sm border border-transparent hover:border-slate-200 transition-all text-left"
                      title="Kopiuj do schowka"
                    >
                      <span className="text-slate-600 font-mono text-sm font-medium">{activeLoc.coordinates}</span>
                      {copied === activeLoc.coordinates ? (
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <Copy className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      )}
                    </button>
                    <button 
                      onClick={() => handleCopy(activeLoc.gps)}
                      className="group flex items-center justify-between w-full p-2.5 -ml-2.5 rounded-xl hover:bg-white/60 hover:shadow-sm border border-transparent hover:border-slate-200 transition-all text-left"
                      title="Kopiuj do schowka"
                    >
                      <span className="text-slate-500 font-mono text-xs">{activeLoc.gps}</span>
                      {copied === activeLoc.gps ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-auto">
                  <Button onClick={() => window.open(activeLoc.query, "_blank", "noopener,noreferrer")} className="w-full justify-center">
                    {t("location.btn")}
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <div className="w-full lg:w-2/3 h-[300px] sm:h-[400px] lg:h-[600px] rounded-3xl overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] relative bg-slate-100">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <iframe 
                  src={activeLoc.embed} 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
