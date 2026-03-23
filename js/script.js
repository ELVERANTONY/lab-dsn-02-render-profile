const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const revealElements = document.querySelectorAll(".reveal");
const magneticItems = document.querySelectorAll(".magnetic");
const tiltCards = document.querySelectorAll(".tilt-card");
const interactiveCards = document.querySelectorAll(".interactive-card");
const profileImage = document.getElementById("profile-image");
let ticking = false;

const toggleHeaderState = () => {
  if (!header) {
    return;
  }

  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

const handleScrollEffects = () => {
  toggleHeaderState();

  if (ticking) {
    return;
  }

  ticking = true;
  window.requestAnimationFrame(() => {
    const offset = Math.min(window.scrollY * 0.08, 32);
    document.documentElement.style.setProperty("--parallax-offset", `${offset}px`);
    ticking = false;
  });
};

handleScrollEffects();
window.addEventListener("scroll", handleScrollEffects);

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isExpanded));
    navMenu.classList.toggle("is-open", !isExpanded);
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.setAttribute("aria-expanded", "false");
      navMenu.classList.remove("is-open");
    });
  });
}

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.18,
    rootMargin: "0px 0px -40px 0px",
  }
);

revealElements.forEach((element) => revealObserver.observe(element));

magneticItems.forEach((item) => {
  item.addEventListener("pointermove", (event) => {
    const bounds = item.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    const moveX = (x / bounds.width - 0.5) * 8;
    const moveY = (y / bounds.height - 0.5) * 8;

    item.style.transform = `translate(${moveX}px, ${moveY}px)`;
  });

  item.addEventListener("pointerleave", () => {
    item.style.transform = "";
  });
});

tiltCards.forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const bounds = card.getBoundingClientRect();
    const rotateY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 8;
    const rotateX = ((event.clientY - bounds.top) / bounds.height - 0.5) * -8;

    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

interactiveCards.forEach((card) => {
  const updateGlow = (event) => {
    const bounds = card.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;

    card.style.setProperty("--mouse-x", `${x}%`);
    card.style.setProperty("--mouse-y", `${y}%`);
    card.classList.add("is-active");
  };

  card.addEventListener("pointermove", updateGlow);
  card.addEventListener("pointerenter", updateGlow);
  card.addEventListener("pointerleave", () => {
    card.classList.remove("is-active");
  });
});

if (profileImage) {
  profileImage.addEventListener("error", () => {
    profileImage.src = "assets/img/profile-placeholder.svg";
  });
}
