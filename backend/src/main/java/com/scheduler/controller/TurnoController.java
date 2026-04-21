package com.scheduler.controller;

import com.scheduler.domain.Turno;
import com.scheduler.domain.Rotacion;
import com.scheduler.domain.Usuario;
import com.scheduler.repository.TurnoRepository;
import com.scheduler.repository.RotacionRepository;
import com.scheduler.service.ExcelExportService;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.util.List;

@RestController
@RequestMapping("/api/rotaciones/{rotacionId}/turnos")
public class TurnoController {

    private final TurnoRepository turnoRepository;
    private final RotacionRepository rotacionRepository;
    private final ExcelExportService excelExportService;

    public TurnoController(TurnoRepository turnoRepository, RotacionRepository rotacionRepository, ExcelExportService excelExportService) {
        this.turnoRepository = turnoRepository;
        this.rotacionRepository = rotacionRepository;
        this.excelExportService = excelExportService;
    }

    @GetMapping
    public List<Turno> getByRotacion(@PathVariable Long rotacionId, @AuthenticationPrincipal Usuario usuario) {
        Rotacion r = rotacionRepository.findById(rotacionId).orElseThrow();
        if(!r.getUsuario().getId().equals(usuario.getId())) return List.of();
        return turnoRepository.findByRotacionOrderByFechaAsc(r);
    }

    @GetMapping("/exportar")
    public ResponseEntity<InputStreamResource> exportar(@PathVariable Long rotacionId, @AuthenticationPrincipal Usuario usuario) {
        Rotacion r = rotacionRepository.findById(rotacionId).orElseThrow();
        if(!r.getUsuario().getId().equals(usuario.getId())) return ResponseEntity.status(403).build();
        List<Turno> turnos = turnoRepository.findByRotacionOrderByFechaAsc(r);
        ByteArrayInputStream in = excelExportService.exportarTurnos(turnos);
        
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=horario_" + r.getNombre().replace(" ", "_") + ".xlsx");
        return ResponseEntity.ok()
            .headers(headers)
            .contentType(MediaType.parseMediaType("application/vnd.ms-excel"))
            .body(new InputStreamResource(in));
    }
}
