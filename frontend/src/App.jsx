import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Miembros from './pages/Miembros';
import RotacionForm from './pages/RotacionForm';
import RotacionDetail from './pages/RotacionDetail';

const theme = createTheme({
    palette: {
        primary: { main: '#1e3a8a' }, // Deep Blue
        secondary: { main: '#d97706' }, // Amber/Gold
        background: { default: '#f8fafc' },
    },
    typography: {
        fontFamily: '"Outfit", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: { borderRadius: 12 },
    components: {
        MuiPaper: { styleOverrides: { root: { boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' } } },
    }
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
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
        </ThemeProvider>
    );
}

export default App;
