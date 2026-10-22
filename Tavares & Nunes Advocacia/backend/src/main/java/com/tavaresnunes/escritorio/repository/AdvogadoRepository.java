package com.tavaresnunes.escritorio.repository;

import com.tavaresnunes.escritorio.model.Advogado;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AdvogadoRepository extends JpaRepository<Advogado, Long> {
    Optional<Advogado> findByEmail(String email);
}
