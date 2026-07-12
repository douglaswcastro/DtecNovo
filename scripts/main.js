const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = [...document.querySelectorAll(".site-nav a")];
const form = document.querySelector("[data-form]");
const formStatus = document.querySelector("[data-form-status]");

function syncHeader() {
  header?.classList.toggle("is-scrolled", window.scrollY > 18);
}

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

navToggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("is-open");
  document.body.classList.toggle("nav-open", Boolean(isOpen));
  header?.classList.toggle("nav-visible", Boolean(isOpen));
  navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    nav?.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    header?.classList.remove("nav-visible");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

const localAnchorLinks = navLinks.filter((link) => link.getAttribute("href")?.startsWith("#"));

const sections = localAnchorLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if (sections.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        localAnchorLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-45% 0px -48% 0px" },
  );

  sections.forEach((section) => observer.observe(section));
}

const revealTargets = document.querySelectorAll(
  ".service-card, .case-card, .result-panel, .timeline li, .section-heading, .feature-list li, .sidebar-panel",
);

revealTargets.forEach((el, index) => {
  el.classList.add("reveal");
  el.style.transitionDelay = `${Math.min(index % 4, 3) * 90}ms`;
});

if (revealTargets.length) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
  );

  revealTargets.forEach((el) => revealObserver.observe(el));
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  formStatus.textContent = "Mensagem pronta para envio. Configure um endpoint de contato para receber os dados.";
  form.reset();
});
