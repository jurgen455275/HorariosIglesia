package com.scheduler.controller;

import com.scheduler.domain.Rotacion;
import com.scheduler.domain.Usuario;
import com.scheduler.repository.RotacionRepository;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rotaciones")
public class RotacionController {

    private final RotacionRepository rotacionRepository;
    private final com.scheduler.repository.TurnoRepository turnoRepository;
    private final com.scheduler.repository.ReglaRepository reglaRepository;
    private final com.scheduler.repository.DisponibilidadRepository disponibilidadRepository;

    public RotacionController(RotacionRepository rotacionRepository,
                              com.scheduler.repository.TurnoRepository turnoRepository,
                              com.scheduler.repository.ReglaRepository reglaRepository,
                              com.scheduler.repository.DisponibilidadRepository disponibilidadRepository) {
        this.rotacionRepository = rotacionRepository;
        this.turnoRepository = turnoRepository;
        this.reglaRepository = reglaRepository;
        this.disponibilidadRepository = disponibilidadRepository;
    }

    @GetMapping
    public List<Rotacion> getAll(@AuthenticationPrincipal Usuario usuario) {
        return rotacionRepository.findByUsuario(usuario);
    }

    @GetMapping("/{id}")
    public Rotacion getById(@PathVariable Long id, @AuthenticationPrincipal Usuario usuario) {
        Rotacion r = rotacionRepository.findById(id).orElse(null);
        if (r != null && r.getUsuario().getId().equals(usuario.getId())) {
            return r;
        }
        return null;
    }

    @PostMapping
    public Rotacion create(@RequestBody Rotacion rotacion, @AuthenticationPrincipal Usuario usuario) {
        rotacion.setUsuario(usuario);
        return rotacionRepository.save(rotacion);
    }

    @org.springframework.transaction.annotation.Transactional
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id, @AuthenticationPrincipal Usuario usuario) {
        rotacionRepository.findById(id).ifPresent(r -> {
            if (r.getUsuario().getId().equals(usuario.getId())) {
                turnoRepository.deleteByRotacion(r);
                reglaRepository.deleteByRotacion(r);
                disponibilidadRepository.deleteByRotacion(r);
                rotacionRepository.delete(r);
            }
        });
    }
}
