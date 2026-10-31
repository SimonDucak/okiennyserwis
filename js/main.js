const header = document.querySelector(".site-header");
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
const toggleLabel = toggle.querySelector(".sr-only");
const mobileQuery = window.matchMedia("(max-width: 1200px)");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function setMenu(open) {
  header.classList.toggle("is-open", open);
  nav.classList.toggle("is-open", open);
  toggle.setAttribute("aria-expanded", open ? "true" : "false");
  toggleLabel.textContent = open ? "Zamknij menu" : "Otwórz menu";
}

toggle.addEventListener("click", () => {
  setMenu(toggle.getAttribute("aria-expanded") !== "true");
});

nav.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenu(false);
});

document.addEventListener("click", (event) => {
  if (!header.classList.contains("is-open")) return;
  if (header.contains(event.target)) return;
  setMenu(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});

mobileQuery.addEventListener("change", (event) => {
  if (!event.matches) setMenu(false);
});

let scrolled = window.scrollY > 8;
header.classList.toggle("is-scrolled", scrolled);

window.addEventListener(
  "scroll",
  () => {
    const next = window.scrollY > 8;
    if (next === scrolled) return;
    scrolled = next;
    header.classList.toggle("is-scrolled", next);
  },
  { passive: true }
);

const tabs = [...document.querySelectorAll(".symptom-tab")];
const panels = [...document.querySelectorAll(".symptom-panel")];

function activateTab(tab, { focus = false, scroll = false } = {}) {
  tabs.forEach((item) => {
    const selected = item === tab;
    item.setAttribute("aria-selected", selected ? "true" : "false");
    item.tabIndex = selected ? 0 : -1;
  });

  panels.forEach((panel) => {
    panel.hidden = panel.id !== tab.getAttribute("aria-controls");
  });

  if (focus) tab.focus();
  if (scroll && mobileQuery.matches) {
    tab.scrollIntoView({
      block: "nearest",
      inline: "nearest",
      behavior: reduceMotion.matches ? "auto" : "smooth",
    });
  }
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => activateTab(tab, { scroll: true }));
  tab.addEventListener("keydown", (event) => {
    const key = event.key;
    let next = null;
    if (key === "ArrowDown" || key === "ArrowRight") next = tabs[(index + 1) % tabs.length];
    if (key === "ArrowUp" || key === "ArrowLeft") next = tabs[(index - 1 + tabs.length) % tabs.length];
    if (key === "Home") next = tabs[0];
    if (key === "End") next = tabs[tabs.length - 1];
    if (!next) return;
    event.preventDefault();
    activateTab(next, { focus: true, scroll: true });
  });
});

const faqItems = [...document.querySelectorAll(".faq-item")];

faqItems.forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;
    faqItems.forEach((other) => {
      if (other !== item) other.open = false;
    });
  });
});
