package com.scheduler.controller;

import com.scheduler.domain.Miembro;
import com.scheduler.domain.Usuario;
import com.scheduler.repository.MiembroRepository;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/miembros")
public class MiembroController {

    private final MiembroRepository repository;

    public MiembroController(MiembroRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Miembro> getAll(@AuthenticationPrincipal Usuario usuario) {
        return repository.findByUsuario(usuario);
    }

    @PostMapping
    public Miembro create(@RequestBody Miembro miembro, @AuthenticationPrincipal Usuario usuario) {
        miembro.setUsuario(usuario);
        return repository.save(miembro);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id, @AuthenticationPrincipal Usuario usuario) {
        repository.findById(id).ifPresent(m -> {
            if(m.getUsuario().getId().equals(usuario.getId())) {
                repository.delete(m);
            }
        });
    }
}
