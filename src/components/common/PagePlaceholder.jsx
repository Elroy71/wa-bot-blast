import React from 'react';

const PagePlaceholder = ({ pageName }) => (
    <div className="text-center p-10 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 capitalize">{pageName}</h2>
        <p className="text-gray-500 mt-2">Halaman ini sedang dalam pengembangan.</p>
    </div>
);

export default PagePlaceholder;
