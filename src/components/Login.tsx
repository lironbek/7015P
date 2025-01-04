import React, { useState } from 'react';
import { LoginCredentials } from '../types/user';

interface LoginProps {
    onLogin: (credentials: LoginCredentials) => boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        const success = onLogin({ email, password });
        if (!success) {
            setError('שם משתמש או סיסמה שגויים');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">התחברות למערכת</h2>
                {error && (
                    <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-right">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 text-right">
                            אימייל
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-right"
                            required
                            dir="rtl"
                            placeholder="הכנס אימייל"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 text-right">
                            סיסמה
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-right"
                            required
                            dir="rtl"
                            placeholder="הכנס סיסמה"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        התחבר
                    </button>
                </form>
                <div className="mt-4 text-sm text-gray-600 text-center">
                    * משתמש ברירת מחדל: admin@example.com / admin123
                </div>
            </div>
        </div>
    );
};

export default Login; 