import React from 'react';
import { Sparkles, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

export const AIInsights = () => {
  const { t } = useTranslation();
  const insights = [
    { 
      type: 'prediction', 
      icon: <TrendingUp className="w-4 h-4 text-orange-500" />, 
      title: t('insights.floodRisk.title'), 
      desc: t('insights.floodRisk.desc'),
      priority: 'High',
      priorityLabel: t('priority.high')
    },
    { 
      type: 'priority', 
      icon: <AlertTriangle className="w-4 h-4 text-red-500" />, 
      title: t('insights.elderlyHome.title'), 
      desc: t('insights.elderlyHome.desc'),
      priority: 'Critical',
      priorityLabel: t('priority.critical')
    },
    { 
      type: 'safety', 
      icon: <ShieldCheck className="w-4 h-4 text-green-500" />, 
      title: t('insights.safeZone.title'), 
      desc: t('insights.safeZone.desc'),
      priority: 'Info',
      priorityLabel: t('priority.info')
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-stone-900 p-2 rounded-xl">
          <Sparkles className="w-5 h-5 text-yellow-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold tracking-tight">{t('insights.title')}</h3>
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{t('insights.subtitle')}</p>
        </div>
      </div>

      <div className="space-y-3">
        {insights.map((insight, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-5 rounded-3xl bg-stone-50 border border-stone-100 hover:border-stone-200 transition-all group"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                {insight.icon}
                <span className="text-sm font-bold text-stone-900">{insight.title}</span>
              </div>
              <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded-full ${
                insight.priority === 'Critical' ? 'bg-red-600 text-white' : 
                insight.priority === 'High' ? 'bg-orange-500 text-white' : 'bg-stone-200 text-stone-600'
              }`}>
                {insight.priorityLabel}
              </span>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">{insight.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
