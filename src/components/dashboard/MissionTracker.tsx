import React, { useState } from 'react';
import { Navigation, CheckCircle2, Clock, MapPin, Phone, MessageSquare } from 'lucide-react';
import { Button } from '../ui/Button';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

export const MissionTracker = () => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<'dispatched' | 'on-site' | 'evacuating' | 'completed'>('dispatched');

  const steps = [
    { id: 'dispatched', label: t('mission.steps.dispatched'), icon: <Navigation className="w-4 h-4" /> },
    { id: 'on-site', label: t('mission.steps.onSite'), icon: <MapPin className="w-4 h-4" /> },
    { id: 'evacuating', label: t('mission.steps.evacuating'), icon: <Clock className="w-4 h-4" /> },
    { id: 'completed', label: t('mission.steps.completed'), icon: <CheckCircle2 className="w-4 h-4" /> },
  ];

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-stone-200 shadow-xl">
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="text-[10px] font-bold text-red-600 uppercase tracking-widest mb-1">{t('mission.activeMission')}</div>
          <h3 className="text-2xl font-bold tracking-tight">{t('mission.operationNumber', { number: '482' })}</h3>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm"><Phone className="w-4 h-4" /></Button>
          <Button variant="secondary" size="sm"><MessageSquare className="w-4 h-4" /></Button>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="relative flex justify-between mb-12">
        <div className="absolute top-5 left-0 w-full h-1 bg-stone-100 -z-10" />
        <div 
          className="absolute top-5 left-0 h-1 bg-red-600 transition-all duration-500 -z-10" 
          style={{ width: `${(steps.findIndex(s => s.id === status) / (steps.length - 1)) * 100}%` }}
        />
        
        {steps.map((step, i) => {
          const isCompleted = steps.findIndex(s => s.id === status) >= i;
          const isActive = step.id === status;
          
          return (
            <div key={step.id} className="flex flex-col items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                isCompleted ? 'bg-red-600 text-white shadow-lg shadow-red-200' : 'bg-white border-2 border-stone-100 text-stone-300'
              }`}>
                {step.icon}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${
                isActive ? 'text-red-600' : isCompleted ? 'text-stone-900' : 'text-stone-300'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="bg-stone-50 p-6 rounded-3xl border border-stone-100 mb-8">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">{t('mission.targetLocation')}</div>
            <div className="text-sm font-bold">Sector 4, Main Road</div>
          </div>
          <div>
            <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">{t('mission.victims')}</div>
            <div className="text-sm font-bold">2 Adults, 1 Child</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {status === 'dispatched' && <Button onClick={() => setStatus('on-site')} className="w-full">{t('mission.actions.arrived')}</Button>}
        {status === 'on-site' && <Button onClick={() => setStatus('evacuating')} className="w-full">{t('mission.actions.startEvacuation')}</Button>}
        {status === 'evacuating' && <Button onClick={() => setStatus('completed')} variant="danger" className="w-full">{t('mission.actions.complete')}</Button>}
        {status === 'completed' && <Button disabled className="w-full">{t('mission.actions.finished')}</Button>}
        
        <Button variant="secondary" className="w-full">{t('mission.actions.requestBackup')}</Button>
      </div>
    </div>
  );
};
