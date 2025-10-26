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


const API_URL = "http://localhost:3000/consultas";

document.addEventListener("DOMContentLoaded", () => {
  const nome = document.getElementById("nome");
  const celular = document.getElementById("celular");
  const email = document.getElementById("email");
  const mensagem = document.getElementById("mensagem");
  const btnAgendar = document.querySelector(".botao-agendar");
  let diaSelecionado = null;
  let horarioSelecionado = null;

  // Selecionar dia
  document.querySelectorAll(".data-consulta button").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".data-consulta button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      diaSelecionado = btn.querySelector(".dia").innerText;
    });
  });

  // Selecionar horário
  document.querySelectorAll(".horarios button").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".horarios button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      horarioSelecionado = btn.innerText;
    });
  });

  // Enviar dados e redirecionar
  btnAgendar.addEventListener("click", async (e) => {
    e.preventDefault();

    if (!nome.value || !celular.value || !email.value || !diaSelecionado || !horarioSelecionado) {
      alert("Por favor, preencha todos os campos e selecione data e horário!");
      return;
    }

    const consulta = {
      nome: nome.value,
      celular: celular.value,
      email: email.value,
      mensagem: mensagem.value,
      dia: diaSelecionado,
      horario: horarioSelecionado,
      psicologo: "Dr. Mariana Albuquerque",
      assunto: mensagem.value
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(consulta)
      });

      if (response.ok) {
        window.location.href = "agendamentocompleto.html";
      } else {
        alert("Erro ao agendar consulta!");
      }
    } catch (err) {
      console.error(err);
      alert("Falha ao conectar com o servidor.");
    }
  });
});
