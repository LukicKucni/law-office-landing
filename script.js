const header = document.querySelector(".site-header");
const revealItems = document.querySelectorAll("[data-reveal]");
const form = document.querySelector(".contact-form");
const formNote = document.querySelector("#form-note");

const updateHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

updateHeaderState();
window.addEventListener("scroll", updateHeaderState, { passive: true });

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  form.reset();
  formNote.textContent =
    "Forma je spremna za povezivanje sa vašim sistemom za prijem upita. Trenutno je prikazan demonstracioni prikaz bez slanja podataka.";
});
