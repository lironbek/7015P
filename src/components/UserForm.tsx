import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types/user';
import { Platoon } from '../types/platoon';

interface UserFormProps {
    user?: User;
    platoons: Platoon[];
    onSubmit: (user: Partial<User>) => void;
    onClose: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, platoons, onSubmit, onClose }) => {
    const [formData, setFormData] = useState<Partial<User>>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        role: 'user',
        platoonId: ''
    });

    useEffect(() => {
        if (user) {
            setFormData(user);
        }
    }, [user]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6 text-right">
                    {user ? 'עריכת משתמש' : 'הוספת משתמש חדש'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-right mb-1">שם פרטי</label>
                        <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            className="w-full border rounded p-2 text-right"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-right mb-1">שם משפחה</label>
                        <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            className="w-full border rounded p-2 text-right"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-right mb-1">אימייל</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full border rounded p-2 text-right"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-right mb-1">טלפון</label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full border rounded p-2 text-right"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-right mb-1">סיסמה</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full border rounded p-2 text-right"
                            required={!user}
                        />
                    </div>
                    <div>
                        <label className="block text-right mb-1">הרשאה</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                            className="w-full border rounded p-2 text-right"
                            required
                        >
                            <option value="user">משתמש</option>
                            <option value="admin">מנהל</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-right mb-1">פלוגה</label>
                        <select
                            value={formData.platoonId || ''}
                            onChange={(e) => setFormData({ ...formData, platoonId: e.target.value })}
                            className="w-full border rounded p-2 text-right"
                        >
                            <option value="">בחר פלוגה</option>
                            {platoons.map((platoon) => (
                                <option key={platoon.id} value={platoon.id}>
                                    {platoon.name}
                                </option>
                            ))}
                        </select>
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
                            {user ? 'עדכן' : 'הוסף'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserForm; 