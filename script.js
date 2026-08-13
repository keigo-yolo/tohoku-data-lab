(() => {
  const header = document.querySelector(".site-header");
  const menuButton = document.querySelector(".menu-button");
  const nav = document.querySelector(".main-nav");
  const navLinks = document.querySelectorAll(".main-nav a");

  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 18);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  menuButton?.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!open));
    menuButton.setAttribute("aria-label", open ? "メニューを開く" : "メニューを閉じる");
    nav.classList.toggle("open", !open);
  });

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuButton?.setAttribute("aria-expanded", "false");
      menuButton?.setAttribute("aria-label", "メニューを開く");
    });
  });

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
  );

  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
  document.getElementById("year").textContent = new Date().getFullYear();

  // Lightweight particle network background.
  const canvas = document.getElementById("network-canvas");
  const ctx = canvas.getContext("2d");
  let nodes = [];
  let raf = 0;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(innerWidth * dpr);
    canvas.height = Math.floor(innerHeight * dpr);
    canvas.style.width = innerWidth + "px";
    canvas.style.height = innerHeight + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.max(16, Math.min(44, Math.floor(innerWidth / 34)));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      vx: (Math.random() - 0.5) * 0.14,
      vy: (Math.random() - 0.5) * 0.14,
      r: Math.random() * 1.2 + 0.35
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      if (!reducedMotion) {
        a.x += a.vx;
        a.y += a.vy;
        if (a.x < -30) a.x = innerWidth + 30;
        if (a.x > innerWidth + 30) a.x = -30;
        if (a.y < -30) a.y = innerHeight + 30;
        if (a.y > innerHeight + 30) a.y = -30;
      }

      ctx.beginPath();
      ctx.fillStyle = "rgba(103, 224, 255, 0.45)";
      ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
      ctx.fill();

      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 145) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(76, 165, 255, ${0.09 * (1 - dist / 145)})`;
          ctx.lineWidth = 0.7;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    if (!reducedMotion) raf = requestAnimationFrame(draw);
  }

  resize();
  draw();

  window.addEventListener("resize", () => {
    cancelAnimationFrame(raf);
    resize();
    draw();
  });
})();
