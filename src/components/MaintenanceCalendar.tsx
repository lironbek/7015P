import React from 'react';
import { Vehicle } from '../types/vehicle';
import { Platoon } from '../types/platoon';

interface MaintenanceCalendarProps {
    vehicles: Vehicle[];
    platoons: Platoon[];
}

const MaintenanceCalendar: React.FC<MaintenanceCalendarProps> = ({ vehicles, platoons }) => {
    const getPlatoonName = (platoonId?: string) => {
        if (!platoonId) return '-';
        const platoon = platoons.find(p => p.id === platoonId);
        return platoon ? platoon.name : '-';
    };

    const getNextMaintenanceDate = (vehicle: Vehicle) => {
        if (!vehicle.maintenanceDate) return '-';
        const date = new Date(vehicle.maintenanceDate);
        return date.toLocaleDateString('he-IL');
    };

    const getDaysUntilMaintenance = (vehicle: Vehicle) => {
        if (!vehicle.maintenanceDate) return '-';
        const today = new Date();
        const maintenanceDate = new Date(vehicle.maintenanceDate);
        const diffTime = maintenanceDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const getMaintenanceStatus = (vehicle: Vehicle) => {
        const days = getDaysUntilMaintenance(vehicle);
        if (days === '-') return { text: 'לא נקבע', color: 'gray' };
        if (days < 0) return { text: 'באיחור', color: 'red' };
        if (days <= 7) return { text: 'השבוע', color: 'yellow' };
        return { text: 'בזמן', color: 'green' };
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">יומן טיפולים</h1>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">מספר רכב</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">פלוגה</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">תאריך טיפול הבא</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">ימים עד לטיפול</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">סטטוס</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {vehicles.map((vehicle) => {
                            const status = getMaintenanceStatus(vehicle);
                            return (
                                <tr key={vehicle.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">{vehicle.vehicleNumber}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">{getPlatoonName(vehicle.platoonId)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">{getNextMaintenanceDate(vehicle)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">{getDaysUntilMaintenance(vehicle)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            status.color === 'red' ? 'bg-red-100 text-red-800' :
                                            status.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                                            status.color === 'green' ? 'bg-green-100 text-green-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {status.text}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MaintenanceCalendar; 