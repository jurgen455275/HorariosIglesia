package com.scheduler.repository;
import com.scheduler.domain.Turno;
import com.scheduler.domain.Rotacion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TurnoRepository extends JpaRepository<Turno, Long> {
    List<Turno> findByRotacionOrderByFechaAsc(Rotacion rotacion);
    void deleteByRotacion(Rotacion rotacion);
}
