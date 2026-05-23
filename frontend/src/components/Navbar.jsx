import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { token, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!token) return null;

    const navItems = [
        { label: 'Inicio', path: '/' },
        { label: 'Rotaciones', path: '/rotaciones' },
        { label: 'Miembros', path: '/miembros' },
    ];

    return (
        <AppBar position="static" sx={{ backgorundColor: '#0C2C55' }}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, cursor: 'pointer', fontWeight: 800, fontFamily: 'Outfit', letterSpacing: '-0.5px', color: '#f8fafc' }} onClick={() => navigate('/')}>
                    AutoScheduler Pro
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {navItems.map((item) => (
                        <Button
                            key={item.path}
                            color="inherit"
                            onClick={() => navigate(item.path)}
                            sx={{ fontWeight: location.pathname === item.path ? 800 : 500, borderBottom: location.pathname === item.path ? '2px solid #629FAD' : '2px solid transparent', borderRadius: 0, px: 2 }}
                        >
                            {item.label}
                        </Button>
                    ))}
                    <Button color="inherit" onClick={handleLogout} sx={{ fontWeight: 500, ml: 2, color: '#f8fafc', border: '1px solid rgba(248, 250, 252, 0.3)', borderRadius: 2, px: 2 }}>Salir</Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
