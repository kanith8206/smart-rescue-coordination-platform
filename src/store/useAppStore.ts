import { create } from 'zustand';
import { Incident, SOSSignal } from '../types';

interface AppState {
  incidents: Incident[];
  sosRequests: SOSSignal[];
  notifications: string[];
  isEmergencyMode: boolean;
  isOffline: boolean;
  familyContacts: string[];
  familyPhoneNumbers: string[];
  emergencyPhones: string[];
  
  setIncidents: (incidents: Incident[]) => void;
  addIncident: (incident: Incident) => void;
  addSOSRequest: (sos: SOSSignal) => void;
  addNotification: (message: string) => void;
  toggleEmergencyMode: () => void;
  setOfflineStatus: (status: boolean) => void;
  addFamilyContact: (email: string) => void;
  removeFamilyContact: (email: string) => void;
  addFamilyPhoneNumber: (phone: string) => void;
  removeFamilyPhoneNumber: (phone: string) => void;
  addEmergencyPhone: (phone: string) => void;
  removeEmergencyPhone: (phone: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  incidents: [],
  sosRequests: [],
  notifications: [],
  isEmergencyMode: false,
  isOffline: !navigator.onLine,
  familyContacts: JSON.parse(localStorage.getItem('familyContacts') || '[]'),
  emergencyPhones: JSON.parse(localStorage.getItem('emergencyPhones') || '[]'),
  familyPhoneNumbers: JSON.parse(localStorage.getItem('familyPhoneNumbers') || '[]'),
  
  setIncidents: (incidents) => set({ incidents }),
  addIncident: (incident) => set((state) => ({ incidents: [incident, ...state.incidents] })),
  addSOSRequest: (sos) => set((state) => ({ sosRequests: [sos, ...state.sosRequests] })),
  addNotification: (message) => set((state) => ({ 
    notifications: [message, ...state.notifications].slice(0, 10) 
  })),
  toggleEmergencyMode: () => set((state) => ({ isEmergencyMode: !state.isEmergencyMode })),
  setOfflineStatus: (status) => set({ isOffline: status }),
  addFamilyContact: (email) => set((state) => {
    if (state.familyContacts.includes(email)) return state;
    const newContacts = [...state.familyContacts, email];
    localStorage.setItem('familyContacts', JSON.stringify(newContacts));
    return { familyContacts: newContacts };
  }),
  removeFamilyContact: (email) => set((state) => {
    const newContacts = state.familyContacts.filter(c => c !== email);
    localStorage.setItem('familyContacts', JSON.stringify(newContacts));
    return { familyContacts: newContacts };
  }),
  addFamilyPhoneNumber: (phone) => set((state) => {
    if (state.familyPhoneNumbers.includes(phone)) return state;
    const newPhones = [...state.familyPhoneNumbers, phone];
    localStorage.setItem('familyPhoneNumbers', JSON.stringify(newPhones));
    return { familyPhoneNumbers: newPhones };
  }),
  removeFamilyPhoneNumber: (phone) => set((state) => {
    const newPhones = state.familyPhoneNumbers.filter(p => p !== phone);
    localStorage.setItem('familyPhoneNumbers', JSON.stringify(newPhones));
    return { familyPhoneNumbers: newPhones };
  }),
  addEmergencyPhone: (phone) => set((state) => {
    if (state.emergencyPhones.includes(phone)) return state;
    const updated = [...state.emergencyPhones, phone];
    localStorage.setItem('emergencyPhones', JSON.stringify(updated));
    return { emergencyPhones: updated };
  }),
  removeEmergencyPhone: (phone) => set((state) => {
    const updated = state.emergencyPhones.filter(p => p !== phone);
    localStorage.setItem('emergencyPhones', JSON.stringify(updated));
    return { emergencyPhones: updated };
  }),
}));
