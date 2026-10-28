'use client';

import { useEffect, useRef, useState } from 'react';
import { Bot, Mic, MicOff, Sprout, Volume2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n';

interface ChatMessage {
  id: string;
  role: 'farmer' | 'assistant';
  text: string;
}

interface SpeechRecognitionResultEvent {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}

interface Recognition {
  lang: string;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

interface RecognitionConstructor {
  new (): Recognition;
}

interface SpeechWindow extends Window {
  SpeechRecognition?: RecognitionConstructor;
  webkitSpeechRecognition?: RecognitionConstructor;
}

const quickQueries = ['Tomato Blight', 'Junnar Mandi Rate', 'Drip Subsidy'];

const speechLanguage: Record<string, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  mr: 'mr-IN',
};

function answerQuestion(
  question: string,
  acres: number | null,
  category: string,
  language: string,
) {
  const query = question.toLowerCase();
  const isHindi = language === 'hi';
  const isMarathi = language === 'mr';

  if (/blight|tomato|टमाटर|टोमॅटो|करपा|blight/i.test(query)) {
    if (isHindi) {
      return 'टमाटर में अर्ली ब्लाइट की पुष्टि केवल तस्वीर से नहीं की जा सकती। पत्तियों को सूखा रखें, संक्रमित पत्ते हटाएँ और स्थानीय कृषि अधिकारी से सलाह लें।';
    }
    if (isMarathi) {
      return 'फक्त फोटोवरून टोमॅटोवरील अर्ली ब्लाइटची खात्री करता येत नाही. पाने कोरडी ठेवा, बाधित पाने काढा आणि स्थानिक कृषी अधिकाऱ्यांचा सल्ला घ्या.';
    }
    return 'A photo alone cannot confirm early blight. Keep foliage dry, remove visibly affected leaves without composting them, and consult your local agriculture officer before applying any treatment.';
  }

  if (/rate|price|mandi|भाव|भाव सांगा|दर|किंमत/i.test(query)) {
    if (isHindi) {
      return 'मेरे पास अभी प्रमाणित लाइव मंडी भाव उपलब्ध नहीं हैं। कीमत और तारीख सत्यापित करने के लिए मंडी भाव पेज देखें; उदाहरण डेटा को वर्तमान भाव न मानें।';
    }
    if (isMarathi) {
      return 'माझ्याकडे सध्या पडताळलेले थेट बाजारभाव उपलब्ध नाहीत. किंमत आणि तारीख तपासण्यासाठी बाजारभाव पेज पाहा; उदाहरण डेटा आजचा भाव समजू नका.';
    }
    return 'I cannot verify a live mandi quote right now. Check the market prices page and verify its source and reporting date; do not treat demonstration figures as today’s price.';
  }

  if (/scheme|subsidy|drip|pm.?kisan|महाडीबीटी|योजना|अनुदान/i.test(query)) {
    const landContext =
      acres && acres > 0
        ? ` Your saved profile shows ${acres} acres and category ${category}.`
        : '';
    if (isHindi) {
      return `आप PM-Kisan के ₹6,000 वार्षिक लाभ और MahaDBT सूक्ष्म सिंचाई सहायता के लिए आवेदन की जाँच कर सकते हैं। यह पक्की पात्रता नहीं है; भूमि रिकॉर्ड, श्रेणी और वर्तमान नियम आधिकारिक पोर्टल पर जाँचें: mahadbt.maharashtra.gov.in.${landContext}`;
    }
    if (isMarathi) {
      return `PM-Kisan च्या ₹6,000 वार्षिक लाभासाठी आणि MahaDBT सूक्ष्म-सिंचन अनुदानासाठी पात्रता तपासू शकता. ही पात्रतेची हमी नाही; जमीन नोंदी, प्रवर्ग आणि सध्याचे नियम अधिकृत पोर्टलवर तपासा: mahadbt.maharashtra.gov.in.${landContext}`;
    }
    return `You can check possible eligibility for PM-Kisan (₹6,000/year for eligible families) and MahaDBT micro-irrigation support. This is not an eligibility decision; land records, category and current rules must be verified on the official portal: mahadbt.maharashtra.gov.in.${landContext}`;
  }

  if (/black soil|rabi|काली मिट्टी|रबी|काळी माती/i.test(query)) {
    const landContext =
      acres && acres > 0
        ? ` Your saved farm profile lists ${acres} acres.`
        : '';
    if (isHindi) {
      return `काली मिट्टी में रबी की फसल का चुनाव जल निकासी, सिंचाई और स्थानीय मौसम पर निर्भर करता है। गेहूँ या चना पर विचार करने से पहले स्थानीय कृषि सलाह लें।${landContext}`;
    }
    if (isMarathi) {
      return `रब्बी पिकाची निवड काळ्या मातीतील निचरा, सिंचन आणि स्थानिक हवामानावर अवलंबून असते. गहू किंवा हरभरा निवडण्यापूर्वी स्थानिक कृषी सल्ला घ्या.${landContext}`;
    }
    return `Rabi crop choice on black soil depends on drainage, irrigation and local weather. Wheat or chickpea may be options to discuss with your local agriculture extension officer.${landContext}`;
  }

  if (isHindi) return 'मैं खेती के सामान्य मार्गदर्शन में मदद कर सकता हूँ। अपनी फसल, मिट्टी और समस्या बताएं; महत्वपूर्ण फैसलों के लिए स्थानीय कृषि अधिकारी से पुष्टि करें।';
  if (isMarathi) return 'मी शेतीविषयक सामान्य मार्गदर्शन देऊ शकतो. पीक, माती आणि समस्या सांगा; महत्त्वाच्या निर्णयांसाठी स्थानिक कृषी अधिकाऱ्यांकडून खात्री करा.';
  return 'I can help with general farming guidance. Tell me your crop, soil and concern; confirm important decisions with a local agricultural extension officer.';
}

export default function AIAssistantModal() {
  const router = useRouter();
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [voiceMessage, setVoiceMessage] = useState('');
  const [listening, setListening] = useState(false);
  const [landAcres, setLandAcres] = useState<number | null>(null);
  const [farmerCategory, setFarmerCategory] = useState('General');
  const recognitionRef = useRef<Recognition | null>(null);
  const startVoiceRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    const refreshProfile = () => {
      try {
        const rawProfile = window.localStorage.getItem('mandilog_user_profile');
        if (!rawProfile) {
          setLandAcres(null);
          setFarmerCategory('General');
          return;
        }
        const profile: unknown = JSON.parse(rawProfile);
        if (typeof profile !== 'object' || profile === null) return;
        if (
          'landAcres' in profile &&
          typeof profile.landAcres === 'number' &&
          Number.isFinite(profile.landAcres)
        ) {
          setLandAcres(profile.landAcres);
        }
        if ('category' in profile && typeof profile.category === 'string') {
          setFarmerCategory(profile.category);
        }
      } catch (error) {
        console.error('Could not read the farm profile for Sahayak AI.', error);
      }
    };
    refreshProfile();
    window.addEventListener('mandilog:profile-updated', refreshProfile);
    return () =>
      window.removeEventListener('mandilog:profile-updated', refreshProfile);
  }, []);

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      setVoiceMessage('Voice playback is not supported in this browser.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = speechLanguage[language] ?? 'en-IN';
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const openAssistant = (event: Event) => {
      const startVoice =
        (event as CustomEvent<{ startVoice?: boolean }>).detail?.startVoice;
      setOpen(true);
      if (startVoice) {
        window.setTimeout(() => startVoiceRef.current(), 100);
      }
    };
    window.addEventListener('mandilog:open-assistant', openAssistant);
    return () =>
      window.removeEventListener('mandilog:open-assistant', openAssistant);
  }, []);

  const sendMessage = (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || busy) return;
    setBusy(true);
    setMessages((current) => [
      ...current,
      { id: `${Date.now()}-user`, role: 'farmer', text: trimmed },
    ]);
    window.setTimeout(() => {
      const answer = answerQuestion(
        trimmed,
        landAcres,
        farmerCategory,
        language,
      );
      setMessages((current) => [
        ...current,
        { id: `${Date.now()}-assistant`, role: 'assistant', text: answer },
      ]);
      speakText(answer);
      setBusy(false);
    }, 180);
  };

  const startSpeechInput = () => {
    const speechWindow = window as SpeechWindow;
    const Recognition =
      speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
    if (!Recognition) {
      setVoiceMessage('Voice input is not supported in this browser.');
      return;
    }
    const recognition = new Recognition();
    recognitionRef.current = recognition;
    recognition.lang = speechLanguage[language] ?? 'en-IN';
    recognition.interimResults = false;
    setListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? '';
      const command = transcript.toLocaleLowerCase();
      const hasCommand = (...terms: string[]) =>
        terms.some((term) => command.includes(term));
      const destination = hasCommand(
        'bhav',
        'prices',
        'price',
        'भाव',
        'भाव सांगा',
        'बाजार भाव',
      )
        ? { path: '/prices', en: 'Opening market prices.', hi: 'मंडी भाव खोल रहा हूँ।', mr: 'बाजारभाव उघडत आहे.' }
        : hasCommand(
              'doctor',
              'rog',
              'disease',
              'रोग',
              'डॉक्टर',
              'पीक डॉक्टर',
            )
          ? { path: '/crop-doctor', en: 'Opening Crop Doctor.', hi: 'फसल डॉक्टर खोल रहा हूँ।', mr: 'पीक डॉक्टर उघडत आहे.' }
          : hasCommand(
                'calculator',
                'nafa',
                'profit',
                'नफा',
                'मुनाफा',
                'गणना',
              )
            ? { path: '/calculator', en: 'Opening the profit calculator.', hi: 'लाभ कैलकुलेटर खोल रहा हूँ।', mr: 'नफा कॅल्क्युलेटर उघडत आहे.' }
            : hasCommand('auction', 'boli', 'बोली', 'लिलाव')
              ? { path: '/marketplace', en: 'Opening produce auctions.', hi: 'नीलामी खोल रहा हूँ।', mr: 'लिलाव उघडत आहे.' }
              : null;

      if (destination) {
        const confirmation =
          language === 'hi'
            ? destination.hi
            : language === 'mr'
              ? destination.mr
              : destination.en;
        setVoiceMessage(`${confirmation} ${transcript}`);
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(confirmation);
          utterance.lang = speechLanguage[language] ?? 'en-IN';
          window.speechSynthesis.speak(utterance);
        }
        setOpen(false);
        router.push(destination.path);
        return;
      }

      setVoiceMessage('I heard you. Preparing spoken guidance…');
      sendMessage(transcript);
    };
    recognition.onerror = (event) => {
      setListening(false);
      setVoiceMessage(
        event.error === 'not-allowed'
        ? 'Microphone permission was denied. Allow microphone access and try again.'
        : `Voice input unavailable (${event.error}). Please try again.`,
      );
    };
    recognition.onend = () => {
      recognitionRef.current = null;
      setListening(false);
    };
    try {
      recognition.start();
      setVoiceMessage('Listening…');
    } catch (error) {
      console.error('Could not start Sahayak voice input.', error);
      setVoiceMessage('Could not start voice input. Please try again.');
    }
  };
  startVoiceRef.current = startSpeechInput;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-[60] flex items-center gap-2 rounded-full bg-[#246B45] p-4 font-sans font-semibold text-white shadow-lg transition-colors hover:bg-[#1e5838]"
        aria-label="Open Sahayak AI farming assistant"
      >
        <Sprout className="h-5 w-5" />
        <span>Sahayak AI</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-[#26352B]/50 p-3 sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="sahayak-title"
            className="flex h-[min(580px,calc(100dvh-24px))] w-full max-w-xl flex-col justify-between overflow-hidden rounded-3xl border border-[#DFE5DA] bg-white p-6 shadow-2xl dark:bg-[#1A281F]"
          >
            <header className="flex shrink-0 items-center justify-between border-b border-[#DFE5DA] pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8EFE4] text-[#246B45]">
                  <Bot className="h-5 w-5" />
                </span>
                <div>
                  <h2 id="sahayak-title" className="font-serif text-xl font-bold">
                    Sahayak AI
                  </h2>
                  <p className="text-xs text-[#26352B]/65">
                    General guidance · verify important advice locally
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close Sahayak AI"
                className="rounded-xl p-2 text-[#26352B]/70 hover:bg-[#E8EFE4]"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto py-4">
              {messages.length === 0 && (
                <p className="rounded-2xl bg-[#F0F4EC] p-4 text-sm leading-6 text-[#26352B] dark:bg-[#233529] dark:text-[#E8EFE4]">
                  Ask about crop care, mandi references, or farmer schemes.
                  Speak in English, Hindi, or Marathi, or choose a quick topic.
                  {landAcres !== null && (
                    <span className="mt-1 block text-xs text-[#26352B]/70">
                      Profile context: {landAcres} acres · {farmerCategory}.
                    </span>
                  )}
                </p>
              )}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    message.role === 'farmer'
                      ? 'ml-auto bg-[#246B45] text-white'
                      : 'bg-[#F0F4EC] text-[#26352B] dark:bg-[#233529] dark:text-[#E8EFE4]'
                  }`}
                >
                  {message.text}
                  {message.role === 'assistant' && (
                    <button
                      type="button"
                      onClick={() => speakText(message.text)}
                      className="mt-2 flex items-center gap-1.5 rounded-lg bg-white/70 px-2.5 py-1.5 text-xs font-semibold text-[#246B45]"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                      🔊 Replay Voice
                    </button>
                  )}
                </div>
              ))}
              {busy && (
                <p role="status" className="text-xs text-[#26352B]/65">
                  Preparing guidance…
                </p>
              )}
            </div>

            <div className="shrink-0 space-y-4 border-t border-[#DFE5DA] pt-4">
              <div className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={listening ? () => recognitionRef.current?.stop() : startSpeechInput}
                  aria-label={listening ? 'Stop listening' : 'Start voice conversation'}
                  className={`relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#246B45] text-white shadow-lg transition-all active:scale-95 ${
                    listening ? 'bg-red-600' : 'hover:bg-[#1e5838]'
                  }`}
                >
                  {listening && (
                    <span className="absolute inset-0 animate-ping rounded-full border-2 border-red-500" />
                  )}
                  {listening ? (
                    <MicOff className="h-7 w-7" />
                  ) : (
                    <Mic className="h-7 w-7" />
                  )}
                </button>
                <span className="text-xs text-[#26352B]/65">
                  {listening
                    ? 'Listening… tap to stop'
                    : `Tap to speak · ${speechLanguage[language] ?? 'en-IN'}`}
                </span>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {quickQueries.map((query) => (
                  <button
                    key={query}
                    type="button"
                    onClick={() => sendMessage(query)}
                    disabled={busy}
                    className="rounded-full border border-[#DFE5DA] bg-[#F7F8F2] px-3 py-2 text-xs font-medium hover:bg-[#E8EFE4] disabled:opacity-50 dark:border-[#2B3E31] dark:bg-[#233529] dark:text-[#E8EFE4]"
                  >
                    {query}
                  </button>
                ))}
              </div>
              {voiceMessage && (
                <p role="status" className="text-xs text-[#26352B]/70">
                  {voiceMessage}
                </p>
              )}
            </div>
          </section>
        </div>
      )}
    </>
  );
}
