package com.tavaresnunes.escritorio.service;

import com.tavaresnunes.escritorio.model.*;
import com.tavaresnunes.escritorio.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EscritorioService {

    private final AdvogadoRepository advogadoRepository;
    private final ClienteRepository clienteRepository;
    private final ProcessoRepository processoRepository;
    private final PrazoRepository prazoRepository;

    public EscritorioService(AdvogadoRepository advogadoRepository, ClienteRepository clienteRepository,
                             ProcessoRepository processoRepository, PrazoRepository prazoRepository) {
        this.advogadoRepository = advogadoRepository;
        this.clienteRepository = clienteRepository;
        this.processoRepository = processoRepository;
        this.prazoRepository = prazoRepository;
    }

    public Advogado autenticar(String email, String senha) {
        return advogadoRepository.findByEmail(email)
                .filter(a -> a.getSenha().equals(senha))
                .orElse(null);
    }

    public List<Cliente> listarClientes() { return clienteRepository.findAll(); }
    public Optional<Cliente> buscarClientePorCpfCnpj(String cpfCnpj) { return clienteRepository.findByCpfCnpj(cpfCnpj); }
    public Cliente salvarCliente(Cliente cliente) { return clienteRepository.save(cliente); }

    public List<Processo> listarProcessos(Unidade unidade) {
        return unidade != null ? processoRepository.findByUnidade(unidade) : processoRepository.findAll();
    }
    public Processo salvarProcesso(Processo processo) { return processoRepository.save(processo); }

    public List<Prazo> listarPrazos(Unidade unidade) {
        return unidade != null ? prazoRepository.findByProcessoUnidade(unidade) : prazoRepository.findAll();
    }
    public Prazo salvarPrazo(Prazo prazo) { return prazoRepository.save(prazo); }
}
