package com.tavaresnunes.escritorio.config;

import com.tavaresnunes.escritorio.model.*;
import com.tavaresnunes.escritorio.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private final AdvogadoRepository advogadoRepo;
    private final ClienteRepository clienteRepo;
    private final ProcessoRepository processoRepo;
    private final PrazoRepository prazoRepo;

    public DataInitializer(AdvogadoRepository advogadoRepo, ClienteRepository clienteRepo,
                           ProcessoRepository processoRepo, PrazoRepository prazoRepo) {
        this.advogadoRepo = advogadoRepo;
        this.clienteRepo = clienteRepo;
        this.processoRepo = processoRepo;
        this.prazoRepo = prazoRepo;
    }

    @Override
    public void run(String... args) throws Exception {
        Advogado adv1 = advogadoRepo.save(new Advogado("Heitor Queiroga", "heitor@tavaresnunes.com", "123456", Unidade.CAMPINA_GRANDE));
        Advogado adv2 = advogadoRepo.save(new Advogado("Dra. Amanda Nunes", "amanda@tavaresnunes.com", "123456", Unidade.JOAO_PESSOA));

        Cliente cli1 = clienteRepo.save(new Cliente("João da Silva", "12345678900", "(83) 98888-1111", "joao@gmail.com"));
        Cliente cli2 = clienteRepo.save(new Cliente("Empresa Paraibana Ltda", "11222333000199", "(83) 3322-4455", "contato@paraibana.com"));

        Processo proc1 = processoRepo.save(new Processo("0001234-56.2026.8.15.0001", "2ª Vara Cível", "Ativo", cli1, Unidade.CAMPINA_GRANDE));
        Processo proc2 = processoRepo.save(new Processo("0009876-12.2026.8.15.0200", "1ª Vara de Família", "Ativo", cli2, Unidade.JOAO_PESSOA));

        prazoRepo.save(new Prazo("Apresentação de Contestação", LocalDate.now().plusDays(3), StatusPrazo.PENDENTE, proc1, adv1));
        prazoRepo.save(new Prazo("Réplica à Contestação", LocalDate.now().plusDays(5), StatusPrazo.PENDENTE, proc2, adv2));
    }
}
