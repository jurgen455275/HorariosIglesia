import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import {
    Container,
    Typography,
    Button,
    Paper,
    IconButton,
    Box,
    TextField,
    Checkbox,
    FormControlLabel,
    Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupIcon from '@mui/icons-material/Group';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const Miembros = () => {
    const [miembros, setMiembros] = useState([]);
    const [nombre, setNombre] = useState('');
    const [esPrincipal, setEsPrincipal] = useState(false);

    const fetchMiembros = async () => {
        try {
            const res = await api.get('/miembros');
            setMiembros(res.data);
        } catch (e) {
            console.error('Error fetching miembros', e);
        }
    };

    useEffect(() => {
        fetchMiembros();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/miembros', { nombre, esPrincipal });
            setNombre('');
            setEsPrincipal(false);
            await fetchMiembros();
        } catch (error) {
            console.error('Error creando miembro:', error);
            alert('No se pudo agregar el miembro.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Deseas eliminar este miembro?')) {
            try {
                await api.delete(`/miembros/${id}`);
                await fetchMiembros();
            } catch (e) {
                alert('No se pudo eliminar.');
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
                                MIEMBROS
                            </Typography>

                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 900,
                                    mt: 1,
                                    mb: 1,
                                    lineHeight: 1.1,
                                    color: '#fff'
                                }}
                            >
                                Miembros del Equipo
                            </Typography>

                            <Typography
                                sx={{
                                    color: 'rgba(255,255,255,0.78)',
                                    maxWidth: 600,
                                    lineHeight: 1.8,
                                    fontWeight: 400,
                                }}
                            >
                                Administra los miembros de tu equipo y
                                organiza quiénes participan en las rotaciones.
                            </Typography>

                        </Box>

                        <Box
                            sx={{
                                display: { xs: 'none', lg: 'flex' },
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <GroupIcon
                                sx={{
                                    fontSize: 180,
                                    color: 'rgba(255,255,255,0.08)'
                                }}
                            />
                        </Box>

                    </Box>

                </Paper>

                {/* ADD FORM */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        mb: 4,
                        borderRadius: 6,
                        background:
                            'linear-gradient(135deg, #ffffff 0%, #f8fbfc 100%)',
                        border: '1px solid #E2E8F0',
                    }}
                >
                    <Box
                        component="form"
                        onSubmit={handleCreate}
                        sx={{
                            display: 'flex',
                            gap: 2,
                            alignItems: 'center',
                            flexWrap: 'wrap'
                        }}
                    >
                        <PersonAddIcon sx={{ color: '#296374' }} />

                        <TextField
                            size="small"
                            label="Nombre / Pseudónimo"
                            value={nombre}
                            onChange={e => setNombre(e.target.value)}
                            required
                            sx={{
                                flex: 1,
                                minWidth: 200,
                                '& .MuiOutlinedInput-root': { borderRadius: 3, backgroundColor: '#fff' }
                            }}
                        />

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={esPrincipal}
                                    onChange={e => setEsPrincipal(e.target.checked)}
                                    sx={{ color: '#629FAD', '&.Mui-checked': { color: '#0C2C55' } }}
                                />
                            }
                            label="Es Principal"
                            sx={{ color: '#0C2C55' }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                backgroundColor: '#0C2C55',
                                color: '#fff',
                                px: 3,
                                py: 1.2,
                                borderRadius: 3,
                                fontWeight: 700,
                                '&:hover': { backgroundColor: '#296374' }
                            }}
                        >
                            Agregar
                        </Button>
                    </Box>
                </Paper>

                {/* COUNT */}
                <Typography
                    sx={{
                        color: '#296374',
                        mb: 2,
                        fontWeight: 700,
                        fontSize: '.9rem'
                    }}
                >
                    {miembros.length} miembro{miembros.length !== 1 ? 's' : ''} registrado{miembros.length !== 1 ? 's' : ''}
                </Typography>

                {/* LIST */}
                {miembros.length === 0 ? (

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
                        <GroupIcon
                            sx={{
                                fontSize: 80,
                                color: '#629FAD40',
                                mb: 2
                            }}
                        />

                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 800,
                                color: '#0C2C55',
                                mb: 1
                            }}
                        >
                            Sin miembros asignados
                        </Typography>

                        <Typography
                            sx={{
                                color: '#296374',
                            }}
                        >
                            Agrega miembros usando el formulario de arriba.
                        </Typography>
                    </Paper>

                ) : (

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>

                        {miembros.map((m) => (

                            <Paper
                                key={m.id}
                                elevation={0}
                                sx={{
                                    p: 2.5,
                                    borderRadius: 4,
                                    backgroundColor: '#fff',
                                    border: '1px solid #E2E8F0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    transition: '0.2s ease',
                                    '&:hover': {
                                        borderColor: '#629FAD',
                                        boxShadow: '0 8px 25px rgba(12,44,85,0.06)'
                                    }
                                }}
                            >

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

                                    <Box
                                        sx={{
                                            width: 42,
                                            height: 42,
                                            borderRadius: '50%',
                                            backgroundColor: m.esPrincipal ? '#0C2C55' : '#629FAD20',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: m.esPrincipal ? '#fff' : '#296374',
                                            fontWeight: 800,
                                            fontSize: '1.05rem',
                                        }}
                                    >
                                        {m.nombre.charAt(0).toUpperCase()}
                                    </Box>

                                    <Box>
                                        <Typography
                                            sx={{
                                                fontWeight: 700,
                                                color: '#0C2C55',
                                                fontSize: '.95rem'
                                            }}
                                        >
                                            {m.nombre}
                                        </Typography>

                                        <Chip
                                            label={m.esPrincipal ? 'Principal' : 'Secundario'}
                                            size="small"
                                            sx={{
                                                mt: 0.3,
                                                backgroundColor: m.esPrincipal ? '#0C2C5515' : '#629FAD15',
                                                color: m.esPrincipal ? '#0C2C55' : '#296374',
                                                fontWeight: 700,
                                                borderRadius: 2,
                                                fontSize: '.7rem',
                                                height: 22
                                            }}
                                        />
                                    </Box>

                                </Box>

                                <IconButton
                                    size="small"
                                    onClick={() => handleDelete(m.id)}
                                    sx={{ color: '#EF4444' }}
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>

                            </Paper>

                        ))}

                    </Box>

                )}

            </Container>
        </Box>
    );
};

export default Miembros;
