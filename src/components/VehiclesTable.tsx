import React, { useState, useMemo } from 'react';
import { Vehicle, VehicleStatus, VehicleClassification } from '../types/vehicle';
import { Platoon } from '../types/platoon';
import { VehicleType } from '../types/vehicleType';
import { User } from '../types/user';
import { Plus, Edit, Trash2, Book, ArrowUpDown, User as UserIcon, Download, Upload } from 'lucide-react';
import { read, utils, writeFile } from 'xlsx';

interface VehiclesTableProps {
    vehicles: Vehicle[];
    platoons: Platoon[];
    vehicleTypes: VehicleType[];
    currentUser: User;
    onAdd: (vehicle: Vehicle) => void;
    onEdit: (vehicle: Vehicle) => void;
    onDelete: (vehicleId: string) => void;
    onViewLogs: (vehicle: Vehicle) => void;
}

type SortField = keyof Vehicle;
type SortDirection = 'asc' | 'desc';

const VehiclesTable: React.FC<VehiclesTableProps> = ({ vehicles, platoons, vehicleTypes, currentUser, onAdd, onEdit, onDelete, onViewLogs }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
    const [sortField, setSortField] = useState<SortField>('vehicleNumber');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [filters, setFilters] = useState({
        vehicleNumber: '',
        vehicleTypeId: '',
        platoonId: '',
        status: '',
        classification: ''
    });

    const [formData, setFormData] = useState<Partial<Vehicle>>({
        vehicleNumber: '',
        vehicleTypeId: '',
        platoonId: '',
        maintenanceDate: '',
        notes: '',
        status: 'operational',
        hasFireExtinguisher: false,
        hasDriverTools: false,
        classification: 'operational'
    });

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const filteredAndSortedVehicles = useMemo(() => {
        let result = [...vehicles];

        // סינון
        result = result.filter(vehicle => {
            return (
                vehicle.vehicleNumber.toLowerCase().includes(filters.vehicleNumber.toLowerCase()) &&
                (filters.vehicleTypeId === '' || vehicle.vehicleTypeId === filters.vehicleTypeId) &&
                (filters.platoonId === '' || vehicle.platoonId === filters.platoonId) &&
                (filters.status === '' || vehicle.status === filters.status) &&
                (filters.classification === '' || vehicle.classification === filters.classification)
            );
        });

        // מיון
        result.sort((a, b) => {
            let aValue = a[sortField];
            let bValue = b[sortField];

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortDirection === 'asc' 
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
                return sortDirection === 'asc'
                    ? (aValue ? 1 : 0) - (bValue ? 1 : 0)
                    : (bValue ? 1 : 0) - (aValue ? 1 : 0);
            }

            return 0;
        });

        return result;
    }, [vehicles, filters, sortField, sortDirection]);

    const handleOpenModal = (vehicle?: Vehicle) => {
        if (vehicle) {
            setEditingVehicle(vehicle);
            setFormData({ ...vehicle });
        } else {
            setEditingVehicle(null);
            setFormData({
                vehicleNumber: '',
                vehicleTypeId: '',
                platoonId: '',
                maintenanceDate: '',
                notes: '',
                status: 'operational',
                hasFireExtinguisher: false,
                hasDriverTools: false,
                classification: 'operational'
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingVehicle(null);
        setFormData({
            vehicleNumber: '',
            vehicleTypeId: '',
            platoonId: '',
            maintenanceDate: '',
            notes: '',
            status: 'operational',
            hasFireExtinguisher: false,
            hasDriverTools: false,
            classification: 'operational'
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingVehicle) {
            onEdit({ ...editingVehicle, ...formData } as Vehicle);
        } else {
            onAdd({ ...formData, id: Date.now().toString() } as Vehicle);
        }
        handleCloseModal();
    };

    const getVehicleTypeName = (vehicleTypeId?: string) => {
        if (!vehicleTypeId) return '-';
        const vehicleType = vehicleTypes.find(vt => vt.id === vehicleTypeId);
        return vehicleType ? vehicleType.name : '-';
    };

    const getPlatoonName = (platoonId?: string) => {
        if (!platoonId) return '-';
        const platoon = platoons.find(p => p.id === platoonId);
        return platoon ? platoon.name : '-';
    };

    const handleExportToExcel = () => {
        const exportData = filteredAndSortedVehicles.map(vehicle => ({
            'מספר רכב': vehicle.vehicleNumber,
            'סוג רכב': getVehicleTypeName(vehicle.vehicleTypeId),
            'פלוגה': getPlatoonName(vehicle.platoonId),
            'תאריך טיפול': vehicle.maintenanceDate,
            'סיווג': vehicle.classification === 'operational' ? 'מבצעי' : 'מנהלתי',
            'מטף כיבוי אש': vehicle.hasFireExtinguisher ? 'כן' : 'לא',
            'כלי נהג': vehicle.hasDriverTools ? 'כן' : 'לא',
            'סטטוס': vehicle.status === 'operational' ? 'תקין' : 
                     vehicle.status === 'limited' ? 'כשירות מוגבלת' : 'מושבת',
            'הערות': vehicle.notes || ''
        }));

        const ws = utils.json_to_sheet(exportData);
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, 'רכבים');
        writeFile(wb, 'vehicles.xlsx');
    };

    const handleImportFromExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = utils.sheet_to_json(worksheet);

            jsonData.forEach((row: any) => {
                const vehicleType = vehicleTypes.find(vt => vt.name === row['סוג רכב']);
                const platoon = platoons.find(p => p.name === row['פלוגה']);

                const newVehicle: Vehicle = {
                    id: Date.now().toString(),
                    vehicleNumber: row['מספר רכב'].toString(),
                    vehicleTypeId: vehicleType?.id || '',
                    platoonId: platoon?.id || '',
                    maintenanceDate: row['תאריך טיפול'] || '',
                    classification: row['סיווג'] === 'מבצעי' ? 'operational' : 'administrative',
                    hasFireExtinguisher: row['מטף כיבוי אש'] === 'כן',
                    hasDriverTools: row['כלי נהג'] === 'כן',
                    status: row['סטטוס'] === 'תקין' ? 'operational' :
                            row['סטטוס'] === 'כשירות מוגבלת' ? 'limited' : 'disabled',
                    notes: row['הערות'] || ''
                };

                onAdd(newVehicle);
            });
        };
        reader.readAsArrayBuffer(file);
        event.target.value = '';
    };

    return (
        <div className="p-6 relative min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">ניהול רכבים</h1>
                <div className="flex gap-2">
                    <button
                        onClick={handleExportToExcel}
                        className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-green-700"
                    >
                        <Download className="w-5 h-5" />
                        <span>ייצא לאקסל</span>
                    </button>
                    <label className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700 cursor-pointer">
                        <Upload className="w-5 h-5" />
                        <span>ייבא מאקסל</span>
                        <input
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={handleImportFromExcel}
                            className="hidden"
                        />
                    </label>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-indigo-700"
                    >
                        <Plus className="w-5 h-5" />
                        <span>הוסף רכב</span>
                    </button>
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow mb-4 grid grid-cols-5 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-right">מספר רכב</label>
                    <input
                        type="text"
                        value={filters.vehicleNumber}
                        onChange={(e) => setFilters({ ...filters, vehicleNumber: e.target.value })}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-right"
                        placeholder="חיפוש לפי מספר רכב"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-right">סוג רכב</label>
                    <select
                        value={filters.vehicleTypeId}
                        onChange={(e) => setFilters({ ...filters, vehicleTypeId: e.target.value })}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-right"
                    >
                        <option value="">הכל</option>
                        {vehicleTypes.map(type => (
                            <option key={type.id} value={type.id}>{type.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-right">פלוגה</label>
                    <select
                        value={filters.platoonId}
                        onChange={(e) => setFilters({ ...filters, platoonId: e.target.value })}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-right"
                    >
                        <option value="">הכל</option>
                        {platoons.map(platoon => (
                            <option key={platoon.id} value={platoon.id}>{platoon.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-right">סטטוס</label>
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-right"
                    >
                        <option value="">הכל</option>
                        <option value="operational">תקין</option>
                        <option value="limited">כשירות מוגבלת</option>
                        <option value="disabled">מושבת</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-right">סיווג</label>
                    <select
                        value={filters.classification}
                        onChange={(e) => setFilters({ ...filters, classification: e.target.value })}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-right"
                    >
                        <option value="">הכל</option>
                        <option value="operational">מבצעי</option>
                        <option value="administrative">מנהלתי</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th 
                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('vehicleNumber')}
                            >
                                <div className="flex items-center justify-end gap-2">
                                    מספר רכב
                                    <ArrowUpDown className="w-4 h-4" />
                                </div>
                            </th>
                            <th 
                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('vehicleTypeId')}
                            >
                                <div className="flex items-center justify-end gap-2">
                                    סוג רכב
                                    <ArrowUpDown className="w-4 h-4" />
                                </div>
                            </th>
                            <th 
                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('platoonId')}
                            >
                                <div className="flex items-center justify-end gap-2">
                                    פלוגה
                                    <ArrowUpDown className="w-4 h-4" />
                                </div>
                            </th>
                            <th 
                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('maintenanceDate')}
                            >
                                <div className="flex items-center justify-end gap-2">
                                    תאריך טיפול
                                    <ArrowUpDown className="w-4 h-4" />
                                </div>
                            </th>
                            <th 
                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('classification')}
                            >
                                <div className="flex items-center justify-end gap-2">
                                    סיווג
                                    <ArrowUpDown className="w-4 h-4" />
                                </div>
                            </th>
                            <th 
                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('hasFireExtinguisher')}
                            >
                                <div className="flex items-center justify-end gap-2">
                                    מטף כיבוי אש
                                    <ArrowUpDown className="w-4 h-4" />
                                </div>
                            </th>
                            <th 
                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('hasDriverTools')}
                            >
                                <div className="flex items-center justify-end gap-2">
                                    כלי נהג
                                    <ArrowUpDown className="w-4 h-4" />
                                </div>
                            </th>
                            <th 
                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('status')}
                            >
                                <div className="flex items-center justify-end gap-2">
                                    סטטוס
                                    <ArrowUpDown className="w-4 h-4" />
                                </div>
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">הערות</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">פעולות</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredAndSortedVehicles.map((vehicle) => (
                            <tr key={vehicle.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-right">{vehicle.vehicleNumber}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">{getVehicleTypeName(vehicle.vehicleTypeId)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">{getPlatoonName(vehicle.platoonId)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">{vehicle.maintenanceDate}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    {vehicle.classification === 'operational' ? 'מבצעי' : 'מנהלתי'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <span className={vehicle.hasFireExtinguisher ? 'text-green-600' : 'text-red-600'}>
                                        {vehicle.hasFireExtinguisher ? '✓' : '✗'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <span className={vehicle.hasDriverTools ? 'text-green-600' : 'text-red-600'}>
                                        {vehicle.hasDriverTools ? '✓' : '✗'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        vehicle.status === 'operational' ? 'bg-green-100 text-green-800' :
                                        vehicle.status === 'limited' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {vehicle.status === 'operational' ? 'תקין' :
                                         vehicle.status === 'limited' ? 'כשירות מוגבלת' :
                                         'מושבת'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">{vehicle.notes}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => onViewLogs(vehicle)}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            <Book className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleOpenModal(vehicle)}
                                            className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(vehicle.id)}
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

            <div className="absolute bottom-4 right-6 flex items-center gap-2 text-gray-600">
                <UserIcon className="w-5 h-5" />
                <span>משתמש מחובר: {currentUser.firstName} {currentUser.lastName}</span>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4 text-right">
                            {editingVehicle ? 'עריכת רכב' : 'הוספת רכב חדש'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 text-right">מספר רכב</label>
                                <input
                                    type="text"
                                    pattern="[0-9]*"
                                    value={formData.vehicleNumber}
                                    onChange={(e) => {
                                        if (e.target.validity.valid) {
                                            setFormData({ ...formData, vehicleNumber: e.target.value });
                                        }
                                    }}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-right"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 text-right">סוג רכב</label>
                                <select
                                    value={formData.vehicleTypeId}
                                    onChange={(e) => setFormData({ ...formData, vehicleTypeId: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-right"
                                    required
                                >
                                    <option value="">בחר סוג רכב</option>
                                    {vehicleTypes.map(type => (
                                        <option key={type.id} value={type.id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 text-right">פלוגה</label>
                                <select
                                    value={formData.platoonId}
                                    onChange={(e) => setFormData({ ...formData, platoonId: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-right"
                                    required
                                >
                                    <option value="">בחר פלוגה</option>
                                    {platoons.map(platoon => (
                                        <option key={platoon.id} value={platoon.id}>
                                            {platoon.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 text-right">תאריך טיפול</label>
                                <input
                                    type="date"
                                    value={formData.maintenanceDate}
                                    onChange={(e) => setFormData({ ...formData, maintenanceDate: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-right"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 text-right">סיווג</label>
                                <select
                                    value={formData.classification}
                                    onChange={(e) => setFormData({ ...formData, classification: e.target.value as VehicleClassification })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-right"
                                >
                                    <option value="operational">מבצעי</option>
                                    <option value="administrative">מנהלתי</option>
                                </select>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.hasFireExtinguisher}
                                        onChange={(e) => setFormData({ ...formData, hasFireExtinguisher: e.target.checked })}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label className="mr-2 block text-sm text-gray-700">מטף כיבוי אש</label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.hasDriverTools}
                                        onChange={(e) => setFormData({ ...formData, hasDriverTools: e.target.checked })}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label className="mr-2 block text-sm text-gray-700">כלי נהג</label>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 text-right">סטטוס</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as VehicleStatus })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-right"
                                >
                                    <option value="operational">תקין</option>
                                    <option value="limited">כשירות מוגבלת</option>
                                    <option value="disabled">מושבת</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 text-right">הערות</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
                                    {editingVehicle ? 'שמור שינויים' : 'הוסף רכב'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VehiclesTable; 