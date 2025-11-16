
const API_URL = "http://localhost:3001/psicologos";

async function carregarPsicologos() {
  try {
    const response = await fetch(API_URL);
    const psicologos = await response.json();

    const container = document.getElementById("cards-container");
    if (!container) {
      console.error("cards-container não encontrado!");
      return;
    }

    container.innerHTML = "";

    psicologos.forEach(psicologo => {
      const card = document.createElement("div");
      card.classList.add("card-psicologo");

      const foto = psicologo.img && psicologo.img.trim() !== ""
        ? psicologo.img
        : "imgs/psi_default.png";

      const cargo = psicologo.cargo || psicologo.especialidade || "Profissional";
      const estado = psicologo.estado || "Não informado";
      const descricao = psicologo.descricaoProfissional || psicologo.descricao || "Descrição não informada";

      card.innerHTML = `
        <img src="${foto}" alt="Foto do psicólogo">
        <div class="tags">${cargo}</div>
        <div class="tags">${estado}</div>
        <h3>${psicologo.nome}</h3>
        <p>${descricao}</p>
        <button class="btn-agendarconsulta">Agendar Consulta</button>
      `;

      container.appendChild(card);
    });


    iniciarCarrossel();
  } catch (erro) {
    console.error("Erro ao carregar psicólogos:", erro);
  }
}

function iniciarCarrossel() {
  const wrapper = document.querySelector('.cards');
  const prevBtn = document.querySelector('.prev');
  const nextBtn = document.querySelector('.next');
  const carouselWrapper = document.querySelector('.carousel-wrapper');

  if (!wrapper || !prevBtn || !nextBtn || !carouselWrapper) {
    console.error('Elementos do carrossel não encontrados (wrapper/prev/next/carousel-wrapper).');
    return;
  }

  let currentIndex = 0;
  let cardWidth = 0;
  let gap = 0;
  let totalCards = 0;
  let visibleCount = 1;
  let autoplayId = null;

  function calculaTamanhos() {
    const firstCard = wrapper.querySelector('.card-psicologo');
    totalCards = wrapper.children.length;


    if (!firstCard || totalCards === 0) {
      cardWidth = 0;
      visibleCount = 0;
      return;
    }


    cardWidth = firstCard.offsetWidth;


    const styles = getComputedStyle(wrapper);
    gap = parseFloat(styles.columnGap || styles.gap) || 0;


    const available = carouselWrapper.clientWidth;
    visibleCount = Math.max(1, Math.floor((available + gap) / (cardWidth + gap)));


    if (currentIndex > totalCards - visibleCount) {
      currentIndex = Math.max(0, totalCards - visibleCount);
    }
  }

  function updateCarousel(animated = true) {

    const moveX = currentIndex * (cardWidth + gap);
    if (!animated) wrapper.style.transition = 'none';
    else wrapper.style.transition = '';
    wrapper.style.transform = `translateX(${-moveX}px)`;
  }

  function next() {
    if (totalCards <= visibleCount) {

      currentIndex = 0;
      updateCarousel();
      return;
    }

    currentIndex++;
    if (currentIndex > totalCards - visibleCount) {
      currentIndex = 0;
    }
    updateCarousel();
  }

  function prev() {
    if (totalCards <= visibleCount) {
      currentIndex = 0;
      updateCarousel();
      return;
    }

    currentIndex--;
    if (currentIndex < 0) {
      currentIndex = Math.max(0, totalCards - visibleCount);
    }
    updateCarousel();
  }


  nextBtn.removeEventListener('click', next);
  prevBtn.removeEventListener('click', prev);
  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);


  let resizeObserver = null;
  if (window.ResizeObserver) {
    resizeObserver = new ResizeObserver(() => {
      calculaTamanhos();
      updateCarousel(false);
    });
    resizeObserver.observe(carouselWrapper);
  } else {
    window.addEventListener('resize', () => {
      calculaTamanhos();
      updateCarousel(false);
    });
  }


  if (autoplayId) clearInterval(autoplayId);
  autoplayId = setInterval(next, 3000);

  carouselWrapper.addEventListener('mouseenter', () => {
    clearInterval(autoplayId);
  });
  carouselWrapper.addEventListener('mouseleave', () => {
    autoplayId = setInterval(next, 3000);
  });


  calculaTamanhos();
  updateCarousel(false);
}


document.addEventListener("DOMContentLoaded", carregarPsicologos);


setInterval(() => {
  const nextBtn = document.querySelector(".next");
  if (nextBtn) nextBtn.click();
}, 3000);