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
