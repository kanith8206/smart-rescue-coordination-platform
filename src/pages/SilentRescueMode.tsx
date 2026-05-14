import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AlertTriangle, 
  Flame, 
  Droplets, 
  HeartPulse, 
  PersonStanding, 
  Baby, 
  MicOff, 
  Activity, 
  CheckCircle2, 
  WifiOff, 
  BatteryWarning,
  Wifi,
  BatteryFull,
  Settings
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import socket from '../services/socket';
import { offlineQueueService } from '../services/OfflineQueueService';
import { cn } from '../utils/cn';

const SILENT_OPTIONS = [
  { id: 'trapped', icon: <AlertTriangle className="w-12 h-12" />, labelKey: 'citizen.quickMessages.trapped', defaultLabel: 'I am trapped', color: 'bg-orange-500' },
  { id: 'injured', icon: <Activity className="w-12 h-12" />, labelKey: 'citizen.quickMessages.injured', defaultLabel: 'I am injured', color: 'bg-red-500' },
  { id: 'cannot_speak', icon: <MicOff className="w-12 h-12" />, labelKey: 'silentMode.cannotSpeak', defaultLabel: 'I cannot speak', color: 'bg-stone-600' },
  { id: 'fire', icon: <Flame className="w-12 h-12" />, labelKey: 'citizen.quickMessages.fire', defaultLabel: 'Fire nearby', color: 'bg-amber-500' },
  { id: 'flood', icon: <Droplets className="w-12 h-12" />, labelKey: 'citizen.quickMessages.flood', defaultLabel: 'Flood rising', color: 'bg-cyan-500' },
  { id: 'medical', icon: <HeartPulse className="w-12 h-12" />, labelKey: 'citizen.quickMessages.medical', defaultLabel: 'Need medical help', color: 'bg-rose-500' },
  { id: 'elderly', icon: <PersonStanding className="w-12 h-12" />, labelKey: 'silentMode.elderly', defaultLabel: 'Elderly needs help', color: 'bg-purple-500' },
  { id: 'child', icon: <Baby className="w-12 h-12" />, labelKey: 'silentMode.child', defaultLabel: 'Child needs help', color: 'bg-pink-500' },
];

export default function SilentRescueMode() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isLowBattery, setIsLowBattery] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'queued'>('idle');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    // Keep track of online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Get battery info if supported
    // @ts-ignore - Battery API is not standard in all TS definitions
    if (navigator.getBattery) {
      // @ts-ignore
      navigator.getBattery().then(battery => {
        const updateBatteryInfo = () => {
          const level = Math.round(battery.level * 100);
          setBatteryLevel(level);
          setIsLowBattery(level <= 20 && !battery.charging);
        };
        updateBatteryInfo();
        battery.addEventListener('levelchange', updateBatteryInfo);
        battery.addEventListener('chargingchange', updateBatteryInfo);
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const triggerSOS = (optionId: string, label: string) => {
    if (status === 'sending' || status === 'sent' || status === 'queued') return;
    
    setSelectedOption(optionId);
    setStatus('sending');

    // Gather auto data
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => finalizeSOS(label, pos.coords.latitude, pos.coords.longitude),
        () => finalizeSOS(label, 0, 0), // fallback if denied
        { enableHighAccuracy: false, timeout: 5000, maximumAge: 0 }
      );
    } else {
      finalizeSOS(label, 0, 0);
    }
  };

  const finalizeSOS = (message: string, lat: number, lng: number) => {
    const payload = {
      userId: 'silent_' + Math.random().toString(36).substr(2, 9),
      userName: 'Silent Emergency User',
      lat,
      lng,
      timestamp: new Date().toISOString(),
      deviceInfo: navigator.userAgent,
      message: `[SILENT MODE] ${message}`,
      isSilent: true,
      batteryLevel: batteryLevel,
      networkStatus: isOnline ? 'online' : 'offline',
      status: 'Silent Rescue Request'
    };

    if (isOnline) {
      // Emit via socket immediately
      socket.emit('sos_signal', payload);
      
      // Also hit the backend API (if needed)
      fetch('http://localhost:5000/api/sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
           name: payload.userName,
           location: { lat, lng },
           emergencyType: 'Silent Alert',
           message: payload.message
        })
      }).catch(console.error);

      setStatus('sent');
    } else {
      // Offline fallback
      offlineQueueService.enqueue('http://localhost:5000/api/sos', 'POST', {
         name: payload.userName,
         location: { lat, lng },
         emergencyType: 'Silent Alert (Queued)',
         message: payload.message
      });
      setStatus('queued');
    }
    
    // Auto reset after 10s for another potential request
    setTimeout(() => {
      setStatus('idle');
      setSelectedOption(null);
    }, 10000);
  };

  return (
    <div className={cn(
      "min-h-screen fixed inset-0 z-[100] flex flex-col transition-colors duration-300",
      isLowBattery ? "bg-black text-white" : "bg-zinc-950 text-white"
    )}>
      {/* Top Bar - Minimal */}
      <div className="flex justify-between items-center p-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 bg-zinc-800 rounded-full hover:bg-zinc-700 active:scale-90 transition-all text-sm font-bold opacity-80"
        >
          {t('common.cancel', 'Close')}
        </button>
        <div className="flex items-center gap-4 opacity-70">
          <div className="flex items-center gap-1.5">
            {isOnline ? <Wifi className="w-5 h-5 text-green-500" /> : <WifiOff className="w-5 h-5 text-red-500" />}
            <span className="text-xs font-bold uppercase tracking-widest">{isOnline ? 'Online' : 'Offline'}</span>
          </div>
          {batteryLevel !== null && (
            <div className="flex items-center gap-1.5">
              {isLowBattery ? <BatteryWarning className="w-5 h-5 text-red-500 animate-pulse" /> : <BatteryFull className="w-5 h-5 text-green-500" />}
              <span className={cn("text-xs font-bold", isLowBattery && "text-red-500")}>{batteryLevel}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-center px-4 pb-6 overflow-y-auto w-full max-w-lg mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black tracking-tight mb-2">SILENT RESCUE</h1>
          <p className="text-zinc-400 font-medium text-sm">
            {isLowBattery 
              ? "Low battery mode active. Tap an option." 
              : "Tap one block to instantly secretly send your status & location."}
          </p>
        </div>

        <AnimatePresence mode="popLayout">
          {status !== 'idle' ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex-1 flex flex-col items-center justify-center p-8 bg-zinc-900 rounded-[3rem] border-2 border-zinc-800"
            >
              {status === 'sending' && (
                <>
                  <div className="w-24 h-24 border-8 border-zinc-800 border-t-white rounded-full animate-spin mb-6" />
                  <h2 className="text-2xl font-black">Sending...</h2>
                  <p className="text-zinc-400 mt-2 text-center">Gleaning GPS & Status secretly</p>
                </>
              )}
              {status === 'sent' && (
                <>
                  <div className="w-28 h-28 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-16 h-16 text-green-500" />
                  </div>
                  <h2 className="text-3xl font-black text-green-500 mb-2">Delivered</h2>
                  <p className="text-zinc-400 text-center font-medium">Rescue teams notified. Help is on the way.</p>
                </>
              )}
              {status === 'queued' && (
                <>
                  <div className="w-28 h-28 bg-orange-500/20 rounded-full flex items-center justify-center mb-6">
                    <WifiOff className="w-16 h-16 text-orange-500" />
                  </div>
                  <h2 className="text-3xl font-black text-orange-500 mb-2">Stored Offline</h2>
                  <p className="text-zinc-400 text-center font-medium">No connection. Will send automatically when online.</p>
                </>
              )}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={cn(
                "grid gap-3",
                isLowBattery ? "grid-cols-1" : "grid-cols-2" // Bigger blocks if low battery
              )}
            >
              {SILENT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => triggerSOS(opt.id, t(opt.labelKey, opt.defaultLabel))}
                  className={cn(
                    "relative overflow-hidden p-6 rounded-[2rem] flex flex-col items-center justify-center gap-4 transition-all active:scale-95 group",
                    opt.color,
                    isLowBattery && "py-8" // Even taller on low battery
                  )}
                >
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <span className="relative z-10 drop-shadow-lg text-white">
                    {opt.icon}
                  </span>
                  <span className="relative z-10 text-xl font-black drop-shadow-md text-white mt-1 leading-tight text-center">
                    {t(opt.labelKey, opt.defaultLabel)}
                  </span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
