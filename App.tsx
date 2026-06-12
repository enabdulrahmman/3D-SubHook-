import React, { useState, useRef } from 'react';
import { ART_STYLES, DEFAULT_SCENE_COUNT, LANGUAGES, ASPECT_RATIOS } from './constants';
import { StoryRequest, StoryBoardResponse, GeneratorStatus, CyberAdviceResponse } from './types';
import { generateStoryBoard, generateCyberAdvice } from './services/geminiService';
import { SceneCard } from './components/SceneCard';
import { CharacterCard } from './components/CharacterCard';
import { CopyButton } from './components/CopyButton';

// Lucid Icons for supreme modern high-tech visual cues
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Terminal, 
  Cpu, 
  Layers, 
  Tv, 
  Send, 
  Copy, 
  Smartphone, 
  Check, 
  ExternalLink, 
  HelpCircle,
  Clock,
  Sparkles,
  Zap,
  Globe,
  Settings,
  KeyRound,
  Trash2,
  Moon,
  Info,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const App: React.FC = () => {
  // Navigation Tabs state
  const [activeTab, setActiveTab] = useState<'subhook' | 'cyber' | 'cartoon'>('subhook');

  // Storyboard generator state
  const [formData, setFormData] = useState<StoryRequest>({
    concept: '',
    style: ART_STYLES[0],
    sceneCount: DEFAULT_SCENE_COUNT,
    language: 'العربية',
    aspectRatio: '16:9',
    noMusic: false
  });

  const [status, setStatus] = useState<GeneratorStatus>(GeneratorStatus.IDLE);
  const [result, setResult] = useState<StoryBoardResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cybersecurity Interactive Auditor state
  const [cyberSystem, setCyberSystem] = useState('');
  const [cyberFocus, setCyberFocus] = useState('تأمين المنافذ وحماية البيانات الحساسة من التسريب');
  const [cyberStatus, setCyberStatus] = useState<GeneratorStatus>(GeneratorStatus.IDLE);
  const [cyberResult, setCyberResult] = useState<CyberAdviceResponse | null>(null);
  const [cyberError, setCyberError] = useState<string | null>(null);

  // Copy notify for quick pre-made prompts
  const [copiedPromptId, setCopiedPromptId] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : (name === 'sceneCount' ? parseInt(value) || 0 : value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(GeneratorStatus.GENERATING);
    setError(null);
    setResult(null);

    try {
      const data = await generateStoryBoard(formData);
      setResult(data);
      setStatus(GeneratorStatus.SUCCESS);
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء إنشاء لوحة القصة.");
      setStatus(GeneratorStatus.ERROR);
    }
  };

  const handleCyberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cyberSystem.trim()) return;
    setCyberStatus(GeneratorStatus.GENERATING);
    setCyberError(null);
    setCyberResult(null);

    try {
      const data = await generateCyberAdvice(cyberSystem, cyberFocus);
      setCyberResult(data);
      setCyberStatus(GeneratorStatus.SUCCESS);
    } catch (err: any) {
      setCyberError(err.message || "حدث خطأ أثناء إجراء تحليل الأمن السيبراني.");
      setCyberStatus(GeneratorStatus.ERROR);
    }
  };

  const handleExport = () => {
    if (!result) return;
    const jsonString = JSON.stringify(result, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = `${result.title.replace(/\s+/g, '_')}_Project.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.title && json.scenes) {
            setResult(json as StoryBoardResponse);
            setStatus(GeneratorStatus.SUCCESS);
        } else {
            throw new Error("Invalid JSON format");
        }
      } catch (err) {
        alert("خطأ في قراءة الملف. تأكد من أنه ملف مشروع صالح.");
        console.error(err);
      }
    };
    reader.readAsText(file);
    e.target.value = ''; 
  };

  // Preformed ethical hacking prompts library
  const PREMADE_PROMPTS = [
    {
      id: 1,
      title: "برومبت فحص ثغرات SQL Injection",
      category: "الأمن السيبراني",
      description: "يوجه الذكاء الاصطناعي لتحليل الكود والبحث عن ثغرات حقن قاعدة البيانات.",
      prompt: "Act as an expert Code Auditor. Carefully inspect the following backend controller code for SQL Injection vulnerabilities. Identify unsafe concatenation, highlight line numbers, and provide the fully remediated safe code using prepared statements: [PASTE_YOUR_CODE_HERE]"
    },
    {
      id: 2,
      title: "أمر Nmap المتقدم لكشف جدران الحماية",
      category: "فحص الشبكات",
      description: "فحص متخفي يتفادى الجدران النارية ويكشف الخدمات الحية.",
      prompt: "Create an advanced, stealthy Nmap scan command designed to probe ports behind strict stateful firewalls. Explain each flag (like -sS -f --mtu) and draft a prompt template to help parse the generated XML report automatically using AI."
    },
    {
      id: 3,
      title: "توليد كود تأمين ملفات PHP / Wordpress",
      category: "حماية المواقع",
      description: "برومبت يولد ملفات الحماية لصد هجمات فك التشفير وهجمات المسارات الحساسة.",
      prompt: "Act as a secure Wordpress Hardening Specialist. Write a highly restrictive .htaccess configuration and an advanced wp-config.php security template designed to disable XML-RPC, prevent directory browsing, and block script execution in /uploads/."
    },
    {
      id: 4,
      title: "برومبت تحليل الثغرات الأمنية للذكاء الاصطناعي API Webhook",
      category: "استخبارات وربط",
      description: "مفتش أمني متكامل لمعالجة ثغرات حجب الخدمة وكسر الحماية عبر المدخلات.",
      prompt: "Act as an APIs Application Security Engineer. Review the handling schema of webhook endpoints receiving untrusted JSON inputs. Write a strict validation routine that prevents Server-Side Request Forgery (SSRF) and payload over-DoS."
    }
  ];

  const handleCopyPremade = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2500);
  };

  // Premium services Catalog (SubHook)
  const SUBHOOK_SERVICES = [
    {
      id: "netflix",
      title: "نتفلكس بريميوم - Netflix Premium 4K",
      category: "ترفيه وأفلام",
      price: "سعر منافس وضمان كامل",
      badge: "الأكثر طلباً 🔥",
      desc: "شاهد بدقة Ultra HD 4K فائقة الوضوح على جميع أجهزتك. حسابات رسمية ومضمونة طوال فترة الاشتراك وبدون انقطاع.",
      whatsappTemplate: "مرحباً مهندس عبدالرحمن، أود الاستفسار والاشتراك في حساب نتفلكس بريميوم 4K عبر منصة SubHook."
    },
    {
      id: "youtube",
      title: "يوتيوب بريميوم - YouTube Premium",
      category: "ترفيه وتعلم",
      price: "تفعيل رسمي وآمن",
      badge: "دائم ومستقر",
      desc: "بلا إعلانات مزعجة، ميزة التشغيل في الخلفية، بالإضافة للاشتراك الكامل في خدمات YouTube Music بجودة رائعة.",
      whatsappTemplate: "مرحباً مهندس عبدالرحمن، أود تفعيل اشتراك يوتيوب بريميوم الرسمي على حسابي عبر SubHook."
    },
    {
      id: "chatgpt",
      title: "حسابات الذكاء الاصطناعي ChatGPT Plus / Gemini Advanced",
      category: "ذكاء اصطناعي",
      price: "جاهز ومفعل تلقائياً",
      badge: "للمبرمجين وصناع المحتوى",
      desc: "استمتع بالقوة الكاملة لأحدث نماذج الذكاء الاصطناعي التوليدي لكتابة الأكواد، صياغة النصوص، والتحليل الذكي دون قيود.",
      whatsappTemplate: "مرحباً مهندس عبدالرحمن، أرغب في الحصول على حساب ChatGPT Plus / Gemini Advanced مخصص عبر SubHook."
    },
    {
      id: "canva",
      title: "كانفا برو الاحترافي - Canva Pro",
      category: "تصاميم وجرافيك",
      price: "تنشيط فوري لمدى الحياة/سنوي",
      badge: "مصممين ومسوقين",
      desc: "احصل على مكتبة القوالب الكاملة، كافة الصور المتميزة، وأدوات الحذف التلقائي للخلفية لتصميم بوسترات احترافية بلمسة واحدة.",
      whatsappTemplate: "مرحباً مهندس عبدالرحمن، أرغب في تفعيل اشتراك Canva Pro الاحترافي عبر SubHook."
    },
    {
      id: "vpn",
      title: "خدمات الحماية الفائقة VPN (NordVPN / CyberGhost)",
      category: "أمن وخصوصية",
      price: "تشفير عسكري للبيانات",
      badge: "الأعلى أماناً 🔒",
      desc: "احمِ خصوصيتك الكاملة، فك حظر المواقع والخدمات المحجوبة، واحصل على سرعة خارقة ومستقرة تماماً للألعاب والتصفح الحساس.",
      whatsappTemplate: "مرحباً مهندس عبدالرحمن، أرغب في الحصول على اشتراك VPN آمن ومحمي لحظر تتبع الشبكات من SubHook."
    },
    {
      id: "chatbots",
      title: "بناء البوتات وجدران الحماية المخصصة للمؤسسات",
      category: "برمجيات وأمن",
      price: "تطوير خاص وتأمين متكامل",
      badge: "بناء مهندس محترف 🚀",
      desc: "نظام برمجيات خاص من تصميم المهندس عبدالرحمن الريمي لربط المنشآت ببوتات تيليجرام وواتساب ذكية ومحصنة تماماً ضد الهجمات الرقمية.",
      whatsappTemplate: "مرحباً مهندس عبدالرحمن، أريد الاستفسار عن خدمة بناء البوتات المفتوحة والمؤمنة رقمياً لمشروعي."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-brand-500/30 selection:text-brand-300">
      
      {/* Dynamic Upper Hero Area presenting SubHook & Cyber Security Portal */}
      <div className="bg-gradient-to-b from-brand-950/40 via-slate-950 to-slate-950 relative border-b border-slate-900 overflow-hidden">
        {/* Abstract Tech Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35 z-0"></div>
        {/* Glow Spheres */}
        <div className="absolute top-[-10%] left-[20%] w-[400px] h-[400px] rounded-full bg-brand-500/10 blur-[120px] pointer-events-none"></div>
        <div className="absolute top-[20%] right-[10%] w-[350px] h-[350px] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none"></div>

        {/* Header */}
        <header className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between z-10 border-b border-slate-900">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
               <ShieldCheck className="w-6 h-6 text-white" />
             </div>
             <div>
               <div className="flex items-center gap-2">
                 <span className="text-xs bg-brand-500/20 text-brand-300 border border-brand-500/30 px-2 py-0.5 rounded-full font-mono">SubHook API</span>
                 <span className="text-xs bg-red-500/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded-full font-mono">Cyber Security</span>
               </div>
               <h1 className="text-lg md:text-xl font-black text-white tracking-wide">
                 منصة المطور والمستشار الأمني عبد الرحمن الريمي
               </h1>
             </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <a 
              href="https://wa.me/967772121616" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm px-4 py-2 rounded-xl transition-all shadow-lg shadow-emerald-950/40 transform hover:-translate-y-0.5"
            >
              <Smartphone className="w-4 h-4 animate-bounce" />
              تواصل عبر واتساب
            </a>
          </div>
        </header>

        {/* Hero Content Section */}
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 text-center z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/60 text-slate-300 text-xs shadow-inner mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            الاشتراكات المعتمدة، الأمن السيبراني المتقدم، وهندسة البرومبت
          </div>
          
          <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            بوابة الخدمات الرقمية <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-indigo-300 to-indigo-500 font-mono">SubHook</span> & الأمن السيبراني
          </h2>
          
          <p className="text-slate-400 text-sm sm:text-base max-w-3xl mx-auto mt-4 leading-relaxed">
            تمتع بأفضل باقات تفعيل الاشتراكات الترفيهية والعملية بحماية وضمان مستمر، بالإضافة لأقوى حلول هندسة الأوامر الرقمية، تحليل ثغرات الويب، وأدوات الحماية بإشراف مباشر من <strong className="text-white hover:text-brand-300 transition-colors">المهندس عبدالرحمن الريمي</strong>.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <a 
              href="https://wa.me/967772121616" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base px-8 py-4 rounded-2xl transition-all shadow-xl shadow-emerald-500/10 transform hover:scale-105"
            >
              <Smartphone className="w-6 h-6" />
              طلب خدمة فوري عبر واتساب
            </a>
            
            <a 
              href="https://t.me/toe_Ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-brand-300 border border-slate-800 font-bold text-base px-8 py-4 rounded-2xl transition-all transform hover:scale-105"
            >
              قناتنا في تلجرام
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Core Interactive Switch Tabs (Beautifully Scaled and Large for Mobile Tap Success) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-4xl mx-auto mt-14 bg-slate-900/60 p-2 rounded-2xl border border-slate-800/80 backdrop-blur-md relative z-10">
            <button
              onClick={() => setActiveTab('subhook')}
              className={`flex items-center justify-center gap-3 py-4 px-5 rounded-xl font-bold text-base transition-all duration-300 ${
                activeTab === 'subhook'
                  ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg shadow-brand-500/20 scale-102 border border-brand-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-850/50'
              }`}
            >
              <Layers className="w-5 h-5" />
              <span>الاشتراكات والخدمات الرقمية (SubHook)</span>
            </button>

            <button
              onClick={() => setActiveTab('cyber')}
              className={`flex items-center justify-center gap-3 py-4 px-5 rounded-xl font-bold text-base transition-all duration-300 ${
                activeTab === 'cyber'
                  ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg shadow-brand-500/20 scale-102 border border-brand-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-850/50'
              }`}
            >
              <Terminal className="w-5 h-5" />
              <span>الاختراقات والأمن السيبراني</span>
            </button>

            <button
              onClick={() => setActiveTab('cartoon')}
              className={`flex items-center justify-center gap-3 py-4 px-5 rounded-xl font-bold text-base transition-all duration-300 ${
                activeTab === 'cartoon'
                  ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg shadow-brand-500/20 scale-102 border border-brand-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-850/50'
              }`}
            >
              <Tv className="w-5 h-5" />
              <span>صانع قصص الكرتون الذكي</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full relative z-10">
        
        {/* TAB 1: SUBHOOK - SUBSCRIPTIONS & SERVICES */}
        {activeTab === 'subhook' && (
          <div className="space-y-12 animate-fade-in">
            <div className="text-center max-w-3xl mx-auto">
              <span className="px-3 py-1 rounded-md text-xs font-bold uppercase bg-brand-500/10 text-brand-300 border border-brand-500/20">
                بوابة الحسابات المضمونة والمميزة
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">
                قسم الاشتراكات والخدمات الرقمية في SubHook
              </h3>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                مجموعة متكاملة من الاشتراكات الممتازة لمختلف البرامج الترفيهية والتصميمية والأمنية والعمل بأسعار استثنائية وسرعة تسليم عالية جداً مع المتابعة الفورية والتأمين الكامل.
              </p>
            </div>

            {/* Grid of SubHook Services with beautiful glassmorphism style & Hover transitions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SUBHOOK_SERVICES.map((srv) => (
                <div 
                  key={srv.id}
                  className="bg-slate-900/70 border border-slate-850 hover:border-brand-500/30 rounded-2xl p-6 shadow-xl transition-all duration-305 hover:translate-y-[-4px] flex flex-col justify-between backdrop-blur-md relative overflow-hidden group"
                >
                  {/* Glass decoration shine on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div>
                    {/* Header line */}
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-xs bg-slate-950 text-slate-400 border border-slate-800 px-3 py-1 rounded-full font-medium">
                        {srv.category}
                      </span>
                      {srv.badge && (
                        <span className="text-xs bg-brand-500/20 text-brand-300 border border-brand-500/30 px-2 py-0.5 rounded-full font-bold">
                          {srv.badge}
                        </span>
                      )}
                    </div>

                    <h4 className="text-lg font-black text-white leading-snug group-hover:text-brand-300 transition-colors">
                      {srv.title}
                    </h4>
                    
                    <p className="text-slate-400 text-sm mt-3 leading-relaxed">
                      {srv.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-5 border-t border-slate-850">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs text-slate-500 font-mono">طريقة الطلب</span>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                        {srv.price}
                      </span>
                    </div>

                    <a
                      href={`https://wa.me/967772121616?text=${encodeURIComponent(srv.whatsappTemplate)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-slate-950 bg-emerald-500 hover:bg-emerald-400 font-black text-sm tracking-wide transition-all shadow-lg shadow-emerald-900/20 group-hover:scale-[1.02]"
                    >
                      <Smartphone className="w-4 h-4" />
                      طلب تفعيل فوري
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Quality Seals banner */}
            <div className="bg-slate-900/40 rounded-3xl p-8 border border-slate-900 backdrop-blur-md">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="flex flex-col items-center p-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-400 mb-4">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h5 className="font-extrabold text-white text-base">سرعة قصوى بالتسليم</h5>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">يتم معالجة الطلب وتفعيل حسابك خلال دقائق معدودة من تأكيد العملية.</p>
                </div>

                <div className="flex flex-col items-center p-4 border-y md:border-y-0 md:border-x border-slate-900">
                  <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-400 mb-4">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h5 className="font-extrabold text-white text-base">ضمان كامل ومستدام</h5>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">تأمين حقيقي يغطي مدة الاشتراك كاملة مع تعويض ودعم مستجيب فوري.</p>
                </div>

                <div className="flex flex-col items-center p-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-400 mb-4">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <h5 className="font-extrabold text-white text-base font-['Noto_Sans_Arabic']">بإدارة خبير تقني متمكن</h5>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">خدماتنا تشرف عليها خبرة برمجية وأمنية تضمن خصوصيتك وثبات خدماتك.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CYBER SECURITY & ETHICAL HACKING */}
        {activeTab === 'cyber' && (
          <div className="space-y-12 animate-fade-in">
            
            {/* Top Introductory Info */}
            <div className="text-center max-w-3xl mx-auto">
              <span className="px-3 py-1 rounded-md text-xs font-bold uppercase bg-red-500/10 text-red-300 border border-red-500/20">
                منصة الأمن السيبراني والاختراق الأخلاقي المتقدمة
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">
                قسم الاختراقات والأمن السيبراني
              </h3>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                تقييم حقيقي للمخاطر وتدقيق الشيفرات البرمجية وتصميم أوامر فحص مخصصة لثغرات المواقع والشبكات لرفع كفاءة التأمين التقني ضد هجمات الهاكرز الخبيثين.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Form: Real-time Cyber Audit Prompt Engineer Generator Powered by Gemini! (Extremely interactive!) */}
              <div className="lg:col-span-5 bg-slate-900 rounded-2xl p-6 border border-slate-850 shadow-xl relative overflow-hidden backdrop-blur-md">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-indigo-500 to-brand-500"></div>
                
                <div className="flex items-center gap-2 mb-4">
                  <Terminal className="w-5 h-5 text-red-400" />
                  <h4 className="text-lg font-bold text-white">فاحص ومطور أوامر الاختراق الأخلاقي</h4>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  اكتب وصفاً للنظام الذي تملك بروتوكولاً لفحصه (مثال: سيرفر استضافة، موقع مبرمج بـ Laravel، سيرفر تخزين صور، قاعدة بيانات سحابية) وسيقوم محرك الذكاء الاصطناعي السيبراني لدى المهندس عبدالرحمن بتوليد تقرير ثغرات فوري، وأوامر لينكس للفحص، وبرومبت أمني جاهز للاستخدام.
                </p>

                <form onSubmit={handleCyberSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-2">وصف السيرفر، الموقع، أو النظام المراد فحصه</label>
                    <textarea
                      required
                      rows={4}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all placeholder-slate-600 text-slate-200"
                      placeholder="امثلة: موقع ووردبريس لمتجر يحمل إضافات دفع قديمة، سيرفر لينكس لتخزين قواعد البيانات الحساسة، تطبيق ويب للنقاشات..."
                      value={cyberSystem}
                      onChange={(e) => setCyberSystem(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-2 font-['Noto_Sans_Arabic']">محور التركيز واهتمامات التدقيق</label>
                    <input
                      type="text"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none text-slate-200"
                      value={cyberFocus}
                      onChange={(e) => setCyberFocus(e.target.value)}
                      placeholder="مثال: حماية ملفات التكوين والشبكة الخارجية"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={cyberStatus === GeneratorStatus.GENERATING}
                    className={`w-full py-3.5 rounded-xl font-bold text-sm text-white shadow-lg transition-all ${
                      cyberStatus === GeneratorStatus.GENERATING
                        ? 'bg-slate-800 cursor-not-allowed animate-pulse text-slate-400'
                        : 'bg-gradient-to-r from-red-600 to-indigo-600 hover:from-red-500 hover:to-indigo-500'
                    }`}
                  >
                    {cyberStatus === GeneratorStatus.GENERATING ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        جاري فحص الأمن وهندسة الأوامر الحية...
                      </span>
                    ) : (
                      'توليد تقرير الفحص وأوامر Ethical Hacking'
                    )}
                  </button>
                </form>
              </div>

              {/* Right Output: Real-time Cyber Audit Output Area */}
              <div className="lg:col-span-7 space-y-6">
                
                {cyberStatus === GeneratorStatus.IDLE && (
                  <div className="bg-slate-900/30 border-2 border-dashed border-slate-900 rounded-2xl p-10 flex flex-col items-center justify-center text-center text-slate-500 min-h-[360px]">
                    <ShieldCheck className="w-16 h-16 mb-4 text-slate-800" />
                    <h4 className="text-lg font-bold text-slate-400">فحص أمني فوري في انتظار المدخلات</h4>
                    <p className="text-slate-500 text-sm max-w-sm mt-2 leading-relaxed">
                      تفاعل مع الموديل لتوليد أوامر الاختراق الأخلاقي المخصصة لنظامك وحمايتها من هجمات الحقن وسرقة الجلسات.
                    </p>
                  </div>
                )}

                {cyberStatus === GeneratorStatus.ERROR && (
                  <div className="bg-red-950/20 border border-red-500/30 p-6 rounded-2xl flex items-start gap-4">
                    <ShieldAlert className="w-8 h-8 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-red-200 font-extrabold text-base">عذراً، حدث خطأ في التدقيق الأمن الرقمي</h4>
                      <p className="text-slate-400 text-xs mt-1 leading-relaxed">{cyberError}</p>
                    </div>
                  </div>
                )}

                {cyberStatus === GeneratorStatus.GENERATING && (
                  <div className="bg-slate-900/40 border border-slate-900 p-8 rounded-2xl text-center min-h-[300px] flex flex-col items-center justify-center">
                    <div className="relative mb-6">
                      <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-red-500 animate-spin"></div>
                      <Terminal className="w-6 h-6 text-red-400 absolute top-5 left-5" />
                    </div>
                    <h4 className="text-white text-base font-bold animate-pulse">جاري صياغة وابتكار الأوامر الرقمية وبرومبت الفحص</h4>
                    <p className="text-slate-400 text-xs max-w-md mt-2 leading-relaxed">
                      تقوم خوارزمية المستشار الأمني عبدالرحمن الريمي بإنشاء جدار الفحص وملاحظات الأمن والتعليمات الخاصة بالمواقع الإلكترونية والشبكات.
                    </p>
                  </div>
                )}

                {cyberStatus === GeneratorStatus.SUCCESS && cyberResult && (
                  <div className="space-y-6 animate-fade-in text-start">
                    
                    {/* General Summary Card */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-red-500 animate-ping"></span>
                          <h4 className="text-xl font-bold text-white">{cyberResult.title}</h4>
                        </div>
                        <span className={`text-xs ml-auto sm:ml-0 font-bold px-3 py-1 rounded-full border ${
                          cyberResult.riskLevel.includes('حرِج') || cyberResult.riskLevel.includes('مرتفع')
                            ? 'bg-red-500/15 text-red-400 border-red-500/30'
                            : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                        }`}>
                          مستوى الخطورة المبدئي الرئيسي: {cyberResult.riskLevel}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed">{cyberResult.summary}</p>
                    </div>

                    {/* Detected Threat Models and Vulnerabilities */}
                    <div>
                      <h4 className="text-base font-bold text-slate-300 mb-3">الثغرات الأمنية المحتملة وطريقة الإغلاق</h4>
                      <div className="space-y-4">
                        {cyberResult.vulnerabilities.map((vul, idx) => (
                          <div key={idx} className="bg-slate-900/50 border border-slate-850 p-5 rounded-xl">
                            <div className="flex justify-between items-center mb-2">
                              <h5 className="font-bold text-white text-sm">{vul.title}</h5>
                              <span className="text-xs font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded">
                                {vul.risk}
                              </span>
                            </div>
                            <p className="text-slate-400 text-xs leading-relaxed mb-3">{vul.description}</p>
                            <div className="bg-emerald-950/10 border-s-4 border-emerald-500 p-3 rounded-e-lg">
                              <span className="text-xs font-black text-emerald-400 block mb-1">خطوات الإغلاق والمكافحة والوقاية (Remediation):</span>
                              <p className="text-slate-300 text-xs leading-relaxed">{vul.fix}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Auto-generated Inspection & Ethical Hack command sheets */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-base font-black text-slate-300">أدوات الفحص وأوامر الطرفية المعتمدة (Sandbox Testing)</h4>
                        <span className="text-[10px] text-slate-500 font-mono">ethical-use only</span>
                      </div>
                      
                      <div className="space-y-4">
                        {cyberResult.commands.map((cmd, idx) => (
                          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                            <div className="bg-slate-850 px-4 py-2 border-b border-slate-800 flex justify-between items-center">
                              <span className="text-xs font-bold text-brand-300 font-mono">أداة الفحص: {cmd.tool}</span>
                              <span className="text-[10px] text-slate-400">{cmd.description}</span>
                            </div>

                            <div className="p-4 bg-slate-950 space-y-3">
                              {/* Raw Command */}
                              <div className="relative">
                                <div className="absolute top-2 right-2 z-10">
                                  <CopyButton text={cmd.command} label="نسخ الكود" />
                                </div>
                                <pre className="text-xs text-brand-400 p-4 pt-10 rounded-lg bg-slate-900 overflow-x-auto font-mono text-left" dir="ltr">
                                  {cmd.command}
                                </pre>
                              </div>

                              {/* AI Engineering Prompt */}
                              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-850">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-[11px] font-bold text-slate-400">برومبت لفحص مخرجات هذه الأداة أو تحليل الكود بالذكاء الاصطناعي:</span>
                                  <CopyButton text={cmd.promptText} label="نسخ البرومبت" />
                                </div>
                                <p className="text-[11px] text-slate-300 font-mono text-left leading-relaxed max-h-24 overflow-y-auto" dir="ltr">
                                  {cmd.promptText}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recommendations and advice by Eng. Abdulrahman Al-Reemi */}
                    <div className="bg-slate-900/40 rounded-2xl p-6 border border-slate-850">
                      <div className="flex items-center gap-2 mb-3">
                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                        <h4 className="text-sm font-extrabold text-white">إرشادات ونصائح الأمان من المهندس عبدالرحمن الريمي</h4>
                      </div>
                      <ul className="space-y-2 text-slate-400 text-xs">
                        {cyberResult.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex gap-2 items-start">
                            <span className="text-emerald-500 font-bold shrink-0">✓</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>
                )}

              </div>

            </div>

            {/* Quick Interactive Prompt Templates library */}
            <div className="pt-8 border-t border-slate-900">
              <h3 className="text-lg md:text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-brand-400" />
                مكتبة برومبت هندسة الأوامر الجاهزة للاختبار الأخلاقي
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PREMADE_PROMPTS.map((p) => (
                  <div key={p.id} className="bg-slate-900/60 border border-slate-850 rounded-xl p-5 hover:border-slate-700 transition-colors flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[11px] font-bold text-brand-400 uppercase tracking-wider">{p.category}</span>
                        <button
                          onClick={() => handleCopyPremade(p.id, p.prompt)}
                          className={`text-[10px] px-2.5 py-1 rounded transition-all font-mono ${
                            copiedPromptId === p.id 
                              ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                              : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-850'
                          }`}
                        >
                          {copiedPromptId === p.id ? 'تم نسخ البرومبت!' : 'نسخ البرومبت'}
                        </button>
                      </div>
                      <h4 className="text-sm font-bold text-slate-200 mb-1">{p.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed max-h-16 overflow-hidden text-ellipsis mb-4">{p.description}</p>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-lg text-left" dir="ltr">
                      <p className="text-[10px] text-slate-300 font-mono truncate">{p.prompt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: ORIGINAL CARTOON ADVENTURE GENERATOR */}
        {activeTab === 'cartoon' && (
          <div className="space-y-10 animate-fade-in">
            <div className="text-center max-w-2xl mx-auto">
              <span className="px-3 py-1 rounded-md text-xs font-bold uppercase bg-brand-500/10 text-brand-300 border border-brand-500/20">
                صناعة وهندسة المحتوى البصري
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">
                صانع ومخطط قصص الكرتون والرسوم المتحركة
              </h3>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                صمم برومبت الصور ومسارات التحريك ومسودات السيناريو لأي فكرة كرتونية تخطر في بالك باستخدام الذكاء الاصطناعي لإنشاء لوحة قصة متكاملة جاهزة للتصميم.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Right Column (Controls) */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-slate-900 rounded-2xl p-6 border border-slate-850 shadow-xl sticky top-24 backdrop-blur-md">
                  <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-brand-500 rounded-full"></span>
                    إعدادات القصة
                  </h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Concept */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-2">فكرة القصة</label>
                      <textarea
                        name="concept"
                        required
                        rows={5}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all placeholder-slate-600 text-slate-100"
                        placeholder="مثال: روبوت وحيد يجد زهرة على المريخ ويحاول حمايتها من عاصفة رملية..."
                        value={formData.concept}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Style */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-2">أسلوب الرسم (Art Style)</label>
                      <select
                        name="style"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none text-slate-100"
                        value={formData.style}
                        onChange={handleInputChange}
                      >
                        {ART_STYLES.map(style => (
                          <option key={style} value={style}>{style}</option>
                        ))}
                      </select>
                    </div>

                    {/* Aspect Ratio */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-2 font-['Noto_Sans_Arabic']">أبعاد الفيديو (Aspect Ratio)</label>
                      <select
                        name="aspectRatio"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none text-slate-100"
                        value={formData.aspectRatio}
                        onChange={handleInputChange}
                      >
                        {ASPECT_RATIOS.map(ratio => (
                          <option key={ratio.value} value={ratio.value}>{ratio.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Language */}
                     <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-2 font-['Noto_Sans_Arabic']">لغة الحوار</label>
                      <select
                        name="language"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none text-slate-100"
                        value={formData.language}
                        onChange={handleInputChange}
                      >
                        {LANGUAGES.map(lang => (
                          <option key={lang} value={lang}>{lang}</option>
                        ))}
                      </select>
                    </div>

                    {/* Scene Count */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-2 font-['Noto_Sans_Arabic']">
                        عدد المشاهد
                      </label>
                      <input
                        type="number"
                        name="sceneCount"
                        min="1"
                        max="15"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none text-slate-100 placeholder-slate-600"
                        value={formData.sceneCount}
                        onChange={handleInputChange}
                        placeholder="أدخل عدد المشاهد المطلوبة"
                      />
                    </div>

                    {/* Audio Option */}
                    <div className="bg-slate-950/50 border border-slate-850 rounded-xl p-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="noMusic"
                          checked={formData.noMusic}
                          onChange={handleInputChange}
                          className="w-5 h-5 text-brand-600 bg-slate-900 border-slate-700 rounded focus:ring-brand-500 focus:ring-2"
                        />
                        <span className="text-xs text-slate-300 select-none leading-relaxed">
                          توليد فيديو بدون موسيقى خلفية (مؤثرات صوتية فقط)
                        </span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={status === GeneratorStatus.GENERATING}
                      className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-0.5 ${
                        status === GeneratorStatus.GENERATING
                          ? 'bg-slate-800 cursor-not-allowed animate-pulse text-slate-400'
                          : 'bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500'
                      }`}
                    >
                      {status === GeneratorStatus.GENERATING ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          جاري هندسة الأوامر...
                        </span>
                      ) : (
                        'إنشاء خطة العمل البصري'
                      )}
                    </button>
                    
                    {/* Mobile Import Button */}
                    <button 
                       type="button"
                       onClick={handleImportClick}
                       className="w-full sm:hidden flex justify-center items-center gap-2 text-sm bg-slate-850 hover:bg-slate-800 text-slate-300 py-3 rounded-xl border border-slate-800 transition-colors"
                     >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        استيراد مشروع ومخطط سابق
                     </button>
                  </form>
                </div>
              </div>

              {/* Left Column (Results) */}
              <div className="lg:col-span-8">
                
                {status === GeneratorStatus.IDLE && (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 min-h-[460px] border-2 border-dashed border-slate-900 rounded-2xl p-6 bg-slate-900/10">
                    <Tv className="w-16 h-16 mb-4 text-slate-800" />
                    <p className="text-lg font-bold text-slate-400">أدخل فكرة قصتك للبدء، أو استورد ملف خارجي.</p>
                    <p className="text-slate-500 text-sm mt-1 max-w-md text-center leading-relaxed">
                      الذكاء الاصطناعي سيقوم بابتكار الشخصيات المحددة وعناصر الفن، وتفصيل المشاهد، وأمر الرسم بالتاريخ والإضاءة، وتحريك السيناريو.
                    </p>
                    
                    <div className="mt-6 flex gap-3">
                      <input 
                        type="file" 
                        accept=".json" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        className="hidden" 
                      />
                      <button 
                        onClick={handleImportClick}
                        className="flex items-center gap-2 text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 px-4 py-2 rounded-xl border border-slate-800 transition-all font-mono"
                      >
                         رفع ملف .json للمشروع
                      </button>
                    </div>
                  </div>
                )}

                {status === GeneratorStatus.ERROR && (
                  <div className="bg-red-950/20 border border-red-500/30 text-red-200 p-6 rounded-2xl flex items-start gap-4">
                     <ShieldAlert className="w-6 h-6 shrink-0 mt-0.5 text-red-400" />
                     <div>
                       <h3 className="font-bold">خطأ في إنشاء محتوى القصة المصورة</h3>
                       <p className="text-sm mt-1 opacity-80">{error}</p>
                     </div>
                  </div>
                )}

                {status === GeneratorStatus.GENERATING && (
                  <div className="bg-slate-900/40 border border-slate-900 p-10 rounded-2xl text-center min-h-[300px] flex flex-col items-center justify-center">
                    <div className="relative mb-6">
                      <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-brand-500 animate-spin"></div>
                      <Tv className="w-6 h-6 text-brand-400 absolute top-5 left-5" />
                    </div>
                    <h4 className="text-white text-base font-bold animate-pulse">جاري تأليف تفاصيل الخطة الكرتونية وهندسة المشاهد</h4>
                    <p className="text-slate-400 text-xs max-w-md mt-2 leading-relaxed">
                      يقوم المحرك الفني بصياغة أسماء الشخصيات والبرومبت الإنتاجي المتوافق مع Midjourney ومحركات تحريك الفيديو كرتون.
                    </p>
                  </div>
                )}

                {result && status === GeneratorStatus.SUCCESS && (
                  <div className="space-y-10 animate-fade-in text-start">
                    
                    {/* Exporter UI tools in Storyboard mode */}
                    <div className="flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-850">
                      <span className="text-xs text-slate-400 font-mono">الإنتاج جاهز للتصدير والاستخدام المباشر</span>
                      <button 
                         onClick={handleExport}
                         className="flex items-center gap-2 text-xs bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg transition-colors font-semibold shadow-lg shadow-brand-500/20"
                       >
                          تنزيل ملف المشروع في صيغة JSON
                       </button>
                    </div>

                    {/* Title & Summary */}
                    <div className="bg-slate-900 rounded-2xl p-8 border border-slate-850 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-500 via-indigo-500 to-purple-500"></div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">{result.title}</h2>
                      <p className="text-slate-400 text-sm leading-relaxed">{result.summary}</p>
                    </div>

                    {/* Assets Section */}
                    <section>
                      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                        <span className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                          <Layers className="w-5 h-5" />
                        </span>
                        شخصيات ومحتويات الفن (Visual Assets Required)
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {result.assets.map((asset, idx) => (
                          <CharacterCard key={idx} asset={asset} />
                        ))}
                      </div>
                    </section>

                    {/* Scenes Section */}
                    <section>
                      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                        <span className="p-2 bg-pink-500/10 rounded-lg text-pink-400">
                          <Tv className="w-5 h-5" />
                        </span>
                        أمر السيناريو والمشاهد بالتفصيل
                      </h3>
                      <div className="space-y-6">
                        {result.scenes.map((scene) => (
                          <SceneCard key={scene.sceneNumber} scene={scene} />
                        ))}
                      </div>
                    </section>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

      </main>

      {/* FOOTER & DEVELOPER INFO - INCLUDED STRICTLY AS REQUESTED */}
      <footer className="bg-slate-950 border-t border-slate-900 py-12 mt-16 relative">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-6">
          <div className="flex flex-col items-center justify-center space-y-2">
            <span className="text-xs bg-slate-900 text-slate-400 border border-slate-800 px-3 py-1 rounded-full">
              قنوات الاتصال المباشرة للمطور والمستشار الأمني
            </span>
            <p className="text-slate-400 text-sm">تطوير وتصميم مهندس الأنظمة وأمن المعلومات</p>
            <h4 className="text-xl sm:text-2xl font-black text-white">المهندس عبدالرحمن عبده على محمد حسين الريمي</h4>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a 
              href="https://t.me/toe_Ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 hover:text-brand-300 text-slate-300 px-6 py-3 rounded-xl border border-slate-800 transition-all text-sm font-bold"
            >
              <svg className="w-5 h-5 text-brand-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.93 1.23-5.46 3.62-.51.35-.98.52-1.4.51-.46-.01-1.35-.26-2.01-.48-.81-.27-1.45-.42-1.39-.89.03-.24.37-.49 1.02-.75 4-1.74 6.67-2.88 8.01-3.44 3.81-1.58 4.6-1.85 5.12-1.86.11 0 .37.03.54.17.14.12.18.28.2.44.02.12.02.25.01.38z"/>
              </svg>
              حساب التيليجرام الرسمي: toe_Ai
            </a>

            <a 
              href="https://wa.me/967772121616" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-3 rounded-xl transition-all text-sm font-black"
            >
              <Smartphone className="w-5 h-5" />
              تواصل عبر واتساب: 967772121616+
            </a>
          </div>

          <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-slate-600 text-xs gap-4">
            <p className="font-mono">SubHook Engine v2.4 (React 19 & Gemini 3 PRO)</p>
            <p className="font-sans">© {new Date().getFullYear()} م. عبدالرحمن الريمي. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>

      {/* FLOATING WHATSAPP BUTTON FOR MOBILE (Strictly requested to be sticky at the bottom screen for mobile view) */}
      <div className="md:hidden fixed bottom-5 left-5 right-5 z-50 text-center animate-bounce">
        <a 
          href="https://wa.me/967772121616" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-base py-4 px-6 rounded-2xl shadow-2xl shadow-emerald-500/45 border border-emerald-400/30"
          id="mobile-floating-whatsapp"
        >
          <Smartphone className="w-6 h-6 shrink-0" />
          <span>تواصل الآن عبر واتساب (المهندس عبدالرحمن)</span>
        </a>
      </div>

    </div>
  );
};

export default App;
