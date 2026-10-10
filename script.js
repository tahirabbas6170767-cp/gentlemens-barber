const WHATSAPP_NUMBER = "923490960035";
const initialVisibleCount = 8;

const currentYear = document.getElementById("current-year");
if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

function buildWhatsAppUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function openWhatsApp(message) {
  const url = buildWhatsAppUrl(message);
  window.open(url, "_blank", "noopener,noreferrer");
}

function setStyleSelection(styleName) {
  const styleSelect = document.getElementById("style-select");
  if (!styleSelect) return;
  const options = Array.from(styleSelect.options);
  const match = options.find((option) => option.value === styleName);
  if (match) {
    styleSelect.value = styleName;
  }
}

function setServiceSelection(serviceName) {
  const serviceSelect = document.getElementById("service-select");
  if (!serviceSelect) return;
  const options = Array.from(serviceSelect.options);
  const match = options.find((option) => option.value === serviceName);
  if (match) {
    serviceSelect.value = serviceName;
  }
}

function setupWhatsAppButtons() {
  document.querySelectorAll(".book-style").forEach((button) => {
    button.addEventListener("click", () => {
      const styleName = button.dataset.style || "Haircut Style";
      setStyleSelection(styleName);
      const message = `Hello The Gentlemen's Barber Studio! I would like to book the ${styleName} haircut. Please confirm availability and the pricing details.`;
      openWhatsApp(message);
    });
  });

  document.querySelectorAll(".hero-book").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const message = "Hello The Gentlemen's Barber Studio! I would like to book an appointment for a premium grooming session.";
      openWhatsApp(message);
    });
  });

  document.querySelector(".inquiry-button")?.addEventListener("click", () => {
    const message = "Hello The Gentlemen's Barber Studio! I have a general inquiry and would like to know more about your services.";
    openWhatsApp(message);
  });
}

function setupGalleryFilter() {
  const filterButtons = Array.from(document.querySelectorAll(".filter-btn"));
  const haircutCards = Array.from(document.querySelectorAll(".haircut-card"));
  const searchInput = document.getElementById("haircut-search");
  const loadMoreButton = document.getElementById("load-more");

  if (!filterButtons.length || !haircutCards.length) return;

  let activeFilter = "all";
  let visibleCount = initialVisibleCount;

  const getVisibleMatches = () => {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";

    return haircutCards.filter((card) => {
      const categoryMatch = activeFilter === "all" || card.dataset.category === activeFilter;
      const nameMatch = !query || (card.dataset.name || "").toLowerCase().includes(query);
      return categoryMatch && nameMatch;
    });
  };

  const renderGallery = () => {
    const matches = getVisibleMatches();

    haircutCards.forEach((card) => {
      const isVisible = matches.includes(card) && matches.indexOf(card) < visibleCount;
      card.classList.toggle("hidden", !isVisible);
    });

    if (loadMoreButton) {
      loadMoreButton.disabled = visibleCount >= matches.length;
      loadMoreButton.textContent = visibleCount >= matches.length && matches.length > 0 ? "No More Styles" : "Load More";
      loadMoreButton.classList.toggle("hidden", matches.length <= initialVisibleCount);
    }
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter || "all";
      visibleCount = initialVisibleCount;
      filterButtons.forEach((item) => item.classList.toggle("active", item === button));
      renderGallery();
    });
  });

  searchInput?.addEventListener("input", () => {
    visibleCount = initialVisibleCount;
    renderGallery();
  });

  loadMoreButton?.addEventListener("click", () => {
    const matches = getVisibleMatches();
    visibleCount = Math.min(visibleCount + 4, matches.length);
    renderGallery();
  });

  renderGallery();
}

function setupRevealAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".reveal").forEach((element) => {
    observer.observe(element);
  });
}

function setupNavigation() {
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");

  if (!navToggle || !nav) return;

  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

function setupBackToTop() {
  const backToTopButton = document.querySelector(".back-to-top");

  if (!backToTopButton) return;

  window.addEventListener("scroll", () => {
    const visible = window.scrollY > 420;
    backToTopButton.classList.toggle("visible", visible);
  });

  backToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function setupBeforeAfterSlider() {
  const rangeInput = document.getElementById("transform-range");
  const comparisonAfter = document.getElementById("comparison-after");
  const sliderHandle = document.querySelector(".slider-handle");

  if (!rangeInput || !comparisonAfter || !sliderHandle) return;

  const updateSlider = (value) => {
    const numericValue = Number(value);
    comparisonAfter.style.width = `${numericValue}%`;
    sliderHandle.style.left = `${numericValue}%`;
  };

  rangeInput.addEventListener("input", (event) => {
    updateSlider(event.target.value);
  });

  updateSlider(rangeInput.value);
}

function setupBookingForm() {
  const form = document.getElementById("booking-form");
  const status = document.getElementById("form-status");

  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("customer-name")?.value.trim() || "";
    const phone = document.getElementById("customer-phone")?.value.trim() || "";
    const service = document.getElementById("service-select")?.value.trim() || "";
    const style = document.getElementById("style-select")?.value.trim() || "";
    const date = document.getElementById("appointment-date")?.value.trim() || "";
    const time = document.getElementById("appointment-time")?.value.trim() || "";
    const notes = document.getElementById("notes")?.value.trim() || "None";

    const missingFields = [];
    if (!name) missingFields.push("Customer name");
    if (!phone) missingFields.push("WhatsApp number");
    if (!service) missingFields.push("Preferred service");
    if (!style) missingFields.push("Desired haircut style");
    if (!date) missingFields.push("Preferred date");
    if (!time) missingFields.push("Preferred time");

    if (missingFields.length) {
      status.textContent = `Please complete the following fields: ${missingFields.join(", ")}.`;
      status.style.color = "#f4b55d";
      return;
    }

    const message = [
      "Hello The Gentlemen's Barber Studio! I would like to book an appointment.",
      "",
      `Name: ${name}`,
      `Service: ${service}`,
      `Haircut Style: ${style}`,
      `Preferred Date: ${date}`,
      `Preferred Time: ${time}`,
      `Additional Notes: ${notes}`,
      "",
      "Please confirm my appointment. Thank you!"
    ].join("\n");

    status.textContent = "Opening WhatsApp...";
    status.style.color = "#c9a45c";
    openWhatsApp(message);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupWhatsAppButtons();
  setupGalleryFilter();
  setupRevealAnimations();
  setupNavigation();
  setupBackToTop();
  setupBeforeAfterSlider();
  setupBookingForm();
});
