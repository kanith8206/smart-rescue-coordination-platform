import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertCircle, 
  MapPin, 
  Mic, 
  Phone, 
  Navigation, 
  ShieldAlert,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Droplets,
  UserRound,
  X,
  ChevronRight,
  Info,
  MicOff,
  Trash2,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/LanguageSelector';
import socket from '../services/socket';
import { cn } from '../utils/cn';
import { Button } from '../components/ui/Button';
import { useAppStore } from '../store/useAppStore';
import { useShakeDetection } from '../hooks/useShakeDetection';
import { playVoiceAlert } from '../utils/voice';
import Map, { Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

const QUICK_MESSAGES = [
  { id: 'injured', labelKey: 'citizen.quickMessages.injured', icon: <UserRound className="w-6 h-6" />, color: 'bg-red-100 text-red-600 border-red-200' },
  { id: 'trapped', labelKey: 'citizen.quickMessages.trapped', icon: <AlertTriangle className="w-6 h-6" />, color: 'bg-orange-100 text-orange-600 border-orange-200' },
  { id: 'medical', labelKey: 'citizen.quickMessages.medical', icon: <CheckCircle2 className="w-6 h-6" />, color: 'bg-blue-100 text-blue-600 border-blue-200' },
  { id: 'flood', labelKey: 'citizen.quickMessages.flood', icon: <Droplets className="w-6 h-6" />, color: 'bg-cyan-100 text-cyan-600 border-cyan-200' },
  { id: 'fire', labelKey: 'citizen.quickMessages.fire', icon: <Flame className="w-6 h-6" />, color: 'bg-amber-100 text-amber-600 border-amber-200' },
];

const EMERGENCY_CONTACTS = [
  { nameKey: 'citizen.police', number: '100', icon: <ShieldAlert className="w-5 h-5" /> },
  { nameKey: 'citizen.ambulance', number: '108', icon: <AlertCircle className="w-5 h-5" /> },
  { nameKey: 'citizen.disasterHelpline', number: '911', icon: <Phone className="w-5 h-5" /> },
];

export default function CitizenDashboard() {
  const { t } = useTranslation();
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [showSOSConfirmation, setShowSOSConfirmation] = useState(false);
  const [showQuickDetails, setShowQuickDetails] = useState(false);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [rescueStatus, setRescueStatus] = useState<'idle' | 'notified' | 'assigned' | 'arriving'>('idle');
  const [rescueMessages, setRescueMessages] = useState<{text: string, time: string}[]>([]);
  const [toasts, setToasts] = useState<{id: string, message: string, type: 'success' | 'info'}[]>([]);
  const [isLiveTracking, setIsLiveTracking] = useState(false);
  const watchIdRef = useRef<number | null>(null);
  const navigate = useNavigate();
  
  // Custom long press logic
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);
  
  const startLongPress = () => {
    isLongPress.current = false;
    longPressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      playVoiceAlert('Silent Emergency Triggered.');
      sendSOS('Silent Emergency Triggered via Long Press', details, true);
      addToast('Silent SOS Activated Directly', 'success');
    }, 1000);
  };
  
  const stopLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };
  
  const handleSilentSOClick = () => {
    if (!isLongPress.current) {
      navigate('/silent-rescue');
    }
  };
  
  // Optional details
  const [details, setDetails] = useState({
    name: '',
    injuryStatus: 'none',
    peopleCount: '1'
  });

  const { 
    isEmergencyMode, 
    toggleEmergencyMode, 
    familyContacts, 
    addFamilyContact, 
    removeFamilyContact,
    familyPhoneNumbers,
    addFamilyPhoneNumber,
    removeFamilyPhoneNumber
  } = useAppStore();
  const [newContact, setNewContact] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const handleInstantSOS = (msg: string) => {
    if (isSOSActive) return;
    playVoiceAlert('SOS Emergency Activated. Rescue teams are being notified.');
    sendSOS(msg);
    setShowQuickDetails(true);
  };

  const { isSupported: shakeSupported, permissionGranted: shakeGranted, requestPermission: requestShake } = useShakeDetection({
    onShake: () => handleInstantSOS('Device Shake Detected!'),
    threshold: 18 
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      }, (err) => {
        console.error("Geolocation error:", err);
      });
    }

    socket.on('rescue_update', (data) => {
      if (data.status) setRescueStatus(data.status);
      if (data.message) {
        setRescueMessages(prev => [...prev, { text: data.message, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        addToast(`New message from rescue team: ${data.message}`, 'info');
      }
    });

    return () => {
      socket.off('rescue_update');
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const addToast = (message: string, type: 'success' | 'info' = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const startLiveTracking = (userId: string) => {
    if (navigator.geolocation) {
      addToast('Live Tracking Enabled', 'info');
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const newLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setLocation(newLoc);
          socket.emit('location_update', {
            userId,
            lat: newLoc.lat,
            lng: newLoc.lng,
            timestamp: new Date().toISOString()
          });
        },
        (err) => console.error("Tracking error:", err),
        { enableHighAccuracy: true, maximumAge: 0 }
      );
    }
  };

  const sendSOS = (extraMessage?: string, additionalDetails?: any, isSilent = false, withFamily = false) => {
    const sosData = {
      userId: 'guest_' + Math.random().toString(36).substr(2, 9),
      userName: additionalDetails?.name || 'Emergency Guest',
      lat: location?.lat || 0,
      lng: location?.lng || 0,
      timestamp: new Date().toISOString(),
      deviceInfo: navigator.userAgent,
      message: extraMessage || (isSilent ? 'Silent SOS triggered' : 'Immediate assistance needed!'),
      details: additionalDetails || details,
      isSilent
    };

    socket.emit('sos_signal', sosData);

    // Dispatch to our new robust Node.js email/sms backend
    fetch('http://localhost:5000/api/sos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: sosData.userName,
        location: { lat: sosData.lat, lng: sosData.lng },
        emergencyType: isSilent ? 'Silent Alert' : 'Critical UI Alert',
        message: sosData.message,
        familyEmails: withFamily ? familyContacts : undefined,
        familyPhoneNumbers: withFamily ? familyPhoneNumbers : undefined
      })
    }).catch(err => console.error('Failed to trace email/sms server route:', err));
    setIsSOSActive(true);
    setRescueStatus('notified');
    addToast(isSilent ? 'Silent Alert Sent' : t('citizen.toasts.sosSent'), 'success');
    
    if (isLiveTracking) {
      startLiveTracking(sosData.userId);
    }

    // Mock rescue team response for demo
    setTimeout(() => {
      setRescueStatus('assigned');
      setRescueMessages(prev => [...prev, { text: t('citizen.stayCalm'), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      if (!isSilent) addToast(t('citizen.toasts.teamAssigned'), 'info');
    }, 3000);
  };

  const handleSOSClick = () => {
    if (!isSOSActive) {
      setShowSOSConfirmation(true);
    }
  };

  const confirmSOS = () => {
    setShowSOSConfirmation(false);
    playVoiceAlert('SOS Emergency Activated. Rescue teams are being notified.');
    sendSOS();
    setShowQuickDetails(true); // Show optional details form after sending
  };

  const handleQuickMessage = (msg: string) => {
    sendSOS(msg);
  };

  const submitQuickDetails = () => {
    sendSOS('Updated details provided', details);
    setShowQuickDetails(false);
    addToast(t('citizen.toasts.infoShared'), 'success');
  };

  const toggleRecording = () => {
    if (isRecording) {
      addToast(t('citizen.toasts.voiceSent'), 'success');
    }
    setIsRecording(!isRecording);
  };

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-500 pb-24 font-sans", 
      isEmergencyMode ? "bg-red-50" : "bg-stone-50"
    )}>
      <main className="max-w-xl mx-auto p-4 space-y-6 mt-4">
        {/* Lite Mode Banner */}
        <button 
          onClick={() => navigate('/lite')}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl p-4 flex items-center justify-between shadow-xl transition-all active:scale-95 mb-2"
        >
          <div className="flex items-center gap-3">
            <UserRound className="w-8 h-8 opacity-80" />
            <div className="text-left">
              <span className="block font-black text-lg tracking-tight uppercase">Enter Lite Mode</span>
              <span className="block text-xs font-bold opacity-75">Elderly & Visually Impaired</span>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 opacity-50" />
        </button>

        {shakeSupported && !shakeGranted && (
          <div className="bg-stone-900 border border-stone-800 p-4 rounded-3xl flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-stone-800 rounded-2xl flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <span className="block text-sm text-white font-black tracking-wide">Shake-to-SOS</span>
                <span className="block text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-0.5">Hardware trigger</span>
              </div>
            </div>
            <button onClick={requestShake} className="bg-white hover:bg-stone-200 text-stone-900 font-black text-[10px] uppercase tracking-widest py-3 px-5 rounded-2xl transition-all">Enable</button>
          </div>
        )}
        {/* Status Panel */}
        <AnimatePresence>
          {rescueStatus !== 'idle' && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-[2.5rem] shadow-xl border-2 border-red-100 overflow-hidden relative"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-stone-400">{t('citizen.rescueStatus')}</h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full animate-ping" />
                  <span className="text-xs font-bold text-red-600 uppercase">{t('citizen.live')}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="flex-1 space-y-2">
                  <div className="text-2xl font-black tracking-tight">
                    {rescueStatus === 'notified' && t('citizen.requestSent')}
                    {rescueStatus === 'assigned' && t('citizen.teamAssigned')}
                    {rescueStatus === 'arriving' && t('citizen.arrivingSoon')}
                  </div>
                  <div className="text-sm text-stone-500 font-medium">
                    {rescueStatus === 'notified' && t('citizen.waitingConfirmation')}
                    {rescueStatus === 'assigned' && t('citizen.unitEnRoute')}
                    {rescueStatus === 'arriving' && t('citizen.eta')}
                  </div>
                </div>
                <div className="w-16 h-16 bg-red-50 rounded-3xl flex items-center justify-center">
                  <Navigation className="w-8 h-8 text-red-600 animate-bounce" />
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6 h-2 bg-stone-100 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-red-600"
                  initial={{ width: '10%' }}
                  animate={{ 
                    width: rescueStatus === 'notified' ? '33%' : rescueStatus === 'assigned' ? '66%' : '95%' 
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main SOS Button */}
        <section className="bg-white p-10 rounded-[3rem] shadow-2xl border border-stone-100 text-center relative overflow-hidden">
          <AnimatePresence>
            {isSOSActive && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-red-600/5 pointer-events-none" 
              />
            )}
          </AnimatePresence>
          
          <button 
            id="main-sos-btn"
            onClick={handleSOSClick}
            disabled={isSOSActive}
            className={cn(
              "relative w-64 h-64 rounded-full mx-auto flex flex-col items-center justify-center transition-all active:scale-90 shadow-[0_20px_60px_-15px_rgba(220,38,38,0.3)]",
              isSOSActive 
                ? "bg-red-700 cursor-not-allowed" 
                : "bg-red-600 hover:bg-red-700"
            )}
          >
            <AlertCircle className="w-24 h-24 text-white mb-2" />
            <span className="text-white font-black text-4xl uppercase tracking-tighter">
              {isSOSActive ? t('citizen.active') : t('citizen.sos')}
            </span>
            
            {!isSOSActive && (
              <div className="absolute inset-0 rounded-full border-8 border-red-600 animate-ping opacity-20" />
            )}
            {isSOSActive && (
              <div className="absolute inset-[-10px] rounded-full border-4 border-red-600/30 animate-pulse" />
            )}
          </button>
          
          <p className="mt-8 text-lg font-bold text-stone-900">
            {isSOSActive ? t('citizen.helpSent') : t('citizen.pressForHelp')}
          </p>
          <p className="text-sm text-stone-400 mt-1">{t('citizen.locationSharedDesc')}</p>
          
          {!isSOSActive && (
            <div className="mt-8 flex flex-col items-center gap-3 w-full">
              <button 
                onPointerDown={startLongPress}
                onPointerUp={stopLongPress}
                onPointerLeave={stopLongPress}
                onClick={handleSilentSOClick}
                className="w-full relative overflow-hidden bg-zinc-950 border-2 border-zinc-800 hover:border-zinc-700 text-white p-5 rounded-[2.5rem] transition-all active:scale-95 group shadow-[0_10px_30px_-15px_rgba(0,0,0,0.5)] flex items-center justify-between"
              >
                <div className="absolute inset-0 bg-stone-800/30 group-hover:bg-stone-700/50 transition-colors" />
                <div className="relative z-10 flex items-center justify-between w-full px-2">
                   <div className="flex flex-col text-left gap-1">
                     <span className="font-black tracking-tight text-xl uppercase text-zinc-100 flex items-center gap-2">
                        Silent Mode <div className="w-2 h-2 rounded-full bg-zinc-500 animate-pulse" />
                     </span>
                     <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest leading-tight">
                        Tap here to open options<br/>Long press to send instantly
                     </span>
                   </div>
                   <div className="w-16 h-16 bg-zinc-800 rounded-3xl flex items-center justify-center group-hover:bg-zinc-700 transition-colors border border-zinc-700/50 shadow-inner">
                     <MicOff className="w-8 h-8 text-zinc-400" />
                   </div>
                </div>
              </button>
            </div>
          )}
        </section>

        {/* Family Safety Beacon */}
        <section className="bg-white p-6 rounded-[2rem] shadow-xl border-2 border-purple-100 flex flex-col gap-4">
           <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-lg tracking-tight text-purple-900 flex items-center gap-2">
                  <Users className="w-5 h-5" /> Family Safety Beacon
                </h3>
                <p className="text-xs font-bold text-stone-500">Alerts {familyContacts.length} trusted contacts + rescue teams instantly.</p>
              </div>
           </div>
           
           <button 
             onClick={() => {
                sendSOS('Family Safety Beacon Triggered', details, false, true);
                addToast('Alert dispatched to family and rescue teams!', 'success');
             }}
             disabled={familyContacts.length === 0}
             className={cn(
               "w-full py-5 rounded-[1.5rem] font-black tracking-widest uppercase transition-all shadow-lg text-white",
               familyContacts.length > 0 ? "bg-purple-600 hover:bg-purple-700 active:scale-95" : "bg-stone-300 cursor-not-allowed"
             )}
           >
             Trigger Family Beacon
           </button>

            <div className="mt-2 space-y-4">
               {/* Emails Section */}
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 block ml-1">Email Alerts</label>
                 {familyContacts.map(email => (
                   <div key={email} className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-100">
                     <span className="text-sm font-bold text-stone-700">{email}</span>
                     <button onClick={() => removeFamilyContact(email)} className="text-red-400 hover:text-red-600">
                       <Trash2 className="w-4 h-4" />
                     </button>
                   </div>
                 ))}
                 <div className="flex gap-2">
                    <input 
                      type="email" 
                      value={newContact} 
                      onChange={(e) => setNewContact(e.target.value)}
                      placeholder="family@example.com"
                      className="w-full text-sm font-bold p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-purple-600/20 focus:outline-none"
                    />
                    <button 
                      onClick={() => {
                         if(newContact.includes('@')) {
                           addFamilyContact(newContact);
                           setNewContact('');
                         }
                      }}
                      className="bg-purple-100 text-purple-700 px-4 rounded-xl font-bold hover:bg-purple-200 transition-all text-xs uppercase"
                    >
                      Add
                    </button>
                 </div>
               </div>

               {/* Phone Numbers Section */}
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 block ml-1">SMS Alerts</label>
                 {familyPhoneNumbers.map(phone => (
                   <div key={phone} className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-100">
                     <span className="text-sm font-bold text-stone-700">{phone}</span>
                     <button onClick={() => removeFamilyPhoneNumber(phone)} className="text-red-400 hover:text-red-600">
                       <Trash2 className="w-4 h-4" />
                     </button>
                   </div>
                 ))}
                 <div className="flex gap-2">
                    <input 
                      type="tel" 
                      value={newPhone} 
                      onChange={(e) => setNewPhone(e.target.value)}
                      placeholder="e.g. +919000000000"
                      className="w-full text-sm font-bold p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-purple-600/20 focus:outline-none"
                    />
                    <button 
                      onClick={() => {
                         if(newPhone.length >= 10) {
                           addFamilyPhoneNumber(newPhone);
                           setNewPhone('');
                         }
                      }}
                      className="bg-purple-100 text-purple-700 px-4 rounded-xl font-bold hover:bg-purple-200 transition-all text-xs uppercase"
                    >
                      Add
                    </button>
                 </div>
               </div>
            </div>
        </section>

        {/* Quick Emergency Options */}
        <section>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-stone-400 mb-4 px-2">{t('citizen.quickSituationUpdate')}</h3>
          <div className="grid grid-cols-1 gap-3">
            {QUICK_MESSAGES.map((msg) => (
              <button 
                key={msg.id}
                onClick={() => handleQuickMessage(t(msg.labelKey))}
                className={cn(
                  "flex items-center gap-4 p-5 rounded-[2rem] border-2 transition-all active:scale-95 text-left",
                  msg.color
                )}
              >
                <div className="p-3 bg-white/50 rounded-2xl shadow-sm">
                  {msg.icon}
                </div>
                <span className="text-lg font-black tracking-tight">{t(msg.labelKey)}</span>
                <ChevronRight className="ml-auto w-6 h-6 opacity-30" />
              </button>
            ))}
          </div>
        </section>

        {/* Voice Message & Map Preview */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={toggleRecording}
            className={cn(
              "flex flex-col items-center justify-center gap-3 p-8 rounded-[2.5rem] border-2 transition-all active:scale-95",
              isRecording ? "bg-red-600 text-white border-red-700 animate-pulse" : "bg-white text-stone-900 border-stone-100 shadow-xl"
            )}
          >
            <div className={cn("w-16 h-16 rounded-full flex items-center justify-center", isRecording ? "bg-white/20" : "bg-red-50")}>
              <Mic className={cn("w-8 h-8", isRecording ? "text-white" : "text-red-600")} />
            </div>
            <span className="font-black text-sm uppercase tracking-widest">
              {isRecording ? t('dashboard.stop') : t('dashboard.voice')}
            </span>
          </button>

          <div className="bg-stone-900 p-2 rounded-[2.5rem] shadow-xl border border-stone-800 overflow-hidden relative h-48">
            <div className="w-full h-full rounded-[2rem] overflow-hidden bg-stone-950">
              {location ? (
                <Map
                  mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
                  initialViewState={{
                    longitude: location.lng,
                    latitude: location.lat,
                    zoom: 14
                  }}
                  mapStyle="mapbox://styles/mapbox/dark-v11"
                  attributionControl={false}
                >
                  <Marker longitude={location.lng} latitude={location.lat}>
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 bg-red-600 rounded-full border-2 border-white shadow-[0_0_15px_rgba(220,38,38,0.5)] flex items-center justify-center animate-bounce">
                        <MapPin className="w-3 h-3 text-white" />
                      </div>
                      <div className="w-2 h-2 bg-red-600/50 rounded-full animate-ping mt-1"></div>
                    </div>
                  </Marker>
                </Map>
              ) : (
                <div className="w-full h-full opacity-60 flex flex-col items-center justify-center text-stone-500 text-sm font-bold gap-2">
                  <Navigation className="w-6 h-6 animate-pulse" />
                  <span>Locating...</span>
                </div>
              )}
            </div>
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md py-2 px-4 rounded-full flex justify-between items-center shadow-lg gap-2 border border-white/20">
              <span className="text-[10px] font-black uppercase tracking-widest text-stone-800">{t('dashboard.locationShared', 'Location Shared')}</span>
              <label className="flex items-center gap-2 cursor-pointer bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-full transition-all">
                <span className="text-[10px] font-bold text-stone-500 uppercase">Live Track</span>
                <input 
                  type="checkbox" 
                  checked={isLiveTracking}
                  onChange={(e) => setIsLiveTracking(e.target.checked)}
                  className="w-3 h-3 accent-red-600 cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Rescue Team Messages */}
        <AnimatePresence>
          {rescueMessages.length > 0 && (
            <section className="bg-stone-900 text-white p-8 rounded-[3rem] shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="w-6 h-6 text-red-500" />
                <h3 className="text-sm font-black uppercase tracking-widest">{t('dashboard.rescueChat')}</h3>
              </div>
              <div className="space-y-4">
                {rescueMessages.map((msg, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white/10 p-4 rounded-2xl rounded-tl-none border-l-4 border-red-600"
                  >
                    <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                    <div className="text-[10px] font-bold text-white/40 mt-2 uppercase tracking-widest">{msg.time}</div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}
        </AnimatePresence>

        {/* Emergency Contacts */}
        <section>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-stone-400 mb-4 px-2">{t('dashboard.helplines')}</h3>
          <div className="grid grid-cols-1 gap-3">
            {EMERGENCY_CONTACTS.map((contact, i) => (
              <a 
                key={i}
                href={`tel:${contact.number}`}
                className="flex items-center justify-between p-6 rounded-[2rem] bg-white border border-stone-100 shadow-sm hover:bg-stone-50 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center text-stone-900">
                    {contact.icon}
                  </div>
                  <div>
                    <div className="font-black text-lg tracking-tight">{t(contact.nameKey)}</div>
                    <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{t('dashboard.officialHelpline')}</div>
                  </div>
                </div>
                <div className="text-2xl font-black text-red-600 tracking-tighter">{contact.number}</div>
              </a>
            ))}
          </div>
        </section>
      </main>

      {/* SOS Confirmation Modal */}
      <AnimatePresence>
        {showSOSConfirmation && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-stone-900/80 backdrop-blur-xl z-50 flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-[3.5rem] p-10 shadow-2xl text-center"
            >
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <AlertCircle className="w-12 h-12 text-red-600" />
              </div>
              <h2 className="text-3xl font-black tracking-tight mb-4">{t('dashboard.sosConfirmTitle')}</h2>
              <p className="text-stone-500 mb-10 leading-relaxed">{t('dashboard.sosConfirmDesc')}</p>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={confirmSOS}
                  className="w-full py-5 bg-red-600 text-white rounded-[2rem] font-black text-lg shadow-xl shadow-red-200 active:scale-95 transition-all"
                >
                  {t('dashboard.sendSignal')}
                </button>
                <button 
                  onClick={() => setShowSOSConfirmation(false)}
                  className="w-full py-5 bg-stone-100 text-stone-600 rounded-[2rem] font-black text-lg active:scale-95 transition-all"
                >
                  {t('common.cancel')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Details Modal (Optional) */}
      <AnimatePresence>
        {showQuickDetails && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-stone-900/80 backdrop-blur-xl z-50 flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-[3.5rem] p-8 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-red-50 p-2 rounded-xl">
                  <Info className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-xl font-black tracking-tight">{t('dashboard.quickInfoTitle')}</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-2 block">{t('dashboard.yourName')}</label>
                  <input 
                    type="text" 
                    placeholder={t('dashboard.namePlaceholder')}
                    className="w-full p-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-600/20 font-bold"
                    value={details.name}
                    onChange={(e) => setDetails({...details, name: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-2 block">{t('dashboard.injuryStatus')}</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['none', 'minor', 'serious', 'critical'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setDetails({...details, injuryStatus: status})}
                        className={cn(
                          "py-3 rounded-xl text-xs font-black uppercase tracking-widest border-2 transition-all",
                          details.injuryStatus === status 
                            ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-100" 
                            : "bg-stone-50 border-stone-100 text-stone-400 hover:border-stone-200"
                        )}
                      >
                        {t(`priority.${status}`)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-2 block">{t('dashboard.peopleWithYou')}</label>
                  <div className="flex gap-2">
                    {['1', '2', '3', '4', '5+'].map((count) => (
                      <button
                        key={count}
                        onClick={() => setDetails({...details, peopleCount: count})}
                        className={cn(
                          "flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest border-2 transition-all",
                          details.peopleCount === count 
                            ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-100" 
                            : "bg-stone-50 border-stone-100 text-stone-400 hover:border-stone-200"
                        )}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-4">
                  <button 
                    onClick={submitQuickDetails}
                    className="w-full py-5 bg-stone-900 text-white rounded-[2rem] font-black text-lg shadow-xl shadow-stone-200 active:scale-95 transition-all"
                  >
                    {t('dashboard.shareInfo')}
                  </button>
                  <button 
                    onClick={() => setShowQuickDetails(false)}
                    className="w-full py-4 text-stone-400 font-bold text-sm hover:text-stone-600 transition-all"
                  >
                    {t('dashboard.skipForNow')}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notifications */}
      <div className="fixed top-24 left-4 right-4 z-50 pointer-events-none flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div 
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={cn(
                "p-4 rounded-2xl shadow-2xl flex items-center gap-3 pointer-events-auto border",
                toast.type === 'success' ? "bg-green-600 text-white border-green-500" : "bg-blue-600 text-white border-blue-500"
              )}
            >
              {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <Info className="w-5 h-5" />}
              <span className="text-sm font-bold">{toast.message}</span>
              <button 
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                className="ml-auto p-1 hover:bg-white/20 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
