// Servidor simples da loja Gingado (sem dependências externas)
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const PUBLIC = path.join(__dirname, "public");

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

const server = http.createServer((req, res) => {
  // Rota de saúde (o Railway pode usar para checar se o site está no ar)
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    return res.end("ok");
  }

  const urlPath = decodeURIComponent(req.url.split("?")[0]);
  let filePath = path.normalize(path.join(PUBLIC, urlPath));

  // Bloqueia acesso fora da pasta public
  if (!filePath.startsWith(PUBLIC)) {
    res.writeHead(403);
    return res.end("Acesso negado");
  }

  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isDirectory()) filePath = path.join(filePath, "index.html");
    fs.readFile(filePath, (err2, data) => {
      if (err2) {
        // Qualquer rota desconhecida volta para a loja
        return fs.readFile(path.join(PUBLIC, "index.html"), (e, home) => {
          res.writeHead(e ? 404 : 200, { "Content-Type": TYPES[".html"] });
          res.end(e ? "Página não encontrada" : home);
        });
      }
      const type = TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream";
      res.writeHead(200, {
        "Content-Type": type,
        "Cache-Control": type.startsWith("image/") ? "public, max-age=604800" : "no-cache"
      });
      res.end(data);
    });
  });
});

server.listen(PORT, () => console.log(`Loja Gingado rodando na porta ${PORT}`));
