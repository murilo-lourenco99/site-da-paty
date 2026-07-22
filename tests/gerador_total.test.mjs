import test from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import os from "os";
import path from "path";
import { injetarNoHtml } from "../js/gerador_total.mjs";

test("injetarNoHtml substitui o marcador de conteúdo do container", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "gerador-"));
  const arquivo = path.join(tempDir, "pagina.html");

  fs.writeFileSync(
    arquivo,
    '<div id="container-catalogo" class="grade-produtos">\n<!-- CONTEUDO_GERADO -->\n</div>',
  );

  injetarNoHtml(arquivo, "container-catalogo", ["<div class='card'>A</div>"]);

  const conteudo = fs.readFileSync(arquivo, "utf8");
  assert.match(conteudo, /<div id="container-catalogo" class="grade-produtos">/);
  assert.match(conteudo, /<div class='card'>A<\/div>/);
  assert.doesNotMatch(conteudo, /<!-- CONTEUDO_GERADO -->/);
});
