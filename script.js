document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================
     1. SOBRE DE BIENVENIDA Y AUDIO (ABBA)
     ========================================== */
  const welcomeOverlay = document.getElementById('welcome-overlay');
  const openBtn = document.getElementById('open-invitation-btn');
  const audio = document.getElementById('bg-music');
  const playerToggleBtn = document.getElementById('player-toggle-btn');
  const floatingMusicBtn = document.getElementById('floating-music-btn');
  const playIcon = document.getElementById('play-icon');
  const musicBars = document.getElementById('music-bars');
  const progressFill = document.getElementById('progress-fill');
  const progressTrack = document.getElementById('progress-track');
  const playerTime = document.getElementById('player-time');

  function updateMusicUI(isPlaying) {
    if (isPlaying) {
      playIcon.textContent = '❚❚';
      musicBars.classList.add('playing');
    } else {
      playIcon.textContent = '▶';
      musicBars.classList.remove('playing');
    }
  }

  function toggleAudio() {
    if (!audio) return;
    if (audio.paused) {
      audio.play().then(() => updateMusicUI(true)).catch(() => updateMusicUI(false));
    } else {
      audio.pause();
      updateMusicUI(false);
    }
  }

  if (openBtn && welcomeOverlay) {
    openBtn.addEventListener('click', () => {
      welcomeOverlay.classList.add('hidden');
      if (audio) {
        audio.volume = 0.85;
        audio.play().then(() => updateMusicUI(true)).catch(() => updateMusicUI(false));
      }
    });
  }

  if (playerToggleBtn) {
    playerToggleBtn.addEventListener('click', toggleAudio);
  }
  if (floatingMusicBtn) {
    floatingMusicBtn.addEventListener('click', toggleAudio);
  }

  if (audio) {
    audio.addEventListener('timeupdate', () => {
      if (!audio.duration) return;
      const pct = (audio.currentTime / audio.duration) * 100;
      if (progressFill) progressFill.style.width = `${pct}%`;

      const mins = Math.floor(audio.currentTime / 60);
      const secs = Math.floor(audio.currentTime % 60).toString().padStart(2, '0');
      if (playerTime) playerTime.textContent = `${mins}:${secs}`;
    });

    audio.addEventListener('play', () => updateMusicUI(true));
    audio.addEventListener('pause', () => updateMusicUI(false));
  }

  if (progressTrack && audio) {
    progressTrack.addEventListener('click', (e) => {
      if (!audio.duration) return;
      const rect = progressTrack.getBoundingClientRect();
      const clickRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      audio.currentTime = clickRatio * audio.duration;
    });
  }

  /* ==========================================
     2. CUENTA REGRESIVA (11 DICIEMBRE 2026, 5:30 PM)
     ========================================== */
  const targetDate = new Date('2026-12-11T17:30:00').getTime();
  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minutesEl = document.getElementById('cd-minutes');
  const secondsEl = document.getElementById('cd-seconds');

  function updateCountdown() {
    const now = Date.now();
    const diff = Math.max(0, targetDate - now);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ==========================================
     3. GALERÍA LIGHTBOX
     ========================================== */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const fullSrc = item.getAttribute('data-full');
      if (fullSrc && lightbox && lightboxImg) {
        lightboxImg.src = fullSrc;
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
      }
    });
  });

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  /* ==========================================
     4. ANIMACIÓN SCROLL REVEAL
     ========================================== */
  const revealItems = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((el) => observer.observe(el));

  /* ==========================================
     5. LINTERNAS FLOTANTES DE RAPUNZEL (CANVAS)
     ========================================== */
  const canvas = document.getElementById('lanterns-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const lanternCount = 26;
    const lanterns = Array.from({ length: lanternCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      w: 10 + Math.random() * 14,
      speedY: 0.25 + Math.random() * 0.55,
      swayAmp: 0.3 + Math.random() * 0.6,
      swaySpeed: 0.008 + Math.random() * 0.015,
      phase: Math.random() * Math.PI * 2,
      alpha: 0.35 + Math.random() * 0.5
    }));

    function drawLantern(l) {
      const h = l.w * 1.38;
      ctx.save();
      ctx.translate(l.x, l.y);

      // Resplandor exterior cálido
      const glow = ctx.createRadialGradient(0, 0, 2, 0, 0, l.w * 2.4);
      glow.addColorStop(0, `rgba(255, 223, 128, ${l.alpha * 0.85})`);
      glow.addColorStop(0.5, `rgba(236, 168, 56, ${l.alpha * 0.3})`);
      glow.addColorStop(1, 'rgba(236, 168, 56, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0, 0, l.w * 2.4, 0, Math.PI * 2);
      ctx.fill();

      // Cuerpo de la linterna de Rapunzel
      const bodyGrad = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
      bodyGrad.addColorStop(0, `rgba(255, 210, 115, ${l.alpha})`);
      bodyGrad.addColorStop(0.6, `rgba(255, 240, 175, ${Math.min(1, l.alpha + 0.15)})`);
      bodyGrad.addColorStop(1, `rgba(230, 145, 45, ${l.alpha})`);

      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.roundRect(-l.w / 2, -h / 2, l.w, h, 3);
      ctx.fill();

      // Núcleo de luz interior
      ctx.fillStyle = `rgba(255, 252, 220, ${Math.min(1, l.alpha + 0.25)})`;
      ctx.beginPath();
      ctx.arc(0, h * 0.12, l.w * 0.22, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    function animateLanterns() {
      ctx.clearRect(0, 0, width, height);
      lanterns.forEach((l) => {
        l.y -= l.speedY;
        l.phase += l.swaySpeed;
        l.x += Math.sin(l.phase) * l.swayAmp;

        if (l.y < -40) {
          l.y = height + 40;
          l.x = Math.random() * width;
        }
        drawLantern(l);
      });
      requestAnimationFrame(animateLanterns);
    }

    animateLanterns();
  }
});

