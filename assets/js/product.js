/* ==========================================================
   Joudy Design — page produit
   ========================================================== */
(() => {
  "use strict";
  const { $, $$, gallery, byId, catLabel, fmtPrice, waLink, cardHTML, addToCart, toast, openCart, observeReveal, esc } = window.JD;

  const id = new URLSearchParams(location.search).get("id");
  const p = byId(id);

  if (!p) {
    $("#pdpMain").hidden = true;
    $("#related").hidden = true;
    $(".crumbs").hidden = true;
    $("#notFound").hidden = false;
    $("#buybar").remove();
    document.title = "Modèle introuvable — Joudy Design";
    return;
  }

  /* ---------- Infos ---------- */
  document.title = `${p.name} — Joudy Design`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.content = `${p.name} : ${p.fabric}, ${p.detail}. Fait main au Maroc par Joudy Design.`;
  $("#crumbCat").textContent = catLabel(p.cat);
  $("#crumbCat").href = "index.html#collection";
  $("#crumbName").textContent = p.name;
  $("#pCat").textContent = catLabel(p.cat);
  $("#pName").textContent = p.name;
  $("#pPrice").textContent = fmtPrice(p.price);
  $("#pPrice").classList.toggle("is-ask", p.price == null);
  $("#pLead").textContent = `${p.fabric} — ${p.detail}.`;
  $("#pFabric").textContent = p.fabric;
  $("#pDesc").innerHTML = `
    <p>Le ${esc(p.name)} est une pièce signée Joudy Design, taillée dans un ${esc(p.fabric.toLowerCase())} et rehaussée de finitions traditionnelles : ${esc(p.detail.toLowerCase())}.</p>
    <p>Coupe ample et fluide, pensée pour le confort comme pour les grandes occasions. Chaque pièce est confectionnée et finie à la main au Maroc : de légères variations font son caractère.</p>`;
  $("#newTag").hidden = !p.isNew;
  $("#bbName").textContent = p.name;
  $("#bbPrice").textContent = fmtPrice(p.price);

  /* ---------- Galerie ---------- */
  const pics = gallery(p.id);
  let idx = 0;
  const mainImg = $("#mainImg");
  $("#thumbs").innerHTML = pics.map((src, i) =>
    `<button type="button" class="pdp__thumb" role="listitem" data-i="${i}" aria-label="Photo ${i + 1}" aria-current="${i === 0}"><img src="${src}" alt=""></button>`
  ).join("");
  $("#dots").innerHTML = pics.map((_, i) => `<span data-i="${i}"></span>`).join("");
  const many = pics.length > 1;
  $("#prevImg").hidden = !many;
  $("#nextImg").hidden = !many;
  $("#thumbs").hidden = !many;
  $("#dots").hidden = !many;

  function show(i) {
    idx = (i + pics.length) % pics.length;
    mainImg.classList.add("is-fading");
    setTimeout(() => {
      mainImg.src = pics[idx];
      mainImg.alt = `${p.name} — photo ${idx + 1} sur ${pics.length}`;
      mainImg.classList.remove("is-fading");
    }, 150);
    $$(".pdp__thumb").forEach((t) => t.setAttribute("aria-current", +t.dataset.i === idx));
    $$("#dots span").forEach((d) => d.classList.toggle("on", +d.dataset.i === idx));
  }
  mainImg.src = pics[0];
  mainImg.alt = `${p.name} — photo 1 sur ${pics.length}`;
  $$("#dots span")[0]?.classList.add("on");
  $("#thumbs").addEventListener("click", (e) => { const t = e.target.closest("[data-i]"); if (t) show(+t.dataset.i); });
  $("#prevImg").addEventListener("click", () => show(idx - 1));
  $("#nextImg").addEventListener("click", () => show(idx + 1));

  // Zoom au survol (desktop)
  const stage = $("#stage");
  if (window.matchMedia("(hover: hover)").matches) {
    stage.addEventListener("mousemove", (e) => {
      const r = stage.getBoundingClientRect();
      mainImg.style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`;
      stage.classList.add("is-zoom");
    });
    stage.addEventListener("mouseleave", () => stage.classList.remove("is-zoom"));
  }
  // Swipe (mobile)
  let x0 = null;
  stage.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener("touchend", (e) => {
    if (x0 == null || !many) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) show(idx + (dx < 0 ? 1 : -1));
    x0 = null;
  });

  /* ---------- Taille & quantité ---------- */
  let size = null, qty = 1;
  $("#pSizes").innerHTML = CONFIG.sizes.map((s) => `<button type="button" class="size" data-size="${s}" aria-pressed="false">${s}</button>`).join("");
  const updateWa = () => {
    $("#pWa").href = waLink(`Bonjour Joudy Design, je souhaite commander :\n• ${p.name}${size ? ` — taille ${size}` : ""} × ${qty}\n${location.href}\nEst-il disponible ?`);
  };
  $("#pSizes").addEventListener("click", (e) => {
    const b = e.target.closest("[data-size]");
    if (!b) return;
    size = b.dataset.size;
    $$("#pSizes .size").forEach((x) => x.setAttribute("aria-pressed", x === b));
    $("#pSizeLabel").textContent = size;
    $("#sizeError").hidden = true;
    updateWa();
  });
  $("#pMinus").addEventListener("click", () => { qty = Math.max(1, qty - 1); $("#pQty").textContent = qty; updateWa(); });
  $("#pPlus").addEventListener("click", () => { qty = Math.min(10, qty + 1); $("#pQty").textContent = qty; updateWa(); });
  updateWa();

  function add() {
    if (!size) {
      $("#sizeError").hidden = false;
      $("#pSizes").scrollIntoView({ behavior: "smooth", block: "center" });
      $("#pSizes .size").focus({ preventScroll: true });
      return;
    }
    addToCart(p.id, size, qty);
    toast(`${p.name} (${size}) ajouté au panier`);
    setTimeout(openCart, 500);
  }
  $("#pAdd").addEventListener("click", add);
  $("#bbAdd").addEventListener("click", add);

  /* ---------- Barre d’achat mobile ---------- */
  const buybar = $("#buybar");
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([en]) => {
      const show = !en.isIntersecting && en.boundingClientRect.top < 0;
      buybar.classList.toggle("show", show);
      buybar.setAttribute("aria-hidden", !show);
      $("#bbAdd").tabIndex = show ? 0 : -1;
    }).observe($("#pAdd"));
  }

  /* ---------- Guide des tailles ---------- */
  const guide = $("#sizeGuide");
  $("#guideBody").innerHTML = SIZE_GUIDE.map((r) => `<tr><th scope="row">${r.size}</th><td>${r.chest}</td><td>${r.hips}</td><td>${r.length}</td></tr>`).join("");
  $("#openGuide").addEventListener("click", () => { guide.hidden = false; document.body.classList.add("no-scroll"); $(".modal__close", guide).focus(); });
  guide.addEventListener("click", (e) => {
    if (e.target.closest("[data-close-guide]")) { guide.hidden = true; document.body.classList.remove("no-scroll"); $("#openGuide").focus(); }
  });

  /* ---------- Partager ---------- */
  $("#share").addEventListener("click", async () => {
    const data = { title: `${p.name} — Joudy Design`, text: `${p.name} : ${p.fabric}`, url: location.href };
    try {
      if (navigator.share) await navigator.share(data);
      else { await navigator.clipboard.writeText(location.href); toast("Lien copié"); }
    } catch (_) { /* partage annulé */ }
  });

  /* ---------- Produits similaires ---------- */
  const same = PRODUCTS.filter((x) => x.id !== p.id && x.cat === p.cat);
  const others = PRODUCTS.filter((x) => x.id !== p.id && x.cat !== p.cat);
  $("#relatedGrid").innerHTML = [...same, ...others].slice(0, 4).map(cardHTML).join("");

  /* ---------- Récemment consultés ---------- */
  const RK = "joudy_recent_v1";
  let recent = [];
  try { recent = JSON.parse(localStorage.getItem(RK)) || []; } catch (_) {}
  const shown = recent.filter((r) => r !== p.id && byId(r)).slice(0, 4);
  if (shown.length) {
    $("#recentSec").hidden = false;
    $("#recentGrid").innerHTML = shown.map((r, i) => cardHTML(byId(r), i)).join("");
  }
  recent = [p.id, ...recent.filter((r) => r !== p.id)].slice(0, 8);
  try { localStorage.setItem(RK, JSON.stringify(recent)); } catch (_) {}

  observeReveal();
})();
