import React, { useState, useEffect } from 'react';
import { NotificationSettings } from '../types/settings';

interface SettingsProps {
    settings: NotificationSettings;
    onSave: (settings: NotificationSettings) => void;
}

export const Settings: React.FC<SettingsProps> = ({ settings, onSave }) => {
    const [formData, setFormData] = useState<NotificationSettings>(settings);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">הגדרות התראות</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <h3 className="text-xl font-semibold">הגדרות כלליות</h3>
                        <div>
                        <label className="block">
                            <span className="text-gray-700">כתובת אימייל</span>
                            <input
                                type="email"
                                name="email"
                                value={formData.email || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            />
                        </label>
                        </div>
                        <div>
                        <label className="block">
                            <span className="text-gray-700">מספר טלפון</span>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            />
                                </label>
                            </div>
                        </div>

                <div className="space-y-2">
                    <h3 className="text-xl font-semibold">הגדרות SendGrid</h3>
                            <div>
                        <label className="block">
                            <span className="text-gray-700">SendGrid API Key</span>
                                <input
                                    type="password"
                                name="sendgridApiKey"
                                value={formData.sendgridApiKey || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            />
                                </label>
                            </div>
                        </div>

                <div className="space-y-2">
                    <h3 className="text-xl font-semibold">הגדרות Twilio</h3>
                                <div>
                        <label className="block">
                            <span className="text-gray-700">Twilio Account SID</span>
                                    <input
                                        type="password"
                                name="twilioAccountSid"
                                value={formData.twilioAccountSid || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            />
                        </label>
                                </div>
                                <div>
                        <label className="block">
                            <span className="text-gray-700">Twilio Auth Token</span>
                                    <input
                                        type="password"
                                name="twilioAuthToken"
                                value={formData.twilioAuthToken || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            />
                        </label>
                                </div>
                                <div>
                        <label className="block">
                            <span className="text-gray-700">Twilio From Number</span>
                                    <input
                                type="text"
                                name="twilioFromNumber"
                                value={formData.twilioFromNumber || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            />
                        </label>
                                </div>
                            </div>

                <div className="space-y-2">
                    <h3 className="text-xl font-semibold">העדפות התראות</h3>
                        <div>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                name="enableEmailNotifications"
                                checked={formData.enableEmailNotifications}
                                onChange={handleChange}
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            />
                            <span className="mr-2">אפשר התראות במייל</span>
                                </label>
                    </div>
                    <div>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                name="enableSMSNotifications"
                                checked={formData.enableSMSNotifications}
                                onChange={handleChange}
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            />
                            <span className="mr-2">אפשר התראות SMS</span>
                                </label>
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        שמור הגדרות
                    </button>
                </div>
            </form>
        </div>
    );
};