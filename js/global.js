document.addEventListener("DOMContentLoaded", () => {
  // Atualização Automática do Ano no Footer
  const footerP = document.querySelector(".main-footer p");
  if (footerP) {
    footerP.innerHTML = `&copy; ${new Date().getFullYear()} Patrícia Lourenço`;
  }

  const menuToggle = document.getElementById("menu-toggle");
  const mainNav = document.getElementById("main-nav");

  /* Função para alternar o menu */
  function toggleMenu() {
    mainNav.classList.toggle("active");
  }

  /* Função para fechar o menu */
  function closeMenu() {
    mainNav.classList.remove("active");
  }

  /* Evento de clique no ícone hambúrguer */
  if (menuToggle) {
    menuToggle.addEventListener("click", (e) => {
      e.preventDefault();
      toggleMenu();
    });
  }

  /* Evento de clique nos links internos */
  const navLinks = document.querySelectorAll(".main-nav a");
  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
});
