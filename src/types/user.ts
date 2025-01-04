export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    role: 'admin' | 'user';
    platoonId?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
} 