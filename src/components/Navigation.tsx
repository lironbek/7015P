import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { LayoutDashboard, Users, Building2, Car, Settings, Wrench, Calendar } from 'lucide-react';

interface NavigationProps {
    session: Session;
}

const Navigation: React.FC<NavigationProps> = ({ session }) => {
    const location = useLocation();

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    const menuItems = [
        { path: '/dashboard', label: 'דשבורד', icon: LayoutDashboard },
        { path: '/users', label: 'ניהול משתמשים', icon: Users },
        { path: '/platoons', label: 'ניהול פלוגות', icon: Building2 },
        { path: '/vehicles', label: 'ניהול רכבים', icon: Car },
        { path: '/vehicle-types', label: 'ניהול סוגי רכב', icon: Wrench },
        { path: '/maintenance-calendar', label: 'יומן טיפולים', icon: Calendar },
        { path: '/settings', label: 'הגדרות מערכת', icon: Settings }
    ];

    return (
        <div className="fixed top-0 right-0 h-screen w-64 bg-gray-900 text-white shadow-xl" style={{ direction: 'rtl' }}>
            <div className="flex flex-col h-full">
                <div className="p-6 border-b border-gray-800">
                    <h1 className="text-xl font-bold">מערכת ניהול רכב</h1>
                    <div className="text-sm text-gray-400 mt-2">{session.user?.email}</div>
                </div>
                
                <nav className="flex-1 overflow-y-auto p-4">
                    <ul className="space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                                            location.pathname === item.path
                                                ? 'bg-indigo-600 text-white'
                                                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                        }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span>{item.label}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200"
                    >
                        התנתק
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Navigation; 