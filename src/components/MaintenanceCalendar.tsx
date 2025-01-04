import React, { useMemo } from 'react';
import { Vehicle } from '../types/vehicle';
import { Platoon } from '../types/platoon';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

type Value = Date | null;

interface MaintenanceCalendarProps {
    vehicles: Vehicle[];
    platoons: Platoon[];
}

const MaintenanceCalendar: React.FC<MaintenanceCalendarProps> = ({ vehicles, platoons }) => {
    // מיפוי תאריכי טיפול לפי יום
    const maintenanceDates = useMemo(() => {
        const dates = new Map<string, Vehicle[]>();
        vehicles.forEach(vehicle => {
            const date = vehicle.maintenanceDate.split('T')[0];
            if (!dates.has(date)) {
                dates.set(date, []);
            }
            dates.get(date)?.push(vehicle);
        });
        return dates;
    }, [vehicles]);

    const getPlatoonName = (platoonId: string) => {
        return platoons.find(p => p.id === platoonId)?.name || '-';
    };

    // עיצוב תאריכים עם טיפולים
    const tileContent = ({ date, view }: { date: Date; view: string }) => {
        if (view !== 'month') return null;

        const dateStr = date.toISOString().split('T')[0];
        const vehiclesForDate = maintenanceDates.get(dateStr);

        if (!vehiclesForDate?.length) return null;

        return (
            <div className="text-xs mt-1">
                <div className="bg-blue-100 text-blue-800 rounded-full px-1">
                    {vehiclesForDate.length} טיפולים
                </div>
            </div>
        );
    };

    // הצגת פרטי טיפולים ליום שנבחר
    const handleDateClick = (value: Value) => {
        if (!value || !(value instanceof Date)) return;
        
        const dateStr = value.toISOString().split('T')[0];
        const vehiclesForDate = maintenanceDates.get(dateStr);

        if (vehiclesForDate?.length) {
            alert(`טיפולים ליום ${dateStr}:\n\n${
                vehiclesForDate.map(v => 
                    `${v.vehicleNumber} - ${getPlatoonName(v.platoonId)}`
                ).join('\n')
            }`);
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-4 text-right">יומן טיפולים</h2>
                <div className="flex justify-center">
                    <Calendar
                        onChange={handleDateClick}
                        tileContent={tileContent}
                        locale="he-IL"
                        className="rtl"
                    />
                </div>
            </div>
        </div>
    );
};

export default MaintenanceCalendar; 