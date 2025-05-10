import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
<<<<<<< HEAD
import './index.scss'
import App from './App.jsx'
import { AuthContextProvider } from './context/AuthContext.jsx'
import { SocketContextProvider } from './context/SocketContext.jsx'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById('root')).render(
  <AuthContextProvider>
  <StrictMode>
    <SocketContextProvider>
    <ToastContainer position="top-right" autoClose={3000} />
    <App />
    </SocketContextProvider>
  </StrictMode>
  </AuthContextProvider>
=======
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './routes'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { SocketContextProvider } from './context/SocketContext'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <SocketContextProvider>
    <RouterProvider router={router}/>
      </SocketContextProvider>
    </Provider>
  </StrictMode>,
>>>>>>> 22ae305 (5commit)
)
