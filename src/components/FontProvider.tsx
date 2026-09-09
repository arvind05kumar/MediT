'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface FontContextType {
  isLargeFont: boolean;
  toggleLargeFont: () => void;
}

const FontContext = createContext<FontContextType>({
  isLargeFont: false,
  toggleLargeFont: () => {},
});

export function FontProvider({ children }: { children: React.ReactNode }) {
  const [isLargeFont, setIsLargeFont] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('medit_large_font');
      if (saved) {
        const val = JSON.parse(saved);
        setIsLargeFont(val);
        if (val) {
          document.documentElement.classList.add('large-font-mode');
        } else {
          document.documentElement.classList.remove('large-font-mode');
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleLargeFont = () => {
    setIsLargeFont((prev) => {
      const next = !prev;
      localStorage.setItem('medit_large_font', JSON.stringify(next));

      if (next) {
        document.documentElement.classList.add('large-font-mode');
        setToastMessage('👓 Large Font / Elderly Readability Mode ON');
      } else {
        document.documentElement.classList.remove('large-font-mode');
        setToastMessage('Standard Font Mode ON');
      }

      setTimeout(() => setToastMessage(null), 2200);
      return next;
    });
  };

  return (
    <FontContext.Provider value={{ isLargeFont, toggleLargeFont }}>
      {children}

      {/* Floating Toast Notification when toggled */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[1000] bg-slate-900 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-2xl shadow-2xl border border-emerald-500/50 backdrop-blur animate-in fade-in slide-in-from-bottom-4 duration-200">
          {toastMessage}
        </div>
      )}
    </FontContext.Provider>
  );
}

export function useFont() {
  return useContext(FontContext);
}
