package com.scheduler.controller;

import com.scheduler.domain.Regla;
import com.scheduler.domain.Rotacion;
import com.scheduler.domain.Usuario;
import com.scheduler.repository.ReglaRepository;
import com.scheduler.repository.RotacionRepository;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rotaciones/{rotacionId}/reglas")
public class ReglaController {

    private final ReglaRepository reglaRepository;
    private final RotacionRepository rotacionRepository;

    public ReglaController(ReglaRepository reglaRepository, RotacionRepository rotacionRepository) {
        this.reglaRepository = reglaRepository;
        this.rotacionRepository = rotacionRepository;
    }

    private boolean isOwner(Long rotacionId, Usuario usuario) {
        return rotacionRepository.findById(rotacionId)
            .map(r -> r.getUsuario().getId().equals(usuario.getId()))
            .orElse(false);
    }

    @GetMapping
    public List<Regla> getByRotacion(@PathVariable Long rotacionId, @AuthenticationPrincipal Usuario usuario) {
        if (!isOwner(rotacionId, usuario)) return List.of();
        Rotacion r = rotacionRepository.findById(rotacionId).orElseThrow();
        return reglaRepository.findByRotacion(r);
    }

    @PostMapping
    public Regla createOrUpdate(@PathVariable Long rotacionId, @RequestBody Regla regla, @AuthenticationPrincipal Usuario usuario) {
        if (!isOwner(rotacionId, usuario)) throw new RuntimeException("Unauthorized");
        regla.setRotacion(rotacionRepository.findById(rotacionId).orElseThrow());
        return reglaRepository.save(regla);
    }

    @DeleteMapping("/{reglaId}")
    public void delete(@PathVariable Long rotacionId, @PathVariable Long reglaId, @AuthenticationPrincipal Usuario usuario) {
        if (!isOwner(rotacionId, usuario)) return;
        reglaRepository.findById(reglaId).ifPresent(r -> {
            if(r.getRotacion().getId().equals(rotacionId)) {
                reglaRepository.deleteById(reglaId);
            }
        });
    }
}
