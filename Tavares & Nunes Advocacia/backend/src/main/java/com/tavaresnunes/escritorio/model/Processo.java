package com.tavaresnunes.escritorio.model;

import jakarta.persistence.*;

@Entity
@Table(name = "processos")
public class Processo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String numeroProcesso;

    @Column(nullable = false)
    private String vara;

    @Column(nullable = false)
    private String status;

    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Unidade unidade;

    public Processo() {}

    public Processo(String numeroProcesso, String vara, String status, Cliente cliente, Unidade unidade) {
        this.numeroProcesso = numeroProcesso;
        this.vara = vara;
        this.status = status;
        this.cliente = cliente;
        this.unidade = unidade;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNumeroProcesso() { return numeroProcesso; }
    public void setNumeroProcesso(String numeroProcesso) { this.numeroProcesso = numeroProcesso; }

    public String getVara() { return vara; }
    public void setVara(String vara) { this.vara = vara; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente cliente) { this.cliente = cliente; }

    public Unidade getUnidade() { return unidade; }
    public void setUnidade(Unidade unidade) { this.unidade = unidade; }
}
