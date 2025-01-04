import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface NavigationProps {
    session: Session;
}

const Navigation: React.FC<NavigationProps> = ({ session }) => {
    const location = useLocation();

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    const menuItems = [
        { path: '/dashboard', label: 'דשבורד' },
        { path: '/users', label: 'ניהול משתמשים' },
        { path: '/platoons', label: 'ניהול פלוגות' },
        { path: '/vehicles', label: 'ניהול רכבים' },
        { path: '/vehicle-types', label: 'ניהול סוגי רכב' },
        { path: '/maintenance-calendar', label: 'יומן טיפולים' },
        { path: '/settings', label: 'הגדרות מערכת' }
    ];

    return (
        <aside className="fixed inset-y-0 right-0 w-64 bg-gray-800 text-white shadow-lg z-50">
            <div className="flex flex-col h-full">
                <div className="p-6 border-b border-gray-700">
                    <h1 className="text-xl font-bold text-right">מערכת ניהול רכב</h1>
                    <div className="text-sm text-gray-400 mt-2 text-right">{session.user?.email}</div>
                </div>
                
                <nav className="flex-1 overflow-y-auto p-4">
                    <ul className="space-y-3">
                        {menuItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`block px-4 py-3 rounded-lg text-right transition-colors duration-200 ${
                                        location.pathname === item.path
                                            ? 'bg-indigo-600 text-white font-medium shadow-md'
                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="p-6 border-t border-gray-700">
                    <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200 shadow-md"
                    >
                        התנתק
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Navigation; 