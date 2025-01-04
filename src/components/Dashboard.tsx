import React, { useState, useMemo, useEffect } from 'react';
import { Vehicle } from '../types/vehicle';
import { Platoon } from '../types/platoon';
import { VehicleType } from '../types/vehicleType';
import { Filter, Book, Search, Edit, Calendar as CalendarIcon } from 'lucide-react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from 'react-router-dom';

interface DashboardProps {
    vehicles: Vehicle[];
    platoons: Platoon[];
    vehicleTypes: VehicleType[];
    onEditVehicle: (vehicle: Vehicle) => void;
}

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const Dashboard: React.FC<DashboardProps> = ({ vehicles, platoons, vehicleTypes, onEditVehicle }) => {
    const navigate = useNavigate();
    const [selectedPlatoon, setSelectedPlatoon] = useState<string>('all');
    const [selectedChartStatus, setSelectedChartStatus] = useState<string>('all');
    const [selectedChartClassification, setSelectedChartClassification] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [selectedClassification, setSelectedClassification] = useState<string>('all');
    const [selectedVehicleType, setSelectedVehicleType] = useState<string>('all');
    const [selectedTablePlatoon, setSelectedTablePlatoon] = useState<string>('all');
    const [selectedDate, setSelectedDate] = useState<Value>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    // עיבוד נתונים לגטטיסטיקה
    const stats = useMemo(() => {
        const filteredVehicles = vehicles.filter(vehicle => 
            (selectedPlatoon === 'all' || vehicle.platoonId === selectedPlatoon) &&
            (selectedChartStatus === 'all' || vehicle.status === selectedChartStatus) &&
            (selectedChartClassification === 'all' || vehicle.classification === selectedChartClassification)
        );

        return {
            operational: filteredVehicles.filter(v => v.status === 'operational').length,
            limited: filteredVehicles.filter(v => v.status === 'limited').length,
            disabled: filteredVehicles.filter(v => v.status === 'disabled').length
        };
    }, [vehicles, selectedPlatoon, selectedChartStatus, selectedChartClassification]);

    // סינון נתונים לטבלה
    const filteredVehicles = useMemo(() => {
        return vehicles.filter(vehicle => 
            (selectedTablePlatoon === 'all' || vehicle.platoonId === selectedTablePlatoon) &&
            (selectedStatus === 'all' || vehicle.status === selectedStatus) &&
            (selectedVehicleType === 'all' || vehicle.vehicleTypeId === selectedVehicleType) &&
            (selectedClassification === 'all' || vehicle.classification === selectedClassification) &&
            (!searchQuery || vehicle.vehicleNumber.includes(searchQuery))
        );
    }, [vehicles, selectedTablePlatoon, selectedStatus, selectedVehicleType, selectedClassification, searchQuery]);

    // חישוב ההצעות לפי מספרי הרכב
    const suggestions = useMemo(() => {
        if (!searchQuery) return [];
        
        return vehicles
            .filter(vehicle => 
                vehicle.vehicleNumber.toString().includes(searchQuery)
            )
            .map(vehicle => vehicle.vehicleNumber.toString())
            .slice(0, 5);
    }, [vehicles, searchQuery]);

    // מיפוי תאריכי טיפול לפי יום
    const maintenanceDates = useMemo(() => {
        const dates = new Map<string, Vehicle[]>();
        vehicles.forEach(vehicle => {
            if (vehicle.maintenanceDate) {
                const date = vehicle.maintenanceDate.split('T')[0];
                if (!dates.has(date)) {
                    dates.set(date, []);
                }
                dates.get(date)?.push(vehicle);
            }
        });
        return dates;
    }, [vehicles]);

    // רכבים לתאריך שנבחר
    const selectedDateVehicles = useMemo(() => {
        if (!selectedDate || !(selectedDate instanceof Date)) return [];
        const dateStr = selectedDate.toISOString().split('T')[0];
        return maintenanceDates.get(dateStr) || [];
    }, [maintenanceDates, selectedDate]);

    const getPlatoonName = (platoonId: string) => {
        return platoons.find(p => p.id === platoonId)?.name || '-';
    };

    const getVehicleTypeName = (typeId: string) => {
        return vehicleTypes.find(t => t.id === typeId)?.name || '-';
    };

    const getStatusDisplay = (status: string) => {
        switch (status) {
            case 'operational':
                return 'תקין';
            case 'limited':
                return 'כשירות מוגבלת';
            case 'disabled':
                return 'מושבת';
            default:
                return status;
        }
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'operational':
                return 'bg-green-100 text-green-800';
            case 'limited':
                return 'bg-yellow-100 text-yellow-800';
            case 'disabled':
                return 'bg-red-100 text-red-800';
            default:
                return '';
        }
    };

    const getClassificationDisplay = (classification: string) => {
        return classification === 'operational' ? 'מבצעי' : 'מנהלתי';
    };

    // עיצוב תאריכים עם טיפולים
    const tileContent = ({ date, view }: { date: Date; view: string }) => {
        if (view !== 'month') return null;

        const dateStr = date.toISOString().split('T')[0];
        const vehiclesForDate = maintenanceDates.get(dateStr);

        if (!vehiclesForDate?.length) return null;

        return (
            <div className="text-xs mt-1">
                <div className="bg-yellow-100 text-yellow-800 rounded-full px-1">
                    {vehiclesForDate.length} טיפולים
                </div>
            </div>
        );
    };

    const handleVehicleClick = (vehicleId: string) => {
        navigate(`/maintenance-log/${vehicleId}`);
    };

    // סגירת ההצעות כשלוחצים מחוץ לשדה החיפוש
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.search-container')) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="space-y-8 p-6">
            {/* פילטרים */}
            <div className="bg-white p-4 rounded-lg shadow flex flex-wrap gap-4 items-center">
                <Filter className="w-5 h-5 text-gray-500" />
                <select
                    value={selectedPlatoon}
                    onChange={(e) => setSelectedPlatoon(e.target.value)}
                    className="border rounded p-2"
                >
                    <option value="all">כל הפלוגות</option>
                    {platoons.map(platoon => (
                        <option key={platoon.id} value={platoon.id}>
                            {platoon.name}
                        </option>
                    ))}
                </select>
                <select
                    value={selectedChartStatus}
                    onChange={(e) => setSelectedChartStatus(e.target.value)}
                    className="border rounded p-2"
                >
                    <option value="all">כל הסטטוסים</option>
                    <option value="operational">תקין</option>
                    <option value="limited">כשירות מוגבלת</option>
                    <option value="disabled">מושבת</option>
                </select>
                <select
                    value={selectedChartClassification}
                    onChange={(e) => setSelectedChartClassification(e.target.value)}
                    className="border rounded p-2"
                >
                    <option value="all">כל הסיווגים</option>
                    <option value="operational">מבצעי</option>
                    <option value="administrative">מנהלתי</option>
                </select>
            </div>

            {/* סטטיסטיקת רכבים */}
            <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4 text-right">
                    סטטוס רכבים 
                    {selectedPlatoon !== 'all' ? ` - ${getPlatoonName(selectedPlatoon)}` : ''} 
                    {selectedChartStatus !== 'all' ? ` (${getStatusDisplay(selectedChartStatus)})` : ''}
                    {selectedChartClassification !== 'all' ? ` - ${getClassificationDisplay(selectedChartClassification)}` : ''}
                </h2>
                <div className="flex justify-center items-center gap-16 py-8">
                    <div className="text-center">
                        <div className="relative mb-4">
                            <div className="w-32 h-32 rounded-full flex items-center justify-center text-2xl font-bold text-white bg-green-500">
                                {stats.operational}
                            </div>
                        </div>
                        <div className="text-lg font-medium">תקין</div>
                    </div>
                    <div className="text-center">
                        <div className="relative mb-4">
                            <div className="w-32 h-32 rounded-full flex items-center justify-center text-2xl font-bold text-white bg-yellow-500">
                                {stats.limited}
                            </div>
                        </div>
                        <div className="text-lg font-medium">כשירות מוגבלת</div>
                    </div>
                    <div className="text-center">
                        <div className="relative mb-4">
                            <div className="w-32 h-32 rounded-full flex items-center justify-center text-2xl font-bold text-white bg-red-500">
                                {stats.disabled}
                            </div>
                        </div>
                        <div className="text-lg font-medium">מושבת</div>
                    </div>
                </div>
            </div>

            {/* טבלת רכבים מפורטת */}
            <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex flex-wrap gap-4 items-center mb-4">
                    <h2 className="text-xl font-bold">פירוט רכבים</h2>
                    
                    {/* שדה חיפוש אוטוקומפליט */}
                    <div className="relative search-container">
                        <div className="flex items-center border rounded-md hover:border-blue-500 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-colors">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setShowSuggestions(true);
                                }}
                                onFocus={() => setShowSuggestions(true)}
                                placeholder="חיפוש מספר רכב..."
                                className="p-2 rounded-md text-right w-48 focus:outline-none"
                                dir="rtl"
                            />
                            <Search className="w-4 h-4 mx-2 text-gray-400" />
                        </div>
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                                {suggestions.map((suggestion, index) => (
                                    <div
                                        key={index}
                                        className="p-2 hover:bg-gray-100 cursor-pointer text-right transition-colors"
                                        onClick={() => {
                                            setSearchQuery(suggestion);
                                            setShowSuggestions(false);
                                        }}
                                    >
                                        {suggestion}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <select
                        value={selectedTablePlatoon}
                        onChange={(e) => setSelectedTablePlatoon(e.target.value)}
                        className="border rounded p-2"
                    >
                        <option value="all">כל הפלוגות</option>
                        {platoons.map(platoon => (
                            <option key={platoon.id} value={platoon.id}>
                                {platoon.name}
                            </option>
                        ))}
                    </select>
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="border rounded p-2"
                    >
                        <option value="all">כל הסטטוסים</option>
                        <option value="operational">תקין</option>
                        <option value="limited">כשירות מוגבלת</option>
                        <option value="disabled">מושבת</option>
                    </select>
                    <select
                        value={selectedVehicleType}
                        onChange={(e) => setSelectedVehicleType(e.target.value)}
                        className="border rounded p-2"
                    >
                        <option value="all">כל סוגי הרכב</option>
                        {vehicleTypes.map(type => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                        ))}
                    </select>
                    <select
                        value={selectedClassification}
                        onChange={(e) => setSelectedClassification(e.target.value)}
                        className="border rounded p-2"
                    >
                        <option value="all">כל הסיווגים</option>
                        <option value="operational">מבצעי</option>
                        <option value="administrative">מנהלתי</option>
                    </select>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    מספר רכב
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    סוג רכב
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    פלוגה
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    סטטוס
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    פיווג
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    פעולות
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredVehicles.map((vehicle) => (
                                <tr key={vehicle.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="text-sm text-gray-900">
                                            {vehicle.vehicleNumber}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="text-sm text-gray-900">
                                            {getVehicleTypeName(vehicle.vehicleTypeId)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="text-sm text-gray-900">
                                            {getPlatoonName(vehicle.platoonId)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(vehicle.status)}`}>
                                            {getStatusDisplay(vehicle.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <span className="text-sm text-gray-900">
                                            {getClassificationDisplay(vehicle.classification)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => onEditVehicle(vehicle)}
                                                className="text-indigo-600 hover:text-indigo-900"
                                                title="ערוך פרטי רכב"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleVehicleClick(vehicle.id)}
                                                className="text-blue-600 hover:text-blue-900"
                                                title="צפה ביומן טיפולים"
                                            >
                                                <CalendarIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* לוח טיפולים */}
            <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">לוח טיפולים</h2>
                <div className="flex flex-col items-center">
                    <Calendar
                        onChange={setSelectedDate}
                        value={selectedDate}
                        tileContent={tileContent}
                        locale="he-IL"
                    />
                    {selectedDate && selectedDateVehicles.length > 0 && selectedDate instanceof Date && (
                        <div className="mt-4 w-full">
                            <h3 className="text-lg font-semibold mb-2">
                                רכבים לטיפול בתאריך {selectedDate.toLocaleDateString('he-IL')}
                            </h3>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            מספר רכב
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            סוג רכב
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            פלוגה
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {selectedDateVehicles.map((vehicle) => (
                                        <tr key={vehicle.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="text-sm text-gray-900">
                                                    {vehicle.vehicleNumber}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="text-sm text-gray-900">
                                                    {getVehicleTypeName(vehicle.vehicleTypeId)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="text-sm text-gray-900">
                                                    {getPlatoonName(vehicle.platoonId)}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 