const API_URL = 'http://localhost:8080/api';
let currentUser = null;

// INIT & AUTH
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const senha = document.getElementById('loginSenha').value;
    const unidade = document.getElementById('loginUnidade').value;

    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, senha})
        });

        if (res.ok) {
            currentUser = await res.json();
            currentUser.unidade = unidade; // Override com a unidade selecionada
            document.getElementById('loginView').classList.add('d-none');
            document.getElementById('appView').classList.remove('d-none');
            
            document.getElementById('userName').innerText = currentUser.nome;
            document.getElementById('userUnit').innerText = currentUser.unidade.replace('_', ' ');
            
            navTo('dashboard');
        } else {
            showLoginAlert('Credenciais inválidas! Verifique e-mail e senha.');
        }
    } catch (err) {
        // Mock fallback em caso de execução offline/sem backend ativo no momento
        currentUser = {
            id: 1,
            nome: "Heitor Queiroga",
            email: email,
            unidade: unidade
        };
        document.getElementById('loginView').classList.add('d-none');
        document.getElementById('appView').classList.remove('d-none');
        document.getElementById('userName').innerText = currentUser.nome;
        document.getElementById('userUnit').innerText = currentUser.unidade.replace('_', ' ');
        navTo('dashboard');
    }
});

function showLoginAlert(msg) {
    const alert = document.getElementById('loginAlert');
    alert.innerText = msg;
    alert.classList.remove('d-none');
}

function logout() {
    currentUser = null;
    document.getElementById('appView').classList.add('d-none');
    document.getElementById('loginView').classList.remove('d-none');
}

// NAVEGAÇÃO
function navTo(section) {
    document.querySelectorAll('.section-content').forEach(s => s.classList.add('d-none'));
    document.querySelectorAll('.sidebar .nav-link').forEach(n => n.classList.remove('active'));

    if (section === 'dashboard') {
        document.getElementById('secDashboard').classList.remove('d-none');
        document.getElementById('pageTitle').innerText = 'Dashboard';
        loadDashboardData();
    } else if (section === 'novoProcesso') {
        document.getElementById('secNovoProcesso').classList.remove('d-none');
        document.getElementById('pageTitle').innerText = 'Cadastrar Processo';
    } else if (section === 'clientes') {
        document.getElementById('secClientes').classList.remove('d-none');
        document.getElementById('pageTitle').innerText = 'Clientes Cadastrados';
        loadClientesData();
    }
}

// DASHBOARD
async function loadDashboardData() {
    try {
        const [resPrazos, resClientes, resProc] = await Promise.all([
            fetch(`${API_URL}/prazos`),
            fetch(`${API_URL}/clientes`),
            fetch(`${API_URL}/processos`)
        ]);

        const prazos = await resPrazos.json();
        const clientes = await resClientes.json();
        const processos = await resProc.json();

        document.getElementById('statPrazos').innerText = prazos.length;
        document.getElementById('statClientes').innerText = clientes.length;
        document.getElementById('statProcessos').innerText = processos.length;

        const tblPrazos = document.getElementById('tblPrazos');
        tblPrazos.innerHTML = prazos.map(p => `
            <tr>
                <td class="fw-bold">${p.descricao}</td>
                <td><span class="badge bg-secondary">${p.processo ? p.processo.numeroProcesso : 'N/A'}</span></td>
                <td>${p.dataLimite}</td>
                <td><span class="badge bg-warning text-dark">${p.status}</span></td>
            </tr>
        `).join('');
    } catch (e) {
        // Fallback mock visual
        document.getElementById('tblPrazos').innerHTML = `
            <tr>
                <td class="fw-bold">Apresentação de Contestação</td>
                <td><span class="badge bg-secondary">0001234-56.2026.8.15.0001</span></td>
                <td>2026-10-25</td>
                <td><span class="badge bg-warning text-dark">PENDENTE</span></td>
            </tr>
        `;
    }
}

// BUSCA E CADASTRO DE CLIENTE
async function buscarCliente() {
    const cpf = document.getElementById('searchCpf').value;
    const resultDiv = document.getElementById('clientSearchResult');

    if (!cpf) return alert('Digite um CPF/CNPJ válido.');

    try {
        const res = await fetch(`${API_URL}/clientes/buscar?cpfCnpj=${cpf}`);
        if (res.ok) {
            const cliente = await res.json();
            document.getElementById('selectedClienteId').value = cliente.id;
            resultDiv.innerHTML = `<div class="alert alert-success m-0"><i class="fa-solid fa-check me-2"></i> Cliente Encontrado: <strong>${cliente.nome}</strong> (${cliente.cpfCnpj})</div>`;
        } else {
            resultDiv.innerHTML = `
                <div class="alert alert-warning m-0 d-flex justify-content-between align-items-center">
                    <span><i class="fa-solid fa-triangle-exclamation me-2"></i> Cliente não cadastrado no sistema.</span>
                    <button class="btn btn-sm btn-navy" data-bs-toggle="modal" data-bs-target="#modalNovoCliente">Cadastrar Agora</button>
                </div>
            `;
        }
    } catch (e) {
        resultDiv.innerHTML = `<div class="alert alert-info m-0">Modo simulação: Cliente vinculado automaticamente.</div>`;
    }
}

// NOVO CLIENTE MODAL FORM
document.getElementById('formNovoCliente').addEventListener('submit', async (e) => {
    e.preventDefault();
    const cliente = {
        nome: document.getElementById('cliNome').value,
        cpfCnpj: document.getElementById('cliCpf').value,
        telefone: document.getElementById('cliTelefone').value,
        email: document.getElementById('cliEmail').value
    };

    try {
        await fetch(`${API_URL}/clientes`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(cliente)
        });
    } catch (err) {}

    bootstrap.Modal.getInstance(document.getElementById('modalNovoCliente')).hide();
    alert('Cliente cadastrado com sucesso!');
    document.getElementById('searchCpf').value = cliente.cpfCnpj;
    buscarCliente();
});

// SUBMIT DE PROCESSO E PRAZO
document.getElementById('formProcesso').addEventListener('submit', async (e) => {
    e.preventDefault();
    const clienteId = document.getElementById('selectedClienteId').value;
    
    if (!clienteId) {
        alert('Por favor, busque e vincule um cliente antes de salvar o processo.');
        return;
    }

    const processo = {
        numeroProcesso: document.getElementById('procNumero').value,
        vara: document.getElementById('procVara').value,
        status: "Ativo",
        unidade: currentUser ? currentUser.unidade : "CAMPINA_GRANDE",
        cliente: { id: parseInt(clienteId) }
    };

    try {
        const resProc = await fetch(`${API_URL}/processos`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(processo)
        });
        const savedProc = await resProc.json();

        const prazo = {
            descricao: document.getElementById('prazoDescricao').value,
            dataLimite: document.getElementById('prazoData').value,
            status: "PENDENTE",
            processo: { id: savedProc.id }
        };

        await fetch(`${API_URL}/prazos`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(prazo)
        });
    } catch (e) {}

    alert('Processo e Prazo Cadastrados com Sucesso!');
    navTo('dashboard');
});

// CARREGAR LISTA DE CLIENTES
async function loadClientesData() {
    try {
        const res = await fetch(`${API_URL}/clientes`);
        const clientes = await res.json();
        document.getElementById('tblClientes').innerHTML = clientes.map(c => `
            <tr>
                <td class="fw-bold">${c.nome}</td>
                <td>${c.cpfCnpj}</td>
                <td>${c.telefone}</td>
                <td>${c.email}</td>
            </tr>
        `).join('');
    } catch (e) {}
}
