
document.addEventListener("DOMContentLoaded", () => {

  // CHANGE TO YOUR BUSINESS WHATSAPP NUMBER
  // Example: 256701234567
  const WHATSAPP_NUMBER = "256757156420";

  const products = window.SHOP_PRODUCTS || [];

  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];

  const money = amount =>
    "UGX " + Math.round(amount).toLocaleString("en-UG");

  const escapeHTML = value =>
    String(value ?? "").replace(/[&<>"']/g, character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[character]));

  function loadSaved(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  }

  const state = {
    mode: "buy",
    cart: loadSaved("dorah_shop_cart", []),
    favourites: loadSaved("dorah_shop_favourites", []),
    previousFocus: null
  };

  const findProduct = id => products.find(p => p.id === id);

  state.cart = state.cart.filter(item =>
    findProduct(item.id) &&
    ["buy", "hire"].includes(item.mode) &&
    Number.isInteger(item.qty) &&
    item.qty > 0 &&
    (item.mode !== "hire" ||
      (item.start && item.end && item.end >= item.start))
  );

  state.favourites = state.favourites.filter(id => findProduct(id));

  function saveState() {
    try {
      localStorage.setItem("dorah_shop_cart", JSON.stringify(state.cart));
      localStorage.setItem("dorah_shop_favourites", JSON.stringify(state.favourites));
    } catch {
      // Storage may be unavailable in private browsing.
    }
  }

  function notify(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(notify.timer);
    notify.timer = setTimeout(() => toast.classList.remove("show"), 3500);
  }

  function localToday() {
    const date = new Date();
    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0")
    ].join("-");
  }

  function hireDays(start, end) {
    if (!start || !end || end < start) return 0;

    const first = Date.parse(start + "T12:00:00Z");
    const last = Date.parse(end + "T12:00:00Z");

    if (!Number.isFinite(first) || !Number.isFinite(last)) return 0;

    return Math.round((last - first) / 86400000) + 1;
  }

  function itemUnitPrice(product, item) {
    return item.mode === "hire"
      ? product.hirePrice * hireDays(item.start, item.end)
      : product.price;
  }

  function cartTotal() {
    return state.cart.reduce((total, item) => {
      const product = findProduct(item.id);
      return total + (product ? itemUnitPrice(product, item) * item.qty : 0);
    }, 0);
  }

  
function updateCounters() {
  const totalItems = state.cart.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  $("#cartCount").textContent = totalItems;
  $("#floatingCartCount").textContent = totalItems;
  $("#favouritesCount").textContent = state.favourites.length;

  saveState();
}




// ===========================================
// MOBILE NAVIGATION — HOMEPAGE STYLE
// ===========================================

const menuToggle = $("#menuToggle");
const navLinks = $("#navLinks");

function closeMobileMenu() {
  navLinks.classList.remove("active");
  menuToggle.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
}

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("active");

  menuToggle.classList.toggle("open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation" : "Open navigation"
  );
});

$$("#navLinks a").forEach(link => {
  link.addEventListener("click", closeMobileMenu);
});

document.addEventListener("click", event => {
  if (
    !navLinks.contains(event.target) &&
    !menuToggle.contains(event.target)
  ) {
    closeMobileMenu();
  }
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeMobileMenu();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 1050) closeMobileMenu();
});

if (window.lucide) {
  lucide.createIcons();
}




  // BUY / HIRE MODE

  function setMode(mode) {
    state.mode = mode;

    $$(".mode-button").forEach(button => {
      const active = button.dataset.mode === mode;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    $("#shopTitle").textContent =
      mode === "buy" ? "Shop the Collection." : "The Hire Collection.";

    $("#shopDescription").textContent =
      mode === "buy"
        ? "Discover beautiful pieces to make your own."
        : "Explore occasion pieces available for hire enquiries.";

    renderProducts();
  }

  $$(".mode-button").forEach(button => {
    button.addEventListener("click", () => setMode(button.dataset.mode));
  });

  $$("[data-shop-mode]").forEach(link => {
    link.addEventListener("click", () => setMode(link.dataset.shopMode));
  });

  $$("[data-department]").forEach(link => {
    link.addEventListener("click", () => {
      $("#departmentFilter").value = link.dataset.department;
      renderProducts();
    });
  });

  // FILTERS

  function getFilters() {
    return {
      search: $("#searchInput").value.trim().toLowerCase(),
      department: $("#departmentFilter").value,
      category: $("#categoryFilter").value,
      size: $("#sizeFilter").value,
      maxPrice: Number($("#priceFilter").value) || Infinity,
      available: $("#stockFilter").checked,
      favourites: $("#favouritesFilter").checked,
      sort: $("#sortFilter").value
    };
  }

  function renderProducts() {
    const filters = getFilters();

    let filtered = products.filter(product => {
      const correctMode = state.mode === "buy"
        ? product.forSale
        : product.forHire;

      const searchable = [
        product.name,
        product.description,
        product.category,
        product.department
      ].join(" ").toLowerCase();

      const price = state.mode === "buy"
        ? product.price
        : product.hirePrice;

      return correctMode &&
        (!filters.search || searchable.includes(filters.search)) &&
        (filters.department === "all" || product.department === filters.department) &&
        (filters.category === "all" || product.category === filters.category) &&
        (filters.size === "all" || product.sizes.includes(filters.size)) &&
        price <= filters.maxPrice &&
        (!filters.available || product.stock > 0) &&
        (!filters.favourites || state.favourites.includes(product.id));
    });

    filtered.sort((a, b) => {
      const priceA = state.mode === "buy" ? a.price : a.hirePrice;
      const priceB = state.mode === "buy" ? b.price : b.hirePrice;

      if (filters.sort === "low") return priceA - priceB;
      if (filters.sort === "high") return priceB - priceA;
      if (filters.sort === "name") return a.name.localeCompare(b.name);
      if (filters.sort === "newest") return b.id.localeCompare(a.id);

      return Number(!!b.featured) - Number(!!a.featured);
    });

    $("#productCount").textContent =
      `${filtered.length} ${filtered.length === 1 ? "piece" : "pieces"} found`;

    $("#emptyState").hidden = filtered.length > 0;

    $("#productGrid").innerHTML = filtered.map(product => {
      const favourite = state.favourites.includes(product.id);
      const price = state.mode === "buy" ? product.price : product.hirePrice;

      return `
        <article class="product-card">
          <div class="product-photo">
            <img src="${escapeHTML(product.image)}"
                 alt="${escapeHTML(product.name)}" loading="lazy">

            <span class="product-badge">
              ${product.stock > 0 ? "CURATED EDIT" : "ENQUIRE"}
            </span>

            <button class="favourite-toggle ${favourite ? "active" : ""}"
                    data-favourite="${escapeHTML(product.id)}"
                    aria-label="${favourite ? "Remove from" : "Add to"} favourites"
                    aria-pressed="${favourite}">
              ${favourite ? "♥" : "♡"}
            </button>
          </div>

          <div class="product-info">
            <span class="product-meta">
              ${escapeHTML(product.department)} / ${escapeHTML(product.category)}
            </span>

            <h3>${escapeHTML(product.name)}</h3>

            <p class="product-price">
              ${money(price)}
              ${state.mode === "hire" ? "<small>/ day</small>" : ""}
            </p>

            <div class="product-actions">
              <button data-view="${escapeHTML(product.id)}">VIEW DETAILS</button>
              <button data-view="${escapeHTML(product.id)}">
                ${state.mode === "buy" ? "SELECT OPTIONS" : "HIRE OPTIONS"}
              </button>
            </div>
          </div>
        </article>
      `;
    }).join("");
  }

  function resetFilters() {
    $("#searchInput").value = "";
    $("#priceFilter").value = "";
    $("#departmentFilter").value = "all";
    $("#categoryFilter").value = "all";
    $("#sizeFilter").value = "all";
    $("#stockFilter").checked = false;
    $("#favouritesFilter").checked = false;
    $("#sortFilter").value = "featured";
    renderProducts();
  }

  [
    "searchInput", "departmentFilter", "categoryFilter",
    "sizeFilter", "priceFilter", "stockFilter",
    "favouritesFilter", "sortFilter"
  ].forEach(id => {
    const input = $("#" + id);
    input.addEventListener(
      ["searchInput", "priceFilter"].includes(id) ? "input" : "change",
      renderProducts
    );
  });

  $("#resetFilters").addEventListener("click", resetFilters);
  $("#emptyReset").addEventListener("click", resetFilters);

  $("#favouritesButton").addEventListener("click", () => {
    $("#favouritesFilter").checked = true;
    renderProducts();
    $("#shop").scrollIntoView({ behavior: "smooth" });
  });

  // MODAL CONTROLS

  function openLayer(selector) {
    state.previousFocus = document.activeElement;

    $("#overlay").hidden = false;
    document.body.classList.add("locked");

    const element = $(selector);
    element.classList.add("open");
    element.setAttribute("aria-hidden", "false");
    element.focus();
  }

  function closeLayers() {
    ["#cartDrawer", "#productModal", "#checkoutModal"].forEach(selector => {
      const element = $(selector);
      element.classList.remove("open");
      element.setAttribute("aria-hidden", "true");
    });

    $("#overlay").hidden = true;
    document.body.classList.remove("locked");

    if (state.previousFocus?.isConnected) {
      state.previousFocus.focus();
    }
  }

  function switchLayer(selector) {
    closeLayers();
    openLayer(selector);
  }

  $("#overlay").addEventListener("click", closeLayers);

  $$("[data-close]").forEach(button => {
    button.addEventListener("click", closeLayers);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeLayers();
  });

  // PRODUCT DETAILS

  function openProduct(id) {
    const product = findProduct(id);
    if (!product) return;

    const mode = state.mode;
    const today = localToday();
    const price = mode === "buy" ? product.price : product.hirePrice;

    $("#productDetails").innerHTML = `
      <div class="product-detail-layout">
        <img src="${escapeHTML(product.image)}"
             alt="${escapeHTML(product.name)}">

        <div class="product-detail-copy">
          <span class="eyebrow">
            ${escapeHTML(product.department)} /
            ${escapeHTML(product.category)} /
            ${mode.toUpperCase()}
          </span>

          <h2>${escapeHTML(product.name)}</h2>
          <p>${escapeHTML(product.description)}</p>

          <p class="detail-price">
            ${money(price)} ${mode === "hire" ? "/ day" : ""}
          </p>

          <p>
            ${product.stock > 0
              ? "Availability to be confirmed."
              : "Currently marked out of stock."}
          </p>

          <form id="addProductForm">
            <label for="selectedSize">SIZE *</label>
            <select id="selectedSize" required>
              ${product.sizes.map(size =>
                `<option value="${escapeHTML(size)}">${escapeHTML(size)}</option>`
              ).join("")}
            </select>

            <label for="selectedColor">COLOUR *</label>
            <select id="selectedColor" required>
              ${product.colors.map(color =>
                `<option value="${escapeHTML(color)}">${escapeHTML(color)}</option>`
              ).join("")}
            </select>

            ${mode === "hire" ? `
              <div class="hire-date-grid">
                <div>
                  <label for="hireStart">HIRE START *</label>
                  <input type="date" id="hireStart" min="${today}" required>
                </div>
                <div>
                  <label for="hireEnd">RETURN DATE *</label>
                  <input type="date" id="hireEnd" min="${today}" required>
                </div>
              </div>
              <p id="hireEstimate">Choose dates to calculate your estimated hire fee.</p>
            ` : ""}

            <label for="selectedQuantity">QUANTITY *</label>
            <input type="number" id="selectedQuantity"
                   min="1" max="${Math.max(1, product.stock)}"
                   value="1" required>

            <button type="submit" class="luxury-button dark-button full-width">
              ${mode === "buy" ? "ADD TO BAG" : "ADD HIRE REQUEST"}
              <span>✿</span>
            </button>

            <p class="small-note">
              ${mode === "hire"
                ? "Hire availability, deposits and return conditions are confirmed by our team."
                : "Stock and fulfilment are confirmed by our team."}
            </p>
          </form>
        </div>
      </div>
    `;

    openLayer("#productModal");

    if (mode === "hire") {
      const calculate = () => {
        const start = $("#hireStart").value;
        const end = $("#hireEnd").value;

        $("#hireEnd").min = start || today;

        const days = hireDays(start, end);

        $("#hireEstimate").textContent = days > 0
          ? `${days} calendar day(s) × ${money(product.hirePrice)} = ${money(days * product.hirePrice)}`
          : "Choose valid hire dates.";
      };

      $("#hireStart").addEventListener("change", calculate);
      $("#hireEnd").addEventListener("change", calculate);
    }

    $("#addProductForm").addEventListener("submit", event => {
      event.preventDefault();

      const size = $("#selectedSize").value;
      const color = $("#selectedColor").value;
      const qty = Number($("#selectedQuantity").value);

      const start = mode === "hire" ? $("#hireStart").value : "";
      const end = mode === "hire" ? $("#hireEnd").value : "";

      if (!Number.isInteger(qty) || qty < 1 || qty > product.stock) {
        notify("Please choose an available quantity.");
        return;
      }

      if (mode === "hire" &&
          (!start || !end || start < localToday() || hireDays(start, end) < 1)) {
        notify("Please choose valid hire dates.");
        return;
      }

      const existing = state.cart.find(item =>
        item.id === id &&
        item.mode === mode &&
        item.size === size &&
        item.color === color &&
        item.start === start &&
        item.end === end
      );

      if (existing) {
        if (existing.qty + qty > product.stock) {
          notify("Quantity exceeds listed stock.");
          return;
        }
        existing.qty += qty;
      } else {
        state.cart.push({ id, mode, size, color, qty, start, end });
      }

      updateCounters();
      renderCart();
      closeLayers();
      notify("Added to your shopping bag ✿");
    });
  }

  $("#productGrid").addEventListener("click", event => {
    const favouriteButton = event.target.closest("[data-favourite]");
    const viewButton = event.target.closest("[data-view]");

    if (favouriteButton) {
      const id = favouriteButton.dataset.favourite;

      state.favourites = state.favourites.includes(id)
        ? state.favourites.filter(item => item !== id)
        : [...state.favourites, id];

      updateCounters();
      renderProducts();
    } else if (viewButton) {
      openProduct(viewButton.dataset.view);
    }
  });

  // SHOPPING CART

  function renderCart() {
    $("#cartItems").innerHTML = state.cart.length
      ? state.cart.map((item, index) => {
          const product = findProduct(item.id);

          return `
            <article class="cart-item">
              <img src="${escapeHTML(product.image)}"
                   alt="${escapeHTML(product.name)}">

              <div>
                <h3>${escapeHTML(product.name)}</h3>

                <p>
                  ${item.mode.toUpperCase()} /
                  ${escapeHTML(item.size)} /
                  ${escapeHTML(item.color)}
                  ${item.mode === "hire"
                    ? `<br>${escapeHTML(item.start)} to ${escapeHTML(item.end)}
                       (${hireDays(item.start, item.end)} days)`
                    : ""}
                </p>

                <strong>${money(itemUnitPrice(product, item) * item.qty)}</strong>

                <div class="quantity-controls">
                  <button data-quantity="${index}" data-change="-1">−</button>
                  <span>${item.qty}</span>
                  <button data-quantity="${index}" data-change="1">+</button>
                  <button class="remove-item" data-remove="${index}">Remove</button>
                </div>
              </div>
            </article>
          `;
        }).join("")
      : "<p>Your shopping bag is waiting for something beautiful. ✿</p>";

    $("#cartTotal").textContent = money(cartTotal());
    $("#checkoutButton").disabled = state.cart.length === 0;

    updateCounters();
  }

  
function openShoppingCart() {
  renderCart();
  openLayer("#cartDrawer");
}

// Cart button in navigation
$("#cartButton").addEventListener(
  "click",
  openShoppingCart
);

// Floating cart button
$("#floatingCartButton").addEventListener(
  "click",
  openShoppingCart
);


  $("#cartItems").addEventListener("click", event => {
    const remove = event.target.closest("[data-remove]");
    const quantity = event.target.closest("[data-quantity]");

    if (remove) {
      state.cart.splice(Number(remove.dataset.remove), 1);
    } else if (quantity) {
      const index = Number(quantity.dataset.quantity);
      const item = state.cart[index];
      const product = findProduct(item.id);
      const next = item.qty + Number(quantity.dataset.change);

      if (next < 1) {
        state.cart.splice(index, 1);
      } else if (next <= product.stock) {
        item.qty = next;
      } else {
        notify("Quantity exceeds listed stock.");
      }
    } else {
      return;
    }

    renderCart();
  });

  // CHECKOUT

  function renderCheckout() {
    $("#orderSummaryItems").innerHTML = state.cart.map(item => {
      const product = findProduct(item.id);

      return `
        <div class="summary-item">
          <strong>${escapeHTML(product.name)}</strong>
          ${item.mode.toUpperCase()} /
          ${escapeHTML(item.size)} /
          ${escapeHTML(item.color)} /
          Qty ${item.qty}
          ${item.mode === "hire"
            ? `<br>${escapeHTML(item.start)} to ${escapeHTML(item.end)}`
            : ""}
          <br>${money(itemUnitPrice(product, item) * item.qty)}
        </div>
      `;
    }).join("");

    $("#checkoutTotal").textContent = money(cartTotal());
    $("#checkoutStatus").textContent = "";
  }

  $("#checkoutButton").addEventListener("click", () => {
    if (!state.cart.length) {
      notify("Your shopping bag is empty.");
      return;
    }

    renderCheckout();
    switchLayer("#checkoutModal");
  });

  $("#fulfilmentMethod").addEventListener("change", () => {
    const delivery = $("#fulfilmentMethod").value === "Delivery";

    $("#deliveryAddress").hidden = !delivery;
    $("#deliveryAddress textarea").required = delivery;
  });

  $("#checkoutForm").addEventListener("submit", event => {
    event.preventDefault();

    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const data = new FormData(form);

    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const address = String(data.get("address") || "").trim();
    const fulfilment = String(data.get("fulfilment") || "");

    if (!name || !phone || (fulfilment === "Delivery" && !address)) {
      $("#checkoutStatus").textContent = "Please complete all required details.";
      return;
    }

    const number = WHATSAPP_NUMBER.replace(/\D/g, "");

    if (!/^\d{10,15}$/.test(number)) {
      $("#checkoutStatus").textContent =
        "WhatsApp is not configured. Add your business number in designer-shop.js.";
      return;
    }

    const reference = "DJ-" + Date.now().toString(36).toUpperCase();

    const lines = [
      "Hello Dorah Jimmyz Collection! ✿",
      "",
      "I would like to enquire about this order.",
      "",
      `ORDER REFERENCE: ${reference}`,
      "",
      ...state.cart.flatMap((item, index) => {
        const product = findProduct(item.id);

        return [
          `${index + 1}. ${product.name} (${product.id})`,
          `Type: ${item.mode.toUpperCase()}`,
          `Size: ${item.size}`,
          `Colour: ${item.color}`,
          `Quantity: ${item.qty}`,
          item.mode === "hire"
            ? `Hire Dates: ${item.start} to ${item.end} (${hireDays(item.start, item.end)} days)`
            : "",
          `Estimated Amount: ${money(itemUnitPrice(product, item) * item.qty)}`,
          ""
        ];
      }),
      `ESTIMATED SUBTOTAL: ${money(cartTotal())}`,
      "",
      "CUSTOMER DETAILS",
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Email: ${data.get("email") || "Not provided"}`,
      `Fulfilment: ${fulfilment}`,
      `Address: ${address || "Not applicable"}`,
      `Payment Preference: ${data.get("payment")}`,
      `Notes: ${data.get("notes") || "None"}`,
      "",
      "Please confirm stock, hire availability, final charges and payment instructions.",
      "Thank you!"
    ].filter(Boolean);

    const whatsappURL =
      `https://wa.me/${number}?text=${encodeURIComponent(lines.join("\n"))}`;

    const link = document.createElement("a");
    link.href = whatsappURL;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    document.body.appendChild(link);
    link.click();
    link.remove();

    $("#checkoutStatus").textContent =
      `Order ${reference} prepared. Please send the message in WhatsApp.`;

    notify("Your WhatsApp order is ready ✿");

    // Do not clear the cart here: the customer may not
    // have actually sent the WhatsApp message.
  });

  // FOOTER AND INITIAL RENDER

 
$("#year").textContent = new Date().getFullYear();


  updateCounters();
  renderProducts();
  renderCart();

});
