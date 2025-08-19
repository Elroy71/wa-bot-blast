// src/pages/AiAgentCreatePage.jsx

import React from 'react';
// [BARU] Impor hook dan komponen dari react-router-dom
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AiAgentForm from '../components/AiAgentForm';

const API_URL = 'http://localhost:3000/api';

// [PERUBAHAN] Hapus prop navigateTo
export const AiAgentCreatePage = () => {
    // [PERBAIKAN] Gunakan useNavigate
    const navigate = useNavigate();
    
    const handleAddAgent = async (newAgentData) => {
        try {
            const payload = {
                name: newAgentData.name,
                company: newAgentData.company,
                languageStyle: newAgentData.languageStyle,
                behavior: newAgentData.behavior,
                status: newAgentData.status,
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
            // [PERBAIKAN] Gunakan navigate untuk pindah halaman
            navigate('/ai-agents');

        } catch (error) {
            alert(`Terjadi kesalahan: ${error.message}`);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center mb-6">
                {/* [PERBAIKAN] Gunakan Link untuk tombol kembali */}
                <Link to="/ai-agents" className="p-2 rounded-full hover:bg-gray-200 mr-4">
                    <ArrowLeft size={24} className="text-gray-700" />
                </Link>
                <h2 className="text-3xl font-bold text-gray-800">Buat AI Agent Baru</h2>
            </div>

            <AiAgentForm 
                onSubmit={handleAddAgent} 
                // [PERBAIKAN] Gunakan navigate untuk aksi batal
                onCancel={() => navigate('/ai-agents')}
                submitButtonText="Simpan Agent"
            />
        </div>
    );
};
