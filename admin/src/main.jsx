import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import AdminContextProvider from './context/AdminContext.jsx'
import DoctorContextProvider from './context/DoctorContext.jsx'
import AppContextProvider from './context/AppContext.jsx'
import StaffContextProvider from './context/StaffContext.jsx'

import { GoogleOAuthProvider } from '@react-oauth/google'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID"}>
      <AdminContextProvider>
        <DoctorContextProvider>
          <AppContextProvider>
            <StaffContextProvider>
              <App />
            </StaffContextProvider>
          </AppContextProvider>
        </DoctorContextProvider>
      </AdminContextProvider>
    </GoogleOAuthProvider>
  </BrowserRouter>,
)
