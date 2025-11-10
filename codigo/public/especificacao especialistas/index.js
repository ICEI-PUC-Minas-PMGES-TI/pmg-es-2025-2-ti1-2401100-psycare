const API_URL = 'http://localhost:3001/especialistas';

let psicologos = [];

async function carregarPsicologos() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`Erro na API: ${response.status}`);
        psicologos = await response.json();
        aplicarFiltro();
    } catch (error) {
        console.error("Erro ao carregar psicólogos:", error);
        document.getElementById('lista-psicologos').innerHTML = '<p>Erro ao carregar dados. Verifique se o JSON Server está rodando na porta 3001.</p>';
    }
}

function aplicarFiltro() {
    const filtro = document.getElementById('filtro-estado').value;
    let filtrados = psicologos;

    if (filtro !== 'todos') {
        filtrados = psicologos.filter(psicologo => psicologo.estado === filtro);
    }

    renderizarLista(filtrados);
}

function renderizarLista(lista) {
    const container = document.getElementById('lista-psicologos');
    container.innerHTML = '';

    if (lista.length === 0) {
        container.innerHTML = '<p>Nenhum psicólogo encontrado para o filtro selecionado.</p>';
        return;
    }

    lista.forEach(psicologo => {
        const item = document.createElement('div');
        item.className = 'psicologo-item';
        item.innerHTML = `
            <h3>${psicologo.nome}</h3>
            <p><strong>CRP:</strong> ${psicologo.crp}</p>
            <p><strong>Email:</strong> ${psicologo.email}</p>
            <p><strong>Telefone:</strong> ${psicologo.telefone}</p>
            <p><strong>Estado:</strong> ${psicologo.estado}</p>
            <p><strong>Formação:</strong> ${psicologo.formacao}</p>
            <p><strong>Tempo de Experiência:</strong> ${psicologo.tempoExperiencia} anos</p>
            <p><strong>Modalidade:</strong> ${psicologo.modalidadeAtendimento}</p>
            <p><strong>Status:</strong> ${psicologo.status}</p>
            <p><strong>Especialidade:</strong> ${psicologo.especialidade || 'Não informado'}</p>
            <p><strong>Descrição:</strong> ${psicologo.descricaoProfissional || 'Não informado'}</p>
        `;
        container.appendChild(item);
    });
}

document.addEventListener('DOMContentLoaded', () => {

    carregarPsicologos();
    document.getElementById('filtro-estado').addEventListener('change', aplicarFiltro);
});