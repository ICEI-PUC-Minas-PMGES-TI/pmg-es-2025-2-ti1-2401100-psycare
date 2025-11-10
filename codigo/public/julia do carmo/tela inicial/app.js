// Embaralhar
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

async function carregarEspecialistas() {
  const res = await fetch("especialistas.json");
  let especialistas = await res.json();

  especialistas = shuffleArray(especialistas);

  const container = document.getElementById("cards-container");

  especialistas.forEach(item => {
    container.innerHTML += `
      <div class="card-psicologo">
        <img src="${item.img}" alt="Foto do psicologo">
        <div class="tags">${item.cargo}</div>
        <div class="tags">${item.estado}</div>
        <h3>${item.nome}</h3>
        <p>${item.descricao}</p>
        <button class="btn-agendarconsulta">Agendar Consulta</button>
      </div>
    `;
  });

  iniciarCarrossel();
}

function iniciarCarrossel() {
  const wrapper = document.querySelector('.cards');
  const prevBtn = document.querySelector('.prev');
  const nextBtn = document.querySelector('.next');

  let currentIndex = 0;
  const cardWidth = 366;
  const cardsPerView = 3;
  const totalCards = wrapper.children.length;

  function updateCarousel() {
    wrapper.style.transform = `translateX(${-currentIndex * cardWidth}px)`;
  }

  nextBtn.addEventListener('click', () => {
    slideForward();
  });

  prevBtn.addEventListener('click', () => {
    slideBackward();
  });

  function slideForward() {
    currentIndex++;
    if (currentIndex > totalCards - cardsPerView) {
      currentIndex = 0;
    }
    updateCarousel();
  }

  function slideBackward() {
    currentIndex--;
    if (currentIndex < 0) {
      currentIndex = totalCards - cardsPerView;
    }
    updateCarousel();
  }

  setInterval(slideForward, 3000);
}

carregarEspecialistas();

