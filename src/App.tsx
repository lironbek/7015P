import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { Settings } from './components/Settings';
import { NotificationService } from './services/notifications';
import { NotificationSettings } from './types/settings';
import { Vehicle } from './types/vehicle';
import { LoginCredentials } from './types/user';
import { Platoon } from './types/platoon';
import { VehicleType } from './types/vehicleType';

// קומפוננטה פנימית שמטפלת בניתוב
const AppContent = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>(() => {
    const savedSettings = localStorage.getItem('notificationSettings');
    return savedSettings ? JSON.parse(savedSettings) : {
      email: '',
      phone: '',
      enableEmailNotifications: false,
      enableSMSNotifications: false,
      sendgridApiKey: '',
      twilioAccountSid: '',
      twilioAuthToken: '',
      twilioFromNumber: ''
    };
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const savedVehicles = localStorage.getItem('vehicles');
    return savedVehicles ? JSON.parse(savedVehicles) : [];
  });

  const [platoons, setPlatoons] = useState<Platoon[]>(() => {
    const savedPlatoons = localStorage.getItem('platoons');
    return savedPlatoons ? JSON.parse(savedPlatoons) : [];
  });

  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>(() => {
    const savedVehicleTypes = localStorage.getItem('vehicleTypes');
    return savedVehicleTypes ? JSON.parse(savedVehicleTypes) : [];
  });

  useEffect(() => {
    // בדיקת התחברות קודמת
    const savedLoginState = localStorage.getItem('isLoggedIn');
    if (savedLoginState === 'true') {
      setIsLoggedIn(true);
      navigate('/dashboard');
    }
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem('platoons', JSON.stringify(platoons));
  }, [platoons]);

  useEffect(() => {
    localStorage.setItem('vehicleTypes', JSON.stringify(vehicleTypes));
  }, [vehicleTypes]);

  // בדיקת התראות
  useEffect(() => {
    const checkNotifications = async () => {
      if (!settings.enableEmailNotifications && !settings.enableSMSNotifications) {
        return;
      }

      const notificationService = new NotificationService(settings);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (const vehicle of vehicles) {
        if (!vehicle.maintenanceDate) continue;

        const maintenanceDate = new Date(vehicle.maintenanceDate);
        maintenanceDate.setHours(0, 0, 0, 0);

        const daysUntil = Math.floor((maintenanceDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (daysUntil === 1 || daysUntil === 2) {
          await notificationService.sendNotifications(vehicle, daysUntil);
        }
      }
    };

    // בדיקת התראות פעם ביום
    const checkInterval = setInterval(checkNotifications, 24 * 60 * 60 * 1000);
    checkNotifications(); // בדיקה ראשונית

    return () => clearInterval(checkInterval);
  }, [settings, vehicles]);

  const handleLogin = (credentials: LoginCredentials) => {
    if (credentials.email === 'admin@example.com' && credentials.password === 'admin123') {
      setIsLoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true');
      navigate('/dashboard');
      return true;
    }
    return false;
  };

  const handleSaveSettings = (newSettings: NotificationSettings) => {
    setSettings(newSettings);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setVehicles(vehicles.map(v => v.id === vehicle.id ? vehicle : v));
  };

  return (
    <Routes>
      <Route path="/login" element={!isLoggedIn ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" replace />} />
      <Route
        path="/dashboard"
        element={isLoggedIn ? (
          <Dashboard 
            vehicles={vehicles} 
            platoons={platoons}
            vehicleTypes={vehicleTypes}
            onEditVehicle={handleEditVehicle}
          />
        ) : (
          <Navigate to="/login" replace />
        )}
      />
      <Route
        path="/settings"
        element={isLoggedIn ? (
          <Settings settings={settings} onSave={handleSaveSettings} />
        ) : (
          <Navigate to="/login" replace />
        )}
      />
      <Route path="/" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
};

// קומפוננטה ראשית שעוטפת את האפליקציה ב-Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;