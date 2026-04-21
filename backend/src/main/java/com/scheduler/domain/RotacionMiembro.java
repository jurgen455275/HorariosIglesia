package com.scheduler.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "rotacion_miembro")
public class RotacionMiembro {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rotacion_id", nullable = false)
    private Rotacion rotacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "miembro_id", nullable = false)
    private Miembro miembro;

    public RotacionMiembro() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Rotacion getRotacion() { return rotacion; }
    public void setRotacion(Rotacion rotacion) { this.rotacion = rotacion; }
    public Miembro getMiembro() { return miembro; }
    public void setMiembro(Miembro miembro) { this.miembro = miembro; }
}
