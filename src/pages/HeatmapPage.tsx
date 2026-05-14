import React, { useState } from 'react';
import { 
  Layers, 
  Filter, 
  Search, 
  Maximize2, 
  Activity, 
  AlertCircle,
  ChevronRight,
  Shield,
  Wind,
  Droplets,
  Flame
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/LanguageSelector';
import { cn } from '../utils/cn';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export default function HeatmapPage() {
  const { t } = useTranslation();
  const [activeLayer, setActiveLayer] = useState<'flood' | 'fire' | 'storm'>('flood');
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <div className="h-screen bg-stone-950 flex overflow-hidden font-sans">
      {/* Sidebar Controls */}
      <AnimatePresence>
        {showSidebar && (
          <motion.aside 
            initial={{ x: -400 }}
            animate={{ x: 0 }}
            exit={{ x: -400 }}
            className="w-96 bg-stone-900 border-r border-stone-800 flex flex-col z-40"
          >
            <div className="p-8 border-b border-stone-800">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-900/20">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-xl font-black text-white tracking-tight">{t('heatmap.title')}</h1>
                </div>
                <LanguageSelector />
              </div>
              
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                <input 
                  type="text" 
                  placeholder={t('heatmap.searchPlaceholder')}
                  className="w-full bg-stone-800 border border-stone-700 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600/20 transition-all"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-10">
              {/* Layer Selection */}
              <section>
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 mb-6">{t('heatmap.activeVisualization')}</h2>
                <div className="space-y-3">
                  {[
                    { id: 'flood', name: t('heatmap.floodRisk'), icon: <Droplets className="w-4 h-4" />, color: 'text-blue-500', bg: 'bg-blue-500' },
                    { id: 'fire', name: t('heatmap.wildfire'), icon: <Flame className="w-4 h-4" />, color: 'text-orange-500', bg: 'bg-orange-500' },
                    { id: 'storm', name: t('heatmap.stormPath'), icon: <Wind className="w-4 h-4" />, color: 'text-purple-500', bg: 'bg-purple-500' },
                  ].map((layer) => (
                    <button 
                      key={layer.id}
                      onClick={() => setActiveLayer(layer.id as any)}
                      className={cn(
                        "w-full p-5 rounded-[1.5rem] border transition-all flex items-center justify-between group",
                        activeLayer === layer.id 
                          ? "bg-stone-800 border-stone-700 shadow-xl" 
                          : "bg-transparent border-transparent hover:bg-stone-800/50"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", activeLayer === layer.id ? layer.bg + " text-white" : "bg-stone-800 text-stone-500")}>
                          {layer.icon}
                        </div>
                        <span className={cn("font-bold text-sm", activeLayer === layer.id ? "text-white" : "text-stone-500")}>{layer.name}</span>
                      </div>
                      <ChevronRight className={cn("w-4 h-4 transition-transform", activeLayer === layer.id ? "text-white translate-x-1" : "text-stone-700")} />
                    </button>
                  ))}
                </div>
              </section>

              {/* Legend */}
              <section>
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 mb-6">{t('heatmap.intensityLegend')}</h2>
                <div className="space-y-4">
                  <div className="h-3 w-full bg-gradient-to-r from-stone-800 via-yellow-500 to-red-600 rounded-full" />
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-stone-600">
                    <span>{t('heatmap.lowRisk')}</span>
                    <span>{t('heatmap.moderate')}</span>
                    <span>{t('heatmap.critical')}</span>
                  </div>
                </div>
              </section>

              {/* Real-time Stats */}
              <section className="bg-red-950/20 border border-red-900/30 p-6 rounded-[2rem]">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-red-500">{t('heatmap.liveAlerts')}</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-1 h-10 bg-red-600 rounded-full shrink-0" />
                    <div>
                      <div className="text-sm font-bold text-white">{t('heatmap.severeFloodWarning')}</div>
                      <div className="text-[10px] text-stone-500 font-bold uppercase tracking-widest">{t('heatmap.coastalRegion')} • 2m ago</div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-1 h-10 bg-orange-600 rounded-full shrink-0" />
                    <div>
                      <div className="text-sm font-bold text-white">{t('heatmap.evacuationOrdered')}</div>
                      <div className="text-[10px] text-stone-500 font-bold uppercase tracking-widest">{t('heatmap.sector9')} • 15m ago</div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className="p-8 border-t border-stone-800">
              <Button variant="secondary" className="w-full bg-stone-800 border-stone-700 text-white hover:bg-stone-700">
                {t('heatmap.exportReport')}
              </Button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Map View */}
      <main className="flex-1 relative">
        {/* Map Placeholder with Heatmap Effect */}
        <div className="absolute inset-0 bg-stone-950">
          <div className="w-full h-full bg-stone-900 opacity-20" />
          
          {/* SVG Heatmap Overlays */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <radialGradient id="heat-grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={activeLayer === 'flood' ? '#3b82f6' : activeLayer === 'fire' ? '#ef4444' : '#a855f7'} stopOpacity="0.6" />
                <stop offset="100%" stopColor={activeLayer === 'flood' ? '#3b82f6' : activeLayer === 'fire' ? '#ef4444' : '#a855f7'} stopOpacity="0" />
              </radialGradient>
            </defs>
            
            {/* Mock Heat Spots */}
            <motion.circle 
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
              cx="40%" cy="30%" r="150" fill="url(#heat-grad)" 
            />
            <motion.circle 
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
              cx="65%" cy="55%" r="200" fill="url(#heat-grad)" 
            />
            <motion.circle 
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              cx="25%" cy="70%" r="120" fill="url(#heat-grad)" 
            />
          </svg>

          {/* Grid Overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" 
            style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
          />
        </div>

        {/* Map Controls */}
        <div className="absolute top-8 right-8 flex flex-col gap-4">
          <button 
            onClick={() => setShowSidebar(!showSidebar)}
            className="w-14 h-14 bg-stone-900/80 backdrop-blur-md border border-white/10 rounded-2xl flex items-center justify-center text-white shadow-2xl hover:bg-stone-800 transition-all"
          >
            <Layers className="w-6 h-6" />
          </button>
          <div className="flex flex-col bg-stone-900/80 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <button className="p-4 text-white hover:bg-white/10 transition-colors border-b border-white/5"><Maximize2 className="w-5 h-5" /></button>
            <button className="p-4 text-white hover:bg-white/10 transition-colors border-b border-white/5"><Filter className="w-5 h-5" /></button>
            <button className="p-4 text-white hover:bg-white/10 transition-colors"><Shield className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-8">
          <div className="bg-stone-900/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-2xl flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">{t('heatmap.satelliteLinkActive')}</span>
              </div>
              <div className="w-px h-8 bg-stone-800" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-stone-500">{t('heatmap.currentView')}</span>
                <span className="text-sm font-bold text-white">{t('heatmap.metropolitanArea')} • {t('heatmap.sector7G')}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-[10px] font-black uppercase tracking-widest text-stone-500">{t('heatmap.threatLevel')}</div>
                <div className="text-sm font-black text-red-500 uppercase">{t('heatmap.extreme')}</div>
              </div>
              <div className="w-12 h-12 bg-red-600/20 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-red-500 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
