import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {RouterProvider} from "react-router";
import { router } from './Router/Router.jsx';
import AOS from 'aos';
import 'aos/dist/aos.css'; // You can also use <link> for styles
import AuthProvider from './Contexts/AuthContext/AuthProvider.jsx';
import { ToastContainer } from 'react-toastify';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
AOS.init();
// Create a client
const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className='font-urbanist max-w-7xl mx-auto'>
        <QueryClientProvider client={queryClient}>
             <AuthProvider>
                <RouterProvider router={router} />
                <ToastContainer position="top-center" />
              </AuthProvider>
        </QueryClientProvider>
   
    </div>
  </StrictMode>,
)
