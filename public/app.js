// ===== CONFIGURAÇÃO: número do WhatsApp da Gingado (55 + DDD + número) =====
const WHATSAPP = "5511999999999";

const ADULT=[37,38,39,40,41,42,43,44];
// Foto: salve em public/fotos/ e adicione no produto img:"/fotos/nome-da-foto.jpg"
const products=[
 {id:"caneleira-1",name:"Caneleira 1% Chance",cat:"boleiro",price:42.88,old:63.42,kind:"caneleira",c1:"#F2F2F2",c2:"#222",sizes:["P","M","G"],novo:true},
 {id:"massageador",name:"Massageador Elétrico Profissional",cat:"boleiro",price:89.90,old:135.75,kind:"massageador",c1:"#1a1a1a",c2:"#C9A45C",sizes:["Único"],novo:true},
 {id:"bolsinha",name:"Bolsinha de jogador",cat:"boleiro",tag:"Boleiro",price:54.90,old:81.54,kind:"bolsa",c1:"#6B4A2E",c2:"#C9A45C",sizes:["Único"],novo:true},
 {id:"f50",name:"Adidas F50 Trava Normal",cat:"chuteiras",price:569.00,old:859.19,kind:"campo",c1:"#F4A7B5",c2:"#E24A66",novo:true},
 {id:"tiempo-l4",name:"Nike Tiempo Legend 4",cat:"chuteiras",price:519.00,old:783.69,kind:"futsal",c1:"#F4F4F4",c2:"#1E47C8",novo:true},
 {id:"tiempo-l7",name:"Nike Tiempo Legend 7",cat:"chuteiras",price:519.00,old:783.69,kind:"futsal",c1:"#1E47C8",c2:"#111"},
 {id:"react-gato",name:"Nike React Gato Futsal",cat:"chuteiras",price:559.00,old:844.09,kind:"futsal",c1:"#EDEDED",c2:"#1E47C8"},
 {id:"lunar-gato",name:"Nike Lunar Gato Futsal",cat:"chuteiras",price:519.00,old:783.69,kind:"futsal",c1:"#D9D9D9",c2:"#FF5A3C"},
 {id:"phantom-gt2",name:"Nike Campo Phantom GT 2",cat:"chuteiras",price:609.00,old:919.59,kind:"campo",c1:"#1C1C1C",c2:"#C57A3A"},
 {id:"vapor15-azul",name:"Nike Air Zoom Vapor 15",cat:"chuteiras",price:609.00,old:919.59,kind:"campo",c1:"#F4F4F4",c2:"#2AA7D6"},
 {id:"vapor15-rosa",name:"Nike Air Zoom Vapor 15",cat:"chuteiras",price:609.00,old:919.59,kind:"campo",c1:"#F7B3C2",c2:"#111"},
 {id:"superfly9",name:"Nike Mercurial Superfly 9",cat:"chuteiras",price:549.00,old:828.99,kind:"campo",c1:"#2D55C9",c2:"#E6B04A"},
 {id:"phantom-gx2",name:"Nike Phantom GX 2 Elite",cat:"chuteiras",price:519.00,old:783.69,kind:"society",c1:"#9A9A9A",c2:"#222"},
 {id:"tiempo-r10",name:"Nike Tiempo R10",cat:"chuteiras",price:519.00,old:783.69,kind:"society",c1:"#F4F4F4",c2:"#D4A437"},
 {id:"vapor17",name:"Nike Mercurial Vapor 17",cat:"chuteiras",price:609.00,old:919.59,kind:"campo",c1:"#1E1E28",c2:"#FF4A1C"},
 {id:"premier3",name:"Nike Premier 3 TF",cat:"chuteiras",price:519.00,old:783.69,kind:"society",c1:"#111",c2:"#F4F4F4"},
 {id:"phantom6",name:"Nike Phantom 6 Elite Society",cat:"chuteiras",price:549.00,old:828.99,kind:"society",c1:"#F1E3C4",c2:"#7A1E1E"},
 {id:"merc16",name:"Nike Air Zoom Mercurial 16",cat:"chuteiras",price:469.00,old:708.19,kind:"campo",c1:"#151515",c2:"#333"},
 {id:"joma-pito",name:"Joma Top Flex \"Pito\"",cat:"chuteiras",price:469.00,old:708.19,kind:"futsal",c1:"#2D5BD1",c2:"#C6E83A"},
 {id:"total90",name:"Nike Total 90 Futsal",cat:"chuteiras",price:419.00,old:632.69,kind:"futsal",c1:"#E8C520",c2:"#1C7A34"},
 {id:"tiempo-l9",name:"Nike Tiempo Legend 9",cat:"chuteiras",price:469.00,old:708.19,kind:"campo",c1:"#111",c2:"#222"},
 {id:"joma-topflex",name:"Joma TopFlex Futsal",cat:"chuteiras",price:589.00,old:889.39,kind:"futsal",c1:"#1F4FD0",c2:"#E83A3A"}
];
products.forEach(p=>{ if(!p.sizes) p.sizes=ADULT; });

const fmt=v=>v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const off=p=>p.off||51;
const G=`<svg class="g" viewBox="0 0 30 26" aria-hidden="true"><path fill="#C8F24A" d="M11 0h17l-2.4 5.6H13.2C9.6 5.6 7.4 7.8 6.5 10.8 5.4 14.6 7.3 17.4 11 17.4h4.3l1.2-2.8H11.8l2.2-5.2h11.4L21 20.6C19.8 23.6 17.4 26 12.4 26H9.6C2.6 26-1.4 20.2.5 13.6 2.3 6.6 6.4 0 11 0z"/></svg>`;

function art(p){
  if(p.kind==="caneleira") return `<svg class="item" viewBox="0 0 200 120"><g fill="${p.c1}" stroke="#bbb"><path d="M50 10 Q80 0 92 20 L90 110 Q70 118 52 110 Q38 60 50 10Z"/><path d="M108 10 Q138 0 150 20 L148 110 Q128 118 110 110 Q96 60 108 10Z"/></g><text x="71" y="70" font-size="20" font-weight="900" text-anchor="middle" fill="${p.c2}">99</text><text x="129" y="70" font-size="20" font-weight="900" text-anchor="middle" fill="${p.c2}">1%</text></svg>`;
  if(p.kind==="massageador") return `<svg class="item" viewBox="0 0 200 120"><circle cx="70" cy="40" r="22" fill="${p.c1}"/><rect x="62" y="40" width="56" height="30" rx="8" fill="${p.c1}"/><rect x="104" y="60" width="18" height="52" rx="6" fill="${p.c1}"/><rect x="118" y="44" width="6" height="18" fill="${p.c2}"/><circle cx="160" cy="100" r="10" fill="${p.c1}"/><circle cx="36" cy="102" r="9" fill="${p.c1}"/></svg>`;
  if(p.kind==="bolsa") return `<svg class="item" viewBox="0 0 200 120"><rect x="30" y="30" width="140" height="80" rx="14" fill="${p.c1}"/><path d="M40 34 H160" stroke="${p.c2}" stroke-width="4"/><path d="M160 40 q18 10 0 30" fill="none" stroke="${p.c1}" stroke-width="8"/></svg>`;
  const sole = p.kind==="futsal" ? p.c2 : "#EDEDED";
  const studs = p.kind==="campo" ? [34,62,90,150,176].map(x=>`<path d="M${x} 88 l4 12 h6 l3 -12z" fill="${p.c2}"/>`).join("")
    : p.kind==="society" ? [30,48,66,84,102,120,138,156,174].map(x=>`<rect x="${x}" y="88" width="8" height="6" rx="2" fill="#aaa"/>`).join("") : "";
  return `<svg class="item" viewBox="0 0 210 104">${studs}
    <path d="M14 76 H196 Q199 88 188 90 H22 Q12 88 14 76Z" fill="${sole}"/>
    <path d="M18 78 C14 60 28 50 50 47 L92 40 C102 28 118 26 128 33 L152 54 C174 58 194 62 196 78 Z" fill="${p.c1}" stroke="rgba(0,0,0,.3)" stroke-width="1.5"/>
    <path d="M60 70 C90 66 120 60 150 60" fill="none" stroke="${p.c2}" stroke-width="7" stroke-linecap="round"/>
    <g stroke="${p.c2}" stroke-width="3" stroke-linecap="round" opacity=".85"><line x1="100" y1="40" x2="110" y2="48"/><line x1="110" y1="37" x2="120" y2="45"/><line x1="120" y1="36" x2="130" y2="43"/></g></svg>`;
}
const photo=p=>`<div class="ph">${G}${art(p)}${p.img?`<img src="${p.img}" alt="${p.name}">`:""}</div>`;

// ===== Catálogo =====
let view="novidades";
const titles={novidades:"Novidades",all:"Catálogo completo",chuteiras:"Chuteiras",camisas:"Camisas",boleiro:"Boleiro"};
function renderGrid(){
  const list = view==="novidades" ? products.filter(p=>p.novo)
    : view==="all" ? products : products.filter(p=>p.cat===view);
  document.getElementById("secTitle").textContent=titles[view];
  document.getElementById("seeAll").style.visibility = view==="all"?"hidden":"visible";
  document.querySelectorAll(".menu a").forEach(a=>a.setAttribute("aria-current",a.dataset.cat===view));
  document.getElementById("grid").innerHTML = list.length ? list.map(p=>`
    <article class="p" data-open="${p.id}" tabindex="0" role="button" aria-label="${p.name}">
      ${photo(p)}
      <div class="nm">${p.name}</div>
      <div class="cat">Catálogo completo</div>
      ${p.tag?`<div class="tag">${p.tag}</div>`:""}
      <div class="pr">${fmt(p.price)} no Pix</div>
      <div class="old"><s>${fmt(p.old)}</s><b>${off(p)}% OFF</b></div>
    </article>`).join("") : `<p class="empty">Novidades chegando em breve.</p>`;
}
function setView(v){ view=v; renderGrid(); }

// ===== Produto =====
// Descrição de cada tipo (pode trocar por uma descrição própria em cada produto: desc:"...")
const DESC={
 futsal:{t:"Chuteira de futsal com sola de borracha lisa, feita pra agarrar na quadra e dar resposta rápida na arrancada e no giro.",l:["Sola de borracha (indoor)","Ideal para quadra de madeira ou cimento","Cabedal macio pra toque de bola","Palmilha com amortecimento"]},
 society:{t:"Chuteira society com travas baixas (TF) que dão tração na grama sintética sem travar o pé.",l:["Travas baixas para grama sintética","Cabedal resistente ao desgaste","Boa estabilidade nos giros","Palmilha com amortecimento"]},
 campo:{t:"Chuteira de campo com travas altas para grama natural, pensada pra velocidade e tração.",l:["Travas para grama natural","Cabedal leve","Encaixe firme no pé","Indicada para campo"]},
 caneleira:{t:"Caneleira leve e resistente pra proteger no jogo.",l:["Material rígido e leve","Encaixe confortável"]},
 massageador:{t:"Massageador elétrico para recuperação muscular depois do jogo e do treino.",l:["Várias ponteiras","Bateria recarregável","Níveis de intensidade"]},
 bolsa:{t:"Bolsinha de jogador pra levar celular, carteira e acessórios pro jogo.",l:["Tamanho compacto","Alça lateral","Zíper resistente"]}
};
// Avaliações reais dos clientes: coloque aqui, ex:
// REVIEWS["tiempo-l4"]=[{nome:"Carlos",nota:5,data:"12/09/2026",texto:"Chegou rápido..."}]
const REVIEWS={};

const starStr=n=>"★★★★★".slice(0,Math.round(n))+"☆☆☆☆☆".slice(0,5-Math.round(n));

let current=null, size=null;
function openProduct(id){
  current=products.find(p=>p.id===id); size=current.sizes.length===1?current.sizes[0]:null;
  const d=DESC[current.kind]||DESC.futsal, revs=REVIEWS[current.id]||[];
  const avg=revs.length?revs.reduce((a,r)=>a+r.nota,0)/revs.length:0;
  const pp=document.getElementById("pp");
  pp.innerHTML=`
   <div class="ptop"><button data-close aria-label="Voltar">‹ Voltar</button><button id="ppCart" aria-label="Abrir sacola">Sacola (${cart.reduce((a,i)=>a+i.qty,0)})</button></div>
   <div class="body">
    ${photo(current)}
    <div class="main">
      <h1>${current.name}</h1>
      <button class="rline" id="goRev"><span class="stars">${revs.length?starStr(avg):"☆☆☆☆☆"}</span>${revs.length?`${avg.toFixed(1)} (${revs.length} avaliações)`:"Sem avaliações ainda"}</button>
      <div class="p"><div class="old"><s>${fmt(current.old)}</s><b>${off(current)}% OFF</b></div></div>
      <div class="bigpr">${fmt(current.price)} no Pix</div>
      <div class="inst">ou 3x de ${fmt(current.old/3)} no cartão</div>
      <div class="lbl">Tamanho${size&&current.sizes.length===1?"":": <span id='szl'>escolha</span>"}</div>
      <div class="sizes">${current.sizes.map(z=>`<button data-size="${z}" aria-pressed="${z==size}">${z}</button>`).join("")}</div>
      <div class="actions">
        <button class="btn btn-black" id="buyNow">Comprar agora</button>
        <button class="btn" style="background:#fff;border:1.5px solid #000" id="addBtn">Adicionar à sacola</button>
      </div>
    </div>
    <section class="blk"><h2>Informações</h2>
      <ul class="info">
        <li><span>🚚</span><div><b>Entrega pra todo o Brasil</b><p>Frete calculado pelo seu CEP no fechamento do pedido.</p></div></li>
        <li><span>💳</span><div><b>Pagamento</b><p>${fmt(current.price)} no Pix ou em até 3x no cartão.</p></div></li>
        <li><span>🔁</span><div><b>Troca de tamanho</b><p>Não serviu? Fale com a gente pelo WhatsApp pra trocar.</p></div></li>
        <li><span>📏</span><div><b>Numeração</b><p>Disponível do ${current.sizes[0]} ao ${current.sizes[current.sizes.length-1]}.</p></div></li>
      </ul>
    </section>
    <section class="blk desc"><h2>Descrição</h2>
      <p>${current.desc||d.t}</p><ul>${d.l.map(x=>`<li>${x}</li>`).join("")}</ul>
    </section>
    <section class="blk" id="revs"><h2>Avaliações dos clientes</h2>
      ${revs.length?`<div class="rsum"><div class="avg">${avg.toFixed(1)}</div><div><div class="stars">${starStr(avg)}</div><div class="inst">${revs.length} avaliações</div></div></div>
        ${revs.map(r=>`<div class="rev"><div class="who">${r.nome}</div><div class="meta"><span class="stars">${starStr(r.nota)}</span> ${r.data||""}</div><p>${r.texto}</p></div>`).join("")}`
      :`<p class="noreview">Este produto ainda não tem avaliações.</p>`}
    </section>
   </div>`;
  pp.scrollTop=0; pp.classList.add("show"); pp.setAttribute("aria-hidden","false");
}
function closeProduct(){ const pp=document.getElementById("pp"); pp.classList.remove("show"); pp.setAttribute("aria-hidden","true"); }
function show(which,v){
  document.getElementById(which).classList.toggle("show",v);
  document.getElementById("overlay").classList.toggle("show", !!document.querySelector(".drawer.show"));
  if(which==="drawer") document.getElementById("drawer").setAttribute("aria-hidden",v?"false":"true");
}
function closeAll(){ closeProduct(); show("drawer",false); }

// ===== Sacola =====
let cart=[];
try{ cart=JSON.parse(localStorage.getItem("gingado-cart2"))||[]; }catch(e){}
if(!Array.isArray(cart)) cart=[];
const save=()=>{ try{ localStorage.setItem("gingado-cart2",JSON.stringify(cart)); }catch(e){} };
const find=id=>products.find(p=>p.id===id);
function toast(m){const t=document.getElementById("toast");t.textContent=m;t.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove("show"),1700);}

function addToCart(){
  if(size===null){ toast("Escolha o tamanho"); return false; }
  const l=cart.find(i=>i.id===current.id&&i.size==size);
  l?l.qty++:cart.push({id:current.id,size,qty:1});
  save(); renderCart(); toast("Adicionado à sacola"); return true;
}
function renderCart(){
  cart=cart.filter(i=>find(i.id));
  const count=cart.reduce((a,i)=>a+i.qty,0), total=cart.reduce((a,i)=>a+i.qty*find(i.id).price,0);
  document.getElementById("count").textContent=count;
  document.getElementById("total").textContent=fmt(total);
  document.getElementById("items").innerHTML = cart.length ? cart.map((i,n)=>{const p=find(i.id);return `
    <div class="it">${photo(p)}
      <div><h4>${p.name}</h4><p>Tamanho ${i.size}</p>
        <div class="qty"><button data-dec="${n}" aria-label="Diminuir">−</button><span>${i.qty}</span><button data-inc="${n}" aria-label="Aumentar">+</button><button class="rm" data-rm="${n}">Remover</button></div></div>
      <strong>${fmt(p.price*i.qty)}</strong></div>`}).join("") : `<p class="empty">Sua sacola está vazia.</p>`;
  const name=document.getElementById("cname").value.trim();
  const lines=cart.map(i=>{const p=find(i.id);return `• ${p.name}, tam. ${i.size}, ${i.qty} un. (${fmt(p.price*i.qty)})`});
  const msg=`Olá, Gingado!${name?` Aqui é ${name}.`:""} Quero fazer este pedido:\n\n${lines.join("\n")}\n\nTotal no Pix: ${fmt(total)}\n\nPode me passar o frete pro meu CEP?`;
  const wa=document.getElementById("wa");
  wa.href=`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
  wa.setAttribute("aria-disabled",cart.length?"false":"true");
}

// ===== Eventos =====
document.addEventListener("click",e=>{
  const a=e.target.closest("[data-cat]"); if(a){ setView(a.dataset.cat); }
  const o=e.target.closest("[data-open]"); if(o){ openProduct(o.dataset.open); return; }
  const b=e.target.closest("button"); if(!b) return;
  if(b.id==="seeAll") setView("all");
  if(b.dataset.size!==undefined){ size=b.dataset.size; document.querySelectorAll(".sizes button").forEach(x=>x.setAttribute("aria-pressed",x===b)); const l=document.getElementById("szl"); if(l) l.textContent=size; }
  if(b.id==="addBtn") addToCart();
  if(b.id==="buyNow"){ if(addToCart()){ closeProduct(); show("drawer",true); } }
  if(b.id==="ppCart"){ closeProduct(); show("drawer",true); }
  if(b.id==="goRev") document.getElementById("revs").scrollIntoView({behavior:"smooth"});
  if(b.hasAttribute("data-close")) closeProduct();
  if(b.dataset.inc){ cart[+b.dataset.inc].qty++; save(); renderCart(); }
  if(b.dataset.dec){ const i=cart[+b.dataset.dec]; i.qty>1?i.qty--:cart.splice(+b.dataset.dec,1); save(); renderCart(); }
  if(b.dataset.rm){ cart.splice(+b.dataset.rm,1); save(); renderCart(); }
});
document.addEventListener("keydown",e=>{
  if(e.key==="Escape") closeAll();
  if(e.key==="Enter"&&e.target.dataset&&e.target.dataset.open) openProduct(e.target.dataset.open);
});
document.getElementById("openCart").onclick=()=>show("drawer",true);
document.getElementById("closeCart").onclick=()=>show("drawer",false);
document.getElementById("overlay").onclick=closeAll;
document.getElementById("cname").addEventListener("input",renderCart);

renderGrid(); renderCart();
