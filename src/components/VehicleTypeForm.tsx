import React, { useState, useEffect } from 'react';
import { VehicleType } from '../types/vehicleType';

interface VehicleTypeFormProps {
    vehicleType?: VehicleType;
    onSubmit: (vehicleType: Partial<VehicleType>) => void;
    onClose: () => void;
}

const VehicleTypeForm: React.FC<VehicleTypeFormProps> = ({ vehicleType, onSubmit, onClose }) => {
    const [formData, setFormData] = useState<Partial<VehicleType>>({
        type: '',
        notes: ''
    });

    useEffect(() => {
        if (vehicleType) {
            setFormData(vehicleType);
        }
    }, [vehicleType]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6 text-right">
                    {vehicleType ? 'עריכת סוג רכב' : 'הוספת סוג רכב חדש'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-right mb-1">סוג רכב</label>
                        <input
                            type="text"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="w-full border rounded p-2 text-right"
                            placeholder="הכנס את סוג הרכב"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-right mb-1">הערות</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full border rounded p-2 text-right"
                            placeholder="הכנס הערות"
                            rows={4}
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
                            {vehicleType ? 'עדכן' : 'הוסף'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VehicleTypeForm; 