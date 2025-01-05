import { createClient } from '@supabase/supabase-js';
import { Platoon } from '../types/platoon';
import { Vehicle } from '../types/vehicle';
import { VehicleType } from '../types/vehicleType';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
    }
});

// פונקציה לבדיקת מצב האימות
export const checkAuth = async () => {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        return session;
    } catch (error) {
        console.error('Error checking auth status:', error);
        return null;
    }
};

// פונקציית בדיקת חיבור
export const testConnection = async () => {
    try {
        // Simple connection test without requiring authentication
        const { error } = await supabase
            .from('platoons')
            .select('count')
            .limit(1)
            .maybeSingle();

        if (error && error.message !== 'JWT token is missing') {
            console.error('Connection test error:', error);
            return false;
        }

        return true;
    } catch (err) {
        console.error('Connection test exception:', err);
        return false;
    }
};

// פונקציות לטיפול בפלוגות
export const addPlatoon = async (platoon: Omit<Platoon, 'id' | 'created_at'>) => {
    const session = await checkAuth();
    if (!session) {
        throw new Error('No active session');
    }

    const { data, error } = await supabase
        .from('platoons')
        .insert([platoon])
        .select()
        .single();

    if (error) {
        console.error('Error adding platoon:', error);
        throw error;
    }

    return data;
};

export const updatePlatoon = async (platoon: Platoon) => {
    const session = await checkAuth();
    if (!session) {
        throw new Error('No active session');
    }

    const { data, error } = await supabase
        .from('platoons')
        .update(platoon)
        .eq('id', platoon.id)
        .select()
        .single();

    if (error) {
        console.error('Error updating platoon:', error);
        throw error;
    }

    return data;
};

export const deletePlatoon = async (platoonId: string) => {
    const session = await checkAuth();
    if (!session) {
        throw new Error('No active session');
    }

    const { error } = await supabase
        .from('platoons')
        .delete()
        .eq('id', platoonId);

    if (error) {
        console.error('Error deleting platoon:', error);
        throw error;
    }
};

export const getPlatoons = async () => {
    const session = await checkAuth();
    if (!session) {
        throw new Error('No active session');
    }

    const { data, error } = await supabase
        .from('platoons')
        .select('*')
        .order('name');

    if (error) {
        console.error('Error fetching platoons:', error);
        throw error;
    }

    return data;
};

// פונקציות לטיפול ברכבים
export const addVehicle = async (vehicle: Omit<Vehicle, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
        .from('vehicles')
        .insert([vehicle])
        .select()
        .single();

    if (error) {
        console.error('Error adding vehicle:', error);
        throw error;
    }

    return data;
};

export const updateVehicle = async (vehicle: Vehicle) => {
    const { data, error } = await supabase
        .from('vehicles')
        .update(vehicle)
        .eq('id', vehicle.id)
        .select()
        .single();

    if (error) {
        console.error('Error updating vehicle:', error);
        throw error;
    }

    return data;
};

export const deleteVehicle = async (vehicleId: string) => {
    const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', vehicleId);

    if (error) {
        console.error('Error deleting vehicle:', error);
        throw error;
    }
};

export const getVehicles = async () => {
    const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('vehicle_number');

    if (error) {
        console.error('Error fetching vehicles:', error);
        throw error;
    }

    return data;
};

// פונקציות לטיפול בסוגי רכבים
export const addVehicleType = async (vehicleType: Omit<VehicleType, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
        .from('vehicle_types')
        .insert([vehicleType])
        .select()
        .single();

    if (error) {
        console.error('Error adding vehicle type:', error);
        throw error;
    }

    return data;
};

export const updateVehicleType = async (vehicleType: VehicleType) => {
    const { data, error } = await supabase
        .from('vehicle_types')
        .update(vehicleType)
        .eq('id', vehicleType.id)
        .select()
        .single();

    if (error) {
        console.error('Error updating vehicle type:', error);
        throw error;
    }

    return data;
};

export const deleteVehicleType = async (vehicleTypeId: string) => {
    const { error } = await supabase
        .from('vehicle_types')
        .delete()
        .eq('id', vehicleTypeId);

    if (error) {
        console.error('Error deleting vehicle type:', error);
        throw error;
    }
};

export const getVehicleTypes = async () => {
    const { data, error } = await supabase
        .from('vehicle_types')
        .select('*')
        .order('name');

    if (error) {
        console.error('Error fetching vehicle types:', error);
        throw error;
    }

    return data;
}; 