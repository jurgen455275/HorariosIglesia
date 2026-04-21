package com.scheduler.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "disponibilidad")
public class Disponibilidad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "miembro_id", nullable = false)
    private Miembro miembro;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne
    @JoinColumn(name = "rotacion_id", nullable = false)
    private Rotacion rotacion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DiaSemana diaSemana;

    @Column(nullable = false)
    private boolean disponible;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FranjaHoraria franjaHoraria = FranjaHoraria.COMPLETA;

    public enum FranjaHoraria { COMPLETA, PRIMERA_MITAD, SEGUNDA_MITAD }

    public Disponibilidad() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Miembro getMiembro() { return miembro; }
    public void setMiembro(Miembro miembro) { this.miembro = miembro; }
    public Rotacion getRotacion() { return rotacion; }
    public void setRotacion(Rotacion rotacion) { this.rotacion = rotacion; }
    public DiaSemana getDiaSemana() { return diaSemana; }
    public void setDiaSemana(DiaSemana diaSemana) { this.diaSemana = diaSemana; }
    public boolean isDisponible() { return disponible; }
    public void setDisponible(boolean disponible) { this.disponible = disponible; }
    public FranjaHoraria getFranjaHoraria() { return franjaHoraria; }
    public void setFranjaHoraria(FranjaHoraria franjaHoraria) { this.franjaHoraria = franjaHoraria; }

    public enum DiaSemana { MARTES, DOMINGO }
}
