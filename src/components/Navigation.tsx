import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { LayoutDashboard, Users, Building2, Car, Settings, Wrench, Calendar } from 'lucide-react';

interface NavigationProps {
    session: Session;
}

const Navigation: React.FC<NavigationProps> = ({ session }) => {
    const location = useLocation();
    const [userRole, setUserRole] = useState<string>('user');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUserRole = async () => {
            if (!session?.user?.id) {
                console.error('No user session found');
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const { data: userData, error } = await supabase
                    .from('users')
                    .select('role')
                    .eq('id', session.user.id)
                    .single();

                if (error) {
                    if (error.code === 'PGRST116') {
                        // User not found, create new user
                        const isAdmin = session.user.email === 'lironbek88@gmail.com';
                        const { error: insertError } = await supabase
                            .from('users')
                            .insert([
                                {
                                    id: session.user.id,
                                    email: session.user.email,
                                    role: isAdmin ? 'admin' : 'user',
                                    first_name: '',
                                    last_name: ''
                                }
                            ]);

                        if (insertError) {
                            console.error('Error creating user:', insertError);
                            setUserRole('user');
                        } else {
                            setUserRole(isAdmin ? 'admin' : 'user');
                        }
                    } else {
                        console.error('Error loading user role:', error);
                        setUserRole('user');
                    }
                } else if (userData) {
                    setUserRole(userData.role);
                }
            } catch (err) {
                console.error('Error:', err);
                setUserRole('user');
            } finally {
                setIsLoading(false);
            }
        };

        loadUserRole();
    }, [session]);

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const menuItems = [
        { path: '/dashboard', label: 'דשבורד', icon: LayoutDashboard, roles: ['user', 'admin'] },
        { path: '/users', label: 'ניהול משתמשים', icon: Users, roles: ['admin'] },
        { path: '/platoons', label: 'ניהול פלוגות', icon: Building2, roles: ['admin'] },
        { path: '/vehicles', label: 'ניהול רכבים', icon: Car, roles: ['admin'] },
        { path: '/vehicle-types', label: 'ניהול סוגי רכב', icon: Wrench, roles: ['admin'] },
        { path: '/maintenance-calendar', label: 'יומן טיפולים', icon: Calendar, roles: ['user', 'admin'] },
        { path: '/settings', label: 'הגדרות מערכת', icon: Settings, roles: ['user', 'admin'] }
    ];

    if (isLoading) {
        return <div className="fixed top-0 right-0 h-screen w-64 bg-gray-900 text-white shadow-xl p-6">
            <div>טוען...</div>
        </div>;
    }

    const filteredMenuItems = menuItems.filter(item => item.roles.includes(userRole));

    return (
        <div className="fixed top-0 right-0 h-screen w-64 bg-gray-900 text-white shadow-xl" style={{ direction: 'rtl' }}>
            <div className="flex flex-col h-full">
                <div className="p-6 border-b border-gray-800">
                    <h1 className="text-xl font-bold">מערכת ניהול רכב</h1>
                    <div className="text-sm text-gray-400 mt-2">{session.user?.email}</div>
                    <div className="text-sm text-gray-400">תפקיד: {userRole === 'admin' ? 'מנהל' : 'משתמש'}</div>
                </div>
                
                <nav className="flex-1 overflow-y-auto p-4">
                    <ul className="space-y-2">
                        {filteredMenuItems.map((item) => {
                            const Icon = item.icon;
                            const path = item.path.replace('/', '');
                            return (
                                <li key={path}>
                                    <Link
                                        to={path}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                                            location.pathname === path
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