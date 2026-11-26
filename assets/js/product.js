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
  const codSize = $("#codSize");
  $("#pSizes").innerHTML = CONFIG.sizes.map((s) => `<button type="button" class="size" data-size="${s}" aria-pressed="false">${s}</button>`).join("");
  codSize.innerHTML = `<option value="">Choisir…</option>` + CONFIG.sizes.map((s) => `<option value="${s}">${s}</option>`).join("");

  const updateWa = () => {
    $("#pWa").href = waLink(`Bonjour Joudy Design, je souhaite commander :\n• ${p.name}${size ? ` — taille ${size}` : ""} × ${qty}\n${location.href}\nEst-il disponible ?`);
  };
  const updateSummary = () => {
    $("#codSumName").textContent = `${p.name}${size ? ` — ${size}` : ""}`;
    $("#codSumQty").textContent = qty;
    $("#codTotal").textContent = p.price == null ? "Confirmé par téléphone" : fmtPrice(p.price * qty);
  };
  function setSize(v) {
    size = v || null;
    $$("#pSizes .size").forEach((x) => x.setAttribute("aria-pressed", x.dataset.size === size));
    codSize.value = size || "";
    $("#pSizeLabel").textContent = size || "choisissez";
    if (size) { $("#sizeError").hidden = true; fieldOk(codSize); }
    updateWa(); updateSummary();
  }
  const setQty = (v) => { qty = Math.min(10, Math.max(1, v)); $("#pQty").textContent = qty; updateWa(); updateSummary(); };

  $("#pSizes").addEventListener("click", (e) => { const b = e.target.closest("[data-size]"); if (b) setSize(b.dataset.size); });
  codSize.addEventListener("change", () => setSize(codSize.value));
  $("#pMinus").addEventListener("click", () => setQty(qty - 1));
  $("#pPlus").addEventListener("click", () => setQty(qty + 1));
  updateWa(); updateSummary();

  $("#pAdd").addEventListener("click", () => {
    if (!size) {
      $("#sizeError").hidden = false;
      $("#pSizes").scrollIntoView({ behavior: "smooth", block: "center" });
      $("#pSizes .size").focus({ preventScroll: true });
      return;
    }
    addToCart(p.id, size, qty);
    toast(`${p.name} (${size}) ajouté au panier`);
    setTimeout(openCart, 500);
  });

  /* ---------- Formulaire COD ---------- */
  const form = $("#codForm");
  const F = { name: $("#codName"), phone: $("#codPhone"), city: $("#codCity"), address: $("#codAddress"), note: $("#codNote") };
  const DRAFT = "joudy_cod_draft_v1";
  try { const d = JSON.parse(localStorage.getItem(DRAFT)) || {}; ["name", "phone", "city", "address"].forEach((k) => { if (d[k]) F[k].value = d[k]; }); } catch (_) {}

  const normPhone = (v) => v.replace(/[\s.\-()]/g, "").replace(/^(\+212|00212)/, "0");
  const phoneOk = (v) => /^0[5-7]\d{8}$/.test(normPhone(v));
  function fieldErr(el) { const l = el.closest(".cfield"); l.classList.add("is-err"); $(".cfield__err", l).hidden = false; el.setAttribute("aria-invalid", "true"); }
  function fieldOk(el) { const l = el.closest(".cfield"); l.classList.remove("is-err"); $(".cfield__err", l).hidden = true; el.removeAttribute("aria-invalid"); }

  F.phone.addEventListener("blur", () => { if (F.phone.value && !phoneOk(F.phone.value)) fieldErr(F.phone); });
  Object.values(F).forEach((el) => el.addEventListener("input", () => el.closest(".cfield").classList.contains("is-err") && fieldOk(el)));

  const makeRef = () => {
    const d = new Date();
    return `JD-${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const bad = [];
    if (!F.name.value.trim()) bad.push(F.name); else fieldOk(F.name);
    if (!phoneOk(F.phone.value)) bad.push(F.phone); else fieldOk(F.phone);
    if (!F.city.value.trim()) bad.push(F.city); else fieldOk(F.city);
    if (!size) bad.push(codSize); else fieldOk(codSize);
    if (!F.address.value.trim()) bad.push(F.address); else fieldOk(F.address);
    if (bad.length) { bad.forEach(fieldErr); bad[0].focus(); return; }

    const order = {
      ref: makeRef(),
      date: new Date().toISOString(),
      product: p.name,
      productId: p.id,
      size,
      qty,
      price: p.price,
      total: p.price == null ? null : p.price * qty,
      name: F.name.value.trim(),
      phone: normPhone(F.phone.value),
      city: F.city.value.trim(),
      address: F.address.value.trim(),
      note: F.note.value.trim(),
      page: location.href,
    };

    try { localStorage.setItem(DRAFT, JSON.stringify({ name: order.name, phone: order.phone, city: order.city, address: order.address })); } catch (_) {}

    const msg =
`🛍️ Nouvelle commande ${order.ref}
Paiement à la livraison

Produit : ${order.product}
Taille : ${order.size}
Quantité : ${order.qty}
Total : ${order.total == null ? "à confirmer" : fmtPrice(order.total)}

Nom : ${order.name}
Téléphone : ${order.phone}
Ville : ${order.city}
Adresse : ${order.address}${order.note ? `\nRemarque : ${order.note}` : ""}

${order.page}`;
    const wa = waLink(msg);

    // Envoi vers la feuille de commandes (si configurée)
    if (CONFIG.orderEndpoint) {
      fetch(CONFIG.orderEndpoint, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(order) }).catch(() => {});
    }
    // WhatsApp (ouvert dans le clic pour ne pas être bloqué)
    if (CONFIG.codOpenWhatsApp) window.open(wa, "_blank", "noopener");

    $("#doneName").textContent = order.name.split(" ")[0];
    $("#doneRef").textContent = order.ref;
    $("#donePhone").textContent = order.phone;
    $("#doneWa").href = wa;
    // Sans feuille de commandes, la commande n’est transmise que par WhatsApp : on le dit clairement.
    const viaSheet = !!CONFIG.orderEndpoint;
    $("#doneWa").innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l1.3-4A8 8 0 1 1 12 20a8 8 0 0 1-4-1.1L4 20z"/></svg> ${viaSheet ? "Confirmer aussi sur WhatsApp" : "Envoyer ma commande sur WhatsApp"}`;
    if (!viaSheet) {
      $("#doneText").innerHTML = `Votre commande <strong>${esc(order.ref)}</strong> est prête. <strong>Envoyez-la sur WhatsApp</strong> pour la valider : nous vous rappelons ensuite au <strong>${esc(order.phone)}</strong>.`;
    }
    form.hidden = true;
    const done = $("#codDone");
    done.hidden = false;
    done.focus();
    done.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  $("#codAgain").addEventListener("click", () => {
    $("#codDone").hidden = true;
    form.hidden = false;
    F.note.value = "";
    F.name.focus();
  });

  /* ---------- Barre d’achat mobile ---------- */
  const buybar = $("#buybar");
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([en]) => {
      const show = !en.isIntersecting;
      buybar.classList.toggle("show", show);
      buybar.setAttribute("aria-hidden", !show);
      $("#bbAdd").tabIndex = show ? 0 : -1;
    }).observe($("#cod"));
  }
  $("#bbAdd").addEventListener("click", () => {
    $("#cod").scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => (F.name.value ? (size ? F.address : codSize) : F.name).focus({ preventScroll: true }), 500);
  });

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
