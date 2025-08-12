import React, { useState, useEffect, useCallback } from 'react';
import { PlusCircle, BrainCircuit, ArrowLeft, MoreVertical, Edit, Link as LinkIcon, Trash2, XCircle } from 'lucide-react';
import Modal from '../components/common/Modal';

const API_URL = 'http://localhost:3000/api';

export const AiAgentsListPage = ({ navigateTo }) => {
    const [agents, setAgents] = useState([]);
    const [senders, setSenders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [openMenuId, setOpenMenuId] = useState(null);
    const [agentToConnect, setAgentToConnect] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const [agentsRes, sendersRes] = await Promise.all([
                fetch(`${API_URL}/agents`),
                fetch(`${API_URL}/senders`)
            ]);

            if (!agentsRes.ok || !sendersRes.ok) {
                throw new Error('Gagal memuat data dari server.');
            }

            const agentsData = await agentsRes.json();
            const sendersData = await sendersRes.json();

            setAgents(agentsData);
            setSenders(sendersData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDeleteAgent = async (agentIdToDelete) => {
        const agent = agents.find(a => a.id === agentIdToDelete);
        // --- [PERBAIKAN 3] Cek apakah agent terhubung sebelum menghapus ---
        if (agent && agent.connectedSender) {
            alert('Agent ini tidak dapat dihapus karena masih terhubung dengan sebuah sender. Putuskan koneksi terlebih dahulu.');
            return;
        }

        if (window.confirm("Apakah Anda yakin ingin menghapus agent ini? Semua data terkait akan hilang.")) {
            try {
                const response = await fetch(`${API_URL}/agents/${agentIdToDelete}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error('Gagal menghapus agent.');
                }
                fetchData();
                alert('Agent berhasil dihapus.');
            } catch (err) {
                alert(err.message);
            }
        }
    };
    
    const handleDisconnectAgent = async (agentIdToDisconnect) => {
        if (window.confirm("Anda yakin ingin memutuskan koneksi device?")) {
            try {
                const response = await fetch(`${API_URL}/agents/${agentIdToDisconnect}/disconnect`, {
                    method: 'POST',
                });
                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.error || 'Gagal memutuskan koneksi.');
                }
                fetchData();
                alert('Koneksi berhasil diputuskan.');
            } catch (err) {
                alert(err.message);
            }
        }
    };

    const handleActionClick = (action, agentId) => {
        setOpenMenuId(null); 
        if (action === 'edit') {
            navigateTo('aiAgentEdit', { aiAgentId: agentId });
        } else if (action === 'delete') {
            handleDeleteAgent(agentId);
        } else if (action === 'disconnect') {
            handleDisconnectAgent(agentId);
        }
    };
    
    const handleConnectAgent = async (agentId, senderId) => {
        if (!senderId) {
            alert("Silakan pilih sender terlebih dahulu.");
            return;
        }
        try {
            const response = await fetch(`${API_URL}/agents/${agentId}/connect`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ senderId: parseInt(senderId) }),
            });
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Gagal menghubungkan agent.');
            }
            fetchData();
            setAgentToConnect(null);
            alert('Agent berhasil terhubung ke sender!');
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) return <div className="text-center p-10">Memuat data AI Agents...</div>;
    if (error) return <div className="text-center p-10 text-red-600">Error: {error}</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <button onClick={() => navigateTo('sender')} className="p-2 rounded-full hover:bg-gray-200 mr-4">
                        <ArrowLeft size={24} className="text-gray-700" />
                    </button>
                    <h2 className="text-3xl font-bold text-gray-800">AI Agent</h2>
                </div>
                <button onClick={() => navigateTo('aiAgentCreate')} className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition-colors">
                    <PlusCircle size={20} className="mr-2" />
                    Tambah AI Agent
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agents.map(agent => (
                    <div key={agent.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start">
                                <BrainCircuit className="text-indigo-500" size={32} />
                                <div className="relative">
                                    <button onClick={() => setOpenMenuId(openMenuId === agent.id ? null : agent.id)} className="p-2 rounded-full hover:bg-gray-200">
                                        <MoreVertical size={20} />
                                    </button>
                                    {openMenuId === agent.id && (
                                        <div className="absolute right-0 mt-2 w-52 bg-white rounded-md shadow-lg z-10 border">
                                            <a href="#" onClick={(e) => { e.preventDefault(); handleActionClick('edit', agent.id) }} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                <Edit size={16} className="mr-3" /> Edit / Kelola
                                            </a>
                                            {agent.connectedSender && (
                                              <a href="#" onClick={(e) => { e.preventDefault(); handleActionClick('disconnect', agent.id) }} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                  <XCircle size={16} className="mr-3" /> Putuskan Koneksi
                                              </a>
                                            )}
                                            {/* --- [PERBAIKAN 3] Tombol Hapus dinonaktifkan jika terhubung --- */}
                                            <button 
                                                onClick={() => handleActionClick('delete', agent.id)} 
                                                disabled={!!agent.connectedSender}
                                                className={`w-full flex items-center px-4 py-2 text-sm text-left ${!!agent.connectedSender ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:bg-gray-100'}`}
                                            >
                                                <Trash2 size={16} className="mr-3" /> 
                                                Hapus
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <h4 className="text-lg font-bold text-gray-800 mt-4">{agent.name}</h4>
                            <p className="text-sm text-gray-500 mt-1">Perusahaan: {agent.company || '-'}</p>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-200">
                            {agent.connectedSender ? (
                                <div className="flex items-center gap-2">
                                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">Terhubung</span>
                                    <p className="text-sm text-gray-600 font-medium">{agent.connectedSender.name}</p>
                                </div>
                            ) : (
                                <button onClick={() => setAgentToConnect(agent)} className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800">
                                    <LinkIcon size={16}/>
                                    Hubungkan ke Sender
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                {agents.length === 0 && (
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-16 bg-white rounded-xl shadow-md">
                        <p className="text-gray-500">Belum ada AI Agent.</p>
                        <p className="text-gray-400 text-sm mt-2">Klik "Tambah AI Agent" untuk membuat yang baru.</p>
                    </div>
                )}
            </div>

            <Modal isOpen={!!agentToConnect} onClose={() => setAgentToConnect(null)} title="Hubungkan AI Agent ke WhatsApp">
                {agentToConnect && (
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const senderId = e.target.elements.sender.value;
                        handleConnectAgent(agentToConnect.id, senderId);
                    }}>
                        <p className="text-sm text-gray-600 mb-4">
                            Pilih WhatsApp sender yang ingin Anda hubungkan dengan AI agent <strong className="text-gray-800">{agentToConnect.name}</strong>.
                        </p>
                        
                        <label htmlFor="sender" className="block text-sm font-medium text-gray-700">WhatsApp Sender</label>
                        <select
                            id="sender"
                            name="sender"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                            <option value="">-- Pilih Sender --</option>
                            {/* --- [PERBAIKAN 2] Filter sender yang belum terhubung ke agent MANAPUN --- */}
                            {senders.filter(sender => !agents.some(agent => agent.senderId === sender.id)).map(sender => (
                                <option key={sender.id} value={sender.id}>
                                    {sender.name} ({sender.phone})
                                </option>
                            ))}
                        </select>

                        <div className="mt-6 flex justify-end gap-3">
                            <button type="button" onClick={() => setAgentToConnect(null)} className="bg-white py-2 px-4 border border-gray-300 rounded-md text-sm font-medium">Batal</button>
                            <button type="submit" className="bg-indigo-600 text-white py-2 px-4 rounded-md text-sm font-medium">Hubungkan</button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
};
