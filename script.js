/**
 * Интерактивная логика:
 * - Звуковые эффекты через Web Audio API (без внешних зависимостей)
 * - Анимация частиц и конфетти при нажатии на кнопку оценки
 * - Реакция котика на клик (мурлыкание, смена мыслей)
 * - Убегающая/игривая кнопка "Подумать ещё"
 * - Плавные переходы и отслеживание скролла
 */

document.addEventListener('DOMContentLoaded', () => {
  const catCard = document.getElementById('catCard');
  const catThought = document.getElementById('catThought');
  const gradeBtn = document.getElementById('gradeBtn');
  const doubtBtn = document.getElementById('doubtBtn');
  const successCard = document.getElementById('successCard');
  const neonHeart = document.getElementById('neonHeart');
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');

  // Установка размеров канваса
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Web Audio Context синтезатор звуков
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
  }

  // Звук мурлыканья / мяуканья
  function playCatSound() {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Частота от 400 Гц к 650 Гц, затем плавно вниз
      osc.frequency.setValueAtTime(450, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.15);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.4);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } catch (e) {
      console.warn('Audio error:', e);
    }
  }

  // Победный аккорд (фанфары на 5)
  function playVictorySound() {
    try {
      const ctx = getAudioContext();
      const chords = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, High C
      chords.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0.01, ctx.currentTime + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + idx * 0.08 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 1.2);
      });
    } catch (e) {
      console.warn('Audio error:', e);
    }
  }

  // Мысли котика при кликах
  const thoughts = [
    'Мяу! Проскролль вниз, не ленись! 👇',
    'Муррр... Погладил! А теперь ставь 5! 😻',
    'Код чистый, коммиты идеальные! 🚀',
    'Я слежу за твоей зачёткой! 🐾',
    'Оценка 5 гарантирует счастье! ✨'
  ];
  let thoughtIdx = 0;

  catCard.addEventListener('click', () => {
    playCatSound();
    thoughtIdx = (thoughtIdx + 1) % thoughts.length;
    catThought.textContent = thoughts[thoughtIdx];
    spawnFloatingHeart(window.innerWidth / 2, window.innerHeight * 0.4);
  });

  // Эффект клика по сердечку
  neonHeart.addEventListener('click', (e) => {
    playVictorySound();
    for (let i = 0; i < 20; i++) {
      spawnConfetti(e.clientX, e.clientY);
    }
  });

  // Логика кнопки сомнения (убегает или передумывает)
  const doubtQuotes = [
    'Точно 4? Котик плачет... 😿',
    'Подумай ещё разок! 🥺',
    'Рука не дрогнет? 🙀',
    'Ладно-ладно, ставлю 5! ❤️'
  ];
  let doubtStep = 0;

  doubtBtn.addEventListener('click', () => {
    if (doubtStep < doubtQuotes.length - 1) {
      doubtBtn.textContent = doubtQuotes[doubtStep];
      doubtStep++;
      doubtBtn.style.transform = `scale(${0.95 - doubtStep * 0.05})`;
    } else {
      // Автоматически ставим 5
      doubtBtn.textContent = 'Ладно-ладно, ставлю 5! ❤️';
      gradeBtn.click();
    }
  });

  // Нажатие на "Поставить 5"
  gradeBtn.addEventListener('click', () => {
    playVictorySound();
    successCard.classList.add('active');
    gradeBtn.innerHTML = '<span>🎉 ПЯТЁРКА ПОСТАВЛЕНА! СПАСИБО!</span>';
    gradeBtn.style.background = 'linear-gradient(135deg, #00b09b, #96c93d)';
    doubtBtn.style.display = 'none';

    // Взрыв конфетти и сердечек
    triggerBigCelebration();
  });

  // Система частиц (конфетти и сердечки)
  const particles = [];
  const colors = ['#ff2a6d', '#05d9e8', '#ffd166', '#00f2fe', '#ffffff', '#ff0844', '#7928ca'];

  function spawnConfetti(x, y) {
    particles.push({
      x: x || window.innerWidth / 2,
      y: y || window.innerHeight / 2,
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 0.7) * 16,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 10,
      type: Math.random() > 0.4 ? 'rect' : 'heart',
      alpha: 1,
      gravity: 0.35,
      friction: 0.98
    });
  }

  function spawnFloatingHeart(x, y) {
    particles.push({
      x: x + (Math.random() - 0.5) * 60,
      y: y,
      vx: (Math.random() - 0.5) * 2,
      vy: -(Math.random() * 3 + 2),
      size: Math.random() * 12 + 10,
      color: '#ff2a6d',
      rotation: (Math.random() - 0.5) * 20,
      vRot: 0,
      type: 'heart',
      alpha: 1,
      gravity: -0.05,
      friction: 0.99
    });
  }

  function triggerBigCelebration() {
    const total = 120;
    for (let i = 0; i < total; i++) {
      setTimeout(() => {
        spawnConfetti(
          window.innerWidth / 2 + (Math.random() - 0.5) * 200,
          window.innerHeight * 0.6
        );
      }, i * 15);
    }
  }

  function drawHeart(ctx, x, y, size, color, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size / 20, size / 20);
    ctx.fillStyle = color;
    ctx.globalAlpha = Math.max(0, alpha);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-10, -10, -20, 5, 0, 20);
    ctx.bezierCurveTo(20, 5, 10, -10, 0, 0);
    ctx.fill();
    ctx.restore();
  }

  function renderParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= p.friction;
      p.vy *= p.friction;
      p.rotation += p.vRot;
      p.alpha -= 0.012;

      if (p.alpha <= 0) {
        particles.splice(i, 1);
        continue;
      }

      if (p.type === 'heart') {
        drawHeart(ctx, p.x, p.y, p.size, p.color, p.alpha);
      } else {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }
    }

    requestAnimationFrame(renderParticles);
  }

  renderParticles();
});
