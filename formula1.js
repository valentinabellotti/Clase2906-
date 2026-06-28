/* ═══════════════════════════════════════════
   APEX — FORMULA 1 PAGE
   formula1.js
═══════════════════════════════════════════ */
 
document.addEventListener('DOMContentLoaded', () => {
 
  /* ─────────────────────────────────────────
     PROGRESS BAR
  ───────────────────────────────────────── */
  const progressFill = document.getElementById('progressFill');
  if (progressFill) {
    window.addEventListener('scroll', () => {
      const total = document.body.scrollHeight - window.innerHeight;
      const pct   = (window.scrollY / total) * 100;
      progressFill.style.width = pct + '%';
    }, { passive: true });
  }
 
  /* ─────────────────────────────────────────
     02 — HOTSPOTS DEL AUTO
  ───────────────────────────────────────── */
  const hotspots = document.querySelectorAll('.f1-hotspot');
  const panels   = document.querySelectorAll('.f1-car__info-panel');
 
  hotspots.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-spot'), 10);
 
      hotspots.forEach(h => h.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
 
      btn.classList.add('active');
      panels[idx]?.classList.add('active');
    });
  });
 
  /* ─────────────────────────────────────────
     03 — ANIMACIÓN DE VUELTA (scroll)
  ───────────────────────────────────────── */
  const lapPath    = document.getElementById('lapPath');
  const lapCar     = document.getElementById('lapCar');
  const triggers   = document.querySelectorAll('.f1-lap__trigger');
  const lapSectors = document.querySelectorAll('.f1-lap__sector');
 
  if (lapPath && triggers.length) {
    const pathLen = lapPath.getTotalLength();
    lapPath.style.strokeDasharray  = pathLen;
    lapPath.style.strokeDashoffset = pathLen;
 
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const idx = parseInt(entry.target.getAttribute('data-trigger'), 10);
        const pct = (idx + 1) / triggers.length;
 
        // Animar trazado
        lapPath.style.strokeDashoffset = pathLen * (1 - pct);
 
        // Mover punto en el path
        const point = lapPath.getPointAtLength(pathLen * pct);
        lapCar.setAttribute('cx', point.x);
        lapCar.setAttribute('cy', point.y);
 
        // Activar sector
        lapSectors.forEach((s, i) => s.classList.toggle('active', i === idx));
      });
    }, { threshold: 0.5 });
 
    triggers.forEach(t => observer.observe(t));
  }
 
  /* ─────────────────────────────────────────
     04 — SKILLS (animate on scroll)
  ───────────────────────────────────────── */
  const skills = document.querySelectorAll('.f1-skill');
  if (skills.length) {
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('is-visible'), i * 100);
          skillObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
 
    skills.forEach(s => skillObserver.observe(s));
  }
 
  /* ─────────────────────────────────────────
     05 — SESIÓN (timeline + imagen)
  ───────────────────────────────────────── */
  const steps     = document.querySelectorAll('.f1-session__step');
  const sessionImgs = document.querySelectorAll('.f1-session__img');
  const lineFill  = document.getElementById('sessionFill');
 
  if (steps.length) {
    const stepObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const idx = parseInt(entry.target.getAttribute('data-step'), 10);
 
        // Activar step
        steps.forEach((s, i) => s.classList.toggle('active', i === idx));
 
        // Cambiar imagen
        sessionImgs.forEach((img, i) => img.classList.toggle('active', i === idx));
 
        // Llenar línea
        if (lineFill) {
          const pct = ((idx + 1) / steps.length) * 100;
          lineFill.style.height = pct + '%';
        }
      });
    }, { threshold: 0.6, rootMargin: '-20% 0px -20% 0px' });
 
    steps.forEach(s => stepObserver.observe(s));
  }
 
});