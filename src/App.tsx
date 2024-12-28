import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Truck } from 'lucide-react';
import Navbar from './components/Navbar';
import SitesList from './components/sites/SitesList';
import SiteDetails from './components/sites/SiteDetails';
import AddSiteForm from './components/sites/AddSiteForm';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <SitesList />
                </ProtectedRoute>
              } />
              <Route path="/sites/new" element={
                <ProtectedRoute adminOnly>
                  <AddSiteForm />
                </ProtectedRoute>
              } />
              <Route path="/sites/:id" element={
                <ProtectedRoute>
                  <SiteDetails />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;