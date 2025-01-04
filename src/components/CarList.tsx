import React from 'react';
import { Car } from '../types/car';
import { Settings2, Car as CarIcon, Tool } from 'lucide-react';

interface CarListProps {
  cars: Car[];
  onEdit: (car: Car) => void;
}

export function CarList({ cars, onEdit }: CarListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cars.map((car) => (
        <div key={car.id} className="bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center mb-4">
            <CarIcon className="w-6 h-6 text-blue-600" />
            <span className={`px-2 py-1 rounded-full text-sm ${
              car.status === 'available' ? 'bg-green-100 text-green-800' :
              car.status === 'in_service' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {car.status === 'available' ? 'פנוי' :
               car.status === 'in_service' ? 'בטיפול' : 'בשימוש'}
            </span>
          </div>
          
          <h3 className="text-xl font-bold mb-2 text-right">{car.manufacturer} {car.model}</h3>
          <div className="space-y-2 text-right">
            <p>מספר רכב: {car.licensePlate}</p>
            <p>שנת ייצור: {car.year}</p>
            <p>ק"מ: {car.kilometers.toLocaleString()}</p>
            {car.nextService && (
              <p>טיפול הבא: {new Date(car.nextService).toLocaleDateString('he-IL')}</p>
            )}
          </div>
          
          <button
            onClick={() => onEdit(car)}
            className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Settings2 className="w-4 h-4" />
            ערוך פרטים
          </button>
        </div>
      ))}
    </div>
  );
}