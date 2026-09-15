/* Jewelix — interactions */

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const dropdown = document.querySelector(".nav-dropdown");
  const dropdownBtn = document.querySelector(".nav-dropdown-btn");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const productCards = document.querySelectorAll("#product-grid .product-card");
  const newsletterForm = document.getElementById("newsletter-form");
  const formMessage = document.getElementById("form-message");

  /* Sticky header shadow */
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 12);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      const open = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!open));
      menuToggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
      mobileMenu.hidden = open;
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open menu");
        mobileMenu.hidden = true;
      });
    });
  }

  /* Desktop dropdown */
  if (dropdown && dropdownBtn) {
    dropdownBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.toggle("open");
      dropdownBtn.setAttribute("aria-expanded", String(isOpen));
    });

    document.addEventListener("click", () => {
      dropdown.classList.remove("open");
      dropdownBtn.setAttribute("aria-expanded", "false");
    });
  }

  /* Product category filter */
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");

      let visibleIndex = 0;
      productCards.forEach((card) => {
        const category = card.dataset.category;
        const show = filter === "all" || category === filter;
        card.classList.toggle("hidden", !show);
        card.classList.remove("is-filtering");
        if (show) {
          const delay = visibleIndex * 0.05;
          visibleIndex += 1;
          card.style.setProperty("--reveal-delay", `${delay}s`);
          // Retrigger pop animation
          void card.offsetWidth;
          card.classList.add("is-filtering");
          card.style.animationDelay = `${delay}s`;
        }
      });
    });
  });

  /* Newsletter form */
  if (newsletterForm && formMessage) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = newsletterForm.email.value.trim();
      if (!email) return;

      formMessage.hidden = false;
      formMessage.textContent = `Thanks! ${email} is subscribed for the -5% offer.`;
      newsletterForm.reset();

      setTimeout(() => {
        formMessage.hidden = true;
      }, 4500);
    });
  }

  /* Scroll reveal with staggered delays */
  const revealGroups = [
    { selector: ".collection-card", step: 0.08 },
    { selector: ".feature-card", step: 0.07 },
    { selector: "#product-grid .product-card", step: 0.05 },
    { selector: ".blog-card", step: 0.08 },
    { selector: ".deal-banner, .newsletter-box, .elegance-grid, .section-intro", step: 0.05 },
  ];

  const revealTargets = [];

  revealGroups.forEach(({ selector, step }) => {
    document.querySelectorAll(selector).forEach((el, index) => {
      el.classList.add("reveal");
      el.style.setProperty("--reveal-delay", `${index * step}s`);
      revealTargets.push(el);
    });
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealTargets.forEach((el) => observer.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("visible"));
  }

  /* Active nav link on scroll */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-desktop .nav-link[href^='#']");

  const setActiveNav = () => {
    let current = "top";
    sections.forEach((section) => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) current = section.id;
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute("href")?.replace("#", "");
      link.classList.toggle("active", href === current || (current === "top" && href === "top"));
    });
  };

  window.addEventListener("scroll", setActiveNav, { passive: true });
});
