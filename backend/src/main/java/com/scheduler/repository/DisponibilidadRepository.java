package com.scheduler.repository;
import com.scheduler.domain.Disponibilidad;
import com.scheduler.domain.Rotacion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DisponibilidadRepository extends JpaRepository<Disponibilidad, Long> {
    List<Disponibilidad> findByRotacion(Rotacion rotacion);
    
    @org.springframework.transaction.annotation.Transactional
    void deleteByRotacion(Rotacion rotacion);
}
