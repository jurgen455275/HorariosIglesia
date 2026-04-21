package com.scheduler.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "reglas")
public class Regla {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne
    @JoinColumn(name = "rotacion_id", nullable = false)
    private Rotacion rotacion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoRegla tipo;

    @Column(columnDefinition = "TEXT")
    private String valor;

    @ManyToOne
    @JoinColumn(name = "miembro_id") // Opcional
    private Miembro miembro;

    public Regla() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Rotacion getRotacion() { return rotacion; }
    public void setRotacion(Rotacion rotacion) { this.rotacion = rotacion; }
    public TipoRegla getTipo() { return tipo; }
    public void setTipo(TipoRegla tipo) { this.tipo = tipo; }
    public String getValor() { return valor; }
    public void setValor(String valor) { this.valor = valor; }
    public Miembro getMiembro() { return miembro; }
    public void setMiembro(Miembro miembro) { this.miembro = miembro; }

    public enum TipoRegla { SOLO_DIAS, INCLUIR_AL_MENOS_UNO, EVITAR_CONSECUTIVOS, SIN_PRINCIPAL_OBLIGATORIO }
}
