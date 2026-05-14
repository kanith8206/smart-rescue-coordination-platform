import React, { useState } from 'react';
import { 
  Shield, 
  Mail, 
  Lock,
  AlertCircle,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/LanguageSelector';

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Mock authentication delay
    setTimeout(() => {
      // Check against localStorage
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        if (userData.email === email && userData.password === password) {
          setIsLoading(false);
          if (userData.role === 'citizen') navigate('/citizen');
          else if (userData.role === 'rescue_team' || userData.role === 'rescue') navigate('/rescue');
          else if (userData.role === 'admin') navigate('/admin');
          return;
        }
      }

      // Default Admin Check (for testing)
      if (email === 'admin@smartrescue.com' && password === 'admin123') {
        setIsLoading(false);
        navigate('/admin');
        return;
      }

      setIsLoading(false);
      setError("❌ Invalid email or password. Please try again.");
    }, 1500);
  };

  const handleEmergencyAccess = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate('/citizen');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col font-sans relative overflow-hidden text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full flex flex-wrap gap-20 p-20">
          {Array.from({ length: 20 }).map((_, i) => (
            <Shield key={i} className="w-32 h-32 rotate-12" />
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="p-6 flex justify-between items-center bg-stone-900/50 backdrop-blur-md border-b border-white/10 relative z-20">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-red-600 p-2 rounded-xl group-hover:scale-110 transition-transform">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter">{t('appName')}</span>
        </Link>
        <div className="flex items-center gap-4">
          <LanguageSelector />
          <button 
            onClick={handleEmergencyAccess}
            className="px-6 py-2.5 bg-red-600 text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-900/40"
          >
            {t('common.emergencyHelp')}
          </button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-stone-900/50 backdrop-blur-xl p-8 md:p-12 rounded-[3rem] shadow-2xl border border-white/10"
          >
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-600/30">
                <Lock className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-3xl font-black tracking-tight mb-2">{t('auth.welcomeBack')}</h2>
              <p className="text-stone-400 text-sm font-medium">{t('auth.signIn')}</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 block ml-1">{t('auth.email')}</label>
                  <div className="relative">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-600" />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com" 
                      className="w-full pl-16 pr-6 py-5 bg-white/5 border border-white/10 rounded-[2rem] focus:outline-none focus:border-red-600 transition-colors text-lg font-bold placeholder:text-stone-700"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 block">{t('auth.password')}</label>
                    <a href="#" className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:underline">{t('auth.forgotPassword')}</a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-600" />
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="w-full pl-16 pr-6 py-5 bg-white/5 border border-white/10 rounded-[2rem] focus:outline-none focus:border-red-600 transition-colors text-lg font-bold placeholder:text-stone-700"
                      required
                    />
                  </div>
                </div>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm font-bold"
                >
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  {error}
                </motion.div>
              )}

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-5 bg-red-600 text-white rounded-[2rem] font-black text-lg shadow-xl shadow-red-900/40 hover:bg-red-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    {t('auth.authenticating')}
                  </>
                ) : (
                  <>
                    {t('auth.signIn')}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 pt-10 border-t border-white/5 text-center">
              <p className="text-stone-500 text-xs font-bold uppercase tracking-widest">
                {t('auth.noAccount')} <Link to="/register" className="text-red-500 hover:underline">{t('auth.registerNow')}</Link>
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="p-8 text-center text-stone-600 text-[10px] font-bold uppercase tracking-[0.2em] relative z-20">
        Secure Emergency Authentication System v3.0
      </footer>
    </div>
  );
}
