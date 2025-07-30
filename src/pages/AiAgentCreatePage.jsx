import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Switch from '../components/common/Switch';

export const AiAgentCreatePage = ({ navigateTo }) => {
    // State untuk form agent baru
    const [botName, setBotName] = useState('');
    const [company, setCompany] = useState('');
    const [behavior, setBehavior] = useState('');
    const [isAiActive, setIsAiActive] = useState(false);
    const [disableOnManual, setDisableOnManual] = useState(true);
    const [aiCanRead, setAiCanRead] = useState(true);
    const [activeTab, setActiveTab] = useState('behavior');

    return (
        <div className="flex flex-col h-full">
            {/* Header Halaman */}
            <div className="flex items-center mb-6">
                <button onClick={() => navigateTo('aiAgentsList')} className="p-2 rounded-full hover:bg-gray-200 mr-4">
                    <ArrowLeft size={24} className="text-gray-700" />
                </button>
                <h2 className="text-3xl font-bold text-gray-800">Buat AI Agent Baru</h2>
            </div>

            <div className="flex-1 lg:flex gap-6">
                {/* Kolom Editor Utama */}
                <div className="w-full lg:w-2/3 bg-white rounded-xl shadow-md p-6 flex flex-col mb-6 lg:mb-0">
                    {/* Navigasi Tab di Tengah */}
                    <div className="flex justify-center border-b border-gray-200 mb-6">
                        <nav className="-mb-px flex space-x-8">
                            <button onClick={() => setActiveTab('behavior')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'behavior' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                                Bot Behavior
                            </button>
                            <button onClick={() => setActiveTab('knowledge')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'knowledge' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                                Bot Knowledge
                            </button>
                        </nav>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2">
                        {activeTab === 'behavior' && (
                            <form className="space-y-6">
                                <div><label className="block text-sm font-medium text-gray-700">Nama Bot</label><input type="text" value={botName} onChange={e => setBotName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" placeholder="Contoh: Bot Layanan Pelanggan" /></div>
                                <div><label className="block text-sm font-medium text-gray-700">Produk / Perusahaan</label><input type="text" value={company} onChange={e => setCompany(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" placeholder="Contoh: PT Maju Jaya" /></div>
                                <div><label className="block text-sm font-medium text-gray-700">Behavior</label><textarea rows="4" value={behavior} onChange={e => setBehavior(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" placeholder="Jelaskan bagaimana bot harus bersikap..."></textarea></div>
                                <div className="flex items-center justify-between"><span className="text-sm font-medium text-gray-700">Status AI</span><Switch enabled={isAiActive} setEnabled={setIsAiActive} /></div>
                                <div className="flex items-center justify-between"><span className="text-sm font-medium text-gray-700">Matikan AI jika dibalas manual</span><Switch enabled={disableOnManual} setEnabled={setDisableOnManual} /></div>
                                <div className="flex items-center justify-between"><span className="text-sm font-medium text-gray-700">AI baca pesan</span><Switch enabled={aiCanRead} setEnabled={setAiCanRead} /></div>
                            </form>
                        )}
                        {activeTab === 'knowledge' && (
                            <div className="space-y-4">
                                <button className="w-full text-center py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-indigo-500 hover:text-indigo-600">+ Tambah Knowledge Base</button>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex-shrink-0 flex justify-end gap-3">
                        <button onClick={() => navigateTo('aiAgentsList')} className="bg-white py-2 px-4 border border-gray-300 rounded-md">Batal</button>
                        <button className="bg-indigo-600 text-white py-2 px-4 rounded-md">Simpan Agent</button>
                    </div>
                </div>

                {/* Kolom Kanan */}
                <div className="w-full lg:w-1/3">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h4 className="font-bold text-gray-800 mb-4">Sender Terhubung</h4>
                        <p className="text-gray-500 text-sm">Anda dapat menghubungkan agent ini ke salah satu nomor sender setelah agent disimpan.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AiAgentCreatePage;