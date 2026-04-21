package com.scheduler.domain;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "turnos")
public class Turno {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate fecha;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne
    @JoinColumn(name = "rotacion_id", nullable = false)
    private Rotacion rotacion;

    @ManyToOne
    @JoinColumn(name = "miembro1_id")
    private Miembro miembro1;

    @ManyToOne
    @JoinColumn(name = "miembro2_id")
    private Miembro miembro2;

    @ManyToOne
    @JoinColumn(name = "respaldo_id")
    private Miembro respaldo;

    @Column
    private String anotacionM1;

    @Column
    private String anotacionM2;

    public Turno() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }
    public Rotacion getRotacion() { return rotacion; }
    public void setRotacion(Rotacion rotacion) { this.rotacion = rotacion; }
    public Miembro getMiembro1() { return miembro1; }
    public void setMiembro1(Miembro miembro1) { this.miembro1 = miembro1; }
    public Miembro getMiembro2() { return miembro2; }
    public void setMiembro2(Miembro miembro2) { this.miembro2 = miembro2; }
    public Miembro getRespaldo() { return respaldo; }
    public void setRespaldo(Miembro respaldo) { this.respaldo = respaldo; }
    
    public String getAnotacionM1() { return anotacionM1; }
    public void setAnotacionM1(String anotacionM1) { this.anotacionM1 = anotacionM1; }
    
    public String getAnotacionM2() { return anotacionM2; }
    public void setAnotacionM2(String anotacionM2) { this.anotacionM2 = anotacionM2; }
}
