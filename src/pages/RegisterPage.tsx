import React, { useState } from 'react';
import { 
  Shield, 
  User, 
  Users, 
  Mail, 
  Phone, 
  MapPin, 
  Lock, 
  Building2, 
  UserCircle, 
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/LanguageSelector';

type Role = 'citizen' | 'rescue_team';

interface FormErrors {
  [key: string]: string;
}

export default function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeRole, setActiveRole] = useState<Role>('citizen');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  // Citizen Form State
  const [citizenData, setCitizenData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: ''
  });

  // Rescue Team Form State
  const [rescueData, setRescueData] = useState({
    teamName: '',
    leaderName: '',
    email: '',
    phone: '',
    orgName: '',
    area: '',
    teamSize: '',
    password: '',
    confirmPassword: ''
  });

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    return /^\d{10}$/.test(phone);
  };

  const handleCitizenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FormErrors = {};

    if (!citizenData.fullName) newErrors.fullName = 'Full Name is required';
    if (!citizenData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(citizenData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!citizenData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(citizenData.phone)) {
      newErrors.phone = 'Phone must be 10 digits';
    }
    if (!citizenData.address) newErrors.address = 'Address is required';
    if (!citizenData.password) {
      newErrors.password = 'Password is required';
    } else if (citizenData.password.length < 8) {
      newErrors.password = 'Minimum 8 characters required';
    }
    if (citizenData.confirmPassword !== citizenData.password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        const userData = { ...citizenData, role: 'citizen' };
        localStorage.setItem('user', JSON.stringify(userData));
        setSuccessMessage('✅ Registered successfully! You can now login to access your emergency dashboard.');
        
        setTimeout(() => {
          navigate('/citizen');
        }, 2000);
      }, 1000);
    }
  };

  const handleRescueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FormErrors = {};

    if (!rescueData.teamName) newErrors.teamName = 'Team Name is required';
    if (!rescueData.leaderName) newErrors.leaderName = 'Leader Name is required';
    if (!rescueData.email) {
      newErrors.email = 'Official Email is required';
    } else if (!validateEmail(rescueData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!rescueData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(rescueData.phone)) {
      newErrors.phone = 'Phone must be 10 digits';
    }
    if (!rescueData.orgName) newErrors.orgName = 'Organization Name is required';
    if (!rescueData.area) newErrors.area = 'Area of Operation is required';
    if (!rescueData.teamSize) newErrors.teamSize = 'Team Size is required';
    if (!rescueData.password) {
      newErrors.password = 'Password is required';
    } else if (rescueData.password.length < 8) {
      newErrors.password = 'Minimum 8 characters required';
    }
    if (rescueData.confirmPassword !== rescueData.password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        const userData = { ...rescueData, role: 'rescue_team' };
        localStorage.setItem('user', JSON.stringify(userData));
        setSuccessMessage('✅ Rescue Team registered! Your account is pending admin verification.');
        
        setTimeout(() => {
          navigate('/rescue');
        }, 2000);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex flex-col items-center justify-center p-4 py-12">
      {/* Logo */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-12">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-red-600 p-2 rounded-xl group-hover:scale-110 transition-transform">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tighter">{t('appName')}</span>
        </Link>
        <LanguageSelector />
      </div>

      <div className="w-full max-w-2xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-stone-900/50 backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
        >
          {/* Tabs */}
          <div className="flex border-b border-white/10">
            <button 
              onClick={() => { setActiveRole('citizen'); setErrors({}); setSuccessMessage(''); }}
              className={`flex-1 py-6 flex items-center justify-center gap-3 transition-all ${activeRole === 'citizen' ? 'bg-red-600 text-white' : 'text-stone-400 hover:text-white hover:bg-white/5'}`}
            >
              <User className="w-5 h-5" />
              <span className="font-bold uppercase tracking-widest text-xs">{t('auth.citizenRole')}</span>
            </button>
            <button 
              onClick={() => { setActiveRole('rescue_team'); setErrors({}); setSuccessMessage(''); }}
              className={`flex-1 py-6 flex items-center justify-center gap-3 transition-all ${activeRole === 'rescue_team' ? 'bg-red-600 text-white' : 'text-stone-400 hover:text-white hover:bg-white/5'}`}
            >
              <Users className="w-5 h-5" />
              <span className="font-bold uppercase tracking-widest text-xs">{t('auth.rescueRole')}</span>
            </button>
          </div>

          <div className="p-8 md:p-12">
            <div className="mb-10">
              <h2 className="text-3xl font-bold mb-2">{t('auth.createAccount')}</h2>
              <p className="text-stone-400">{activeRole === 'citizen' ? t('dashboard.citizen') : t('dashboard.rescue')}</p>
            </div>

            <AnimatePresence mode="wait">
              {successMessage ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-500/10 border border-green-500/20 rounded-2xl p-8 text-center"
                >
                  <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <p className="text-green-400 font-bold text-lg">{successMessage}</p>
                  <p className="text-stone-500 mt-2 text-sm">{t('auth.redirecting')}</p>
                </motion.div>
              ) : (
                <motion.div
                  key={activeRole}
                  initial={{ opacity: 0, x: activeRole === 'citizen' ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: activeRole === 'citizen' ? 20 : -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeRole === 'citizen' ? (
                    <form onSubmit={handleCitizenSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <InputField 
                          label="Full Name" 
                          icon={<UserCircle className="w-4 h-4" />} 
                          placeholder="John Doe" 
                          value={citizenData.fullName}
                          onChange={(v) => setCitizenData({...citizenData, fullName: v})}
                          error={errors.fullName}
                        />
                        <InputField 
                          label="Email Address" 
                          icon={<Mail className="w-4 h-4" />} 
                          placeholder="john@example.com" 
                          type="email"
                          value={citizenData.email}
                          onChange={(v) => setCitizenData({...citizenData, email: v})}
                          error={errors.email}
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <InputField 
                          label="Phone Number" 
                          icon={<Phone className="w-4 h-4" />} 
                          placeholder="10-digit number" 
                          value={citizenData.phone}
                          onChange={(v) => setCitizenData({...citizenData, phone: v})}
                          error={errors.phone}
                        />
                        <InputField 
                          label="Address/Location" 
                          icon={<MapPin className="w-4 h-4" />} 
                          placeholder="Your current city/area" 
                          value={citizenData.address}
                          onChange={(v) => setCitizenData({...citizenData, address: v})}
                          error={errors.address}
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <InputField 
                          label="Password" 
                          icon={<Lock className="w-4 h-4" />} 
                          placeholder="Min 8 characters" 
                          type="password"
                          value={citizenData.password}
                          onChange={(v) => setCitizenData({...citizenData, password: v})}
                          error={errors.password}
                        />
                        <InputField 
                          label="Confirm Password" 
                          icon={<Lock className="w-4 h-4" />} 
                          placeholder="Repeat password" 
                          type="password"
                          value={citizenData.confirmPassword}
                          onChange={(v) => setCitizenData({...citizenData, confirmPassword: v})}
                          error={errors.confirmPassword}
                        />
                      </div>
                      
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full py-5 bg-red-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-red-700 transition-all shadow-xl shadow-red-900/20 disabled:opacity-50"
                      >
                        {isSubmitting ? 'Registering...' : 'Register as Citizen'}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleRescueSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <InputField 
                          label="Team Name" 
                          icon={<Users className="w-4 h-4" />} 
                          placeholder="e.g. Rapid Response Alpha" 
                          value={rescueData.teamName}
                          onChange={(v) => setRescueData({...rescueData, teamName: v})}
                          error={errors.teamName}
                        />
                        <InputField 
                          label="Team Leader Name" 
                          icon={<UserCircle className="w-4 h-4" />} 
                          placeholder="Leader's full name" 
                          value={rescueData.leaderName}
                          onChange={(v) => setRescueData({...rescueData, leaderName: v})}
                          error={errors.leaderName}
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <InputField 
                          label="Official Email" 
                          icon={<Mail className="w-4 h-4" />} 
                          placeholder="team@org.com" 
                          type="email"
                          value={rescueData.email}
                          onChange={(v) => setRescueData({...rescueData, email: v})}
                          error={errors.email}
                        />
                        <InputField 
                          label="Contact Phone" 
                          icon={<Phone className="w-4 h-4" />} 
                          placeholder="10-digit number" 
                          value={rescueData.phone}
                          onChange={(v) => setRescueData({...rescueData, phone: v})}
                          error={errors.phone}
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <InputField 
                          label="Organization/NGO Name" 
                          icon={<Building2 className="w-4 h-4" />} 
                          placeholder="e.g. Red Cross" 
                          value={rescueData.orgName}
                          onChange={(v) => setRescueData({...rescueData, orgName: v})}
                          error={errors.orgName}
                        />
                        <InputField 
                          label="Area of Operation" 
                          icon={<MapPin className="w-4 h-4" />} 
                          placeholder="City or District" 
                          value={rescueData.area}
                          onChange={(v) => setRescueData({...rescueData, area: v})}
                          error={errors.area}
                        />
                      </div>
                      <InputField 
                        label="Team Size" 
                        icon={<Users className="w-4 h-4" />} 
                        placeholder="Number of active members" 
                        type="number"
                        value={rescueData.teamSize}
                        onChange={(v) => setRescueData({...rescueData, teamSize: v})}
                        error={errors.teamSize}
                      />
                      <div className="grid md:grid-cols-2 gap-6">
                        <InputField 
                          label="Password" 
                          icon={<Lock className="w-4 h-4" />} 
                          placeholder="Min 8 characters" 
                          type="password"
                          value={rescueData.password}
                          onChange={(v) => setRescueData({...rescueData, password: v})}
                          error={errors.password}
                        />
                        <InputField 
                          label="Confirm Password" 
                          icon={<Lock className="w-4 h-4" />} 
                          placeholder="Repeat password" 
                          type="password"
                          value={rescueData.confirmPassword}
                          onChange={(v) => setRescueData({...rescueData, confirmPassword: v})}
                          error={errors.confirmPassword}
                        />
                      </div>
                      
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full py-5 bg-red-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-red-700 transition-all shadow-xl shadow-red-900/20 disabled:opacity-50"
                      >
                        {isSubmitting ? 'Registering...' : 'Register Rescue Team'}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-10 pt-10 border-t border-white/5 text-center">
              <p className="text-stone-500 text-sm">
                {t('auth.hasAccount')}{' '}
                <Link to="/login" className="text-red-500 font-bold hover:underline">{t('auth.loginHere')}</Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

interface InputFieldProps {
  label: string;
  icon: React.ReactNode;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (val: string) => void;
  error?: string;
}

function InputField({ label, icon, placeholder, type = 'text', value, onChange, error }: InputFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 block ml-1">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-600">
          {icon}
        </div>
        <input 
          type={type} 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full bg-white/5 border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-red-600 transition-colors placeholder:text-stone-700`} 
          placeholder={placeholder} 
        />
      </div>
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ml-1"
        >
          <AlertCircle className="w-3 h-3" />
          {error}
        </motion.p>
      )}
    </div>
  );
}
