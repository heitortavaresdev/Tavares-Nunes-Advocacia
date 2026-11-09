const API_URL = 'http://localhost:8080/api';
let currentUser = null;

async function request(url, options = {}) {
    const response = await fetch(url, options);
    if (!response.ok) {
        let message = 'Não foi possível concluir a operação.';
        try {
            const data = await response.json();
            if (data.message) message = data.message;
        } catch (e) {}
        const error = new Error(message);
        error.status = response.status;
        throw error;
    }
    if (response.status === 204) return null;
    return response.json();
}

function showLoginAlert(message) {
    const alert = document.getElementById('loginAlert');
    alert.innerText = message;
    alert.classList.remove('d-none');
}

function showApp() {
    document.getElementById('loginView').classList.add('d-none');
    document.getElementById('appView').classList.remove('d-none');
    document.getElementById('userName').innerText = currentUser.nome;
    document.getElementById('userUnit').innerText = currentUser.unidade.replace('_', ' ');
    navTo('dashboard');
}

document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const senha = document.getElementById('loginSenha').value;
    const unidade = document.getElementById('loginUnidade').value;
    document.getElementById('loginAlert').classList.add('d-none');

    try {
        currentUser = await request(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });
        currentUser.unidade = unidade;
        showApp();
    } catch (error) {
        showLoginAlert(error.message || 'Não foi possível conectar ao sistema. Confira se o back-end está iniciado.');
    }
});

function logout() {
    currentUser = null;
    document.getElementById('appView').classList.add('d-none');
    document.getElementById('loginView').classList.remove('d-none');
}

function navTo(section) {
    document.querySelectorAll('.section-content').forEach(item => item.classList.add('d-none'));
    document.querySelectorAll('.sidebar .nav-link').forEach(item => item.classList.remove('active'));

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

function getUnitQuery() {
    const unit = document.getElementById('unitFilter').value;
    return unit === 'ALL' ? '' : `?unidade=${encodeURIComponent(unit)}`;
}

function filterUnit() {
    loadDashboardData();
}

async function loadDashboardData() {
    const tbody = document.getElementById('tblPrazos');
    tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted py-3">Carregando dados...</td></tr>';

    try {
        const query = getUnitQuery();
        const [prazos, clientes, processos] = await Promise.all([
            request(`${API_URL}/prazos${query}`),
            request(`${API_URL}/clientes`),
            request(`${API_URL}/processos${query}`)
        ]);

        document.getElementById('statPrazos').innerText = prazos.length;
        document.getElementById('statClientes').innerText = clientes.length;
        document.getElementById('statProcessos').innerText = processos.length;

        if (prazos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted py-3">Nenhum prazo cadastrado.</td></tr>';
            return;
        }

        tbody.innerHTML = prazos.map(p => `
            <tr>
                <td class="fw-bold">${escapeHtml(p.descricao)}</td>
                <td><span class="badge bg-secondary">${escapeHtml(p.processo ? p.processo.numeroProcesso : 'N/A')}</span></td>
                <td>${escapeHtml(p.dataLimite || '')}</td>
                <td><span class="badge ${p.status === 'CONCLUIDO' ? 'bg-success' : 'bg-warning text-dark'}">${escapeHtml(p.status || '')}</span></td>
            </tr>
        `).join('');
    } catch (error) {
        document.getElementById('statPrazos').innerText = '—';
        document.getElementById('statClientes').innerText = '—';
        document.getElementById('statProcessos').innerText = '—';
        tbody.innerHTML = `<tr><td colspan="4" class="text-center text-danger py-3">${escapeHtml(error.message)} Verifique se o back-end está rodando.</td></tr>`;
    }
}

function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[character]));
}

async function buscarCliente() {
    const cpfCnpj = document.getElementById('searchCpf').value.trim();
    const resultDiv = document.getElementById('clientSearchResult');
    document.getElementById('selectedClienteId').value = '';

    if (!cpfCnpj) {
        resultDiv.innerHTML = '<div class="alert alert-warning m-0">Digite o CPF/CNPJ do cliente.</div>';
        return;
    }

    try {
        const cliente = await request(`${API_URL}/clientes/buscar?cpfCnpj=${encodeURIComponent(cpfCnpj)}`);
        document.getElementById('selectedClienteId').value = cliente.id;
        resultDiv.innerHTML = `<div class="alert alert-success m-0">Cliente encontrado: <strong>${escapeHtml(cliente.nome)}</strong> (${escapeHtml(cliente.cpfCnpj)})</div>`;
    } catch (error) {
        if (error.status === 404) {
            resultDiv.innerHTML = '<div class="alert alert-warning m-0 d-flex justify-content-between align-items-center"><span>Cliente não cadastrado no sistema.</span><button class="btn btn-sm btn-navy" data-bs-toggle="modal" data-bs-target="#modalNovoCliente">Cadastrar agora</button></div>';
        } else {
            resultDiv.innerHTML = `<div class="alert alert-danger m-0">${escapeHtml(error.message)} Verifique se o back-end está rodando.</div>`;
        }
    }
}

document.getElementById('formNovoCliente').addEventListener('submit', async (event) => {
    event.preventDefault();
    const cliente = {
        nome: document.getElementById('cliNome').value.trim(),
        cpfCnpj: document.getElementById('cliCpf').value.trim(),
        telefone: document.getElementById('cliTelefone').value.trim(),
        email: document.getElementById('cliEmail').value.trim()
    };

    try {
        await request(`${API_URL}/clientes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cliente)
        });
        bootstrap.Modal.getOrCreateInstance(document.getElementById('modalNovoCliente')).hide();
        event.target.reset();
        document.getElementById('searchCpf').value = cliente.cpfCnpj;
        await buscarCliente();
        await loadClientesData();
        alert('Cliente cadastrado com sucesso!');
    } catch (error) {
        alert(`Não foi possível cadastrar o cliente: ${error.message}`);
    }
});

document.getElementById('formProcesso').addEventListener('submit', async (event) => {
    event.preventDefault();
    const clienteId = document.getElementById('selectedClienteId').value;

    if (!clienteId) {
        alert('Busque e vincule um cliente antes de salvar o processo.');
        return;
    }

    const processo = {
        numeroProcesso: document.getElementById('procNumero').value.trim(),
        vara: document.getElementById('procVara').value.trim(),
        status: 'Ativo',
        unidade: currentUser ? currentUser.unidade : 'CAMPINA_GRANDE',
        cliente: { id: Number(clienteId) }
    };

    try {
        const savedProcess = await request(`${API_URL}/processos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(processo)
        });

        const prazo = {
            descricao: document.getElementById('prazoDescricao').value.trim(),
            dataLimite: document.getElementById('prazoData').value,
            status: 'PENDENTE',
            processo: { id: savedProcess.id },
            advogadoResponsavel: currentUser ? { id: currentUser.id } : null
        };

        try {
            await request(`${API_URL}/prazos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(prazo)
            });
        } catch (error) {
            alert(`O processo foi salvo, mas não foi possível salvar o prazo: ${error.message}`);
            return;
        }

        alert('Processo e prazo cadastrados com sucesso!');
        event.target.reset();
        document.getElementById('selectedClienteId').value = '';
        document.getElementById('clientSearchResult').innerHTML = '';
        navTo('dashboard');
    } catch (error) {
        alert(`Não foi possível cadastrar o processo: ${error.message}`);
    }
});

async function loadClientesData() {
    const tbody = document.getElementById('tblClientes');
    tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted py-3">Carregando...</td></tr>';

    try {
        const clientes = await request(`${API_URL}/clientes`);
        if (clientes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted py-3">Nenhum cliente cadastrado.</td></tr>';
            return;
        }
        tbody.innerHTML = clientes.map(cliente => `
            <tr>
                <td class="fw-bold">${escapeHtml(cliente.nome)}</td>
                <td>${escapeHtml(cliente.cpfCnpj)}</td>
                <td>${escapeHtml(cliente.telefone)}</td>
                <td>${escapeHtml(cliente.email)}</td>
            </tr>
        `).join('');
    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center text-danger py-3">${escapeHtml(error.message)} Verifique se o back-end está rodando.</td></tr>`;
    }
}
