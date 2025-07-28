import React from 'react';

const StatCard = ({ item }) => (
    <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4 transition-transform transform hover:-translate-y-1">
        <div className={`p-3 rounded-full bg-gray-100 ${item.color}`}>
            <item.icon size={24} />
        </div>
        <div>
        <p className="text-sm text-gray-500">{item.label}</p>
        <p className="text-2xl font-bold text-gray-800">{item.value}</p>
        </div>
    </div>
    );

export default StatCard;