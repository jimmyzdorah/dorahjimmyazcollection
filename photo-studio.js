
document.addEventListener("DOMContentLoaded", () => {

  // Lucide icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // Mobile navigation
  const menuToggle = document.getElementById("photoMenuToggle");
  const menu = document.getElementById("photoMenu");

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

  // Portfolio filters
  const filterButtons = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      filterButtons.forEach(btn => {
        const active = btn === button;
        btn.classList.toggle("active", active);
        btn.setAttribute("aria-pressed", String(active));
      });

      galleryItems.forEach(item => {
        item.hidden =
          filter !== "all" &&
          item.dataset.category !== filter;
      });
    });
  });

  // Preselect a service when its card is clicked
  const serviceSelect = document.getElementById("photoService");

  document.querySelectorAll("[data-service]").forEach(link => {
    link.addEventListener("click", () => {
      if (serviceSelect) {
        serviceSelect.value = link.dataset.service;
      }
    });
  });

  // Prevent past dates
  const dateInput = document.getElementById("photoDate");

  if (dateInput) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    dateInput.min = `${year}-${month}-${day}`;
  }

  // WhatsApp booking
  // Replace with the actual business number.
  // Example format: 256701234567
  const businessWhatsApp = "2567XXXXXXXX";

  const bookingForm = document.getElementById("photoBookingForm");
  const bookingStatus = document.getElementById("photoBookingStatus");

  if (bookingForm) {
    bookingForm.addEventListener("submit", event => {
      event.preventDefault();

      const name = document.getElementById("photoName").value.trim();
      const phone = document.getElementById("photoPhone").value.trim();
      const service = serviceSelect.value;
      const date = dateInput.value;
      const message = document.getElementById("photoMessage").value.trim();

      const number = businessWhatsApp.replace(/\D/g, "");

      if (!/^\d{10,15}$/.test(number)) {
        bookingStatus.textContent =
          "WhatsApp booking is not configured yet. Please add the business number.";
        return;
      }

      const enquiry = [
        "Hello Dorah Jimmyz Collection! ✿",
        "",
        "I would like to enquire about a Photo Studio session.",
        "",
        `Name: ${name}`,
        `Phone: ${phone}`,
        `Photography Service: ${service}`,
        `Preferred Date: ${date || "Not specified"}`,
        `Creative Vision: ${message || "Not specified"}`,
        "",
        "Please let me know the availability, packages and booking details.",
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

  // Footer year
  const footerYear = document.getElementById("footerYear");

  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

});
