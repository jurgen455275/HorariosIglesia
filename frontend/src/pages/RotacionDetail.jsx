import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { useParams } from 'react-router-dom';

import {
    Container,
    Typography,
    Button,
    Paper,
    Box,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const RotacionDetail = () => {

    const { id } = useParams();

    const [rotacion, setRotacion] = useState(null);
    const [miembros, setMiembros] = useState([]);
    const [disponibilidades, setDisponibilidades] = useState([]);
    const [reglas, setReglas] = useState([]);
    const [turnos, setTurnos] = useState([]);

    const [selMiembroId, setSelMiembroId] = useState('');
    const [diaSemana, setDiaSemana] = useState('MARTES');
    const [franjaHoraria, setFranjaHoraria] = useState('COMPLETA');
    const [tipoRegla, setTipoRegla] = useState('EVITAR_CONSECUTIVOS');

    const [turnoDialog, setTurnoDialog] = useState({
        open: false,
        isEdit: false,
        id: null,
        fecha: '',
        m1: '',
        m2: '',
        r: '',
    });

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {

            const [
                rotRes,
                memRes,
                dispRes,
                reglasRes,
                turnosRes
            ] = await Promise.all([
                api.get(`/rotaciones/${id}`),
                api.get('/miembros'),
                api.get(`/rotaciones/${id}/disponibilidad`),
                api.get(`/rotaciones/${id}/reglas`),
                api.get(`/rotaciones/${id}/turnos`)
            ]);

            setRotacion(rotRes.data);
            setMiembros(memRes.data);
            setDisponibilidades(dispRes.data);
            setReglas(reglasRes.data);
            setTurnos(turnosRes.data);

        } catch (error) {
            console.error(error);
        }
    };

    const handleAddDisp = async () => {

        try {

            if (!selMiembroId) {
                alert('Selecciona un miembro');
                return;
            }

            if (diaSemana === 'AMBOS') {

                await api.post(`/rotaciones/${id}/disponibilidad`, {
                    miembro: { id: Number(selMiembroId) },
                    diaSemana: 'MARTES',
                    disponible: true,
                    franjaHoraria,
                });

                await api.post(`/rotaciones/${id}/disponibilidad`, {
                    miembro: { id: Number(selMiembroId) },
                    diaSemana: 'DOMINGO',
                    disponible: true,
                    franjaHoraria,
                });

            } else {

                await api.post(`/rotaciones/${id}/disponibilidad`, {
                    miembro: { id: Number(selMiembroId) },
                    diaSemana,
                    disponible: true,
                    franjaHoraria,
                });
            }

            loadData();

        } catch (error) {
            console.error(error);
            alert('Error al añadir disponibilidad');
        }
    };

    const handleAddRegla = async () => {

        try {

            await api.post(`/rotaciones/${id}/reglas`, {
                tipo: tipoRegla,
                miembro: selMiembroId
                    ? { id: Number(selMiembroId) }
                    : null,
            });

            loadData();

        } catch (error) {
            console.error(error);
            alert('Error al añadir regla');
        }
    };

    const handleDeleteDisp = async (dispId) => {
        await api.delete(`/rotaciones/${id}/disponibilidad/${dispId}`);
        loadData();
    };

    const handleDeleteRegla = async (reglaId) => {
        await api.delete(`/rotaciones/${id}/reglas/${reglaId}`);
        loadData();
    };

    const handleGenerar = async () => {

        try {

            await api.post(`/rotaciones/${id}/generar`);
            loadData();

        } catch (error) {
            console.error(error);
            alert('Error al generar horario');
        }
    };

    const handleExportar = async () => {

        try {

            const res = await api.get(
                `/rotaciones/${id}/turnos/exportar`,
                { responseType: 'blob' }
            );

            const url = window.URL.createObjectURL(
                new Blob([res.data])
            );

            const link = document.createElement('a');

            link.href = url;

            link.setAttribute(
                'download',
                `horario_${rotacion.nombre}.xlsx`
            );

            document.body.appendChild(link);
            link.click();

        } catch (error) {
            console.error(error);
            alert('Error exportando Excel');
        }
    };

    const openTurnoDialog = (turno = null) => {

        if (turno) {

            setTurnoDialog({
                open: true,
                isEdit: true,
                id: turno.id,
                fecha: turno.fecha,
                m1: turno.miembro1?.id || '',
                m2: turno.miembro2?.id || '',
                r: turno.respaldo?.id || '',
            });

        } else {

            setTurnoDialog({
                open: true,
                isEdit: false,
                id: null,
                fecha: '',
                m1: '',
                m2: '',
                r: '',
            });
        }
    };

    const saveTurno = async () => {

        try {

            const payload = {
                fecha: turnoDialog.fecha,
                miembro1: turnoDialog.m1
                    ? { id: Number(turnoDialog.m1) }
                    : null,

                miembro2: turnoDialog.m2
                    ? { id: Number(turnoDialog.m2) }
                    : null,

                respaldo: turnoDialog.r
                    ? { id: Number(turnoDialog.r) }
                    : null,
            };

            if (turnoDialog.isEdit) {

                await api.put(
                    `/rotaciones/${id}/turnos/${turnoDialog.id}`,
                    payload
                );

            } else {

                await api.post(
                    `/rotaciones/${id}/turnos`,
                    payload
                );
            }

            setTurnoDialog({
                ...turnoDialog,
                open: false,
            });

            loadData();

        } catch (error) {
            console.error(error);
            alert('Error guardando turno');
        }
    };

    const getDayName = (dateString) => {
        if (!dateString) return '';
        const [year, month, day] = dateString.split('-').map(Number);
        if ([year, month, day].some((value) => Number.isNaN(value))) return '';
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString('es-ES', { weekday: 'long' });
    };

    if (!rotacion) {
        return (
            <Container sx={{ mt: 5 }}>
                <Typography>Cargando...</Typography>
            </Container>
        );
    }

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
                                {rotacion.fechaInicio} → {rotacion.fechaFin}
                            </Typography>

                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 900,
                                    mt: 1,
                                    mb: 1,
                                    lineHeight: 1.1,
                                    color: '#fff',
                                }}
                            >
                                {rotacion.nombre}
                            </Typography>

                            <Typography
                                sx={{
                                    color: 'rgba(255,255,255,0.78)',
                                    maxWidth: 600,
                                    lineHeight: 1.8,
                                    fontWeight: 400,
                                    mb: 3
                                }}
                            >
                                Gestiona horarios, miembros y restricciones
                                desde un solo lugar.
                            </Typography>

                            <Box display="flex" gap={2} flexWrap="wrap">

                                <Button
                                    variant="contained"
                                    onClick={handleGenerar}
                                    sx={{
                                        backgroundColor: '#629FAD',
                                        color: '#fff',
                                        px: 3.5,
                                        py: 1.3,
                                        borderRadius: 3,
                                        fontWeight: 700,
                                        '&:hover': {
                                            backgroundColor: '#296374'
                                        }
                                    }}
                                >
                                    Autogenerar
                                </Button>

                                <Button
                                    startIcon={<DownloadIcon />}
                                    variant="outlined"
                                    onClick={handleExportar}
                                    sx={{
                                        borderColor: 'rgba(255,255,255,0.25)',
                                        color: '#fff',
                                        px: 3.5,
                                        py: 1.3,
                                        borderRadius: 3,
                                        fontWeight: 600,
                                        '&:hover': {
                                            borderColor: '#fff',
                                            backgroundColor: 'rgba(255,255,255,0.06)'
                                        }
                                    }}
                                >
                                    Descargar Excel
                                </Button>

                            </Box>

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

                {/* CARDS */}
                <Grid container spacing={3} sx={{ alignItems: 'stretch' }}>

                    {/* DISPONIBILIDAD */}
                    <Grid item xs={12} lg={6}>

                        <Paper
                            elevation={0}
                            sx={{
                                p: 4,
                                borderRadius: 6,
                                height: '100%',
                                background:
                                    'linear-gradient(135deg, #ffffff 0%, #f8fbfc 100%)',
                                border: '1px solid #E2E8F0',
                                transition: '0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-6px)',
                                    boxShadow: '0 20px 45px rgba(12,44,85,0.08)'
                                }
                            }}
                        >

                            <Box>

                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 800,
                                        color: '#0C2C55',
                                        mb: 4
                                    }}
                                >
                                    Disponibilidad
                                </Typography>

                                <Grid container spacing={2}>

                                    <Grid item xs={12}>
                                        <FormControl fullWidth>
                                            <InputLabel>Miembro</InputLabel>

                                            <Select
                                                value={selMiembroId}
                                                label="Miembro"
                                                onChange={(e) =>
                                                    setSelMiembroId(e.target.value)
                                                }
                                                sx={{
                                                    borderRadius: 3,
                                                    backgroundColor: '#fff',
                                                }}
                                            >
                                                {miembros.map((m) => (
                                                    <MenuItem
                                                        key={m.id}
                                                        value={m.id}
                                                    >
                                                        {m.nombre}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth>
                                            <InputLabel>Día</InputLabel>

                                            <Select
                                                value={diaSemana}
                                                label="Día"
                                                onChange={(e) =>
                                                    setDiaSemana(e.target.value)
                                                }
                                                sx={{
                                                    borderRadius: 3,
                                                    backgroundColor: '#fff',
                                                }}
                                            >
                                                <MenuItem value="MARTES">Martes</MenuItem>
                                                <MenuItem value="DOMINGO">Domingo</MenuItem>
                                                <MenuItem value="AMBOS">Ambos</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth>
                                            <InputLabel>Franja</InputLabel>

                                            <Select
                                                value={franjaHoraria}
                                                label="Franja"
                                                onChange={(e) =>
                                                    setFranjaHoraria(e.target.value)
                                                }
                                                sx={{
                                                    borderRadius: 3,
                                                    backgroundColor: '#fff',
                                                }}
                                            >
                                                <MenuItem value="COMPLETA">Completa</MenuItem>
                                                <MenuItem value="PRIMERA_MITAD">Primera Mitad</MenuItem>
                                                <MenuItem value="SEGUNDA_MITAD">Segunda Mitad</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                </Grid>

                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={handleAddDisp}
                                    sx={{
                                        mt: 3,
                                        mb: 6,
                                        py: 1.6,
                                        borderRadius: 3,
                                        backgroundColor: '#0C2C55',
                                        fontWeight: 700,
                                        '&:hover': {
                                            backgroundColor: '#296374'
                                        }
                                    }}
                                >
                                    Añadir Disponibilidad
                                </Button>

                                <Box>

                                    {disponibilidades.map((d) => (

                                        <Paper
                                            key={d.id}
                                            elevation={0}
                                            sx={{
                                                p: 2.5,
                                                mb: 1.5,
                                                borderRadius: 3,
                                                backgroundColor: '#fff',
                                                border: '1px solid #E2E8F0',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                transition: '0.2s ease',
                                                '&:hover': {
                                                    borderColor: '#629FAD',
                                                }
                                            }}
                                        >

                                            <Box>

                                                <Typography
                                                    sx={{
                                                        fontWeight: 700,
                                                        color: '#0C2C55',
                                                        fontSize: '.95rem',
                                                    }}
                                                >
                                                    {d.miembro.nombre}
                                                </Typography>

                                                <Typography
                                                    sx={{
                                                        color: '#629FAD',
                                                        fontSize: '.85rem',
                                                    }}
                                                >
                                                    {d.diaSemana} • {d.franjaHoraria}
                                                </Typography>

                                            </Box>

                                            <IconButton
                                                size="small"
                                                onClick={() => handleDeleteDisp(d.id)}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>

                                        </Paper>

                                    ))}

                                </Box>

                            </Box>

                        </Paper>

                    </Grid>

                    {/* RESTRICCIONES */}
                    <Grid item xs={12} lg={6}>

                        <Paper
                            elevation={0}
                            sx={{
                                p: 4,
                                borderRadius: 6,
                                height: '100%',
                                background:
                                    'linear-gradient(135deg, #ffffff 0%, #faf9ff 100%)',
                                border: '1px solid #ECE8FF',
                                transition: '0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-6px)',
                                    boxShadow: '0 20px 45px rgba(108,99,255,0.08)'
                                }
                            }}
                        >

                            <Box>

                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 800,
                                        color: '#0C2C55',
                                        mb: 4
                                    }}
                                >
                                    Restricciones
                                </Typography>

                                <FormControl fullWidth>
                                    <InputLabel>Tipo</InputLabel>

                                    <Select
                                        value={tipoRegla}
                                        label="Tipo"
                                        onChange={(e) =>
                                            setTipoRegla(e.target.value)
                                        }
                                        sx={{
                                            borderRadius: 3,
                                            backgroundColor: '#fff',
                                        }}
                                    >
                                        <MenuItem value="EVITAR_CONSECUTIVOS">
                                            Descanso Obligatorio
                                        </MenuItem>

                                        <MenuItem value="SIN_PRINCIPAL_OBLIGATORIO">
                                            Sin Principal Obligatorio
                                        </MenuItem>
                                    </Select>
                                </FormControl>

                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={handleAddRegla}
                                    sx={{
                                        mt: 3,
                                        mb: 6,
                                        py: 1.6,
                                        borderRadius: 3,
                                        backgroundColor: '#6C63FF',
                                        fontWeight: 700,
                                        '&:hover': {
                                            backgroundColor: '#5B54E8'
                                        }
                                    }}
                                >
                                    Añadir Restricción
                                </Button>

                                <Box>

                                    {reglas.map((r) => (

                                        <Paper
                                            key={r.id}
                                            elevation={0}
                                            sx={{
                                                p: 2.5,
                                                mb: 1.5,
                                                borderRadius: 3,
                                                backgroundColor: '#fff',
                                                border: '1px solid #ECE8FF',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                transition: '0.2s ease',
                                                '&:hover': {
                                                    borderColor: '#6C63FF',
                                                }
                                            }}
                                        >

                                            <Box>

                                                <Typography
                                                    sx={{
                                                        fontWeight: 700,
                                                        color: '#0C2C55',
                                                        fontSize: '.95rem',
                                                    }}
                                                >
                                                    {r.tipo}
                                                </Typography>

                                                <Typography
                                                    sx={{
                                                        color: '#6C63FF',
                                                        fontSize: '.85rem',
                                                    }}
                                                >
                                                    {r.miembro
                                                        ? r.miembro.nombre
                                                        : 'Todos'}
                                                </Typography>

                                            </Box>

                                            <IconButton
                                                size="small"
                                                onClick={() => handleDeleteRegla(r.id)}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>

                                        </Paper>

                                    ))}

                                </Box>

                            </Box>

                        </Paper>

                    </Grid>

                </Grid>

                {/* HORARIOS */}
                <Paper
                    elevation={0}
                    sx={{
                        mt: 5,
                        borderRadius: 1,
                        overflow: 'hidden',
                        backgroundColor: '#fff',
                        border: '1px solid #E2E8F0',
                    }}
                >

                    <Box
                        px={4}
                        pt={4}
                        pb={2}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        flexWrap="wrap"
                        gap={2}
                    >

                        <Typography
                            sx={{
                                fontWeight: 800,
                                color: '#0C2C55',
                                fontSize: '1.1rem',
                                py: 0.5,
                                mx: 2,
                                my: 1
                            }}
                        >
                            Horarios
                        </Typography>

                        <Button
                            startIcon={<AddIcon />}
                            variant="contained"
                            onClick={() => openTurnoDialog()}
                            sx={{
                                borderRadius: 2,
                                backgroundColor: '#0C2C55',
                                textTransform: 'none',
                                fontWeight: 700,
                                px: 3,
                                py: 1.2,
                                my: 2,
                                mx: 1,
                                fontSize: '.85rem',
                                '&:hover': {
                                    backgroundColor: '#296374'
                                }
                            }}
                        >
                            Añadir Día
                        </Button>

                    </Box>

                    <Table>

                        <TableHead>

                            <TableRow sx={{ backgroundColor: '#F8FBFC' }}>

                                <TableCell sx={{ fontWeight: 700, color: '#0C2C55' }}>
                                    Fecha
                                </TableCell>

                                <TableCell sx={{ fontWeight: 700, color: '#0C2C55' }}>
                                    Día
                                </TableCell>

                                <TableCell sx={{ fontWeight: 700, color: '#0C2C55' }}>
                                    Principal
                                </TableCell>

                                <TableCell sx={{ fontWeight: 700, color: '#0C2C55' }}>
                                    Secundario
                                </TableCell>

                                <TableCell sx={{ fontWeight: 700, color: '#0C2C55' }}>
                                    Respaldo
                                </TableCell>

                                <TableCell sx={{ fontWeight: 700, color: '#0C2C55' }}>
                                    Acción
                                </TableCell>

                            </TableRow>

                        </TableHead>

                        <TableBody>

                            {turnos.map((t) => (

                                <TableRow
                                    key={t.id}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: '#F8FBFC'
                                        }
                                    }}
                                >

                                    <TableCell>{t.fecha}</TableCell>

                                    <TableCell>{getDayName(t.fecha)}</TableCell>

                                    <TableCell>
                                        {t.miembro1?.nombre || '-'}
                                    </TableCell>

                                    <TableCell>
                                        {t.miembro2?.nombre || '-'}
                                    </TableCell>

                                    <TableCell>
                                        {t.respaldo?.nombre || '-'}
                                    </TableCell>

                                    <TableCell>
                                        <IconButton
                                            size="small"
                                            onClick={() => openTurnoDialog(t)}
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>

                                </TableRow>

                            ))}

                        </TableBody>

                    </Table>

                </Paper>

                {/* MODAL */}
                <Dialog
                    open={turnoDialog.open}
                    onClose={() =>
                        setTurnoDialog({
                            ...turnoDialog,
                            open: false,
                        })
                    }
                    PaperProps={{
                        sx: {
                            borderRadius: 6,
                            p: 2,
                            minWidth: '450px',
                        }
                    }}
                >

                    <DialogTitle
                        sx={{
                            fontWeight: 800,
                            color: '#0C2C55',
                            fontSize: '1.6rem'
                        }}
                    >
                        {turnoDialog.isEdit
                            ? 'Editar Turno'
                            : 'Nuevo Turno'}
                    </DialogTitle>

                    <DialogContent>

                        <Box
                            display="flex"
                            flexDirection="column"
                            gap={3}
                            mt={2}
                        >

                            <TextField
                                type="date"
                                label="Fecha"
                                InputLabelProps={{ shrink: true }}
                                value={turnoDialog.fecha}
                                onChange={(e) =>
                                    setTurnoDialog({
                                        ...turnoDialog,
                                        fecha: e.target.value,
                                    })
                                }
                            />

                            <FormControl fullWidth>
                                <InputLabel>Principal</InputLabel>

                                <Select
                                    value={turnoDialog.m1}
                                    label="Principal"
                                    onChange={(e) =>
                                        setTurnoDialog({
                                            ...turnoDialog,
                                            m1: e.target.value,
                                        })
                                    }
                                >
                                    {miembros.map((m) => (
                                        <MenuItem key={m.id} value={m.id}>
                                            {m.nombre}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth>
                                <InputLabel>Secundario</InputLabel>

                                <Select
                                    value={turnoDialog.m2}
                                    label="Secundario"
                                    onChange={(e) =>
                                        setTurnoDialog({
                                            ...turnoDialog,
                                            m2: e.target.value,
                                        })
                                    }
                                >
                                    {miembros.map((m) => (
                                        <MenuItem key={m.id} value={m.id}>
                                            {m.nombre}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth>
                                <InputLabel>Respaldo</InputLabel>

                                <Select
                                    value={turnoDialog.r}
                                    label="Respaldo"
                                    onChange={(e) =>
                                        setTurnoDialog({
                                            ...turnoDialog,
                                            r: e.target.value,
                                        })
                                    }
                                >
                                    {miembros.map((m) => (
                                        <MenuItem key={m.id} value={m.id}>
                                            {m.nombre}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                        </Box>

                    </DialogContent>

                    <DialogActions sx={{ p: 3 }}>

                        <Button
                            onClick={() =>
                                setTurnoDialog({
                                    ...turnoDialog,
                                    open: false,
                                })
                            }
                            sx={{ color: '#296374', fontWeight: 600 }}
                        >
                            Cancelar
                        </Button>

                        <Button
                            variant="contained"
                            onClick={saveTurno}
                            sx={{
                                backgroundColor: '#0C2C55',
                                borderRadius: 3,
                                textTransform: 'none',
                                fontWeight: 700,
                                px: 4,
                                py: 1.2,
                                '&:hover': {
                                    backgroundColor: '#296374'
                                }
                            }}
                        >
                            Guardar
                        </Button>

                    </DialogActions>

                </Dialog>

            </Container>
        </Box>
    );
};

export default RotacionDetail;
