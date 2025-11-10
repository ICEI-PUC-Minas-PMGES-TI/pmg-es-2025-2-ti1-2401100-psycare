const API_URL = 'http://localhost:3001/psicologos';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('colaborador-form');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const crp = document.getElementById('crp').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefone = document.getElementById('telefone').value.trim();
        const dataNascimento = document.getElementById('dataNascimento').value;
        const genero = document.getElementById('genero').value;
        const estado = document.getElementById('estado').value;  // Novo campo
        const formacao = document.getElementById('formacao').value.trim();
        const tempoExperienciaInput = document.getElementById('tempoExperiencia').value;
        const tempoExperiencia = parseInt(tempoExperienciaInput) || 0;
        const modalidadeAtendimento = document.getElementById('modalidadeAtendimento').value;
        const usuario = document.getElementById('usuario').value.trim();
        const senha = document.getElementById('senha').value;
        const confirmaSenha = document.getElementById('confirma-senha').value;

        // Validações (incluindo estado obrigatório)
        if (senha !== confirmaSenha) {
            alert("Erro de validação: A senha e a confirmação de senha não coincidem!");
            document.getElementById('senha').focus();
            return;
        }

        if (!nome || !crp || !email || !estado || !usuario || !senha || !formacao || !modalidadeAtendimento) {  // Adicionado !estado
            alert("Erro de validação: Por favor, preencha todos os campos obrigatórios (*).");
            return;
        }

        // Cria objeto do psicólogo (incluindo estado)
        const psicologoData = {
            id: Math.floor(Math.random() * 1000) + 1,
            nome: nome,
            crp: crp,
            email: email,
            telefone: telefone,
            dataNascimento: dataNascimento,
            genero: genero,
            estado: estado,  // Novo campo
            formacao: formacao,
            tempoExperiencia: tempoExperiencia,
            modalidadeAtendimento: modalidadeAtendimento,
            descricaoProfissional: "",
            especialidade: "",
            disponibilidade: {
                dias: [],
                horarios: []
            },
            datasEspecificas: [],
            usuario: usuario,
            senha: `hash_da_senha_segura_${usuario}`,  // Simulação de hash
            dataCadastro: new Date().toISOString(),
            status: "pendente"
        };

        try {
            // Envia para a API via POST
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(psicologoData)
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Psicólogo cadastrado com sucesso:", data);
                alert("Cadastro inicial concluído! Prosseguindo para o perfil e disponibilidade.");
                
                // Salva temporariamente no localStorage para a próxima tela (opcional, se precisar)
                localStorage.setItem('dadosPsicologo', JSON.stringify({ psicologo: psicologoData }));
                
                // Redireciona
                window.location.href = 'area_psi.html';
            } else {
                throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.error("Erro ao cadastrar psicólogo:", error);
            alert("Erro ao salvar os dados. Verifique se o JSON Server está rodando na porta 3001.");
        }
    });
});