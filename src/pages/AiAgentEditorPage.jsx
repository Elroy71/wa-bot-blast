import React, { useState } from 'react';
import { ArrowLeft, Video, Image as ImageIcon, Paperclip } from 'lucide-react';
import { mockData } from '../data/mockData';
import Switch from '../components/common/Switch';

export const AiAgentEditorPage = ({ navigateTo, params }) => {
    const isCreating = params.isCreating;
    
    const sender = mockData.senders.find(s => s.id === params.senderId);
    const agent = isCreating 
        ? { name: 'Agent Baru', company: '', behavior: '', status: 'Nonaktif', disableOnManualReply: true, canReadMessages: true, knowledgeBases: [] }
        : mockData.aiAgents.find(a => a.id === (sender?.aiAgentId || params.aiAgentId)) || { name: 'Agent Tidak Ditemukan', knowledgeBases: [] };

    const [activeTab, setActiveTab] = useState('behavior');
    const [botName, setBotName] = useState(agent.name);
    const [isAiActive, setIsAiActive] = useState(agent.status === 'Aktif');
    const [disableOnManual, setDisableOnManual] = useState(agent.disableOnManualReply);
    const [aiCanRead, setAiCanRead] = useState(agent.canReadMessages);
    
    // [PERBAIKAN] Tombol kembali sekarang selalu mengarah ke halaman daftar AI Agent
    const backDestination = 'aiAgentsList';

    return (
        <div className="flex flex-col h-full">
            <div className="flex-shrink-0 mb-6">
                <button onClick={() => navigateTo(backDestination)} className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
                    <ArrowLeft size={16} className="mr-2" />
                    {/* [PERBAIKAN] Teks tombol disederhanakan */}
                    Kembali ke Daftar AI Agent
                </button>
            </div>
            <div className="flex-1 lg:flex gap-6">
                {/* Konten Editor (tidak berubah) */}
                <div className="w-full lg:w-2/3 bg-white rounded-xl shadow-md p-6 flex flex-col mb-6 lg:mb-0">
                    <div className="border-b border-gray-200 mb-6">
                        <nav className="-mb-px flex space-x-8">
                            <button onClick={() => setActiveTab('behavior')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'behavior' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                                Bot Behavior
                            </button>
                            <button onClick={() => setActiveTab('knowledge')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'knowledge' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                                Bot Knowledge
                            </button>
                        </nav>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {activeTab === 'behavior' && (
                            <form className="space-y-6">
                                <div><label className="block text-sm font-medium text-gray-700">Nama Bot</label><input type="text" value={botName} onChange={e => setBotName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" /></div>
                                <div><label className="block text-sm font-medium text-gray-700">Produk / Perusahaan</label><input type="text" defaultValue={agent.company} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" /></div>
                                <div><label className="block text-sm font-medium text-gray-700">Behavior</label><textarea rows="4" defaultValue={agent.behavior} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea></div>
                                <div className="flex items-center justify-between"><span className="text-sm font-medium text-gray-700">Status AI</span><Switch enabled={isAiActive} setEnabled={setIsAiActive} /></div>
                                <div className="flex items-center justify-between"><span className="text-sm font-medium text-gray-700">Matikan AI jika dibalas manual</span><Switch enabled={disableOnManual} setEnabled={setDisableOnManual} /></div>
                                <div className="flex items-center justify-between"><span className="text-sm font-medium text-gray-700">AI baca pesan</span><Switch enabled={aiCanRead} setEnabled={setAiCanRead} /></div>
                            </form>
                        )}
                        {activeTab === 'knowledge' && (
                            <div className="space-y-4">
                                {agent.knowledgeBases.map(kb => (
                                    <div key={kb.id} className="border border-gray-200 rounded-lg p-4">
                                        <input type="text" defaultValue={kb.title} placeholder="Judul Knowledge" className="text-md font-bold w-full border-0 p-0 focus:ring-0" />
                                        <textarea rows="3" defaultValue={kb.content} placeholder="Isi dengan teks pengetahuan, FAQ, atau info produk..." className="mt-2 text-sm w-full border-gray-200 rounded-md"></textarea>
                                        <div className="mt-3 flex items-center gap-4 text-gray-500">
                                            <button className="flex items-center gap-1 hover:text-indigo-600"><ImageIcon size={16}/> Foto</button>
                                            <button className="flex items-center gap-1 hover:text-indigo-600"><Video size={16}/> Video</button>
                                            <button className="flex items-center gap-1 hover:text-indigo-600"><Paperclip size={16}/> Link</button>
                                        </div>
                                    </div>
                                ))}
                                <button className="w-full text-center py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-indigo-500 hover:text-indigo-600">+ Tambah Knowledge Base</button>
                            </div>
                        )}
                    </div>
                    <div className="mt-6 flex-shrink-0 flex justify-end gap-3">
                        <button className="bg-white py-2 px-4 border border-gray-300 rounded-md">Batal</button>
                        <button className="bg-indigo-600 text-white py-2 px-4 rounded-md">Simpan Perubahan</button>
                    </div>
                </div>
                <div className="w-full lg:w-1/3">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h4 className="font-bold text-gray-800 mb-4">Sender Terhubung</h4>
                        {sender ? (
                            <div className="flex items-center gap-4">
                                <img src={`https://i.pravatar.cc/150?u=${sender.phone}`} alt="Sender" className="w-16 h-16 rounded-full" />
                                <div>
                                    <p className="font-bold text-lg">{sender.name}</p>
                                    <p className="text-gray-500">{sender.phone}</p>
                                    <span className={`mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${sender.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{sender.status}</span>
                                </div>
                            </div>
                        ) : (<p className="text-gray-500">Agent ini belum terhubung ke sender manapun.</p>)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AiAgentEditorPage;