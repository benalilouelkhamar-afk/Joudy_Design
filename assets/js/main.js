/* ==========================================================
   Joudy Design — interactions communes (toutes les pages)
   ========================================================== */
(() => {
  "use strict";

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const img = (id) => `assets/img/products/${id}.jpg`;
  const gallery = (id) => [img(id), ...Array.from({ length: (GALLERY[id] || 0) }, (_, i) => `assets/img/gallery/${id}-${i + 2}.jpg`)];
  const byId = (id) => PRODUCTS.find((p) => p.id === id);
  const catLabel = (id) => (CATEGORIES.find((c) => c.id === id) || {}).label || "";
  const fmtPrice = (p) => (p == null ? "Prix sur demande" : `${p.toLocaleString("fr-MA")} ${CONFIG.currency}`);
  const waLink = (msg) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
  const productUrl = (id) => `product.html?id=${encodeURIComponent(id)}`;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* Carte produit réutilisable (collection, produits similaires) */
  function cardHTML(p, i = 0) {
    return `
      <article class="card" style="animation-delay:${Math.min(i, 8) * 50}ms">
        <a class="card__media" href="${productUrl(p.id)}" aria-label="${esc(p.name)}">
          <img src="${img(p.id)}" alt="${esc(p.name)} — ${esc(p.fabric)}" loading="lazy">
          ${(GALLERY[p.id] ? `<img class="card__alt" src="assets/img/gallery/${p.id}-2.jpg" alt="" loading="lazy">` : "")}
          ${p.isNew ? '<span class="card__tag">Nouveau</span>' : ""}
          <span class="card__quick">Voir le produit</span>
        </a>
        <div class="card__body">
          <div class="card__row">
            <h3 class="card__name"><a href="${productUrl(p.id)}">${esc(p.name)}</a></h3>
            <span class="card__price ${p.price == null ? "card__price--ask" : ""}">${fmtPrice(p.price)}</span>
          </div>
          <span class="card__fabric">${esc(p.fabric)}</span>
          <button type="button" class="card__add js-quick" data-id="${p.id}">Ajout rapide</button>
        </div>
      </article>`;
  }

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2400);
  }

  /* ---------- Header ---------- */
  const header = $("#header");
  const onScroll = () => header && header.classList.toggle("is-scrolled", window.scrollY > 10);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Menu mobile ---------- */
  const mobileNav = $("#mobileNav");
  const openMenu = () => { mobileNav.hidden = false; $("#menuOpen").setAttribute("aria-expanded", "true"); document.body.classList.add("no-scroll"); };
  const closeMenu = () => { mobileNav.hidden = true; $("#menuOpen").setAttribute("aria-expanded", "false"); document.body.classList.remove("no-scroll"); };
  if (mobileNav) {
    $("#menuOpen").addEventListener("click", openMenu);
    $("#menuClose").addEventListener("click", closeMenu);
    mobileNav.addEventListener("click", (e) => { if (e.target === mobileNav || e.target.tagName === "A") closeMenu(); });
  }

  /* ---------- Recherche ---------- */
  const search = $("#search");
  if (search) {
    const input = $("#searchInput");
    const results = $("#searchResults");
    const open = () => { search.hidden = false; document.body.classList.add("no-scroll"); input.value = ""; draw(""); setTimeout(() => input.focus(), 30); };
    const close = () => { search.hidden = true; document.body.classList.remove("no-scroll"); };
    const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
    function draw(q) {
      const n = norm(q.trim());
      const list = PRODUCTS.filter((p) => !n || norm(`${p.name} ${p.fabric} ${p.detail} ${catLabel(p.cat)}`).includes(n)).slice(0, 8);
      results.innerHTML = list.length
        ? list.map((p) => `<a class="sr" href="${productUrl(p.id)}"><img src="${img(p.id)}" alt=""><span><strong>${esc(p.name)}</strong><small>${esc(p.fabric)}</small></span></a>`).join("")
        : `<p class="sr__empty">Aucun modèle trouvé pour « ${esc(q)} ».</p>`;
    }
    $$(".js-search").forEach((b) => b.addEventListener("click", open));
    input.addEventListener("input", () => draw(input.value));
    search.addEventListener("click", (e) => { if (e.target.closest("[data-close-search]")) close(); });
    search.closeIt = close;
  }

  /* ---------- Liens WhatsApp ---------- */
  $$(".js-wa").forEach((a) => {
    a.href = waLink(a.dataset.msg || "Bonjour Joudy Design !");
    a.target = "_blank";
    a.rel = "noopener";
  });

  /* ---------- Panier ---------- */
  const KEY = "joudy_cart_v1";
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem(KEY)) || []; } catch (_) { cart = []; }
  cart = cart.filter((l) => byId(l.id));
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (_) {} };

  function addToCart(id, s, q) {
    const line = cart.find((l) => l.id === id && l.size === s);
    if (line) line.qty = Math.min(10, line.qty + q);
    else cart.push({ id, size: s, qty: q });
    save(); renderCart();
    const btn = $("#cartOpen");
    btn.classList.remove("bump"); void btn.offsetWidth; btn.classList.add("bump");
  }

  function renderCart() {
    const count = cart.reduce((n, l) => n + l.qty, 0);
    const badge = $("#cartCount");
    badge.textContent = count;
    badge.classList.toggle("has-items", count > 0);
    $("#cartOpen").setAttribute("aria-label", `Ouvrir le panier (${count} article${count > 1 ? "s" : ""})`);

    const items = $("#cartItems");
    if (!cart.length) {
      items.innerHTML = `<div class="drawer__empty"><p>Votre panier est vide.</p><a href="index.html#collection" class="btn btn--ghost" data-close-cart>Voir la collection</a></div>`;
    } else {
      items.innerHTML = cart.map((l, i) => {
        const p = byId(l.id);
        return `<div class="line">
          <a href="${productUrl(p.id)}"><img src="${img(p.id)}" alt="${esc(p.name)}"></a>
          <div>
            <h3>${esc(p.name)}</h3>
            <p>Taille ${esc(l.size)} · ${fmtPrice(p.price)}</p>
            <div class="line__qty">
              <button type="button" data-dec="${i}" aria-label="Diminuer la quantité">−</button>
              <span>${l.qty}</span>
              <button type="button" data-inc="${i}" aria-label="Augmenter la quantité">+</button>
            </div>
          </div>
          <button type="button" class="line__remove" data-rm="${i}">Retirer</button>
        </div>`;
      }).join("");
    }

    const priced = cart.every((l) => byId(l.id).price != null);
    const total = cart.reduce((s, l) => s + (byId(l.id).price || 0) * l.qty, 0);
    $("#cartTotal").textContent = !cart.length ? "—" : priced ? fmtPrice(total) : "Confirmé sur WhatsApp";
    $("#checkout").disabled = !cart.length;
  }

  $("#cartItems").addEventListener("click", (e) => {
    const t = e.target;
    if (t.dataset.inc) cart[t.dataset.inc].qty = Math.min(10, cart[t.dataset.inc].qty + 1);
    else if (t.dataset.dec) { const l = cart[t.dataset.dec]; l.qty -= 1; if (l.qty < 1) cart.splice(t.dataset.dec, 1); }
    else if (t.dataset.rm) cart.splice(t.dataset.rm, 1);
    else return;
    save(); renderCart();
  });

  const drawer = $("#drawer");
  const openCart = () => { drawer.hidden = false; document.body.classList.add("no-scroll"); };
  const closeCart = () => { drawer.hidden = true; document.body.classList.remove("no-scroll"); };
  $("#cartOpen").addEventListener("click", openCart);
  drawer.addEventListener("click", (e) => { if (e.target.closest("[data-close-cart]")) closeCart(); });

  $("#checkout").addEventListener("click", () => {
    if (!cart.length) return;
    const name = $("#cName").value.trim();
    const phone = $("#cPhone").value.replace(/[\s.\-()]/g, "").replace(/^(\+212|00212)/, "0");
    const city = $("#cCity").value.trim();
    const address = $("#cAddress").value.trim();
    const hint = $("#cartHint");
    if (!name || !/^0[5-7]\d{8}$/.test(phone) || !city || !address) {
      hint.textContent = "Merci de remplir nom, téléphone (06/07…), ville et adresse.";
      hint.classList.add("is-err");
      return;
    }
    hint.classList.remove("is-err");
    const d = new Date();
    const ref = `JD-${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const lines = cart.map((l) => { const p = byId(l.id); return `• ${p.name} — taille ${l.size} × ${l.qty}`; }).join("\n");
    const msg = `🛍️ Nouvelle commande ${ref}\nPaiement à la livraison\n\n${lines}\n\nNom : ${name}\nTéléphone : ${phone}\nVille : ${city}\nAdresse : ${address}`;
    if (CONFIG.orderEndpoint) {
      const order = { ref, date: d.toISOString(), product: cart.map((l) => byId(l.id).name).join(" + "), size: cart.map((l) => l.size).join(" + "), qty: cart.reduce((n, l) => n + l.qty, 0), items: cart, name, phone, city, address, page: location.href };
      fetch(CONFIG.orderEndpoint, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(order) }).catch(() => {});
    }
    window.open(waLink(msg), "_blank", "noopener");
    cart = []; save(); renderCart();
    hint.textContent = `Merci ${name.split(" ")[0]} ! Commande ${ref} envoyée. Nous vous appelons pour confirmer.`;
  });

  /* ---------- Ajout rapide (modal) ---------- */
  const modal = $("#modal");
  let current = null, size = null, qty = 1, lastFocus = null;

  function openModal(id) {
    const p = byId(id);
    if (!p || !modal) return;
    current = p; size = null; qty = 1; lastFocus = document.activeElement;
    $("#modalImg").src = img(p.id);
    $("#modalImg").alt = `${p.name} — ${p.fabric}`;
    $("#modalCat").textContent = catLabel(p.cat);
    $("#modalTitle").textContent = p.name;
    $("#modalPrice").textContent = fmtPrice(p.price);
    $("#modalDesc").textContent = `${p.fabric}. ${p.detail}. Pièce confectionnée et finie à la main au Maroc.`;
    $("#modalSizes").innerHTML = CONFIG.sizes.map((s) => `<button type="button" class="size" data-size="${s}" aria-pressed="false">${s}</button>`).join("");
    $("#qtyVal").textContent = qty;
    $("#modalLink").href = productUrl(p.id);
    updateModalWa();
    modal.hidden = false;
    document.body.classList.add("no-scroll");
    $(".modal__close", modal).focus();
  }
  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove("no-scroll");
    if (lastFocus) lastFocus.focus();
  }
  function updateModalWa() {
    const msg = `Bonjour Joudy Design, je souhaite commander :\n• ${current.name}${size ? ` — taille ${size}` : ""} × ${qty}\nEst-il disponible ?`;
    $("#modalWa").href = waLink(msg);
  }

  document.addEventListener("click", (e) => {
    const q = e.target.closest(".js-quick");
    if (!q) return;
    e.preventDefault();
    if (modal) openModal(q.dataset.id);
    else location.href = productUrl(q.dataset.id);
  });
  if (modal) {
    $$("[data-close]", modal).forEach((el) => el.addEventListener("click", closeModal));
    $("#modalSizes").addEventListener("click", (e) => {
      const b = e.target.closest("[data-size]");
      if (!b) return;
      size = b.dataset.size;
      $$(".size", modal).forEach((x) => x.setAttribute("aria-pressed", x === b));
      updateModalWa();
    });
    $("#qtyMinus").addEventListener("click", () => { qty = Math.max(1, qty - 1); $("#qtyVal").textContent = qty; updateModalWa(); });
    $("#qtyPlus").addEventListener("click", () => { qty = Math.min(10, qty + 1); $("#qtyVal").textContent = qty; updateModalWa(); });
    $("#modalAdd").addEventListener("click", () => {
      if (!size) { toast("Veuillez choisir une taille"); $(".size", modal).focus(); return; }
      addToCart(current.id, size, qty);
      closeModal();
      toast(`${current.name} ajouté au panier`);
    });
  }

  /* ---------- Catalogue (page d’accueil) ---------- */
  const grid = $("#grid");
  if (grid) {
    const state = { cat: "all", sort: "default" };
    const renderFilters = () => {
      $("#filters").innerHTML = CATEGORIES.map(
        (c) => `<button type="button" class="chip" data-cat="${c.id}" aria-pressed="${c.id === state.cat}">${c.label}</button>`
      ).join("");
    };
    const renderGrid = () => {
      let list = PRODUCTS.filter((p) => state.cat === "all" || p.cat === state.cat);
      if (state.sort === "new") list = [...list].sort((a, b) => b.isNew - a.isNew);
      if (state.sort === "az") list = [...list].sort((a, b) => a.name.localeCompare(b.name, "fr"));
      $("#count").textContent = `${list.length} modèle${list.length > 1 ? "s" : ""}`;
      grid.innerHTML = list.map(cardHTML).join("");
    };
    $("#filters").addEventListener("click", (e) => {
      const b = e.target.closest("[data-cat]");
      if (!b) return;
      state.cat = b.dataset.cat;
      renderFilters(); renderGrid();
    });
    $("#sort").addEventListener("change", (e) => { state.sort = e.target.value; renderGrid(); });
    renderFilters(); renderGrid();
  }

  /* ---------- Échap ---------- */
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    const sizeDlg = $("#sizeGuide");
    if (sizeDlg && !sizeDlg.hidden) sizeDlg.hidden = true, document.body.classList.remove("no-scroll");
    else if (modal && !modal.hidden) closeModal();
    else if (search && !search.hidden) search.closeIt();
    else if (!drawer.hidden) closeCart();
    else if (mobileNav && !mobileNav.hidden) closeMenu();
  });

  /* ---------- Apparitions au scroll ---------- */
  const observeReveal = (root = document) => {
    const els = $$(".reveal:not(.in)", root);
    if (!("IntersectionObserver" in window)) { els.forEach((el) => el.classList.add("in")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
  };

  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();
  renderCart();
  observeReveal();

  /* API partagée avec product.js */
  window.JD = { $, $$, img, gallery, byId, catLabel, fmtPrice, waLink, productUrl, esc, cardHTML, addToCart, toast, openCart, observeReveal };
})();
