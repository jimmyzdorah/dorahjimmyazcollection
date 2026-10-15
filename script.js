
// ===========================================
// DORAH JIMMYZ COLLECTION
// WEBSITE INTERACTIONS
// ===========================================

// Replace with the actual business number.
// Uganda example: 256701234567
// No + sign or spaces.

const businessWhatsApp = "256757156420";

// ===========================================
// INITIALIZE OUTLINE ICONS
// ===========================================

if (window.lucide) {
  lucide.createIcons();
}

// ===========================================
// MOBILE NAVIGATION
// ===========================================

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

function closeMobileMenu() {
  navLinks.classList.remove("active");
  menuToggle.classList.remove("open");

  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
}

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("active");

  menuToggle.classList.toggle("open", isOpen);

  menuToggle.setAttribute(
    "aria-expanded",
    String(isOpen)
  );

  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation" : "Open navigation"
  );
});

// Close when a navigation link is clicked
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

// Close when clicking outside
document.addEventListener("click", (event) => {
  if (
    !navLinks.contains(event.target) &&
    !menuToggle.contains(event.target)
  ) {
    closeMobileMenu();
  }
});

// Close on Escape
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMobileMenu();
  }
});

// Close when switching to desktop
window.addEventListener("resize", () => {
  if (window.innerWidth > 800) {
    closeMobileMenu();
  }
});

// ===========================================
// ACTIVE NAVIGATION ON SCROLL
// ===========================================

const navItems = document.querySelectorAll(".nav-item");

const sectionIds = [
  "home",
  "designer-shop",
  "makeup-studio",
  "photo-studio",
  "nails-bar",
  "contact"
];

function updateActiveNavigation() {
  const scrollPosition = window.scrollY + 170;

  let currentSection = "home";

  sectionIds.forEach((id) => {
    const section = document.getElementById(id);

    if (section && section.offsetTop <= scrollPosition) {
      currentSection = id;
    }
  });

  navItems.forEach((item) => {
    const isActive =
      item.getAttribute("href") === `#${currentSection}`;

    item.classList.toggle("active", isActive);

    if (isActive) {
      item.setAttribute("aria-current", "location");
    } else {
      item.removeAttribute("aria-current");
    }
  });
}

window.addEventListener("scroll", updateActiveNavigation, {
  passive: true
});

window.addEventListener("load", updateActiveNavigation);

updateActiveNavigation();

// ===========================================
// WHATSAPP ENQUIRY FORM
// ===========================================

const bookingForm = document.getElementById("bookingForm");
const formStatus = document.getElementById("formStatus");
const dateInput = document.getElementById("date");

// Use local date to avoid timezone errors
const now = new Date();

const today = [
  now.getFullYear(),
  String(now.getMonth() + 1).padStart(2, "0"),
  String(now.getDate()).padStart(2, "0")
].join("-");

dateInput.min = today;

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document
    .getElementById("clientName")
    .value.trim();

  const phone = document
    .getElementById("clientPhone")
    .value.trim();

  const service = document
    .getElementById("service")
    .value;

  const date = dateInput.value;

  const message = document
    .getElementById("message")
    .value.trim();

  if (!name || !phone || !service) {
    formStatus.textContent =
      "Please fill in the required fields.";
    return;
  }

  if (!/^\d{10,15}$/.test(businessWhatsApp)) {
    formStatus.textContent =
      "WhatsApp enquiries are being set up. Please contact the studio directly.";
    return;
  }

  const enquiry = [
    "Hello Dorah Jimmyz Collection! ✿",
    "",
    "I would like to make an enquiry.",
    "",
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Service: ${service}`,
    `Preferred Date: ${date || "Not specified"}`,
    "",
    `Message: ${message || "Please share more information."}`,
    "",
    "Thank you!"
  ].join("\n");

  const url =
    `https://wa.me/${businessWhatsApp}?text=${encodeURIComponent(enquiry)}`;

  formStatus.textContent =
    "Opening WhatsApp. Please press Send to complete your enquiry.";

  window.open(url, "_blank", "noopener,noreferrer");
});

// ===========================================
// AUTOMATIC COPYRIGHT YEAR
// ===========================================

document.getElementById("year").textContent =
  new Date().getFullYear();
