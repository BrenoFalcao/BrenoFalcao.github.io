/* ============================================
   VENTRIX TECH – MAIN JAVASCRIPT
   Features:
   - Navbar scroll effect
   - Mobile menu toggle
   - Particle canvas hero background
   - Scroll reveal animations
   - Counter animations
   - Contact form validation
   - Active navigation links
============================================ */

(function () {
  'use strict';

  /* ---------- DOM CACHE ---------- */
  const navbar       = document.getElementById('navbar');
  const hamburger    = document.getElementById('hamburger');
  const navLinks     = document.getElementById('nav-links');
  const heroCanvas   = document.getElementById('hero-canvas');
  const contactForm  = document.getElementById('contact-form');
  const formSuccess  = document.getElementById('form-success');
  const yearEl       = document.getElementById('year');

  /* ---------- YEAR ---------- */
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- NAVBAR SCROLL ---------- */
  function handleNavbarScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  /* ---------- MOBILE MENU ---------- */
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ---------- PARTICLE CANVAS HERO ---------- */
  (function initCanvas() {
    if (!heroCanvas) return;

    const ctx = heroCanvas.getContext('2d');
    let width, height, particles, animId;

    function resize() {
      width  = heroCanvas.width  = heroCanvas.offsetWidth;
      height = heroCanvas.height = heroCanvas.offsetHeight;
    }

    function randomBetween(a, b) {
      return a + Math.random() * (b - a);
    }

    function createParticle() {
      return {
        x:       randomBetween(0, width),
        y:       randomBetween(0, height),
        r:       randomBetween(0.6, 2.2),
        vx:      randomBetween(-0.25, 0.25),
        vy:      randomBetween(-0.35, -0.1),
        alpha:   randomBetween(0.15, 0.6),
        alphaDir: Math.random() > 0.5 ? 1 : -1
      };
    }

    function initParticles() {
      const count = Math.floor((width * height) / 14000);
      particles = Array.from({ length: count }, createParticle);
    }

    function drawConnections() {
      const maxDist = 130;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const opacity = (1 - dist / maxDist) * 0.12;
            ctx.strokeStyle = `rgba(26, 127, 255, ${opacity})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      drawConnections();

      particles.forEach(function (p) {
        // Update
        p.x  += p.vx;
        p.y  += p.vy;
        p.alpha += 0.003 * p.alphaDir;

        if (p.alpha > 0.65 || p.alpha < 0.1) p.alphaDir *= -1;
        if (p.y < -10) { p.y = height + 5; p.x = randomBetween(0, width); }
        if (p.x < -10) p.x = width + 5;
        if (p.x > width + 10) p.x = -5;

        // Draw
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 180, 255, ${p.alpha})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(animate);
    }

    resize();
    initParticles();
    animate();

    const ro = new ResizeObserver(function () {
      resize();
      initParticles();
    });
    ro.observe(heroCanvas.parentElement);
  })();

  /* ---------- SCROLL REVEAL ---------- */
  function initReveal() {
    const els = document.querySelectorAll(
      '.service-card, .why-card, .pillar, .about-content, .about-visual, ' +
      '.section-header, .contact-info, .contact-form, .cta-inner, .hero-stats'
    );

    els.forEach(function (el, i) {
      el.classList.add('reveal');
      // Stagger service cards & why cards
      const parent = el.closest('.services-grid, .why-grid');
      if (parent) {
        const siblings = Array.from(parent.children);
        const idx = siblings.indexOf(el);
        if (idx >= 0) {
          el.classList.add('reveal-delay-' + Math.min(idx + 1, 5));
        }
      }
    });

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  }

  initReveal();

  /* ---------- COUNTER ANIMATION ---------- */
  function animateCounter(el) {
    const target  = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1800;
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) {
    const observer = new IntersectionObserver(
      function (entries) {
        if (entries[0].isIntersecting) {
          document.querySelectorAll('.stat-number').forEach(animateCounter);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(statsSection);
  }

  /* ---------- EMAILJS INIT ---------- */
  (function initEmailJS() {
    if (typeof emailjs !== 'undefined' && window.EMAILJS_PUBLIC_KEY && window.EMAILJS_PUBLIC_KEY !== 'SEU_PUBLIC_KEY') {
      emailjs.init({ publicKey: window.EMAILJS_PUBLIC_KEY });
    }
  })();

  /* ---------- CONTACT FORM ---------- */
  if (contactForm) {
    const nameInput    = document.getElementById('name');
    const emailInput   = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const nameError    = document.getElementById('name-error');
    const emailError   = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');
    const submitBtn    = contactForm.querySelector('button[type="submit"]');
    const submitBtnText = submitBtn.querySelector('.btn-text');

    function validateEmail(v) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    }

    function showError(input, errorEl, msg) {
      input.classList.add('error');
      errorEl.textContent = msg;
    }

    function clearError(input, errorEl) {
      input.classList.remove('error');
      errorEl.textContent = '';
    }

    function setLoading(isLoading) {
      submitBtn.classList.toggle('loading', isLoading);
      submitBtn.disabled = isLoading;
      if (submitBtnText) {
        submitBtnText.textContent = isLoading ? 'Enviando...' : 'Enviar Mensagem';
      }
    }

    function showSuccess() {
      contactForm.reset();
      formSuccess.classList.add('visible');
      setTimeout(function () {
        formSuccess.classList.remove('visible');
      }, 7000);
    }

    function showSendError(msg) {
      var errEl = document.getElementById('form-send-error');
      if (!errEl) {
        errEl = document.createElement('div');
        errEl.id = 'form-send-error';
        errEl.className = 'form-send-error';
        errEl.setAttribute('role', 'alert');
        errEl.setAttribute('aria-live', 'polite');
        submitBtn.parentNode.insertBefore(errEl, submitBtn.nextSibling);
      }
      errEl.textContent = msg;
      errEl.classList.add('visible');
      setTimeout(function () { errEl.classList.remove('visible'); }, 7000);
    }

    // Live validation
    nameInput.addEventListener('blur', function () {
      if (!nameInput.value.trim()) {
        showError(nameInput, nameError, 'Por favor, informe seu nome.');
      } else {
        clearError(nameInput, nameError);
      }
    });

    emailInput.addEventListener('blur', function () {
      if (!emailInput.value.trim()) {
        showError(emailInput, emailError, 'Por favor, informe seu e-mail.');
      } else if (!validateEmail(emailInput.value.trim())) {
        showError(emailInput, emailError, 'Informe um e-mail válido.');
      } else {
        clearError(emailInput, emailError);
      }
    });

    messageInput.addEventListener('blur', function () {
      if (!messageInput.value.trim()) {
        showError(messageInput, messageError, 'Por favor, escreva uma mensagem.');
      } else {
        clearError(messageInput, messageError);
      }
    });

   contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      let valid = true;

      if (!nameInput.value.trim()) {
        showError(nameInput, nameError, 'Por favor, informe seu nome.');
        valid = false;
      } else {
        clearError(nameInput, nameError);
      }

      if (!emailInput.value.trim()) {
        showError(emailInput, emailError, 'Por favor, informe seu e-mail.');
        valid = false;
      } else if (!validateEmail(emailInput.value.trim())) {
        showError(emailInput, emailError, 'Informe um e-mail válido.');
        valid = false;
      } else {
        clearError(emailInput, emailError);
      }

      if (!messageInput.value.trim()) {
        showError(messageInput, messageError, 'Por favor, escreva uma mensagem.');
        valid = false;
      } else {
        clearError(messageInput, messageError);
      }

      if (!valid) return;

      // Recupera as credenciais globais do window
      var publicKey  = window.EMAILJS_PUBLIC_KEY;
      var serviceId  = window.EMAILJS_SERVICE_ID;
      var templateId = window.EMAILJS_TEMPLATE_ID;

      // CORREÇÃO: Verifica se as chaves existem e não são as strings de exemplo padrão
      var emailjsReady = (
        typeof emailjs !== 'undefined' &&
        publicKey  && publicKey  !== 'SEU_PUBLIC_KEY' &&
        serviceId  && serviceId  !== 'SEU_SERVICE_ID' &&
        templateId && templateId !== 'SEU_TEMPLATE_ID'
      );

      // Monta os parâmetros exatamente como definidos no seu template do EmailJS
      var templateParams = {
        from_name:    nameInput.value.trim(),
        from_email:   emailInput.value.trim(),
        company:      document.getElementById('company').value.trim() || 'Não informado',
        phone:        document.getElementById('phone').value.trim()   || 'Não informado',
        service:      document.getElementById('service').value        || 'Não selecionado',
        message:      messageInput.value.trim(),
        reply_to:     emailInput.value.trim()
      };

      setLoading(true);

      if (emailjsReady) {
        emailjs.send(serviceId, templateId, templateParams)
          .then(function () {
            setLoading(false);
            showSuccess();
          })
          .catch(function (err) {
            setLoading(false);
            console.error('EmailJS error:', err);
            showSendError('Erro ao enviar. Tente novamente ou nos contate diretamente por e-mail.');
          });
      } else {
        // Fallback para ambiente de desenvolvimento local
        console.warn('[Ventrix] EmailJS em modo sandbox. Configure chaves válidas no index.html.');
        setTimeout(function () {
          setLoading(false);
          showSuccess();
        }, 1200);
      }
    });
  }

  /* ---------- ACTIVE SMOOTH SCROLL NAV HIGHLIGHT ---------- */
  const sections = document.querySelectorAll('section[id]');
  const allNavLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  function highlightNav() {
    let current = '';
    sections.forEach(function (sec) {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) current = sec.id;
    });
    allNavLinks.forEach(function (link) {
      link.style.color = '';
      if (link.getAttribute('href') === '#' + current) {
        link.style.color = 'var(--white)';
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });

})();
