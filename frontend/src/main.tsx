import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' 
import { AuthProvider} from './AuthContext.tsx'
import Login from './componen/LoginPage.tsx'
import Register from './componen/Register.tsx'
import App from './App.tsx'
import './index.css'
// import App from './App.tsx'

createRoot(document.getElementById('root')!).render(

<StrictMode>
  <BrowserRouter>
    <AuthProvider>
    
      <App />
    
    </AuthProvider>
  </BrowserRouter>
</StrictMode>
)