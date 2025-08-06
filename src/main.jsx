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



