import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import CitizenDashboard from './pages/CitizenDashboard';
import RescueDashboard from './pages/RescueDashboard';
import AdminDashboard from './pages/AdminDashboard';
import HeatmapPage from './pages/HeatmapPage';
import RegisterPage from './pages/RegisterPage';
import SilentRescueMode from './pages/SilentRescueMode';
import RescueLiteMode from './pages/RescueLiteMode';
import { GlobalAlerts } from './components/ui/GlobalAlerts';
import { useAppStore } from './store/useAppStore';
import socket from './services/socket';
import { NavigationBar } from './components/navigation/NavigationBar';

export default function App() {
  const { addSOSRequest, addNotification, isEmergencyMode } = useAppStore();

  useEffect(() => {
    socket.on('sos_alert', (data) => {
      addSOSRequest(data);
      addNotification(`New SOS Alert from ${data.userName}`);
    });

    return () => {
      socket.off('sos_alert');
    };
  }, [addSOSRequest, addNotification]);

  return (
    <div className={isEmergencyMode ? 'emergency-theme' : ''}>
      <Router>
        <GlobalAlerts />
        <NavigationBar />
        <div className="pt-20 pb-28 min-h-screen">
          <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/citizen" element={<CitizenDashboard />} />
          <Route path="/rescue" element={<RescueDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/heatmap" element={<HeatmapPage />} />
          
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/silent-rescue" element={<SilentRescueMode />} />
          <Route path="/lite" element={<RescueLiteMode />} />
          
          
          <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}
