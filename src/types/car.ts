export interface Car {
  id: string;
  manufacturer: string;
  model: string;
  year: number;
  licensePlate: string;
  lastService?: Date;
  nextService?: Date;
  kilometers: number;
  status: 'available' | 'in_service' | 'in_use';
}