package com.tavaresnunes.escritorio.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "prazos")
public class Prazo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String descricao;

    @Column(nullable = false)
    private LocalDate dataLimite;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusPrazo status;

    @ManyToOne
    @JoinColumn(name = "processo_id", nullable = false)
    private Processo processo;

    @ManyToOne
    @JoinColumn(name = "advogado_id")
    private Advogado advogadoResponsavel;

    public Prazo() {}

    public Prazo(String descricao, LocalDate dataLimite, StatusPrazo status, Processo processo, Advogado advogadoResponsavel) {
        this.descricao = descricao;
        this.dataLimite = dataLimite;
        this.status = status;
        this.processo = processo;
        this.advogadoResponsavel = advogadoResponsavel;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public LocalDate getDataLimite() { return dataLimite; }
    public void setDataLimite(LocalDate dataLimite) { this.dataLimite = dataLimite; }

    public StatusPrazo getStatus() { return status; }
    public void setStatus(StatusPrazo status) { this.status = status; }

    public Processo getProcesso() { return processo; }
    public void setProcesso(Processo processo) { this.processo = processo; }

    public Advogado getAdvogadoResponsavel() { return advogadoResponsavel; }
    public void setAdvogadoResponsavel(Advogado advogadoResponsavel) { this.advogadoResponsavel = advogadoResponsavel; }
}
