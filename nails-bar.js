
/* =========================================
   DORAH JIMMYZ COLLECTION — NAILS BAR
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  // ---------------------------------------
  // 1. LUCIDE ICONS
  // ---------------------------------------

  if (window.lucide) {
    lucide.createIcons();
  }

  // ---------------------------------------
  // 2. MOBILE NAVIGATION
  // ---------------------------------------

  const menuToggle = document.getElementById("nailsMenuToggle");
  const menu = document.getElementById("nailsMenu");

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

      if (window.lucide) {
        lucide.createIcons();
      }
    });

    menu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        menu.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
        menuToggle.innerHTML = '<i data-lucide="menu"></i>';

        if (window.lucide) {
          lucide.createIcons();
        }
      });
    });
  }

  // ---------------------------------------
  // 3. NAIL GALLERY FILTERS
  // ---------------------------------------

  const filterButtons = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      filterButtons.forEach(btn => {
        const selected = btn === button;
        btn.classList.toggle("active", selected);
        btn.setAttribute("aria-pressed", String(selected));
      });

      galleryItems.forEach(item => {
        item.hidden =
          filter !== "all" &&
          item.dataset.category !== filter;
      });
    });
  });

  // ---------------------------------------
  // 4. SERVICE CARD LINKS
  // ---------------------------------------

  const nailServiceSelect = document.getElementById("nailService");

  document.querySelectorAll("[data-service]").forEach(link => {
    link.addEventListener("click", () => {
      if (nailServiceSelect) {
        nailServiceSelect.value = link.dataset.service;
      }
    });
  });

  // ---------------------------------------
  // 5. PREVENT PAST BOOKING DATES
  // ---------------------------------------

  const dateInput = document.getElementById("nailDate");

  if (dateInput) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    dateInput.min = `${year}-${month}-${day}`;
  }

  // ---------------------------------------
  // 6. WHATSAPP ENQUIRY
  // ---------------------------------------

  // IMPORTANT:
  // Replace this with your business WhatsApp number.
  // Example format: 256701234567
  // No + sign, spaces or dashes.

  const businessWhatsApp = "256757156420";

  const bookingForm = document.getElementById("nailsBookingForm");
  const bookingStatus = document.getElementById("nailsBookingStatus");

  if (bookingForm) {
    bookingForm.addEventListener("submit", event => {
      event.preventDefault();

      const name = document.getElementById("nailName").value.trim();
      const phone = document.getElementById("nailPhone").value.trim();
      const service = nailServiceSelect.value;
      const date = dateInput.value;
      const message = document.getElementById("nailMessage").value.trim();

      const number = businessWhatsApp.replace(/\D/g, "");

      if (!/^\d{10,15}$/.test(number)) {
        bookingStatus.textContent =
          "WhatsApp booking is not configured yet. Please add the business number.";
        return;
      }

      const enquiry = [
        "Hello Dorah Jimmyz Collection! ✿",
        "",
        "I would like to enquire about a Nails Bar appointment.",
        "",
        `Name: ${name}`,
        `Phone: ${phone}`,
        `Service: ${service}`,
        `Preferred Date: ${date || "Not specified"}`,
        `My Nail Vision: ${message || "Not specified"}`,
        "",
        "Please let me know the availability and booking details.",
        "",
        "Thank you!"
      ].join("\n");

      const url =
        `https://wa.me/${number}?text=${encodeURIComponent(enquiry)}`;

      bookingStatus.textContent =
        "Opening WhatsApp. Please review and send your enquiry.";

      window.open(url, "_blank", "noopener,noreferrer");
    });
  }

  // ---------------------------------------
  // 7. FOOTER YEAR
  // ---------------------------------------

  const footerYear = document.getElementById("footerYear");

  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

});
