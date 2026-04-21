import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Alert, Paper } from '@mui/material';

const Register = () => {
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(username, password);
            navigate('/');
        } catch (err) {
            setError('Error al registrar usuario (quizás ya existe)');
        }
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 8 }}>
            <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 2 }}>
                <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold' }}>Crear Cuenta</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Registra un nuevo usuario</Typography>

                {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
                
                <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                    <TextField margin="normal" required fullWidth label="Username" autoFocus
                        value={username} onChange={e => setUsername(e.target.value)} />
                    <TextField margin="normal" required fullWidth label="Contraseña" type="password"
                        value={password} onChange={e => setPassword(e.target.value)} />
                    <Button type="submit" fullWidth variant="contained" color="secondary" sx={{ mt: 3, mb: 2, height: 48, fontWeight: 'bold' }}>
                        Registrarse
                    </Button>
                    <Box textAlign="center">
                        <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2' }}>
                            {"¿Ya tienes cuenta? Inicia sesión"}
                        </Link>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default Register;
