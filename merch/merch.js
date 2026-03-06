/* GoodFlightGolf Merch Store
   - Uses Firebase compat already loaded
   - Uses global myscripts.js for login/signup UI
   - Writes orders to Firestore collection: merchOrders
*/

(function () {
  const $ = (id) => document.getElementById(id);

  // Elements
  const productsGrid = $("productsGrid");
  const featuredProducts = $("featuredProducts");
  const resultsCount = $("resultsCount");
  const emptyState = $("emptyState");

  const searchInput = $("searchInput");
  const categorySelect = $("categorySelect");
  const sortSelect = $("sortSelect");
  const minPrice = $("minPrice");
  const maxPrice = $("maxPrice");

  const applyFiltersBtn = $("applyFiltersBtn");
  const resetFiltersBtn = $("resetFiltersBtn");

  const openCartBtn = $("openCartBtn");
  const closeCartBtn = $("closeCartBtn");
  const clearCartBtn = $("clearCartBtn");
  const cartDrawer = $("cartDrawer");
  const cartBackdrop = $("cartBackdrop");
  const cartItems = $("cartItems");
  const cartEmpty = $("cartEmpty");
  const cartTotal = $("cartTotal");
  const cartCount = $("cartCount");
  const cartSubText = $("cartSubText");

  const checkoutEmail = $("checkoutEmail");
  const orderNotes = $("orderNotes");
  const placeOrderBtn = $("placeOrderBtn");
  const orderStatus = $("orderStatus");

  const scrollToFeatured = $("scrollToFeatured");

  // Modal
  const productModalEl = $("productModal");
  const productModal = productModalEl ? new bootstrap.Modal(productModalEl) : null;
  const productModalTitle = $("productModalTitle");
  const productModalImg = $("productModalImg");
  const productModalPrice = $("productModalPrice");
  const productModalDesc = $("productModalDesc");
  const productModalSize = $("productModalSize");
  const productModalColor = $("productModalColor");
  const qtyMinus = $("qtyMinus");
  const qtyPlus = $("qtyPlus");
  const qtyInput = $("qtyInput");
  const addToCartBtn = $("addToCartBtn");
  const quickBuyBtn = $("quickBuyBtn");

  // Demo products (swap images to your real merch photos anytime)
  const PRODUCTS = [
    {
      id: "gfg-hoodie-01",
      name: "GoodFlight Classic Hoodie",
      category: "hoodies",
      price: 55,
      tag: "Best Seller",
      isFeatured: true,
      isNew: false,
      sizes: ["S", "M", "L", "XL", "2XL"],
      colors: ["Black", "Green", "Heather"],
      img: "../photos/course.jpg",
      desc: "Heavyweight comfort. Clean GoodFlight look. Perfect for cool mornings on the range."
    },
    {
      id: "gfg-hat-01",
      name: "GoodFlight Rope Hat",
      category: "hats",
      price: 32,
      tag: "New",
      isFeatured: true,
      isNew: true,
      sizes: ["One Size"],
      colors: ["White", "Black", "Green"],
      img: "../photos/ball.jpg",
      desc: "Classic rope hat fit with a premium feel. Built for golf and everyday wear."
    },
    {
      id: "gfg-tee-01",
      name: "GoodFlight Logo Tee",
      category: "shirts",
      price: 28,
      tag: "Under $35",
      isFeatured: true,
      isNew: false,
      sizes: ["S", "M", "L", "XL", "2XL"],
      colors: ["Black", "White", "Green"],
      img: "../photos/course.jpg",
      desc: "Soft cotton tee with a clean front logo. A simple staple."
    },
    {
      id: "gfg-polo-01",
      name: "Performance Polo",
      category: "polos",
      price: 62,
      tag: "Premium",
      isFeatured: false,
      isNew: true,
      sizes: ["S", "M", "L", "XL", "2XL"],
      colors: ["Black", "White", "Navy"],
      img: "../photos/ball.jpg",
      desc: "Lightweight performance polo. Breathable and clean for any tee time."
    },
    {
      id: "gfg-towel-01",
      name: "Magnetic Towel",
      category: "accessories",
      price: 24,
      tag: "Gear",
      isFeatured: false,
      isNew: false,
      sizes: ["One Size"],
      colors: ["Black", "Green"],
      img: "../photos/course.jpg",
      desc: "Magnetic golf towel for quick access. Simple and effective."
    },
    {
      id: "gfg-beanie-01",
      name: "Cold Round Beanie",
      category: "hats",
      price: 26,
      tag: "Warm",
      isFeatured: false,
      isNew: false,
      sizes: ["One Size"],
      colors: ["Black", "Heather"],
      img: "../photos/ball.jpg",
      desc: "Warm beanie for chilly rounds. Fits clean under a hood."
    }
  ];

  // Cart state
  const CART_KEY = "gfg_merch_cart_v1";
  let cart = loadCart();

  // Current modal product
  let currentProduct = null;

  function money(n) {
    const v = Number(n || 0);
    return `$${v.toFixed(2)}`;
  }

  function loadCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  function cartItemKey(item) {
    return `${item.id}__${item.size}__${item.color}`;
  }

  function cartCountValue() {
    return cart.reduce((sum, i) => sum + (Number(i.qty) || 0), 0);
  }

  function cartTotalValue() {
    return cart.reduce((sum, i) => sum + (Number(i.qty) || 0) * (Number(i.price) || 0), 0);
  }

  function setDrawerOpen(isOpen) {
    if (!cartDrawer) return;
    cartDrawer.classList.toggle("is-open", isOpen);
    document.body.classList.toggle("gfg-no-scroll", isOpen);
    cartDrawer.setAttribute("aria-hidden", String(!isOpen));
    cartBackdrop?.setAttribute("aria-hidden", String(!isOpen));
  }

  function renderFeatured() {
    const featured = PRODUCTS.filter(p => p.isFeatured).slice(0, 3);
    featuredProducts.innerHTML = featured.map(p => productCardHTML(p, true)).join("");
    featuredProducts.querySelectorAll("[data-product-id]").forEach(btn => {
      btn.addEventListener("click", () => openProduct(btn.getAttribute("data-product-id")));
    });
  }

  function productCardHTML(p, compact = false) {
    return `
      <div class="gfg-product-card" role="button" tabindex="0" data-product-id="${p.id}">
        <img class="gfg-product-thumb" src="${p.img}" alt="${escapeHtml(p.name)}" />
        <div class="gfg-product-info">
          <div class="gfg-product-name">${escapeHtml(p.name)}</div>
          <div class="gfg-product-meta">
            <div class="gfg-price">${money(p.price)}</div>
            <div class="gfg-tag">${escapeHtml(p.tag)}</div>
          </div>
          ${compact ? "" : `<div class="text-muted small mt-2">${escapeHtml(p.category.toUpperCase())}</div>`}
        </div>
      </div>
    `;
  }

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function getFilters() {
    return {
      q: (searchInput.value || "").trim().toLowerCase(),
      category: categorySelect.value || "all",
      sort: sortSelect.value || "featured",
      min: minPrice.value ? Number(minPrice.value) : null,
      max: maxPrice.value ? Number(maxPrice.value) : null,
      chip: null
    };
  }

  function applyChip(chip) {
    // quick presets
    if (chip === "under35") {
      minPrice.value = "";
      maxPrice.value = 35;
      sortSelect.value = "priceLow";
    }
    if (chip === "newDrops") {
      sortSelect.value = "newest";
    }
    if (chip === "bestSellers") {
      sortSelect.value = "featured";
    }
    renderProducts();
  }

  function renderProducts() {
    const f = getFilters();

    let list = [...PRODUCTS];

    // search
    if (f.q) {
      list = list.filter(p => {
        const hay = `${p.name} ${p.category} ${p.tag} ${p.desc}`.toLowerCase();
        return hay.includes(f.q);
      });
    }

    // category
    if (f.category !== "all") {
      list = list.filter(p => p.category === f.category);
    }

    // price
    if (f.min !== null) list = list.filter(p => p.price >= f.min);
    if (f.max !== null) list = list.filter(p => p.price <= f.max);

    // sort
    if (f.sort === "priceLow") list.sort((a, b) => a.price - b.price);
    if (f.sort === "priceHigh") list.sort((a, b) => b.price - a.price);
    if (f.sort === "newest") list.sort((a, b) => (b.isNew === true) - (a.isNew === true));
    if (f.sort === "featured") list.sort((a, b) => (b.isFeatured === true) - (a.isFeatured === true));

    resultsCount.textContent = String(list.length);

    if (!list.length) {
      productsGrid.innerHTML = "";
      emptyState.classList.remove("d-none");
      return;
    }

    emptyState.classList.add("d-none");
    productsGrid.innerHTML = list.map(p => productCardHTML(p)).join("");

    productsGrid.querySelectorAll("[data-product-id]").forEach(card => {
      const id = card.getAttribute("data-product-id");
      card.addEventListener("click", () => openProduct(id));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") openProduct(id);
      });
    });
  }

  function openProduct(productId) {
    const p = PRODUCTS.find(x => x.id === productId);
    if (!p || !productModal) return;

    currentProduct = p;

    productModalTitle.textContent = p.name;
    productModalImg.src = p.img;
    productModalPrice.textContent = money(p.price);
    productModalDesc.textContent = p.desc;

    // sizes/colors
    productModalSize.innerHTML = p.sizes.map(s => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join("");
    productModalColor.innerHTML = p.colors.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("");

    qtyInput.value = 1;

    productModal.show();
  }

  function addToCart({ product, size, color, qty }) {
    const item = {
      id: product.id,
      name: product.name,
      price: product.price,
      img: product.img,
      size,
      color,
      qty: Number(qty) || 1
    };

    const key = cartItemKey(item);
    const idx = cart.findIndex(i => cartItemKey(i) === key);

    if (idx >= 0) cart[idx].qty += item.qty;
    else cart.push(item);

    saveCart();
    renderCart();
  }

  function removeFromCart(itemKey) {
    cart = cart.filter(i => cartItemKey(i) !== itemKey);
    saveCart();
    renderCart();
  }

  function updateQty(itemKey, nextQty) {
    const qty = Math.max(1, Number(nextQty) || 1);
    const item = cart.find(i => cartItemKey(i) === itemKey);
    if (!item) return;
    item.qty = qty;
    saveCart();
    renderCart();
  }

  function clearCart() {
    cart = [];
    saveCart();
    renderCart();
  }

  function renderCart() {
    const count = cartCountValue();
    cartCount.textContent = String(count);

    if (!cart.length) {
      cartItems.innerHTML = "";
      cartEmpty.classList.remove("d-none");
      cartTotal.textContent = money(0);
      cartSubText.textContent = "Add something clean 👌";
      return;
    }

    cartEmpty.classList.add("d-none");
    cartSubText.textContent = `${count} item${count === 1 ? "" : "s"} in cart`;

    cartItems.innerHTML = cart.map(i => {
      const key = cartItemKey(i);
      return `
        <div class="gfg-cart-item">
          <img src="${i.img}" alt="${escapeHtml(i.name)}" />
          <div style="flex:1;">
            <p class="gfg-cart-item-title">${escapeHtml(i.name)}</p>
            <div class="gfg-cart-item-meta">
              Size: <strong>${escapeHtml(i.size)}</strong> ·
              Color: <strong>${escapeHtml(i.color)}</strong>
            </div>
            <div class="gfg-cart-row mt-2">
              <div class="fw-bold">${money(i.price)}</div>
              <div class="d-flex gap-1 align-items-center">
                <button class="gfg-mini-btn" data-action="dec" data-key="${key}">−</button>
                <input class="form-control text-center" style="width:68px;" type="number" min="1"
                  value="${Number(i.qty) || 1}" data-action="qty" data-key="${key}">
                <button class="gfg-mini-btn" data-action="inc" data-key="${key}">+</button>
                <button class="gfg-mini-btn" data-action="remove" data-key="${key}">🗑</button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join("");

    cartTotal.textContent = money(cartTotalValue());

    // bind
    cartItems.querySelectorAll("[data-action]").forEach(el => {
      const action = el.getAttribute("data-action");
      const key = el.getAttribute("data-key");

      if (action === "remove") el.addEventListener("click", () => removeFromCart(key));
      if (action === "dec") el.addEventListener("click", () => {
        const item = cart.find(i => cartItemKey(i) === key);
        if (!item) return;
        updateQty(key, Math.max(1, (Number(item.qty) || 1) - 1));
      });
      if (action === "inc") el.addEventListener("click", () => {
        const item = cart.find(i => cartItemKey(i) === key);
        if (!item) return;
        updateQty(key, (Number(item.qty) || 1) + 1);
      });
      if (action === "qty") {
        el.addEventListener("change", () => updateQty(key, el.value));
      }
    });
  }

  async function placeOrder() {
    orderStatus.textContent = "";
    orderStatus.style.color = "";

    if (!cart.length) {
      orderStatus.textContent = "❌ Your cart is empty.";
      orderStatus.style.color = "crimson";
      return;
    }

    const email = (checkoutEmail.value || "").trim();
    if (!email || !email.includes("@")) {
      orderStatus.textContent = "❌ Please enter a valid shipping email.";
      orderStatus.style.color = "crimson";
      return;
    }

    try {
      const user = firebase?.auth?.().currentUser || null;

      const payload = {
        created: firebase.firestore.FieldValue.serverTimestamp(),
        status: "new",
        email,
        notes: (orderNotes.value || "").trim(),
        total: Number(cartTotalValue().toFixed(2)),
        itemCount: cartCountValue(),
        items: cart.map(i => ({
          id: i.id,
          name: i.name,
          price: i.price,
          size: i.size,
          color: i.color,
          qty: i.qty
        })),
        uid: user ? user.uid : null,
        userEmail: user ? user.email : null
      };

      await firebase.firestore().collection("merchOrders").add(payload);

      orderStatus.textContent = "✅ Order placed! We received it and will follow up via email.";
      orderStatus.style.color = "green";

      clearCart();
      orderNotes.value = "";

      // close drawer after a moment
      setTimeout(() => setDrawerOpen(false), 900);

    } catch (err) {
      console.error("Order error:", err);
      orderStatus.textContent = "❌ Failed to place order. Please try again.";
      orderStatus.style.color = "crimson";
    }
  }

  // Events
  document.addEventListener("DOMContentLoaded", () => {
    renderFeatured();
    renderProducts();
    renderCart();

    // filters
    applyFiltersBtn.addEventListener("click", renderProducts);
    resetFiltersBtn.addEventListener("click", () => {
      searchInput.value = "";
      categorySelect.value = "all";
      sortSelect.value = "featured";
      minPrice.value = "";
      maxPrice.value = "";
      renderProducts();
    });

    // chips
    document.querySelectorAll(".gfg-chip").forEach(btn => {
      btn.addEventListener("click", () => applyChip(btn.getAttribute("data-chip")));
    });

    // live search (light debounce)
    let t = null;
    searchInput.addEventListener("input", () => {
      clearTimeout(t);
      t = setTimeout(renderProducts, 120);
    });

    // cart drawer
    openCartBtn.addEventListener("click", () => setDrawerOpen(true));
    closeCartBtn.addEventListener("click", () => setDrawerOpen(false));
    cartBackdrop.addEventListener("click", () => setDrawerOpen(false));
    clearCartBtn.addEventListener("click", clearCart);

    placeOrderBtn.addEventListener("click", placeOrder);

    // featured scroll
    scrollToFeatured.addEventListener("click", () => {
      const el = document.getElementById("featuredRow");
      if (!el) return;
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior: "smooth" });
    });

    // modal qty
    qtyMinus.addEventListener("click", () => qtyInput.value = Math.max(1, Number(qtyInput.value || 1) - 1));
    qtyPlus.addEventListener("click", () => qtyInput.value = Math.max(1, Number(qtyInput.value || 1) + 1));

    // add to cart
    addToCartBtn.addEventListener("click", () => {
      if (!currentProduct) return;
      addToCart({
        product: currentProduct,
        size: productModalSize.value,
        color: productModalColor.value,
        qty: qtyInput.value
      });
    });

    // quick buy = add then open cart
    quickBuyBtn.addEventListener("click", () => {
      if (!currentProduct) return;
      addToCart({
        product: currentProduct,
        size: productModalSize.value,
        color: productModalColor.value,
        qty: qtyInput.value
      });
      productModal.hide();
      setDrawerOpen(true);
    });

    // auto-fill email if logged in
    const auth = firebase.auth();
    auth.onAuthStateChanged((user) => {
      if (user && checkoutEmail) {
        if (!checkoutEmail.value) checkoutEmail.value = user.email || "";
      }
    });
  });

})();