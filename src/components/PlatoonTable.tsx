import React, { useState } from 'react';
import { Platoon } from '../types/platoon';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface PlatoonTableProps {
    platoons: Platoon[];
    onAdd: (platoon: Platoon) => void;
    onEdit: (platoon: Platoon) => void;
    onDelete: (platoonId: string) => void;
}

const PlatoonTable: React.FC<PlatoonTableProps> = ({ platoons, onAdd, onEdit, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlatoon, setEditingPlatoon] = useState<Platoon | null>(null);
    const [formData, setFormData] = useState<Partial<Platoon>>({
        name: '',
        description: ''
    });

    const handleOpenModal = (platoon?: Platoon) => {
        if (platoon) {
            setEditingPlatoon(platoon);
            setFormData({ ...platoon });
        } else {
            setEditingPlatoon(null);
            setFormData({
                name: '',
                description: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingPlatoon(null);
        setFormData({
            name: '',
            description: ''
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingPlatoon) {
            onEdit({ ...editingPlatoon, ...formData } as Platoon);
        } else {
            onAdd({ ...formData, id: Date.now().toString() } as Platoon);
        }
        handleCloseModal();
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">ניהול פלוגות</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-indigo-700"
                >
                    <Plus className="w-5 h-5" />
                    <span>הוסף פלוגה</span>
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">שם הפלוגה</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">תיאור</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">פעולות</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {platoons.map((platoon) => (
                            <tr key={platoon.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-right">{platoon.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">{platoon.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleOpenModal(platoon)}
                                            className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(platoon.id)}
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
                            {editingPlatoon ? 'עריכת פלוגה' : 'הוספת פלוגה חדשה'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 text-right">שם הפלוגה</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-right"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 text-right">תיאור</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-right"
                                    rows={3}
                                />
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                                >
                                    ביטול
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                                >
                                    {editingPlatoon ? 'שמור שינויים' : 'הוסף פלוגה'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlatoonTable; 