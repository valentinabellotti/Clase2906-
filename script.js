(function () {
  'use strict';
 
  /* 1. HAMBURGER MENU */
  const btn = document.getElementById('hamburger-btn');
  const nav = document.getElementById('primary-nav');
  if (btn && nav) {
    function toggleMenu() {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        nav.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      } else {
        nav.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
      }
    }
    btn.addEventListener('click', toggleMenu);
    nav.querySelectorAll('.navbar__link').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }));
  }
 
  /* 3. CURSO CARDS (FLIP EN MÓVIL) */
  document.querySelectorAll('.course-card').forEach(card => {
    card.addEventListener('click', function() {
      if (window.innerWidth <= 1024) {
        this.classList.toggle('active');
      }
    });
  });
 
  /* 4. REVEAL ON SCROLL */
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('show'), index * 180);
      }
    });
  }, { threshold: 0.2 });
  reveals.forEach(card => revealObserver.observe(card));
 
/* 5. CIRCUITS */
  const circuitsSection = document.querySelector('.circuits');
  if (circuitsSection) {
    const CIRCUITS = [
      { country: 'Italia',      official: 'Autodromo Nazionale Monza',    length: '5.793', turns: '11', lat: "45°37'N", lng: "09°17'E" },
      { country: 'Bélgica',     official: 'Circuit de Spa-Francorchamps', length: '7.004', turns: '19', lat: "50°26'N", lng: "05°58'E" },
      { country: 'Reino Unido', official: 'Silverstone Circuit',          length: '5.891', turns: '18', lat: "52°04'N", lng: "01°01'W" },
      { country: 'Brasil',      official: 'Autodromo José Carlos Pace',   length: '4.309', turns: '15', lat: "23°42'S", lng: "46°41'W" }
    ];
 
    let circuitCurrent = 0;
    const bgImgs    = circuitsSection.querySelectorAll('.circuits__bg-img');
    const names     = circuitsSection.querySelectorAll('.circuits__name');
    const trackImgs = circuitsSection.querySelectorAll('.circuits__track-img');
    const trackSlots = circuitsSection.querySelectorAll('.circuits__track-slot');
    const circuitDots = circuitsSection.querySelectorAll('.circuits__dot');
 
    const elCountry  = circuitsSection.querySelector('#meta-country');
    const elOfficial = circuitsSection.querySelector('#meta-official');
 
    /* ── NUEVO: tarjeta flotante arriba/abajo del hotspot tocado ── */
    const trackImages = circuitsSection.querySelector('.circuits__track-images');
    const card = circuitsSection.querySelector('#hotspotCard');
    const allHotspots = circuitsSection.querySelectorAll('.hotspot');
 
    const CARD_GAP = 14;   // separación entre el punto y la tarjeta, en px
    const EDGE_MARGIN = 10; // margen mínimo respecto a los bordes del contenedor
 
    function buildCardHTML(el) {
      const name  = el.getAttribute('data-name')  || '';
      const speed = el.getAttribute('data-speed') || '';
      const brake = el.getAttribute('data-brake') || '';
      const type  = el.getAttribute('data-type')  || '';
      const d = CIRCUITS[circuitCurrent];
 
      return (
        '<span class="circuits__hotspot-card__tag">Curva seleccionada</span>' +
        '<h4 class="circuits__hotspot-card__name">' + name + '</h4>' +
        '<div class="circuits__hotspot-card__stats">' +
          '<div><span>Velocidad</span><strong>' + speed + '</strong></div>' +
          '<div><span>Frenada</span><strong>' + brake + '</strong></div>' +
          '<div><span>Tipo</span><strong>' + type + '</strong></div>' +
        '</div>' +
        '<div class="circuits__hotspot-card__general">' +
          d.length + ' km &nbsp;·&nbsp; ' + d.turns + ' curvas &nbsp;·&nbsp; ' + d.lat + ' | ' + d.lng +
        '</div>'
      );
    }
 
    // Calcula la posición del punto (cx,cy de su <circle> o el centro del div legacy)
    // relativa al contenedor .circuits__track-images, en px.
    function getPointPosition(el) {
      const containerRect = trackImages.getBoundingClientRect();
      // el hotspot es un <g>; usamos el círculo visible (hotspot__dot) para el centro real
      const dot = el.querySelector('.hotspot__dot');
      const pointRect = dot.getBoundingClientRect();
      return {
        x: (pointRect.left + pointRect.right) / 2 - containerRect.left,
        y: (pointRect.top + pointRect.bottom) / 2 - containerRect.top,
        containerW: containerRect.width,
        containerH: containerRect.height
      };
    }
 
    function positionCard(el) {
      const pos = getPointPosition(el);
 
      // Medimos la tarjeta ya con contenido, pero todavía invisible,
      // para saber su tamaño real antes de decidir dónde ubicarla.
      card.style.visibility = 'hidden';
      card.style.left = '0px';
      card.style.top  = '0px';
      card.classList.add('visible');
      const cardW = card.offsetWidth;
      const cardH = card.offsetHeight;
 
      const fitsAbove = (pos.y - CARD_GAP - cardH) >= EDGE_MARGIN;
      const below = !fitsAbove;
 
      let left = pos.x - cardW / 2;
      left = Math.max(EDGE_MARGIN, Math.min(left, pos.containerW - cardW - EDGE_MARGIN));
 
      const top = below
        ? pos.y + CARD_GAP
        : pos.y - CARD_GAP - cardH;
 
      card.style.left = left + 'px';
      card.style.top  = top + 'px';
      card.classList.toggle('circuits__hotspot-card--below', below);
 
      // la flechita apunta siempre al punto real, aunque la tarjeta
      // se haya tenido que correr para no salirse del contenedor
      const arrowX = pos.x - left;
      card.style.setProperty('--arrow-x', arrowX + 'px');
 
      card.style.visibility = 'visible';
    }
 
    function showCornerCard(el) {
      card.innerHTML = buildCardHTML(el);
      positionCard(el);
    }
 
    function hideCornerCard() {
      card.classList.remove('visible');
    }
 
    function setActiveHotspot(el) {
      allHotspots.forEach(h => h.classList.remove('active'));
      if (el) el.classList.add('active');
    }
 
    allHotspots.forEach(spot => {
      spot.addEventListener('click', () => {
        const wasActive = spot.classList.contains('active');
        if (wasActive) {
          setActiveHotspot(null);
          hideCornerCard();
        } else {
          setActiveHotspot(spot);
          showCornerCard(spot);
        }
      });
      // accesibilidad: los <g class="hotspot" tabindex="0" role="button"> del SVG
      // también responden a teclado (Enter / Espacio)
      spot.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          spot.click();
        }
      });
    });
 
    // si la tarjeta está abierta y cambia el tamaño de ventana, recalculamos
    // su posición (o la cerramos si el hotspot activo ya no está visible)
    window.addEventListener('resize', () => {
      const active = circuitsSection.querySelector('.hotspot.active');
      if (active) positionCard(active);
    });
    /* ── fin bloque nuevo ── */
 
    function goToCircuit(next) {
      bgImgs[circuitCurrent].classList.remove('active');
      names[circuitCurrent].classList.remove('active');
      trackImgs[circuitCurrent].classList.remove('active');
      trackSlots[circuitCurrent].classList.remove('active');
      circuitDots[circuitCurrent].classList.remove('active');
 
      circuitCurrent = next;
 
      bgImgs[circuitCurrent].classList.add('active');
      names[circuitCurrent].classList.add('active');
      trackImgs[circuitCurrent].classList.add('active');
      trackSlots[circuitCurrent].classList.add('active');
      circuitDots[circuitCurrent].classList.add('active');
 
      // al cambiar de circuito, resetea el hotspot activo y cierra la tarjeta
      setActiveHotspot(null);
      hideCornerCard();
 
      const d = CIRCUITS[circuitCurrent];
      if (elCountry)  elCountry.textContent  = d.country;
      if (elOfficial) elOfficial.textContent = d.official;
    }
 
    circuitsSection.querySelector('#btnNext').addEventListener('click', () =>
      goToCircuit((circuitCurrent + 1) % CIRCUITS.length)
    );
    circuitsSection.querySelector('#btnPrev').addEventListener('click', () =>
      goToCircuit((circuitCurrent - 1 + CIRCUITS.length) % CIRCUITS.length)
    );
    circuitDots.forEach((dot, i) => dot.addEventListener('click', () => goToCircuit(i)));
 
    /* Swipe mobile */
    let ctx = 0, cty = 0;
    circuitsSection.addEventListener('touchstart', e => {
      ctx = e.changedTouches[0].screenX;
      cty = e.changedTouches[0].screenY;
    }, { passive: true });
    circuitsSection.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].screenX - ctx;
      const dy = e.changedTouches[0].screenY - cty;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 44) {
        dx < 0
          ? goToCircuit((circuitCurrent + 1) % CIRCUITS.length)
          : goToCircuit((circuitCurrent - 1 + CIRCUITS.length) % CIRCUITS.length);
      }
    }, { passive: true });
  }
 
})();
 
 
/* 6. TESTIMONIALS */
(function initTestimonials() {
  const section = document.querySelector('.testimonials');
  if (!section) return;
 
  const cards   = section.querySelectorAll('.testimonial-card');
  const dots    = section.querySelectorAll('.testimonials__dot');
  const btnPrev = section.querySelector('.testimonials__arrow--prev');
  const btnNext = section.querySelector('.testimonials__arrow--next');
 
  const total = cards.length;
  let current = 0;
  let animating = false;
 
  function goTo(next) {
    if (animating || next === current) return;
    animating = true;
 
    cards[current].classList.remove('active');
    dots[current].classList.remove('active');
    dots[current].setAttribute('aria-selected', 'false');
 
    current = (next + total) % total;
 
    cards[current].classList.add('active');
    dots[current].classList.add('active');
    dots[current].setAttribute('aria-selected', 'true');
 
    scrollToActive();
    setTimeout(() => animating = false, 550);
  }
 
  function scrollToActive() {
    const activeCard = cards[current];
    const viewport   = section.querySelector('.testimonials__viewport');
    const viewportW  = viewport.offsetWidth;
    const cardLeft   = activeCard.offsetLeft;
    const cardW      = activeCard.offsetWidth;
    viewport.scrollTo({ left: cardLeft - (viewportW / 2) + (cardW / 2), behavior: 'smooth' });
  }
 
  const nextSlide = () => goTo(current + 1);
  const prevSlide = () => goTo(current - 1);
 
  btnNext.addEventListener('click', nextSlide);
  btnPrev.addEventListener('click', prevSlide);
 
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));
 
  cards.forEach((card, i) => {
    card.addEventListener('click', () => { if (i !== current) goTo(i); });
  });
 
  document.addEventListener('keydown', e => {
    const r = section.getBoundingClientRect();
    if (r.top >= window.innerHeight || r.bottom <= 0) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); nextSlide(); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); prevSlide(); }
  });
 
  let tx = 0, ty = 0;
  section.addEventListener('touchstart', e => {
    tx = e.changedTouches[0].screenX;
    ty = e.changedTouches[0].screenY;
  }, { passive: true });
  section.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].screenX - tx;
    const dy = e.changedTouches[0].screenY - ty;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 44) {
      dx < 0 ? nextSlide() : prevSlide();
    }
  }, { passive: true });
 
  cards[0].classList.add('active');
  dots[0].classList.add('active');
  setTimeout(scrollToActive, 100);
})();

/* 7. STATS */
(function () {
  "use strict";
 
  document.documentElement.classList.add("js");
 
  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
 
  var hasRealHover = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches;
 
  var cards = document.querySelectorAll(".stats__card");
  if (!cards.length) return;
 
  var STAGGER_MS = 90;       
  var COUNT_DURATION = 1300; 
 
  function animateCount(el, target, duration) {
    var token = (el._countToken || 0) + 1;
    el._countToken = token;
 
    var startTime = null;
 
    function step(timestamp) {
      if (el._countToken !== token) return; 
 
      if (startTime === null) startTime = timestamp;
      var elapsed = timestamp - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); 
 
      var current = Math.round(eased * target);
      el.textContent = "+" + current;
 
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = "+" + target; 
      }
    }
 
    requestAnimationFrame(step);
  }
 
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    cards.forEach(function (card) {
      card.classList.add("is-visible");
    });
    return;
  }
 
  var numberEls = document.querySelectorAll(".stats__number[data-count-to]");
  numberEls.forEach(function (el) {
    el.textContent = "+0";
  });
 
  var observer = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
 
        var card = entry.target;
        var index = Array.prototype.indexOf.call(cards, card);
        var delay = index * STAGGER_MS;
 
        card.style.animationDelay = delay + "ms";
        card.classList.add("is-visible");
 
        var numberEl = card.querySelector(".stats__number[data-count-to]");
        if (numberEl) {
          var target = parseInt(numberEl.getAttribute("data-count-to"), 10) || 0;
          setTimeout(function () {
            animateCount(numberEl, target, COUNT_DURATION);
          }, delay);
        }
 
        obs.unobserve(card);
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -40px 0px",
    }
  );
 
  cards.forEach(function (card) {
    observer.observe(card);
  });
 
  if (hasRealHover && !prefersReducedMotion) {
    cards.forEach(function (card) {
      var numberEl = card.querySelector(".stats__number[data-count-to]");
      if (!numberEl) return;
 
      var target = parseInt(numberEl.getAttribute("data-count-to"), 10) || 0;
 
      card.addEventListener("mouseenter", function () {
        animateCount(numberEl, target, COUNT_DURATION);
      });
    });
  }
})();

/* 8. FOOTER */
(function () {
  "use strict";
  var yearEl = document.getElementById("footer-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();

/* ==========================================================================
   9. PILOT EVOLUTION SECTION (Telemetría de Barras y Datos)
   ========================================================================== */
(function () {
  "use strict";

  const evolutionSection = document.querySelector("#pilot-evolution");
  if (!evolutionSection) return;

  const progressBars = evolutionSection.querySelectorAll(".report-card__progress div");

  const startTelemetryAnimation = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Animación fluida de las barras cargando
        progressBars.forEach((bar) => {
          const targetWidth = bar.getAttribute("style") || "width: 100%";
          bar.style.width = "0%"; 
          
          setTimeout(() => {
            bar.style.width = targetWidth.replace("width:", "");
          }, 100);
        });

        // Animación de números en las mini-stats operativas
        animateNumbers();

        // Desactivamos observador tras la primera carga para optimizar recursos
        observer.unobserve(entry.target);
      }
    });
  };

  const animateNumbers = () => {
    const statsNumbers = evolutionSection.querySelectorAll(".stat strong");
    statsNumbers.forEach((stat) => {
      const originalText = stat.innerText;
      if (/^[0-9%]+$/.test(originalText)) {
        let count = 0;
        const target = parseInt(originalText);
        const suffix = originalText.includes("%") ? "%" : "";
        if (isNaN(target)) return;

        const duration = 1000; 
        
        const counter = setInterval(() => {
          count += Math.ceil(target / 15);
          if (count >= target) {
            stat.innerText = originalText;
            clearInterval(counter);
          } else {
            stat.innerText = count + suffix;
          }
        }, 30);
      }
    });
  };

  const observer = new IntersectionObserver(startTelemetryAnimation, { threshold: 0.15 });
  observer.observe(evolutionSection);
})();