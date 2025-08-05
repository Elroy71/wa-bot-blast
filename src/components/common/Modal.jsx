// src/components/common/Modal.js

import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
                <X size={20} className="text-gray-600" />
            </button>
            </div>
            <div className="p-6">
            {children}
            </div>
        </div>
        </div>
    );
    };

export default Modal;