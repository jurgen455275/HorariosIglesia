import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Paper, List, ListItem, ListItemText, IconButton, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const Dashboard = () => {
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
        if(window.confirm('¿Seguro que deseas eliminar?')) {
            try {
                await api.delete(`/rotaciones/${id}`);
                fetchRotaciones();
            } catch (err) {
                alert("Error al eliminar la rotación: " + (err.response?.data?.message || err.message));
                console.error(err);
            }
        }
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Mis Rotaciones</Typography>
                <Button variant="contained" color="primary" onClick={() => navigate('/rotaciones/nueva')}>
                    Nueva Rotación
                </Button>
            </Box>
            
            <Paper elevation={2}>
                <List>
                    {rotaciones.map((rot) => (
                        <ListItem 
                            key={rot.id}
                            secondaryAction={
                                <>
                                    <Button size="small" variant="outlined" onClick={() => navigate(`/rotaciones/${rot.id}`)} sx={{ mr: 1 }}>Gestionar Horario</Button>
                                    <IconButton edge="end" color="error" onClick={() => handleDelete(rot.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </>
                            }
                        >
                            <ListItemText 
                                primary={rot.nombre} 
                                secondary={`${rot.fechaInicio} a ${rot.fechaFin}`} 
                                primaryTypographyProps={{ fontWeight: 'bold' }}
                            />
                        </ListItem>
                    ))}
                    {rotaciones.length === 0 && (
                        <ListItem><ListItemText primary="No tienes rotaciones. Crea una para empezar a generar horarios." /></ListItem>
                    )}
                </List>
            </Paper>
        </Container>
    );
};

export default Dashboard;
