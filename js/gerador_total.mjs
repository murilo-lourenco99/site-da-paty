import fs from "fs";
import path from "path";

const PASTAS = {
  catalogo: "./produtos",
  perfuracoes: "./perfuracoes",
  htmlCatalogo: "./paginas/catalogo.html",
  htmlPerfs: "./paginas/perfuracoes.html",
};

function formatarLabel(arquivo) {
  const nomeBase = path.basename(arquivo).split(".")[0];
  if (nomeBase.includes("_")) {
    const partes = nomeBase.split("_");
    const nome = partes[0].replace(/-/g, " ").trim();
    const preco = partes[1] || "Consulte";
    return `${nome.charAt(0).toUpperCase() + nome.slice(1)} (${preco})`;
  }
  return nomeBase.replace(/-/g, " ").trim();
}

function criarCard(caminho, material = "") {
  const label = formatarLabel(caminho);
  const materialValor = material ? material.toLowerCase() : "";
  return `
    <div class="card-produto" data-material="${materialValor}">
        <img src="../${caminho}" class="img-produto" alt="${label}">
        <div class="info-produto">
            <h3 class="nome-joia">${label}</h3>
        </div>
    </div>`;
}

const injetarNoHtml = (caminho, id, listaCards) => {
  if (!fs.existsSync(caminho)) {
    console.error(
      `❌ Erro: Ficheiro não encontrado em: ${path.resolve(caminho)}`,
    );
    return;
  }

  let conteudo = fs.readFileSync(caminho, "utf-8");

  // Procura o <div id="id" ...> ignorando espaços ou ordem de atributos
  const regex = new RegExp(`<div id="${id}"[^>]*>`, "i");
  const match = conteudo.match(regex);

  if (!match) {
    console.error(
      `❌ Erro: Não encontrei a tag <div id="${id}"> no ficheiro ${caminho}`,
    );
    return;
  }

  const marcadorIni = match[0];
  const marcadorFim = `</div>`;

  const partes = conteudo.split(marcadorIni);
  const resto = partes[1].substring(partes[1].indexOf(marcadorFim));

  const novoConteudo =
    partes[0] + marcadorIni + "\n" + listaCards.join("\n") + "\n" + resto;

  fs.writeFileSync(caminho, novoConteudo, "utf-8");
  console.log(
    `💾 Ficheiro gravado: ${caminho} (${listaCards.length} cards inseridos)`,
  );
};

async function iniciar() {
  try {
    console.log("--- 🏁 Iniciando Atualização ---");
    let joias = [];
    const pastasMateriais = ["Titanio", "Aco"];

    pastasMateriais.forEach((mat) => {
      const pMat = path.join(PASTAS.catalogo, mat);

      if (fs.existsSync(pMat)) {
        console.log(`📂 Entrando na pasta de material: ${mat}`);

        // Lê tudo que tem dentro de Titanio ou Aco
        const itens = fs.readdirSync(pMat);

        itens.forEach((item) => {
          const caminhoItem = path.join(pMat, item);
          const stats = fs.lstatSync(caminhoItem);

          if (stats.isDirectory()) {
            // CASO A: É uma pasta (ex: Septos), vamos ler as fotos dentro dela
            const fotos = fs
              .readdirSync(caminhoItem)
              .filter((f) => f.match(/\.(jpg|jpeg|png)$/i));
            fotos.forEach((img) => {
              joias.push(criarCard(`produtos/${mat}/${item}/${img}`, mat));
            });
          } else if (item.match(/\.(jpg|jpeg|png)$/i)) {
            // CASO B: A foto está solta direto na pasta Titanio/Aco
            joias.push(criarCard(`produtos/${mat}/${item}`, mat));
          }
        });
      } else {
        console.log(`⚠️  Aviso: Pasta não encontrada: ${pMat}`);
      }
    });

    console.log(`🔎 Joias encontradas: ${joias.length}`);

    let perfs = [];
    if (fs.existsSync(PASTAS.perfuracoes)) {
      const imgsPerfs = fs
        .readdirSync(PASTAS.perfuracoes)
        .filter((f) => f.match(/\.(jpg|jpeg|png)$/i));
      imgsPerfs.forEach((img) => {
        perfs.push(criarCard(`perfuracoes/${img}`));
      });
    }

    console.log(`🔎 Perfurações encontradas: ${perfs.length}`);

    // Só tenta injetar se encontrar algo, para não limpar o HTML por erro
    if (joias.length > 0) {
      injetarNoHtml(PASTAS.htmlCatalogo, "container-catalogo", joias);
    } else {
      console.log("⚠️ Nenhuma joia para injetar no catálogo.");
    }

    if (perfs.length > 0) {
      injetarNoHtml(PASTAS.htmlPerfs, "container-perfuracoes", perfs);
    }

    console.log("--- ✅ Processo Concluído ---");
  } catch (e) {
    console.error("❌ Erro fatal:", e.message);
  }
}

iniciar();
