// Servidor da loja Gingado (sem dependências externas)
// Variáveis no Railway:
//   ADMIN_PASSWORD = senha do painel /admin
//   DATA_DIR       = /data  (pasta do Volume, para as fotos e avaliações não sumirem)
const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PORT = process.env.PORT || 3000;
const PUBLIC = path.join(__dirname, "public");
const DATA_DIR = path.resolve(process.env.DATA_DIR || path.join(__dirname, "data"));
const UPLOADS = path.join(DATA_DIR, "uploads");
const DATA_FILE = path.join(DATA_DIR, "loja.json");
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";

fs.mkdirSync(UPLOADS, { recursive: true });

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".webm": "video/webm"
};

// Tipos aceitos no upload (SVG fica de fora por segurança)
const UPLOAD_TYPES = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "video/quicktime": ".mov"
};
TYPES[".mov"] = "video/quicktime";

const EMPTY = { logo: "", hero: { type: "", url: "" }, photos: {}, reviews: {} };

function readData() {
  try {
    const d = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    return { ...EMPTY, ...d };
  } catch {
    return JSON.parse(JSON.stringify(EMPTY));
  }
}

function writeData(d) {
  const tmp = DATA_FILE + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(d));
  fs.renameSync(tmp, DATA_FILE);
}

// Confere o formato dos dados antes de salvar
function cleanData(d) {
  if (!d || typeof d !== "object") throw new Error("formato inválido");
  const str = (v, max = 2000) => (typeof v === "string" ? v.slice(0, max) : "");
  const url = v => {
    const s = str(v, 500);
    return s.startsWith("/uploads/") || s.startsWith("https://") ? s : "";
  };
  const out = {
    logo: url(d.logo),
    hero: { type: ["image", "video"].includes(d.hero && d.hero.type) ? d.hero.type : "", url: url(d.hero && d.hero.url) },
    photos: {},
    reviews: {}
  };
  for (const [id, u] of Object.entries(d.photos || {})) {
    const list = (Array.isArray(u) ? u : [u]).map(url).filter(Boolean).slice(0, 12);
    if (list.length) out.photos[str(id, 80)] = list;
  }
  for (const [id, list] of Object.entries(d.reviews || {})) {
    if (!Array.isArray(list)) continue;
    out.reviews[str(id, 80)] = list.slice(0, 5000).map(r => ({
      id: str(r.id, 40) || crypto.randomBytes(6).toString("hex"),
      nome: str(r.nome, 80),
      nota: Math.min(5, Math.max(1, Number(r.nota) || 5)),
      data: str(r.data, 20),
      texto: str(r.texto, 3000),
      fotos: (Array.isArray(r.fotos) ? r.fotos : []).map(url).filter(Boolean).slice(0, 8)
    }));
  }
  return out;
}

const adminToken = () => crypto.createHash("sha256").update("gingado-admin:" + ADMIN_PASSWORD).digest("hex");

function isAdmin(req) {
  if (!ADMIN_PASSWORD) return false;
  const a = Buffer.from(String(req.headers["x-admin-token"] || ""));
  const b = Buffer.from(adminToken());
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", c => {
      size += c.length;
      if (size > limit) {
        reject(new Error("arquivo muito grande"));
        req.destroy();
      } else chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function sendJson(res, code, obj) {
  res.writeHead(code, { "Content-Type": TYPES[".json"], "Cache-Control": "no-store" });
  res.end(JSON.stringify(obj));
}

// Entrega arquivos com suporte a "Range" (necessário para vídeo no iPhone)
function sendFile(req, res, filePath, cache) {
  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) return false || notFound(req, res);
    const type = TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream";
    const headers = { "Content-Type": type, "Accept-Ranges": "bytes", "Cache-Control": cache };
    const range = req.headers.range;
    if (range) {
      const m = /bytes=(\d*)-(\d*)/.exec(range);
      let start = m && m[1] ? parseInt(m[1], 10) : 0;
      let end = m && m[2] ? parseInt(m[2], 10) : stat.size - 1;
      if (m && !m[1] && m[2]) { start = stat.size - parseInt(m[2], 10); end = stat.size - 1; }
      if (start >= stat.size || end >= stat.size || start > end) {
        res.writeHead(416, { "Content-Range": `bytes */${stat.size}` });
        return res.end();
      }
      res.writeHead(206, { ...headers, "Content-Range": `bytes ${start}-${end}/${stat.size}`, "Content-Length": end - start + 1 });
      return fs.createReadStream(filePath, { start, end }).pipe(res);
    }
    res.writeHead(200, { ...headers, "Content-Length": stat.size });
    fs.createReadStream(filePath).pipe(res);
  });
}

function notFound(req, res) {
  // Qualquer página desconhecida volta para a loja
  sendFile(req, res, path.join(PUBLIC, "index.html"), "no-cache");
}

const server = http.createServer(async (req, res) => {
  try {
    const urlPath = decodeURIComponent(req.url.split("?")[0]);

    if (urlPath === "/health") {
      res.writeHead(200, { "Content-Type": "text/plain" });
      return res.end("ok");
    }

    // ===== API =====
    if (urlPath === "/api/data" && req.method === "GET") {
      return sendJson(res, 200, readData());
    }

    if (urlPath === "/api/login" && req.method === "POST") {
      if (!ADMIN_PASSWORD) return sendJson(res, 503, { error: "Defina a variável ADMIN_PASSWORD no Railway." });
      const body = JSON.parse((await readBody(req, 10_000)).toString() || "{}");
      const ok = typeof body.password === "string" &&
        crypto.createHash("sha256").update(body.password).digest("hex") ===
        crypto.createHash("sha256").update(ADMIN_PASSWORD).digest("hex");
      if (!ok) {
        await new Promise(r => setTimeout(r, 800));
        return sendJson(res, 401, { error: "Senha incorreta." });
      }
      return sendJson(res, 200, { token: adminToken() });
    }

    if (urlPath === "/api/data" && req.method === "POST") {
      if (!isAdmin(req)) return sendJson(res, 401, { error: "Faça login novamente." });
      const body = JSON.parse((await readBody(req, 20 * 1024 * 1024)).toString());
      const clean = cleanData(body);
      writeData(clean);
      return sendJson(res, 200, clean);
    }

    if (urlPath === "/api/upload" && req.method === "POST") {
      if (!isAdmin(req)) return sendJson(res, 401, { error: "Faça login novamente." });
      const type = String(req.headers["content-type"] || "").split(";")[0].trim();
      const ext = UPLOAD_TYPES[type];
      if (!ext) return sendJson(res, 400, { error: "Formato não aceito. Use JPG, PNG, WEBP, MP4 ou MOV." });
      const data = await readBody(req, 80 * 1024 * 1024);
      const name = Date.now().toString(36) + "-" + crypto.randomBytes(5).toString("hex") + ext;
      fs.writeFileSync(path.join(UPLOADS, name), data);
      return sendJson(res, 200, { url: "/uploads/" + name });
    }

    // ===== Arquivos enviados pelo admin =====
    if (urlPath.startsWith("/uploads/")) {
      const f = path.normalize(path.join(UPLOADS, urlPath.slice(9)));
      if (!f.startsWith(UPLOADS + path.sep)) { res.writeHead(403); return res.end(); }
      return sendFile(req, res, f, "public, max-age=31536000, immutable");
    }

    // ===== Painel admin =====
    if (urlPath === "/admin" || urlPath === "/admin/") {
      return sendFile(req, res, path.join(PUBLIC, "admin.html"), "no-store");
    }

    // ===== Site =====
    let filePath = path.normalize(path.join(PUBLIC, urlPath === "/" ? "index.html" : urlPath));
    if (!filePath.startsWith(PUBLIC)) { res.writeHead(403); return res.end(); }
    return sendFile(req, res, filePath, "no-cache");
  } catch (e) {
    const msg = e.message === "arquivo muito grande" ? "Arquivo muito grande (máximo 80 MB)." : "Erro no servidor.";
    if (!res.headersSent) sendJson(res, 400, { error: msg });
  }
});

server.listen(PORT, () => console.log(`Loja Gingado rodando na porta ${PORT}`));
