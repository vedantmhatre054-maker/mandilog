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

type VoiceStatus = 'idle' | 'preparing' | 'speaking';

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

function answerQuestion(question: string, language: string) {
  const query = question.toLowerCase();
  const isHindi = language === 'hi';
  const isMarathi = language === 'mr';

  if (/scheme|subsidy|yojana|pm.?kisan|drip|योजना|अनुदान|महाडीबीटी/i.test(query)) {
    if (isHindi) {
      return 'आप PM-Kisan के ₹6,000 वार्षिक लाभ और Maharashtra MahaDBT drip-irrigation सहायता के लिए पात्रता जाँच सकते हैं; कुछ योजनाओं में सहायता 80% तक हो सकती है। पात्रता और राशि वर्तमान नियमों पर निर्भर करती है। Govt. Schemes टैब और आधिकारिक पोर्टल पर पुष्टि करें।';
    }
    if (isMarathi) {
      return 'PM-Kisan च्या वार्षिक ₹6,000 लाभासाठी आणि Maharashtra MahaDBT drip-irrigation सहाय्यासाठी पात्रता तपासा; काही योजनांमध्ये 80% पर्यंत मदत असू शकते. पात्रता आणि रक्कम सध्याच्या नियमांवर अवलंबून असते. Govt. Schemes टॅब आणि अधिकृत पोर्टलवर खात्री करा.';
    }
    return 'You may qualify for PM-Kisan (₹6,000 yearly for eligible families) and Maharashtra MahaDBT drip-irrigation support; some schemes provide up to 80% assistance. Eligibility and amounts depend on current rules and your application. Open the Govt. Schemes tab and confirm on the official portal.';
  }

  if (/blight|disease|rog|spray|pest|tomato|टमाटर|टोमॅटो|करपा|रोग|फवारणी|कीड/i.test(query)) {
    if (isHindi) {
      return 'टमाटर में अर्ली ब्लाइट के लक्षण हों तो प्रभावित पत्तियाँ हटाएँ और पौधों को सूखा रखें। Mancozeb 75% WP @ 2 g/L तभी इस्तेमाल करें जब आपके उत्पाद के टमाटर वाले लेबल पर यही मात्रा हो और स्थानीय सलाह इसकी पुष्टि करे; जैविक विकल्प के रूप में Neem तेल पर विचार करें। विस्तृत जाँच के लिए AI Crop Doctor खोलें।';
    }
    if (isMarathi) {
      return 'टोमॅटोवर अर्ली ब्लाइटची लक्षणे दिसल्यास बाधित पाने काढा आणि झाडे कोरडी ठेवा. Mancozeb 75% WP @ 2 g/L फक्त तुमच्या उत्पादनाच्या टोमॅटो लेबलवर ही मात्रा दिली असल्यास आणि स्थानिक कृषी सल्ल्याने पुष्टी केल्यास वापरा; सेंद्रिय पर्याय म्हणून कडुनिंब तेलाचा विचार करा. तपशीलवार तपासणीसाठी AI Crop Doctor उघडा.';
    }
    return 'If tomato early blight symptoms are present, remove affected leaves and keep foliage dry. Use Mancozeb 75% WP at 2 g/L only if that dose is on your product’s tomato label and confirmed by local agricultural guidance; neem oil is an organic option to discuss. Open AI Crop Doctor for a closer symptom check.';
  }

  if (/price|bhav|rate|mandi|junnar|भाव|दर|किंमत|मंडी/i.test(query)) {
    if (isHindi) {
      return 'MandiLog पर Junnar ₹2,400 और Pune ₹2,800 प्रति क्विंटल के संदर्भ भाव दिखाए जा सकते हैं; इन्हें आज का लाइव भाव न मानें। तारीख और स्रोत की पुष्टि के लिए Market Prices टैब देखें और खरीद-बिक्री से पहले APMC से जाँचें।';
    }
    if (isMarathi) {
      return 'MandiLog वर Junnar ₹2,400 आणि Pune ₹2,800 प्रति क्विंटल असे संदर्भ दर दिसू शकतात; ते आजचे थेट दर आहेत असे समजू नका. तारीख आणि स्रोतासाठी Market Prices टॅब पाहा आणि व्यवहारापूर्वी APMC कडून खात्री करा.';
    }
    return 'MandiLog may show reference rates of ₹2,400 per quintal in Junnar and ₹2,800 in Pune; these are not verified live prices. Check the Market Prices tab for the source and reporting date, and confirm with the APMC before trading.';
  }

  if (/hello|namaste|namaskar|madat|help|नमस्ते|नमस्कार|मदत|मदद/i.test(query)) {
    if (isHindi) {
      return 'नमस्ते! मैं आपका सहायक खेती सलाहकार हूँ। मंडी भाव, फसल की बीमारी, सरकारी योजनाओं या परिवहन बुकिंग के बारे में पूछें।';
    }
    if (isMarathi) {
      return 'नमस्कार! मी तुमचा सहाय्यक शेती मार्गदर्शक आहे. बाजारभाव, पिकांचे रोग, सरकारी योजना किंवा वाहतूक बुकिंगबद्दल विचारा.';
    }
    return 'Namaste! I am your Sahayak farming assistant. Ask me about mandi rates, crop diseases, government subsidies, or transport booking.';
  }

  if (/black soil|rabi|काली मिट्टी|रबी|काळी माती/i.test(query)) {
    if (isHindi) {
      return 'काली मिट्टी में रबी की फसल जल निकासी, सिंचाई और स्थानीय मौसम पर निर्भर करती है। गेहूँ या चना चुनने से पहले स्थानीय कृषि अधिकारी से सलाह लें।';
    }
    if (isMarathi) {
      return 'काळ्या मातीत रब्बी पीक निवडताना निचरा, सिंचन आणि स्थानिक हवामान विचारात घ्या. गहू किंवा हरभरा निवडण्यापूर्वी स्थानिक कृषी अधिकाऱ्यांचा सल्ला घ्या.';
    }
    return 'Rabi crop choice on black soil depends on drainage, irrigation and local weather. Discuss options such as wheat or chickpea with your local agricultural extension officer.';
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
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>('idle');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [voiceMessage, setVoiceMessage] = useState('');
  const [listening, setListening] = useState(false);
  const [landAcres, setLandAcres] = useState<number | null>(null);
  const [farmerCategory, setFarmerCategory] = useState('General');
  const recognitionRef = useRef<Recognition | null>(null);
  const startVoiceRef = useRef<() => void>(() => undefined);
  const availableVoicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const speechGenerationRef = useRef(0);
  const speechWatchdogRef = useRef<number | null>(null);

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    const synthesis = window.speechSynthesis;
    const previousHandler = synthesis.onvoiceschanged;
    const updateVoices = (event: Event) => {
      availableVoicesRef.current = synthesis.getVoices();
      previousHandler?.call(synthesis, event);
    };
    availableVoicesRef.current = synthesis.getVoices();
    synthesis.onvoiceschanged = updateVoices;

    return () => {
      if (synthesis.onvoiceschanged === updateVoices) {
        synthesis.onvoiceschanged = previousHandler;
      }
      if (speechWatchdogRef.current !== null) {
        window.clearTimeout(speechWatchdogRef.current);
      }
      speechGenerationRef.current += 1;
      synthesis.cancel();
    };
  }, []);

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
      setVoiceStatus('idle');
      setVoiceMessage('Voice playback is not supported in this browser.');
      return;
    }
    const synthesis = window.speechSynthesis;
    const generation = ++speechGenerationRef.current;
    if (speechWatchdogRef.current !== null) {
      window.clearTimeout(speechWatchdogRef.current);
      speechWatchdogRef.current = null;
    }
    synthesis.cancel();
    setVoiceStatus('preparing');
    const voices = synthesis.getVoices();
    if (voices.length > 0) availableVoicesRef.current = voices;

    const utterance = new SpeechSynthesisUtterance(text);
    const targetLanguage = speechLanguage[language] ?? 'en-IN';
    const normalizedTarget = targetLanguage.toLowerCase();
    const targetPrefix = normalizedTarget.split('-')[0];
    const voice =
      availableVoicesRef.current.find(
        (candidate) => candidate.lang.toLowerCase() === normalizedTarget,
      ) ??
      availableVoicesRef.current.find((candidate) =>
        candidate.lang.toLowerCase().startsWith(`${targetPrefix}-`),
      ) ??
      ['en-IN', 'hi', 'en-US']
        .map((fallback) =>
          availableVoicesRef.current.find(
            (candidate) => candidate.lang.toLowerCase() === fallback.toLowerCase(),
          ),
        )
        .find((candidate) => candidate !== undefined) ??
      availableVoicesRef.current[0];

    utterance.lang = voice?.lang ?? targetLanguage;
    if (voice) utterance.voice = voice;
    const clearWatchdog = () => {
      if (speechWatchdogRef.current !== null) {
        window.clearTimeout(speechWatchdogRef.current);
        speechWatchdogRef.current = null;
      }
    };
    const armWatchdog = (timeoutMs: number) => {
      clearWatchdog();
      speechWatchdogRef.current = window.setTimeout(() => {
        if (speechGenerationRef.current !== generation) return;
        speechGenerationRef.current += 1;
        synthesis.cancel();
        setVoiceStatus('idle');
        setVoiceMessage('Voice playback stalled. Tap Replay Voice to try again.');
        speechWatchdogRef.current = null;
      }, timeoutMs);
    };
    utterance.onstart = () => {
      if (speechGenerationRef.current === generation) {
        setVoiceStatus('speaking');
        setVoiceMessage('Speaking your answer…');
        armWatchdog(
          Math.min(60_000, Math.max(12_000, text.trim().split(/\s+/).length * 500)),
        );
      }
    };
    utterance.onend = () => {
      if (speechGenerationRef.current === generation) {
        clearWatchdog();
        setVoiceStatus('idle');
        setVoiceMessage('');
      }
    };
    utterance.onerror = (event) => {
      if (speechGenerationRef.current === generation) {
        clearWatchdog();
        setVoiceStatus('idle');
        setVoiceMessage(`Voice playback failed (${event.error}). You can tap Replay Voice to try again.`);
      }
    };

    try {
      armWatchdog(10_000);
      synthesis.speak(utterance);
    } catch (error) {
      if (speechGenerationRef.current === generation) {
        clearWatchdog();
        setVoiceStatus('idle');
        setVoiceMessage('Could not start voice playback. Please try again.');
      }
      console.error('Could not speak the Sahayak response.', error);
    }
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
      const answer = answerQuestion(trimmed, language);
      setMessages((current) => [
        ...current,
        { id: `${Date.now()}-assistant`, role: 'assistant', text: answer },
      ]);
      speakText(answer);
      setBusy(false);
    }, 180);
  };

  const startSpeechInput = () => {
    if ('speechSynthesis' in window) {
      speechGenerationRef.current += 1;
      if (speechWatchdogRef.current !== null) {
        window.clearTimeout(speechWatchdogRef.current);
        speechWatchdogRef.current = null;
      }
      window.speechSynthesis.cancel();
      setVoiceStatus('idle');
    }

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
      const normalizedCommand = command
        .trim()
        .replace(/[?.!]/g, '')
        .replace(/\s+/g, ' ');
      const hasCommand = (...terms: string[]) =>
        terms.some((term) => normalizedCommand.includes(term));
      const destination =
        ['prices', 'price', 'bhav', 'bhav sanga', 'भाव', 'भाव सांगा'].includes(
          normalizedCommand,
        ) ||
        hasCommand('open prices', 'open market prices', 'prices page', 'go to prices', 'बाजारभाव उघडा')
        ? { path: '/prices', en: 'Opening market prices.', hi: 'मंडी भाव खोल रहा हूँ।', mr: 'बाजारभाव उघडत आहे.' }
        : ['doctor', 'rog', 'crop doctor', 'रोग', 'डॉक्टर', 'पीक डॉक्टर'].includes(
              normalizedCommand,
            ) ||
            hasCommand('open crop doctor', 'open doctor', 'go to crop doctor')
          ? { path: '/crop-doctor', en: 'Opening Crop Doctor.', hi: 'फसल डॉक्टर खोल रहा हूँ।', mr: 'पीक डॉक्टर उघडत आहे.' }
          : ['calculator', 'nafa', 'profit', 'नफा', 'मुनाफा'].includes(
                normalizedCommand,
              ) ||
              hasCommand('open calculator', 'open profit calculator', 'go to calculator')
            ? { path: '/calculator', en: 'Opening the profit calculator.', hi: 'लाभ कैलकुलेटर खोल रहा हूँ।', mr: 'नफा कॅल्क्युलेटर उघडत आहे.' }
            : ['auction', 'boli', 'बोली', 'लिलाव'].includes(normalizedCommand) ||
                hasCommand('open auction', 'open marketplace', 'go to marketplace')
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
        speakText(confirmation);
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
              {(busy || voiceStatus !== 'idle') && (
                <p role="status" className="text-xs text-[#26352B]/65">
                  {busy
                    ? 'Preparing guidance…'
                    : voiceStatus === 'preparing'
                      ? 'Preparing spoken guidance…'
                      : 'Speaking your answer…'}
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
