package com.tavaresnunes.escritorio.model;

public enum Unidade {
    CAMPINA_GRANDE("Campina Grande"),
    JOAO_PESSOA("João Pessoa");

    private final String descricao;

    Unidade(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}
