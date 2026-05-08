const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const siteHeader = document.querySelector(".site-header");
const scrollProgress = document.querySelector(".scroll-progress");
const heroVisual = document.querySelector(".hero-visual");
const revealItems = [...document.querySelectorAll(".reveal")];
const navLinks = [...document.querySelectorAll(".site-nav a")];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

navToggle.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    siteNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  {
    rootMargin: "-45% 0px -45% 0px",
    threshold: 0,
  },
);

sections.forEach((section) => observer.observe(section));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  {
    rootMargin: "0px 0px -12% 0px",
    threshold: 0.14,
  },
);

revealItems.forEach((item) => revealObserver.observe(item));

const updateScrollEffects = () => {
  const scrollTop = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? scrollTop / maxScroll : 0;

  scrollProgress.style.setProperty("--scroll-progress", progress.toFixed(4));
  siteHeader.classList.toggle("scrolled", scrollTop > 18);

  if (!prefersReducedMotion && heroVisual) {
    const parallax = Math.min(scrollTop * 0.08, 34);
    document.documentElement.style.setProperty("--hero-parallax", parallax.toFixed(2));
  }
};

updateScrollEffects();
window.addEventListener("scroll", updateScrollEffects, { passive: true });
