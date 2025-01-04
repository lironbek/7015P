import React from 'react';
import { Settings } from '../types/settings';
import { LogOut } from 'lucide-react';

interface SidebarProps {
    currentPage: string;
    onPageChange: (page: string) => void;
    settings: Settings;
    onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange, settings, onLogout }) => {
    const menuItems = [
        { id: 'dashboard', label: 'דשבורד' },
        { id: 'users', label: 'ניהול משתמשים' },
        { id: 'platoons', label: 'ניהול פלוגות' },
        { id: 'vehicles', label: 'ניהול רכבים' },
        { id: 'vehicleTypes', label: 'ניהול סוגי רכב' },
        { id: 'maintenance-calendar', label: 'יומן טיפולים' },
        { id: 'settings', label: 'הגדרות מערכת' }
    ];

    return (
        <div className="bg-gray-800 text-white w-64 min-h-screen p-4 flex flex-col">
            <div className="mb-8">
                {settings.logo && (
                    <div className="flex justify-center mb-4">
                        <img
                            src={settings.logo}
                            alt="לוגו"
                            className="h-20 object-contain"
                        />
                    </div>
                )}
                <div className="text-2xl font-bold text-right">
                    {settings.systemTitle}
                </div>
            </div>
            <nav className="flex-1">
                <ul className="space-y-2">
                    {menuItems.map((item) => (
                        <li key={item.id}>
                            <button
                                onClick={() => onPageChange(item.id)}
                                className={`w-full text-right p-2 rounded transition-colors ${
                                    currentPage === item.id
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-gray-300 hover:bg-gray-700'
                                }`}
                                style={{
                                    backgroundColor: currentPage === item.id ? settings.themeColor : undefined,
                                    color: currentPage === item.id ? '#ffffff' : undefined
                                }}
                            >
                                {item.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
            <button
                onClick={onLogout}
                className="mt-4 w-full flex items-center justify-end gap-2 p-2 text-gray-300 hover:bg-gray-700 rounded transition-colors"
            >
                <span>התנתק</span>
                <LogOut className="w-5 h-5" />
            </button>
        </div>
    );
};

export default Sidebar; 