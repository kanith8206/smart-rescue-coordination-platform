import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, PlusCircle, PhoneCall, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../store/useAppStore';
import socket from '../services/socket';

export default function RescueLiteMode() {
  const navigate = useNavigate();
  const { familyContacts } = useAppStore();
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const triggerSOS = (emergencyType: string, withFamily: boolean = false) => {
    if (status !== 'idle') return;
    setStatus('sending');

    const doSend = (lat: number, lng: number) => {
      const payload = {
        userId: 'lite_' + Math.random().toString(36).substr(2, 9),
        userName: 'Elderly User (Lite)',
        lat,
        lng,
        timestamp: new Date().toISOString(),
        deviceInfo: navigator.userAgent,
        message: `[LITE MODE] ${emergencyType}`,
        status: 'Lite Rescue Request'
      };

      socket.emit('sos_signal', payload);

      fetch('http://localhost:5000/api/sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
           name: payload.userName,
           location: { lat, lng },
           emergencyType: emergencyType,
           message: 'Assistance requested via Lite Mode.',
           familyEmails: withFamily ? familyContacts : undefined
        })
      }).catch(console.error);

      setStatus('sent');
      setTimeout(() => setStatus('idle'), 5000);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => doSend(pos.coords.latitude, pos.coords.longitude),
        () => doSend(0, 0),
        { enableHighAccuracy: false, timeout: 5000 }
      );
    } else {
      doSend(0, 0);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-white flex flex-col font-sans overflow-hidden">
      <AnimatePresence mode="popLayout">
        {status === 'sending' && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center p-8 text-center"
          >
            <div className="w-32 h-32 border-8 border-stone-200 border-t-red-600 rounded-full animate-spin mb-8" />
            <h1 className="text-4xl font-black">SENDING...</h1>
            <p className="text-2xl mt-4 text-stone-500 font-bold">Please wait.</p>
          </motion.div>
        )}
        {status === 'sent' && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-green-600 z-50 flex flex-col items-center justify-center p-8 text-center text-white"
          >
            <CheckCircle2 className="w-40 h-40 mb-8" />
            <h1 className="text-5xl font-black uppercase">Help is<br/>on the way!</h1>
            <p className="text-2xl mt-6 font-bold opacity-90">Rescue teams have been alerted.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 grid grid-rows-3 gap-4 p-4">
        <button 
          onClick={() => triggerSOS('MEDICAL EMERGENCY', true)}
          className="bg-red-600 text-white rounded-[3rem] w-full flex flex-col items-center justify-center active:scale-95 transition-transform"
        >
          <AlertCircle className="w-20 h-20 mb-4 drop-shadow-lg" />
          <span className="text-4xl md:text-5xl font-black tracking-tight drop-shadow-md text-center">
            MEDICAL<br/>EMERGENCY
          </span>
        </button>

        <button 
          onClick={() => triggerSOS('NEED EVACUATION', true)}
          className="bg-orange-500 text-white rounded-[3rem] w-full flex flex-col items-center justify-center active:scale-95 transition-transform"
        >
          <PlusCircle className="w-20 h-20 mb-4 drop-shadow-lg" />
          <span className="text-4xl md:text-5xl font-black tracking-tight drop-shadow-md text-center">
            NEED<br/>EVACUATION
          </span>
        </button>

        <button 
          onClick={() => triggerSOS('CALL HELPLINE')}
          className="bg-blue-600 text-white rounded-[3rem] w-full flex flex-col items-center justify-center active:scale-95 transition-transform"
        >
          <PhoneCall className="w-20 h-20 mb-4 drop-shadow-lg" />
          <span className="text-4xl md:text-5xl font-black tracking-tight drop-shadow-md text-center">
            CALL<br/>HELPLINE
          </span>
        </button>
      </div>

      <div className="p-4 pb-8">
        <button 
          onClick={() => navigate('/citizen')}
          className="w-full py-8 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-[2rem] text-2xl font-black uppercase tracking-widest active:scale-95 transition-transform"
        >
          EXIT LITE MODE
        </button>
      </div>
    </div>
  );
}
