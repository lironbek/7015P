import React, { useState } from 'react';
import { NotificationSettings } from '../types/settings';

interface SettingsProps {
    settings: NotificationSettings;
    onSave: (settings: NotificationSettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onSave }) => {
    const [formData, setFormData] = useState<NotificationSettings>(settings);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-right">הגדרות</h1>
            
            <div className="bg-white rounded-lg shadow p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold mb-4 text-right">הגדרות התראות</h2>
                        
                        {/* Email Settings */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-end gap-2">
                                <input
                                    type="checkbox"
                                    id="enableEmailNotifications"
                                    name="enableEmailNotifications"
                                    checked={formData.enableEmailNotifications}
                                    onChange={handleChange}
                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label htmlFor="enableEmailNotifications" className="text-sm font-medium text-gray-700">
                                    אפשר התראות במייל
                                </label>
                            </div>
                            
                            {formData.enableEmailNotifications && (
                                <div className="space-y-2">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-right">
                                            כתובת מייל
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-right"
                                            dir="rtl"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* SMS Settings */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-end gap-2">
                                <input
                                    type="checkbox"
                                    id="enableSMSNotifications"
                                    name="enableSMSNotifications"
                                    checked={formData.enableSMSNotifications}
                                    onChange={handleChange}
                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label htmlFor="enableSMSNotifications" className="text-sm font-medium text-gray-700">
                                    אפשר התראות SMS
                                </label>
                            </div>
                            
                            {formData.enableSMSNotifications && (
                                <div className="space-y-2">
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 text-right">
                                            מספר טלפון
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-right"
                                            dir="rtl"
                                            placeholder="972501234567"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            שמור הגדרות
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Settings;