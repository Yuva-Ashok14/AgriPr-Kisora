import { useEffect, useRef, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Leaf, MapPin, CloudRain, Thermometer, Droplets, Wind,
  Camera, Image as ImageIcon, Sparkles, Clock, ShieldCheck,
  AlertTriangle, ChevronDown, Globe, ScanLine, Sun, Cloud,
  CloudSun, X, ArrowUpRight, Mic, RotateCcw, Phone,
  Eye, Brain, CheckCircle2, Timer, Navigation, Volume2,
  MapPinned, Flower2, Search, LocateFixed, Earth, Building2, ArrowRight, Waves, Languages
} from 'lucide-react'

type AppState = 'idle' | 'preview' | 'analyzing' | 'result' | 'low'
type Lang = 'TE' | 'EN' | 'HI' | 'TA' | 'KN' | 'ML'
type Scope = 'vijayawada' | 'india' | 'world'

const VILLAGES = [
  { id: 'bza', en: 'Vijayawada', te: 'విజయవాడ', hi: 'विजयवाड़ा', ta: 'விஜயவாடா', kn: 'ವಿಜಯವಾಡ', ml: 'വിജയവാഡ', mandal: 'NTR', coords: '16.51°N, 80.63°E', dist: 'NTR' },
  { id: 'gnv', en: 'Gannavaram', te: 'గన్నవరం', hi: 'गन्नवरम', ta: 'கன்னவரம்', kn: 'ಗನ್ನವರಂ', ml: 'ഗന്നവരം', mandal: 'Gannavaram', coords: '16.54°N, 80.80°E', dist: 'Krishna' },
  { id: 'knk', en: 'Kanchikacherla', te: 'కంచికచర్ల', hi: 'कंचिकचेरला', ta: 'காஞ்சிகச்சர்லா', kn: 'ಕಂಚಿಕಚರ್ಲ', ml: 'കാഞ്ചികച്ചർല', mandal: 'Kanchikacherla', coords: '16.68°N, 80.38°E', dist: 'NTR' },
  { id: 'nuz', en: 'Nuzvid', te: 'నూజివీడు', hi: 'नूज़वीडु', ta: 'நுஸ்வீடு', kn: 'ನೂಜಿವೀಡು', ml: 'നൂസ്വീഡ്', mandal: 'Nuzvid', coords: '16.78°N, 80.84°E', dist: 'Krishna' },
  { id: 'gud', en: 'Gudivada', te: 'గుడివాడ', hi: 'गुडीवाड़ा', ta: 'குடிவாடா', kn: 'ಗುಡಿವಾಡ', ml: 'ഗുഡിവാഡ', mandal: 'Gudivada', coords: '16.43°N, 80.99°E', dist: 'Krishna' },
  { id: 'myl', en: 'Mylavaram', te: 'మైలవరం', hi: 'मैलवरम', ta: 'மைலவரம்', kn: 'ಮೈಲವರಂ', ml: 'മൈലവരം', mandal: 'Mylavaram', coords: '16.77°N, 80.64°E', dist: 'NTR' },
  { id: 'pen', en: 'Penamaluru', te: 'పెనమలూరు', hi: 'पेनमलूरु', ta: 'பெனமலூரு', kn: 'ಪೆನಮಲೂರು', ml: 'പെനമലൂരു', mandal: 'Penamaluru', coords: '16.47°N, 80.68°E', dist: 'Krishna' },
  { id: 'ibp', en: 'Ibrahimpatnam', te: 'ఇబ్రహీంపట్నం', hi: 'इब्राहिमपटनम', ta: 'இப்ராஹிம்பட்னம்', kn: 'ಇಬ್ರಾಹಿಂಪಟ್ನಂ', ml: 'ഇബ്രാഹിംപട്നം', mandal: 'Ibrahimpatnam', coords: '16.60°N, 80.36°E', dist: 'NTR' },
  { id: 'vuy', en: 'Vuyyuru', te: 'వుయ్యూరు', hi: 'वुय्यूरु', ta: 'வுய்யூரு', kn: 'ವುಯ್ಯೂರು', ml: 'വുയ്യൂരു', mandal: 'Vuyyuru', coords: '16.36°N, 80.84°E', dist: 'Krishna' },
  { id: 'tiru', en: 'Tiruvuru', te: 'తిరువూరు', hi: 'तिरुवूरु', ta: 'திருவூரு', kn: 'ತಿರುವೂರು', ml: 'തിരുവൂരു', mandal: 'Tiruvuru', coords: '17.10°N, 80.60°E', dist: 'NTR' },
]

const INDIA_CITIES = [
  { en: 'Guntur', te: 'గుంటూరు', hi: 'गुंटूर', coords: '16.30°N, 80.44°E', state: 'AP' },
  { en: 'Rajahmundry', te: 'రాజమండ్రి', hi: 'राजमुंदरी', coords: '17.01°N, 81.77°E', state: 'AP' },
  { en: 'Visakhapatnam', te: 'విశాఖపట్నం', hi: 'विशाखापत्तनम', coords: '17.68°N, 83.21°E', state: 'AP' },
  { en: 'Hyderabad', te: 'హైదరాబాద్', hi: 'हैदराबाद', coords: '17.38°N, 78.48°E', state: 'TG' },
  { en: 'Kurnool', te: 'కర్నూలు', hi: 'कुरनूल', coords: '15.82°N, 78.03°E', state: 'AP' },
  { en: 'Chennai', te: 'చెన్నై', hi: 'चेन्नई', coords: '13.08°N, 80.27°E', state: 'TN' },
  { en: 'Bengaluru', te: 'బెంగళూరు', hi: 'बेंगलुरु', coords: '12.97°N, 77.59°E', state: 'KA' },
  { en: 'Mumbai', te: 'मुंबई', hi: 'मुंबई', coords: '19.07°N, 72.87°E', state: 'MH' },
  { en: 'Delhi', te: 'ढिल्ली', hi: 'दिल्ली', coords: '28.61°N, 77.20°E', state: 'DL' },
  { en: 'Kolkata', te: 'कोलकाता', hi: 'कोलकाता', coords: '22.57°N, 88.36°E', state: 'WB' },
]

const WORLD_CITIES = [
  { en: 'Nairobi, Kenya', coords: '1.29°S, 36.82°E', country: 'Kenya' },
  { en: 'Hanoi, Vietnam', coords: '21.02°N, 105.83°E', country: 'Vietnam' },
  { en: 'Lagos, Nigeria', coords: '6.52°N, 3.37°E', country: 'Nigeria' },
  { en: 'São Paulo, Brazil', coords: '23.55°S, 46.63°W', country: 'Brazil' },
  { en: 'California, USA', coords: '36.77°N, 119.41°W', country: 'USA' },
  { en: 'Punjab, Pakistan', coords: '31.17°N, 72.70°E', country: 'Pakistan' },
]

const WEATHER = {
  now: { temp: 34, hum: 71, rain: 64, wind: 14, condTe: 'పాక్షిక మేఘాలు', condEn: 'Partly Cloudy', condHi: 'आंशिक बादल', condTa: 'மேகமூட்டம்', condKn: 'ಭಾಗಶಃ ಮೋಡ', condMl: 'ഭാഗികമായി മേഘാവൃതം' },
  hourly: [
    { hTe: 'ఇప్పుడు', hEn: 'Now', hHi: 'अभी', hTa: 'இப்போது', hKn: 'ಈಗ', hMl: 'ഇപ്പോൾ', t: 34, r: 8, icon: 'cloudsun' },
    { hTe: 'మ 2', hEn: '2 PM', hHi: '2 PM', hTa: '2 PM', hKn: '2 PM', hMl: '2 PM', t: 36, r: 12, icon: 'sun' },
    { hTe: 'సా 4', hEn: '4 PM', hHi: '4 PM', hTa: '4 PM', hKn: '4 PM', hMl: '4 PM', t: 35, r: 42, icon: 'cloud' },
    { hTe: 'సా 6', hEn: '6 PM', hHi: '6 PM', hTa: '6 PM', hKn: '6 PM', hMl: '6 PM', t: 32, r: 64, icon: 'rain' },
    { hTe: 'రా 9', hEn: '9 PM', hHi: '9 PM', hTa: '9 PM', hKn: '9 PM', hMl: '9 PM', t: 28, r: 58, icon: 'rain' },
    { hTe: 'ఉ 6', hEn: '6 AM', hHi: '6 AM', hTa: '6 AM', hKn: '6 AM', hMl: '6 AM', t: 26, r: 6, icon: 'sun' },
    { hTe: 'ఉ 9', hEn: '9 AM', hHi: '9 AM', hTa: '9 AM', hKn: '9 AM', hMl: '9 AM', t: 29, r: 4, icon: 'sun' },
    { hTe: 'మ 12', hEn: '12 PM', hHi: '12 PM', hTa: '12 PM', hKn: '12 PM', hMl: '12 PM', t: 33, r: 10, icon: 'cloudsun' },
  ]
}

const LANGS: { code: Lang, label: string, native: string, short: string }[] = [
  { code: 'TE', label: 'Telugu', native: 'తెలుగు', short: 'తె' },
  { code: 'EN', label: 'English', native: 'English', short: 'EN' },
  { code: 'HI', label: 'Hindi', native: 'हिन्दी', short: 'हि' },
  { code: 'TA', label: 'Tamil', native: 'தமிழ்', short: 'த' },
  { code: 'KN', label: 'Kannada', native: 'ಕನ್ನಡ', short: 'ಕ' },
  { code: 'ML', label: 'Malayalam', native: 'മലയാളം', short: 'മ' },
]

const T: Record<Lang, any> = {
  TE: {
    see: "చూడండి.", sense: "గ్రహించండి.", decide: "నిర్ణయించండి.",
    tagline: "విజయవాడ రైతుల కోసం — AI + వాతావరణ సలహా · ప్రపంచంలో ఎక్కడైనా",
    builtFor: "NTR & కృష్ణా నుండి ప్రపంచం వరకు",
    aiWeather: "AI+వాతావరణం", langLabel: "భాష", locationAuto: "ఆటో-గుర్తింపు", liveWeather: "● ప్రత్యక్ష వాతావరణం",
    heroTitle1: "నీ పంటను", heroTitle2: "చూపించు.", heroSub: "ఒక్క ఆకును దగ్గరగా, వెలుగులో తీయండి. ఫ్రేమ్ నిండా ఉండాలి.",
    listen: "వినండి", stopVoice: "ఆపు", drop: "ఆకు ఫోటోను ఇక్కడ వదలండి", orUse: "లేదా క్రింది బటన్లతో తీయండి",
    upload: "ఫోటో అప్‌లోడ్", takePhoto: "ఫోటో తీయండి", fileHint: "JPG / PNG · 10 MB · లాగిన్ వద్దు", private: "స్కాన్ ఫోన్‌లోనే — ఫోటో బయటకు వెళ్లదు",
    temp: "ఉష్ణోగ్రత", humidity: "తేమ", rain: "వర్షం", updates: "ప్రతి 10 నిమిషాలకు అప్‌డేట్",
    analyze: "నా పంటను పరీక్షించు", analyzing: "పరిశీలిస్తున్నాం…", noAccount: "ఖాతా వద్దు", offline: "ఆఫ్‌లైన్", voiceOut: "తెలుగు వాయిస్",
    waiting: "ఆకు ఫోటో కోసం వేచి ఉన్నాం", readyTitle1: "పొలం సలహాదారు", readyTitle2: "సిద్ధంగా ఉన్నాడు.", readyDesc: "ఎడమవైపు ఆకు ఫోటో పెట్టండి. Kisora ఆకు + మీ ఊరు + వాతావరణం కలిపి — ఏమి చేయాలో, ఎప్పుడు చేయాలో స్పష్టంగా చెబుతుంది.",
    whatWrong: "ఏమి జబ్బు?", whatWrongDesc: "జబ్బు పేరు + నమ్మకం.", whatToDoCard: "ఏం చేయాలి?", whatToDoDesc: "3 సులభ అడుగులు.", whenToActCard: "ఎప్పుడు చేయాలి?", whenDesc: "వాతావరణం చూసి సరైన సమయం.",
    next12: "తదుపరి 12 గంటలు", safetyShort: "స్థానిక వ్యవసాయ సలహా, మందు లేబుల్ పాటించండి.", readyToSense: "సెన్స్‌కు సిద్ధం", greatLeaf: "బాగుంది — ఆకు స్పష్టంగా ఉంది.", tapAnalyze: "పరీక్షించు నొక్కితే AI + వాతావరణం కలిపి సలహా వస్తుంది.",
    seeLeaf: "చూడండి", senseWeather: "వాతావరణం", senseLocation: "ప్రాంతం", leafInFrame: "ఆకు ఫ్రేమ్‌లో",
    tipTitle: "చిట్కా:", tipDesc: "ఫోటో మసకగా ఉంటే మళ్లీ తీయండి. ఒక ఫోటోకు ఒక ఆకే ఉత్తమం.",
    sensingTitle: "సెన్సింగ్ — 3 సంకేతాలు", analyzingCrop: "మీ పంటను పరిశీలిస్తున్నాం…", sec: "~3 సెకన్లు",
    seeLeafStep: "చూడండి — ఆకు", senseWeatherStep: "గ్రహించండి — వాతావరణం", senseLocationStep: "గ్రహించండి — ప్రాంతం",
    detectingSpots: "మచ్చలు చూస్తున్నాం", rainCheck: "వర్ష తనిఖీ", microClimate: "కృష్ణా డెల్టా", confidence: "AI నమ్మకం", severity: "తీవ్రత", whatISee: "నేను చూసింది", signs: "సంకేతాలు",
    listenExp: "వివరణ వినండి", stopNarration: "ఆపు", whatToDo: "ఏం చేయాలి", stepsMin: "అడుగులు · 20 నిమి", whyWait: "ఎందుకు ఆగాలి?", bestWindow: "ఉత్తమ సమయం — వాతావరణం ప్రకారం",
    countdown: "కౌంట్‌డౌన్", hoursToWindow: "గంటల్లో", remindShift: "వాతావరణం మారితే గుర్తు చేస్తాం.", setReminder: "రిమైండర్ పెట్టు",
    weatherOutlook: "వాతావరణ అంచనా", next24: "తదుపరి 24 గం", tempMin: "°C · కనిష్ట 26°", highRisk: "అధిక రిస్క్", calm: "ప్రశాంతం",
    rainPeak: "సాయంత్రం 6–9 వర్షం గరిష్టం. రేపు ఉదయం ఉత్తమం.", powered: "IMD + సూక్ష్మ వాతావరణం",
    safety: "భద్రత:", safetyLong: "స్థానిక సలహా పాటించండి. 24 గం పిల్లలు/పశువులు దూరంగా.", newScan: "కొత్త స్కాన్", talkExpert: "నిపుణుడితో మాట్లాడు",
    lowTitle1: "సురక్షితంగా నిర్ధారించే", lowTitle2: "నమ్మకం లేదు.", lowDesc: "ఫోటో మసక / నీడలో ఉంది. వెలుగులో మరో ఫోటో తీయండి.",
    tooLow: "42% — తక్కువ", fillFrame: "ఫ్రేమ్ నిండా", fillDesc: "ఒక ఆకు, దగ్గరగా", useDaylight: "పగటి వెలుగు", daylightDesc: "మెరుపు తగ్గించండి", noFilter: "ఫిల్టర్ వద్దు", noFilterDesc: "జూమ్ వద్దు", retake: "మళ్లీ తీయండి", consult: "నిపుణుడు", neverGuess: "ఊహించము. మంచి ఫోటో అడుగుతాం.",
    krishnaDelta: "కృష్ణా డెల్టా · వరి · మిర్చి · పత్తి", villages: "గ్రామాలు", selectVillage: "మీ ఊరు ఎంచుకోండి",
    manualPlaceholder: "మీ ఊరు టైప్ చేయండి — గుంటూరు, హైదరాబాద్, Nairobi", locateMe: "నా లొకేషన్", confirm: "నిర్ధారించు", anyWhere: "ప్రపంచంలో ఎక్కడైనా", indiaScope: "భారత్", worldScope: "ప్రపంచం", vijScope: "విజయవాడ", enterLocation: "లొకేషన్ నమోదు", change: "మార్చు", currentLoc: "ప్రస్తుత",
    moreLangs: "మరిన్ని భాషలు", defaultHint: "డిఫాల్ట్",
  },
  EN: {
    see: "See.", sense: "Sense.", decide: "Decide.",
    tagline: "For Vijayawada farmers — AI + Weather advisory · Works anywhere",
    builtFor: "From NTR & Krishna to the world", aiWeather: "AI+WEATHER", langLabel: "Language", locationAuto: "Auto", liveWeather: "● Live",
    heroTitle1: "Show me", heroTitle2: "your crop.", heroSub: "One leaf, close-up, bright light. Fill the frame.",
    listen: "Listen", stopVoice: "Stop", drop: "Drop leaf photo here", orUse: "or use buttons below",
    upload: "Upload photo", takePhoto: "Take photo", fileHint: "JPG / PNG · 10 MB · No login", private: "On-device — private",
    temp: "TEMP", humidity: "HUMIDITY", rain: "RAIN", updates: "Updates every 10 min",
    analyze: "ANALYZE MY CROP", analyzing: "ANALYZING…", noAccount: "No account", offline: "Offline", voiceOut: "Voice",
    waiting: "WAITING FOR LEAF", readyTitle1: "Your field", readyTitle2: "advisor is ready.", readyDesc: "Add a leaf on left. Kisora combines leaf + village + weather to tell what to do — and when safe.",
    whatWrong: "What is wrong?", whatWrongDesc: "Name + confidence.", whatToDoCard: "What to do?", whatToDoDesc: "3 clear steps.", whenToActCard: "When to act?", whenDesc: "Weather-aware window.",
    next12: "Next 12 hours", safetyShort: "Follow local guidance & label.", readyToSense: "READY TO SENSE", greatLeaf: "Great — leaf is clear.", tapAnalyze: "Tap Analyze to combine image + weather + location.",
    seeLeaf: "SEE", senseWeather: "WEATHER", senseLocation: "LOCATION", leafInFrame: "Leaf in frame", tipTitle: "Tip:", tipDesc: "If blurry, retake. One leaf per photo.",
    sensingTitle: "SENSING — 3 SIGNALS", analyzingCrop: "Analyzing your crop…", sec: "~3 sec",
    seeLeafStep: "See — Leaf", senseWeatherStep: "Sense — Weather", senseLocationStep: "Sense — Location",
    detectingSpots: "Detecting spots", rainCheck: "Rain check", microClimate: "Delta risk", confidence: "AI confidence", severity: "SEVERITY", whatISee: "WHAT I SEE", signs: "signs",
    listenExp: "Listen", stopNarration: "Stop", whatToDo: "WHAT TO DO", stepsMin: "steps · 20 min", whyWait: "Why wait?", bestWindow: "BEST WINDOW — WEATHER-AWARE",
    countdown: "COUNTDOWN", hoursToWindow: "hours to window", remindShift: "We’ll remind if weather shifts.", setReminder: "Set reminder",
    weatherOutlook: "WEATHER OUTLOOK", next24: "Next 24h", tempMin: "°C · 26° min", highRisk: "High risk", calm: "Calm",
    rainPeak: "Rain 6–9 PM. Tomorrow morning best.", powered: "IMD + micro-climate", safety: "Safety:", safetyLong: "Follow guidance & label. Keep away 24h.",
    newScan: "New scan", talkExpert: "Talk to expert", lowTitle1: "Not confident", lowTitle2: "to diagnose safely.", lowDesc: "Photo blurry/shadowed. Take clearer in daylight.",
    tooLow: "42% — too low", fillFrame: "Fill frame", fillDesc: "One leaf, close", useDaylight: "Daylight", daylightDesc: "Avoid glare", noFilter: "No filter", noFilterDesc: "No zoom", retake: "Retake", consult: "Expert", neverGuess: "We never guess.",
    krishnaDelta: "Krishna Delta · Paddy · Chilli · Cotton", villages: "Villages", selectVillage: "Select village",
    manualPlaceholder: "Type village / city — Guntur, Delhi, Nairobi", locateMe: "Use my location", confirm: "Confirm", anyWhere: "Works anywhere", indiaScope: "India", worldScope: "World", vijScope: "Vijayawada", enterLocation: "Enter location", change: "Change", currentLoc: "Current",
    moreLangs: "More languages", defaultHint: "Default",
  },
  HI: {
    see: "देखें।", sense: "समझें।", decide: "निर्णय लें।",
    tagline: "विजयवाड़ा किसानों के लिए — AI + मौसम · कहीं भी",
    builtFor: "NTR & कृष्णा से विश्व तक", aiWeather: "AI+मौसम", langLabel: "भाषा", locationAuto: "ऑटो", liveWeather: "● लाइव",
    heroTitle1: "अपनी फसल", heroTitle2: "दिखाइए।", heroSub: "एक पत्ता, करीब से, तेज़ रोशनी में। फ्रेम भरें।",
    listen: "सुनें", stopVoice: "बंद", drop: "फोटो यहाँ छोड़ें", orUse: "या बटन से लें",
    upload: "अपलोड", takePhoto: "फोटो लें", fileHint: "JPG/PNG · 10MB · लॉगिन नहीं", private: "फोन में — निजी",
    temp: "तापमान", humidity: "नमी", rain: "बारिश", updates: "हर 10 मिनट अपडेट",
    analyze: "फसल जाँचें", analyzing: "जाँच…", noAccount: "खाता नहीं", offline: "ऑफ़लाइन", voiceOut: "आवाज़",
    waiting: "पत्ते का इंतज़ार", readyTitle1: "खेत सलाहकार", readyTitle2: "तैयार है।", readyDesc: "बाएँ पत्ता जोड़ें। पत्ता + गाँव + मौसम से बताएँगे।",
    whatWrong: "क्या खराबी?", whatWrongDesc: "नाम + भरोसा.", whatToDoCard: "क्या करें?", whatToDoDesc: "3 आसान कदम.", whenToActCard: "कब करें?", whenDesc: "मौसम अनुसार समय.",
    next12: "अगले 12 घंटे", safetyShort: "स्थानीय सलाह मानें।", readyToSense: "तैयार", greatLeaf: "बढ़िया — साफ़ है।", tapAnalyze: "जाँच दबाएँ।",
    seeLeaf: "देखें", senseWeather: "मौसम", senseLocation: "स्थान", leafInFrame: "फ्रेम में", tipTitle: "सुझाव:", tipDesc: "धुंधली हो तो दोबारा।",
    sensingTitle: "सेंसिंग — 3 संकेत", analyzingCrop: "जाँच रहे हैं…", sec: "~3 सेकंड",
    seeLeafStep: "देखें — पत्ता", senseWeatherStep: "समझें — मौसम", senseLocationStep: "समझें — स्थान",
    detectingSpots: "धब्बे देख रहे", rainCheck: "बारिश जाँच", microClimate: "डेल्टा जोखिम", confidence: "AI भरोसा", severity: "गंभीरता", whatISee: "क्या दिखा", signs: "संकेत",
    listenExp: "सुनें", stopNarration: "बंद", whatToDo: "क्या करें", stepsMin: "कदम · 20 मि", whyWait: "क्यों रुकें?", bestWindow: "सबसे अच्छा समय",
    countdown: "उलटी गिनती", hoursToWindow: "घंटे में", remindShift: "मौसम बदला तो बताएँगे।", setReminder: "रिमाइंडर",
    weatherOutlook: "मौसम", next24: "24 घंटे", tempMin: "°C · न्यून 26°", highRisk: "उच्च जोखिम", calm: "शांत",
    rainPeak: "शाम 6–9 बारिश। कल सुबह उत्तम।", powered: "IMD + सूक्ष्म", safety: "सुरक्षा:", safetyLong: "सलाह मानें। 24घं दूर रखें।",
    newScan: "नया स्कैन", talkExpert: "विशेषज्ञ", lowTitle1: "भरोसा कम", lowTitle2: "सुरक्षित नहीं।", lowDesc: "फोटो धुंधली। साफ़ लें।",
    tooLow: "42% — कम", fillFrame: "फ्रेम भरें", fillDesc: "एक पत्ता", useDaylight: "दिन रोशनी", daylightDesc: "चमक बचाएँ", noFilter: "फिल्टर नहीं", noFilterDesc: "ज़ूम नहीं", retake: "दोबारा", consult: "विशेषज्ञ", neverGuess: "अंदाज़ा नहीं।",
    krishnaDelta: "कृष्णा डेल्टा · धान · मिर्च · कपास", villages: "गाँव", selectVillage: "गाँव चुनें",
    manualPlaceholder: "गाँव लिखें — गुंटूर, दिल्ली", locateMe: "मेरी जगह", confirm: "पुष्टि", anyWhere: "कहीं भी", indiaScope: "भारत", worldScope: "विश्व", vijScope: "विजयवाड़ा", enterLocation: "स्थान", change: "बदलें", currentLoc: "वर्तमान",
    moreLangs: "अन्य भाषाएँ", defaultHint: "डिफ़ॉल्ट",
  },
  TA: {
    see: "பார்.", sense: "உணர்.", decide: "முடிவு.",
    tagline: "விஜயவாடா — AI + வானிலை · எங்கும்", builtFor: "NTR & கிருஷ்ணா முதல் உலகம்", aiWeather: "AI+வானிலை", langLabel: "மொழி", locationAuto: "ஆட்டோ", liveWeather: "● நேரடி",
    heroTitle1: "உன் பயிரை", heroTitle2: "காட்டு.", heroSub: "ஒரு இலை, வெளிச்சத்தில்.", listen: "கேள்", stopVoice: "நிறுத்து", drop: "இலை இங்கே", orUse: "பொத்தான்", upload: "பதிவேற்று", takePhoto: "படம்", fileHint: "JPG·10MB", private: "தனியுரிமை",
    temp: "வெப்பம்", humidity: "ஈரம்", rain: "மழை", updates: "10 நிமி", analyze: "பரிசோதி", analyzing: "…", noAccount: "கணக்கு இல்லை", offline: "ஆஃப்லைன்", voiceOut: "குரல்",
    waiting: "இலைக்காக", readyTitle1: "ஆலோசகர்", readyTitle2: "தயார்.", readyDesc: "இலை சேர்க்கவும்.", whatWrong: "என்ன?", whatWrongDesc: "பெயர்.", whatToDoCard: "என்ன செய்ய?", whatToDoDesc: "3 படி.", whenToActCard: "எப்போது?", whenDesc: "வானிலை.",
    next12: "12 மணி", safetyShort: "ஆலோசனை.", readyToSense: "தயார்", greatLeaf: "அருமை.", tapAnalyze: "அழுத்தவும்.",
    seeLeaf: "பார்", senseWeather: "வானிலை", senseLocation: "இடம்", leafInFrame: "இலை", tipTitle: "குறிப்பு:", tipDesc: "மங்கல் மீண்டும்.",
    sensingTitle: "சென்ஸிங்", analyzingCrop: "ஆராய்கிறோம்…", sec: "~3வி", seeLeafStep: "பார் — இலை", senseWeatherStep: "உணர் — வானிலை", senseLocationStep: "உணர் — இடம்",
    detectingSpots: "புள்ளிகள்", rainCheck: "மழை", microClimate: "டெல்டா", confidence: "நம்பிக்கை", severity: "தீவிரம்", whatISee: "கண்டது", signs: "அறிகுறி",
    listenExp: "கேள்", stopNarration: "நிறுத்து", whatToDo: "செய்ய", stepsMin: "படி", whyWait: "ஏன்?", bestWindow: "சிறந்த நேரம்",
    countdown: "கவுண்ட்", hoursToWindow: "மணியில்", remindShift: "நினைவூட்டுவோம்.", setReminder: "நினைவூட்டல்",
    weatherOutlook: "வானிலை", next24: "24 மணி", tempMin: "°C", highRisk: "அதிக", calm: "அமைதி", rainPeak: "மாலை மழை. காலை நல்லது.", powered: "IMD",
    safety: "பாதுகாப்பு:", safetyLong: "ஆலோசனை.", newScan: "புது", talkExpert: "நிபுணர்", lowTitle1: "நம்பிக்கை இல்லை", lowTitle2: "", lowDesc: "மங்கல்.", tooLow: "42%", fillFrame: "பிரேம்", fillDesc: "ஒரு இலை", useDaylight: "ஒளி", daylightDesc: "மினுமினுப்பு", noFilter: "பில்டர் இல்லை", noFilterDesc: "ஜூம்", retake: "மீண்டும்", consult: "நிபுணர்", neverGuess: "யூகம் இல்லை.",
    krishnaDelta: "டெல்டா", villages: "கிராமம்", selectVillage: "தேர்வு", manualPlaceholder: "ஊர் — குண்டூர்", locateMe: "இடம்", confirm: "உறுதி", anyWhere: "எங்கும்", indiaScope: "இந்தியா", worldScope: "உலகம்", vijScope: "விஜயவாடா", enterLocation: "இடம்", change: "மாற்று", currentLoc: "தற்போது",
    moreLangs: "மேலும்", defaultHint: "இயல்பு",
  },
  KN: {
    see: "ನೋಡಿ.", sense: "ಗ್ರಹಿಸಿ.", decide: "ನಿರ್ಧರಿಸಿ.",
    tagline: "ವಿಜಯವಾಡ — AI + ಹವಾಮಾನ · ಎಲ್ಲೆಡೆ", builtFor: "NTR & ಕೃಷ್ಣಾ", aiWeather: "AI+ಹವಾಮಾನ", langLabel: "ಭಾಷೆ", locationAuto: "ಆಟೋ", liveWeather: "● ನೇರ",
    heroTitle1: "ಬೆಳೆಯನ್ನು", heroTitle2: "ತೋರಿಸಿ.", heroSub: "ಒಂದು ಎಲೆ, ಬೆಳಕಿನಲ್ಲಿ.", listen: "ಕೇಳಿ", stopVoice: "ನಿಲ್ಲಿಸಿ", drop: "ಎಲೆ ಇಲ್ಲಿ", orUse: "ಬಟನ್", upload: "ಅಪ್‌ಲೋಡ್", takePhoto: "ಫೋಟೋ", fileHint: "JPG·10MB", private: "ಖಾಸಗಿ",
    temp: "ತಾಪ", humidity: "ತೇವ", rain: "ಮಳೆ", updates: "10 ನಿಮಿ", analyze: "ಪರೀಕ್ಷಿಸಿ", analyzing: "…", noAccount: "ಖಾತೆ ಇಲ್ಲ", offline: "ಆಫ್‌ಲೈನ್", voiceOut: "ಧ್ವನಿ",
    waiting: "ಎಲೆಗಾಗಿ", readyTitle1: "ಸಲಹೆಗಾರ", readyTitle2: "ಸಿದ್ಧ.", readyDesc: "ಎಲೆ ಸೇರಿಸಿ.", whatWrong: "ಏನು?", whatWrongDesc: "ಹೆಸರು.", whatToDoCard: "ಏನು ಮಾಡು?", whatToDoDesc: "3 ಹಂತ.", whenToActCard: "ಯಾವಾಗ?", whenDesc: "ಹವಾಮಾನ.",
    next12: "12 ಗಂಟೆ", safetyShort: "ಸಲಹೆ.", readyToSense: "ಸಿದ್ಧ", greatLeaf: "ಚೆನ್ನಾಗಿ.", tapAnalyze: "ಒತ್ತಿ.",
    seeLeaf: "ನೋಡಿ", senseWeather: "ಹವಾಮಾನ", senseLocation: "ಸ್ಥಳ", leafInFrame: "ಎಲೆ", tipTitle: "ಸಲಹೆ:", tipDesc: "ಮಸುಕು ಮತ್ತೆ.",
    sensingTitle: "ಸೆನ್ಸಿಂಗ್", analyzingCrop: "ಪರಿಶೀಲನೆ…", sec: "~3ಸೆ", seeLeafStep: "ನೋಡಿ — ಎಲೆ", senseWeatherStep: "ಗ್ರಹಿಸಿ — ಹವಾಮಾನ", senseLocationStep: "ಗ್ರಹಿಸಿ — ಸ್ಥಳ",
    detectingSpots: "ಕಲೆ", rainCheck: "ಮಳೆ", microClimate: "ಡೆಲ್ಟಾ", confidence: "ನಂಬಿಕೆ", severity: "ತೀವ್ರತೆ", whatISee: "ಕಂಡದ್ದು", signs: "ಸೂಚನೆ",
    listenExp: "ಕೇಳಿ", stopNarration: "ನಿಲ್ಲಿಸಿ", whatToDo: "ಮಾಡು", stepsMin: "ಹಂತ", whyWait: "ಏಕೆ?", bestWindow: "ಉತ್ತಮ ಸಮಯ",
    countdown: "ಕೌಂಟ್", hoursToWindow: "ಗಂಟೆಯಲ್ಲಿ", remindShift: "ನೆನಪು.", setReminder: "ಜ್ಞಾಪನೆ",
    weatherOutlook: "ಹವಾಮಾನ", next24: "24ಗಂ", tempMin: "°C", highRisk: "ಹೆಚ್ಚು", calm: "ಶಾಂತ", rainPeak: "ಸಂಜೆ ಮಳೆ. ಬೆಳಿಗ್ಗೆ ಉತ್ತಮ.", powered: "IMD",
    safety: "ಸುರಕ್ಷತೆ:", safetyLong: "ಸಲಹೆ.", newScan: "ಹೊಸ", talkExpert: "ತಜ್ಞ", lowTitle1: "ನಂಬಿಕೆ ಕಡಿಮೆ", lowTitle2: "", lowDesc: "ಮಸುಕು.", tooLow: "42%", fillFrame: "ಫ್ರೇಮ್", fillDesc: "ಒಂದು ಎಲೆ", useDaylight: "ಬೆಳಕು", daylightDesc: "ಹೊಳಪು", noFilter: "ಫಿಲ್ಟರ್ ಇಲ್ಲ", noFilterDesc: "ಜೂಮ್", retake: "ಮತ್ತೆ", consult: "ತಜ್ಞ", neverGuess: "ಊಹೆ ಇಲ್ಲ.",
    krishnaDelta: "ಡೆಲ್ಟಾ", villages: "ಗ್ರಾಮ", selectVillage: "ಆಯ್ಕೆ", manualPlaceholder: "ಊರು — ಗುಂಟೂರು", locateMe: "ಸ್ಥಳ", confirm: "ದೃಢ", anyWhere: "ಎಲ್ಲೆಡೆ", indiaScope: "ಭಾರತ", worldScope: "ಜಗತ್ತು", vijScope: "ವಿಜಯವಾಡ", enterLocation: "ಸ್ಥಳ", change: "ಬದಲಿಸಿ", currentLoc: "ಪ್ರಸ್ತುತ",
    moreLangs: "ಇನ್ನಷ್ಟು", defaultHint: "ಡೀಫಾಲ್ಟ್",
  },
  ML: {
    see: "കാണുക.", sense: "അറിയുക.", decide: "തീരുമാനിക്കുക.",
    tagline: "വിജയവാഡ — AI + കാലാവസ്ഥ · എവിടെയും", builtFor: "NTR & കൃഷ്ണ", aiWeather: "AI+കാലാവസ്ഥ", langLabel: "ഭാഷ", locationAuto: "ഓട്ടോ", liveWeather: "● തത്സമയം",
    heroTitle1: "വിള", heroTitle2: "കാണിക്കൂ.", heroSub: "ഒരു ഇല, വെളിച്ചത്തിൽ.", listen: "കേൾക്കുക", stopVoice: "നിർത്തുക", drop: "ഇല ഇവിടെ", orUse: "ബട്ടൺ", upload: "അപ്‌ലോഡ്", takePhoto: "ഫോട്ടോ", fileHint: "JPG·10MB", private: "സ്വകാര്യം",
    temp: "താപനില", humidity: "ഈർപ്പം", rain: "മഴ", updates: "10 മി", analyze: "പരിശോധിക്കുക", analyzing: "…", noAccount: "അക്കൗണ്ട് ഇല്ല", offline: "ഓഫ്‌ലൈൻ", voiceOut: "ശബ്ദം",
    waiting: "ഇലയ്ക്കായി", readyTitle1: "ഉപദേഷ്ടാവ്", readyTitle2: "തയ്യാർ.", readyDesc: "ഇല ചേർക്കുക.", whatWrong: "എന്ത്?", whatWrongDesc: "പേര്.", whatToDoCard: "എന്ത് ചെയ്യണം?", whatToDoDesc: "3 ഘട്ടം.", whenToActCard: "എപ്പോൾ?", whenDesc: "കാലാവസ്ഥ.",
    next12: "12 മണി", safetyShort: "നിർദ്ദേശം.", readyToSense: "തയ്യാർ", greatLeaf: "നന്നായി.", tapAnalyze: "അമർത്തുക.",
    seeLeaf: "കാണുക", senseWeather: "കാലാവസ്ഥ", senseLocation: "സ്ഥലം", leafInFrame: "ഇല", tipTitle: "ടിപ്പ്:", tipDesc: "മങ്ങിയാൽ വീണ്ടും.",
    sensingTitle: "സെൻസിംഗ്", analyzingCrop: "പരിശോധിക്കുന്നു…", sec: "~3സെ", seeLeafStep: "കാണുക — ഇല", senseWeatherStep: "അറിയുക — കാലാവസ്ഥ", senseLocationStep: "അറിയുക — സ്ഥലം",
    detectingSpots: "പാട്", rainCheck: "മഴ", microClimate: "ഡെൽറ്റ", confidence: "വിശ്വാസം", severity: "തീവ്രത", whatISee: "കണ്ടത്", signs: "ലക്ഷണം",
    listenExp: "കേൾക്കുക", stopNarration: "നിർത്തുക", whatToDo: "ചെയ്യുക", stepsMin: "ഘട്ടം", whyWait: "എന്തിന്?", bestWindow: "മികച്ച സമയം",
    countdown: "കൗണ്ട്", hoursToWindow: "മണിക്കൂറിൽ", remindShift: "ഓർമ്മ.", setReminder: "ഓർമ്മ",
    weatherOutlook: "കാലാവസ്ഥ", next24: "24മണി", tempMin: "°C", highRisk: "ഉയർന്ന", calm: "ശാന്തം", rainPeak: "വൈകിട്ട് മഴ. രാവിലെ നല്ലത്.", powered: "IMD",
    safety: "സുരക്ഷ:", safetyLong: "നിർദ്ദേശം.", newScan: "പുതിയ", talkExpert: "വിദഗ്ധൻ", lowTitle1: "വിശ്വാസം കുറവ്", lowTitle2: "", lowDesc: "മങ്ങിയ.", tooLow: "42%", fillFrame: "ഫ്രെയിം", fillDesc: "ഒരു ഇല", useDaylight: "വെളിച്ചം", daylightDesc: "തിളക്കം", noFilter: "ഫിൽട്ടർ വേണ്ട", noFilterDesc: "സൂം", retake: "വീണ്ടും", consult: "വിദഗ്ധൻ", neverGuess: "ഊഹിക്കില്ല.",
    krishnaDelta: "ഡെൽറ്റ", villages: "ഗ്രാമം", selectVillage: "തിരഞ്ഞെടുക്കുക", manualPlaceholder: "ഗ്രാമം — ഗുണ്ടൂർ", locateMe: "സ്ഥലം", confirm: "സ്ഥിരീകരിക്കുക", anyWhere: "എവിടെയും", indiaScope: "ഇന്ത്യ", worldScope: "ലോകം", vijScope: "വിജയവാഡ", enterLocation: "സ്ഥലം", change: "മാറ്റുക", currentLoc: "ഇപ്പോൾ",
    moreLangs: "കൂടുതൽ", defaultHint: "ഡിഫോൾട്ട്",
  },
}

type DiagnosisML = {
  id: string; severity: 'LOW' | 'MEDIUM' | 'HIGH'; confidence: number
  crop: Record<Lang, string>; title: Record<Lang, string>; latin: string
  whatISee: Record<Lang, string[]>; steps: Record<Lang, { t: string; d: string }[]>
  wait: boolean; waitMsg: Record<Lang, string>; windowLabel: Record<Lang, string>; windowSub: Record<Lang, string>; windowReason: Record<Lang, string>
}

const DIAGNOSES_ML: DiagnosisML[] = [
  {
    id: 'chilli-curl', severity: 'MEDIUM', confidence: 88,
    crop: { TE: 'మిర్చి', EN: 'Chilli', HI: 'मिर्च', TA: 'மிளகாய்', KN: 'ಮೆಣಸು', ML: 'മുളക്' },
    title: { TE: 'మిర్చి ఆకు ముడత — వైరస్', EN: 'Likely Chilli Leaf Curl', HI: 'मिर्च पत्ती मरोड़', TA: 'மிளகாய் சுருள்', KN: 'ಮೆಣಸು ಸುರುಳಿ', ML: 'മുളക് ചുരുളൽ' },
    latin: 'Begomovirus · whitefly',
    whatISee: {
      TE: ['ఆకులు పైకి ముడుచుకున్నాయి', 'పసుపు-ఆకుపచ్చ మచ్చలు', 'కృష్ణా డెల్టాలో సాధారణం'],
      EN: ['Leaves curling upward, puckered', 'Mottled yellow-green', 'Common in Krishna delta'],
      HI: ['पत्तियाँ मुड़ना', 'पीले-हरे धब्बे', 'डेल्टा में आम'],
      TA: ['இலை சுருண்டது', 'மஞ்சள் புள்ளி', 'டெல்டாவில் பொதுவானது'],
      KN: ['ಎಲೆ ಸುರುಳಿ', 'ಹಳದಿ ಕಲೆ', 'ಡೆಲ್ಟಾದಲ್ಲಿ ಸಾಮಾನ್ಯ'],
      ML: ['ഇല ചുരുണ്ടു', 'മഞ്ഞ പാട്', 'ഡെൽറ്റയിൽ സാധാരണം'],
    },
    steps: {
      TE: [{ t: 'తెల్లదోమ', d: 'వేప 5ml+సబ్బు 2g/లీ.' }, { t: 'ముడత తీయండి', d: 'కొమ్మలు తుంచి పాతండి.' }, { t: 'యూరియా ఆపండి', d: 'జింక్ 2g/లీ.' }],
      EN: [{ t: 'Whitefly', d: 'Neem 5ml + soap 2g/L dawn.' }, { t: 'Remove curl', d: 'Pinch & bury.' }, { t: 'Hold urea', d: 'Zinc 2g/L.' }],
      HI: [{ t: 'सफेद मक्खी', d: 'नीम 5ml.' }, { t: 'मुड़ी हटाएँ', d: 'तोड़कर गाड़ें.' }, { t: 'यूरिया रोकें', d: 'जिंक 2g.' }],
      TA: [{ t: 'வெள்ளை ஈ', d: 'வேம்பு 5ml.' }, { t: 'சுருள் நீக்கு', d: 'கிள்ளி புதை.' }, { t: 'யூரியா நிறுத்து', d: 'ஜிங்க்.' }],
      KN: [{ t: 'ಬಿಳಿ ನೊಣ', d: 'ಬೇವು 5ml.' }, { t: 'ಸುರುಳಿ ತೆಗೆಯಿರಿ', d: 'ಕಿತ್ತು ಹೂಳಿ.' }, { t: 'ಯೂರಿಯಾ ನಿಲ್ಲಿಸಿ', d: 'ಜಿಂಕ್.' }],
      ML: [{ t: 'വെള്ളീച്ച', d: 'വേപ്പ് 5ml.' }, { t: 'ചുരുൾ നീക്കുക', d: 'നുള്ളി കുഴി.' }, { t: 'യൂറിയ നിർത്തുക', d: 'സിങ്ക്.' }],
    },
    wait: true,
    waitMsg: { TE: 'ఆగండి — 5గం వర్షం 64%', EN: 'WAIT — Rain in 5h · 64%', HI: 'रुकें — 5घं बारिश', TA: 'காத்திரு — 5மணி மழை', KN: 'ನಿರೀಕ್ಷಿಸಿ — 5ಗಂ ಮಳೆ', ML: 'കാത്തിരിക്കൂ — 5മ മഴ' },
    windowLabel: { TE: 'రేపు · ఉ 6–9', EN: 'Tomorrow · 6–9 AM', HI: 'कल · सुबह 6–9', TA: 'நாளை · 6–9', KN: 'ನಾಳೆ · 6–9', ML: 'നാളെ · 6–9' },
    windowSub: { TE: 'పొడి · 26° — అనుకూలం', EN: 'Dry · 26° — ideal', HI: 'सूखा · 26°', TA: 'வறண்ட · 26°', KN: 'ಒಣ · 26°', ML: 'വരണ്ട · 26°' },
    windowReason: {
      TE: 'ఇప్పుడు పిచికారీ వర్షంలో కొట్టుకుపోతుంది. రేపు ఉదయం మందు నిలుస్తుంది.',
      EN: 'Spray now washes off. Tomorrow calm — stays on leaf.',
      HI: 'अभी धुलेगा। कल सूखा — टिकेगा।', TA: 'இப்போது அடித்துச் செல்லும். நாளை வறண்டது.', KN: 'ಈಗ ಕೊಚ್ಚಿಹೋಗುತ್ತದೆ. ನಾಳೆ ಒಣ.', ML: 'ഇപ്പോൾ ഒലിക്കും. നാളെ വരണ്ടത്.'
    },
  },
  {
    id: 'paddy-blast', severity: 'HIGH', confidence: 91,
    crop: { TE: 'వరి', EN: 'Paddy', HI: 'धान', TA: 'நெல்', KN: 'ಭತ್ತ', ML: 'നെല്ല്' },
    title: { TE: 'వరి బ్లాస్ట్', EN: 'Likely Paddy Blast', HI: 'धान झुलसा', TA: 'நெல் கருகல்', KN: 'ಭತ್ತ ಬ್ಲಾಸ್ಟ್', ML: 'നെല്ല് ബ്ലാസ്റ്റ്' },
    latin: 'Magnaporthe oryzae',
    whatISee: {
      TE: ['కన్ను ఆకార బూడిద మచ్చలు', 'ఆకు ఎండిపోతోంది', '71% తేమ తర్వాత వేగం'], EN: ['Eye grey spots', 'Leaf drying', 'After 71% humidity'], HI: ['आँख जैसे धब्बे', 'पत्ता सूखना', 'नमी बाद'], TA: ['கண் புள்ளி', 'இலை காய்கிறது', '71% பின்'], KN: ['ಕಣ್ಣಿನ ಕಲೆ', 'ಎಲೆ ಒಣಗುತ್ತಿದೆ', '71% ನಂತರ'], ML: ['കണ്ണ് പാട്', 'ഇല ഉണങ്ങുന്നു', '71% ശേഷം']
    },
    steps: {
      TE: [{ t: 'Tricyclazole', d: '0.6g/లీ సాయంత్రం' }, { t: 'నీరు తీసేయండి', d: '2 రోజులు ఆరనివ్వండి' }, { t: 'యూరియా ఆపండి', d: 'పొటాష్ 10kg' }],
      EN: [{ t: 'Tricyclazole', d: '0.6g/L evening' }, { t: 'Drain 2 days', d: 'Dry leaves' }, { t: 'Stop N', d: 'Potash 10kg' }],
      HI: [{ t: 'ट्राइसाइक्लाज़ोल', d: '0.6g' }, { t: 'पानी निकालें', d: 'सुखाएँ' }, { t: 'नाइट्रोजन बंद', d: 'पोटाश' }],
      TA: [{ t: 'Tricyclazole', d: '0.6g' }, { t: 'நீர் வடி', d: 'காய' }, { t: 'நைட்ரஜன் நிறுத்து', d: 'பொட்டாஷ்' }],
      KN: [{ t: 'Tricyclazole', d: '0.6g' }, { t: 'ನೀರು ಬಸಿದು', d: 'ಒಣಗಿಸಿ' }, { t: 'ಸಾರಜನಕ ನಿಲ್ಲಿಸಿ', d: 'ಪೊಟ್ಯಾಶ್' }],
      ML: [{ t: 'Tricyclazole', d: '0.6g' }, { t: 'വെള്ളം വറ്റിക്കു', d: 'ഉണക്കുക' }, { t: 'നൈട്രജൻ നിർത്തുക', d: 'പൊട്ടാഷ്' }],
    },
    wait: true,
    waitMsg: { TE: 'ఆగండి — రాత్రి వర్షం', EN: 'WAIT — Tonight rain', HI: 'रुकें — रात बारिश', TA: 'காத்திரு — இரவு மழை', KN: 'ನಿರೀಕ್ಷಿಸಿ — ರಾತ್ರಿ ಮಳೆ', ML: 'കാത്തിരിക്കൂ — രാത്രി മഴ' },
    windowLabel: { TE: 'ఈరోజు · సా 4:30–5:30', EN: 'Today · 4:30–5:30', HI: 'आज · 4:30', TA: 'இன்று · 4:30', KN: 'ಇಂದು · 4:30', ML: 'ഇന്ന് · 4:30' },
    windowSub: { TE: '60నిమి పొడి — వెంటనే', EN: '60m dry — fast', HI: '60मि सूखा', TA: '60நிமி வறண்ட', KN: '60ನಿಮಿ ಒಣ', ML: '60മി വരണ്ട' },
    windowReason: { TE: 'గంటే సమయం. 1గం ఆరాలి.', EN: '60m only. Need 1h dry.', HI: '1 घंटा सूखना।', TA: '1மணி காய.', KN: '1ಗಂ ಒಣಗಬೇಕು.', ML: '1മ ഉണങ്ങണം.' },
  },
  {
    id: 'cotton-spot', severity: 'LOW', confidence: 84,
    crop: { TE: 'పత్తి', EN: 'Cotton', HI: 'कपास', TA: 'பருத்தி', KN: 'ಹತ್ತಿ', ML: 'പരുത്തി' },
    title: { TE: 'పత్తి మచ్చ', EN: 'Cotton Leaf Spot', HI: 'कपास धब्बा', TA: 'பருத்தி புள்ளி', KN: 'ಹತ್ತಿ ಚುಕ್ಕೆ', ML: 'പരുത്തി പുള്ളി' },
    latin: 'Alternaria',
    whatISee: { TE: ['గోధుమ మచ్చలు', 'కింది ఆకులు', 'దట్టం గాలి లేదు'], EN: ['Brown spots', 'Lower leaves', 'Dense, no air'], HI: ['भूरे धब्बे', 'नीचे पत्ते', 'घना'], TA: ['பழுப்பு புள்ளி', 'கீழ் இலை', 'அடர்த்தி'], KN: ['ಕಂದು ಚುಕ್ಕೆ', 'ಕೆಳ ಎಲೆ', 'ದಟ್ಟ'], ML: ['തവിട്ട് പുള്ളി', 'താഴെ ഇല', 'തിങ്ങിയ'] },
    steps: { TE: [{ t: 'కత్తిరించండి', d: '2–3 ఆకులు' }, { t: 'వేప+సాఫ్', d: '5ml+2g సాయంత్రం' }, { t: 'మట్టికే నీరు', d: 'ఆకు తడపవద్దు' }], EN: [{ t: 'Prune', d: '2–3 leaves' }, { t: 'Neem+Mancozeb', d: 'Evening' }, { t: 'Soil water', d: 'No leaf wet' }], HI: [{ t: 'छँटाई', d: '2 पत्ते' }, { t: 'नीम', d: 'शाम' }, { t: 'जड़ में', d: 'पत्ता नहीं' }], TA: [{ t: 'கத்தரி', d: '2 இலை' }, { t: 'வேம்பு', d: 'மாலை' }, { t: 'மண்ணில்', d: 'இலை வேண்டாம்' }], KN: [{ t: 'ಕತ್ತರಿಸಿ', d: '2 ಎಲೆ' }, { t: 'ಬೇವು', d: 'ಸಂಜೆ' }, { t: 'ಮಣ್ಣಿಗೆ', d: 'ಎಲೆ ಬೇಡ' }], ML: [{ t: 'വെട്ടുക', d: '2 ഇല' }, { t: 'വേപ്പ്', d: 'വൈകിട്ട്' }, { t: 'മണ്ണിൽ', d: 'ഇല വേണ്ട' }] },
    wait: false,
    waitMsg: { TE: 'వెళ్లండి — సురక్షితం', EN: 'GO — Safe now', HI: 'जाएँ — सुरक्षित', TA: 'செல் — பாதுகாப்பு', KN: 'ಹೋಗಿ — ಸುರಕ್ಷಿತ', ML: 'പോകൂ — സുരക്ഷിതം' },
    windowLabel: { TE: 'ఈరోజు · ఇప్పుడు–6', EN: 'Today · Now–6', HI: 'आज · अभी–6', TA: 'இன்று · இப்போ–6', KN: 'ಇಂದು · ಈಗ–6', ML: 'ഇന്ന് · ഇപ്പോ–6' },
    windowSub: { TE: '10గం పొడి', EN: 'Dry 10h', HI: '10घं सूखा', TA: '10மணி வறண்ட', KN: '10ಗಂ ಒಣ', ML: '10മ വരണ്ട' },
    windowReason: { TE: 'రేపటి వరకు వర్షం లేదు.', EN: 'No rain till tomorrow.', HI: 'कल तक नहीं।', TA: 'நாளை வரை இல்லை.', KN: 'ನಾಳೆವರೆಗೆ ಇಲ್ಲ.', ML: 'നാളെ വരെ ഇല്ല.' },
  },
]

export default function App() {
  const [appState, setAppState] = useState<AppState>('idle')
  const [image, setImage] = useState<string | null>(null)
  const [lang, setLang] = useState<Lang>('TE')
  const [villageIdx, setVillageIdx] = useState(0)
  const [scope, setScope] = useState<Scope>('vijayawada')
  const [showLocation, setShowLocation] = useState(false)
  const [showLang, setShowLang] = useState(false)
  const [locationInput, setLocationInput] = useState('')
  const [customLocation, setCustomLocation] = useState<{ name: string, sub: string, coords: string } | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const [diagnosis, setDiagnosis] = useState<DiagnosisML>(DIAGNOSES_ML[0])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [voicesOn, setVoicesOn] = useState(false)
  const [analyzingStep, setAnalyzingStep] = useState(0)
  const [reminder, setReminder] = useState(false)
  const [weatherTemp, setWeatherTemp] = useState(WEATHER.now.temp)

  const t = T[lang]
  const currentLocation = useMemo(() => {
    if (customLocation) return customLocation
    const v = VILLAGES[villageIdx]
    const name = lang === 'TE' ? v.te : lang === 'HI' ? v.hi : lang === 'TA' ? v.ta : lang === 'KN' ? v.kn : lang === 'ML' ? v.ml : v.en
    return { name, sub: `${v.mandal} · ${v.dist}`, coords: v.coords }
  }, [customLocation, villageIdx, lang])

  useEffect(() => { const h = currentLocation.name.length + currentLocation.coords.length; setWeatherTemp(WEATHER.now.temp + (h % 5) - 2) }, [currentLocation])

  useEffect(() => {
    if (appState !== 'analyzing') return
    setAnalyzingStep(0); let i = 0
    const id = setInterval(() => { i++; if (i < 3) setAnalyzingStep(i) }, 750)
    const to = setTimeout(() => {
      if (Math.random() < 0.12) setAppState('low')
      else { setDiagnosis(DIAGNOSES_ML[Math.floor(Math.random() * DIAGNOSES_ML.length)]); setAppState('result') }
    }, 2850)
    return () => { clearInterval(id); clearTimeout(to) }
  }, [appState])

  const handleFile = (file: File | null) => { if (!file) return; const url = URL.createObjectURL(file); setImage(url); setAppState('preview') }
  const onDrop = (e: React.DragEvent) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f) }
  const triggerAnalyze = () => { if (!image) return; setAppState('analyzing') }
  const reset = () => { setAppState('idle'); setImage(null); setVoicesOn(false); setReminder(false) }
  const handleLocateMe = () => {
    setIsLocating(true)
    if (!navigator.geolocation) { setTimeout(() => { setCustomLocation({ name: 'Vijayawada (GPS)', sub: 'Auto · NTR', coords: '16.51°N, 80.63°E' }); setIsLocating(false); setShowLocation(false) }, 800); return }
    navigator.geolocation.getCurrentPosition(
      (pos) => { setCustomLocation({ name: `${pos.coords.latitude.toFixed(2)}°, ${pos.coords.longitude.toFixed(2)}°`, sub: lang === 'TE' ? 'GPS ద్వారా' : 'GPS', coords: `${pos.coords.latitude.toFixed(2)}°, ${pos.coords.longitude.toFixed(2)}°` }); setIsLocating(false); setShowLocation(false) },
      () => { setCustomLocation({ name: 'Vijayawada (GPS)', sub: 'Auto · NTR', coords: '16.51°N, 80.63°E' }); setIsLocating(false); setShowLocation(false) },
      { timeout: 5000 }
    )
  }
  const handleCustomConfirm = () => {
    const v = locationInput.trim(); if (!v) return
    const coords = `${(16 + Math.random()).toFixed(2)}°N, ${(80 + Math.random()).toFixed(2)}°E`
    setCustomLocation({ name: v, sub: lang === 'TE' ? 'మాన్యువల్' : 'Manual', coords }); setLocationInput(''); setShowLocation(false)
  }
  const selectVillage = (idx: number) => { setCustomLocation(null); setVillageIdx(idx); setShowLocation(false) }
  const selectIndiaCity = (c: typeof INDIA_CITIES[number]) => {
    const name = lang === 'TE' ? c.te : lang === 'HI' ? c.hi : c.en
    setCustomLocation({ name, sub: `${c.state} · India`, coords: c.coords }); setShowLocation(false)
  }
  const selectWorldCity = (c: typeof WORLD_CITIES[number]) => { setCustomLocation({ name: c.en, sub: c.country, coords: c.coords }); setShowLocation(false) }

  useEffect(() => {
    if (!voicesOn || !('speechSynthesis' in window)) return
    const text = appState === 'result' ? `${diagnosis.title[lang]}. ${diagnosis.whatISee[lang].join('. ')}` : t.heroSub
    const u = new SpeechSynthesisUtterance(text)
    u.lang = lang === 'TE' ? 'te-IN' : lang === 'HI' ? 'hi-IN' : lang === 'TA' ? 'ta-IN' : lang === 'KN' ? 'kn-IN' : lang === 'ML' ? 'ml-IN' : 'en-IN'
    u.rate = 0.95; speechSynthesis.cancel(); speechSynthesis.speak(u)
    return () => speechSynthesis.cancel()
  }, [voicesOn, appState, diagnosis, lang, t.heroSub])

  const hLabel = (h: typeof WEATHER.hourly[number]) => lang === 'TE' ? h.hTe : lang === 'HI' ? h.hHi : lang === 'TA' ? h.hTa : lang === 'KN' ? h.hKn : lang === 'ML' ? h.hMl : h.hEn

  return (
    <div className="min-h-screen bg-[#FDFBF5] text-[#143429] selection:bg-[#DDE8DA]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full bg-[#E9F0E6] blur-[60px] opacity-60" />
        <div className="absolute top-[420px] -left-40 w-[600px] h-[600px] rounded-full bg-[#FFF4D6]/70 blur-[70px] opacity-50" />
        <div className="absolute bottom-0 right-1/3 w-[700px] h-[300px] bg-gradient-to-t from-[#E6F0E6]/40 to-transparent blur-2xl" />
      </div>
      <div className="pointer-events-none fixed inset-0 opacity-[0.025]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />

      {/* HEADER — KISORA · small lang defaults TE/EN · location/weather */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#FDFBF5]/90 border-b border-[#E8E0C6]">
        <div className="mx-auto max-w-[1360px] px-3 md:px-5 h-[62px] md:h-[66px] flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#143429] flex items-center justify-center text-white shrink-0 shadow-sm"><Leaf className="w-[18px] h-[18px]" strokeWidth={2} /></div>
            <div className="leading-none min-w-0">
              <div className="serif text-[20px] md:text-[21px] tracking-[-0.03em] font-bold flex items-baseline gap-1.5">KISORA <span className="hidden sm:inline text-[10px] tracking-[0.16em] font-semibold text-[#7A8F7A]">SEE · SENSE · DECIDE</span></div>
              <div className="hidden md:block text-[11px] font-medium text-[#7A8F7A] -mt-0.5 truncate max-w-[46ch]">{t.tagline}</div>
              <div className="md:hidden text-[10px] font-bold tracking-wide text-[#2E6B3A] truncate">{t.krishnaDelta}</div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
            {/* SMALL LANGUAGE SELECTOR — Telugu & English as defaults */}
            <div className="flex items-center gap-1 p-1 rounded-full bg-white border border-[#E8E2C9] shadow-sm">
              <button onClick={() => setLang('TE')} className={`px-2.5 md:px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1 ${lang === 'TE' ? 'bg-[#143429] text-white shadow' : 'text-[#6B7D6B] hover:bg-[#F6F1E6]'}`}>
                <span className="text-[13px] leading-none">తె</span><span className="hidden md:inline">Telugu</span><span className="hidden lg:inline text-[10px] font-semibold opacity-60 ml-0.5">{t.defaultHint}</span>
              </button>
              <button onClick={() => setLang('EN')} className={`px-2.5 md:px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1 ${lang === 'EN' ? 'bg-[#143429] text-white shadow' : 'text-[#6B7D6B] hover:bg-[#F6F1E6]'}`}>
                EN<span className="hidden md:inline">English</span><span className="hidden lg:inline text-[10px] font-semibold opacity-60 ml-0.5">{t.defaultHint}</span>
              </button>
              <div className="w-px h-6 bg-[#E8E2C9] mx-0.5" />
              <button onClick={() => setShowLang(v => !v)} className={`pl-2 pr-2.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 transition ${['HI','TA','KN','ML'].includes(lang) ? 'bg-[#143429] text-white' : 'bg-[#F6F1E6] text-[#5A705A] hover:bg-[#EFEAD6] border border-[#E8E2C9]'}`}>
                {['HI','TA','KN','ML'].includes(lang) ? LANGS.find(l=>l.code===lang)!.short : <Languages className="w-3.5 h-3.5" />}
                <span className="hidden md:inline text-[11px]">{['HI','TA','KN','ML'].includes(lang) ? LANGS.find(l=>l.code===lang)!.native : t.moreLangs}</span>
                <ChevronDown className={`w-3 h-3 transition ${showLang ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* LOCATION / WEATHER STATUS */}
            <div className="relative">
              <button onClick={() => setShowLocation(v => !v)} className="hidden md:flex items-center gap-2 pl-2 pr-2 py-1 rounded-full bg-white border border-[#E8E2C9] shadow-sm hover:bg-[#F6F1E6] transition max-w-[300px]">
                <span className="w-7 h-7 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0"><MapPinned className="w-3.5 h-3.5 text-emerald-700" /></span>
                <div className="text-left leading-none min-w-0">
                  <div className="text-xs font-bold flex items-center gap-1 truncate">{currentLocation.name} <ChevronDown className={`w-3 h-3 shrink-0 transition ${showLocation ? 'rotate-180' : ''}`} /></div>
                  <div className="text-[10px] font-medium text-[#6B7D6B] truncate">{currentLocation.sub} · {currentLocation.coords}</div>
                </div>
                <span className="hidden lg:flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-[#FFF6D6] border border-amber-200 text-amber-800 shrink-0"><CloudRain className="w-3 h-3" />{WEATHER.now.rain}%</span>
              </button>
              <button onClick={() => setShowLocation(v => !v)} className="md:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white border border-[#E8E2C9] text-xs font-bold max-w-[150px]">
                <MapPinned className="w-3.5 h-3.5 text-emerald-700 shrink-0" /><span className="truncate">{currentLocation.name}</span><ChevronDown className="w-3 h-3 shrink-0" />
              </button>

              <AnimatePresence>
                {showLocation && (
                  <motion.div initial={{ opacity: 0, y: 8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.98 }} className="absolute right-0 top-[46px] w-[92vw] md:w-[560px] max-w-[560px] rounded-[20px] bg-white border border-[#E8E2C9] shadow-[0_20px_50px_rgba(20,52,41,0.16)] overflow-hidden z-50">
                    <div className="p-4 pb-3">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-xs font-bold tracking-wide flex items-center gap-2"><MapPinned className="w-3.5 h-3.5 text-[#2E6B3A]" /> {t.enterLocation} · {t.anyWhere}</div>
                        <button onClick={() => setShowLocation(false)} className="w-7 h-7 rounded-full bg-[#F6F1E6] border flex items-center justify-center hover:bg-white"><X className="w-3.5 h-3.5" /></button>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1 relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9AAE9A]" />
                          <input value={locationInput} onChange={e => setLocationInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleCustomConfirm()} placeholder={t.manualPlaceholder} className="w-full h-[44px] pl-9 pr-3 rounded-xl border-2 border-[#E8E2C9] bg-[#FDFBF5] text-sm font-medium placeholder:text-[#9AAE9A] focus:outline-none focus:border-[#143429] focus:bg-white" />
                        </div>
                        <button onClick={handleCustomConfirm} disabled={!locationInput.trim()} className="h-[44px] px-4 rounded-xl bg-[#143429] text-white text-sm font-bold disabled:opacity-40 flex items-center gap-1.5 shrink-0">
                          <ArrowRight className="w-4 h-4" /> {t.confirm}
                        </button>
                      </div>
                      <button onClick={handleLocateMe} disabled={isLocating} className="mt-2 w-full h-[40px] rounded-xl bg-[#F6F1E6] border text-sm font-bold flex items-center justify-center gap-2 hover:bg-white disabled:opacity-60">
                        {isLocating ? <span className="w-4 h-4 border-2 border-[#143429]/30 border-t-[#143429] rounded-full animate-spin" /> : <LocateFixed className="w-4 h-4 text-[#2E6B3A]" />}
                        {isLocating ? 'Locating…' : t.locateMe}
                      </button>
                      <div className="mt-3 flex items-center gap-1.5 p-1 rounded-full bg-[#F6F1E6] border w-fit">
                        {(['vijayawada', 'india', 'world'] as Scope[]).map(s => (
                          <button key={s} onClick={() => setScope(s)} className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${scope === s ? 'bg-[#143429] text-white shadow' : 'text-[#6B7D6B] hover:bg-white'}`}>
                            {s === 'vijayawada' ? <MapPinned className="w-3.5 h-3.5" /> : s === 'india' ? <Building2 className="w-3.5 h-3.5" /> : <Earth className="w-3.5 h-3.5" />}
                            {s === 'vijayawada' ? t.vijScope : s === 'india' ? t.indiaScope : t.worldScope}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="px-4 pb-4 max-h-[300px] overflow-auto">
                      {scope === 'vijayawada' && (
                        <div className="grid grid-cols-2 gap-2">
                          {VILLAGES.map((v, idx) => {
                            const name = lang === 'TE' ? v.te : lang === 'HI' ? v.hi : lang === 'TA' ? v.ta : lang === 'KN' ? v.kn : lang === 'ML' ? v.ml : v.en
                            const active = !customLocation && idx === villageIdx
                            return (
                              <button key={v.id} onClick={() => selectVillage(idx)} className={`text-left px-3 py-2.5 rounded-xl border flex items-center justify-between ${active ? 'bg-[#143429] border-[#143429] text-white' : 'bg-[#F6F1E6] border-[#E8E2C9] hover:bg-white'}`}>
                                <div className="min-w-0"><div className="text-sm font-bold leading-none truncate">{name}</div><div className={`text-[11px] truncate ${active ? 'text-white/70' : 'text-[#6B7D6B]'}`}>{v.mandal} · {v.dist}</div></div>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ml-2 ${active ? 'bg-white text-[#143429]' : 'bg-white border'}`}>{active ? '✓' : '›'}</div>
                              </button>
                            )
                          })}
                        </div>
                      )}
                      {scope === 'india' && (
                        <div className="grid grid-cols-2 gap-2">
                          {INDIA_CITIES.map(c => {
                            const name = lang === 'TE' ? c.te : lang === 'HI' ? c.hi : c.en
                            const active = customLocation?.name === name
                            return (
                              <button key={c.en} onClick={() => selectIndiaCity(c)} className={`text-left px-3 py-2.5 rounded-xl border flex items-center justify-between ${active ? 'bg-[#143429] border-[#143429] text-white' : 'bg-white border hover:bg-[#F6F1E6]'}`}>
                                <div className="min-w-0"><div className="text-sm font-bold leading-none truncate">{name}</div><div className={`text-[11px] ${active ? 'text-white/70' : 'text-[#6B7D6B]'}`}>{c.state} · {c.coords}</div></div>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${active ? 'bg-white text-[#143429]' : 'bg-[#F6F1E6] border'}`}>India</span>
                              </button>
                            )
                          })}
                        </div>
                      )}
                      {scope === 'world' && (
                        <div className="grid grid-cols-1 gap-2">
                          {WORLD_CITIES.map(c => {
                            const active = customLocation?.name === c.en
                            return (
                              <button key={c.en} onClick={() => selectWorldCity(c)} className={`text-left px-3 py-2.5 rounded-xl border flex items-center justify-between ${active ? 'bg-[#143429] border-[#143429] text-white' : 'bg-white border hover:bg-[#F6F1E6]'}`}>
                                <div><div className="text-sm font-bold leading-none">{c.en}</div><div className={`text-[11px] ${active ? 'text-white/70' : 'text-[#6B7D6B]'}`}>{c.country} · {c.coords}</div></div>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 ${active ? 'bg-white text-[#143429]' : 'bg-emerald-50 border border-emerald-200 text-emerald-700'}`}><Earth className="w-3 h-3" /> World</span>
                              </button>
                            )
                          })}
                          <div className="rounded-xl bg-[#FFF8E1] border border-amber-200 p-3 flex gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                            <div className="text-xs leading-5">{lang === 'TE' ? 'ఏ ఊరైనా టైప్ చేయండి — Kisora ప్రపంచ డేటా + స్థానిక వాతావరణం కలిపి సలహా ఇస్తుంది.' : 'Type any village worldwide — Kisora uses global knowledge + local weather.'}</div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="px-4 py-3 bg-[#F6F1E6] border-t flex items-center justify-between text-[11px]">
                      <span className="text-[#6B7D6B] flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {t.currentLoc}: <b className="text-[#143429]">{currentLocation.name}</b> · {currentLocation.coords}</span>
                      <span className="hidden md:inline text-[#2E6B3A] font-bold">IMD + OpenWeather</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Expanded languages panel — not a popup, inline below header to avoid interrupting workflow */}
        <AnimatePresence>
          {showLang && (
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="border-b border-[#E8E2C9] bg-white/90 backdrop-blur">
              <div className="mx-auto max-w-[1360px] px-3 md:px-5 py-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-bold flex items-center gap-2"><Languages className="w-3.5 h-3.5 text-[#2E6B3A]" /> Telugu & English are defaults · <span className="font-normal text-[#6B7D6B]">More languages also supported</span></div>
                  <button onClick={() => setShowLang(false)} className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#F6F1E6] border hover:bg-white flex items-center gap-1"><X className="w-3 h-3" /> Close</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                  {LANGS.map(l => {
                    const isDefault = l.code === 'TE' || l.code === 'EN'
                    const active = lang === l.code
                    return (
                      <button key={l.code} onClick={() => { setLang(l.code); setShowLang(false) }} className={`text-left px-3 py-3 rounded-xl border flex items-center gap-2.5 relative overflow-hidden ${active ? 'bg-[#143429] border-[#143429] text-white shadow' : isDefault ? 'bg-[#FFFDF0] border-amber-200 hover:bg-white' : 'bg-[#F6F1E6] border-[#E8E2C9] hover:bg-white'}`}>
                        {isDefault && !active && <span className="absolute top-1.5 right-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 border border-amber-200 text-amber-800">Default</span>}
                        <span className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${active ? 'bg-white text-[#143429]' : 'bg-white border shadow-sm'}`}>{l.short}</span>
                        <div className="min-w-0"><div className="text-sm font-bold leading-none truncate">{l.native}</div><div className={`text-[11px] ${active ? 'text-white/70' : 'text-[#6B7D6B]'}`}>{l.label} · {l.code}</div></div>
                        {active && <CheckCircle2 className="w-4 h-4 ml-auto shrink-0" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="mx-auto max-w-[1360px] px-3 md:px-5 py-4 md:py-6 pb-8 relative">
        {/* SEE · SENSE · DECIDE — 5-second value prop */}
        <div className="relative mb-4 md:mb-6">
          <div className="hidden md:block absolute top-[28px] left-[12%] right-[12%] h-[2px] bg-[#E8E2C9]" />
          <div className="grid grid-cols-3 gap-2 md:gap-3 relative">
            {[
              { k: t.see, icon: Eye, title: lang === 'TE' ? 'ఆకు ఫోటో' : lang === 'HI' ? 'पत्ता' : lang === 'TA' ? 'இலை' : lang === 'KN' ? 'ಎಲೆ' : lang === 'ML' ? 'ഇല' : 'Crop image', desc: lang === 'TE' ? 'ఒక స్పష్టమైన ఆకు' : 'One clear leaf', active: true, step: '01' },
              { k: t.sense, icon: Brain, title: 'AI + ' + (lang === 'TE' ? 'వాతావరణం' : lang === 'HI' ? 'मौसम' : 'Weather'), desc: currentLocation.name.slice(0, 16), active: appState === 'analyzing' || appState === 'result' || appState === 'low', step: '02' },
              { k: t.decide, icon: CheckCircle2, title: lang === 'TE' ? 'స్పష్టమైన చర్య' : 'Clear action', desc: lang === 'TE' ? 'ఎప్పుడు చేయాలో' : 'Safest time', active: appState === 'result', step: '03' },
            ].map(s => (
              <div key={s.k} className={`rounded-2xl border px-3 md:px-4 py-3 flex items-center gap-3 relative ${s.active ? 'bg-[#143429] border-[#143429] text-white shadow-[0_8px_24px_rgba(20,52,41,0.18)]' : 'bg-white border-[#E8E2C9] text-[#143429] shadow-sm'}`}>
                <div className="absolute -top-2 -left-1 hidden md:flex w-6 h-6 rounded-full bg-[#FDFBF5] border-2 border-[#E8E2C9] items-center justify-center text-[10px] font-bold text-[#6B7D6B]">{s.step}</div>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${s.active ? 'bg-white/15 text-white' : 'bg-[#F1F6EF] text-[#2D5A3A] border'}`}>
                  <s.icon className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold tracking-[0.12em] truncate">{s.k}</div>
                  <div className="text-[13px] md:text-[14px] font-bold leading-none truncate">{s.title}</div>
                  <div className={`text-[11px] leading-none mt-0.5 truncate ${s.active ? 'text-white/60' : 'text-[#9AAE9A]'}`}>{s.desc}</div>
                </div>
                {s.active && <div className="ml-auto hidden md:flex w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 md:gap-6 items-start">
          {/* LEFT — Hero upload + location/weather + CTA */}
          <div className="col-span-12 lg:col-span-5">
            <div className="bg-white rounded-[28px] border border-[#E8E2C9] shadow-[0_12px_40px_rgba(20,52,41,0.08)] overflow-hidden">
              <div className="px-5 md:px-7 pt-6 pb-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h1 className="serif text-[30px] md:text-[34px] leading-[0.92] tracking-[-0.04em] font-bold">
                      {t.heroTitle1}<br /><span className="italic font-normal text-[#2E6B3A]">{t.heroTitle2}</span>
                    </h1>
                    <p className="text-[13px] leading-5 text-[#6B7D6B] mt-2 max-w-[30ch]">{t.heroSub}</p>
                  </div>
                  <button onClick={() => setVoicesOn(v => !v)} className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold border transition shrink-0 ${voicesOn ? 'bg-[#143429] text-white border-[#143429]' : 'bg-[#F6F1E6] border-[#E8E2C9] text-[#5A705A]'}`}>
                    {voicesOn ? <><Volume2 className="w-3.5 h-3.5" /> {t.stopVoice}</> : <><Mic className="w-3.5 h-3.5" /> {t.listen}</>}
                  </button>
                </div>
              </div>

              <div className="px-3 md:px-5">
                <div onDragOver={e => { e.preventDefault(); setDragOver(true) }} onDragLeave={() => setDragOver(false)} onDrop={onDrop} className={`relative rounded-[22px] overflow-hidden border-2 border-dashed transition ${dragOver ? 'border-[#2E6B3A] bg-[#F0F7EE]' : 'border-[#D8E2D4] bg-[#FAFBF8]'} ${image ? 'p-0 border-solid bg-white' : 'p-3 md:p-4'}`}>
                  {!image ? (
                    <>
                      <div className="rounded-2xl bg-white border border-[#E8E2C9] p-3 md:p-4 flex flex-col items-center text-center shadow-sm">
                        <div className="w-full aspect-[4/3] md:aspect-[4/2.9] rounded-xl overflow-hidden bg-[#F6F1E6] border border-[#E8E2C9] relative flex items-center justify-center">
                          <img src="https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=700&h=480&fit=crop&crop=center" alt="leaf" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#143429]/55 via-[#143429]/10 to-transparent" />
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-5">
                            <motion.div initial={{ y: 4, opacity: 0.9 }} animate={{ y: [0, -3, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }} className="w-14 h-14 rounded-2xl bg-white/95 backdrop-blur flex items-center justify-center shadow-lg mb-3">
                              <ImageIcon className="w-6 h-6 text-[#2E6B3A]" />
                            </motion.div>
                            <p className="text-white font-bold drop-shadow text-[14px] tracking-tight">{t.drop}</p>
                            <p className="text-white/85 text-xs">{t.orUse}</p>
                          </div>
                          <div className="absolute top-3 left-3 w-6 h-6 border-l-[2.5px] border-t-[2.5px] border-white/90 rounded-tl-lg" />
                          <div className="absolute top-3 right-3 w-6 h-6 border-r-[2.5px] border-t-[2.5px] border-white/90 rounded-tr-lg" />
                          <div className="absolute bottom-3 left-3 w-6 h-6 border-l-[2.5px] border-b-[2.5px] border-white/90 rounded-bl-lg" />
                          <div className="absolute bottom-3 right-3 w-6 h-6 border-r-[2.5px] border-b-[2.5px] border-white/90 rounded-br-lg" />
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-black/45 backdrop-blur text-white text-[10px] font-bold border border-white/20 flex items-center gap-1">
                            <Flower2 className="w-3 h-3" /> {t.krishnaDelta}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 w-full mt-4">
                          <button onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center gap-2 h-[48px] rounded-xl bg-white border-2 border-[#143429] text-[#143429] font-bold text-[13px] hover:bg-[#143429] hover:text-white transition">
                            <ImageIcon className="w-4 h-4" /> {t.upload}
                          </button>
                          <button onClick={() => cameraInputRef.current?.click()} className="flex items-center justify-center gap-2 h-[48px] rounded-xl bg-[#143429] text-white font-bold text-[13px] hover:bg-[#1B4538] transition shadow-[0_6px_16px_rgba(20,52,41,0.18)]">
                            <Camera className="w-4 h-4" /> {t.takePhoto}
                          </button>
                        </div>
                        <p className="text-[11px] text-[#9AAE9A] mt-2.5 font-medium">{t.fileHint}</p>
                      </div>
                      <div className="flex items-center justify-center gap-2 mt-3 text-[11px] font-medium text-[#8A9A8A]">
                        <ShieldCheck className="w-3.5 h-3.5" /> {t.private}
                      </div>
                    </>
                  ) : (
                    <div className="relative">
                      <img src={image} alt="crop" className="w-full aspect-[4/3] object-cover" />
                      <AnimatePresence>
                        {appState === 'analyzing' && (
                          <motion.div initial={{ top: '0%' }} animate={{ top: ['0%', '100%', '0%'] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }} className="absolute left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_14px_#34d399]" />
                        )}
                      </AnimatePresence>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/55 backdrop-blur text-white text-[11px] font-bold border border-white/15">
                          <ScanLine className="w-3.5 h-3.5" /> {lang === 'TE' ? 'ఆకు గుర్తించాం' : 'Leaf detected'}
                        </span>
                        <button onClick={reset} className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow hover:bg-gray-50">
                          <X className="w-4 h-4 text-[#143429]" />
                        </button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-3 flex items-end justify-between gap-3">
                        <div className="text-white min-w-0">
                          <div className="text-[11px] font-bold tracking-wide opacity-90 flex items-center gap-1 truncate"><MapPin className="w-3 h-3 shrink-0" />{currentLocation.coords} · {currentLocation.name}</div>
                          <div className="text-xs font-medium opacity-90 hidden md:block truncate">{currentLocation.sub}</div>
                        </div>
                        <button onClick={() => cameraInputRef.current?.click()} className="shrink-0 px-3 py-1.5 rounded-full bg-white text-[#143429] text-xs font-bold flex items-center gap-1 shadow">
                          <RotateCcw className="w-3.5 h-3.5" /> {t.retake}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files?.[0] ?? null)} />
                <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={e => handleFile(e.target.files?.[0] ?? null)} />
              </div>

              <div className="px-3 md:px-5 mt-4">
                <div className="rounded-2xl bg-[#F3F6EE] border border-[#E2E8D9] p-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <button onClick={() => setShowLocation(v => !v)} className="flex items-center gap-2 text-xs font-bold hover:underline min-w-0">
                      <Navigation className="w-3.5 h-3.5 text-[#2E6B3A] shrink-0" />
                      <span className="truncate">{currentLocation.name} · {currentLocation.sub}</span>
                      <span className="hidden md:inline text-[#6B7D6B] font-medium shrink-0">· {currentLocation.coords}</span>
                      <ChevronDown className={`w-3 h-3 shrink-0 ${showLocation ? 'rotate-180' : ''} transition`} />
                    </button>
                    <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold tracking-wide px-2 py-1 rounded-full bg-white border text-emerald-700 shrink-0">● {t.liveWeather.replace('● ', '')}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    <div className="bg-white rounded-xl border border-[#E8E2C9] p-2.5 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#FFF6D6] border border-amber-100 flex items-center justify-center"><Thermometer className="w-4 h-4 text-amber-700" /></div>
                      <div><div className="text-[10px] font-bold tracking-wide text-[#8A9A8A]">{t.temp}</div><div className="text-sm font-bold leading-none">{weatherTemp}°C</div></div>
                    </div>
                    <div className="bg-white rounded-xl border border-[#E8E2C9] p-2.5 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center"><Droplets className="w-4 h-4 text-sky-700" /></div>
                      <div><div className="text-[10px] font-bold tracking-wide text-[#8A9A8A]">{t.humidity}</div><div className="text-sm font-bold leading-none">{WEATHER.now.hum}%</div></div>
                    </div>
                    <div className="bg-white rounded-xl border border-[#E8E2C9] p-2.5 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#FFF1F0] border border-red-100 flex items-center justify-center"><CloudRain className="w-4 h-4 text-red-700" /></div>
                      <div><div className="text-[10px] font-bold tracking-wide text-[#8A9A8A]">{t.rain}</div><div className="text-sm font-bold leading-none">{WEATHER.now.rain}%</div></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2.5 text-[11px] text-[#6B7D6B] font-medium">
                    <Clock className="w-3 h-3" /> {t.updates} · <span className="inline-flex items-center gap-1"><Waves className="w-3 h-3" />{currentLocation.name} micro-climate</span>
                  </div>
                  <button onClick={() => setShowLocation(true)} className="mt-2.5 w-full h-9 rounded-xl bg-white border border-[#E8E2C9] text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#FFFEFB] shadow-sm">
                    <Search className="w-3.5 h-3.5" /> {t.change} {t.enterLocation.toLowerCase()} — {t.anyWhere}
                  </button>
                </div>
              </div>

              <div className="p-3 md:p-5 pt-4">
                <motion.button
                  whileTap={{ scale: 0.985 }}
                  onClick={triggerAnalyze}
                  disabled={!image || appState === 'analyzing'}
                  className={`w-full h-[58px] rounded-2xl font-extrabold text-[15px] tracking-wide flex items-center justify-center gap-2.5 transition ${!image ? 'bg-[#E8E0C6] text-[#9A9588] cursor-not-allowed shadow-none border border-[#E8E0C6]' : appState === 'analyzing' ? 'bg-[#1B4538] text-white shadow-lg' : 'bg-[#143429] text-white hover:bg-[#0F2620] shadow-[0_10px_24px_rgba(20,52,41,0.22)] border border-[#0F2620]'}`}>
                  {appState === 'analyzing' ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />{t.analyzing}</> : <><Sparkles className="w-4.5 h-4.5" />{t.analyze}<ArrowUpRight className="w-4 h-4 opacity-80" /></>}
                </motion.button>
                <div className="flex items-center justify-center gap-3 mt-3 text-[11px] font-semibold text-[#9AAE9A]">
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />{t.noAccount}</span>
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" />{t.offline}</span>
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-sky-500" />{t.voiceOut}</span>
                </div>
              </div>
            </div>
            <div className="md:hidden mt-3 rounded-2xl bg-white border border-[#E8E2C9] p-3 flex items-center justify-between shadow-sm">
              <span className="text-xs font-semibold flex items-center gap-2"><Sun className="w-4 h-4 text-amber-600" />{lang === 'TE' ? WEATHER.now.condTe : lang === 'HI' ? WEATHER.now.condHi : WEATHER.now.condEn} · {WEATHER.now.wind} km/h</span>
              <span className="text-xs font-bold text-[#2E6B3A] flex items-center gap-1">↓ 12h</span>
            </div>
          </div>

          {/* RIGHT — transforms on same screen */}
          <div className="col-span-12 lg:col-span-7">
            <AnimatePresence mode="wait">
              {appState === 'idle' && (
                <motion.div key="idle" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="bg-[#F3F6EE] rounded-[28px] border border-[#E2E8D9] p-5 md:p-7 shadow-sm">
                  <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] text-[#8FA08F]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" /> {t.waiting}
                  </div>
                  <h2 className="serif text-[26px] md:text-[32px] leading-[0.95] tracking-[-0.03em] font-bold mt-3">
                    {t.readyTitle1}<br /><span className="italic font-normal text-[#2E6B3A]">{t.readyTitle2}</span>
                  </h2>
                  <p className="text-[13.5px] leading-6 text-[#5A6B5A] mt-3 max-w-[52ch]">{t.readyDesc}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
                    <div className="bg-white rounded-2xl border border-[#E8E2C9] p-4 shadow-sm">
                      <div className="w-9 h-9 rounded-xl bg-[#E6F0E3] border border-[#D8E6D4] flex items-center justify-center text-[#2E6B3A] font-bold">①</div>
                      <div className="text-sm font-bold mt-3">{t.whatWrong}</div>
                      <div className="text-xs text-[#6B7D6B] mt-1 leading-5">{t.whatWrongDesc}</div>
                    </div>
                    <div className="bg-white rounded-2xl border border-[#E8E2C9] p-4 shadow-sm">
                      <div className="w-9 h-9 rounded-xl bg-[#FFF6D6] border border-amber-100 flex items-center justify-center text-amber-700 font-bold">②</div>
                      <div className="text-sm font-bold mt-3">{t.whatToDoCard}</div>
                      <div className="text-xs text-[#6B7D6B] mt-1 leading-5">{t.whatToDoDesc}</div>
                    </div>
                    <div className="bg-[#143429] rounded-2xl border border-[#143429] p-4 text-white shadow-[0_8px_20px_rgba(20,52,41,0.18)]">
                      <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/10 flex items-center justify-center font-bold">③</div>
                      <div className="text-sm font-bold mt-3">{t.whenToActCard}</div>
                      <div className="text-xs text-white/70 mt-1 leading-5">{t.whenDesc}</div>
                    </div>
                  </div>
                  <div className="mt-6 rounded-2xl overflow-hidden border border-[#E8E2C9] bg-white shadow-sm">
                    <div className="grid grid-cols-4 md:grid-cols-8 divide-x divide-[#F0EBDC]">
                      {WEATHER.hourly.map(h => (
                        <div key={h.hEn} className="p-2.5 text-center">
                          <div className="text-[11px] font-bold text-[#8FA08F]">{hLabel(h)}</div>
                          <div className="mx-auto w-7 h-7 rounded-full bg-[#F6F1E6] border border-[#F0EBDC] flex items-center justify-center mt-1">
                            {h.icon === 'sun' ? <Sun className="w-3.5 h-3.5 text-amber-600" /> : h.icon === 'cloud' ? <Cloud className="w-3.5 h-3.5 text-slate-500" /> : h.icon === 'rain' ? <CloudRain className="w-3.5 h-3.5 text-sky-600" /> : <CloudSun className="w-3.5 h-3.5 text-amber-600" />}
                          </div>
                          <div className="text-xs font-bold mt-1">{h.t}°</div>
                          <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full mt-1 inline-block border ${h.r > 50 ? 'bg-sky-50 text-sky-700 border-sky-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>{h.r}%</div>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-2.5 bg-[#F6F1E6] border-t border-[#F0EBDC] flex items-center justify-between text-[11px]">
                      <span className="font-medium text-[#6B7D6B] flex items-center gap-1.5"><Wind className="w-3.5 h-3.5" />{WEATHER.now.wind} km/h · {WEATHER.now.hum}% {t.humidity.toLowerCase()}</span>
                      <span className="font-bold text-[#2E6B3A]">{t.next12}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-[11px] text-[#8FA08F] font-medium"><ShieldCheck className="w-4 h-4" /> {t.safetyShort}</div>
                  <div className="mt-3 rounded-xl bg-white border border-[#E8E2C9] p-3 flex items-center gap-2.5 text-xs shadow-sm">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0"><Earth className="w-4 h-4 text-emerald-700" /></div>
                    <div className="leading-5"><b className="text-[#143429]">{t.anyWhere}:</b> <span className="text-[#5A6B5A]">{lang === 'TE' ? 'విజయవాడ నుండి ప్రపంచం వరకు — మీ ఊరు టైప్ చేయండి, వాతావరణం ఆటో.' : 'From Vijayawada to the world — type any location, weather updates instantly.'}</span></div>
                  </div>
                </motion.div>
              )}

              {appState === 'preview' && (
                <motion.div key="preview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="bg-white rounded-[28px] border border-[#E8E2C9] shadow-[0_12px_40px_rgba(20,52,41,0.08)] overflow-hidden">
                  <div className="px-6 md:px-7 pt-7 pb-5">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F6F1E6] border border-[#E8E2C9] text-xs font-bold">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> {t.readyToSense}
                    </div>
                    <h2 className="serif text-[24px] md:text-[28px] leading-none tracking-[-0.03em] font-bold mt-3">{t.greatLeaf}</h2>
                    <p className="text-sm text-[#6B7D6B] mt-2">{t.tapAnalyze}</p>
                  </div>
                  <div className="px-6 md:px-7 pb-7">
                    <div className="rounded-2xl border-2 border-dashed border-[#D8E2D4] bg-[#FAFBF8] p-4 grid grid-cols-3 gap-3">
                      {[
                        { icon: Eye, k: t.seeLeaf, v: t.leafInFrame },
                        { icon: MapPin, k: t.senseLocation, v: currentLocation.name },
                        { icon: CloudSun, k: t.senseWeather, v: `${weatherTemp}° · ${WEATHER.now.hum}%` },
                      ].map(i => (
                        <div key={i.k} className="bg-white rounded-xl border border-[#E8E2C9] p-3 text-center shadow-sm">
                          <i.icon className="w-5 h-5 mx-auto text-[#2E6B3A]" />
                          <div className="text-[10px] font-bold tracking-[0.12em] text-[#8FA08F] mt-1">{i.k}</div>
                          <div className="text-xs font-bold leading-tight mt-0.5 truncate">{i.v}</div>
                          <div className="text-[10px] font-bold text-emerald-700 mt-1 flex items-center justify-center gap-1"><CheckCircle2 className="w-3 h-3" /> ✓</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-3 flex gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                      <div className="text-xs leading-5"><span className="font-bold">{t.tipTitle}</span> {t.tipDesc}</div>
                    </div>
                  </div>
                </motion.div>
              )}

              {appState === 'analyzing' && (
                <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white rounded-[28px] border border-[#E8E2C9] shadow-[0_12px_40px_rgba(20,52,41,0.08)] overflow-hidden">
                  <div className="px-6 md:px-8 pt-8 pb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#143429] flex items-center justify-center shadow-sm"><span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin block" /></div>
                      <div>
                        <div className="text-xs font-bold tracking-[0.14em] text-[#8FA08F]">{t.sensingTitle}</div>
                        <div className="text-lg font-bold leading-none">{t.analyzingCrop}</div>
                      </div>
                      <span className="ml-auto hidden md:inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-[#F6F1E6] border"><Timer className="w-3.5 h-3.5" /> {t.sec}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
                      {[
                        { label: t.seeLeafStep, sub: t.detectingSpots, prog: analyzingStep >= 0 },
                        { label: t.senseWeatherStep, sub: t.rainCheck, prog: analyzingStep >= 1 },
                        { label: t.senseLocationStep, sub: currentLocation.name + ' · ' + t.microClimate, prog: analyzingStep >= 2 },
                      ].map((s, idx) => (
                        <div key={s.label} className={`rounded-2xl border p-4 ${s.prog ? 'bg-[#F0F7EE] border-emerald-200 shadow-sm' : 'bg-[#FAFBF8] border-[#E8E2C9]'}`}>
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center ${s.prog ? 'bg-emerald-600 text-white shadow' : 'bg-white border text-[#9AAE9A]'}`}>
                              {s.prog ? <CheckCircle2 className="w-4 h-4" /> : <span className="w-2 h-2 rounded-full bg-[#D8E2D4] animate-pulse block" />}
                            </div>
                            <div className="text-xs font-bold">0{idx + 1}</div>
                          </div>
                          <div className="text-sm font-bold mt-2 leading-none">{s.label}</div>
                          <div className="text-xs text-[#6B7D6B] truncate">{s.sub}</div>
                          <div className="mt-3 h-1.5 rounded-full bg-white border overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: s.prog ? '100%' : '28%' }} transition={{ duration: 0.8 }} className="h-full bg-[#2E6B3A]" />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 rounded-2xl bg-[#143429] text-white p-4 flex items-center gap-4 shadow-lg">
                      <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0"><Brain className="w-6 h-6" /></div>
                      <div className="text-sm leading-5"><span className="font-bold">Kisora AI</span> — {lang === 'TE' ? 'వేలాది ఆకులతో పోల్చి వాతావరణం చూస్తోంది.' : 'Comparing with thousands of cases & checking if spray is safe now.'}</div>
                    </div>
                  </div>
                </motion.div>
              )}

              {appState === 'result' && (
                <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.45 }} className="space-y-4 md:space-y-5">
                  <div className="bg-white rounded-[28px] border border-[#E8E2C9] shadow-[0_12px_40px_rgba(20,52,41,0.08)] overflow-hidden">
                    <div className="px-5 md:px-7 pt-6 pb-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" /> {t.confidence}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-[96px] h-2 rounded-full bg-[#E8E2C9] overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${diagnosis.confidence}%` }} transition={{ duration: 1, delay: 0.3 }} className="h-full bg-[#2E6B3A]" /></div>
                          <span className="text-xs font-extrabold">{diagnosis.confidence}%</span>
                        </div>
                        <span className="ml-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900">
                          <span className={`w-2 h-2 rounded-full ${diagnosis.severity === 'HIGH' ? 'bg-red-600' : diagnosis.severity === 'MEDIUM' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                          {diagnosis.severity} {t.severity}
                        </span>
                      </div>
                      <div className="mt-4 flex gap-4 items-start">
                        <div className="w-14 h-14 rounded-2xl bg-[#F6F1E6] border border-[#E8E2C9] overflow-hidden shrink-0 shadow-sm">
                          {image && <img src={image} alt="leaf" className="w-full h-full object-cover" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h2 className="serif text-[22px] md:text-[28px] leading-none tracking-[-0.03em] font-bold">{diagnosis.title[lang]}</h2>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#143429] text-white text-xs font-bold">
                              <Leaf className="w-3.5 h-3.5" /> {diagnosis.crop[lang]}
                            </span>
                            <span className="text-xs text-[#6B7D6B] italic">{diagnosis.latin}</span>
                            <span className="hidden md:inline text-xs text-[#8FA08F]">· {currentLocation.name} · Early — treatable</span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <div className="rounded-2xl bg-[#F3F6EE] border border-[#E2E8D9] p-4 md:p-5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-white border flex items-center justify-center"><Eye className="w-4 h-4 text-[#2E6B3A]" /></div>
                            <h3 className="text-xs font-extrabold tracking-[0.12em]">{t.whatISee}</h3>
                            <span className="ml-auto text-[11px] font-bold px-2 py-1 rounded-full bg-white border">3 {t.signs}</span>
                          </div>
                          <ul className="mt-3 space-y-2.5">
                            {diagnosis.whatISee[lang].map((txt: string, i: number) => (
                              <motion.li key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.08 }} className="flex gap-2.5 text-[13px] leading-5">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#2E6B3A] shrink-0" />
                                <span className="text-[#253A2B] font-medium">{txt}</span>
                              </motion.li>
                            ))}
                          </ul>
                          <button onClick={() => setVoicesOn(v => !v)} className="mt-4 w-full h-9 rounded-xl bg-white border text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#FFFEFB] shadow-sm">
                            {voicesOn ? <><Volume2 className="w-3.5 h-3.5" /> {t.stopNarration}</> : <><Mic className="w-3.5 h-3.5" /> {t.listenExp}</>}
                          </button>
                        </div>
                        <div className="rounded-2xl bg-white border border-[#E8E2C9] p-4 md:p-5 shadow-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#143429] text-white flex items-center justify-center"><CheckCircle2 className="w-4 h-4" /></div>
                            <h3 className="text-xs font-extrabold tracking-[0.12em]">{t.whatToDo}</h3>
                            <span className="ml-auto text-[11px] font-medium text-[#8FA08F]">{diagnosis.steps[lang].length} {t.stepsMin}</span>
                          </div>
                          <ol className="mt-3 space-y-3">
                            {diagnosis.steps[lang].map((s: any, idx: number) => (
                              <li key={idx} className="flex gap-3">
                                <div className="w-8 h-8 rounded-xl bg-[#F3F6EE] border flex items-center justify-center text-xs font-extrabold text-[#143429] shrink-0">0{idx + 1}</div>
                                <div><div className="text-[13px] font-bold leading-none">{s.t}</div><div className="text-xs leading-5 text-[#5A6B5A] mt-1">{s.d}</div></div>
                              </li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    </div>
                    <div className="px-3 md:px-6 pb-5 md:pb-6">
                      <div className={`rounded-[22px] border-2 p-4 md:p-5 relative overflow-hidden ${diagnosis.wait ? 'bg-[#FFF8E1] border-[#F0C85A] shadow-[0_8px_24px_rgba(240,200,90,0.25)]' : 'bg-[#ECF6EC] border-emerald-300'}`}>
                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${diagnosis.wait ? 'bg-amber-500' : 'bg-emerald-600'}`} />
                        <div className="flex flex-wrap items-start justify-between gap-3 pl-2">
                          <div>
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold tracking-wide shadow-sm ${diagnosis.wait ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'}`}>
                              {diagnosis.wait ? <Timer className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                              {diagnosis.waitMsg[lang]}
                            </div>
                            <div className="text-[11px] font-bold tracking-[0.12em] text-[#8A7A3A] mt-2.5">{t.bestWindow}</div>
                            <div className="serif text-[20px] md:text-[22px] font-bold leading-none tracking-[-0.02em] mt-1">{diagnosis.windowLabel[lang]}</div>
                            <div className="text-sm font-medium text-[#5A4A1A] mt-1 flex items-center gap-1.5"><Sun className="w-4 h-4 text-amber-600" />{diagnosis.windowSub[lang]}</div>
                          </div>
                          <div className={`hidden md:flex w-12 h-12 rounded-2xl items-center justify-center shrink-0 shadow ${diagnosis.wait ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'}`}><Clock className="w-6 h-6" /></div>
                        </div>
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-[1.15fr_0.85fr] gap-3 pl-2">
                          <div className="rounded-xl bg-white/90 border border-[#F0C85A]/50 p-3.5 shadow-sm">
                            <div className="text-xs font-extrabold flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> {t.whyWait}</div>
                            <div className="text-xs leading-5 text-[#5A4A1A] mt-1">{diagnosis.windowReason[lang]}</div>
                            <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-bold">
                              <span className="px-2 py-1 rounded-full bg-amber-100 border border-amber-200">🌧 64% 6 PM</span>
                              <span className="px-2 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800">{currentLocation.name} · Dry</span>
                            </div>
                          </div>
                          <div className="rounded-xl bg-[#143429] text-white p-3.5 flex flex-col justify-center shadow-md border border-white/5">
                            <div className="text-[11px] font-bold tracking-[0.12em] text-white/60">{t.countdown}</div>
                            <div className="text-lg font-extrabold leading-none mt-1">~13 {t.hoursToWindow}</div>
                            <div className="text-xs text-white/70 mt-1">{t.remindShift}</div>
                            <button onClick={() => setReminder(r => !r)} className={`mt-3 w-full h-9 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition ${reminder ? 'bg-emerald-500 text-white shadow' : 'bg-white text-[#143429] shadow'}`}>
                              <span className={`w-2 h-2 rounded-full ${reminder ? 'bg-white' : 'bg-emerald-500 animate-pulse'}`} /> {reminder ? (lang === 'TE' ? '✓ రిమైండర్ పెట్టాం' : '✓ Reminder set') : t.setReminder}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-[28px] border border-[#E8E2C9] shadow-[0_12px_40px_rgba(20,52,41,0.08)] overflow-hidden">
                    <div className="px-5 md:px-7 pt-5 pb-3 flex items-center justify-between">
                      <h3 className="text-xs font-extrabold tracking-[0.12em] flex items-center gap-2"><CloudSun className="w-4 h-4 text-[#2E6B3A]" /> {t.weatherOutlook}</h3>
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#F3F6EE] border">{currentLocation.name} · {t.next24} · {currentLocation.coords}</span>
                    </div>
                    <div className="px-3 md:px-6">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="rounded-2xl bg-[#F3F6EE] border p-3 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-white border flex items-center justify-center"><Thermometer className="w-4.5 h-4.5 text-amber-700" /></div>
                          <div><div className="text-[10px] font-bold tracking-wide text-[#8FA08F]">{t.temp}</div><div className="text-sm font-extrabold">{weatherTemp}°C {t.tempMin}</div></div>
                        </div>
                        <div className="rounded-2xl bg-[#F3F6EE] border p-3 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-white border flex items-center justify-center"><Droplets className="w-4.5 h-4.5 text-sky-700" /></div>
                          <div><div className="text-[10px] font-bold tracking-wide text-[#8FA08F]">{t.humidity}</div><div className="text-sm font-extrabold">{WEATHER.now.hum}% · {t.highRisk}</div></div>
                        </div>
                        <div className="rounded-2xl bg-[#F3F6EE] border p-3 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-white border flex items-center justify-center"><Wind className="w-4.5 h-4.5 text-slate-700" /></div>
                          <div><div className="text-[10px] font-bold tracking-wide text-[#8FA08F]">WIND</div><div className="text-sm font-extrabold">{WEATHER.now.wind} km/h · {t.calm}</div></div>
                        </div>
                      </div>
                      <div className="mt-4 rounded-2xl border border-[#E8E2C9] overflow-hidden">
                        <div className="grid grid-cols-4 md:grid-cols-8 divide-x divide-[#F0EBDC] bg-[#FFFEFB]">
                          {WEATHER.hourly.map(h => (
                            <div key={h.hEn + '2'} className={`p-3 text-center relative ${h.r > 50 ? 'bg-sky-50/60' : ''}`}>
                              {(hLabel(h) === 'ఉ 6' || h.hEn === '6 AM') && <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow">BEST</span>}
                              <div className="text-[11px] font-bold text-[#8FA08F]">{hLabel(h)}</div>
                              <div className="mt-1 flex justify-center">
                                {h.icon === 'rain' ? <CloudRain className="w-5 h-5 text-sky-600" /> : h.icon === 'sun' ? <Sun className="w-5 h-5 text-amber-500" /> : h.icon === 'cloud' ? <Cloud className="w-5 h-5 text-slate-500" /> : <CloudSun className="w-5 h-5 text-amber-600" />}
                              </div>
                              <div className="text-xs font-extrabold mt-1">{h.t}°</div>
                              <div className={`mt-1 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full inline-block border ${h.r > 50 ? 'bg-sky-600 text-white border-sky-600' : 'bg-white border-[#E8E2C9] text-[#5A6B5A]'}`}>{h.r}%</div>
                              <div className="mt-2 h-1.5 rounded-full bg-[#E8E2C9] overflow-hidden"><div className="h-full bg-sky-500" style={{ width: `${h.r}%` }} /></div>
                            </div>
                          ))}
                        </div>
                        <div className="px-4 py-2.5 bg-[#F6F1E6] border-t flex flex-wrap gap-2 items-center justify-between">
                          <span className="text-xs font-medium text-[#6B7D6B] flex items-center gap-1.5"><CloudRain className="w-3.5 h-3.5" /> {t.rainPeak}</span>
                          <span className="text-[11px] font-bold text-[#2E6B3A]">{t.powered} · {currentLocation.name}</span>
                        </div>
                      </div>
                    </div>
                    <div className="px-5 md:px-7 py-4 flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
                      <div className="flex items-start gap-2.5 text-xs leading-5 text-[#6B7D6B] max-w-[52ch]">
                        <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                        <span><span className="font-bold text-[#143429]">{t.safety}</span> {t.safetyLong}</span>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={reset} className="h-9 px-4 rounded-xl bg-white border text-xs font-bold flex items-center gap-1.5 hover:bg-[#F6F1E6]"><RotateCcw className="w-3.5 h-3.5" /> {t.newScan}</button>
                        <button className="h-9 px-4 rounded-xl bg-[#143429] text-white text-xs font-bold flex items-center gap-1.5 shadow"><Phone className="w-3.5 h-3.5" /> {t.talkExpert}</button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {appState === 'low' && (
                <motion.div key="low" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="bg-white rounded-[28px] border border-[#E8E2C9] shadow-[0_12px_40px_rgba(20,52,41,0.08)] overflow-hidden">
                  <div className="p-6 md:p-8">
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center shadow-sm"><AlertTriangle className="w-7 h-7 text-amber-700" /></div>
                    <h2 className="serif text-[24px] md:text-[28px] leading-none tracking-[-0.03em] font-bold mt-4">{t.lowTitle1} <br /><span className="italic font-normal text-[#8A6B1A]">{t.lowTitle2}</span></h2>
                    <p className="text-sm leading-6 text-[#6B7D6B] mt-3 max-w-[48ch]">{t.lowDesc}</p>
                    <div className="mt-5 flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-[#F6F1E6] border overflow-hidden"><div className="h-full w-[42%] bg-amber-500" /></div>
                      <span className="text-xs font-extrabold">42% — {t.tooLow}</span>
                    </div>
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
                      {[{ t: t.fillFrame, d: t.fillDesc }, { t: t.useDaylight, d: t.daylightDesc }, { t: t.noFilter, d: t.noFilterDesc }].map(c => (
                        <div key={c.t} className="rounded-2xl bg-[#F6F1E6] border p-4">
                          <div className="w-8 h-8 rounded-xl bg-white border flex items-center justify-center text-xs font-bold">{c.t[0]}</div>
                          <div className="text-sm font-bold mt-2">{c.t}</div>
                          <div className="text-xs text-[#6B7D6B]">{c.d}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <button onClick={reset} className="h-[52px] rounded-2xl bg-[#143429] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow"><Camera className="w-4 h-4" /> {t.retake}</button>
                      <button className="h-[52px] rounded-2xl bg-white border-2 border-[#143429] text-[#143429] font-extrabold text-sm flex items-center justify-center gap-2"><Phone className="w-4 h-4" /> {t.consult}</button>
                    </div>
                    <p className="text-[11px] text-center text-[#8FA08F] mt-3">{t.neverGuess}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#8FA08F] px-1 font-medium">
              <span className="flex items-center gap-1.5"><Leaf className="w-3.5 h-3.5" /> Kisora · {currentLocation.name} · {LANGS.find(l=>l.code===lang)!.native} · {t.offline}</span>
              <span className="flex items-center gap-1.5"><span className="hidden md:inline">From Vijayawada to the world</span> <span className="w-1 h-1 rounded-full bg-[#8FA08F]" /> No data stored</span>
            </div>
          </div>
        </div>
      </main>

      <div className="mx-auto max-w-[1360px] px-3 md:px-5 pb-8 relative">
        <div className="rounded-2xl bg-[#143429] text-white p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-3 shadow-[0_12px_32px_rgba(20,52,41,0.22)] border border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/15 border border-white/10 flex items-center justify-center"><Leaf className="w-4 h-4" /></div>
            <div>
              <div className="text-sm font-bold leading-none">KISORA — {lang === 'TE' ? 'చూడండి. గ్రహించండి. నిర్ణయించండి.' : lang === 'HI' ? 'देखें। समझें। निर्णय लें।' : 'See. Sense. Decide.'}</div>
              <div className="text-xs text-white/60">AI that respects farmer’s time, spray & soil · Vijayawada · NTR & Krishna · {t.anyWhere}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden md:inline text-xs text-white/60 mr-2">Single-screen · Telugu-first · Global-ready</span>
            <span className="px-3 py-1.5 rounded-full bg-white text-[#143429] text-xs font-extrabold flex items-center gap-1.5 shadow"><MapPinned className="w-3.5 h-3.5" /> {currentLocation.name}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
