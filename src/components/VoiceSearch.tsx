'use client';

import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, AlertCircle } from 'lucide-react';

interface VoiceSearchProps {
  onSearch: (transcript: string) => void;
  lang?: 'en-IN' | 'hi-IN';
}

export default function VoiceSearch({ onSearch, lang = 'en-IN' }: VoiceSearchProps) {
  const [isListening, setIsListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const [currentLang, setCurrentLang] = useState<'en-IN' | 'hi-IN'>(lang);
  const [speechFeedback, setSpeechFeedback] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setSupported(false);
      }
    }
  }, []);

  const startListening = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Web Speech API is not supported in this browser. Please try Google Chrome, Edge, or Safari.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = currentLang;

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechFeedback(currentLang === 'hi-IN' ? 'सुन रहे हैं... बोलिए...' : 'Listening... Speak medicine name...');
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');

        setSpeechFeedback(transcript);

        if (event.results[0].isFinal) {
          onSearch(transcript);
          setIsListening(false);
          setTimeout(() => setSpeechFeedback(''), 2500);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error', event.error);
        setIsListening(false);
        setSpeechFeedback(event.error === 'not-allowed' ? 'Mic access blocked' : 'Could not hear clearly');
        setTimeout(() => setSpeechFeedback(''), 3000);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  return (
    <div className="relative inline-flex items-center">
      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-full p-0.5 border border-slate-200 dark:border-slate-700">
        {/* Language selector toggle */}
        <button
          type="button"
          onClick={() => setCurrentLang((prev) => (prev === 'en-IN' ? 'hi-IN' : 'en-IN'))}
          className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 transition"
          title="Toggle Voice Language (English / Hindi)"
        >
          {currentLang === 'en-IN' ? 'ENG' : 'हिंदी'}
        </button>

        {/* Mic trigger */}
        <button
          type="button"
          onClick={startListening}
          disabled={isListening}
          className={`p-2 rounded-full transition-all flex items-center justify-center ${
            isListening
              ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/50'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
          }`}
          title={isListening ? 'Listening...' : 'Search by Voice (Web Speech API)'}
        >
          {isListening ? <MicOff className="w-4 h-4 animate-bounce" /> : <Mic className="w-4 h-4" />}
        </button>
      </div>

      {/* Voice feedback popover */}
      {speechFeedback && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white text-xs px-3 py-2 rounded-xl shadow-xl border border-emerald-500/40 backdrop-blur whitespace-nowrap flex items-center gap-2 animate-in fade-in zoom-in-95">
          <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>{speechFeedback}</span>
        </div>
      )}
    </div>
  );
}
