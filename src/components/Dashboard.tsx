import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Vehicle } from '../types/vehicle';
import { Platoon } from '../types/platoon';
import { VehicleType } from '../types/vehicleType';

interface DashboardProps {
    session: Session;
}

const Dashboard: React.FC<DashboardProps> = ({ session }) => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [platoons, setPlatoons] = useState<Platoon[]>([]);
    const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch vehicles
            const { data: vehiclesData, error: vehiclesError } = await supabase
                .from('vehicles')
                .select('*');
            if (vehiclesError) throw vehiclesError;
            setVehicles(vehiclesData || []);

            // Fetch platoons
            const { data: platoonsData, error: platoonsError } = await supabase
                .from('platoons')
                .select('*');
            if (platoonsError) throw platoonsError;
            setPlatoons(platoonsData || []);

            // Fetch vehicle types
            const { data: typesData, error: typesError } = await supabase
                .from('vehicle_types')
                .select('*');
            if (typesError) throw typesError;
            setVehicleTypes(typesData || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditVehicle = async (vehicle: Vehicle) => {
        try {
            const { error } = await supabase
                .from('vehicles')
                .update(vehicle)
                .eq('id', vehicle.id);
            
            if (error) throw error;
            
            setVehicles(vehicles.map(v => v.id === vehicle.id ? vehicle : v));
        } catch (error) {
            console.error('Error updating vehicle:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl">טוען נתונים...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">לוח בקרה</h1>
                <div className="text-sm text-gray-600">
                    {session.user?.email}
                </div>
            </div>
            
            {/* Vehicle List */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4 text-right">רכבים</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    מספר רכב
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    סוג רכב
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    פלוגה
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    תאריך טיפול הבא
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {vehicles.map((vehicle) => (
                                <tr key={vehicle.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        {vehicle.vehicleNumber}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        {vehicleTypes.find(t => t.id === vehicle.vehicleTypeId)?.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        {platoons.find(p => p.id === vehicle.platoonId)?.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        {vehicle.maintenanceDate}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 