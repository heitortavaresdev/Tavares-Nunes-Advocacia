package com.tavaresnunes.escritorio.repository;

import com.tavaresnunes.escritorio.model.Processo;
import com.tavaresnunes.escritorio.model.Unidade;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProcessoRepository extends JpaRepository<Processo, Long> {
    List<Processo> findByUnidade(Unidade unidade);
}
