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

    return (
        <nav className="bg-white shadow">
            <div className="container mx-auto px-4">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex space-x-8 rtl:space-x-reverse">
                            <Link
                                to="/dashboard"
                                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                                    location.pathname === '/dashboard'
                                        ? 'border-indigo-500 text-gray-900'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                }`}
                            >
                                לוח בקרה
                            </Link>
                            <Link
                                to="/settings"
                                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                                    location.pathname === '/settings'
                                        ? 'border-indigo-500 text-gray-900'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                }`}
                            >
                                הגדרות
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="flex items-center">
                            <span className="text-sm text-gray-500 ml-4">
                                {session.user?.email}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                התנתק
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation; 