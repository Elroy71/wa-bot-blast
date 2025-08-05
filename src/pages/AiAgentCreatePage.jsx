import React from 'react';
import { ArrowLeft } from 'lucide-react';
import AiAgentForm from '../components/AiAgentForm';

export const AiAgentCreatePage = ({ navigateTo }) => {
    
    const handleAddAgent = (newAgentData) => {
        // Baca data yang ada, tambahkan yang baru, lalu simpan kembali
        const storedAgents = JSON.parse(localStorage.getItem('blastbot_agents')) || [];
        const newAgent = { 
            ...newAgentData, 
            id: `agent_${Date.now()}`,
            // Pastikan knowledgeBases memiliki createdAt jika baru ditambahkan
            knowledgeBases: newAgentData.knowledgeBases.map(kb => ({...kb, createdAt: kb.createdAt || new Date().toISOString().split('T')[0]}))
        };
        const newAgents = [newAgent, ...storedAgents];
        localStorage.setItem('blastbot_agents', JSON.stringify(newAgents));

        alert('Agent baru berhasil dibuat!');
        navigateTo('aiAgentsList');
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
