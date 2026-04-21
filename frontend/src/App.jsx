import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Miembros from './pages/Miembros';
import RotacionForm from './pages/RotacionForm';
import RotacionDetail from './pages/RotacionDetail';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/miembros" element={<ProtectedRoute><Miembros /></ProtectedRoute>} />
                    <Route path="/rotaciones/nueva" element={<ProtectedRoute><RotacionForm /></ProtectedRoute>} />
                    <Route path="/rotaciones/:id" element={<ProtectedRoute><RotacionDetail /></ProtectedRoute>} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
