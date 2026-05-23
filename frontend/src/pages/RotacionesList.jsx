import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

import {
    Container,
    Typography,
    Button,
    Paper,
    Grid,
    Box,
    IconButton,
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const RotacionesList = () => {

    const [rotaciones, setRotaciones] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRotaciones();
    }, []);

    const fetchRotaciones = async () => {
        try {
            const res = await api.get('/rotaciones');
            setRotaciones(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Seguro que deseas eliminar esta rotación?')) {
            try {
                await api.delete(`/rotaciones/${id}`);
                fetchRotaciones();
            } catch (err) {
                alert("Error al eliminar: " + (err.response?.data?.message || err.message));
            }
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
                        p: { xs: 4, md: 6 },
                        mb: 5,
                        borderRadius: 7,
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
                            top: -120,
                            right: -120,
                            width: 320,
                            height: 320,
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255,255,255,0.04)'
                        }}
                    />

                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: -140,
                            left: -140,
                            width: 280,
                            height: 280,
                            borderRadius: '50%',
                            backgroundColor: 'rgba(98,159,173,0.08)'
                        }}
                    />

                    <Grid
                        container
                        spacing={4}
                        alignItems="center"
                        position="relative"
                        zIndex={2}
                    >

                        <Grid item xs={12} lg={7}>

                            <Typography
                                variant="overline"
                                sx={{
                                    color: '#8FD3E8',
                                    letterSpacing: 2,
                                    fontWeight: 700
                                }}
                            >
                                ROTACIONES
                            </Typography>

                            <Typography
                                variant="h2"
                                sx={{
                                    fontWeight: 900,
                                    mt: 1,
                                    mb: 2,
                                    fontSize: { xs: '2.8rem', md: '4rem' },
                                    lineHeight: 1.1
                                }}
                            >
                                Mis Rotaciones
                            </Typography>

                            <Typography
                                variant="h6"
                                sx={{
                                    color: 'rgba(255,255,255,0.78)',
                                    maxWidth: 650,
                                    lineHeight: 1.8,
                                    fontWeight: 400,
                                    mb: 4
                                }}
                            >
                                Administra y visualiza todas tus rotaciones,
                                organiza horarios y gestiona equipos desde un solo lugar.
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>

                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={() => navigate('/rotaciones/nueva')}
                                    sx={{
                                        backgroundColor: '#629FAD',
                                        color: '#fff',
                                        px: 4,
                                        py: 1.5,
                                        borderRadius: 4,
                                        fontWeight: 700,
                                        '&:hover': {
                                            backgroundColor: '#296374'
                                        }
                                    }}
                                >
                                    Crear Rotación
                                </Button>

                                <Button
                                    variant="outlined"
                                    onClick={() => navigate('/')}
                                    sx={{
                                        borderColor: 'rgba(255,255,255,0.25)',
                                        color: '#fff',
                                        px: 4,
                                        py: 1.5,
                                        borderRadius: 4,
                                        fontWeight: 600,
                                        '&:hover': {
                                            borderColor: '#fff',
                                            backgroundColor: 'rgba(255,255,255,0.06)'
                                        }
                                    }}
                                >
                                    Volver al Inicio
                                </Button>

                            </Box>

                        </Grid>

                        <Grid
                            item
                            xs={12}
                            lg={5}
                            sx={{
                                display: { xs: 'none', lg: 'flex' },
                                justifyContent: 'center'
                            }}
                        >
                            <CalendarMonthIcon
                                sx={{
                                    fontSize: 260,
                                    color: 'rgba(255,255,255,0.08)'
                                }}
                            />
                        </Grid>

                    </Grid>

                </Paper>

                {/* LISTA */}
                {rotaciones.length === 0 ? (

                    <Paper
                        elevation={0}
                        sx={{
                            p: 6,
                            borderRadius: 6,
                            textAlign: 'center',
                            border: '1px solid #E2E8F0',
                            backgroundColor: '#fff'
                        }}
                    >

                        <CalendarMonthIcon
                            sx={{
                                fontSize: 80,
                                color: '#629FAD40',
                                mb: 2
                            }}
                        />

                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 800,
                                color: '#0C2C55',
                                mb: 1
                            }}
                        >
                            Aún no tienes rotaciones
                        </Typography>

                        <Typography
                            sx={{
                                color: '#296374',
                                mb: 4
                            }}
                        >
                            Crea tu primera rotación para comenzar a organizar horarios.
                        </Typography>

                        <Button
                            variant="contained"
                            onClick={() => navigate('/rotaciones/nueva')}
                            sx={{
                                backgroundColor: '#0C2C55',
                                borderRadius: 3,
                                px: 4,
                                py: 1.4,
                                fontWeight: 700,
                                '&:hover': {
                                    backgroundColor: '#296374'
                                }
                            }}
                        >
                            Crear Rotación
                        </Button>

                    </Paper>

                ) : (

                    <Grid container spacing={3}>

                        {rotaciones.map((rot) => (

                            <Grid item xs={12} sm={6} lg={4} key={rot.id}>

                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 4,
                                        borderRadius: 6,
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        background:
                                            'linear-gradient(135deg, #ffffff 0%, #f8fbfc 100%)',
                                        border: '1px solid #E2E8F0',
                                        transition: '0.3s ease',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            transform: 'translateY(-6px)',
                                            boxShadow: '0 20px 45px rgba(12,44,85,0.08)'
                                        }
                                    }}
                                    onClick={() => navigate(`/rotaciones/${rot.id}`)}
                                >

                                    <Box
                                        sx={{
                                            width: 56,
                                            height: 56,
                                            borderRadius: 4,
                                            backgroundColor: '#0C2C5510',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mb: 3
                                        }}
                                    >
                                        <CalendarMonthIcon
                                            sx={{
                                                color: '#0C2C55',
                                                fontSize: 28
                                            }}
                                        />
                                    </Box>

                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 800,
                                            color: '#0C2C55',
                                            mb: 2
                                        }}
                                    >
                                        {rot.nombre}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            color: '#296374',
                                            fontSize: '.9rem',
                                            mb: 3,
                                            flex: 1
                                        }}
                                    >
                                        {rot.fechaInicio} → {rot.fechaFin}
                                    </Typography>

                                    <Box
                                        sx={{
                                            display: 'flex',
                                            gap: 1,
                                            justifyContent: 'flex-end',
                                            pt: 2,
                                            borderTop: '1px solid #E2E8F0'
                                        }}
                                    >
                                        <IconButton
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/rotaciones/${rot.id}`);
                                            }}
                                            sx={{ color: '#629FAD' }}
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>

                                        <IconButton
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(rot.id);
                                            }}
                                            sx={{ color: '#EF4444' }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>

                                </Paper>

                            </Grid>

                        ))}

                    </Grid>

                )}

            </Container>
        </Box>
    );
};

export default RotacionesList;
