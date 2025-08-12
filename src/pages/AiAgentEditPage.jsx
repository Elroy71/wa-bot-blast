import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import AiAgentForm from '../components/AiAgentForm';

const API_URL = 'http://localhost:3000/api';

export const AiAgentEditPage = ({ navigateTo, params }) => {
    const [agent, setAgent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAgentData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}/agents/${params.aiAgentId}`);
                if (!response.ok) {
                    throw new Error('Gagal memuat data agent.');
                }
                const data = await response.json();
                
                // Map status dari backend ('active') ke frontend ('Aktif')
                const formattedData = {
                    ...data,
                    status: data.status === 'active' ? 'Aktif' : 'Nonaktif',
                    // Ganti nama field agar sesuai dengan form
                    knowledgeBases: data.knowledge || [], 
                };
                setAgent(formattedData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (params.aiAgentId) {
            fetchAgentData();
        }
    }, [params.aiAgentId]);
    
    // Fungsi ini hanya mengupdate data dasar agent
    const handleUpdateAgent = async (updatedAgentData) => {
        try {
            const payload = {
                name: updatedAgentData.name,
                company: updatedAgentData.company,
                languageStyle: updatedAgentData.languageStyle,
                behavior: updatedAgentData.behavior,
                status: updatedAgentData.status,
            };

            const response = await fetch(`${API_URL}/agents/${updatedAgentData.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Gagal menyimpan perubahan.');
            }
            
            alert('Perubahan berhasil disimpan!');
            navigateTo('aiAgentsList');

        } catch (error) {
            alert(`Terjadi kesalahan: ${error.message}`);
        }
    };

    if (loading) {
        return <div className="text-center p-10">Memuat data agent...</div>;
    }
    if (error) {
        return <div className="text-center p-10 text-red-600">Error: {error}</div>;
    }
    if (!agent) {
        return <div className="text-center p-10">Agent tidak ditemukan.</div>;
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center mb-6">
                <button onClick={() => navigateTo('aiAgentsList')} className="p-2 rounded-full hover:bg-gray-200 mr-4">
                    <ArrowLeft size={24} className="text-gray-700" />
                </button>
                <h2 className="text-3xl font-bold text-gray-800 truncate">
                    Edit AI Agent: <span className="text-indigo-600">{agent.name}</span>
                </h2>
            </div>
            
            <AiAgentForm 
                initialData={agent}
                onSubmit={handleUpdateAgent}
                onCancel={() => navigateTo('aiAgentsList')}
                submitButtonText="Simpan Perubahan"
            />
        </div>
    );
};
