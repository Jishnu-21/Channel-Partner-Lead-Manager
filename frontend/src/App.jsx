import React from 'react'
import Homepage from './pages/Homepage'
import { Toaster } from 'sonner';
import LoginPage from './pages/LoginPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BackendPanel from './pages/BackendPanel';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import NotFound from './pages/NotFound';
import SalesProfilePage from './pages/SalesProfile';
import OperationalProfilePage from './pages/OperationalPage';


const App = () => {

  return (
    <Router>
      <Toaster/>
      <Routes>   
      <Route path="/" element={<Homepage/>} />
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/sales/profile" element={<SalesProfilePage/>} />
      <Route path="/operational/profile" element={<OperationalProfilePage/>} />
      <Route 
            path="/internal-user" 
            element={
                <BackendPanel />
            } 
          />
      <Route path="*" element={<NotFound/>} /> {/* Catch-all route */}
      </Routes>
    </Router>
  )
}

export default App
