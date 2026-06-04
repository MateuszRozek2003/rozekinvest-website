import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { Instagram, Facebook, MapPin } from "lucide-react";

export function Footer({ onNavigate }: { onNavigate?: (hash: string) => void }) {
  const { t } = useLanguage();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      if (onNavigate) onNavigate(href);
      else {
        if (href === '#') window.scrollTo({ top: 0, behavior: 'smooth' });
        else {
          const el = document.querySelector(href);
          if (el) {
            const y = el.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top: y, behavior: 'smooth' });
          } else {
            window.location.hash = href;
          }
        }
      }
    }
  };

  return (
    <footer className="bg-[#FAF8F5] text-brand-navy pt-20 pb-10 border-t border-black/5 mt-10 pb-[100px] md:pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-10 lg:mb-16">
          <div className="md:col-span-2 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="mb-6 -ml-4 relative">
              <img 
                src="/logo-black-new.png" 
                alt="Rożek Invest" 
                className="h-40 sm:h-48 w-auto object-contain transition-opacity duration-300 mix-blend-multiply" 
              />
            </div>
            <p className="text-brand-navy/70 font-light leading-relaxed max-w-sm text-[14px]">
              {t("footer.desc")}
            </p>
          </div>
          
          <div>
            <h4 className="font-serif text-[18px] mb-6">Menu</h4>
            <ul className="space-y-4 font-light text-[13px] text-brand-navy/70">
              <li><a href="#" onClick={(e) => handleLinkClick(e, '#')} className="hover:text-brand-copper transition-colors">{t("nav.home")}</a></li>
              <li><a href="#apartments" onClick={(e) => handleLinkClick(e, '#apartments')} className="hover:text-brand-copper transition-colors">{t("nav.apartments")}</a></li>
              <li><a href="#pricing" onClick={(e) => handleLinkClick(e, '#pricing')} className="hover:text-brand-copper transition-colors">{t("nav.pricing")}</a></li>
              <li><a href="#location" onClick={(e) => handleLinkClick(e, '#location')} className="hover:text-brand-copper transition-colors">{t("nav.location")}</a></li>
              <li><a href="#contact" onClick={(e) => handleLinkClick(e, '#contact')} className="hover:text-brand-copper transition-colors">{t("nav.contact")}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-[18px] mb-6">Social</h4>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center hover:bg-brand-copper hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center hover:bg-brand-copper hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center hover:bg-brand-copper hover:text-white transition-colors">
                <MapPin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-black/5 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-brand-navy/60 font-light">
          <p>© {new Date().getFullYear()} Rożek Invest.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-brand-copper transition-colors">{t("footer.privacy")}</a>
            <a href="#" className="hover:text-brand-copper transition-colors">{t("footer.terms")}</a>
            <a href="#" className="hover:text-brand-copper transition-colors">{t("footer.cookies")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
