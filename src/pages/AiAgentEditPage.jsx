import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import AiAgentForm from '../components/AiAgentForm';
import { mockData } from '../data/mockData'; // Untuk fallback jika localStorage kosong

export const AiAgentEditPage = ({ navigateTo, params }) => {
    const [agent, setAgent] = useState(null);

    useEffect(() => {
        let storedAgents = JSON.parse(localStorage.getItem('blastbot_agents'));
        if (!storedAgents) {
            storedAgents = mockData.aiAgents;
            localStorage.setItem('blastbot_agents', JSON.stringify(storedAgents));
        }
        const agentToEdit = storedAgents.find(a => a.id === params.aiAgentId);
        if (agentToEdit) {
            setAgent(agentToEdit);
        }
    }, [params.aiAgentId]);
    
    const handleUpdateAgent = (updatedAgentData) => {
        const storedAgents = JSON.parse(localStorage.getItem('blastbot_agents')) || [];
        const newAgents = storedAgents.map(a => 
            a.id === updatedAgentData.id ? updatedAgentData : a
        );
        localStorage.setItem('blastbot_agents', JSON.stringify(newAgents));
        
        alert('Perubahan berhasil disimpan!');
        navigateTo('aiAgentsList');
    };

    if (!agent) {
        return (
            <div className="text-center p-10">
                <p>Memuat data agent...</p>
            </div>
        );
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
