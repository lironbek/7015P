import React, { useState, useEffect } from 'react';
import { Vehicle, VehicleStatus } from '../types/vehicle';
import { VehicleType } from '../types/vehicleType';
import { Platoon } from '../types/platoon';

interface VehicleFormProps {
    vehicle?: Vehicle;
    vehicleTypes: VehicleType[];
    platoons: Platoon[];
    onSubmit: (vehicle: Partial<Vehicle>) => void;
    onClose: () => void;
}

const VehicleForm: React.FC<VehicleFormProps> = ({
    vehicle,
    vehicleTypes,
    platoons,
    onSubmit,
    onClose
}) => {
    const [vehicleNumber, setVehicleNumber] = useState(vehicle?.vehicleNumber || '');
    const [vehicleTypeId, setVehicleTypeId] = useState(vehicle?.vehicleTypeId || '');
    const [platoonId, setPlatoonId] = useState(vehicle?.platoonId || '');
    const [maintenanceDate, setMaintenanceDate] = useState(vehicle?.maintenanceDate?.split('T')[0] || '');
    const [notes, setNotes] = useState(vehicle?.notes || '');
    const [status, setStatus] = useState(vehicle?.status || 'operational');
    const [hasDriverTools, setHasDriverTools] = useState(vehicle?.hasDriverTools || false);
    const [hasFireExtinguisher, setHasFireExtinguisher] = useState(vehicle?.hasFireExtinguisher || false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            id: vehicle?.id || crypto.randomUUID(),
            vehicleNumber,
            vehicleTypeId,
            platoonId,
            maintenanceDate,
            notes,
            status,
            hasDriverTools,
            hasFireExtinguisher
        });
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6 text-right">
                    {vehicle ? 'עריכת רכב' : 'הוספת רכב חדש'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-right mb-1">מספר רכב</label>
                        <input
                            type="text"
                            value={vehicleNumber}
                            onChange={(e) => setVehicleNumber(e.target.value)}
                            className="w-full border rounded p-2 text-right"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-right mb-1">סוג רכב</label>
                        <select
                            value={vehicleTypeId}
                            onChange={(e) => setVehicleTypeId(e.target.value)}
                            className="w-full border rounded p-2 text-right"
                            required
                        >
                            <option value="">בחר סוג רכב</option>
                            {vehicleTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.type}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-right mb-1">פלוגה</label>
                        <select
                            value={platoonId}
                            onChange={(e) => setPlatoonId(e.target.value)}
                            className="w-full border rounded p-2 text-right"
                            required
                        >
                            <option value="">בחר פלוגה</option>
                            {platoons.map((platoon) => (
                                <option key={platoon.id} value={platoon.id}>
                                    {platoon.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-right mb-1">תאריך טיפול</label>
                        <input
                            type="date"
                            value={maintenanceDate}
                            onChange={(e) => setMaintenanceDate(e.target.value)}
                            className="w-full border rounded p-2 text-right"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-right mb-1">הערות</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full border rounded p-2 text-right"
                            rows={4}
                        />
                    </div>

                    <div>
                        <label className="block text-right mb-1">סטטוס</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as VehicleStatus)}
                            className="w-full border rounded p-2 text-right"
                            required
                        >
                            <option value="operational">תקין</option>
                            <option value="disabled">מושבת</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={hasDriverTools}
                                onChange={(e) => setHasDriverTools(e.target.checked)}
                                className="form-checkbox h-5 w-5 text-blue-600"
                            />
                            <span>כלי נהג</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={hasFireExtinguisher}
                                onChange={(e) => setHasFireExtinguisher(e.target.checked)}
                                className="form-checkbox h-5 w-5 text-blue-600"
                            />
                            <span>מטף כיבוי אש</span>
                        </label>
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            ביטול
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                        >
                            {vehicle ? 'עדכון' : 'הוספה'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VehicleForm; 