import React, { useState } from 'react';
import { VehicleType } from '../types/vehicleType';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface VehicleTypesTableProps {
    vehicleTypes: VehicleType[];
    onAdd: (vehicleType: VehicleType) => void;
    onEdit: (vehicleType: VehicleType) => void;
    onDelete: (vehicleTypeId: string) => void;
}

const VehicleTypesTable: React.FC<VehicleTypesTableProps> = ({ vehicleTypes, onAdd, onEdit, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVehicleType, setEditingVehicleType] = useState<VehicleType | null>(null);
    const [formData, setFormData] = useState<Partial<VehicleType>>({
        name: '',
        description: '',
        maintenanceInterval: 0
    });

    const handleOpenModal = (vehicleType?: VehicleType) => {
        if (vehicleType) {
            setEditingVehicleType(vehicleType);
            setFormData({ ...vehicleType });
        } else {
            setEditingVehicleType(null);
            setFormData({
                name: '',
                description: '',
                maintenanceInterval: 0
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingVehicleType(null);
        setFormData({
            name: '',
            description: '',
            maintenanceInterval: 0
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingVehicleType) {
            onEdit({ ...editingVehicleType, ...formData } as VehicleType);
        } else {
            onAdd({ ...formData, id: Date.now().toString() } as VehicleType);
        }
        handleCloseModal();
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">ניהול סוגי רכב</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-indigo-700"
                >
                    <Plus className="w-5 h-5" />
                    <span>הוסף סוג רכב</span>
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">שם</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">תיאור</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">תדירות טיפול (ימים)</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">פעולות</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {vehicleTypes.map((vehicleType) => (
                            <tr key={vehicleType.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-right">{vehicleType.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">{vehicleType.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">{vehicleType.maintenanceInterval}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleOpenModal(vehicleType)}
                                            className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(vehicleType.id)}
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
                            {editingVehicleType ? 'עריכת סוג רכב' : 'הוספת סוג רכב חדש'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 text-right">שם</label>
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
                                <input
                                    type="text"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-right"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 text-right">תדירות טיפול (ימים)</label>
                                <input
                                    type="number"
                                    value={formData.maintenanceInterval}
                                    onChange={(e) => setFormData({ ...formData, maintenanceInterval: parseInt(e.target.value) })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-right"
                                    required
                                    min="0"
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
                                    {editingVehicleType ? 'שמור שינויים' : 'הוסף סוג רכב'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VehicleTypesTable; 