// código para o calendario funcionar

// Seletores
const currentMonthYear = document.getElementById("currentMonthYear");
const calendarGrid = document.querySelector(".calendar-grid");
const prevMonthBtn = document.getElementById("prevMonth");
const nextMonthBtn = document.getElementById("nextMonth");
const monthButton = document.querySelector(".today-button");

let currentDate = new Date();

const monthNames = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

// Renderiza o calendário (mantém os headers)
function renderCalendar(date) {
  const year = date.getFullYear();
  const month = date.getMonth();

  currentMonthYear.textContent = `${monthNames[month]} ${year}`;

  // Recria o grid com os cabeçalhos
  calendarGrid.innerHTML = `
    <div class="day-header">DOM</div>
    <div class="day-header">SEG</div>
    <div class="day-header">TER</div>
    <div class="day-header">QUA</div>
    <div class="day-header">QUI</div>
    <div class="day-header">SEX</div>
    <div class="day-header">SAB</div>
  `;

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = firstDay.getDay(); // 0 = domingo
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Preenche dias do mês anterior
  for (let i = startDay - 1; i >= 0; i--) {
    const cell = document.createElement("div");
    cell.className = "calendar-cell outside-month";
    cell.innerHTML = `<span class="day-number">${daysInPrevMonth - i}</span>`;
    calendarGrid.appendChild(cell);
  }

  // Dias do mês atual
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const cell = document.createElement("div");
    cell.className = "calendar-cell";
    cell.innerHTML = `<span class="day-number">${i}</span>`;

    // destaque do dia atual
    const today = new Date();
    if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
      cell.classList.add("today-cell");
    }

    // Permitir selecionar um dia (ao clicar marca seleção)
    cell.addEventListener("click", () => {
      // remove seleção anterior
      const prev = calendarGrid.querySelectorAll(".calendar-cell.selected");
      prev.forEach(p => p.classList.remove("selected"));
      cell.classList.add("selected");

      // Você pode adicionar aqui a lógica de mostrar agendamento, etc.
    });

    calendarGrid.appendChild(cell);
  }

  // Completar com dias do próximo mês para fechar a grade
  const totalCells = calendarGrid.querySelectorAll(".calendar-cell").length;
  const remaining = (7 - (totalCells % 7)) % 7;
  for (let i = 1; i <= remaining; i++) {
    const cell = document.createElement("div");
    cell.className = "calendar-cell outside-month";
    cell.innerHTML = `<span class="day-number">${i}</span>`;
    calendarGrid.appendChild(cell);
  }
}

// Navegação mês a mês
prevMonthBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
});

nextMonthBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
});


// Cria o painel de seleção (DOM)
const monthPicker = document.createElement("div");
monthPicker.id = "monthPicker";
monthPicker.innerHTML = `
  <div class="mp-content" role="dialog" aria-modal="true" aria-label="Selecionar mês e ano">
    <div class="mp-header">
      <button class="mp-year-decr" title="Ano anterior">&lt;</button>
      <input class="mp-year-input" type="number" value="${currentDate.getFullYear()}" />
      <button class="mp-year-incr" title="Próximo ano">&gt;</button>
    </div>
    <div class="mp-months-grid">
      ${monthNames.map((m, idx) => `<button class="mp-month" data-month="${idx}">${m}</button>`).join("")}
    </div>
    <div class="mp-footer">
      <button class="mp-cancel">Cancelar</button>
      <button class="mp-today">Hoje</button>
    </div>
  </div>
`;
document.body.appendChild(monthPicker);

// Referências internas
const mp = document.getElementById("monthPicker");
const mpYearInput = mp.querySelector(".mp-year-input");
const mpYearDecr = mp.querySelector(".mp-year-decr");
const mpYearIncr = mp.querySelector(".mp-year-incr");
const mpMonthButtons = mp.querySelectorAll(".mp-month");
const mpCancel = mp.querySelector(".mp-cancel");
const mpToday = mp.querySelector(".mp-today");

// Abre/fecha o picker
function openMonthPicker() {
  mpYearInput.value = currentDate.getFullYear();
  mp.classList.add("open");
  // posiciona próximo ao botão (opcional) - centraliza por segurança
  setTimeout(() => mp.querySelector(".mp-content").focus(), 50);
}
function closeMonthPicker() {
  mp.classList.remove("open");
}

// Ações: mudar ano
mpYearDecr.addEventListener("click", () => {
  mpYearInput.value = parseInt(mpYearInput.value, 10) - 1;
});
mpYearIncr.addEventListener("click", () => {
  mpYearInput.value = parseInt(mpYearInput.value, 10) + 1;
});

// Selecionar mês (ao clicar em um botão de mês)
mpMonthButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const monthIndex = parseInt(btn.dataset.month, 10);
    const year = parseInt(mpYearInput.value, 10) || currentDate.getFullYear();

    currentDate = new Date(year, monthIndex, 1);
    renderCalendar(currentDate);
    closeMonthPicker();
  });
});

// Cancelar e Hoje
mpCancel.addEventListener("click", closeMonthPicker);
mpToday.addEventListener("click", () => {
  currentDate = new Date();
  renderCalendar(currentDate);
  closeMonthPicker();
});

// Fecha ao clicar fora do painel
mp.addEventListener("click", (e) => {
  if (e.target === mp) closeMonthPicker();
});

// Abre o picker ao clicar no botão .today-button
monthButton.addEventListener("click", (e) => {
  e.stopPropagation();
  if (mp.classList.contains("open")) closeMonthPicker();
  else openMonthPicker();
});

// fecha com ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMonthPicker();
});

// Inicializa
renderCalendar(currentDate);

const API_URL = "http://localhost:3000/consultas";

document.addEventListener("DOMContentLoaded", () => {
  const calendarCells = document.querySelectorAll(".calendar-cell");
  const consultaCard = document.getElementById("consultaCard");
  const consultaInfo = document.getElementById("consultaInfo");
  const diaConsulta = document.querySelector(".dia-da-consulta");
  const psicologaConsulta = document.querySelector(".psicologa-da-consulta");
  const assuntoConsulta = document.querySelector(".assunto-da-consulta");

  const btnAtualizar = document.querySelector(".btn-atualizar");
  const btnDeletar = document.querySelector(".btn-deletar");
  const btnHistorico = document.querySelector(".btn-historico");
  const todayButton = document.querySelector(".today-button");

  let consultas = [];
  let consultaSelecionada = null;

  //  Carregar consultas
  async function carregarConsultas() {
    try {
      const res = await fetch(API_URL);
      consultas = await res.json();
      marcarConsultasNoCalendario();
    } catch (err) {
      console.error("Erro ao carregar consultas", err);
    }
  }

  // Mostrar no calendário
  function marcarConsultasNoCalendario() {
    consultas.forEach(c => {
      calendarCells.forEach(cell => {
        const numero = cell.querySelector(".day-number").innerText.trim();
        if (numero === c.dia) {
          cell.style.backgroundColor = "#a3c9ff";
          cell.style.borderRadius = "8px";
          cell.dataset.consultaId = c.id;
        }
      });
    });
  }

  // Clique no dia
  calendarCells.forEach(cell => {
    cell.addEventListener("click", () => {
      const consultaId = cell.dataset.consultaId;
      if (!consultaId) return;

      consultaSelecionada = consultas.find(c => c.id == consultaId);
      if (!consultaSelecionada) return;

      consultaCard.classList.remove("hidden");
      consultaInfo.innerText = `Data selecionada: ${consultaSelecionada.dia}/${new Date().getMonth() + 1}`;
      diaConsulta.innerText = `Dia: ${consultaSelecionada.dia}`;
      psicologaConsulta.innerText = `Psicóloga: ${consultaSelecionada.psicologo}`;
      assuntoConsulta.innerText = `Assunto: ${consultaSelecionada.assunto}`;
    });
  });

  //  Atualizar
  btnAtualizar.addEventListener("click", async () => {
    if (!consultaSelecionada) return alert("Nenhuma consulta selecionada.");

    const novoAssunto = prompt("Atualize o assunto:", consultaSelecionada.assunto);
    if (novoAssunto === null) return;

    consultaSelecionada.assunto = novoAssunto;
    await fetch(`${API_URL}/${consultaSelecionada.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(consultaSelecionada)
    });

    alert("Consulta atualizada!");
    carregarConsultas();
  });

  //  Deletar
  btnDeletar.addEventListener("click", async () => {
    if (!consultaSelecionada) return alert("Nenhuma consulta selecionada.");

    if (confirm("Deseja realmente deletar esta consulta?")) {
      await fetch(`${API_URL}/${consultaSelecionada.id}`, { method: "DELETE" });
      alert("Consulta deletada!");
      consultaCard.classList.add("hidden");
      carregarConsultas();
    }
  });

  //  Histórico 
  btnHistorico.addEventListener("click", () => {
    let historico = consultas.map(c => `${c.dia} - ${c.horario} (${c.psicologo})`).join("\n");
    alert("Histórico de Consultas:\n" + historico);
  });

  carregarConsultas();
});