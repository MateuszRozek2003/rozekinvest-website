import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight, Maximize2, Minimize2, Grid, ScrollText } from "lucide-react";

interface ImageLightboxModalProps {
  isOpen: boolean;
  images: string[];
  initialIndex: number;
  onClose: () => void;
  apartmentName: string;
}

export function ImageLightboxModal({
  isOpen,
  images,
  initialIndex,
  onClose,
  apartmentName,
}: ImageLightboxModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isScrollMode, setIsScrollMode] = useState(false); // allows vertical scrolling of all images
  const modalRef = useRef<HTMLDivElement>(null);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Sync initial index when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setIsFullscreen(false);
      setIsScrollMode(false);
    }
  }, [isOpen, initialIndex]);

  // Handle arrow keys & escape key for navigation and closing
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isFullscreen) {
          handleExitFullscreen();
        } else {
          onClose();
        }
      } else if (e.key === "ArrowRight" && !isScrollMode) {
        handleNext();
      } else if (e.key === "ArrowLeft" && !isScrollMode) {
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, isFullscreen, isScrollMode, images.length]);

  // Scroll active thumbnail into view
  useEffect(() => {
    if (isOpen && thumbnailRefs.current[currentIndex]) {
      thumbnailRefs.current[currentIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [currentIndex, isOpen]);

  if (!isOpen) return null;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleToggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
    // Use HTML5 fullscreen API if supported and allowed
    if (modalRef.current) {
      if (!document.fullscreenElement) {
        modalRef.current.requestFullscreen().catch(() => {
          // Fallback to pure CSS fullscreen overlay if permission denied / parent iframe restrictions
        });
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const handleExitFullscreen = () => {
    setIsFullscreen(false);
    setIsScrollMode(false);
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <AnimatePresence>
      <div
        id="image-lightbox-container"
        ref={modalRef}
        className={`fixed inset-0 z-[110] flex flex-col justify-between select-none bg-brand-navy/95 backdrop-blur-md text-white transition-all duration-300 ${
          isFullscreen ? "p-0" : "p-4 sm:p-6"
        }`}
      >
        {/* Background Click to Close (Only outside image and controls) */}
        {!isScrollMode && (
          <div
            className="absolute inset-0 cursor-zoom-out z-0"
            onClick={(e) => {
              if (e.target === e.currentTarget) onClose();
            }}
          />
        )}

        {/* Top Header Bar */}
        <div className="relative z-10 flex items-center justify-between w-full h-16 px-4 bg-gradient-to-b from-black/60 to-transparent">
          <div className="flex flex-col">
            <h4 className="text-sm font-medium tracking-wide text-white/90">
              {apartmentName}
            </h4>
            <p className="text-xs text-white/60">
              Zdjęcie {currentIndex + 1} z {images.length}
            </p>
          </div>

          <div id="lightbox-controls" className="flex items-center gap-2 sm:gap-4">
            {/* Scroll through all available images toggle */}
            <button
              onClick={() => setIsScrollMode((prev) => !prev)}
              className={`p-2 sm:px-3 sm:py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                isScrollMode
                  ? "bg-brand-copper text-white shadow"
                  : "bg-white/10 text-white/80 hover:bg-white/20"
              }`}
              title={isScrollMode ? "Wróć do nawigacji" : "Przeglądaj wszystkie zdjęcia jako listę"}
            >
              <ScrollText className="w-4 h-4" />
              <span className="hidden sm:inline">
                {isScrollMode ? "Tryb slajdów" : "Przewijaj wszystkie"}
              </span>
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={handleToggleFullscreen}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
              title={isFullscreen ? "Wyjdź z pełnego ekranu" : "Pełny ekran"}
            >
              {isFullscreen ? (
                <Minimize2 className="w-5 h-5" />
              ) : (
                <Maximize2 className="w-5 h-5" />
              )}
            </button>

            {/* Close Lightbox */}
            <button
              onClick={onClose}
              className="p-2 bg-white/15 hover:bg-red-500 hover:text-white rounded-lg transition-all cursor-pointer"
              title="Zamknij (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Core Content Area */}
        <div className="relative flex-1 flex items-center justify-center w-full min-h-0 overflow-hidden z-10">
          {isScrollMode ? (
            /* Scroll View mode: user can vertically scroll high-resolution versions of all images */
            <div className="w-full h-full overflow-y-auto px-4 py-8 space-y-8 scroll-smooth scrollbar-thin scrollbar-thumb-white/20">
              <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center">
                  <span className="bg-brand-copper/30 border border-brand-copper/50 px-3 py-1 rounded-full text-xs font-serif tracking-widest text-[#ffd3a1] uppercase">
                    Wszystkie zdjęcia apartamentu
                  </span>
                  <p className="text-xs text-white/50 mt-2">
                    Przewijaj w dół, aby iść dalej • Kliknij dowolne, aby skupić na nim widok
                  </p>
                </div>
                {images.map((img, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="relative group/scroll border border-white/5 rounded-xl overflow-hidden bg-brand-navy/60 max-h-[85vh]">
                      <img
                        src={img}
                        alt={`${apartmentName} - zdjęcie ${idx + 1}`}
                        className="object-contain max-h-[80vh] w-auto mx-auto rounded-lg transition-transform duration-300 hover:scale-102"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs text-center border border-white/10">
                        {idx + 1} / {images.length}
                      </div>
                      <button
                        onClick={() => {
                          setCurrentIndex(idx);
                          setIsScrollMode(false);
                        }}
                        className="absolute bottom-4 right-4 bg-brand-navy border border-white/10 hover:bg-brand-copper transition-all px-4 py-1.5 rounded-lg text-xs font-medium"
                      >
                        Wybierz to zdjęcie
                      </button>
                    </div>
                  </div>
                ))}
                <div className="text-center py-6 border-t border-white/10">
                  <button
                    onClick={() => {
                      setIsScrollMode(false);
                    }}
                    className="bg-brand-copper hover:bg-[#b05d3b] text-white px-6 py-2 rounded-xl text-sm font-semibold transition"
                  >
                    Wyjdź z trybu przewijania i przejdź do slajdów
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Standard Slideshow mode with arrow buttons & fade animations */
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Prev Button */}
              <button
                onClick={handlePrev}
                className="absolute left-4 z-20 p-3 sm:p-4 rounded-full bg-black/40 hover:bg-black/60 transition-all text-white border border-white/10 cursor-pointer hidden sm:flex"
                title="Poprzednie (Strzałka w lewo)"
              >
                <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>

              {/* High-Resolution Image View wrapper */}
              <div className="w-full h-full flex items-center justify-center p-2 sm:p-8 max-h-full max-w-full">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentIndex}
                    src={images[currentIndex]}
                    alt={`${apartmentName} - ${currentIndex + 1}`}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25 }}
                    className="max-h-full max-w-full object-contain drop-shadow-[0_10px_40px_rgba(0,0,0,0.5)] select-none pointer-events-none rounded-sm"
                    referrerPolicy="no-referrer"
                  />
                </AnimatePresence>
              </div>

              {/* Next Button */}
              <button
                onClick={handleNext}
                className="absolute right-4 z-20 p-3 sm:p-4 rounded-full bg-black/40 hover:bg-black/60 transition-all text-white border border-white/10 cursor-pointer hidden sm:flex"
                title="Następne (Strzałka w prawo)"
              >
                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
            </div>
          )}
        </div>

        {/* Bottom Thumbnail Strip (Only for Slideshow mode) */}
        {!isScrollMode && (
          <div className="relative z-10 w-full bg-gradient-to-t from-black/80 to-transparent pt-4 pb-2">
            {/* Quick Swipe/Touch assistance overlay indicator for mobile */}
            <div className="sm:hidden flex justify-between px-4 mb-2 text-xs text-white/50 font-medium">
              <button onClick={handlePrev} className="flex items-center gap-1 active:text-white">
                <ChevronLeft className="w-4 h-4" /> Poprzednie
              </button>
              <span className="text-white/70">Przesuwaj przyciskiem lub wybierz z paska</span>
              <button onClick={handleNext} className="flex items-center gap-1 active:text-white">
                Następne <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto max-w-2xl mx-auto px-4 py-2 scrollbar-thin scrollbar-thumb-white/20">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  ref={(el) => {
                    thumbnailRefs.current[idx] = el;
                  }}
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative flex-shrink-0 w-16 h-12 sm:w-20 sm:h-14 rounded-lg overflow-hidden border-2 transition-all ${
                    idx === currentIndex
                      ? "border-brand-copper scale-105 shadow-md shadow-brand-copper/30"
                      : "border-transparent opacity-50 hover:opacity-90"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Miniaturka ${idx + 1}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-0 right-0 px-1 bg-black/60 text-[9px] rounded-tl text-white/95">
                    {idx + 1}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </AnimatePresence>
  );
}
