const API_URL = 'http://localhost:3000/pacientes';

async function cadastrarPaciente(event) {
  event.preventDefault();
  const form = document.getElementById('paciente-form');
  const formData = new FormData(form);
  const senha = formData.get('senha');
  const confirmaSenha = formData.get('confirma-senha');

  if (senha !== confirmaSenha) {
    alert('Senhas não coincidem!');
    return;
  }

  const paciente = {
    nome: formData.get('nome'),
    usuario: formData.get('usuario'),
    email: formData.get('email'),
    senha: senha,  // Simule hash aqui se necessário
    valorMaximo: parseFloat(formData.get('valor-maximo')),
    descricao: formData.get('descricao')
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paciente)
    });
    if (response.ok) {
      alert('Paciente cadastrado com sucesso!');
      form.reset();
    } else {
      alert('Erro ao cadastrar.');
    }
  } catch (error) {
    console.error('Erro:', error);
  }
}

// Função para listar pacientes (READ) - Opcional, para exibir em uma página separada
async function listarPacientes() {
  try {
    const response = await fetch(API_URL);
    const pacientes = await response.json();
    console.log(pacientes);  // Exiba em uma lista ou tabela
  } catch (error) {
    console.error('Erro ao listar:', error);
  }
}

// Função para editar paciente (UPDATE) - Exemplo básico
async function editarPaciente(id, novosDados) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novosDados)
    });
    if (response.ok) {
      alert('Paciente atualizado!');
    }
  } catch (error) {
    console.error('Erro ao editar:', error);
  }
}

// Função para excluir paciente (DELETE)
async function excluirPaciente(id) {
  if (confirm('Tem certeza que deseja excluir?')) {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (response.ok) {
        alert('Paciente excluído!');
        listarPacientes();  // Recarregar lista
      }
    } catch (error) {
      console.error('Erro ao excluir:', error);
    }
  }
}

document.getElementById('paciente-form').addEventListener('submit', cadastrarPaciente);
