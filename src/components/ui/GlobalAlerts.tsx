import React, { useEffect } from 'react';
import { WifiOff, AlertTriangle } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';

export const GlobalAlerts = () => {
  const { t } = useTranslation();
  const { isOffline, setOfflineStatus, isEmergencyMode } = useAppStore();

  useEffect(() => {
    const handleOnline = () => setOfflineStatus(false);
    const handleOffline = () => setOfflineStatus(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-full max-w-md px-4 pointer-events-none">
      <AnimatePresence>
        {isOffline && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="bg-stone-900 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 pointer-events-auto border border-white/10"
          >
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <WifiOff className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <div className="text-sm font-bold">{t('alerts.offline')}</div>
              <div className="text-[10px] uppercase font-bold opacity-60">{t('alerts.limitedFunctionality')}</div>
            </div>
          </motion.div>
        )}

        {isEmergencyMode && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="bg-red-600 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 pointer-events-auto"
          >
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="text-sm font-bold uppercase tracking-tighter">{t('alerts.emergencyProtocol')}</div>
              <div className="text-[10px] uppercase font-bold opacity-80">{t('alerts.priorityTools')}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
