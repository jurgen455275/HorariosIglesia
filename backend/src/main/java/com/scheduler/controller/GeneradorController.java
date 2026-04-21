package com.scheduler.controller;

import com.scheduler.domain.Turno;
import com.scheduler.domain.Usuario;
import com.scheduler.service.GeneradorService;
import com.scheduler.repository.RotacionRepository;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rotaciones/{rotacionId}/generar")
public class GeneradorController {

    private final GeneradorService generadorService;
    private final RotacionRepository rotacionRepository;

    public GeneradorController(GeneradorService generadorService, RotacionRepository rotacionRepository) {
        this.generadorService = generadorService;
        this.rotacionRepository = rotacionRepository;
    }

    @PostMapping
    public List<Turno> generar(@PathVariable Long rotacionId, @AuthenticationPrincipal Usuario usuario) {
        boolean isOwner = rotacionRepository.findById(rotacionId)
            .map(r -> r.getUsuario().getId().equals(usuario.getId()))
            .orElse(false);
        if (!isOwner) throw new RuntimeException("Unauthorized");
        
        return generadorService.generarHorario(rotacionId);
    }
}
