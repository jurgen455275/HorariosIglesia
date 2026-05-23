import React, {
    useState,
    useEffect,
    useContext
} from 'react';

import api from '../api/axiosConfig';

import { useNavigate } from 'react-router-dom';

import {
    Container,
    Typography,
    Button,
    Paper,
    Box,
    Chip,
    Grid
} from '@mui/material';

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GroupIcon from '@mui/icons-material/Group';
import AddTaskIcon from '@mui/icons-material/AddTask';

import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {

    const [rotaciones, setRotaciones] = useState([]);

    const navigate = useNavigate();

    const { user } = useContext(AuthContext);

    // =========================
    // OBTENER ROTACIONES
    // =========================
    const fetchRotaciones = async () => {

        try {

            const res = await api.get('/rotaciones');

            setRotaciones(res.data);

        } catch (error) {

            console.error(error);
        }
    };

    useEffect(() => {
        fetchRotaciones();
    }, []);

    // =========================
    // ELIMINAR
    // =========================
    const handleDelete = async (id) => {

        if (window.confirm('¿Seguro que deseas eliminar?')) {

            try {

                await api.delete(`/rotaciones/${id}`);

                fetchRotaciones();

            } catch (err) {

                alert(
                    'Error al eliminar la rotación: ' +
                    (err.response?.data?.message || err.message)
                );

                console.error(err);
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

            <Container
                maxWidth="xl"
                sx={{
                    pt: 5,
                    pb: 6
                }}
            >

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

                    {/* DECORACIONES */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: -120,
                            right: -120,

                            width: 320,
                            height: 320,

                            borderRadius: '50%',

                            backgroundColor:
                                'rgba(255,255,255,0.04)'
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

                            backgroundColor:
                                'rgba(98,159,173,0.08)'
                        }}
                    />

                    <Grid
                        container
                        spacing={4}
                        alignItems="center"
                        position="relative"
                        zIndex={2}
                    >

                        {/* TEXTO */}
                        <Grid item xs={12} lg={7}>

                            <Typography
                                variant="overline"
                                sx={{
                                    color: '#8FD3E8',
                                    letterSpacing: 2,
                                    fontWeight: 700
                                }}
                            >
                                PANEL PRINCIPAL
                            </Typography>

                            <Typography
                                variant="h2"
                                sx={{
                                    fontWeight: 900,

                                    mt: 1,
                                    mb: 2,

                                    fontSize: {
                                        xs: '2.8rem',
                                        md: '4rem'
                                    },

                                    lineHeight: 1.1
                                }}
                            >
                                Bienvenido
                                {user?.nombre
                                    ? `, ${user.nombre}`
                                    : ''
                                }
                            </Typography>

                            <Typography
                                variant="h6"
                                sx={{
                                    color:
                                        'rgba(255,255,255,0.78)',

                                    maxWidth: 650,

                                    lineHeight: 1.8,

                                    fontWeight: 400,

                                    mb: 4
                                }}
                            >
                                Administra rotaciones, organiza miembros
                                y controla toda la planificación desde
                                un solo lugar.
                            </Typography>

                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 2,
                                    flexWrap: 'wrap'
                                }}
                            >

                                <Button
                                    variant="contained"
                                    onClick={() =>
                                        navigate(
                                            '/rotaciones/nueva'
                                        )
                                    }
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
                                    onClick={() =>
                                        navigate('/rotaciones')
                                    }
                                    sx={{
                                        borderColor:
                                            'rgba(255,255,255,0.25)',

                                        color: '#fff',

                                        px: 4,
                                        py: 1.5,

                                        borderRadius: 4,

                                        fontWeight: 600,

                                        '&:hover': {
                                            borderColor: '#fff',

                                            backgroundColor:
                                                'rgba(255,255,255,0.06)'
                                        }
                                    }}
                                >
                                    Ver Rotaciones
                                </Button>

                            </Box>

                        </Grid>

                        {/* ICONO */}
                        <Grid
                            item
                            xs={12}
                            lg={5}
                            sx={{
                                display: {
                                    xs: 'none',
                                    lg: 'flex'
                                },

                                justifyContent: 'center'
                            }}
                        >

                            <CalendarMonthIcon
                                sx={{
                                    fontSize: 260,
                                    color:
                                        'rgba(255,255,255,0.08)'
                                }}
                            />

                        </Grid>

                    </Grid>

                </Paper>

                {/* CARDS */}
                <Grid
                    container
                    spacing={3}
                    sx={{
                        mb: 5,
                        alignItems: 'stretch'
                    }}
                >

                    {/* ROTACIONES */}
                    <Grid item xs={12} lg={7}>

                        <Paper
                            elevation={0}
                            sx={{
                                p: 4,
                                borderRadius: 6,

                                height: '100%',

                                position: 'relative',

                                overflow: 'hidden',

                                background:
                                    'linear-gradient(135deg, #ffffff 0%, #f8fbfc 100%)',

                                border:
                                    '1px solid #E2E8F0',

                                transition: '0.3s ease',

                                '&:hover': {
                                    transform:
                                        'translateY(-6px)',

                                    boxShadow:
                                        '0 20px 45px rgba(12,44,85,0.08)'
                                }
                            }}
                        >

                            <Box
                                sx={{
                                    position: 'absolute',
                                    right: -60,
                                    bottom: -60,

                                    width: 240,
                                    height: 240,

                                    borderRadius: '50%',

                                    backgroundColor:
                                        '#629FAD10'
                                }}
                            />

                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent:
                                        'space-between',

                                    gap: 3,

                                    position: 'relative',
                                    zIndex: 2,

                                    flexWrap: 'wrap'
                                }}
                            >

                                <Box
                                    sx={{
                                        flex: 1,
                                        minWidth: 260
                                    }}
                                >

                                    <Box
                                        sx={{
                                            width: 72,
                                            height: 72,

                                            borderRadius: 5,

                                            backgroundColor:
                                                '#0C2C5510',

                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',

                                            mb: 3
                                        }}
                                    >
                                        <AddTaskIcon
                                            sx={{
                                                color:
                                                    '#0C2C55',

                                                fontSize: 36
                                            }}
                                        />
                                    </Box>

                                    <Typography
                                        variant="h4"
                                        sx={{
                                            fontWeight: 800,
                                            color: '#0C2C55',
                                            mb: 1.5
                                        }}
                                    >
                                        Gestionar Rotaciones
                                    </Typography>

                                    <Typography
                                        sx={{
                                            color: '#296374',

                                            fontSize: '1.05rem',

                                            lineHeight: 1.8,

                                            mb: 4,

                                            maxWidth: 480
                                        }}
                                    >
                                        Organiza horarios,
                                        administra equipos y
                                        mantén el control completo
                                        de todas las rotaciones.
                                    </Typography>

                                    <Box
                                        sx={{
                                            display: 'flex',
                                            gap: 2,
                                            flexWrap: 'wrap'
                                        }}
                                    >

                                        <Button
                                            variant="contained"
                                            onClick={() =>
                                                navigate(
                                                    '/rotaciones/nueva'
                                                )
                                            }
                                            sx={{
                                                backgroundColor:
                                                    '#0C2C55',

                                                px: 3.5,
                                                py: 1.4,

                                                borderRadius: 3,

                                                fontWeight: 700,

                                                '&:hover': {
                                                    backgroundColor:
                                                        '#296374'
                                                }
                                            }}
                                        >
                                            Crear Rotación
                                        </Button>

                                        <Button
                                            variant="outlined"
                                            onClick={() =>
                                                navigate(
                                                    '/rotaciones'
                                                )
                                            }
                                            sx={{
                                                borderColor:
                                                    '#629FAD',

                                                color: '#296374',

                                                px: 3.5,
                                                py: 1.4,

                                                borderRadius: 3
                                            }}
                                        >
                                            Ver Todas
                                        </Button>

                                    </Box>

                                </Box>

                                {/* ICONO */}
                                <Box
                                    sx={{
                                        display: {
                                            xs: 'none',
                                            md: 'flex'
                                        },

                                        alignItems: 'center',
                                        justifyContent: 'center',

                                        minWidth: 220
                                    }}
                                >
                                    <CalendarMonthIcon
                                        sx={{
                                            fontSize: 180,
                                            color: '#629FAD20'
                                        }}
                                    />
                                </Box>

                            </Box>

                        </Paper>

                    </Grid>

                    {/* MIEMBROS */}
                    <Grid item xs={12} lg={5}>

                        <Paper
                            elevation={0}
                            sx={{
                                p: 4,
                                borderRadius: 6,

                                height: '100%',

                                position: 'relative',

                                overflow: 'hidden',

                                background:
                                    'linear-gradient(135deg, #ffffff 0%, #faf9ff 100%)',

                                border:
                                    '1px solid #ECE8FF',

                                transition: '0.3s ease',

                                '&:hover': {
                                    transform:
                                        'translateY(-6px)',

                                    boxShadow:
                                        '0 20px 45px rgba(108,99,255,0.08)'
                                }
                            }}
                        >

                            <Box
                                sx={{
                                    position: 'absolute',
                                    right: -80,
                                    bottom: -80,

                                    width: 220,
                                    height: 220,

                                    borderRadius: '50%',

                                    backgroundColor:
                                        '#7C6CF010'
                                }}
                            />

                            <Box
                                sx={{
                                    position: 'relative',
                                    zIndex: 2
                                }}
                            >

                                <Box
                                    sx={{
                                        width: 72,
                                        height: 72,

                                        borderRadius: 5,

                                        backgroundColor:
                                            '#7C6CF015',

                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',

                                        mb: 3
                                    }}
                                >
                                    <GroupIcon
                                        sx={{
                                            color: '#6C63FF',
                                            fontSize: 36
                                        }}
                                    />
                                </Box>

                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontWeight: 800,
                                        color: '#0C2C55',
                                        mb: 1.5
                                    }}
                                >
                                    Gestionar Miembros
                                </Typography>

                                <Typography
                                    sx={{
                                        color: '#296374',

                                        fontSize: '1.02rem',

                                        lineHeight: 1.8,

                                        mb: 4
                                    }}
                                >
                                    Consulta miembros,
                                    administra equipos y
                                    mantén organizada toda
                                    la información.
                                </Typography>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 2
                                    }}
                                >

                                    <Button
                                        variant="contained"
                                        onClick={() =>
                                            navigate(
                                                '/miembros'
                                            )
                                        }
                                        sx={{
                                            backgroundColor:
                                                '#6C63FF',

                                            py: 1.4,

                                            borderRadius: 3,

                                            fontWeight: 700,

                                            '&:hover': {
                                                backgroundColor:
                                                    '#5B54E8'
                                            }
                                        }}
                                    >
                                        Ver Miembros
                                    </Button>

                                    <Button
                                        variant="outlined"
                                        onClick={() =>
                                            navigate(
                                                '/miembros'
                                            )
                                        }
                                        sx={{
                                            borderColor:
                                                '#6C63FF40',

                                            color: '#6C63FF',

                                            py: 1.4,

                                            borderRadius: 3,

                                            '&:hover': {
                                                backgroundColor:
                                                    '#6C63FF08',

                                                borderColor:
                                                    '#6C63FF'
                                            }
                                        }}
                                    >
                                        Administrar Equipo
                                    </Button>

                                </Box>

                            </Box>

                        </Paper>

                    </Grid>

                </Grid>

                {/* ========================= */}
                {/* MIS ROTACIONES */}
                {/* ========================= */}

                <Box sx={{ mt: 2 }}>

                    {/* HEADER */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 4,
                            flexWrap: 'wrap',
                            gap: 2
                        }}
                    >

                        <Box>

                            <Typography
                                variant="h4"
                                sx={{
                                    color: '#0C2C55',
                                    fontWeight: 800,
                                    mb: 0.5
                                }}
                            >
                                Mis Rotaciones
                            </Typography>

                            <Typography
                                sx={{
                                    color: '#296374',
                                    fontSize: '1rem'
                                }}
                            >
                                Administra y visualiza tus rotaciones activas
                            </Typography>

                        </Box>

                        <Button
                            variant="contained"
                            onClick={() => navigate('/rotaciones/nueva')}
                            sx={{
                                backgroundColor: '#0C2C55',
                                borderRadius: 3,
                                px: 3,
                                py: 1.3,
                                fontWeight: 700,

                                '&:hover': {
                                    backgroundColor: '#296374'
                                }
                            }}
                        >
                            + Nueva Rotación
                        </Button>

                    </Box>

                    {/* SIN ROTACIONES */}
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

                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 3
                            }}
                        >

                            {rotaciones.map((rot) => (

                                <Paper
                                    key={rot.id}
                                    elevation={0}
                                    sx={{
                                        borderRadius: 6,
                                        overflow: 'hidden',
                                        border: '1px solid #E2E8F0',
                                        transition: '0.3s ease',
                                        backgroundColor: '#fff',

                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 20px 40px rgba(12,44,85,0.08)'
                                        }
                                    }}
                                >

                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: {
                                                xs: 'column',
                                                md: 'row'
                                            }
                                        }}
                                    >

                                        {/* IZQUIERDA */}
                                        <Box
                                            sx={{
                                                flex: 1,
                                                p: 4,
                                                position: 'relative',
                                                overflow: 'hidden'
                                            }}
                                        >

                                            {/* DECORACIÓN */}
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: -40,
                                                    right: -40,
                                                    width: 140,
                                                    height: 140,
                                                    borderRadius: '50%',
                                                    backgroundColor: '#629FAD10'
                                                }}
                                            />

                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 3,
                                                    position: 'relative',
                                                    zIndex: 2
                                                }}
                                            >

                                                {/* ICONO */}
                                                <Box
                                                    sx={{
                                                        width: 80,
                                                        height: 80,
                                                        borderRadius: 5,

                                                        background:
                                                            'linear-gradient(135deg, #0C2C55 0%, #296374 100%)',

                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',

                                                        boxShadow:
                                                            '0 10px 25px rgba(12,44,85,0.20)'
                                                    }}
                                                >

                                                    <CalendarMonthIcon
                                                        sx={{
                                                            color: '#fff',
                                                            fontSize: 40
                                                        }}
                                                    />

                                                </Box>

                                                {/* INFO */}
                                                <Box>

                                                    <Typography
                                                        variant="h5"
                                                        sx={{
                                                            color: '#0C2C55',
                                                            fontWeight: 800,
                                                            mb: 1
                                                        }}
                                                    >
                                                        {rot.nombre}
                                                    </Typography>

                                                    <Chip
                                                        label={`${rot.fechaInicio} → ${rot.fechaFin}`}
                                                        sx={{
                                                            backgroundColor: '#629FAD15',
                                                            color: '#296374',
                                                            fontWeight: 700,
                                                            mb: 2
                                                        }}
                                                    />

                                                    <Typography
                                                        sx={{
                                                            color: '#296374',
                                                            maxWidth: 500,
                                                            lineHeight: 1.7
                                                        }}
                                                    >
                                                        Gestiona horarios, miembros y toda la
                                                        organización de esta rotación.
                                                    </Typography>

                                                </Box>

                                            </Box>

                                        </Box>

                                        {/* DERECHA */}
                                        <Box
                                            sx={{
                                                width: {
                                                    xs: '100%',
                                                    md: 260
                                                },

                                                backgroundColor: '#F8FBFC',

                                                borderLeft: {
                                                    xs: 'none',
                                                    md: '1px solid #E2E8F0'
                                                },

                                                borderTop: {
                                                    xs: '1px solid #E2E8F0',
                                                    md: 'none'
                                                },

                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',

                                                p: 4,
                                                gap: 2
                                            }}
                                        >

                                            <Button
                                                fullWidth
                                                variant="contained"
                                                onClick={() =>
                                                    navigate(`/rotaciones/${rot.id}`)
                                                }
                                                sx={{
                                                    backgroundColor: '#0C2C55',

                                                    borderRadius: 3,

                                                    py: 1.4,

                                                    fontWeight: 700,

                                                    '&:hover': {
                                                        backgroundColor: '#296374'
                                                    }
                                                }}
                                            >
                                                Gestionar
                                            </Button>

                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                onClick={() =>
                                                    navigate(`/rotaciones/${rot.id}`)
                                                }
                                                sx={{
                                                    borderColor: '#629FAD',
                                                    color: '#296374',

                                                    borderRadius: 3,

                                                    py: 1.4,

                                                    fontWeight: 700
                                                }}
                                            >
                                                Ver Detalles
                                            </Button>

                                            <Button
                                                fullWidth
                                                variant="text"
                                                color="error"
                                                onClick={() => handleDelete(rot.id)}
                                                sx={{
                                                    borderRadius: 3,
                                                    py: 1.2,
                                                    fontWeight: 700
                                                }}
                                            >
                                                Eliminar
                                            </Button>

                                        </Box>

                                    </Box>

                                </Paper>

                            ))}

                        </Box>

                    )}

                </Box>

            </Container>

        </Box>
    );
};

export default Dashboard;