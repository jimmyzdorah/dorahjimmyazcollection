
/* ==========================================
   DORAH JIMMYZ COLLECTION
   MAKEUP STUDIO JAVASCRIPT
========================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ========================================
     01 — LUCIDE ICONS
  ======================================== */

  function refreshIcons() {
    if (window.lucide) {
      lucide.createIcons();
    }
  }

  refreshIcons();


  /* ========================================
     02 — MOBILE NAVIGATION
  ======================================== */

  const menuToggle = document.getElementById("makeupMenuToggle");
  const menu = document.getElementById("makeupMenu");

  function closeMenu() {
    if (!menu || !menuToggle) return;

    menu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    menuToggle.innerHTML = '<i data-lucide="menu"></i>';

    refreshIcons();
  }

  if (menuToggle && menu) {

    menuToggle.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));

      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );

      menuToggle.innerHTML = isOpen
        ? '<i data-lucide="x"></i>'
        : '<i data-lucide="menu"></i>';

      refreshIcons();
    });

    menu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    document.addEventListener("click", event => {
      if (
        menu.classList.contains("open") &&
        !menu.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 800) {
        closeMenu();
      }
    });
  }


  /* ========================================
     03 — BEAUTY LOOKBOOK FILTERS
  ======================================== */

  const filterButtons = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");

  filterButtons.forEach(button => {

    button.addEventListener("click", () => {

      const selectedFilter = button.dataset.filter;

      filterButtons.forEach(filterButton => {
        const isActive = filterButton === button;

        filterButton.classList.toggle("active", isActive);
        filterButton.setAttribute(
          "aria-pressed",
          String(isActive)
        );
      });

      galleryItems.forEach(item => {

        const category = item.dataset.category;

        const shouldShow =
          selectedFilter === "all" ||
          category === selectedFilter;

        item.hidden = !shouldShow;

      });

    });

  });


  /* ========================================
     04 — AUTOMATIC SERVICE SELECTION
  ======================================== */

  const serviceSelect = document.getElementById("makeupService");

  document.querySelectorAll("[data-service]").forEach(link => {

    link.addEventListener("click", () => {

      const selectedService = link.dataset.service;

      if (!serviceSelect) return;

      const matchingOption = Array.from(
        serviceSelect.options
      ).find(option => option.value === selectedService);

      if (matchingOption) {
        serviceSelect.value = selectedService;
      }

    });

  });


  /* ========================================
     05 — PREFERRED DATE VALIDATION
  ======================================== */

  const dateInput = document.getElementById("makeupDate");

  if (dateInput) {

    function updateMinimumDate() {

      const today = new Date();

      const year = today.getFullYear();
      const month = String(
        today.getMonth() + 1
      ).padStart(2, "0");

      const day = String(
        today.getDate()
      ).padStart(2, "0");

      dateInput.min = `${year}-${month}-${day}`;

    }

    updateMinimumDate();

    dateInput.addEventListener("focus", updateMinimumDate);
  }


  /* ========================================
     06 — WHATSAPP BOOKING
  ======================================== */

  // IMPORTANT:
  // Replace this placeholder with your real
  // business WhatsApp number.
  //
  // Uganda example: 256701234567
  // No + sign, spaces or dashes.

  const businessWhatsApp = "256757156420";

  const bookingForm = document.getElementById("makeupBookingForm");
  const bookingStatus = document.getElementById("makeupBookingStatus");

  if (bookingForm && bookingStatus) {

    bookingForm.addEventListener("submit", event => {

      event.preventDefault();

      if (!bookingForm.reportValidity()) {
        return;
      }

      const name = document
        .getElementById("makeupName")
        .value.trim();

      const phone = document
        .getElementById("makeupPhone")
        .value.trim();

      const service = serviceSelect
        ? serviceSelect.value
        : "";

      const date = dateInput
        ? dateInput.value
        : "";

      const message = document
        .getElementById("makeupMessage")
        .value.trim();

      // Clean the business number
      const number = businessWhatsApp.replace(/\D/g, "");

      // Validate business WhatsApp number
      if (!/^\d{10,15}$/.test(number)) {

        bookingStatus.textContent =
          "WhatsApp booking is not configured yet. Please add the business number.";

        return;
      }

      // Validate required details
      if (!name || !phone || !service) {

        bookingStatus.textContent =
          "Please complete all required fields.";

        return;
      }

      // Validate preferred date if provided
      if (date && dateInput && date < dateInput.min) {

        bookingStatus.textContent =
          "Please select today or a future date.";

        return;
      }

      // Build WhatsApp message
      const enquiry = [
        "Hello Dorah Jimmyz Collection! ✿",
        "",
        "I would like to enquire about a Makeup Studio appointment.",
        "",
        "BEAUTY APPOINTMENT DETAILS",
        "------------------------------",
        `Name: ${name}`,
        `Phone: ${phone}`,
        `Service: ${service}`,
        `Preferred Date: ${date || "Not specified"}`,
        "",
        "MY BEAUTY VISION",
        message || "Not specified",
        "",
        "Please let me know your availability, pricing and booking details.",
        "",
        "Thank you!"
      ].join("\n");

      const whatsappURL =
        `https://wa.me/${number}?text=${encodeURIComponent(enquiry)}`;

      bookingStatus.textContent =
        "Opening WhatsApp. Please review and send your enquiry.";

      // Open WhatsApp in a new tab
      const whatsappWindow = window.open(
        whatsappURL,
        "_blank",
        "noopener,noreferrer"
      );

      // Fallback if browser blocks the new tab
      if (!whatsappWindow) {
        bookingStatus.textContent =
          "If WhatsApp did not open, please allow pop-ups and try again.";
      }

    });

  }


  /* ========================================
     07 — FOOTER YEAR
  ======================================== */

  const footerYear = document.getElementById("footerYear");

  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

});
