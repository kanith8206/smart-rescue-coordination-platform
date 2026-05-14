import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { PhoneCall, Heart, Shield, Flame, X } from 'lucide-react';

export function EmergencyQuickAccess({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { t } = useTranslation();

  const contacts = [
    { name: t('contact.nationalDisaster'), number: '911', icon: <PhoneCall className="w-6 h-6" />, color: 'bg-red-600' },
    { name: t('contact.ambulance'), number: '108', icon: <Heart className="w-6 h-6" />, color: 'bg-blue-600' },
    { name: t('contact.police'), number: '100', icon: <Shield className="w-6 h-6" />, color: 'bg-stone-900' },
    { name: t('contact.fireBrigade'), number: '101', icon: <Flame className="w-6 h-6" />, color: 'bg-orange-600' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-stone-900/60 backdrop-blur-sm flex flex-col justify-end sm:justify-center px-4 pb-4 sm:p-0"
          onClick={onClose}
        >
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="bg-white w-full max-w-sm mx-auto rounded-[2.5rem] p-6 shadow-2xl relative"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-12 h-1.5 bg-stone-200 rounded-full mx-auto mb-6 sm:hidden" />
            
            <button onClick={onClose} className="absolute right-6 top-6 p-2 bg-stone-100 rounded-full text-stone-500 hover:text-stone-900 transition-colors hidden sm:block">
               <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black mb-1">{t('contact.directory', 'Emergency Directory')}</h3>
            <p className="text-sm text-stone-500 mb-6">{t('contact.assistanceDesc', 'Direct quick access to emergency services.')}</p>

            <div className="grid grid-cols-2 gap-4">
               {contacts.map((contact, i) => (
                 <a 
                   key={i} 
                   href={`tel:${contact.number}`}
                   className="flex flex-col items-center p-4 rounded-3xl bg-stone-50 border border-stone-100 hover:bg-stone-100 hover:scale-105 transition-all group"
                 >
                   <div className={`w-14 h-14 rounded-2xl ${contact.color} text-white flex items-center justify-center shadow-lg group-hover:-translate-y-1 transition-transform mb-3`}>
                     {contact.icon}
                   </div>
                   <div className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1 text-center leading-tight">{contact.name}</div>
                   <div className="text-xl font-black tracking-tighter text-stone-900">{contact.number}</div>
                 </a>
               ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
