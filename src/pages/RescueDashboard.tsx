import React, { useState, useEffect } from 'react';
import { 
  Navigation, 
  Map as MapIcon, 
  List, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  User,
  MapPin,
  Phone,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/LanguageSelector';
import socket from '../services/socket';
import { cn } from '../utils/cn';
import { Incident, SOSSignal } from '../types';
import { MissionTracker } from '../components/dashboard/MissionTracker';
import { useAppStore } from '../store/useAppStore';

export default function RescueDashboard() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'map' | 'list' | 'mission'>('list');
  const { sosRequests, isEmergencyMode, toggleEmergencyMode } = useAppStore();
  const [incidents, setIncidents] = useState<Incident[]>([
    { id: 1, type: 'flood', lat: 23.8103, lng: 90.4125, severity: 'high', status: 'pending', reporter: 'Citizen A', description: 'Water level rising rapidly in Sector 4.' },
    { id: 2, type: 'earthquake', lat: 23.7949, lng: 90.4043, severity: 'critical', status: 'active', reporter: 'Citizen B', description: 'Building collapse near main road.' },
  ]);

  return (
    <div className={cn("min-h-screen flex flex-col transition-colors duration-500", isEmergencyMode ? "bg-red-50" : "bg-stone-50")}>
      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <div className="flex-1 p-6 md:p-10">
          <AnimatePresence mode="wait">
            {activeTab === 'list' && (
              <motion.div 
                key="list"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-6xl mx-auto space-y-10"
              >
                {/* SOS Alerts Section */}
                {sosRequests.length > 0 && (
                  <section>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-3 h-3 bg-red-600 rounded-full animate-ping" />
                      <h2 className="text-sm font-black uppercase tracking-[0.2em] text-red-600">{t('dashboard.prioritySOS')}</h2>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {sosRequests.map((sos, i) => (
                        <motion.div 
                          key={i}
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="bg-white border-2 border-red-100 p-8 rounded-[2.5rem] shadow-xl relative group hover:border-red-600 transition-all"
                        >
                          <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-red-200">
                              {sos.userName.charAt(0)}
                            </div>
                            <div>
                              <div className="font-black text-lg text-stone-900">{sos.userName}</div>
                              <div className="text-[10px] font-bold text-red-600 uppercase tracking-widest">{t('dashboard.immediateRescue')}</div>
                            </div>
                          </div>
                          <div className="space-y-3 mb-8">
                            <div className="flex items-center gap-3 text-xs text-stone-500 font-bold uppercase tracking-widest">
                              <MapPin className="w-4 h-4 text-red-600" /> {sos.lat.toFixed(4)}, {sos.lng.toFixed(4)}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-stone-500 font-bold uppercase tracking-widest">
                              <Clock className="w-4 h-4 text-red-600" /> {t('dashboard.justNow')}
                            </div>
                          </div>
                          <button 
                            onClick={() => setActiveTab('mission')}
                            className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-red-700 transition-all shadow-xl shadow-red-100"
                          >
                            {t('dashboard.acceptMission')} <ArrowRight className="w-5 h-5" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </section>
                )}

                {/* General Incidents */}
                <section>
                  <h2 className="text-sm font-black uppercase tracking-[0.2em] text-stone-400 mb-6">{t('dashboard.activeIncidents')}</h2>
                  <div className="grid gap-6">
                    {incidents.map((incident) => (
                      <div key={incident.id} className="bg-white border border-stone-200 p-8 rounded-[2.5rem] shadow-sm flex flex-col lg:flex-row lg:items-center gap-8 hover:shadow-md transition-all">
                        <div className={cn(
                          "w-20 h-20 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-inner",
                          incident.severity === 'critical' ? "bg-red-50 text-red-600" : "bg-yellow-50 text-yellow-600"
                        )}>
                          <AlertTriangle className="w-10 h-10" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-stone-400">{incident.type}</span>
                            <span className={cn(
                              "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                              incident.severity === 'critical' ? "bg-red-600 text-white" : "bg-yellow-500 text-white"
                            )}>
                              {t(`priority.${incident.severity}`)}
                            </span>
                          </div>
                          <h3 className="text-2xl font-bold mb-3 tracking-tight">{incident.description}</h3>
                          <div className="flex flex-wrap gap-6 text-xs text-stone-400 font-bold uppercase tracking-widest">
                            <span className="flex items-center gap-2"><User className="w-4 h-4" /> {incident.reporter}</span>
                            <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {incident.lat}, {incident.lng}</span>
                            <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> 12m ago</span>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button className="px-8 py-4 bg-stone-900 text-white rounded-2xl font-black text-sm hover:bg-stone-800 transition-all shadow-xl shadow-stone-200">
                            {t('dashboard.assignUnit')}
                          </button>
                          <button className="p-4 bg-stone-50 text-stone-600 rounded-2xl hover:bg-stone-100 transition-all border border-stone-100">
                            <Phone className="w-6 h-6" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </motion.div>
            )}

            {activeTab === 'mission' && (
              <motion.div 
                key="mission"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-4xl mx-auto"
              >
                <MissionTracker />
              </motion.div>
            )}

            {activeTab === 'map' && (
              <motion.div 
                key="map"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full bg-stone-900 rounded-[3rem] overflow-hidden relative border border-stone-800 shadow-inner"
              >
                 <div className="w-full h-full bg-stone-950 opacity-60" />
                <div className="absolute inset-0 p-10 pointer-events-none">
                  <div className="bg-white/90 backdrop-blur-md p-8 rounded-[2.5rem] shadow-2xl border border-white/20 w-80 pointer-events-auto">
                    <h3 className="font-black text-lg mb-6 tracking-tight">{t('dashboard.tacticalView')}</h3>
                    <div className="space-y-4">
                      {[
                        { key: 'sosSignals', label: t('dashboard.filters.sosSignals') },
                        { key: 'rescueUnits', label: t('dashboard.filters.rescueUnits') },
                        { key: 'safeZones', label: t('dashboard.filters.safeZones') },
                        { key: 'hazardAreas', label: t('dashboard.filters.hazardAreas') }
                      ].map((filter, i) => (
                        <label key={i} className="flex items-center gap-4 cursor-pointer group">
                          <div className="relative flex items-center">
                            <input type="checkbox" defaultChecked className="peer appearance-none w-6 h-6 rounded-lg border-2 border-stone-200 checked:bg-red-600 checked:border-red-600 transition-all" />
                            <CheckCircle2 className="absolute w-4 h-4 text-white left-1 opacity-0 peer-checked:opacity-100 transition-opacity" />
                          </div>
                          <span className="text-sm font-bold text-stone-600 group-hover:text-stone-900 transition-colors uppercase tracking-widest">{filter.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Mock Markers */}
                <div className="absolute top-1/2 left-1/3 w-6 h-6 bg-red-600 rounded-full animate-ping" />
                <div className="absolute top-1/4 right-1/4 w-6 h-6 bg-red-600 rounded-full animate-ping" />
                <div className="absolute bottom-1/3 left-1/2 w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl border-2 border-white">
                  <Navigation className="w-6 h-6 text-white" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Communication Panel (Floating) */}
      <div className="fixed bottom-10 right-10 z-50">
        <button className="w-20 h-20 bg-stone-900 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-center hover:scale-110 transition-all active:scale-95 group">
          <MessageSquare className="w-8 h-8 group-hover:rotate-12 transition-transform" />
          <div className="absolute -top-2 -right-2 w-7 h-7 bg-red-600 rounded-full border-4 border-white text-xs font-black flex items-center justify-center shadow-lg">3</div>
        </button>
      </div>
    </div>
  );
}
