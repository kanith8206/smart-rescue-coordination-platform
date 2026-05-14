import React, { useState } from 'react';
import { Phone, Trash2, Plus, ShieldCheck, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../utils/cn';

export function EmergencyContacts() {
  const { emergencyPhones, addEmergencyPhone, removeEmergencyPhone } = useAppStore();
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [testSent, setTestSent] = useState<string | null>(null);

  const validate = (val: string) => {
    if (!val.startsWith('+')) return 'Number must start with + (e.g. +919876543210)';
    if (val.length < 8 || val.length > 16) return 'Enter a valid international phone number';
    if (!/^\+\d+$/.test(val)) return 'Only digits allowed after +';
    return '';
  };

  const handleAdd = () => {
    const trimmed = input.trim();
    const err = validate(trimmed);
    if (err) { setError(err); return; }
    if (emergencyPhones.includes(trimmed)) { setError('This number is already saved.'); return; }
    addEmergencyPhone(trimmed);
    setInput('');
    setError('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
  };

  const handleTestSMS = async (phone: string) => {
    setTestSent(phone);
    try {
      await fetch('http://localhost:5000/api/sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test User',
          location: { lat: 0, lng: 0 },
          emergencyType: 'TEST — SMS Verification',
          message: 'This is a test alert from Smart Rescue Platform.',
          emergencyPhones: [phone]
        })
      });
    } catch {
      // silently ignore
    }
    setTimeout(() => setTestSent(null), 3000);
  };

  return (
    <section className="bg-white rounded-[2rem] shadow-xl border-2 border-emerald-100 p-6 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
          <Phone className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h3 className="font-black text-lg tracking-tight text-stone-900">SMS Emergency Contacts</h3>
          <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">
            {emergencyPhones.length} number{emergencyPhones.length !== 1 ? 's' : ''} saved · Auto-SMS on SOS
          </p>
        </div>
      </div>

      {/* Saved Contacts */}
      <div className="space-y-2">
        <AnimatePresence>
          {emergencyPhones.map((phone) => (
            <motion.div
              key={phone}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-2 p-3 bg-stone-50 rounded-2xl border border-stone-100"
            >
              <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="flex-1 font-bold text-stone-800 text-sm tracking-wide">{phone}</span>
              <button
                onClick={() => handleTestSMS(phone)}
                className={cn(
                  "flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  testSent === phone
                    ? "bg-emerald-600 text-white"
                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                )}
              >
                <Send className="w-3 h-3" />
                {testSent === phone ? 'Sent!' : 'Test'}
              </button>
              <button
                onClick={() => removeEmergencyPhone(phone)}
                className="w-9 h-9 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {emergencyPhones.length === 0 && (
          <p className="text-center text-xs text-stone-400 font-bold py-4 uppercase tracking-widest">
            No numbers saved yet
          </p>
        )}
      </div>

      {/* Input Row */}
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            type="tel"
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(''); }}
            onKeyDown={handleKeyDown}
            placeholder="+91 98765 43210"
            className={cn(
              "flex-1 font-bold text-sm p-4 bg-stone-50 rounded-2xl border-2 focus:outline-none focus:ring-2 transition-all",
              error
                ? "border-red-300 focus:ring-red-200"
                : "border-stone-200 focus:ring-emerald-500/20 focus:border-emerald-400"
            )}
          />
          <button
            onClick={handleAdd}
            className="w-14 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl flex items-center justify-center transition-all active:scale-90 shadow-lg shadow-emerald-200 flex-shrink-0"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
        {error && (
          <p className="text-xs text-red-500 font-bold px-1">{error}</p>
        )}
        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest px-1">
          Use international format (e.g. +919876543210 · +14155551234)
        </p>
      </div>
    </section>
  );
}
