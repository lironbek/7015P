import React, { useState } from 'react';
import { Vehicle, MaintenanceLog } from '../types/vehicle';
import { User } from '../types/user';
import { X, Upload, Clock, User as UserIcon } from 'lucide-react';

interface MaintenanceLogModalProps {
    vehicle: Vehicle;
    logs: MaintenanceLog[];
    currentUser: User;
    onAddLog: (log: Partial<MaintenanceLog>) => void;
    onClose: () => void;
}

const MaintenanceLogModal: React.FC<MaintenanceLogModalProps> = ({
    vehicle,
    logs,
    currentUser,
    onAddLog,
    onClose
}) => {
    const [newLogNote, setNewLogNote] = useState('');
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const images: string[] = [];
        if (selectedFiles) {
            for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i];
                const reader = new FileReader();
                const imagePromise = new Promise<string>((resolve) => {
                    reader.onload = () => resolve(reader.result as string);
                    reader.readAsDataURL(file);
                });
                images.push(await imagePromise);
            }
        }

        onAddLog({
            vehicleId: vehicle.id,
            userId: currentUser.id,
            notes: newLogNote,
            images,
            timestamp: new Date().toISOString()
        });

        setNewLogNote('');
        setSelectedFiles(null);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('he-IL', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const vehicleLogs = logs.filter(log => log.vehicleId === vehicle.id);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                <div className="flex justify-between items-center mb-4">
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <h2 className="text-xl font-bold">יומן טיפולים - רכב מספר {vehicle.vehicleNumber}</h2>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-right">רשומות קודמות</h3>
                    <div className="space-y-4 max-h-60 overflow-y-auto">
                        {vehicleLogs.map((log) => (
                            <div key={log.id} className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                                        <Clock className="w-4 h-4" />
                                        <span>{formatDate(log.timestamp)}</span>
                                        <UserIcon className="w-4 h-4 mr-2" />
                                        <span>{currentUser.firstName} {currentUser.lastName}</span>
                                    </div>
                                </div>
                                <p className="text-right">{log.notes}</p>
                                {log.images && log.images.length > 0 && (
                                    <div className="mt-2 flex gap-2">
                                        {log.images.map((image, index) => (
                                            <img
                                                key={index}
                                                src={image}
                                                alt={`תמונה ${index + 1}`}
                                                className="w-20 h-20 object-cover rounded"
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 text-right mb-1">
                            הוסף רשומה חדשה
                        </label>
                        <textarea
                            value={newLogNote}
                            onChange={(e) => setNewLogNote(e.target.value)}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-right"
                            rows={3}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 text-right mb-1">
                            צרף תמונות
                        </label>
                        <div className="flex items-center justify-end gap-2">
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => setSelectedFiles(e.target.files)}
                                className="hidden"
                                id="image-upload"
                            />
                            <label
                                htmlFor="image-upload"
                                className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md flex items-center gap-2"
                            >
                                <Upload className="w-5 h-5" />
                                <span>בחר תמונות</span>
                            </label>
                            {selectedFiles && (
                                <span className="text-sm text-gray-600">
                                    {selectedFiles.length} תמונות נבחרו
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="submit"
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                        >
                            הוסף רשומה
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MaintenanceLogModal; 