// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx' // Pastikan ini .jsx
import './index.css'
import PagePlaceholder from './components/common/PagePlaceholder.jsx'
import { AiAgentCreatePage } from './pages/AiAgentCreatePage.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)


// pada codingan saya saat ini saya hanya mempunyai file berikut:
// * src
//   - components
//     - common 
//       -Modal.jsx
//       -PagePlaceholder.jsx
//       - Switch.jsx 
//     -dashboard 
//       - StatCard.jsx 
//     -layout 
//       - Header.jsx 
//       - Sidebar.jsx 
//     -AddContactModal.jsx 
//     - AiAgentForm.jsx 
//     - SearchableContactList.jsx 
//     - constants 
//       - Navigation.jsx 
//     - data 
//       - mockData.jsx 
//     - pages 
//       - AiAgentCreatePage.jsx 
//       -AiAgentEditPage.jsx 
//       - AiAgentsListPage.jsx
//       - BlastDetailPage.jsx 
//       - BlastPage.jsx 
//       - ContactsPage.jsx 
//       - CreateBlastPage.jsx 
//       - CreateGroupPage.jsx 
//       - DashboardPage.jsx 
//       - EditGroupPage.jsx 
//       - GroupsPage.jsx 
//       - SenderPage.jsx 
//     -App.jsx 
//     -index.css 
//     - main.jsx 



// backend/
// ├── src/
// │   ├── config/             # Konfigurasi app (DB, env, logger, dsb)
// │   │   └── db.js
// │
// │   ├── controllers/        # Logika utama untuk masing-masing fitur
// │   │   ├── contactController.js
// │   │   ├── groupController.js
// │   │   ├── blastController.js
// │   │   └── senderController.js
// │
// │   ├── routes/             # Kumpulan endpoint API
// │   │   ├── contactRoutes.js
// │   │   ├── groupRoutes.js
// │   │   ├── blastRoutes.js
// │   │   └── senderRoutes.js
// │
// │   ├── models/             # Struktur data (pakai Mongoose atau Prisma)
// │   │   ├── Contact.js
// │   │   ├── Group.js
// │   │   ├── Blast.js
// │   │   └── Sender.js
// │
// │   ├── middlewares/        # Middleware: autentikasi, validasi, logging
// │   │   ├── authMiddleware.js
// │   │   └── errorHandler.js
// │
// │   ├── services/           # Layer bisnis: pengiriman pesan, AI agent
// │   │   ├── waBlastService.js
// │   │   ├── aiAgentService.js
// │   │   └── contactService.js
// │
// │   ├── utils/              # Fungsi bantu umum (generate ID, dll)
// │   │   └── helper.js
// │
// │   ├── app.js              # Setup express app, middleware, routes
// │   └── server.js           # Start server, koneksi DB, log env
// │
// ├── .env                    # Environment variables
// ├── package.json
// └── README.md
