import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { token, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!token) return null;

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, cursor: 'pointer', fontWeight: 'bold' }} onClick={() => navigate('/')}>
                    AutoScheduler Pro
                </Typography>
                <Box>
                    <Button color="inherit" onClick={() => navigate('/miembros')}>Miembros</Button>
                    <Button color="inherit" onClick={() => navigate('/')}>Rotaciones</Button>
                    <Button color="inherit" onClick={handleLogout}>Salir</Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
