import { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import Navigation from './components/Navigation';
import UsersTable from './components/UsersTable';
import PlatoonTable from './components/PlatoonTable';
import VehiclesTable from './components/VehiclesTable';
import VehicleTypesTable from './components/VehicleTypesTable';
import MaintenanceCalendar from './components/MaintenanceCalendar';
import Login from './components/Login';
import { supabase, testConnection } from './lib/supabase';
import { NotificationSettings } from './types/settings';
import { User } from './types/user';
import { Vehicle } from './types/vehicle';
import { Platoon } from './types/platoon';
import { VehicleType } from './types/vehicleType';

function App() {
    const [session, setSession] = useState<Session | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [platoons, setPlatoons] = useState<Platoon[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
    const [settings, setSettings] = useState<NotificationSettings>(() => {
        const savedSettings = localStorage.getItem('notificationSettings');
        return savedSettings ? JSON.parse(savedSettings) : {
            email: '',
            phone: '',
            enableEmailNotifications: false,
            enableSMSNotifications: false
        };
    });

    const defaultUser: User = {
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        role: 'admin',
        platoonId: ''
    };

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (session) {
            loadUsers();
            loadPlatoons();
            loadVehicles();
            loadVehicleTypes();
        }
    }, [session]);

    const loadPlatoons = async () => {
        try {
            const { data: platoonsData, error } = await supabase
                .from('platoons')
                .select('*')
                .order('name');

            if (error) {
                console.error('Error loading platoons:', error);
                return;
            }

            setPlatoons(platoonsData);
        } catch (err) {
            console.error('Error loading platoons:', err);
        }
    };

    const loadVehicles = async () => {
        try {
            const { data: vehiclesData, error } = await supabase
                .from('vehicles')
                .select('*')
                .order('vehicle_number');

            if (error) {
                console.error('Error loading vehicles:', error);
                return;
            }

            setVehicles(vehiclesData);
        } catch (err) {
            console.error('Error loading vehicles:', err);
        }
    };

    const loadVehicleTypes = async () => {
        try {
            const { data: vehicleTypesData, error } = await supabase
                .from('vehicle_types')
                .select('*')
                .order('name');

            if (error) {
                console.error('Error loading vehicle types:', error);
                return;
            }

            setVehicleTypes(vehicleTypesData);
        } catch (err) {
            console.error('Error loading vehicle types:', err);
        }
    };

    useEffect(() => {
        const checkConnection = async () => {
            const isConnected = await testConnection();
            if (!isConnected) {
                console.error('Failed to connect to Supabase');
                // כאן אפשר להוסיף הודעה למשתמש על בעיית התחברות
            }
        };
        
        checkConnection();
    }, []);

    const loadUsers = async () => {
        try {
            const { data: usersData, error } = await supabase
                .from('users')
                .select('*');

            if (error) {
                console.error('Error loading users:', error);
                return;
            }

            setUsers(usersData.map(user => ({
                id: user.id,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                platoonId: user.platoon_id,
                password: ''
            })));
        } catch (err) {
            console.error('Error loading users:', err);
        }
    };

    useEffect(() => {
        localStorage.setItem('notificationSettings', JSON.stringify(settings));
    }, [settings]);

    const handleSaveSettings = (newSettings: NotificationSettings) => {
        setSettings(newSettings);
    };

    const handleAddUser = async () => {
        try {
            await loadUsers();
        } catch (err) {
            console.error('Error reloading users:', err);
        }
    };

    const handleEditUser = async () => {
        try {
            await loadUsers();
        } catch (err) {
            console.error('Error reloading users:', err);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        try {
            const { error } = await supabase
                .from('users')
                .delete()
                .eq('id', userId);

            if (error) throw error;
            setUsers(users.filter(u => u.id !== userId));
        } catch (err) {
            console.error('Error deleting user:', err);
        }
    };

    const handleAddPlatoon = (platoon: Platoon) => {
        setPlatoons([...platoons, platoon]);
    };

    const handleEditPlatoon = (platoon: Platoon) => {
        setPlatoons(platoons.map(p => p.id === platoon.id ? platoon : p));
    };

    const handleDeletePlatoon = (platoonId: string) => {
        setPlatoons(platoons.filter(p => p.id !== platoonId));
    };

    const handleAddVehicle = (vehicle: Vehicle) => {
        setVehicles([...vehicles, vehicle]);
    };

    const handleEditVehicle = (vehicle: Vehicle) => {
        setVehicles(vehicles.map(v => v.id === vehicle.id ? vehicle : v));
    };

    const handleDeleteVehicle = (vehicleId: string) => {
        setVehicles(vehicles.filter(v => v.id !== vehicleId));
    };

    const handleAddVehicleType = (vehicleType: VehicleType) => {
        setVehicleTypes([...vehicleTypes, vehicleType]);
    };

    const handleEditVehicleType = (vehicleType: VehicleType) => {
        setVehicleTypes(vehicleTypes.map(vt => vt.id === vehicleType.id ? vehicleType : vt));
    };

    const handleDeleteVehicleType = (vehicleTypeId: string) => {
        setVehicleTypes(vehicleTypes.filter(vt => vt.id !== vehicleTypeId));
    };

    const handleViewLogs = () => {
        // Implement view logs functionality
    };

    return (
        <Router>
            {!session ? (
                <Login />
            ) : (
                <div className="App min-h-screen bg-gray-100">
                    <div className="min-h-screen bg-gray-100" style={{ direction: 'rtl' }}>
                        <Navigation />
                        <main className="mr-64 min-h-screen p-8 bg-gray-50">
                            <div className="max-w-7xl mx-auto">
                                <Routes>
                                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                                    <Route path="/dashboard" element={<Dashboard />} />
                                    <Route path="/users" element={
                                        <UsersTable
                                            users={users}
                                            platoons={platoons}
                                            onAdd={handleAddUser}
                                            onEdit={handleEditUser}
                                            onDelete={handleDeleteUser}
                                        />
                                    } />
                                    <Route path="/platoons" element={
                                        <PlatoonTable
                                            platoons={platoons}
                                            onAdd={handleAddPlatoon}
                                            onEdit={handleEditPlatoon}
                                            onDelete={handleDeletePlatoon}
                                        />
                                    } />
                                    <Route path="/vehicles" element={
                                        <VehiclesTable
                                            vehicles={vehicles}
                                            vehicleTypes={vehicleTypes}
                                            platoons={platoons}
                                            onAdd={handleAddVehicle}
                                            onEdit={handleEditVehicle}
                                            onDelete={handleDeleteVehicle}
                                            onViewLogs={handleViewLogs}
                                            currentUser={defaultUser}
                                        />
                                    } />
                                    <Route path="/vehicle-types" element={
                                        <VehicleTypesTable
                                            vehicleTypes={vehicleTypes}
                                            onAdd={handleAddVehicleType}
                                            onEdit={handleEditVehicleType}
                                            onDelete={handleDeleteVehicleType}
                                        />
                                    } />
                                    <Route path="/maintenance" element={
                                        <MaintenanceCalendar
                                            vehicles={vehicles}
                                            platoons={platoons}
                                        />
                                    } />
                                    <Route path="/settings" element={
                                        <Settings
                                            settings={settings}
                                            onSave={handleSaveSettings}
                                        />
                                    } />
                                </Routes>
                            </div>
                        </main>
                    </div>
                </div>
            )}
        </Router>
    );
}

export default App;