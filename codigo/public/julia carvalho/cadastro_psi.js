document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('colaborador-form');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const crp = document.getElementById('crp').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefone = document.getElementById('telefone').value.trim();
        const dataNascimento = document.getElementById('dataNascimento').value;
        const genero = document.getElementById('genero').value;
        const formacao = document.getElementById('formacao').value.trim();
        
        const usuario = document.getElementById('usuario').value.trim();
        const senha = document.getElementById('senha').value;
        const confirmaSenha = document.getElementById('confirma-senha').value;

        const tempoExperienciaInput = document.getElementById('tempoExperiencia').value;
        const tempoExperiencia = parseInt(tempoExperienciaInput) || 0; 
        
        const modalidadeAtendimento = document.getElementById('modalidadeAtendimento').value;
        
        if (senha !== confirmaSenha) {
            alert("Erro de validação: A senha e a confirmação de senha não coincidem!");
            document.getElementById('senha').focus();
            return;
        }

        if (!nome || !crp || !email || !usuario || !senha || !formacao || !modalidadeAtendimento) {
            alert("Erro de validação: Por favor, preencha todos os campos obrigatórios (*).");
            return;
        }

        const dadosPsicologo = {
            psicologo: {
                id: Math.floor(Math.random() * 1000) + 1, 
                nome: nome,
                crp: crp,
                email: email,
                telefone: telefone,
                dataNascimento: dataNascimento,
                genero: genero,
                formacao: formacao,
                tempoExperiencia: tempoExperiencia,
                modalidadeAtendimento: modalidadeAtendimento,
                
                descricaoProfissional: "", 
                especialidade: "", 
                disponibilidade: {
                    dias: [],
                    horarios: []
                },
                
                usuario: usuario,
                senha: `hash_da_senha_segura_${usuario}`, 
                dataCadastro: new Date().toISOString(),
                status: "pendente"
            }
        };
        
        localStorage.setItem('dadosPsicologo', JSON.stringify(dadosPsicologo));
        
        console.log("Dados de cadastro inicial salvos:", dadosPsicologo);
        
        alert("Cadastro inicial concluído! Prosseguindo para o perfil e disponibilidade.");
        
        window.location.href = 'area_psi.html'; 
    });
});