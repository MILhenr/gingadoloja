// ===== CONFIGURAÇÃO: número do WhatsApp da Gingado (55 + DDD + número) =====
const WHATSAPP = "5511999999999";

// Dados colocados pelo painel admin (fotos, logo, banner, avaliações)
let DATA = { logo: "", hero: { type: "", url: "" }, photos: {}, reviews: {} };

const fmt = v => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const off = p => p.off || 51;
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const G = `<svg class="g" viewBox="0 0 30 26" aria-hidden="true"><path fill="#C8F24A" d="M11 0h17l-2.4 5.6H13.2C9.6 5.6 7.4 7.8 6.5 10.8 5.4 14.6 7.3 17.4 11 17.4h4.3l1.2-2.8H11.8l2.2-5.2h11.4L21 20.6C19.8 23.6 17.4 26 12.4 26H9.6C2.6 26-1.4 20.2.5 13.6 2.3 6.6 6.4 0 11 0z"/></svg>`;

const photosOf = p => [].concat(DATA.photos[p.id] || []).filter(Boolean);
function photo(p, i = 0) {
  const url = photosOf(p)[i];
  return url
    ? `<div class="ph has"><img src="${esc(url)}" alt="${esc(p.name)}" loading="lazy"></div>`
    : `<div class="ph">${DATA.logo ? `<img src="${esc(DATA.logo)}" alt="" style="object-fit:contain;padding:34%">` : G}</div>`;
}
const stars = r => `<span class="stars" style="--r:${r}" aria-label="${r.toFixed(1)} de 5 estrelas">★★★★★</span>`;

function reviewsOf(id) { return DATA.reviews[id] || []; }
function ratingOf(id) {
  const list = reviewsOf(id);
  if (!list.length) return null;
  return { avg: list.reduce((a, r) => a + r.nota, 0) / list.length, count: list.length };
}

// ===== Logo e banner =====
function applyBranding() {
  if (DATA.logo) {
    ["logoTop", "logoFoot"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = `<img class="custom" src="${esc(DATA.logo)}" alt="Gingado">`;
    });
  }
  const hero = document.getElementById("hero");
  if (DATA.hero && DATA.hero.url) {
    hero.classList.add("media");
    hero.querySelectorAll(".hmedia").forEach(e => e.remove());
    const m = DATA.hero.type === "video"
      ? `<video class="hmedia" src="${esc(DATA.hero.url)}" autoplay muted loop playsinline preload="auto"></video>`
      : `<img class="hmedia" src="${esc(DATA.hero.url)}" alt="A melhor loja do Brasil">`;
    hero.insertAdjacentHTML("afterbegin", m);
  }
}

// ===== Catálogo =====
let view = "novidades";
const titles = { novidades: "Novidades", all: "Catálogo completo", chuteiras: "Chuteiras", camisas: "Camisas", boleiro: "Boleiro" };
function renderGrid() {
  const list = view === "novidades" ? PRODUCTS.filter(p => p.novo)
    : view === "all" ? PRODUCTS : PRODUCTS.filter(p => p.cat === view);
  document.getElementById("secTitle").textContent = titles[view];
  document.getElementById("seeAll").style.visibility = view === "all" ? "hidden" : "visible";
  document.querySelectorAll(".menu a").forEach(a => a.setAttribute("aria-current", a.dataset.cat === view));
  document.getElementById("grid").innerHTML = list.length ? list.map(p => `
    <article class="p" data-open="${p.id}" tabindex="0" role="button" aria-label="${esc(p.name)}">
      ${photo(p)}
      <div class="nm">${esc(p.name)}</div>
      <div class="cat">Catálogo completo</div>
      ${p.tag ? `<div class="tag">${esc(p.tag)}</div>` : ""}
      <div class="pr">${fmt(p.price)} no Pix</div>
      <div class="old"><s>${fmt(p.old)}</s><b>${off(p)}% OFF</b></div>
    </article>`).join("") : `<p class="empty">Novidades chegando em breve.</p>`;
}
function setView(v) { view = v; renderGrid(); }

// ===== Produto =====
// Descrição de cada tipo (ou coloque desc:"..." no produto em products.js)
const DESC = {
  futsal: { t: "Chuteira de futsal com sola de borracha lisa, feita pra agarrar na quadra e dar resposta rápida na arrancada e no giro.", l: ["Sola de borracha (indoor)", "Ideal para quadra de madeira ou cimento", "Cabedal macio pra toque de bola", "Palmilha com amortecimento"] },
  society: { t: "Chuteira society com travas baixas (TF) que dão tração na grama sintética sem travar o pé.", l: ["Travas baixas para grama sintética", "Cabedal resistente ao desgaste", "Boa estabilidade nos giros", "Palmilha com amortecimento"] },
  campo: { t: "Chuteira de campo com travas para grama natural, pensada pra velocidade e tração.", l: ["Travas para grama natural", "Cabedal leve", "Encaixe firme no pé", "Indicada para campo"] },
  caneleira: { t: "Caneleira leve e resistente pra proteger no jogo.", l: ["Material rígido e leve", "Encaixe confortável"] },
  massageador: { t: "Massageador elétrico para recuperação muscular depois do jogo e do treino.", l: ["Várias ponteiras", "Bateria recarregável", "Níveis de intensidade"] },
  bolsa: { t: "Bolsinha de jogador pra levar celular, carteira e acessórios pro jogo.", l: ["Tamanho compacto", "Alça lateral", "Zíper resistente"] }
};

const PAGE = 10;
let current = null, size = null, shown = PAGE;

function gallery(p) {
  const list = photosOf(p);
  if (list.length <= 1) return photo(p);
  return `<div class="gal"><div class="track" id="galTrack">${list.map((_, i) => photo(p, i)).join("")}</div>
    <div class="dots">${list.map((_, i) => `<span class="${i ? "" : "on"}"></span>`).join("")}</div></div>`;
}

function reviewsHtml(p) {
  const list = reviewsOf(p.id);
  if (!list.length) return `<p class="noreview">Este produto ainda não tem avaliações.</p>`;
  const r = ratingOf(p.id);
  const dist = [5, 4, 3, 2, 1].map(n => list.filter(x => Math.round(x.nota) === n).length);
  const allPics = list.flatMap(x => x.fotos || []);
  return `
    <div class="rhead">
      <div><div class="avg">${r.avg.toFixed(1).replace(".", ",")}</div><div>${stars(r.avg)}</div><div class="count">${r.count} ${r.count === 1 ? "avaliação" : "avaliações"}</div></div>
      <div class="bars">${dist.map((c, i) => `<div><span>${5 - i}★</span><i><b style="width:${(c / list.length) * 100}%"></b></i><span>${c}</span></div>`).join("")}</div>
    </div>
    ${allPics.length ? `<div class="rphotos">${allPics.slice(0, 40).map(u => `<button data-zoom="${esc(u)}" aria-label="Ampliar foto de cliente"><img src="${esc(u)}" alt="" loading="lazy"></button>`).join("")}</div>` : ""}
    <div id="revList">${list.slice(0, shown).map(rv => `
      <div class="rev">
        <div class="top"><div class="who">${esc(rv.nome) || "Cliente"}</div><div class="meta">${esc(rv.data)}</div></div>
        <div>${stars(rv.nota)}</div>
        ${rv.texto ? `<p style="margin-top:8px">${esc(rv.texto)}</p>` : ""}
        ${(rv.fotos || []).length ? `<div class="pics">${rv.fotos.map(u => `<button data-zoom="${esc(u)}" aria-label="Ampliar foto"><img src="${esc(u)}" alt="" loading="lazy"></button>`).join("")}</div>` : ""}
      </div>`).join("")}</div>
    ${list.length > shown ? `<button class="btn more" id="moreRev">Ver mais avaliações (${list.length - shown})</button>` : ""}`;
}

function openProduct(id) {
  current = PRODUCTS.find(p => p.id === id);
  size = current.sizes.length === 1 ? current.sizes[0] : null;
  shown = PAGE;
  const d = DESC[current.kind] || DESC.futsal;
  const r = ratingOf(current.id);
  const pp = document.getElementById("pp");
  pp.innerHTML = `
   <div class="ptop"><button data-close aria-label="Voltar">‹ Voltar</button><button id="ppCart" aria-label="Abrir sacola">Sacola (${cart.reduce((a, i) => a + i.qty, 0)})</button></div>
   <div class="body">
    ${gallery(current)}
    <div class="main">
      <h1>${esc(current.name)}</h1>
      ${r ? `<button class="rline" id="goRev">${stars(r.avg)} ${r.avg.toFixed(1).replace(".", ",")} (${r.count} ${r.count === 1 ? "avaliação" : "avaliações"})</button>` : ""}
      <div class="p"><div class="old"><s>${fmt(current.old)}</s><b>${off(current)}% OFF</b></div></div>
      <div class="bigpr">${fmt(current.price)} no Pix</div>
      <div class="inst">ou 3x de ${fmt(current.price / 3)} no cartão</div>
      <div class="lbl">Tamanho${current.sizes.length === 1 ? "" : ": <span id='szl'>escolha</span>"}</div>
      <div class="sizes">${current.sizes.map(z => `<button data-size="${z}" aria-pressed="${z == size}">${z}</button>`).join("")}</div>
      <div class="actions">
        <button class="btn btn-black" id="buyNow">Comprar agora</button>
        <button class="btn" style="background:#fff;border:1.5px solid #000" id="addBtn">Adicionar à sacola</button>
      </div>
    </div>
    <section class="blk"><h2>Informações</h2>
      <ul class="info">
        <li><span>🚚</span><div><b>Entrega pra todo o Brasil</b><p>Frete calculado pelo seu CEP no fechamento do pedido.</p></div></li>
        <li><span>💳</span><div><b>Pagamento</b><p>${fmt(current.price)} no Pix ou 3x de ${fmt(current.price / 3)} no cartão.</p></div></li>
        <li><span>🔁</span><div><b>Troca de tamanho</b><p>Não serviu? Fale com a gente pelo WhatsApp pra trocar.</p></div></li>
      </ul>
    </section>
    <section class="blk" id="revs"><h2>Avaliações dos clientes</h2><div id="revBox">${reviewsHtml(current)}</div></section>
    <section class="blk desc"><h2>Descrição</h2>
      <p>${esc(current.desc || d.t)}</p><ul>${d.l.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
    </section>
   </div>`;
  const track = document.getElementById("galTrack");
  if (track) track.addEventListener("scroll", () => {
    const i = Math.round(track.scrollLeft / track.clientWidth);
    pp.querySelectorAll(".gal .dots span").forEach((s, n) => s.classList.toggle("on", n === i));
  }, { passive: true });
  pp.scrollTop = 0; pp.classList.add("show"); pp.setAttribute("aria-hidden", "false");
}
function closeProduct() { const pp = document.getElementById("pp"); pp.classList.remove("show"); pp.setAttribute("aria-hidden", "true"); }
function show(which, v) {
  document.getElementById(which).classList.toggle("show", v);
  document.getElementById("overlay").classList.toggle("show", !!document.querySelector(".drawer.show"));
  if (which === "drawer") document.getElementById("drawer").setAttribute("aria-hidden", v ? "false" : "true");
}
function closeAll() { closeZoom(); closeProduct(); show("drawer", false); }
function zoom(url) { const lb = document.getElementById("lightbox"); lb.querySelector("img").src = url; lb.hidden = false; }
function closeZoom() { const lb = document.getElementById("lightbox"); if (!lb.hidden) { lb.hidden = true; lb.querySelector("img").src = ""; return true; } return false; }

// ===== Sacola =====
let cart = [];
try { cart = JSON.parse(localStorage.getItem("gingado-cart2")) || []; } catch (e) {}
if (!Array.isArray(cart)) cart = [];
const save = () => { try { localStorage.setItem("gingado-cart2", JSON.stringify(cart)); } catch (e) {} };
const find = id => PRODUCTS.find(p => p.id === id);
function toast(m) { const t = document.getElementById("toast"); t.textContent = m; t.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 1700); }

function addToCart() {
  if (size === null) { toast("Escolha o tamanho"); return false; }
  const l = cart.find(i => i.id === current.id && i.size == size);
  l ? l.qty++ : cart.push({ id: current.id, size, qty: 1 });
  save(); renderCart(); toast("Adicionado à sacola"); return true;
}
function renderCart() {
  cart = cart.filter(i => find(i.id));
  const count = cart.reduce((a, i) => a + i.qty, 0), total = cart.reduce((a, i) => a + i.qty * find(i.id).price, 0);
  document.getElementById("count").textContent = count;
  document.getElementById("total").textContent = fmt(total);
  document.getElementById("items").innerHTML = cart.length ? cart.map((i, n) => { const p = find(i.id); return `
    <div class="it">${photo(p)}
      <div><h4>${esc(p.name)}</h4><p>Tamanho ${esc(i.size)}</p>
        <div class="qty"><button data-dec="${n}" aria-label="Diminuir">−</button><span>${i.qty}</span><button data-inc="${n}" aria-label="Aumentar">+</button><button class="rm" data-rm="${n}">Remover</button></div></div>
      <strong>${fmt(p.price * i.qty)}</strong></div>`; }).join("") : `<p class="empty">Sua sacola está vazia.</p>`;
  const name = document.getElementById("cname").value.trim();
  const lines = cart.map(i => { const p = find(i.id); return `• ${p.name}, tam. ${i.size}, ${i.qty} un. (${fmt(p.price * i.qty)})`; });
  const msg = `Olá, Gingado!${name ? ` Aqui é ${name}.` : ""} Quero fazer este pedido:\n\n${lines.join("\n")}\n\nTotal no Pix: ${fmt(total)}\n\nPode me passar o frete pro meu CEP?`;
  const wa = document.getElementById("wa");
  wa.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
  wa.setAttribute("aria-disabled", cart.length ? "false" : "true");
}

// ===== Eventos =====
document.addEventListener("click", e => {
  const z = e.target.closest("[data-zoom]"); if (z) { zoom(z.dataset.zoom); return; }
  if (e.target.closest("#lightbox")) { closeZoom(); return; }
  const a = e.target.closest("[data-cat]"); if (a) { setView(a.dataset.cat); }
  const o = e.target.closest("[data-open]"); if (o) { openProduct(o.dataset.open); return; }
  const b = e.target.closest("button"); if (!b) return;
  if (b.id === "seeAll") setView("all");
  if (b.dataset.size !== undefined) { size = b.dataset.size; document.querySelectorAll(".sizes button").forEach(x => x.setAttribute("aria-pressed", x === b)); const l = document.getElementById("szl"); if (l) l.textContent = size; }
  if (b.id === "addBtn") addToCart();
  if (b.id === "buyNow") { if (addToCart()) { closeProduct(); show("drawer", true); } }
  if (b.id === "ppCart") { closeProduct(); show("drawer", true); }
  if (b.id === "goRev") document.getElementById("revs").scrollIntoView({ behavior: "smooth" });
  if (b.id === "moreRev") { shown += PAGE; document.getElementById("revBox").innerHTML = reviewsHtml(current); }
  if (b.hasAttribute("data-close")) closeProduct();
  if (b.dataset.inc) { cart[+b.dataset.inc].qty++; save(); renderCart(); }
  if (b.dataset.dec) { const i = cart[+b.dataset.dec]; i.qty > 1 ? i.qty-- : cart.splice(+b.dataset.dec, 1); save(); renderCart(); }
  if (b.dataset.rm) { cart.splice(+b.dataset.rm, 1); save(); renderCart(); }
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape") { if (!closeZoom()) closeAll(); }
  if (e.key === "Enter" && e.target.dataset && e.target.dataset.open) openProduct(e.target.dataset.open);
});
document.getElementById("openCart").onclick = () => show("drawer", true);
document.getElementById("closeCart").onclick = () => show("drawer", false);
document.getElementById("overlay").onclick = closeAll;
document.getElementById("cname").addEventListener("input", renderCart);

renderGrid(); renderCart();

// Carrega fotos, logo, banner e avaliações do painel admin
fetch("/api/data", { cache: "no-store" })
  .then(r => r.ok ? r.json() : null)
  .then(d => { if (d) { DATA = { ...DATA, ...d }; applyBranding(); renderGrid(); renderCart(); } })
  .catch(() => {});
