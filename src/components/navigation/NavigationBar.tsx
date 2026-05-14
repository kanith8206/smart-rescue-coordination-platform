import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ShieldAlert, Home, Activity, PhoneCall,
  LayoutDashboard, Map as MapIcon, Users, AlertCircle, Package, LogIn
} from 'lucide-react';
import { cn } from '../../utils/cn';
import LanguageSelector from '../LanguageSelector';
import { EmergencyQuickAccess } from './EmergencyQuickAccess';
import { useAppStore } from '../../store/useAppStore';

export function NavigationBar() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { isEmergencyMode } = useAppStore();
  const [showQuickAccess, setShowQuickAccess] = useState(false);

  const path = location.pathname;
  let role = 'guest';
  if (path.startsWith('/citizen')) role = 'citizen';
  if (path.startsWith('/rescue')) role = 'rescue';
  if (path.startsWith('/admin')) role = 'admin';

  // Desktop Top Nav links - only show for guest/home
  const guestLinks = [
    { label: t('nav.about'), href: '/#about' },
    { label: t('nav.features'), href: '/#features' },
    { label: t('nav.contact'), href: '/#helpline' },
  ];

  const citizenLinks = [
    { label: t('nav.home', 'Home'), path: '/citizen', icon: <Home className="w-6 h-6 sm:w-5 sm:h-5" /> },
    { label: t('nav.emergency', 'SOS'), path: '#sos', icon: <ShieldAlert className="w-8 h-8" />, primary: true },
    { label: t('nav.status', 'Status'), path: '/citizen#status', icon: <Activity className="w-6 h-6 sm:w-5 sm:h-5" /> },
    { label: t('nav.help', 'Help'), path: '#contacts', icon: <PhoneCall className="w-6 h-6 sm:w-5 sm:h-5" />, action: () => setShowQuickAccess(true) },
  ];

  const rescueLinks = [
    { label: t('nav.dashboard', 'Dashboard'), path: '/rescue', icon: <LayoutDashboard className="w-6 h-6 sm:w-5 sm:h-5" /> },
    { label: t('nav.liveAlerts', 'Alerts'), path: '/rescue#alerts', icon: <AlertCircle className="w-6 h-6 sm:w-5 sm:h-5" /> },
    { label: t('nav.disasterMap', 'Map'), path: '/heatmap', icon: <MapIcon className="w-6 h-6 sm:w-5 sm:h-5" /> },
    { label: t('nav.assignedTasks', 'Tasks'), path: '/rescue#tasks', icon: <Users className="w-6 h-6 sm:w-5 sm:h-5" /> },
  ];

  const adminLinks = [
    { label: t('nav.dashboard', 'Dashboard'), path: '/admin', icon: <LayoutDashboard className="w-6 h-6 sm:w-5 sm:h-5" /> },
    { label: t('nav.disasterMap', 'Map'), path: '/heatmap', icon: <MapIcon className="w-6 h-6 sm:w-5 sm:h-5" /> },
    { label: t('nav.resources', 'Resources'), path: '/admin#resources', icon: <Package className="w-6 h-6 sm:w-5 sm:h-5" /> },
    { label: t('nav.liveAlerts', 'Alerts'), path: '/admin#alerts', icon: <AlertCircle className="w-6 h-6 sm:w-5 sm:h-5" /> },
  ];

  const currentLinks: any[] = 
    role === 'citizen' ? citizenLinks :
    role === 'rescue' ? rescueLinks :
    role === 'admin' ? adminLinks : [];

  const handleNavClick = (e: React.MouseEvent, item: any) => {
    if (item.action) {
      item.action();
      return;
    }
    if (item.primary) {
      // Focus or actuate the main SOS button remotely if possible
      const sosBtn = document.getElementById('main-sos-btn');
      if (sosBtn) sosBtn.click();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate(item.path);
    }
  };

  return (
    <>
      {/* --- TOP NAVBAR --- */}
      <nav className={cn(
        "fixed top-0 w-full z-40 transition-all duration-300 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm",
        isEmergencyMode && role === 'citizen' ? "bg-red-50/95 border-red-100" : ""
      )}>
         <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
           {/* Logo */}
           <Link to="/" className="flex items-center gap-2 outline-none">
              <div className="bg-red-600 p-1.5 rounded-lg shadow-sm">
                <ShieldAlert className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-stone-900 hidden sm:block">
                {t('appName', 'SmartRescue')}
              </span>
           </Link>

           {/* Center Desktop Links (Only for Guest) */}
           {role === 'guest' && (
             <div className="hidden md:flex items-center gap-8">
               {guestLinks.map((link, i) => (
                 <a key={i} href={link.href} className="text-sm font-bold text-stone-500 hover:text-red-600 transition-colors">
                   {link.label}
                 </a>
               ))}
             </div>
           )}

           {/* Right Side: Language & Auth/Profile */}
           <div className="flex items-center gap-4">
             <LanguageSelector />
             {role === 'guest' ? (
               <Link to="/login" className="flex items-center gap-2 text-[10px] md:text-sm font-black uppercase tracking-widest px-4 md:px-5 py-2 rounded-full border border-stone-200 hover:bg-stone-50 transition-all">
                 <LogIn className="w-4 h-4" />
                 <span className="hidden sm:inline">{t('nav.login')}</span>
               </Link>
             ) : (
               <Link to="/" className="text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-red-600 transition-colors border border-stone-200 px-4 py-2 rounded-full hover:bg-red-50 hover:border-red-100">
                 {t('nav.logout')}
               </Link>
             )}
           </div>
         </div>
      </nav>

      {/* --- BOTTOM MOBILE & DESKTOP NAVBAR (Role-based) --- */}
      {role !== 'guest' && (
        <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-stone-200 pb-safe z-50 lg:bottom-6 lg:w-auto lg:left-1/2 lg:-translate-x-1/2 lg:rounded-[2rem] lg:border lg:shadow-2xl lg:px-6">
          <div className="flex justify-around items-center h-[72px] sm:h-16 max-w-md mx-auto lg:gap-10 sm:max-w-3xl">
            {currentLinks.map((item, i) => (
               <div key={i} className="flex-1 flex justify-center">
                 {item.primary ? (
                    <button 
                      onClick={(e) => handleNavClick(e, item)}
                      className="relative -top-6 sm:-top-5 bg-red-600 text-white w-20 h-20 sm:w-16 sm:h-16 rounded-full flex flex-col items-center justify-center shadow-[0_15px_30px_rgba(220,38,38,0.4)] hover:bg-red-700 hover:scale-[1.05] active:scale-95 transition-all outline outline-[6px] outline-white/40 backdrop-blur-sm"
                    >
                      <div className="absolute inset-0 rounded-full border-4 border-red-600 animate-ping opacity-30"></div>
                      {item.icon}
                      <span className="text-[10px] sm:text-[8px] font-black uppercase tracking-wider mt-0.5">{item.label}</span>
                    </button>
                 ) : (
                   <button 
                     onClick={(e) => handleNavClick(e, item)} 
                     className={cn(
                       "flex flex-col items-center justify-center gap-1.5 w-16 group transition-colors", 
                       location.pathname === item.path ? "text-red-600" : (isEmergencyMode ? "opacity-60 text-stone-500 hover:opacity-100" : "text-stone-400 hover:text-red-600")
                     )}
                   >
                     {item.icon}
                     <span className={cn(
                       "text-[10px] sm:text-[9px] font-bold text-center leading-none truncate w-full uppercase tracking-widest", 
                       location.pathname === item.path ? "text-red-600 font-black" : "group-hover:text-red-600"
                     )}>
                       {item.label}
                     </span>
                   </button>
                 )}
               </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Access Modal */}
      <EmergencyQuickAccess isOpen={showQuickAccess} onClose={() => setShowQuickAccess(false)} />
    </>
  );
}
