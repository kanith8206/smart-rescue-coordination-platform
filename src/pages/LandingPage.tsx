import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  Map as MapIcon, 
  Users, 
  PhoneCall, 
  Menu, 
  X,
  ChevronRight,
  Activity,
  Heart,
  Navigation,
  ShieldAlert,
  LayoutDashboard,
  Smartphone,
  Database,
  Flame,
  Phone,
  Mail,
  Send,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/LanguageSelector';

declare global {
  interface Window {
    emailjs: any;
  }
}

export default function LandingPage() {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: ''
  });

  useEffect(() => {
    // Initialize EmailJS with Public Key
    const publicKey = (import.meta as any).env.VITE_EMAILJS_PUBLIC_KEY;
    if (window.emailjs && publicKey) {
      window.emailjs.init(publicKey);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const serviceId = (import.meta as any).env.VITE_EMAILJS_SERVICE_ID || 'service_btpauwc';
    const templateId = (import.meta as any).env.VITE_EMAILJS_TEMPLATE_ID || 'template_bpey7dd';
    const publicKey = (import.meta as any).env.VITE_EMAILJS_PUBLIC_KEY || 'alVbPOC5ABpUSp9vA';

    if (!serviceId || !templateId || !publicKey) {
      const missing = [];
      if (!serviceId) missing.push('VITE_EMAILJS_SERVICE_ID');
      if (!templateId) missing.push('VITE_EMAILJS_TEMPLATE_ID');
      if (!publicKey) missing.push('VITE_EMAILJS_PUBLIC_KEY');

      setStatus({ 
        type: 'error', 
        message: `❌ EmailJS is not fully configured. Missing: ${missing.join(', ')}. Please set these in the Settings menu.` 
      });
      return;
    }

    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ type: 'error', message: '❌ Please fill in all fields.' });
      return;
    }

    setIsSending(true);
    setStatus({ type: null, message: '' });

    try {
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
        reply_to: formData.email,
        timestamp: new Date().toLocaleString(),
      };

      if (!window.emailjs) {
        throw new Error('EmailJS library not loaded. Please check your internet connection or refresh the page.');
      }

      // Initialize and send with public key explicitly
      window.emailjs.init(publicKey);
      
      const result = await window.emailjs.send(
        serviceId,
        templateId,
        templateParams,
        publicKey
      );

      setStatus({ 
        type: 'success', 
        message: '✅ Your message has been sent! Our team will respond within 24 hours.' 
      });
      setFormData({ name: '', email: '', message: '' });
    } catch (error: any) {
      console.error('EmailJS Error Detail:', error);
      const errorMessage = error?.text || error?.message || 'Unknown error';
      setStatus({ 
        type: 'error', 
        message: `❌ Failed to send: ${errorMessage}. Please verify your credentials in EmailJS dashboard.` 
      });
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 bg-[#111111]">
        {/* Background Gradient */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#111111] via-[#1a1a1a] to-[#0a0a0a]" />
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-sm">
              <Activity className="w-4 h-4 animate-pulse" />
              {t('hero.liveSystem')}
            </div>
            
            <h1 className="text-5xl md:text-8xl font-bold text-white leading-[0.9] tracking-tighter mb-8">
              {t('hero.title').split(' ')[0]} {t('hero.title').split(' ')[1]} <br />
              <span className="text-red-500">{t('hero.title').split(' ').slice(2).join(' ')}</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-stone-300 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
              {t('hero.subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/citizen" className="group px-12 py-6 rounded-[2rem] bg-red-600 text-white font-black text-xl flex items-center gap-4 hover:bg-red-700 transition-all shadow-2xl shadow-red-900/40">
                  <ShieldAlert className="w-7 h-7 animate-pulse" />
                  {t('hero.sosButton')}
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/login" className="group px-12 py-6 rounded-[2rem] bg-white/10 backdrop-blur-md border-2 border-white/30 text-white font-black text-xl flex items-center gap-3 hover:bg-white/20 transition-all">
                  {t('nav.login')}
                  <ChevronRight className="w-7 h-7 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Floating Stats or Indicators */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-12 text-white/40 text-xs font-bold uppercase tracking-[0.2em] hidden md:flex">
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-red-500" />
            {t('hero.tracking')}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-red-500" />
            {t('hero.instantSOS')}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-red-500" />
            {t('hero.relief')}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: t('stats.activeIncidents'), value: '142', color: 'text-red-500' },
            { label: t('stats.rescueTeams'), value: '85', color: 'text-blue-400' },
            { label: t('stats.safeShelters'), value: '1,200', color: 'text-green-400' },
            { label: t('stats.responseTime'), value: '4.2m', color: 'text-yellow-400' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className={`text-4xl md:text-5xl font-bold mb-2 ${stat.color}`}>{stat.value}</div>
              <div className="text-xs uppercase tracking-widest opacity-60 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-4 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-sm font-black uppercase tracking-[0.3em] text-red-600 mb-4">{t('about.mission')}</h2>
              <h3 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">{t('about.title')}</h3>
              <p className="text-lg text-stone-600 mb-8 leading-relaxed">
                {t('about.description')}
              </p>
              
              <div className="space-y-6 mb-10">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{t('about.whoFor')}</h4>
                    <p className="text-stone-500">{t('about.whoForDesc')}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { step: '01', label: t('about.step1') },
                  { step: '02', label: t('about.step2') },
                  { step: '03', label: t('about.step3') },
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                    <div className="text-red-600 font-black text-xl mb-1">{item.step}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400 leading-tight">{item.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square bg-stone-100 rounded-[3rem] overflow-hidden relative border border-stone-200 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center p-12">
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="aspect-video bg-white rounded-2xl shadow-lg flex items-center justify-center"><Activity className="w-8 h-8 text-red-600" /></div>
                    <div className="aspect-video bg-white rounded-2xl shadow-lg flex items-center justify-center"><Navigation className="w-8 h-8 text-blue-600" /></div>
                    <div className="aspect-video bg-white rounded-2xl shadow-lg flex items-center justify-center"><Users className="w-8 h-8 text-green-600" /></div>
                    <div className="aspect-video bg-white rounded-2xl shadow-lg flex items-center justify-center"><ShieldAlert className="w-8 h-8 text-orange-600" /></div>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-red-600 rounded-3xl -z-10 animate-pulse" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-stone-900 rounded-3xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-red-600 mb-4">{t('features.subtitle')}</h2>
            <h3 className="text-4xl font-bold tracking-tight mb-4">{t('features.title')}</h3>
            <p className="text-stone-500 max-w-2xl mx-auto">{t('features.desc')}</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                icon: <AlertTriangle className="w-8 h-8 text-red-600" />, 
                title: t('features.f1Title'), 
                desc: t('features.f1Desc') 
              },
              { 
                icon: <MapIcon className="w-8 h-8 text-blue-600" />, 
                title: t('features.f2Title'), 
                desc: t('features.f2Desc') 
              },
              { 
                icon: <LayoutDashboard className="w-8 h-8 text-green-600" />, 
                title: t('features.f3Title'), 
                desc: t('features.f3Desc') 
              },
              { 
                icon: <Smartphone className="w-8 h-8 text-orange-600" />, 
                title: t('features.f4Title'), 
                desc: t('features.f4Desc') 
              },
              { 
                icon: <Users className="w-8 h-8 text-purple-600" />, 
                title: t('features.f5Title'), 
                desc: t('features.f5Desc') 
              },
              { 
                icon: <Database className="w-8 h-8 text-stone-600" />, 
                title: t('features.f6Title'), 
                desc: t('features.f6Desc') 
              }
            ].map((feature, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-10 rounded-[2.5rem] bg-white border border-stone-100 hover:shadow-2xl hover:-translate-y-2 transition-all group"
              >
                <div className="mb-8 p-4 bg-stone-50 rounded-2xl w-fit group-hover:bg-red-50 transition-colors">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-stone-500 leading-relaxed text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Helpline Section */}
      <section id="helpline" className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-sm font-black uppercase tracking-[0.3em] text-red-600 mb-4">{t('contact.directory')}</h2>
              <h3 className="text-4xl font-bold tracking-tight mb-8">{t('contact.assistance')}</h3>
              <p className="text-stone-500 mb-12">{t('contact.assistanceDesc')}</p>
              
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { name: t('contact.nationalDisaster'), number: '1078', icon: <PhoneCall className="w-5 h-5" />, color: 'bg-red-600' },
                  { name: t('contact.ambulance'), number: '108', icon: <Heart className="w-5 h-5" />, color: 'bg-blue-600' },
                  { name: t('contact.police'), number: '100', icon: <Shield className="w-5 h-5" />, color: 'bg-stone-900' },
                  { name: t('contact.fireBrigade'), number: '101', icon: <Flame className="w-5 h-5" />, color: 'bg-orange-600' },
                ].map((item, i) => (
                  <a 
                    key={i} 
                    href={`tel:${item.number}`}
                    className="p-6 rounded-3xl bg-stone-50 border border-stone-100 flex items-center justify-between hover:bg-white hover:shadow-xl transition-all group"
                  >
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">{item.name}</div>
                      <div className="text-2xl font-black tracking-tighter">{item.number}</div>
                    </div>
                    <div className={`w-10 h-10 rounded-xl ${item.color} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      {item.icon}
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-stone-900 rounded-[3rem] p-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
              
              <h3 className="text-2xl font-bold mb-2">{t('contact.support')}</h3>
              <p className="text-stone-400 text-sm mb-8">{t('contact.supportDesc')}</p>
              
              <form className="space-y-4" onSubmit={handleFormSubmit}>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 mb-2 block">{t('contact.fullName')}</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-600" />
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-red-600 transition-colors" 
                      placeholder={t('contact.namePlaceholder')} 
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 mb-2 block">{t('contact.email')}</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-600" />
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-red-600 transition-colors" 
                      placeholder={t('contact.emailPlaceholder')} 
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 mb-2 block">{t('contact.message')}</label>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm focus:outline-none focus:border-red-600 transition-colors h-32 resize-none" 
                    placeholder={t('contact.messagePlaceholder')}
                    required
                  ></textarea>
                </div>

                {status.type && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl text-xs font-bold ${
                      status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}
                  >
                    {status.message}
                  </motion.div>
                )}

                <button 
                  type="submit"
                  disabled={isSending}
                  className="w-full py-5 bg-red-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-red-700 transition-all shadow-xl shadow-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t('contact.sending')}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {t('contact.submit')}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-stone-200 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-red-600" />
            <span className="text-xl font-bold">{t('appName')}</span>
          </div>
          <div className="flex gap-8 text-sm font-medium text-stone-500">
            <a href="#" className="hover:text-stone-900">{t('footer.privacy')}</a>
            <a href="#" className="hover:text-stone-900">{t('footer.terms')}</a>
            <a href="#helpline" onClick={(e) => scrollToSection(e, 'helpline')} className="hover:text-stone-900">{t('footer.contact')}</a>
          </div>
          <div className="text-sm text-stone-400">
            {t('footer.copyright')}
          </div>
        </div>
      </footer>
    </div>
  );
}
