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

  useEffect(() => {
    try {
      const saved = localStorage.getItem('medit_large_font');
      if (saved) {
        setIsLargeFont(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleLargeFont = () => {
    setIsLargeFont((prev) => {
      const next = !prev;
      localStorage.setItem('medit_large_font', JSON.stringify(next));
      return next;
    });
  };

  return (
    <FontContext.Provider value={{ isLargeFont, toggleLargeFont }}>
      <div className={isLargeFont ? 'text-lg leading-relaxed antialiased' : 'text-sm sm:text-base leading-normal'}>
        {children}
      </div>
    </FontContext.Provider>
  );
}

export function useFont() {
  return useContext(FontContext);
}
