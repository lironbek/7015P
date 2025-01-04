import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import Navigation from './components/Navigation';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';
import { NotificationSettings } from './types/settings';

function App() {
    const [session, setSession] = useState<Session | null>(null);
    const [settings, setSettings] = useState<NotificationSettings>(() => {
        const savedSettings = localStorage.getItem('notificationSettings');
        return savedSettings ? JSON.parse(savedSettings) : {
            email: '',
            phone: '',
            enableEmailNotifications: false,
            enableSMSNotifications: false
        };
    });

    useEffect(() => {
        // בדיקת סשן קיים
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        // האזנה לשינויים במצב ההתחברות
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        localStorage.setItem('notificationSettings', JSON.stringify(settings));
    }, [settings]);

    const handleLogin = (newSession: Session) => {
        setSession(newSession);
    };

    const handleSaveSettings = (newSettings: NotificationSettings) => {
        setSettings(newSettings);
    };

    return (
        <Router>
            <div className="App min-h-screen bg-gray-100">
                {!session ? (
                    <Login onLogin={handleLogin} />
                ) : (
                    <>
                        <Navigation session={session} />
                        <main className="py-10">
                            <Routes>
                                <Route path="/dashboard" element={<Dashboard session={session} />} />
                                <Route path="/settings" element={<Settings settings={settings} onSave={handleSaveSettings} />} />
                                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            </Routes>
                        </main>
                    </>
                )}
            </div>
        </Router>
    );
}

export default App;