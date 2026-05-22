import React, { useState } from 'react';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Paper, Box } from '@mui/material';

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
        <Container sx={{ mt: 4 }} maxWidth="sm">
            <Paper sx={{ p: 4, borderRadius: 2 }} elevation={3}>
                <Typography variant="h5" mb={3} fontWeight="bold">Configurar Nueva Rotación</Typography>
                <Box component="form" onSubmit={handleSubmit}>
                    <TextField fullWidth margin="normal" label="Nombre (ej: Mayo 2026)" required 
                        value={nombre} onChange={e=>setNombre(e.target.value)} />
                    <Typography variant="body2" color="text.secondary" mt={2} mb={1}>Fecha Inicio *</Typography>
                    <TextField fullWidth type="date" required 
                        value={fechaInicio} onChange={e=>setFechaInicio(e.target.value)} />

                    <Typography variant="body2" color="text.secondary" mt={2} mb={1}>Fecha Fin *</Typography>
                    <TextField fullWidth type="date" required 
                        value={fechaFin} onChange={e=>setFechaFin(e.target.value)} />
                    <Button type="submit" variant="contained" fullWidth sx={{ mt: 3, py: 1.5 }}>Siguiente: Configurar</Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default RotacionForm;
