export type UserRole = 'admin' | 'user';

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    role: UserRole;
    platoonId?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
} 