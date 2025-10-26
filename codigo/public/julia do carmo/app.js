document.addEventListener("DOMContentLoaded", () => {
  const agendarBox = document.querySelector(".agendar-consulta");
  const header = document.querySelector("header");
  const footer = document.querySelector("footer");
  function fixarBox() {
    const headerHeight = header.offsetHeight;
    const footerTop = footer.getBoundingClientRect().top + window.scrollY;
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const boxHeight = agendarBox.offsetHeight;
    const marginTop = 20;
    const marginBottom = 20;

    const boxBottomPos = scrollTop + headerHeight + marginTop + boxHeight + marginBottom;


    if (boxBottomPos < footerTop) {
      agendarBox.style.position = "fixed";
      agendarBox.style.top = `${headerHeight + marginTop}px`;
      agendarBox.style.bottom = "auto";
    } else {

      agendarBox.style.position = "absolute";
      agendarBox.style.top = `${footerTop - boxHeight - marginBottom}px`;
    }
  }

  window.addEventListener("scroll", fixarBox);
  window.addEventListener("resize", fixarBox);
  fixarBox();
});

// código para o calendario funcionar
// script.js - calendário com seletor de mês ativado pelo botão .today-button

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

// ---------- Seletor de mês/ano ativado pelo .today-button ----------

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
