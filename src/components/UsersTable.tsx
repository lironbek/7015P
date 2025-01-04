import React, { useState } from 'react';
import { User } from '../types/user';
import { Platoon } from '../types/platoon';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface UsersTableProps {
    users: User[];
    platoons: Platoon[];
    onAdd: (user: User) => void;
    onEdit: (user: User) => void;
    onDelete: (userId: string) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({ users, platoons, onAdd, onEdit, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<Partial<User>>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        role: 'user',
        platoonId: ''
    });
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const handleOpenModal = (user?: User) => {
        setError('');
        if (user) {
            setEditingUser(user);
            setFormData({ ...user, password: '' });
        } else {
            setEditingUser(null);
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                phone: '',
                role: 'user',
                platoonId: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            phone: '',
            role: 'user',
            platoonId: ''
        });
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (editingUser) {
                const { error: updateError } = await supabase
                    .from('users')
                    .update({
                        first_name: formData.firstName,
                        last_name: formData.lastName,
                        phone: formData.phone,
                        role: formData.role,
                        platoon_id: formData.platoonId
                    })
                    .eq('id', editingUser.id);

                if (updateError) throw updateError;
                onEdit({ ...editingUser, ...formData } as User);
            } else {
                const { data: authData, error: authError } = await supabase.auth.signUp({
                    email: formData.email!,
                    password: formData.password!,
                    options: {
                        data: {
                            first_name: formData.firstName,
                            last_name: formData.lastName
                        }
                    }
                });

                if (authError) throw authError;

                if (authData.user) {
                    const { error: profileError } = await supabase
                        .from('users')
                        .insert([
                            {
                                id: authData.user.id,
                                first_name: formData.firstName,
                                last_name: formData.lastName,
                                email: formData.email,
                                phone: formData.phone,
                                role: formData.role,
                                platoon_id: formData.platoonId
                            }
                        ]);

                    if (profileError) throw profileError;
                    onAdd({ ...formData, id: authData.user.id } as User);
                }
            }

            handleCloseModal();
        } catch (err: Error | unknown) {
            setError(err instanceof Error ? err.message : 'אירעה שגיאה בעת שמירת המשתמש');
        } finally {
            setLoading(false);
        }
    };

    const getPlatoonName = (platoonId?: string) => {
        if (!platoonId) return '-';
        const platoon = platoons.find(p => p.id === platoonId);
        return platoon ? platoon.name : '-';
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">ניהול משתמשים</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-indigo-700"
                >
                    <Plus className="w-5 h-5" />
                    <span>הוסף משתמש</span>
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">שם פרטי</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">שם משפחה</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">אימייל</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">טלפון</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">פלוגה</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">תפקיד</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">פעולות</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-right">{user.firstName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">{user.lastName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">{user.phone}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">{getPlatoonName(user.platoonId)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">{user.role === 'admin' ? 'מנהל' : 'משתמש'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleOpenModal(user)}
                                            className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(user.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4 text-right">
                            {editingUser ? 'עריכת משתמש' : 'הוספת משתמש חדש'}
                        </h2>
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-right">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 text-right">שם פרטי</label>
                                <input
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-right"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 text-right">שם משפחה</label>
                                <input
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-right"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 text-right">אימייל</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-right"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 text-right">סיסמה</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-right"
                                    required={!editingUser}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 text-right">טלפון</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-right"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 text-right">תפקיד</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'user' })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-right"
                                >
                                    <option value="user">משתמש</option>
                                    <option value="admin">מנהל</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 text-right">פלוגה</label>
                                <select
                                    value={formData.platoonId || ''}
                                    onChange={(e) => setFormData({ ...formData, platoonId: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-right"
                                >
                                    <option value="">בחר פלוגה</option>
                                    {platoons.map(platoon => (
                                        <option key={platoon.id} value={platoon.id}>
                                            {platoon.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                                    disabled={loading}
                                >
                                    ביטול
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-50"
                                    disabled={loading}
                                >
                                    {loading ? 'שומר...' : editingUser ? 'שמור שינויים' : 'הוסף משתמש'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersTable; 