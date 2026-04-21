package com.scheduler.controller;

import com.scheduler.domain.Disponibilidad;
import com.scheduler.domain.Rotacion;
import com.scheduler.domain.Usuario;
import com.scheduler.repository.DisponibilidadRepository;
import com.scheduler.repository.RotacionRepository;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rotaciones/{rotacionId}/disponibilidad")
public class DisponibilidadController {

    private final DisponibilidadRepository disponibilidadRepository;
    private final RotacionRepository rotacionRepository;

    public DisponibilidadController(DisponibilidadRepository dispRepo, RotacionRepository rotRepo) {
        this.disponibilidadRepository = dispRepo;
        this.rotacionRepository = rotRepo;
    }

    private boolean isOwner(Long rotacionId, Usuario usuario) {
        return rotacionRepository.findById(rotacionId)
            .map(r -> r.getUsuario().getId().equals(usuario.getId()))
            .orElse(false);
    }

    @GetMapping
    public List<Disponibilidad> getByRotacion(@PathVariable Long rotacionId, @AuthenticationPrincipal Usuario usuario) {
        if (!isOwner(rotacionId, usuario)) return List.of();
        Rotacion r = rotacionRepository.findById(rotacionId).orElseThrow();
        return disponibilidadRepository.findByRotacion(r);
    }

    @PostMapping
    public Disponibilidad createOrUpdate(@PathVariable Long rotacionId, @RequestBody Disponibilidad disp, @AuthenticationPrincipal Usuario usuario) {
        if (!isOwner(rotacionId, usuario)) throw new RuntimeException("Unauthorized");
        disp.setRotacion(rotacionRepository.findById(rotacionId).orElseThrow());
        return disponibilidadRepository.save(disp);
    }

    @DeleteMapping("/{dispId}")
    public void delete(@PathVariable Long rotacionId, @PathVariable Long dispId, @AuthenticationPrincipal Usuario usuario) {
        if (!isOwner(rotacionId, usuario)) return;
        disponibilidadRepository.findById(dispId).ifPresent(d -> {
            if(d.getRotacion().getId().equals(rotacionId)) {
                disponibilidadRepository.deleteById(dispId);
            }
        });
    }
}
