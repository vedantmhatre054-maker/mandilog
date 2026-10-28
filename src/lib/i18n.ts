'use client';

import {
  createContext,
  createElement,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export const languages = [
  { code: 'en', nativeName: 'English', englishName: 'English' },
  { code: 'hi', nativeName: 'हिन्दी', englishName: 'Hindi' },
  { code: 'mr', nativeName: 'मराठी', englishName: 'Marathi' },
  { code: 'pa', nativeName: 'ਪੰਜਾਬੀ', englishName: 'Punjabi' },
  { code: 'bn', nativeName: 'বাংলা', englishName: 'Bengali' },
  { code: 'gu', nativeName: 'ગુજરાતી', englishName: 'Gujarati' },
  { code: 'ta', nativeName: 'தமிழ்', englishName: 'Tamil' },
  { code: 'te', nativeName: 'తెలుగు', englishName: 'Telugu' },
  { code: 'kn', nativeName: 'ಕನ್ನಡ', englishName: 'Kannada' },
  { code: 'ml', nativeName: 'മലയാളം', englishName: 'Malayalam' },
  { code: 'or', nativeName: 'ଓଡ଼ିଆ', englishName: 'Odia' },
  { code: 'as', nativeName: 'অসমীয়া', englishName: 'Assamese' },
  { code: 'ur', nativeName: 'اردو', englishName: 'Urdu' },
  { code: 'sa', nativeName: 'संस्कृतम्', englishName: 'Sanskrit' },
  { code: 'kok', nativeName: 'कोंकणी', englishName: 'Konkani' },
  { code: 'mai', nativeName: 'मैथिली', englishName: 'Maithili' },
  { code: 'sat', nativeName: 'संथाली', englishName: 'Santali' },
  { code: 'doi', nativeName: 'डोगरी', englishName: 'Dogri' },
  { code: 'ne', nativeName: 'नेपाली', englishName: 'Nepali' },
  { code: 'ks', nativeName: 'کٲشُر', englishName: 'Kashmiri' },
  { code: 'brx', nativeName: 'बोडो', englishName: 'Bodo' },
  { code: 'sd', nativeName: 'سنڌي', englishName: 'Sindhi' },
] as const;

export type LanguageCode = (typeof languages)[number]['code'];

export function isLanguageCode(value: string): value is LanguageCode {
  return languages.some((item) => item.code === value);
}

export const translations = {
  en: {
    brandTagline: 'Sell smarter. Farm better. Grow together.',
    greeting: 'Namaste, Farmer!',
    sellCrop: 'Sell My Crop',
    marketPrices: 'Market Prices',
    cropDoctor: 'Crop Doctor',
    govtSchemes: 'Govt. Schemes',
    profitCalc: 'Profit Calculator',
    loginTitle: 'Farmer Login & Registration',
    getStarted: 'Get Started',
    enterPhone: 'Enter Mobile Number',
    yourName: 'Your Full Name',
    enterDashboard: 'Enter Dashboard',
    mobileNumber: 'Mobile Number',
    fullName: 'Full Name',
  },
  hi: {
    brandTagline: 'समझदारी से बेचें। बेहतर खेती करें। साथ मिलकर आगे बढ़ें।',
    greeting: 'नमस्ते, किसान!',
    sellCrop: 'मेरी फसल बेचें',
    marketPrices: 'मंडी भाव',
    cropDoctor: 'फसल डॉक्टर',
    govtSchemes: 'सरकारी योजनाएँ',
    profitCalc: 'मुनाफ़ा कैलकुलेटर',
    loginTitle: 'किसान लॉगिन और पंजीकरण',
    getStarted: 'शुरू करें',
    enterPhone: 'मोबाइल नंबर दर्ज करें',
    yourName: 'आपका पूरा नाम',
    enterDashboard: 'डैशबोर्ड पर जाएँ',
    mobileNumber: 'मोबाइल नंबर',
    fullName: 'पूरा नाम',
  },
  mr: {
    brandTagline: 'विचारपूर्वक विक्री करा. उत्तम शेती करा. एकत्र प्रगती करा.',
    greeting: 'नमस्कार, शेतकरी!',
    sellCrop: 'माझे पीक विका',
    marketPrices: 'बाजारभाव',
    cropDoctor: 'पीक डॉक्टर',
    govtSchemes: 'सरकारी योजना',
    profitCalc: 'नफा कॅल्क्युलेटर',
    loginTitle: 'शेतकरी लॉगिन आणि नोंदणी',
    getStarted: 'सुरू करा',
    enterPhone: 'मोबाइल क्रमांक टाका',
    yourName: 'तुमचे पूर्ण नाव',
    enterDashboard: 'डॅशबोर्डवर जा',
    mobileNumber: 'मोबाइल क्रमांक',
    fullName: 'पूर्ण नाव',
  },
  pa: {
    brandTagline: 'ਸਮਝਦਾਰੀ ਨਾਲ ਵੇਚੋ। ਵਧੀਆ ਖੇਤੀ ਕਰੋ। ਇਕੱਠੇ ਤਰੱਕੀ ਕਰੋ।',
    greeting: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ, ਕਿਸਾਨ!',
    sellCrop: 'ਮੇਰੀ ਫ਼ਸਲ ਵੇਚੋ',
    marketPrices: 'ਮੰਡੀ ਭਾਅ',
    cropDoctor: 'ਫ਼ਸਲ ਡਾਕਟਰ',
    govtSchemes: 'ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ',
    profitCalc: 'ਮੁਨਾਫ਼ਾ ਕੈਲਕੁਲੇਟਰ',
    loginTitle: 'ਕਿਸਾਨ ਲੌਗਇਨ ਅਤੇ ਰਜਿਸਟ੍ਰੇਸ਼ਨ',
    getStarted: 'ਸ਼ੁਰੂ ਕਰੋ',
    enterPhone: 'ਮੋਬਾਈਲ ਨੰਬਰ ਦਰਜ ਕਰੋ',
    yourName: 'ਤੁਹਾਡਾ ਪੂਰਾ ਨਾਮ',
    enterDashboard: 'ਡੈਸ਼ਬੋਰਡ ਖੋਲ੍ਹੋ',
    mobileNumber: 'ਮੋਬਾਈਲ ਨੰਬਰ',
    fullName: 'ਪੂਰਾ ਨਾਮ',
  },
  bn: {
    brandTagline: 'বুদ্ধি করে বিক্রি করুন। ভালো চাষ করুন। একসঙ্গে এগিয়ে চলুন।',
    greeting: 'নমস্কার, কৃষক!',
    sellCrop: 'আমার ফসল বিক্রি করুন',
    marketPrices: 'বাজারের দাম',
    cropDoctor: 'ফসলের ডাক্তার',
    govtSchemes: 'সরকারি প্রকল্প',
    profitCalc: 'লাভের হিসাব',
    loginTitle: 'কৃষক লগইন ও নিবন্ধন',
    getStarted: 'শুরু করুন',
    enterPhone: 'মোবাইল নম্বর লিখুন',
    yourName: 'আপনার পুরো নাম',
    enterDashboard: 'ড্যাশবোর্ডে যান',
    mobileNumber: 'মোবাইল নম্বর',
    fullName: 'পুরো নাম',
  },
  gu: {
    brandTagline: 'સમજદારીથી વેચો. સારી ખેતી કરો. સાથે મળીને આગળ વધો.',
    greeting: 'નમસ્તે, ખેડૂત!',
    sellCrop: 'મારો પાક વેચો',
    marketPrices: 'બજાર ભાવ',
    cropDoctor: 'પાક ડૉક્ટર',
    govtSchemes: 'સરકારી યોજનાઓ',
    profitCalc: 'નફાની ગણતરી',
    loginTitle: 'ખેડૂત લૉગિન અને નોંધણી',
    getStarted: 'શરૂ કરો',
    enterPhone: 'મોબાઇલ નંબર દાખલ કરો',
    yourName: 'તમારું પૂરું નામ',
    enterDashboard: 'ડેશબોર્ડ ખોલો',
    mobileNumber: 'મોબાઇલ નંબર',
    fullName: 'પૂરું નામ',
  },
  ta: {
    brandTagline: 'சிந்தித்து விற்கவும். சிறப்பாக விவசாயம் செய்யவும். ஒன்றாக வளரவும்.',
    greeting: 'வணக்கம், விவசாயியே!',
    sellCrop: 'என் பயிரை விற்கவும்',
    marketPrices: 'சந்தை விலைகள்',
    cropDoctor: 'பயிர் மருத்துவர்',
    govtSchemes: 'அரசுத் திட்டங்கள்',
    profitCalc: 'லாபக் கணக்கீடு',
    loginTitle: 'விவசாயி உள்நுழைவு மற்றும் பதிவு',
    getStarted: 'தொடங்குங்கள்',
    enterPhone: 'மொபைல் எண்ணை உள்ளிடவும்',
    yourName: 'உங்கள் முழுப் பெயர்',
    enterDashboard: 'டாஷ்போர்டுக்குச் செல்லவும்',
    mobileNumber: 'மொபைல் எண்',
    fullName: 'முழுப் பெயர்',
  },
  te: {
    brandTagline: 'తెలివిగా అమ్మండి. మెరుగ్గా సాగు చేయండి. కలిసి ఎదగండి.',
    greeting: 'నమస్కారం, రైతు!',
    sellCrop: 'నా పంటను అమ్మండి',
    marketPrices: 'మార్కెట్ ధరలు',
    cropDoctor: 'పంట వైద్యుడు',
    govtSchemes: 'ప్రభుత్వ పథకాలు',
    profitCalc: 'లాభాల లెక్కింపు',
    loginTitle: 'రైతు లాగిన్ మరియు నమోదు',
    getStarted: 'ప్రారంభించండి',
    enterPhone: 'మొబైల్ నంబర్ నమోదు చేయండి',
    yourName: 'మీ పూర్తి పేరు',
    enterDashboard: 'డాష్‌బోర్డ్‌కు వెళ్లండి',
    mobileNumber: 'మొబైల్ నంబర్',
    fullName: 'పూర్తి పేరు',
  },
  kn: {
    brandTagline: 'ಬುದ್ಧಿವಂತಿಕೆಯಿಂದ ಮಾರಿ. ಉತ್ತಮವಾಗಿ ಕೃಷಿ ಮಾಡಿ. ಒಟ್ಟಾಗಿ ಬೆಳೆಯಿರಿ.',
    greeting: 'ನಮಸ್ಕಾರ, ರೈತರೇ!',
    sellCrop: 'ನನ್ನ ಬೆಳೆ ಮಾರಿ',
    marketPrices: 'ಮಾರುಕಟ್ಟೆ ದರಗಳು',
    cropDoctor: 'ಬೆಳೆ ವೈದ್ಯ',
    govtSchemes: 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು',
    profitCalc: 'ಲಾಭದ ಲೆಕ್ಕಾಚಾರ',
    loginTitle: 'ರೈತರ ಲಾಗಿನ್ ಮತ್ತು ನೋಂದಣಿ',
    getStarted: 'ಪ್ರಾರಂಭಿಸಿ',
    enterPhone: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ',
    yourName: 'ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರು',
    enterDashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ತೆರೆಯಿರಿ',
    mobileNumber: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
    fullName: 'ಪೂರ್ಣ ಹೆಸರು',
  },
  ml: {
    brandTagline: 'ബുദ്ധിപൂർവം വിൽക്കൂ. മികച്ച കൃഷി ചെയ്യൂ. ഒരുമിച്ച് വളരൂ.',
    greeting: 'നമസ്കാരം, കർഷകരേ!',
    sellCrop: 'എന്റെ വിള വിൽക്കുക',
    marketPrices: 'വിപണി വിലകൾ',
    cropDoctor: 'വിള ഡോക്ടർ',
    govtSchemes: 'സർക്കാർ പദ്ധതികൾ',
    profitCalc: 'ലാഭ കണക്കുകൂട്ടൽ',
    loginTitle: 'കർഷക ലോഗിനും രജിസ്ട്രേഷനും',
    getStarted: 'തുടങ്ങുക',
    enterPhone: 'മൊബൈൽ നമ്പർ നൽകുക',
    yourName: 'നിങ്ങളുടെ മുഴുവൻ പേര്',
    enterDashboard: 'ഡാഷ്ബോർഡിലേക്ക് പോകുക',
    mobileNumber: 'മൊബൈൽ നമ്പർ',
    fullName: 'മുഴുവൻ പേര്',
  },
  or: {
    brandTagline: 'ବୁଝି ବିଚାରି ବିକ୍ରି କରନ୍ତୁ। ଭଲ ଚାଷ କରନ୍ତୁ। ଏକାଠି ବଢ଼ନ୍ତୁ।',
    greeting: 'ନମସ୍କାର, ଚାଷୀ!',
    sellCrop: 'ମୋ ଫସଲ ବିକ୍ରି କରନ୍ତୁ',
    marketPrices: 'ମଣ୍ଡି ଦର',
    cropDoctor: 'ଫସଲ ଡାକ୍ତର',
    govtSchemes: 'ସରକାରୀ ଯୋଜନା',
    profitCalc: 'ଲାଭ ହିସାବ',
    loginTitle: 'ଚାଷୀ ଲଗଇନ୍ ଏବଂ ପଞ୍ଜୀକରଣ',
    getStarted: 'ଆରମ୍ଭ କରନ୍ତୁ',
    enterPhone: 'ମୋବାଇଲ ନମ୍ବର ଲେଖନ୍ତୁ',
    yourName: 'ଆପଣଙ୍କ ପୂରା ନାମ',
    enterDashboard: 'ଡ୍ୟାସବୋର୍ଡକୁ ଯାଆନ୍ତୁ',
    mobileNumber: 'ମୋବାଇଲ ନମ୍ବର',
    fullName: 'ପୂରା ନାମ',
  },
  as: {
    brandTagline: 'বুজি-বাজি বিক্ৰী কৰক। ভাল খেতি কৰক। একেলগে আগবাঢ়ক।',
    greeting: 'নমস্কাৰ, কৃষক!',
    sellCrop: 'মোৰ শস্য বিক্ৰী কৰক',
    marketPrices: 'বজাৰৰ দাম',
    cropDoctor: 'শস্য চিকিৎসক',
    govtSchemes: 'চৰকাৰী আঁচনি',
    profitCalc: 'লাভৰ হিচাপ',
    loginTitle: 'কৃষকৰ লগইন আৰু পঞ্জীয়ন',
    getStarted: 'আৰম্ভ কৰক',
    enterPhone: 'ম’বাইল নম্বৰ দিয়ক',
    yourName: 'আপোনাৰ সম্পূৰ্ণ নাম',
    enterDashboard: 'ডেশ্বব’ৰ্ডলৈ যাওক',
    mobileNumber: 'ম’বাইল নম্বৰ',
    fullName: 'সম্পূৰ্ণ নাম',
  },
  ur: {
    brandTagline: 'سمجھداری سے بیچیں۔ بہتر کاشت کریں۔ مل کر ترقی کریں۔',
    greeting: 'نمستے، کسان!',
    sellCrop: 'میری فصل فروخت کریں',
    marketPrices: 'منڈی کے بھاؤ',
    cropDoctor: 'فصل کا ڈاکٹر',
    govtSchemes: 'سرکاری اسکیمیں',
    profitCalc: 'منافع کیلکولیٹر',
    loginTitle: 'کسان لاگ اِن اور رجسٹریشن',
    getStarted: 'شروع کریں',
    enterPhone: 'موبائل نمبر درج کریں',
    yourName: 'آپ کا پورا نام',
    enterDashboard: 'ڈیش بورڈ کھولیں',
    mobileNumber: 'موبائل نمبر',
    fullName: 'پورا نام',
  },
  sa: {
    brandTagline: 'विवेकेन विक्रीत। उत्तमं कृषिं कुरुत। सह वर्धताम्।',
    greeting: 'नमस्ते, कृषक!',
    sellCrop: 'मम सस्यं विक्रीणीत',
    marketPrices: 'विपणिमूल्यानि',
    cropDoctor: 'सस्यचिकित्सकः',
    govtSchemes: 'सर्वकारीययोजनाः',
    profitCalc: 'लाभगणना',
    loginTitle: 'कृषकस्य प्रवेशः पञ्जीकरणं च',
    getStarted: 'आरभताम्',
    enterPhone: 'दूरवाणीसंख्यां लिखतु',
    yourName: 'भवतः पूर्णं नाम',
    enterDashboard: 'नियन्त्रणफलकं प्रविशतु',
    mobileNumber: 'दूरवाणीसंख्या',
    fullName: 'पूर्णं नाम',
  },
  kok: {
    brandTagline: 'शहाणपणान विकचें. बरी शेती करची. एकठांय वाडचें.',
    greeting: 'नमस्कार, शेतकारा!',
    sellCrop: 'माजें पीक विकचें',
    marketPrices: 'बाजार भाव',
    cropDoctor: 'पीक डॉक्टर',
    govtSchemes: 'सरकारी येवजण्यो',
    profitCalc: 'नफ्याचो हिशेब',
    loginTitle: 'शेतकार लॉगिन आनी नोंदणी',
    getStarted: 'सुरू करचें',
    enterPhone: 'मोबायल नंबर घालचो',
    yourName: 'तुमचें पुराय नांव',
    enterDashboard: 'डॅशबोर्ड उगडचो',
    mobileNumber: 'मोबायल नंबर',
    fullName: 'पुराय नांव',
  },
  mai: {
    brandTagline: 'बुझि कऽ बेचू। नीक खेती करू। मिलि कऽ आगू बढ़ू।',
    greeting: 'नमस्कार, किसान!',
    sellCrop: 'अपन फसल बेचू',
    marketPrices: 'मंडी भाव',
    cropDoctor: 'फसल डॉक्टर',
    govtSchemes: 'सरकारी योजना',
    profitCalc: 'मुनाफा गणना',
    loginTitle: 'किसान लॉगिन आ पंजीकरण',
    getStarted: 'शुरू करू',
    enterPhone: 'मोबाइल नंबर लिखू',
    yourName: 'अहाँक पूरा नाम',
    enterDashboard: 'डैशबोर्ड पर जाउ',
    mobileNumber: 'मोबाइल नंबर',
    fullName: 'पूरा नाम',
  },
  sat: {
    brandTagline: 'ᱵᱩᱫᱷᱤ ᱛᱮ ᱟᱠᱷᱨᱤᱧ ᱵᱤᱠᱨᱤᱭᱟ। ᱵᱟᱹᱲᱛᱤ ᱪᱟᱥ ᱠᱟᱹᱢᱤᱭᱟ। ᱢᱤᱫ ᱥᱟᱶ ᱵᱟᱹᱲᱛᱤᱭᱟ।',
    greeting: 'ᱡᱚᱦᱟᱨ, ᱪᱟᱥᱤ!',
    sellCrop: 'ᱤᱧᱟᱜ ᱥᱟᱥᱟᱝ ᱟᱠᱷᱨᱤᱧ ᱵᱤᱠᱨᱤ',
    marketPrices: 'ᱵᱟᱡᱟᱨ ᱫᱚᱨ',
    cropDoctor: 'ᱥᱟᱥᱟᱝ ᱰᱟᱠᱛᱟᱨ',
    govtSchemes: 'ᱥᱚᱨᱠᱟᱨᱤ ᱭᱚᱡᱚᱱᱟ',
    profitCalc: 'ᱞᱟᱵᱷ ᱦᱤᱥᱟᱵ',
    loginTitle: 'ᱪᱟᱥᱤ ᱞᱚᱜᱤᱱ ᱟᱨ ᱨᱮᱡᱤᱥᱴᱨᱮᱥᱚᱱ',
    getStarted: 'ᱮᱦᱚᱵ ᱢᱮ',
    enterPhone: 'ᱢᱚᱵᱟᱭᱤᱞ ᱮᱞ ᱮᱢ ᱢᱮ',
    yourName: 'ᱟᱢᱟᱜ ᱯᱩᱨᱟᱹ ᱧᱩᱛᱩᱢ',
    enterDashboard: 'ᱰᱮᱥᱵᱚᱨᱰ ᱵᱚᱞᱚ ᱢᱮ',
    mobileNumber: 'ᱢᱚᱵᱟᱭᱤᱞ ᱮᱞ',
    fullName: 'ᱯᱩᱨᱟᱹ ᱧᱩᱛᱩᱢ',
  },
  doi: {
    brandTagline: 'सोच-समझियै बेचो। अच्छी खेती करो। इकठ्ठे अग्गें बधो।',
    greeting: 'नमस्कार, किसान!',
    sellCrop: 'मेरी फसल बेचो',
    marketPrices: 'मंडी दे भाव',
    cropDoctor: 'फसल डाक्टर',
    govtSchemes: 'सरकारी योजनां',
    profitCalc: 'मुनाफे दा हिसाब',
    loginTitle: 'किसान लॉगइन ते पंजीकरण',
    getStarted: 'शुरू करो',
    enterPhone: 'मोबाइल नंबर दर्ज करो',
    yourName: 'तुंदा पूरा नां',
    enterDashboard: 'डैशबोर्ड खोलो',
    mobileNumber: 'मोबाइल नंबर',
    fullName: 'पूरा नां',
  },
  ne: {
    brandTagline: 'बुझेर बेच्नुहोस्। राम्रो खेती गर्नुहोस्। सँगै अघि बढ्नुहोस्।',
    greeting: 'नमस्कार, किसान!',
    sellCrop: 'मेरो बाली बेच्नुहोस्',
    marketPrices: 'बजार मूल्य',
    cropDoctor: 'बाली डाक्टर',
    govtSchemes: 'सरकारी योजनाहरू',
    profitCalc: 'नाफा हिसाब',
    loginTitle: 'किसान लगइन र दर्ता',
    getStarted: 'सुरु गर्नुहोस्',
    enterPhone: 'मोबाइल नम्बर राख्नुहोस्',
    yourName: 'तपाईंको पूरा नाम',
    enterDashboard: 'ड्यासबोर्ड खोल्नुहोस्',
    mobileNumber: 'मोबाइल नम्बर',
    fullName: 'पूरा नाम',
  },
  ks: {
    brandTagline: 'عقٕل سۭتۍ وِکرِو۔ بہتر کٔرِو کِسانی۔ اَکھ سۭتۍ بٔڑھِو۔',
    greeting: 'نمستے، کسان!',
    sellCrop: 'میٛون فصل وِکرِو',
    marketPrices: 'بازار قیمت',
    cropDoctor: 'فصل ڈاکٹر',
    govtSchemes: 'سرکاری سکیم',
    profitCalc: 'منافع حساب',
    loginTitle: 'کسان لاگ اِن تہٕ رجسٹریشن',
    getStarted: 'شروع کٔرِو',
    enterPhone: 'موبائل نمبر درج کٔرِو',
    yourName: 'تُہند پورٕ ناو',
    enterDashboard: 'ڈیش بورڈ کھولِو',
    mobileNumber: 'موبائل نمبر',
    fullName: 'پورٕ ناو',
  },
  brx: {
    brandTagline: 'बुजिनानै बेखौ। मोजां खेति खालाम। लोगोसे बारग\'।',
    greeting: 'नमस्कार, आबादारि!',
    sellCrop: 'आंनि फसलखौ बे',
    marketPrices: 'बाजारनि दाम',
    cropDoctor: 'फसल डाक्टर',
    govtSchemes: 'सरकारि स्कीम',
    profitCalc: 'लाबनि हिसाब',
    loginTitle: 'आबादारि लगिन आरो रेजिस्टेसन',
    getStarted: 'जागाय',
    enterPhone: 'मबाइल नम्बर हो',
    yourName: 'नोंथांनि आबुं मुं',
    enterDashboard: 'डेशबर्ड खोल',
    mobileNumber: 'मबाइल नम्बर',
    fullName: 'आबुं मुं',
  },
  sd: {
    brandTagline: 'سمجهه سان وڪڻو. بهتر پوکيو. گڏجي وڌو.',
    greeting: 'نمستي، هاري!',
    sellCrop: 'منهنجو فصل وڪڻو',
    marketPrices: 'منڊي جا اگهه',
    cropDoctor: 'فصل جو ڊاڪٽر',
    govtSchemes: 'سرڪاري رٿائون',
    profitCalc: 'نفعي جو حساب',
    loginTitle: 'هاري لاگ ان ۽ رجسٽريشن',
    getStarted: 'شروع ڪريو',
    enterPhone: 'موبائل نمبر داخل ڪريو',
    yourName: 'توهان جو پورو نالو',
    enterDashboard: 'ڊيش بورڊ کوليو',
    mobileNumber: 'موبائل نمبر',
    fullName: 'پورو نالو',
  },
} satisfies Record<
  LanguageCode,
  {
    brandTagline: string;
    greeting: string;
    sellCrop: string;
    marketPrices: string;
    cropDoctor: string;
    govtSchemes: string;
    profitCalc: string;
    loginTitle: string;
    getStarted: string;
    enterPhone: string;
    yourName: string;
    enterDashboard: string;
    mobileNumber: string;
    fullName: string;
  }
>;

type TranslationKey = keyof (typeof translations)['en'];

interface LanguageContextValue {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);
const LANGUAGE_STORAGE_KEY = 'mandilog-language';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>('en');

  useEffect(() => {
    try {
      const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (storedLanguage && isLanguageCode(storedLanguage)) {
        setLanguageState(storedLanguage);
        return;
      }

      const storedProfile = window.localStorage.getItem('mandilog-profile');
      if (storedProfile) {
        const profile: unknown = JSON.parse(storedProfile);
        if (
          typeof profile === 'object' &&
          profile !== null &&
          'language' in profile &&
          typeof profile.language === 'string' &&
          isLanguageCode(profile.language)
        ) {
          setLanguageState(profile.language);
        }
      }
    } catch (error) {
      console.error('Could not restore the saved MandiLog language.', error);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ur' || language === 'sd' || language === 'ks' ? 'rtl' : 'ltr';
  }, [language]);

  const setLanguage = (nextLanguage: LanguageCode) => {
    setLanguageState(nextLanguage);
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    } catch (error) {
      console.error('Could not save the MandiLog language preference.', error);
    }
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: (key: TranslationKey) => translations[language][key],
    }),
    [language],
  );

  return createElement(LanguageContext.Provider, { value }, children);
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
