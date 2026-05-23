import React, { useState } from 'react';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

import {
    Container,
    TextField,
    Button,
    Typography,
    Paper,
    Box,
    Grid,
} from '@mui/material';

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const RotacionForm = () => {

    const [nombre, setNombre] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/rotaciones', { nombre, fechaInicio, fechaFin });
            navigate(`/rotaciones/${res.data.id}`);
        } catch (err) {
            alert('Error al crear. Verifica tus datos.');
        }
    };

    return (
        <Box
            sx={{
                minHeight: 'calc(100vh - 64px)',
                backgroundColor: '#f8fafc'
            }}
        >
            <Container maxWidth="xl" sx={{ pt: 5, pb: 6 }}>

                {/* HERO */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        mb: 5,
                        borderRadius: 6,
                        background:
                            'linear-gradient(135deg, #071B3B 0%, #0C2C55 60%, #133C72 100%)',
                        color: '#fff',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >

                    <Box
                        sx={{
                            position: 'absolute',
                            top: -100,
                            right: -100,
                            width: 260,
                            height: 260,
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255,255,255,0.04)'
                        }}
                    />

                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: -100,
                            left: -100,
                            width: 200,
                            height: 200,
                            borderRadius: '50%',
                            backgroundColor: 'rgba(98,159,173,0.08)'
                        }}
                    />

                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        flexWrap="wrap"
                        gap={2}
                        position="relative"
                        zIndex={2}
                    >

                        <Box>

                            <Typography
                                variant="overline"
                                sx={{
                                    color: '#8FD3E8',
                                    letterSpacing: 2,
                                    fontWeight: 700
                                }}
                            >
                                NUEVA ROTACIÓN
                            </Typography>

                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 900,
                                    mt: 1,
                                    mb: 1,
                                    lineHeight: 1.1
                                }}
                            >
                                Configurar Nueva Rotación
                            </Typography>

                            <Typography
                                sx={{
                                    color: 'rgba(255,255,255,0.78)',
                                    maxWidth: 600,
                                    lineHeight: 1.8,
                                    fontWeight: 400,
                                }}
                            >
                                Define el nombre y período de la rotación para comenzar a organizar horarios.
                            </Typography>

                        </Box>

                        <Box
                            sx={{
                                display: { xs: 'none', lg: 'flex' },
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <CalendarMonthIcon
                                sx={{
                                    fontSize: 180,
                                    color: 'rgba(255,255,255,0.08)'
                                }}
                            />
                        </Box>

                    </Box>

                </Paper>

                {/* FORM */}
                <Grid container justifyContent="center">
                    <Grid item xs={12} md={8} lg={5}>

                        <Paper
                            elevation={0}
                            sx={{
                                p: 5,
                                borderRadius: 6,
                                background:
                                    'linear-gradient(135deg, #ffffff 0%, #f8fbfc 100%)',
                                border: '1px solid #E2E8F0',
                                transition: '0.3s ease',
                                '&:hover': {
                                    boxShadow: '0 20px 45px rgba(12,44,85,0.08)'
                                }
                            }}
                        >

                            <Box textAlign="center" mb={4}>

                                <Box
                                    sx={{
                                        width: 72,
                                        height: 72,
                                        borderRadius: 5,
                                        backgroundColor: '#0C2C5510',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mx: 'auto',
                                        mb: 3
                                    }}
                                >
                                    <CalendarMonthIcon
                                        sx={{
                                            fontSize: 36,
                                            color: '#0C2C55'
                                        }}
                                    />
                                </Box>

                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontWeight: 800,
                                        color: '#0C2C55',
                                    }}
                                >
                                    Nueva Rotación
                                </Typography>

                                <Typography
                                    sx={{
                                        color: '#296374',
                                        mt: 1,
                                        fontSize: '.95rem'
                                    }}
                                >
                                    Completa los campos para crear una nueva rotación
                                </Typography>

                            </Box>

                            <Box component="form" onSubmit={handleSubmit}>

                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Nombre (ej: Mayo 2026)"
                                    required
                                    value={nombre}
                                    onChange={e => setNombre(e.target.value)}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 3,
                                            backgroundColor: '#fff',
                                        }
                                    }}
                                />

                                <Typography
                                    sx={{
                                        color: '#0C2C55',
                                        mt: 3,
                                        mb: 1,
                                        fontWeight: 700,
                                        fontSize: '.9rem'
                                    }}
                                >
                                    Fecha Inicio *
                                </Typography>

                                <TextField
                                    fullWidth
                                    type="date"
                                    required
                                    value={fechaInicio}
                                    onChange={e => setFechaInicio(e.target.value)}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 3,
                                            backgroundColor: '#fff',
                                        }
                                    }}
                                />

                                <Typography
                                    sx={{
                                        color: '#0C2C55',
                                        mt: 3,
                                        mb: 1,
                                        fontWeight: 700,
                                        fontSize: '.9rem'
                                    }}
                                >
                                    Fecha Fin *
                                </Typography>

                                <TextField
                                    fullWidth
                                    type="date"
                                    required
                                    value={fechaFin}
                                    onChange={e => setFechaFin(e.target.value)}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 3,
                                            backgroundColor: '#fff',
                                        }
                                    }}
                                />

                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    sx={{
                                        mt: 4,
                                        py: 1.6,
                                        backgroundColor: '#0C2C55',
                                        color: '#fff',
                                        fontWeight: 700,
                                        borderRadius: 3,
                                        fontSize: '1rem',
                                        '&:hover': {
                                            backgroundColor: '#296374'
                                        }
                                    }}
                                >
                                    Siguiente: Configurar
                                </Button>

                            </Box>

                        </Paper>

                    </Grid>
                </Grid>

            </Container>
        </Box>
    );
};

export default RotacionForm;
