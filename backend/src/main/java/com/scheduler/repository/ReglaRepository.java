package com.scheduler.repository;
import com.scheduler.domain.Regla;
import com.scheduler.domain.Rotacion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReglaRepository extends JpaRepository<Regla, Long> {
    List<Regla> findByRotacion(Rotacion rotacion);
    
    @org.springframework.transaction.annotation.Transactional
    void deleteByRotacion(Rotacion rotacion);
}
