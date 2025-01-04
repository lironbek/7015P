export type VehicleStatus = 'operational' | 'disabled' | 'limited';
export type VehicleClassification = 'operational' | 'administrative';

export interface Vehicle {
    id: string;
    vehicleNumber: string;
    vehicleTypeId: string;
    platoonId: string;
    maintenanceDate: string;
    notes?: string;
    status: VehicleStatus;
    hasFireExtinguisher: boolean;
    hasDriverTools: boolean;
    classification: VehicleClassification;
}

export interface MaintenanceLog {
    id: string;
    vehicleId: string;
    userId: string;
    timestamp: string;
    notes: string;
    images?: string[];
} 