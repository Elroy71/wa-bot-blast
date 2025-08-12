import React from 'react';
import { ArrowLeft } from 'lucide-react';
import AiAgentForm from '../components/AiAgentForm';

const API_URL = 'http://localhost:3000/api';

export const AiAgentCreatePage = ({ navigateTo }) => {
    
    const handleAddAgent = async (newAgentData) => {
        try {
            // Data yang dikirim ke backend disesuaikan dengan skema
            const payload = {
                name: newAgentData.name,
                company: newAgentData.company,
                languageStyle: newAgentData.languageStyle,
                behavior: newAgentData.behavior,
                status: newAgentData.status, // Frontend mengirim "Aktif" atau "Nonaktif"
            };

            const response = await fetch(`${API_URL}/agents`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Gagal membuat agent baru.');
            }

            alert('Agent baru berhasil dibuat!');
            navigateTo('aiAgentsList');

        } catch (error) {
            alert(`Terjadi kesalahan: ${error.message}`);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center mb-6">
                <button onClick={() => navigateTo('aiAgentsList')} className="p-2 rounded-full hover:bg-gray-200 mr-4">
                    <ArrowLeft size={24} className="text-gray-700" />
                </button>
                <h2 className="text-3xl font-bold text-gray-800">Buat AI Agent Baru</h2>
            </div>

            <AiAgentForm 
                onSubmit={handleAddAgent} 
                onCancel={() => navigateTo('aiAgentsList')}
                submitButtonText="Simpan Agent"
            />
        </div>
    );
};
