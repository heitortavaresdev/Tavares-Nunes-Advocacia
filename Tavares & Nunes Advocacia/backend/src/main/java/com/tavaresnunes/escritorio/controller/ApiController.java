package com.tavaresnunes.escritorio.controller;

import com.tavaresnunes.escritorio.model.*;
import com.tavaresnunes.escritorio.service.EscritorioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ApiController {

    private final EscritorioService service;

    public ApiController(EscritorioService service) {
        this.service = service;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String senha = payload.get("senha");
        Advogado advogado = service.autenticar(email, senha);
        if (advogado != null) {
            return ResponseEntity.ok(advogado);
        }
        return ResponseEntity.status(401).body(Map.of("message", "Credenciais inválidas!"));
    }

    @GetMapping("/clientes")
    public List<Cliente> getClientes() { return service.listarClientes(); }

    @GetMapping("/clientes/buscar")
    public ResponseEntity<Cliente> buscarCliente(@RequestParam String cpfCnpj) {
        return service.buscarClientePorCpfCnpj(cpfCnpj)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/clientes")
    public Cliente salvarCliente(@RequestBody Cliente cliente) {
        return service.salvarCliente(cliente);
    }

    @GetMapping("/processos")
    public List<Processo> getProcessos(@RequestParam(required = false) Unidade unidade) {
        return service.listarProcessos(unidade);
    }

    @PostMapping("/processos")
    public Processo salvarProcesso(@RequestBody Processo processo) {
        return service.salvarProcesso(processo);
    }

    @GetMapping("/prazos")
    public List<Prazo> getPrazos(@RequestParam(required = false) Unidade unidade) {
        return service.listarPrazos(unidade);
    }

    @PostMapping("/prazos")
    public Prazo salvarPrazo(@RequestBody Prazo prazo) {
        return service.salvarPrazo(prazo);
    }
}
