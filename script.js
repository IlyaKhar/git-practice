/**
 * Интерактивный движок свайпов и анимаций (Zero-Scroll Pure Black Scene)
 * - Поддержка свайпов на тачскринах (touchstart/touchend)
 * - Поддержка колеса мыши и тачпада (wheel)
 * - Поддержка перетаскивания (mouse drag)
 * - Web Audio API звуковые эффекты (котик мяукает, победный аккорд)
 * - Фейерверк сердечек и конфетти на Canvas
 */

document.addEventListener('DOMContentLoaded', () => {
  const scene = document.getElementById('scene');
  const catHero = document.getElementById('catHero');
  const catSpeech = document.getElementById('catSpeech');
  const swipeTrigger = document.getElementById('swipeTrigger');
  const floatingHeart = document.getElementById('floatingHeart');
  const gradeFiveBtn = document.getElementById('gradeFiveBtn');
  const doubtBtn = document.getElementById('doubtBtn');
  const successBanner = document.getElementById('successBanner');
  const backBtn = document.getElementById('backBtn');
  const dot1 = document.getElementById('dot1');
  const dot2 = document.getElementById('dot2');
  const dockCaption = document.getElementById('dockCaption');
  const modeToggle = document.getElementById('modeToggle');
  const canvas = document.getElementById('fxCanvas');
  const ctx = canvas.getContext('2d');

  let isRevealed = false;
  let isCooldown = false;

  // Ресайз канваса
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Web Audio Context
  let audioCtx = null;
  function getAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Мяуканье котика
  function playMeow() {
    try {
      const actx = getAudio();
      const osc = actx.createOscillator();
      const gain = actx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, actx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(750, actx.currentTime + 0.15);
      osc.frequency.exponentialRampToValueAtTime(440, actx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.01, actx.currentTime);
      gain.gain.linearRampToValueAtTime(0.25, actx.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.38);

      osc.connect(gain);
      gain.connect(actx.destination);

      osc.start();
      osc.stop(actx.currentTime + 0.38);
    } catch (e) {
      console.warn(e);
    }
  }

  // Победный аккорд на 5
  function playVictorySound() {
    try {
      const actx = getAudio();
      const freqs = [523.25, 659.25, 783.99, 1046.50]; // До, Ми, Соль, До верхней октавы
      freqs.forEach((f, i) => {
        const osc = actx.createOscillator();
        const gain = actx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, actx.currentTime + i * 0.07);

        gain.gain.setValueAtTime(0.01, actx.currentTime + i * 0.07);
        gain.gain.linearRampToValueAtTime(0.2, actx.currentTime + i * 0.07 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + i * 0.07 + 1.2);

        osc.connect(gain);
        gain.connect(actx.destination);

        osc.start(actx.currentTime + i * 0.07);
        osc.stop(actx.currentTime + i * 0.07 + 1.2);
      });
    } catch (e) {
      console.warn(e);
    }
  }

  // Переключение состояния (свайп туда / обратно)
  function setRevealed(state) {
    if (isRevealed === state || isCooldown) return;
    isRevealed = state;
    isCooldown = true;
    setTimeout(() => { isCooldown = false; }, 400);

    if (isRevealed) {
      scene.classList.add('is-revealed');
      dot1.classList.remove('active');
      dot2.classList.add('active');
      dockCaption.textContent = 'Свайпни вверх или нажми назад';
      catSpeech.textContent = 'Муррр! Сердечко для вас! ❤️';
      playMeow();
      // Выпустить немного сердечек
      for (let i = 0; i < 6; i++) {
        spawnHeart(window.innerWidth / 2, window.innerHeight * 0.4);
      }
    } else {
      scene.classList.remove('is-revealed');
      dot1.classList.add('active');
      dot2.classList.remove('active');
      dockCaption.textContent = 'Свайпни в любую сторону';
      catSpeech.textContent = 'Мяу! Свайпни меня 👇';
    }
  }

  // Обработка колеса мыши и тачпада
  let wheelDeltaY = 0;
  window.addEventListener('wheel', (e) => {
    e.preventDefault();
    wheelDeltaY += e.deltaY;
    if (Math.abs(wheelDeltaY) > 30) {
      if (wheelDeltaY > 0) {
        setRevealed(true);
      } else {
        setRevealed(false);
      }
      wheelDeltaY = 0;
    }
  }, { passive: false });

  // Обработка тач-свайпов на мобилках и планшетах
  let touchStartY = 0;
  let touchStartX = 0;

  window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diffY = touchStartY - touchEndY;
    const diffX = touchStartX - e.changedTouches[0].clientX;

    if (Math.abs(diffY) > 40 || Math.abs(diffX) > 50) {
      if (diffY > 40 || Math.abs(diffX) > 50) {
        // Свайп вверх или вбок
        setRevealed(!isRevealed);
      } else if (diffY < -40) {
        // Свайп вниз
        setRevealed(false);
      }
    }
  }, { passive: true });

  // Клики по индикаторам и кнопкам
  swipeTrigger.addEventListener('click', () => setRevealed(true));
  backBtn.addEventListener('click', () => setRevealed(false));
  modeToggle.addEventListener('click', () => setRevealed(!isRevealed));

  // Клик по котику
  const catQuotes = [
    'Муррр... Погладил! А теперь ставь 5! 😻',
    'Код чистый, коммиты безупречные! 🚀',
    'Я слежу за твоей зачёткой! 🐾',
    'Свайпни, там сюрприз! ✨',
    'Поставь 5, и будет счастье! 💖'
  ];
  let catQuoteIdx = 0;

  catHero.addEventListener('click', () => {
    playMeow();
    catQuoteIdx = (catQuoteIdx + 1) % catQuotes.length;
    catSpeech.textContent = catQuotes[catQuoteIdx];
    spawnHeart(window.innerWidth / 2, window.innerHeight * 0.4);
    if (!isRevealed) {
      setTimeout(() => setRevealed(true), 300);
    }
  });

  // Клик по вылетающему сердечку
  floatingHeart.addEventListener('click', (e) => {
    playVictorySound();
    for (let i = 0; i < 20; i++) {
      spawnConfetti(e.clientX, e.clientY);
    }
  });

  // Логика кнопки "Подумать ещё" (игриво передумывает)
  const doubtTexts = [
    'Точно 4? Котик плачет... 😿',
    'Подумай ещё разок! 🥺',
    'Рука не дрогнет? 🙀',
    'Ладно-ладно, ставлю 5! ❤️'
  ];
  let doubtCount = 0;

  doubtBtn.addEventListener('click', () => {
    if (doubtCount < doubtTexts.length - 1) {
      doubtBtn.textContent = doubtTexts[doubtCount];
      doubtCount++;
      doubtBtn.style.transform = `scale(${0.96 - doubtCount * 0.05})`;
    } else {
      doubtBtn.textContent = 'Ладно-ладно, ставлю 5! ❤️';
      gradeFiveBtn.click();
    }
  });

  // Нажатие на главную кнопку "Поставить 5"
  gradeFiveBtn.addEventListener('click', () => {
    playVictorySound();
    successBanner.classList.add('active');
    gradeFiveBtn.innerHTML = '<span>🎉 ПЯТЁРКА ВЫСТАВЛЕНА! СПАСИБО!</span>';
    gradeFiveBtn.style.background = 'linear-gradient(135deg, #00b09b, #96c93d)';
    doubtBtn.style.display = 'none';

    // Взрыв конфетти и фейерверк
    for (let i = 0; i < 140; i++) {
      setTimeout(() => {
        spawnConfetti(
          window.innerWidth / 2 + (Math.random() - 0.5) * 300,
          window.innerHeight * 0.6
        );
      }, i * 12);
    }
  });

  // Физика частиц (Конфетти и Сердечки на Canvas)
  const particles = [];
  const palette = ['#ff0844', '#ff2a6d', '#00f2fe', '#ffd166', '#ffffff', '#7928ca'];

  function spawnConfetti(x, y) {
    particles.push({
      x: x || window.innerWidth / 2,
      y: y || window.innerHeight / 2,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.75) * 18,
      size: Math.random() * 8 + 5,
      color: palette[Math.floor(Math.random() * palette.length)],
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 12,
      type: Math.random() > 0.4 ? 'rect' : 'heart',
      alpha: 1,
      gravity: 0.38,
      friction: 0.98
    });
  }

  function spawnHeart(x, y) {
    particles.push({
      x: x + (Math.random() - 0.5) * 40,
      y: y,
      vx: (Math.random() - 0.5) * 2.5,
      vy: -(Math.random() * 3 + 2.5),
      size: Math.random() * 12 + 12,
      color: '#ff0844',
      rotation: 0,
      vRot: 0,
      type: 'heart',
      alpha: 1,
      gravity: -0.06,
      friction: 0.99
    });
  }

  function drawHeartPath(c, x, y, size, color, alpha) {
    c.save();
    c.translate(x, y);
    c.scale(size / 22, size / 22);
    c.fillStyle = color;
    c.globalAlpha = Math.max(0, alpha);
    c.beginPath();
    c.moveTo(0, 0);
    c.bezierCurveTo(-10, -10, -20, 5, 0, 20);
    c.bezierCurveTo(20, 5, 10, -10, 0, 0);
    c.fill();
    c.restore();
  }

  function animate() {
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
        drawHeartPath(ctx, p.x, p.y, p.size, p.color, p.alpha);
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

    requestAnimationFrame(animate);
  }

  animate();
});
