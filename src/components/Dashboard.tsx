import React from 'react';

const Dashboard: React.FC = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">דשבורד</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-2">סיכום רכבים</h2>
                    <p>מספר רכבים פעילים: 0</p>
                    <p>רכבים בטיפול: 0</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-2">טיפולים קרובים</h2>
                    <p>אין טיפולים מתוכננים</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-2">התראות</h2>
                    <p>אין התראות חדשות</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 