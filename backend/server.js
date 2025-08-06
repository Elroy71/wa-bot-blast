// Import library yang dibutuhkan
require('dotenv').config();
const express = require('express');
const OpenAI = require('openai');
const cors =require('cors');
const pdf = require('pdf-parse');

// Inisialisasi Express app
const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Inisialisasi client OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Endpoint utama untuk chat
app.post('/api/chat', async (req, res) => {
    try {
        const { userInput, conversationHistory = [], agentState = {} } = req.body;

        if (!userInput || !agentState) {
            return res.status(400).json({ error: 'Request tidak lengkap. userInput dan agentState dibutuhkan.' });
        }

        // --- [LOGIKA BARU] LANGKAH 1: KUMPULKAN SEMUA PENGETAHUAN ---
        let comprehensiveKnowledge = [];

        // 1.1 Tambahkan Bot Behavior sebagai pengetahuan dasar
        if (agentState.behavior) {
            comprehensiveKnowledge.push(`Perilaku Dasar Bot: ${agentState.behavior}`);
        }

        // 1.2 Proses setiap knowledge base
        if (Array.isArray(agentState.knowledgeBases)) {
            // Gunakan Promise.all untuk memproses semua knowledge base secara paralel
            await Promise.all(agentState.knowledgeBases.map(async (kb) => {
                let kbText = `Judul Pengetahuan: ${kb.title || 'Tidak ada judul'}\nKategori: ${kb.category || 'Tidak ada kategori'}\nKonten: ${kb.content || 'Tidak ada konten.'}`;
                
                // Proses file PDF di dalam knowledge base
                if (Array.isArray(kb.files)) {
                    for (const file of kb.files) {
                        if (file.type === 'application/pdf' && file.dataUrl) {
                            try {
                                const base64Data = file.dataUrl.split(';base64,').pop();
                                const buffer = Buffer.from(base64Data, 'base64');
                                const pdfData = await pdf(buffer);
                                kbText += `\n\n--- Isi Dokumen Terlampir (${file.name}) ---\n${pdfData.text}\n--- Akhir Dokumen ---`;
                            } catch (pdfError) {
                                console.error(`Gagal membaca file PDF ${file.name}:`, pdfError);
                                kbText += `\n[System Note: Gagal memproses dokumen terlampir ${file.name}.]`;
                            }
                        }
                    }
                }
                comprehensiveKnowledge.push(kbText);
            }));
        }

        // Gabungkan semua pengetahuan menjadi satu string
        const knowledgeContext = comprehensiveKnowledge.length > 0 
            ? comprehensiveKnowledge.join('\n\n---\n\n') 
            : 'Tidak ada pengetahuan yang tersedia.';

        // --- LANGKAH 2: BUAT PROMPT YANG LEBIH TEGAS ---

        const systemMessage = `
            Anda adalah seorang asisten AI bernama "${agentState.name ?? 'Bot'}". Anda mewakili "${agentState.company ?? 'perusahaan'}".
            Gaya bahasa Anda adalah "${agentState.tone ?? 'netral'}".
            
            PERATURAN PALING PENTING:
            1. Jawablah salam dan sapaan dari user dengan baik, jika dia memujimu maka ucapkan terima kasih.
            2. Bersikaplah seperti kamu adalah seorang pemilik usaha tersebut, jadi jangan mengungkit sesuatu jika anda tidak diberi tau. Melainkan jawablah dengan profesional.
            3. Jawab pertanyaan pengguna HANYA berdasarkan informasi yang ada di dalam "KONTEKS PENGETAHUAN LENGKAP" di bawah.
            4. JANGAN PERNAH menggunakan pengetahuan eksternal atau informasi dari luar konteks yang diberikan kecuali dalam etika dasar dalam manusia.
            5. Jika jawaban tidak dapat ditemukan di dalam konteks, jawab dengan jujur: "Maaf, saya tidak bisa menjawab ."
            6. Jangan mengarang jawaban. Tetap berpegang teguh pada fakta dari konteks.
        `;
        
        const userPrompt = `
--- KONTEKS PENGETAHUAN LENGKAP ---
${knowledgeContext}
------------------------------------

Berdasarkan konteks di atas, jawab pertanyaan berikut: "${userInput}"
        `;

        const messages = [
            { role: 'system', content: systemMessage },
            ...conversationHistory,
            { role: 'user', content: userPrompt }
        ];

        // --- LANGKAH 3: KIRIM KE OPENAI ---
        const chatCompletion = await openai.chat.completions.create({
            messages: messages,
            model: 'gpt-3.5-turbo',
        });

        const botResponse = chatCompletion.choices[0].message.content;

        res.json({ reply: botResponse });

    } catch (error) {
        console.error("Error di endpoint /api/chat:", error);
        res.status(500).json({ error: 'Terjadi kesalahan di server saat memproses permintaan AI.' });
    }
});

const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
