import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  AlertCircle, 
  Package, 
  Settings, 
  TrendingUp, 
  Activity, 
  Map as MapIcon,
  Search,
  Bell,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  ShieldAlert
} from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/LanguageSelector';
import { cn } from '../utils/cn';
import { AdminOverview } from '../components/dashboard/AdminOverview';
import { useAppStore } from '../store/useAppStore';
import socket from '../services/socket';
import Map, { Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect } from 'react';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const { isEmergencyMode, toggleEmergencyMode } = useAppStore();
  const [activeIncidents, setActiveIncidents] = useState<any[]>([]);

  useEffect(() => {
    socket.on('sos_alert', (data) => {
      setActiveIncidents((prev) => {
        const existing = prev.find(i => i.userId === data.userId);
        if (existing) {
           return prev.map(i => i.userId === data.userId ? { ...i, ...data } : i);
        }
        return [...prev, data];
      });
    });

    socket.on('location_update', (data) => {
      setActiveIncidents((prev) => prev.map(i => 
        i.userId === data.userId 
          ? { ...i, lat: data.lat, lng: data.lng, lastUpdated: data.timestamp } 
          : i
      ));
    });

    return () => {
      socket.off('sos_alert');
      socket.off('location_update');
    };
  }, []);

  return (
    <div className={cn("min-h-screen flex flex-col transition-colors duration-500", isEmergencyMode ? "bg-red-50" : "bg-stone-50")}>
      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Dashboard Content */}
        <div className="flex-1 p-8 space-y-8 max-w-7xl mx-auto w-full">
          {activeTab === 'overview' && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: t('dashboard.stats.totalRescues'), value: '1,284', change: '+12%', up: true, icon: <TrendingUp className="w-5 h-5 text-green-600" />, bg: 'bg-green-100' },
                  { label: t('dashboard.stats.activeSOS'), value: '14', change: '+2', up: true, icon: <AlertCircle className="w-5 h-5 text-red-600" />, bg: 'bg-red-100' },
                  { label: t('dashboard.stats.teamsDeployed'), value: '42', change: '-3', up: false, icon: <Users className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-100' },
                  { label: t('dashboard.stats.resourceLevel'), value: '84%', change: '-2%', up: false, icon: <Package className="w-5 h-5 text-yellow-600" />, bg: 'bg-yellow-100' },
                ].map((stat, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={cn("p-3 rounded-2xl", stat.bg)}>
                        {stat.icon}
                      </div>
                      <div className={cn(
                        "flex items-center gap-1 text-xs font-bold",
                        stat.up ? "text-green-600" : "text-red-600"
                      )}>
                        {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {stat.change}
                      </div>
                    </div>
                    <div className="text-3xl font-bold mb-1">{stat.value}</div>
                    <div className="text-xs font-bold text-stone-400 uppercase tracking-widest">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              <AdminOverview />
            </>
          )}
          
          {activeTab === 'map' && (
            <div className="h-[600px] bg-stone-900 rounded-[2.5rem] overflow-hidden relative border border-stone-800 shadow-inner">
              <Map
                mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
                initialViewState={{
                  longitude: 90.4125, // default generic longitude
                  latitude: 23.8103, // default generic latitude
                  zoom: 11
                }}
                mapStyle="mapbox://styles/mapbox/dark-v11"
              >
                {activeIncidents.map((incident, idx) => (
                  <Marker key={idx} longitude={incident.lng} latitude={incident.lat}>
                    <div className="relative flex flex-col items-center">
                      <div className="w-8 h-8 bg-red-600 rounded-full border-2 border-white shadow-[0_0_20px_rgba(220,38,38,0.8)] flex items-center justify-center animate-bounce">
                        <AlertCircle className="w-4 h-4 text-white" />
                      </div>
                      <div className="absolute top-10 flex flex-col items-center">
                        <div className="w-2 h-2 bg-red-600 rounded-full animate-ping"></div>
                        <div className="bg-stone-900 text-white text-[10px] font-bold px-2 py-1 rounded-md mt-1 whitespace-nowrap shadow-xl">
                          {incident.userName} {incident.isSilent ? '(SILENT)' : ''}
                        </div>
                      </div>
                    </div>
                  </Marker>
                ))}
              </Map>
              
              <div className="absolute top-6 left-6 right-6 flex justify-between pointer-events-none">
                <div className="bg-stone-900/90 backdrop-blur-md p-4 rounded-2xl border border-stone-800 shadow-2xl pointer-events-auto">
                  <h3 className="text-white font-bold text-sm mb-1">Live Tracking Radar</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-stone-400 text-xs font-bold uppercase tracking-widest">{activeIncidents.length} Active Targets</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
