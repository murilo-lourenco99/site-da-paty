document.addEventListener("DOMContentLoaded", () => {
  const botoes = document.querySelectorAll(".botao-filtro");
  const cards = document.querySelectorAll(".card-produto");

  console.log(`🔎 Filtro carregado: ${cards.length} cards encontrados.`);

  botoes.forEach((btn) => {
    btn.addEventListener("click", () => {
      // 1. Gerenciar classe ativa nos botões
      botoes.forEach((b) => b.classList.remove("ativo"));
      btn.classList.add("ativo");

      // 2. Pegar o valor do filtro
      const filtroEscolhido = btn
        .getAttribute("data-filtro")
        .toLowerCase()
        .trim();
      console.log(`🎯 Você clicou em: ${filtroEscolhido}`);

      // 3. Filtrar os cards
      cards.forEach((card) => {
        const materialCard = card.getAttribute("data-material");

        // Se o botão for "todos", mostra tudo.
        // Senão, compara o material do card com o filtro do botão
        if (filtroEscolhido === "todos" || materialCard === filtroEscolhido) {
          card.style.display = "flex"; // Ou "block", dependendo do seu layout
        } else {
          card.style.display = "none";
        }
      });
    });
  });
});
