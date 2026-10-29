package com.tavaresnunes.escritorio.repository;

import com.tavaresnunes.escritorio.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    Optional<Cliente> findByCpfCnpj(String cpfCnpj);
}
