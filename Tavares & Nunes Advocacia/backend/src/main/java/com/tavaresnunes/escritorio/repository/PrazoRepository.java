package com.tavaresnunes.escritorio.repository;

import com.tavaresnunes.escritorio.model.Prazo;
import com.tavaresnunes.escritorio.model.Unidade;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PrazoRepository extends JpaRepository<Prazo, Long> {
    List<Prazo> findByProcessoUnidade(Unidade unidade);
}
