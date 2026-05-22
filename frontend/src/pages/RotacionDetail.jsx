import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { useParams } from 'react-router-dom';
import { Container, Typography, Button, Paper, Box, Grid, Table, TableBody, TableCell, TableHead, TableRow, Select, MenuItem, InputLabel, FormControl, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const RotacionDetail = () => {
    const { id } = useParams();
    const [rotacion, setRotacion] = useState(null);
    const [miembros, setMiembros] = useState([]);
    const [disponibilidades, setDisponibilidades] = useState([]);
    const [reglas, setReglas] = useState([]);
    const [turnos, setTurnos] = useState([]);

    const [turnoDialog, setTurnoDialog] = useState({ open: false, isEdit: false, id: null, fecha: '', m1: '', m2: '', r: '' });

    const [selMiembroId, setSelMiembroId] = useState('');
    const [diaSemana, setDiaSemana] = useState('MARTES');
    const [franjaHoraria, setFranjaHoraria] = useState('COMPLETA');
    const [tipoRegla, setTipoRegla] = useState('EVITAR_CONSECUTIVOS');

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            const [rotRes, memRes, dispRes, regrasRes, turRes] = await Promise.all([
                api.get(`/rotaciones/${id}`),
                api.get('/miembros'),
                api.get(`/rotaciones/${id}/disponibilidad`),
                api.get(`/rotaciones/${id}/reglas`),
                api.get(`/rotaciones/${id}/turnos`)
            ]);
            setRotacion(rotRes.data);
            setMiembros(memRes.data);
            setDisponibilidades(dispRes.data);
            setReglas(regrasRes.data);
            setTurnos(turRes.data);
        } catch (e) {
            console.error("Error al cargar datos", e);
        }
    };

    const handleAddDisp = async () => {
        if (!selMiembroId) return;
        try {
            if (diaSemana === 'AMBOS') {
                await api.post(`/rotaciones/${id}/disponibilidad`, { miembro: { id: selMiembroId }, diaSemana: 'MARTES', disponible: true, franjaHoraria });
                await api.post(`/rotaciones/${id}/disponibilidad`, { miembro: { id: selMiembroId }, diaSemana: 'DOMINGO', disponible: true, franjaHoraria });
            } else {
                await api.post(`/rotaciones/${id}/disponibilidad`, { miembro: { id: selMiembroId }, diaSemana, disponible: true, franjaHoraria });
            }
            loadData();
        } catch (e) {
            alert("Error al añadir disponibilidad.");
        }
    };

    const handleDelDisp = async (dispId) => {
        await api.delete(`/rotaciones/${id}/disponibilidad/${dispId}`);
        loadData();
    };

    const handleAddRegla = async () => {
        await api.post(`/rotaciones/${id}/reglas`, {
            tipo: tipoRegla,
            miembro: selMiembroId ? { id: selMiembroId } : null
        });
        loadData();
    };

    const handleDelRegla = async (reglaId) => {
        await api.delete(`/rotaciones/${id}/reglas/${reglaId}`);
        loadData();
    };

    const handleGenerar = async () => {
        if (window.confirm('¿Esto borrará el horario actual y creará uno nuevo. ¿Continuar?')) {
            await api.post(`/rotaciones/${id}/generar`);
            loadData();
        }
    };

    const handleExportar = async () => {
        const res = await api.get(`/rotaciones/${id}/turnos/exportar`, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `horario_${rotacion.nombre.replace(/ /g, '_')}.xlsx`);
        document.body.appendChild(link);
        link.click();
    };

    const openTurnoDialog = (turno = null) => {
        if (turno) {
            setTurnoDialog({ open: true, isEdit: true, id: turno.id, fecha: turno.fecha, m1: turno.miembro1?.id || '', m2: turno.miembro2?.id || '', r: turno.respaldo?.id || '' });
        } else {
            setTurnoDialog({ open: true, isEdit: false, id: null, fecha: '', m1: '', m2: '', r: '' });
        }
    };

    const saveTurno = async () => {
        const payload = {
            fecha: turnoDialog.fecha,
            miembro1: turnoDialog.m1 ? { id: turnoDialog.m1 } : null,
            miembro2: turnoDialog.m2 ? { id: turnoDialog.m2 } : null,
            respaldo: turnoDialog.r ? { id: turnoDialog.r } : null
        };
        try {
            if (turnoDialog.isEdit) {
                await api.put(`/rotaciones/${id}/turnos/${turnoDialog.id}`, payload);
            } else {
                await api.post(`/rotaciones/${id}/turnos`, payload);
            }
            setTurnoDialog({ ...turnoDialog, open: false });
            loadData();
        } catch (e) {
            alert("Error al guardar turno extra/editado.");
        }
    };

    if (!rotacion) return <Container sx={{ mt: 4 }}><Typography>Cargando rotación...</Typography></Container>;

    return (
        <Container sx={{ mt: 4, mb: 8 }} maxWidth="lg">
            <Typography variant="h4" fontWeight="bold">Asignación: {rotacion.nombre}</Typography>
            <Typography variant="subtitle1" color="text.secondary" mb={4}>Rango: {rotacion.fechaInicio} a {rotacion.fechaFin}</Typography>

            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Accordion elevation={3} sx={{ borderRadius: 2, overflow: 'hidden', '&:before': { display: 'none' } }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="h6" fontWeight="bold">Disponibilidad de Miembros</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box display="flex" flexWrap="wrap" gap={2} mb={3} alignItems="center">
                                <FormControl size="small" sx={{ minWidth: 130, flex: 1 }}>
                                    <InputLabel>Miembro</InputLabel>
                                    <Select value={selMiembroId} onChange={e => setSelMiembroId(e.target.value)} label="Miembro">
                                        {miembros.map(m => <MenuItem key={m.id} value={m.id}>{m.nombre}</MenuItem>)}
                                    </Select>
                                </FormControl>
                                <FormControl size="small" sx={{ minWidth: 130, flex: 1 }}>
                                    <InputLabel>Día</InputLabel>
                                    <Select value={diaSemana} onChange={e => setDiaSemana(e.target.value)} label="Día">
                                        <MenuItem value="MARTES">Martes</MenuItem>
                                        <MenuItem value="DOMINGO">Domingo</MenuItem>
                                        <MenuItem value="AMBOS">Ambos días</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl size="small" sx={{ minWidth: 130, flex: 1 }}>
                                    <InputLabel>Franja</InputLabel>
                                    <Select value={franjaHoraria} onChange={e => setFranjaHoraria(e.target.value)} label="Franja">
                                        <MenuItem value="COMPLETA">Día completo</MenuItem>
                                        <MenuItem value="PRIMERA_MITAD">Primera mitad</MenuItem>
                                        <MenuItem value="SEGUNDA_MITAD">Segunda mitad</MenuItem>
                                    </Select>
                                </FormControl>
                                <Button variant="contained" onClick={handleAddDisp} sx={{ height: 'fit-content' }}>Añadir</Button>
                            </Box>
                            <Table size="small">
                                <TableHead><TableRow><TableCell><b>Miembro</b></TableCell><TableCell><b>Día Activo</b></TableCell><TableCell></TableCell></TableRow></TableHead>
                                <TableBody>
                                    {disponibilidades.map(d => (
                                        <TableRow key={d.id}>
                                            <TableCell>{d.miembro.nombre}</TableCell>
                                            <TableCell>{d.diaSemana} {d.franjaHoraria !== 'COMPLETA' && `(${d.franjaHoraria === 'PRIMERA_MITAD' ? 'Primera Mitad' : 'Segunda Mitad'})`}</TableCell>
                                            <TableCell align="right"><IconButton size="small" color="error" onClick={() => handleDelDisp(d.id)}><DeleteIcon /></IconButton></TableCell>
                                        </TableRow>
                                    ))}
                                    {disponibilidades.length === 0 && <TableRow><TableCell colSpan={3}>Nadie está configurado como disponible.</TableCell></TableRow>}
                                </TableBody>
                            </Table>
                        </AccordionDetails>
                    </Accordion>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Accordion elevation={3} sx={{ borderRadius: 2, overflow: 'hidden', '&:before': { display: 'none' } }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="h6" fontWeight="bold">Reglas / Restricciones</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box display="flex" flexWrap="wrap" gap={2} mb={3} alignItems="center">
                                <FormControl size="small" sx={{ minWidth: 150, flex: 1 }}>
                                    <InputLabel>Regla</InputLabel>
                                    <Select value={tipoRegla} onChange={e => setTipoRegla(e.target.value)} label="Regla">
                                        <MenuItem value="EVITAR_CONSECUTIVOS">Descanso Obligatorio (no seguidos)</MenuItem>
                                        <MenuItem value="SIN_PRINCIPAL_OBLIGATORIO">No Obliga Rol Principal</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl size="small" sx={{ minWidth: 150, flex: 1 }}>
                                    <InputLabel>Aplicar a</InputLabel>
                                    <Select value={selMiembroId} onChange={e => setSelMiembroId(e.target.value)} label="Aplicar a">
                                        <MenuItem value=""><em>Todos los miembros</em></MenuItem>
                                        {miembros.map(m => <MenuItem key={m.id} value={m.id}>{m.nombre}</MenuItem>)}
                                    </Select>
                                </FormControl>
                                <Button variant="contained" onClick={handleAddRegla} sx={{ height: 'fit-content' }}>Añadir</Button>
                            </Box>
                            <Table size="small">
                                <TableHead><TableRow><TableCell><b>Tipo</b></TableCell><TableCell><b>Objetivo</b></TableCell><TableCell></TableCell></TableRow></TableHead>
                                <TableBody>
                                    {reglas.map(r => (
                                        <TableRow key={r.id}>
                                            <TableCell>{r.tipo}</TableCell>
                                            <TableCell>{r.miembro ? r.miembro.nombre : 'TODOS'}</TableCell>
                                            <TableCell align="right"><IconButton size="small" color="error" onClick={() => handleDelRegla(r.id)}><DeleteIcon /></IconButton></TableCell>
                                        </TableRow>
                                    ))}
                                    {reglas.length === 0 && <TableRow><TableCell colSpan={3}>Sin reglas específicas.</TableCell></TableRow>}
                                </TableBody>
                            </Table>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
            </Grid>

            <Box mt={6} mb={2} display="flex" flexWrap="wrap" gap={2} justifyContent="space-between" alignItems="center">
                <Typography variant="h5" fontWeight="bold">Malla de Horarios</Typography>
                <Box display="flex" flexWrap="wrap" gap={2}>
                    <Button variant="contained" color="secondary" onClick={handleGenerar} sx={{ fontWeight: 'bold' }}>⚡ Autogenerar Horario</Button>
                    <Button variant="contained" color="success" onClick={() => openTurnoDialog()}>+ Añadir Día Extra</Button>
                    {turnos.length > 0 && <Button variant="outlined" color="primary" onClick={handleExportar}>⬇ Exportar Excel</Button>}
                </Box>
            </Box>

            <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }} elevation={3}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#e3f2fd' }}>
                        <TableRow>
                            <TableCell><b>Día</b></TableCell>
                            <TableCell><b>Fecha</b></TableCell>
                            <TableCell><b>Miembro 1 (Principal)</b></TableCell>
                            <TableCell><b>Miembro 2</b></TableCell>
                            <TableCell><b>Respaldo</b></TableCell>
                            <TableCell><b>Acción</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {turnos.map(t => {
                            const isVacio = !t.miembro1;
                            const tM1 = t.miembro1 ? t.miembro1.nombre + (t.anotacionM1 ? ' ' + t.anotacionM1 : '') : 'VACÍO (FALTA DISPONIBILIDAD)';
                            const tM2 = t.miembro2 ? t.miembro2.nombre + (t.anotacionM2 ? ' ' + t.anotacionM2 : '') : '-';

                            const dateParts = t.fecha.split('-');
                            const dateObj = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
                            const diaNombre = dateObj.getDay() === 2 ? 'Martes' : (dateObj.getDay() === 0 ? 'Domingo' : 'Especial');

                            return (
                                <TableRow key={t.id} sx={{ backgroundColor: isVacio ? '#ffcdd2' : 'inherit' }}>
                                    <TableCell><strong>{diaNombre}</strong></TableCell>
                                    <TableCell>{t.fecha}</TableCell>
                                    <TableCell>{tM1}</TableCell>
                                    <TableCell>{tM2}</TableCell>
                                    <TableCell>{t.respaldo?.nombre || '-'}</TableCell>
                                    <TableCell><IconButton size="small" onClick={() => openTurnoDialog(t)}><EditIcon color="primary" /></IconButton></TableCell>
                                </TableRow>
                            );
                        })}
                        {turnos.length === 0 && <TableRow><TableCell colSpan={5} align="center" sx={{ py: 4 }}>El horario aún no se ha autogenerado.</TableCell></TableRow>}
                    </TableBody>
                </Table>
            </Paper>
            <Dialog open={turnoDialog.open} onClose={() => setTurnoDialog({ ...turnoDialog, open: false })}>
                <DialogTitle>{turnoDialog.isEdit ? 'Editar Turno' : 'Añadir Día Extra'}</DialogTitle>
                <DialogContent>
                    <Box display="flex" flexDirection="column" gap={2} mt={1} minWidth={300}>
                        <Box>
                            <Typography variant="body2" color="text.secondary" mb={1}>Fecha de la actividad *</Typography>
                            <TextField 
                                type="date" 
                                value={turnoDialog.fecha} 
                                onChange={e => setTurnoDialog({ ...turnoDialog, fecha: e.target.value })}
                                fullWidth
                            />
                        </Box>
                        <FormControl fullWidth>
                            <InputLabel>Miembro 1</InputLabel>
                            <Select value={turnoDialog.m1} onChange={e => setTurnoDialog({ ...turnoDialog, m1: e.target.value })} label="Miembro 1">
                                <MenuItem value=""><em>Vacío</em></MenuItem>
                                {miembros.map(m => <MenuItem key={m.id} value={m.id}>{m.nombre}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>Miembro 2</InputLabel>
                            <Select value={turnoDialog.m2} onChange={e => setTurnoDialog({ ...turnoDialog, m2: e.target.value })} label="Miembro 2">
                                <MenuItem value=""><em>Vacío</em></MenuItem>
                                {miembros.map(m => <MenuItem key={m.id} value={m.id}>{m.nombre}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>Respaldo</InputLabel>
                            <Select value={turnoDialog.r} onChange={e => setTurnoDialog({ ...turnoDialog, r: e.target.value })} label="Respaldo">
                                <MenuItem value=""><em>Vacío</em></MenuItem>
                                {miembros.map(m => <MenuItem key={m.id} value={m.id}>{m.nombre}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setTurnoDialog({ ...turnoDialog, open: false })}>Cancelar</Button>
                    <Button variant="contained" onClick={saveTurno}>Guardar</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default RotacionDetail;
