(() => {
  const config = window.LOVE_STORY;
  const body = document.body;
  const intro = document.getElementById("intro");
  const menuToggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("site-nav");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll("[data-config]").forEach((element) => {
    const value = config[element.dataset.config];
    if (value !== undefined) {
      if (typeof value === "string" && value.includes("<")) {
        element.innerHTML = value;
      } else {
        element.textContent = value;
      }
    }
  });
  document.querySelectorAll("[data-image]").forEach((element) => {
    const value = config[element.dataset.image];
    if (!value) return;
    if (element instanceof HTMLImageElement) element.src = value;
    else element.style.backgroundImage = `url("${value}")`;
  });
  document.getElementById("reasons-list").innerHTML = config.reasons.map((reason, index) => `
    <li class="reveal"><span>0${index + 1}</span><span>${reason}</span><i data-lucide="heart" aria-hidden="true"></i></li>
  `).join("");
  document.getElementById("year").textContent = new Date().getFullYear();

  function createIcons() {
    if (window.lucide) window.lucide.createIcons();
  }

  window.addEventListener("load", () => {
    document.getElementById("loader").classList.add("is-hidden");
    body.classList.remove("is-loading");
    body.classList.add("intro-open");
    createIcons();
  }, { once: true });

  document.getElementById("enter-site").addEventListener("click", () => {
    intro.classList.add("is-opening");
    intro.setAttribute("aria-hidden", "true");
    body.classList.remove("intro-open");
    window.scrollTo({ top: 0, behavior: reducedMotion ? "instant" : "smooth" });
  });

  const revealObserver = new IntersectionObserver((items, observer) => {
    items.forEach((item) => {
      if (!item.isIntersecting) return;
      item.target.classList.add("is-visible");
      observer.unobserve(item.target);
    });
  }, { threshold: .12, rootMargin: "0px 0px -35px 0px" });

  function observeReveals(root = document) {
    root.querySelectorAll(".reveal:not(.is-visible)").forEach((element) => {
      if (reducedMotion) element.classList.add("is-visible");
      else revealObserver.observe(element);
    });
  }
  observeReveals();
  document.addEventListener("content:rendered", () => observeReveals());

  function closeMenu() {
    nav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    menuToggle.innerHTML = '<i data-lucide="menu" aria-hidden="true"></i>';
    createIcons();
  }
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    menuToggle.innerHTML = `<i data-lucide="${isOpen ? "x" : "menu"}" aria-hidden="true"></i>`;
    createIcons();
  });
  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  window.addEventListener("resize", () => {
    if (window.innerWidth > 640) closeMenu();
  });

  const letterStage = document.querySelector(".letter-stage");
  const letterButton = document.getElementById("letter-button");
  letterButton.addEventListener("click", () => {
    const isOpen = letterStage.classList.toggle("is-open");
    letterButton.setAttribute("aria-expanded", String(isOpen));
    letterButton.querySelector("span").textContent = isOpen ? "Close my letter" : "Open my letter";
  });

  const forgiveBtn = document.getElementById("forgive-btn");
  const apologyStatus = document.getElementById("apology-status");
  if (forgiveBtn) {
    forgiveBtn.addEventListener("click", () => {
      forgiveBtn.classList.add("is-forgiven");
      forgiveBtn.innerHTML = '<span>Makasih udah dimaafin sayang! ♡</span><i data-lucide="heart" aria-hidden="true"></i>';
      if (apologyStatus) {
        apologyStatus.textContent = "Janji aku bakal selalu berusaha buat kamu tersenyum lagi. I love you so much! ♡";
      }
      createIcons();
      const heartField = document.getElementById("heart-field");
      if (heartField) {
        for (let i = 0; i < 16; i++) {
          setTimeout(() => {
            const heart = document.createElement("span");
            heart.className = "floating-heart";
            heart.textContent = Math.random() > .5 ? "♡" : "♥";
            heart.style.left = `${5 + Math.random() * 90}%`;
            heart.style.fontSize = `${16 + Math.random() * 18}px`;
            heart.style.setProperty("--heart-duration", `${4 + Math.random() * 3}s`);
            heart.style.setProperty("--heart-drift", `${Math.round(Math.random() * 80 - 40)}px`);
            heartField.append(heart);
            setTimeout(() => heart.remove(), 7000);
          }, i * 120);
        }
      }
    });
  }

  const backToTop = document.getElementById("back-to-top");
  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("is-visible", window.scrollY > 700);
  }, { passive: true });
  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reducedMotion ? "instant" : "smooth" }));

  if (!reducedMotion && window.matchMedia("(pointer: fine)").matches) {
    const cursor = document.getElementById("cursor-dot");
    let pointerX = 0;
    let pointerY = 0;
    let frameRequested = false;
    window.addEventListener("pointermove", (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (frameRequested) return;
      frameRequested = true;
      requestAnimationFrame(() => {
        cursor.style.left = `${pointerX}px`;
        cursor.style.top = `${pointerY}px`;
        cursor.style.opacity = "1";
        frameRequested = false;
      });
    }, { passive: true });
    document.querySelectorAll("a, button, .memory-item").forEach((element) => {
      element.addEventListener("pointerenter", () => cursor.classList.add("is-active"));
      element.addEventListener("pointerleave", () => cursor.classList.remove("is-active"));
    });

    let parallaxFrame = false;
    window.addEventListener("scroll", () => {
      if (parallaxFrame) return;
      parallaxFrame = true;
      requestAnimationFrame(() => {
        const hero = document.querySelector(".hero");
        const offset = Math.min(window.scrollY * .12, 72);
        hero.querySelector(".hero-image").style.transform = `translateY(${offset}px) scale(1.04)`;
        parallaxFrame = false;
      });
    }, { passive: true });
  }

  const heartField = document.getElementById("heart-field");
  let heartTimer;
  const heartObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !heartTimer && !reducedMotion) {
      heartTimer = window.setInterval(() => {
        const heart = document.createElement("span");
        heart.className = "floating-heart";
        heart.textContent = Math.random() > .5 ? "♡" : "♥";
        heart.style.left = `${8 + Math.random() * 84}%`;
        heart.style.fontSize = `${14 + Math.random() * 17}px`;
        heart.style.setProperty("--heart-duration", `${7 + Math.random() * 4}s`);
        heart.style.setProperty("--heart-drift", `${Math.round(Math.random() * 90 - 45)}px`);
        heartField.append(heart);
        window.setTimeout(() => heart.remove(), 11500);
      }, 1350);
    } else if (!entry.isIntersecting && heartTimer) {
      window.clearInterval(heartTimer);
      heartTimer = undefined;
    }
  }, { threshold: .15 });
  heartObserver.observe(document.getElementById("final"));

  createIcons();
})();