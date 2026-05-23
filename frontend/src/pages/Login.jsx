import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { TextField, Button, Typography, Box, Alert, Paper, Link } from '@mui/material';
import logo from '../assets/logo.png';

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
            navigate('/');
        } catch {
            setError('Credenciales inválidas');
        }
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', width: '100vw', overflow: 'hidden', backgroundColor: '#f8fafc' }}>
            {/* Left: Animated Background */}
            <Box sx={{ flex: { xs: 0, md: 7 }, display: { xs: 'none', md: 'flex' }, position: 'relative', overflow: 'hidden', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at top left, #296374, transparent 25%), radial-gradient(circle at bottom right, #629FAD, transparent 20%), linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #4338ca 100%)' }}>
                <Box sx={{ position: 'absolute', width: 260, height: 260, borderRadius: '50%', backgroundColor: '#0C2C55', filter: 'blur(90px)', top: '10%', left: '12%', animation: 'pulseGlow 14s ease-in-out infinite' }} />
                <Box sx={{ position: 'absolute', width: 220, height: 220, borderRadius: '50%', backgroundColor: '#629FAD', filter: 'blur(78px)', bottom: '10%', right: '8%', animation: 'pulseGlowReverse 16s ease-in-out infinite' }} />
                <Box sx={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(248,250,252,0.18), transparent 18%), radial-gradient(circle at 80% 25%, rgba(255,255,255,0.06), transparent 20%)' }} />
                <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center', px: 6 }}>
                    <Typography variant="h2" sx={{ color: '#f8fafc', fontWeight: 800, fontFamily: 'Outfit', mb: 2, textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>
                        AutoScheduler Pro
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'rgba(248,250,252,0.85)', fontWeight: 300, maxWidth: 500, mx: 'auto' }}>
                        Gestiona horarios y rotaciones de forma inteligente
                    </Typography>
                </Box>
            </Box>

            {/* Right: Form */}
            <Box sx={{ flex: { xs: 12, md: 5 }, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', p: 4, boxShadow: '-10px 0 40px rgba(99,102,241,0.12)', zIndex: 1 }}>
                <Paper elevation={0} className="fade-slide-up" sx={{ p: { xs: 3, sm: 5 }, borderRadius: 4, width: '100%', maxWidth: 420, textAlign: 'center', background: 'rgba(255,255,255,0.96)', border: '1px solid rgba(148,163,184,0.24)' }}>
                    <Box component="img" src={logo} alt="Logo" sx={{ height: 100, mb: 3 }} />
                    <Typography component="h1" variant="h3" sx={{ fontWeight: 800, mb: 1, color: '#1e293b', fontFamily: 'Outfit' }}>
                        ¡Bienvenido!
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 4, color: '#296374', fontSize: '1.05rem' }}>
                        Ingresa a tu cuenta para continuar
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

                    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                        <TextField margin="normal" required fullWidth label="Username" autoFocus
                            value={username} onChange={e => setUsername(e.target.value)}
                            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.6)' } }}
                        />
                        <TextField margin="normal" required fullWidth label="Contraseña" type="password"
                            value={password} onChange={e => setPassword(e.target.value)}
                            sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.6)' } }}
                        />
                        <Button type="submit" fullWidth variant="contained"
                            sx={{ py: 1.6, fontWeight: 700, borderRadius: 3, fontSize: '1.1rem', backgroundColor: '#0C2C55', color: '#f8fafc',  '&:hover': { backgroundColor: '#296374', boxShadow: '0 14px 36px rgba(99,102,241,0.35)' } }}
                        >
                            Ingresar
                        </Button>
                        <Box sx={{ mt: 4 }}>
                            <Link component={RouterLink} to="/register" variant="body1" sx={{ textDecoration: 'none', fontWeight: 600, color: '#629FAD', '&:hover': { color: '#0C2C55' } }}>
                                ¿No tienes cuenta? Regístrate aquí
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
};

export default Login;
