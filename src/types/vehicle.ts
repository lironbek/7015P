export type VehicleStatus = 'operational' | 'disabled' | 'limited';
export type VehicleClassification = 'operational' | 'administrative';

export interface Vehicle {
    id: string;
    vehicle_number: string;
    vehicle_type_id: string;
    platoon_id: string;
    maintenance_date: string;
    notes?: string;
    status: VehicleStatus;
    has_fire_extinguisher: boolean;
    has_driver_tools: boolean;
    classification: VehicleClassification;
    created_at?: string;
}

export interface MaintenanceLog {
    id: string;
    vehicle_id: string;
    user_id: string;
    description: string;
    date: string;
    created_at?: string;
} 