import React, { useState, useEffect } from "react";
import { Menu, X, Globe } from "lucide-react";
import { useLanguage, Language } from "../context/LanguageContext";
import { Button } from "./ui/Button";
import { cn } from "../lib/utils";

export function Navbar({ onNavigate }: { onNavigate?: (hash: string) => void }) {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement> | null, href: string) => {
    if (e) e.preventDefault();
    if (href === "#" || href === "") {
      if (onNavigate) {
        onNavigate("#");
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }
    if (onNavigate) {
      onNavigate(href);
    } else {
      const el = document.querySelector(href);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: 'smooth' });
      } else {
        window.location.hash = href;
      }
    }
  };

  const navLinks = [
    { href: "#", label: t("nav.home") },
    { href: "#apartments", label: t("nav.apartments") },
    { href: "#pricing", label: t("nav.pricing") },
    { href: "#gallery", label: t("nav.gallery") },
    { href: "#location", label: t("nav.location") },
    { href: "#contact", label: t("nav.contact") },
  ];

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-white border-b border-brand-sand h-[100px] sm:h-[120px] flex items-center transition-all shadow-sm">
      <div className="w-full px-4 md:px-10">
        <div className="flex items-center justify-between">
          <a href="#" onClick={(e) => handleNavClick(e, "#")} className="flex-shrink-0 flex items-center mt-2 relative hover:opacity-80 transition-opacity transform origin-left md:scale-110">
            <img 
              src="/logo-transparent.svg" 
              alt="Rożek Invest" 
              className="h-[80px] sm:h-[100px] w-auto object-contain transition-opacity duration-300" 
            />
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-[24px]">
            <div className="flex gap-[24px]">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-[14px] font-semibold text-brand-navy hover:opacity-100 opacity-60 uppercase tracking-[0.05em] transition-opacity cursor-pointer"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-5 ml-4">
              <div className="flex bg-brand-sand p-1 rounded-full text-[12px] font-medium">
                {(["pt", "en", "pl", "es", "fr", "de"] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={cn(
                      "px-[10px] py-1 rounded-[15px] transition-all",
                      language === lang ? "bg-white shadow-sm text-brand-navy" : "text-brand-navy hover:bg-white/50"
                    )}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
              <Button onClick={(e) => handleNavClick(e as any, '#contact')} variant="primary">
                {t("nav.ask")}
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1 text-brand-navy"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-slate-100">
          <div className="flex flex-col px-4 py-4 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-base font-medium text-slate-700 hover:text-brand-copper"
                onClick={(e) => {
                  setIsOpen(false);
                  handleNavClick(e, link.href);
                }}
              >
                {link.label}
              </a>
            ))}
            <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
              <div className="flex bg-brand-sand p-1 rounded-full text-[12px] font-medium">
                {(["pt", "en", "pl", "es", "fr", "de"] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={cn(
                      "px-[10px] py-1 rounded-[15px] transition-all",
                      language === lang ? "bg-white shadow-sm text-brand-navy" : "text-brand-navy hover:bg-white/50"
                    )}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <Button onClick={(e) => { setIsOpen(false); handleNavClick(e as any, '#contact'); }} className="w-full">
              {t("nav.ask")}
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
