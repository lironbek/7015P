import React, { useState, useEffect } from 'react';
import { Platoon } from '../types/platoon';

interface PlatoonFormProps {
    platoon?: Platoon;
    onSubmit: (platoon: Partial<Platoon>) => void;
    onClose: () => void;
}

const PlatoonForm: React.FC<PlatoonFormProps> = ({ platoon, onSubmit, onClose }) => {
    const [formData, setFormData] = useState<Partial<Platoon>>({
        name: '',
        location: ''
    });

    useEffect(() => {
        if (platoon) {
            setFormData(platoon);
        }
    }, [platoon]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6 text-right">
                    {platoon ? 'עריכת פלוגה' : 'הוספת פלוגה חדשה'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-right mb-1">שם הפלוגה</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full border rounded p-2 text-right"
                            placeholder="הכנס את שם הפלוגה"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-right mb-1">מיקום</label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full border rounded p-2 text-right"
                            placeholder="הכנס את מיקום הפלוגה"
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            ביטול
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                        >
                            {platoon ? 'עדכן' : 'הוסף'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PlatoonForm; 