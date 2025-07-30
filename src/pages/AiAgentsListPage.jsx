import React from 'react';
import { PlusCircle, BrainCircuit, ArrowLeft } from 'lucide-react';
import { mockData } from '../data/mockData';

export const AiAgentsListPage = ({ navigateTo }) => (
    <div>
        <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
                <button onClick={() => navigateTo('sender')} className="p-2 rounded-full hover:bg-gray-200 mr-4">
                    <ArrowLeft size={24} className="text-gray-700" />
                </button>
                <h2 className="text-3xl font-bold text-gray-800">AI Agent</h2>
            </div>
            {/* PERBARUAN: Mengarah ke halaman aiAgentCreate */}
            <button onClick={() => navigateTo('aiAgentCreate')} className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition-colors">
                <PlusCircle size={20} className="mr-2" />
                Tambah AI Agent
            </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockData.aiAgents.map(agent => (
                <div key={agent.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start">
                        <BrainCircuit className="text-indigo-500" size={32} />
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${agent.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{agent.status}</span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-800 mt-4">{agent.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">Perusahaan: {agent.company}</p>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        {/* PERBARUAN: Mengarah ke halaman aiAgentEdit dengan membawa ID agent */}
                        <button onClick={() => navigateTo('aiAgentEdit', { aiAgentId: agent.id })} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                            Kelola Agent
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default AiAgentsListPage;