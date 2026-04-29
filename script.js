/* =========================================================
   Arley Rozo · Portafolio
   Lógica e interactividad
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initCustomCursor();
  initScrollProgress();
  initNavbar();
  initSmoothScroll();
  initMobileMenu();
  initScrollSpy();
  initRevealAnimations();
  initSkillBars();
  initCounters();
  initTypingEffect();
  initMagneticButtons();
  initTilt();
  initGlowCards();
  initParallaxHero();
  initContactForm();
  initFooterYear();
});

/* ---------- Loader ---------- */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hide'), 600);
  });
  // Failsafe
  setTimeout(() => loader.classList.add('hide'), 2500);
}

/* ---------- Cursor personalizado ---------- */
function initCustomCursor() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;
  if (window.matchMedia('(pointer: coarse)').matches) {
    dot.style.display = 'none';
    ring.style.display = 'none';
    return;
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  // Animación suave del aro siguiendo al ratón
  const animate = () => {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;
    requestAnimationFrame(animate);
  };
  animate();

  // Efecto "hover" al pasar por elementos interactivos
  const hoverables = 'a, button, .project-card, .ico-card, input, textarea, .nav-link';
  document.querySelectorAll(hoverables).forEach((el) => {
    el.addEventListener('mouseenter', () => {
      dot.classList.add('hover');
      ring.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      dot.classList.remove('hover');
      ring.classList.remove('hover');
    });
  });
}

/* ---------- Barra de progreso de scroll ---------- */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  const onScroll = () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop;
    const total = h.scrollHeight - h.clientHeight;
    const pct = total > 0 ? (scrolled / total) * 100 : 0;
    bar.style.width = `${pct}%`;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------- Navbar (sombra al hacer scroll) ---------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------- Scroll suave preciso (con offset de navbar) ---------- */
function initSmoothScroll() {
  const navHeight = () => {
    const v = getComputedStyle(document.documentElement).getPropertyValue('--nav-h');
    return parseInt(v, 10) || 70;
  };

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const offset = href === '#inicio' ? 0 : navHeight();
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });

      // Actualiza el hash sin saltos adicionales
      history.pushState(null, '', href);
    });
  });
}

/* ---------- Menú móvil ---------- */
function initMobileMenu() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    links.classList.toggle('open');
  });

  // Cerrar al hacer click en un enlace
  links.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      links.classList.remove('open');
    });
  });
}

/* ---------- Scroll spy: marcar enlace activo ---------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link');
  if (!sections.length || !links.length) return;

  const setActive = () => {
    const navH = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--nav-h'),
      10
    ) || 70;
    const scrollPos = window.scrollY + navH + 40;
    let currentId = sections[0].id;

    sections.forEach((section) => {
      if (scrollPos >= section.offsetTop) currentId = section.id;
    });

    links.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === `#${currentId}`) link.classList.add('active');
      else link.classList.remove('active');
    });
  };

  window.addEventListener('scroll', setActive, { passive: true });
  setActive();
}

/* ---------- Animación de aparición progresiva ---------- */
function initRevealAnimations() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay, 10) || 0;
          setTimeout(() => entry.target.classList.add('visible'), delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
  );

  items.forEach((el) => observer.observe(el));
}

/* ---------- Animar barras de habilidades al entrar en vista ---------- */
function initSkillBars() {
  const bars = document.querySelectorAll('.fill');
  if (!bars.length) return;

  const animateBar = (bar) => {
    const width = bar.getAttribute('data-width');
    if (width) bar.style.width = `${width}%`;
  };

  if (!('IntersectionObserver' in window)) {
    bars.forEach(animateBar);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateBar(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  bars.forEach((bar) => observer.observe(bar));
}

/* ---------- Contadores numéricos animados ---------- */
function initCounters() {
  const nums = document.querySelectorAll('.stat-num');
  if (!nums.length) return;

  const animate = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const duration = 1500;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    };
    requestAnimationFrame(tick);
  };

  if (!('IntersectionObserver' in window)) {
    nums.forEach(animate);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  nums.forEach((n) => observer.observe(n));
}

/* ---------- Efecto typing en el rol del hero ---------- */
function initTypingEffect() {
  const target = document.getElementById('typed');
  if (!target) return;

  const roles = [
    'Desarrollador Web',
    'Frontend Developer',
    'Apasionado por el código',
    'Especialista en BD',
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const tick = () => {
    const current = roles[roleIndex];

    if (deleting) {
      target.textContent = current.substring(0, charIndex--);
    } else {
      target.textContent = current.substring(0, charIndex++);
    }

    let delay = deleting ? 50 : 110;

    if (!deleting && charIndex === current.length + 1) {
      delay = 1800;
      deleting = true;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 250;
    }

    setTimeout(tick, delay);
  };

  setTimeout(tick, 800);
}

/* ---------- Botones magnéticos ---------- */
function initMagneticButtons() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const btns = document.querySelectorAll('.magnetic');

  btns.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.4}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

/* ---------- Tilt 3D en tarjetas de proyectos ---------- */
function initTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const cards = document.querySelectorAll('.tilt');

  cards.forEach((card) => {
    let raf;

    const onMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rx = ((y - rect.height / 2) / rect.height) * -8;
      const ry = ((x - rect.width / 2) / rect.width) * 8;

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
      });
    };

    const onLeave = () => {
      cancelAnimationFrame(raf);
      card.style.transform = '';
    };

    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
  });
}

/* ---------- Glow que sigue al cursor en tarjetas ---------- */
function initGlowCards() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  document.querySelectorAll('.glow-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
  });
}

/* ---------- Parallax sutil en el hero ---------- */
function initParallaxHero() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const hero = document.getElementById('inicio');
  const bg = document.getElementById('heroBg');
  if (!hero || !bg) return;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.height / 2) / rect.height;
    bg.style.transform = `translate(${x * 18}px, ${y * 18}px)`;
  });
  hero.addEventListener('mouseleave', () => {
    bg.style.transform = '';
  });
}

/* ---------- Validación del formulario de contacto ---------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const successBox = document.getElementById('formSuccess');
  const fields = {
    name: form.querySelector('#name'),
    email: form.querySelector('#email'),
    message: form.querySelector('#message'),
  };

  const showError = (key, msg) => {
    const input = fields[key];
    const errorEl = form.querySelector(`.error[data-for="${key}"]`);
    input.parentElement.classList.add('invalid');
    if (errorEl) errorEl.textContent = msg;
  };

  const clearError = (key) => {
    const input = fields[key];
    const errorEl = form.querySelector(`.error[data-for="${key}"]`);
    input.parentElement.classList.remove('invalid');
    if (errorEl) errorEl.textContent = '';
  };

  Object.entries(fields).forEach(([key, input]) => {
    input.addEventListener('input', () => clearError(key));
  });

  const validEmail = (val) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val.trim());

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const name = fields.name.value.trim();
    const email = fields.email.value.trim();
    const message = fields.message.value.trim();

    if (!name || name.length < 2) {
      showError('name', 'Ingresa tu nombre (mínimo 2 caracteres).');
      valid = false;
    } else clearError('name');

    if (!email) {
      showError('email', 'El correo es obligatorio.');
      valid = false;
    } else if (!validEmail(email)) {
      showError('email', 'Ingresa un correo válido.');
      valid = false;
    } else clearError('email');

    if (!message || message.length < 10) {
      showError('message', 'El mensaje debe tener al menos 10 caracteres.');
      valid = false;
    } else clearError('message');

    if (!valid) return;

    successBox.classList.add('show');
    form.reset();

    setTimeout(() => successBox.classList.remove('show'), 5000);
  });
}

/* ---------- Año en el footer ---------- */
function initFooterYear() {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
}
