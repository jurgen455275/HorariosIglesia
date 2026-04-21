package com.scheduler.repository;
import com.scheduler.domain.Rotacion;
import com.scheduler.domain.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RotacionRepository extends JpaRepository<Rotacion, Long> {
    List<Rotacion> findByUsuario(Usuario usuario);
}
