package com.scheduler.service;

import com.scheduler.domain.*;
import com.scheduler.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class GeneradorService {

    private final RotacionRepository rotacionRepository;
    private final TurnoRepository turnoRepository;
    private final DisponibilidadRepository disponibilidadRepository;
    private final ReglaRepository reglaRepository;

    public GeneradorService(RotacionRepository rotacionRepository, TurnoRepository turnoRepository,
                            DisponibilidadRepository disponibilidadRepository,
                            ReglaRepository reglaRepository) {
        this.rotacionRepository = rotacionRepository;
        this.turnoRepository = turnoRepository;
        this.disponibilidadRepository = disponibilidadRepository;
        this.reglaRepository = reglaRepository;
    }

    @Transactional
    public List<Turno> generarHorario(Long rotacionId) {
        Rotacion rotacion = rotacionRepository.findById(rotacionId).orElseThrow();
        
        // Limpiar turnos anteriores de esta rotación
        turnoRepository.deleteByRotacion(rotacion);

        List<Disponibilidad> disponibilidades = disponibilidadRepository.findByRotacion(rotacion);
        List<Regla> reglas = reglaRepository.findByRotacion(rotacion);

        List<LocalDate> diasTurno = obtenerDias(rotacion.getFechaInicio(), rotacion.getFechaFin());
        List<Turno> turnosGenerados = new ArrayList<>();

        for (LocalDate fecha : diasTurno) {
            Disponibilidad.DiaSemana dia = fecha.getDayOfWeek() == DayOfWeek.TUESDAY ? 
                    Disponibilidad.DiaSemana.MARTES : Disponibilidad.DiaSemana.DOMINGO;

            List<Disponibilidad> disponibles = disponibilidades.stream()
                    .filter(d -> d.getDiaSemana() == dia && d.isDisponible())
                    .collect(Collectors.toList());

            Turno turno = intentarGenerarTurno(rotacion, fecha, disponibles, turnosGenerados, reglas);
            
            // Si no se encuentra combinación válida, se deja el turno en blanco
            if (turno == null) {
                turno = new Turno();
                turno.setRotacion(rotacion);
                turno.setFecha(fecha);
            }
            turno = turnoRepository.save(turno);
            turnosGenerados.add(turno);
        }

        return turnosGenerados;
    }

    private String getAnotacion(Disponibilidad d) {
        if (d.getFranjaHoraria() == Disponibilidad.FranjaHoraria.PRIMERA_MITAD) return "(Primera Mitad)";
        if (d.getFranjaHoraria() == Disponibilidad.FranjaHoraria.SEGUNDA_MITAD) return "(Segunda Mitad)";
        return "";
    }

    private Turno intentarGenerarTurno(Rotacion rotacion, LocalDate fecha, List<Disponibilidad> disponibles,
                                       List<Turno> turnosPrevios, List<Regla> reglas) {
        boolean principalObligatorio = reglas.stream().noneMatch(r -> r.getTipo() == Regla.TipoRegla.SIN_PRINCIPAL_OBLIGATORIO);
        Random random = new Random();
        List<Disponibilidad> copiaDisponibles = new ArrayList<>(disponibles);
        Collections.shuffle(copiaDisponibles, random);

        for (int i = 0; i < copiaDisponibles.size(); i++) {
            for (int j = i + 1; j < copiaDisponibles.size(); j++) {
                Disponibilidad disp1 = copiaDisponibles.get(i);
                Disponibilidad disp2 = copiaDisponibles.get(j);
                Miembro m1 = disp1.getMiembro();
                Miembro m2 = disp2.getMiembro();

                if (principalObligatorio && !m1.isEsPrincipal() && !m2.isEsPrincipal()) continue; 
                
                // Evitar que ambos cubran solo la misma mitad del día (dejando la otra mitad vacía)
                if (disp1.getFranjaHoraria() == Disponibilidad.FranjaHoraria.PRIMERA_MITAD && 
                    disp2.getFranjaHoraria() == Disponibilidad.FranjaHoraria.PRIMERA_MITAD) continue;
                if (disp1.getFranjaHoraria() == Disponibilidad.FranjaHoraria.SEGUNDA_MITAD && 
                    disp2.getFranjaHoraria() == Disponibilidad.FranjaHoraria.SEGUNDA_MITAD) continue;
                
                for (Disponibilidad dispRespaldo : copiaDisponibles) {
                    if (dispRespaldo.getFranjaHoraria() != Disponibilidad.FranjaHoraria.COMPLETA) continue;
                    Miembro respaldo = dispRespaldo.getMiembro();
                    if (respaldo.getId().equals(m1.getId()) || respaldo.getId().equals(m2.getId())) continue;

                    if (cumpleReglas(m1, m2, respaldo, turnosPrevios, reglas)) {
                        Turno t = new Turno();
                        t.setRotacion(rotacion);
                        t.setFecha(fecha);
                        
                        // Asegurar que m1 será el principal si m1 lo es, o intercambiar si es necesario (presentación gráfica)
                        if (m1.isEsPrincipal()) {
                            t.setMiembro1(m1);
                            t.setAnotacionM1(getAnotacion(disp1));
                            t.setMiembro2(m2);
                            t.setAnotacionM2(getAnotacion(disp2));
                        } else {
                            t.setMiembro1(m2);
                            t.setAnotacionM1(getAnotacion(disp2));
                            t.setMiembro2(m1);
                            t.setAnotacionM2(getAnotacion(disp1));
                        }
                        t.setRespaldo(respaldo);
                        return t;
                    }
                }
            }
        }
        return null;
    }

    private boolean cumpleReglas(Miembro m1, Miembro m2, Miembro respaldo, List<Turno> previos, List<Regla> reglas) {
        if (!previos.isEmpty()) {
            Turno anterior = previos.get(previos.size() - 1);
            if(anterior.getMiembro1() != null) {
                Set<Long> idsAnteriores = new HashSet<>();
                if (anterior.getMiembro1() != null) idsAnteriores.add(anterior.getMiembro1().getId());
                if (anterior.getMiembro2() != null) idsAnteriores.add(anterior.getMiembro2().getId());
                if (anterior.getRespaldo() != null) idsAnteriores.add(anterior.getRespaldo().getId());
                
                boolean evitarM1 = reglas.stream().anyMatch(r -> r.getTipo() == Regla.TipoRegla.EVITAR_CONSECUTIVOS && (r.getMiembro() == null || r.getMiembro().getId().equals(m1.getId())));
                boolean evitarM2 = reglas.stream().anyMatch(r -> r.getTipo() == Regla.TipoRegla.EVITAR_CONSECUTIVOS && (r.getMiembro() == null || r.getMiembro().getId().equals(m2.getId())));
                boolean evitarR = reglas.stream().anyMatch(r -> r.getTipo() == Regla.TipoRegla.EVITAR_CONSECUTIVOS && (r.getMiembro() == null || r.getMiembro().getId().equals(respaldo.getId())));

                if (evitarM1 && idsAnteriores.contains(m1.getId())) return false;
                if (evitarM2 && idsAnteriores.contains(m2.getId())) return false;
                if (evitarR && idsAnteriores.contains(respaldo.getId())) return false;
            }
        }
        return true;
    }

    private List<LocalDate> obtenerDias(LocalDate inicio, LocalDate fin) {
        List<LocalDate> dias = new ArrayList<>();
        LocalDate actual = inicio;
        while (!actual.isAfter(fin)) {
            if (actual.getDayOfWeek() == DayOfWeek.TUESDAY || actual.getDayOfWeek() == DayOfWeek.SUNDAY) {
                dias.add(actual);
            }
            actual = actual.plusDays(1);
        }
        return dias;
    }
}
