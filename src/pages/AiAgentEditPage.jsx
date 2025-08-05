import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import AiAgentForm from '../components/AiAgentForm';

export const AiAgentEditPage = ({ navigateTo, params }) => {
    const [agent, setAgent] = useState(null);

    // Memuat data agent yang spesifik dari localStorage
    useEffect(() => {
        const storedAgents = JSON.parse(localStorage.getItem('blastbot_agents')) || [];
        const agentToEdit = storedAgents.find(a => a.id === params.aiAgentId);
        if (agentToEdit) {
            setAgent(agentToEdit);
        }
    }, [params.aiAgentId]);
    
    const handleUpdateAgent = (updatedAgentData) => {
        // Baca semua agent, perbarui yang satu ini, lalu simpan kembali
        const storedAgents = JSON.parse(localStorage.getItem('blastbot_agents')) || [];
        const newAgents = storedAgents.map(a => 
            a.id === updatedAgentData.id ? updatedAgentData : a
        );
        localStorage.setItem('blastbot_agents', JSON.stringify(newAgents));
        
        alert('Perubahan berhasil disimpan!');
        navigateTo('aiAgentsList');
    };

    // Tampilkan loading atau pesan jika data belum siap
    if (!agent) {
        return <div>Loading agent data...</div>;
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
