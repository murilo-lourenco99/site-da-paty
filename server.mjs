import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORTA = 4000;

// Serve todos os arquivos da pasta raiz (index, CSS, JS, Imagens)
app.use(express.static(__dirname));

// Rota para abrir o index automaticamente
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORTA, () => {
  console.log(`\n Servidor rodando em: http://localhost:${PORTA}`);
});
