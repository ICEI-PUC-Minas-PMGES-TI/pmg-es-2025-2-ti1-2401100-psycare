document.addEventListener('DOMContentLoaded', () => {
    const disponibilidadeForm = document.getElementById('disponibilidade-form');
    
    const calendarGrid = document.querySelector('.calendar-grid');
    const dayElements = calendarGrid ? calendarGrid.querySelectorAll('.day:not(.faded)') : []; 
    const currentMonthSpan = document.querySelector('.current-month');
    
    let dataAtual = new Date(2025, 0, 1); 
    let datasSelecionadas = []; 

    function carregarDadosExistentes(dadosPsicologo) {
        const psicologo = dadosPsicologo.psicologo;

        document.getElementById('descricaoProfissional').value = psicologo.descricaoProfissional || '';
        document.getElementById('especialidade').value = psicologo.especialidade || '';

        if (psicologo.disponibilidade) {
            const disp = psicologo.disponibilidade;
            
            document.getElementById('horarios-disponiveis').value = (disp.horarios && disp.horarios.length > 0) ? disp.horarios.join(', ') : '';

            document.querySelectorAll('#dias-disponiveis input[type="checkbox"]').forEach(checkbox => {
                if (disp.dias.includes(checkbox.value)) {
                    checkbox.checked = true;
                }
            });
        }
        
        if (psicologo.datasEspecificas && Array.isArray(psicologo.datasEspecificas)) {
             datasSelecionadas = psicologo.datasEspecificas;
        }
    }

    function renderizarCalendario() {
        const mes = dataAtual.getMonth() + 1;
        const ano = dataAtual.getFullYear();
        
        calendarGrid.querySelectorAll('.day:not(.faded)').forEach(dayElement => {
            const day = dayElement.textContent.trim();
            const fullDate = `${ano}-${String(mes).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            
            dayElement.classList.remove('selected-date');

            if (datasSelecionadas.includes(fullDate)) {
                dayElement.classList.add('selected-date');
            }
        });
    }


    function toggleDaySelection(dayElement) {
        if (dayElement.classList.contains('faded')) return;
        
        const day = dayElement.textContent.trim();
        const month = dataAtual.getMonth() + 1;
        const year = dataAtual.getFullYear();
        const fullDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        
        const index = datasSelecionadas.indexOf(fullDate);
        if (index > -1) {
            datasSelecionadas.splice(index, 1);
            dayElement.classList.remove('selected-date');
        } else {
            datasSelecionadas.push(fullDate);
            dayElement.classList.add('selected-date');
        }
        console.log("Datas específicas selecionadas:", datasSelecionadas);
    }
    
    function updateMonthDisplay() {
        if (currentMonthSpan) {
            const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
                           "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
            const mes = meses[dataAtual.getMonth()];
            const ano = dataAtual.getFullYear();
            currentMonthSpan.textContent = `${mes} ${ano}`;
        }
        renderizarCalendario();
    }

    const dadosArmazenados = JSON.parse(localStorage.getItem('dadosPsicologo') || '{"psicologo":{}}');
    carregarDadosExistentes(dadosArmazenados); 
    updateMonthDisplay(); 

    dayElements.forEach(day => {
        day.addEventListener('click', () => {
             toggleDaySelection(day);
        });
    });

    document.querySelectorAll('.month-selector .nav-arrow').forEach(arrow => {
        arrow.addEventListener('click', function() {
            const isNext = this.textContent.trim() === '>';
            dataAtual.setMonth(dataAtual.getMonth() + (isNext ? 1 : -1));
            updateMonthDisplay(); 
        });
    });

    if (disponibilidadeForm) {
        disponibilidadeForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const descricaoProfissional = document.getElementById('descricaoProfissional').value.trim();
            const especialidade = document.getElementById('especialidade').value.trim();
            const horariosInput = document.getElementById('horarios-disponiveis').value.trim();

            const diasSelecionados = Array.from(document.querySelectorAll('#dias-disponiveis input[type="checkbox"]:checked')).map(cb => cb.value);
            const horariosProcessados = horariosInput.split(',').map(h => h.trim()).filter(h => h.length > 0);

            if (!descricaoProfissional || !especialidade) {
                alert("Erro: Os campos 'Descrição Profissional' e 'Especialidade Principal' são obrigatórios.");
                return;
            }
            
            const dadosFinais = JSON.parse(localStorage.getItem('dadosPsicologo') || '{"psicologo":{}}');

            dadosFinais.psicologo.descricaoProfissional = descricaoProfissional;
            dadosFinais.psicologo.especialidade = especialidade;
            
            dadosFinais.psicologo.disponibilidade = {
                dias: diasSelecionados,
                horarios: horariosProcessados
            };
            
            dadosFinais.psicologo.datasEspecificas = datasSelecionadas.sort();
            
            dadosFinais.psicologo.status = "ativo";
            dadosFinais.psicologo.ultimaAtualizacao = new Date().toISOString();

            localStorage.setItem('dadosPsicologo', JSON.stringify(dadosFinais));

            console.log("--- DADOS FINAIS SALVOS NA ESTRUTURA JSON MESTRE ---");
            console.log(dadosFinais);

            alert(`Configuração de perfil e disponibilidade concluída!`);
        });
    }
});