package com.scheduler.repository;
import com.scheduler.domain.Miembro;
import com.scheduler.domain.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MiembroRepository extends JpaRepository<Miembro, Long> {
    List<Miembro> findByUsuario(Usuario usuario);
}
