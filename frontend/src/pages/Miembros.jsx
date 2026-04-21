import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { Container, Typography, Button, Paper, List, ListItem, ListItemText, IconButton, Box, TextField, Checkbox, FormControlLabel, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const Miembros = () => {
    const [miembros, setMiembros] = useState([]);
    const [nombre, setNombre] = useState('');
    const [esPrincipal, setEsPrincipal] = useState(false);

    useEffect(() => {
        fetchMiembros();
    }, []);

    const fetchMiembros = async () => {
        try {
            const res = await api.get('/miembros');
            setMiembros(res.data);
        } catch(e) {
            console.error("Error fetching miembros", e);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const reqData = { nombre, esPrincipal };
            await api.post('/miembros', reqData);
            setNombre('');
            setEsPrincipal(false);
            await fetchMiembros();
        } catch (error) {
            console.error("Error creando miembro:", error);
            alert("No se pudo agregar el miembro. Revisa la consola para más detalles.");
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm('¿Deseas eliminar este miembro?')) {
            try {
                await api.delete(`/miembros/${id}`);
                await fetchMiembros();
            } catch(e) {
                alert("No se pudo eliminar.");
            }
        }
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" mb={2} sx={{ fontWeight: 'bold' }}>Personal de la Organización</Typography>
            
            <Paper sx={{ p: 2, mb: 4, borderRadius: 2 }} elevation={3}>
                <Box component="form" onSubmit={handleCreate}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Nombre / Pseudónimo" value={nombre} onChange={e => setNombre(e.target.value)} required />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FormControlLabel 
                                control={<Checkbox checked={esPrincipal} onChange={e => setEsPrincipal(e.target.checked)} />} 
                                label="¿Es Principal? (Puede liderar turno)" 
                            />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <Button type="submit" variant="contained" fullWidth sx={{ height: 56 }}>Agregar</Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>

            <Typography variant="h6" mb={2}>Lista de Miembros ({miembros.length})</Typography>
            <Paper elevation={2}>
                <List>
                    {miembros.map((m) => (
                        <ListItem 
                            key={m.id}
                            secondaryAction={
                                <IconButton edge="end" color="error" onClick={() => handleDelete(m.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            }
                        >
                            <ListItemText 
                                primary={m.nombre} 
                                secondary={m.esPrincipal ? '🟢 ROL: PRINCIPAL' : '⚪ ROL: SECUNDARIO'} 
                            />
                        </ListItem>
                    ))}
                    {miembros.length === 0 && <ListItem><ListItemText primary="Sin miembros asignados." /></ListItem>}
                </List>
            </Paper>
        </Container>
    );
};

export default Miembros;
