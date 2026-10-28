'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, MicOff, X } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

interface SpeechRecognitionResultItem {
  transcript: string;
}

interface SpeechRecognitionResultList {
  0: SpeechRecognitionResultItem;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList[];
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

interface SpeechWindow extends Window {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
}

const speechLocales: Record<string, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  mr: 'mr-IN',
};

export default function VoiceAssistant() {
  const router = useRouter();
  const { language } = useLanguage();
  const [listening, setListening] = useState(false);
  const [message, setMessage] = useState('');
  const [transcript, setTranscript] = useState('');

  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = speechLocales[language] ?? 'en-IN';
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    const speechWindow = window as SpeechWindow;
    const Recognition =
      speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
    if (!Recognition) {
      setMessage('Voice input is not supported in this browser. You can use the dashboard links.');
      return;
    }

    const recognition = new Recognition();
    recognition.lang = speechLocales[language] ?? 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;
    setTranscript('');
    setMessage('Listening…');
    setListening(true);

    recognition.onresult = (event) => {
      const recognizedText = event.results[0]?.[0]?.transcript ?? '';
      setTranscript(recognizedText);
      const command = recognizedText.toLocaleLowerCase();
      const hasCommand = (...terms: string[]) =>
        terms.some((term) => command.includes(term));
      const destination =
        hasCommand('bhav', 'prices', 'price', 'भाव', 'भाव सांगा', 'बाजार भाव')
          ? { path: '/prices', confirmation: 'Opening market prices.' }
          : hasCommand('doctor', 'rog', 'disease', 'रोग', 'डॉक्टर', 'पीक डॉक्टर')
            ? {
                path: '/crop-doctor',
                confirmation: 'Opening Crop Doctor.',
              }
            : hasCommand(
                  'calculator',
                  'nafa',
                  'profit',
                  'नफा',
                  'मुनाफा',
                  'गणना',
                )
              ? {
                  path: '/calculator',
                  confirmation: 'Opening the profit calculator.',
                }
              : hasCommand('auction', 'boli', 'बोली', 'लिलाव')
                ? {
                    path: '/marketplace',
                    confirmation: 'Opening produce auctions.',
                  }
                : null;

      if (!destination) {
        setMessage('Command not recognized. Try prices, doctor, calculator, or auction.');
        speak('Sorry, I did not understand. Please try again.');
        return;
      }

      setMessage(destination.confirmation);
      speak(destination.confirmation);
      router.push(destination.path);
    };

    recognition.onerror = (event) => {
      setMessage(
        event.error === 'not-allowed'
          ? 'Microphone access was denied. Allow microphone access or use the dashboard links.'
          : `Voice input error: ${event.error}. You can use the dashboard links.`,
      );
      setListening(false);
    };
    recognition.onend = () => setListening(false);

    try {
      recognition.start();
    } catch (error) {
      console.error('Could not start browser speech recognition.', error);
      setListening(false);
      setMessage('Could not start voice input. Please try again.');
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-2">
      {message && (
        <div
          role="status"
          className="max-w-xs rounded-xl border border-[#DFE5DA] bg-white p-3 text-sm text-[#26352B] shadow-md"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p>{message}</p>
              {transcript && (
                <p className="mt-1 text-xs text-[#26352B]/65">
                  Heard: “{transcript}”
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setMessage('')}
              aria-label="Dismiss voice assistant message"
              className="text-[#26352B]/60 hover:text-[#26352B]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={listening ? undefined : startListening}
        disabled={listening}
        aria-label={listening ? 'Listening for a command' : 'Start voice assistant'}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#246B45] text-white shadow-md transition-colors hover:bg-[#1e5838] disabled:cursor-wait"
      >
        {listening && (
          <span className="absolute inset-0 animate-ping rounded-full bg-[#76A94C]/70" />
        )}
        {listening ? (
          <MicOff className="relative h-6 w-6" />
        ) : (
          <Mic className="relative h-6 w-6" />
        )}
      </button>
    </div>
  );
}
