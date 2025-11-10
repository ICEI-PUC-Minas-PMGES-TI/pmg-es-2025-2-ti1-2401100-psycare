const API_URL = 'http://localhost:3001/psicologos';

let psicologos = [];

const imagens = {
};

async function carregarPsicologos() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`Erro na API: ${response.status}`);
    psicologos = await response.json();
    aplicarFiltro();
  } catch (err) {
    console.error(err);
    document.getElementById('lista-psicologos').innerHTML =
      '<p>Erro ao carregar dados. Verifique o servidor.</p>';
  }
}

function aplicarFiltro() {
  const filtro = document.getElementById('filtro-estado').value;
  let filtrados = psicologos;

  if (filtro !== 'todos') {
    filtrados = psicologos.filter((p) => p.estado === filtro);
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

  lista.forEach((psicologo) => {
    const card = document.createElement('article');
    card.className = 'psicologo-card';

    // Definir imagem — usar a do map ou fallback genérico
    const imgSrc = imagens[psicologo.nome] || 'https://via.placeholder.com/400x300?text=Imagem+Não+Disponível';

    // Obter especialidades em array (se tiver; aqui simulo com especialidade e modalidade)
    let tags = [];
    if (psicologo.especialidade) tags.push(psicologo.especialidade);
    if (psicologo.modalidadeAtendimento) tags.push(psicologo.modalidadeAtendimento);

    card.innerHTML = `
    <img src="${imgSrc}" alt="Foto de ${psicologo.nome}">
    <h3>${psicologo.nome}</h3>
    <div class="tags-container"> 
        <span class="tags">${psicologo.especialidade || ''}</span>
    </div>
    <div class="tags-container">
        <span class="tags">${psicologo.modalidadeAtendimento || ''}</span>
    </div>
    <p>${psicologo.descricaoProfissional || 'Sem descrição disponível.'}</p>
    <button class="btn-agendarconsulta">Agendar Consulta</button>
    `;


    container.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  carregarPsicologos();

  document.getElementById('filtro-estado').addEventListener('change', aplicarFiltro);
});