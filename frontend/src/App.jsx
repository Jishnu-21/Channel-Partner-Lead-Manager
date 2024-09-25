import React from 'react'
import Homepage from './pages/Homepage'
import { Toaster } from 'sonner';
import LoginPage from './pages/LoginPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BackendPanel from './pages/BackendPanel';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import NotFound from './pages/NotFound';


const App = () => {

  return (
    <Router>
      <Toaster/>
      <Routes>   
      <Route path="/" element={<Homepage/>} />
      <Route 
            path="/internal-user" 
            element={
              <ProtectedRoute requiredType="internalUser">
                <BackendPanel />
              </ProtectedRoute>
            } 
          />
      <Route path="*" element={<NotFound/>} /> {/* Catch-all route */}
      </Routes>
    </Router>
  )
}

export default App
