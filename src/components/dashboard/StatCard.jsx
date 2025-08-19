import React from 'react';

const StatCard = ({ item }) => (
    <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4 transition-transform transform hover:-translate-y-1">
        <div className={`p-3 rounded-full text-white ${item.color}`}>
             {/* The icon is passed as a component, so this is correct */}
            <item.icon size={24} />
        </div>
        <div>
            {/* [FIX] Changed item.label to item.title to match the data */}
            <p className="text-sm text-gray-500">{item.title}</p>
            <p className="text-2xl font-bold text-gray-800">{item.value}</p>
        </div>
    </div>
);

export default StatCard;
