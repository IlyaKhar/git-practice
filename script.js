/**
 * Строгая интерактивная механика проекта
 * - Свайп/скролл жесты для переключения шагов без скролла страницы
 * - Механика интерактивной шкалы оценок (1-5) со снапом к 5
 * - Минималистичный тактильный отклик через Web Audio API
 */

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  const catBox = document.getElementById('catBox');
  const swipeTrigger = document.getElementById('swipeTrigger');
  const resetBtn = document.getElementById('resetBtn');
  const confirmBtn = document.getElementById('confirmBtn');
  const resultBox = document.getElementById('resultBox');
  const gradeButtons = document.querySelectorAll('.grade-btn');
  const gradeFeedback = document.getElementById('gradeFeedback');
  const step0 = document.getElementById('step0');
  const step1 = document.getElementById('step1');

  let isActive = false;
  let isLocked = false;

  // Тактильный клик (чистый короткий щелчок на 60мс)
  let audioCtx = null;
  function clickFeedback(freq = 600, duration = 0.04) {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // аудио опционально
    }
  }

  // Переключение состояния сцены
  function setSceneState(state) {
    if (isActive === state || isLocked) return;
    isActive = state;
    isLocked = true;
    setTimeout(() => { isLocked = false; }, 300);

    if (isActive) {
      app.classList.add('is-active');
      step0.classList.remove('active');
      step1.classList.add('active');
      clickFeedback(500, 0.05);
    } else {
      app.classList.remove('is-active');
      step0.classList.add('active');
      step1.classList.remove('active');
      clickFeedback(400, 0.04);
    }
  }

  // Жест скролла / колесика мыши (без смещения окна)
  let wheelDelta = 0;
  window.addEventListener('wheel', (e) => {
    e.preventDefault();
    wheelDelta += e.deltaY;
    if (Math.abs(wheelDelta) > 25) {
      if (wheelDelta > 0) {
        setSceneState(true);
      } else {
        setSceneState(false);
      }
      wheelDelta = 0;
    }
  }, { passive: false });

  // Жест свайпа на сенсорных устройствах
  let touchStartY = 0;
  window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY;
    if (Math.abs(diff) > 35) {
      setSceneState(diff > 0);
    }
  }, { passive: true });

  // Навигация клавишами стрелок (Вниз / Вверх)
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
      setSceneState(true);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp' || e.key === 'Escape') {
      setSceneState(false);
    }
  });

  // Клики по коту и кнопкам
  catBox.addEventListener('click', () => setSceneState(!isActive));
  swipeTrigger.addEventListener('click', () => setSceneState(true));
  resetBtn.addEventListener('click', () => setSceneState(false));

  // Механика шкалы оценок: защита от занижения оценки
  const feedbackMessages = {
    '1': 'Единица отклонена: код компилируется, коммиты безупречные.',
    '2': 'Двойка заблокирована: все требования практики соблюдены.',
    '3': 'Тройка? Котик посмотрел с укоризной...',
    '4': 'Хорошо, но за старания положен высший балл!',
    '5': 'Выбран максимальный балл: 5'
  };

  gradeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.val;

      // Снимаем выделение со всех
      gradeButtons.forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');

      if (val !== '5') {
        gradeFeedback.textContent = feedbackMessages[val];
        gradeFeedback.classList.add('warn');
        clickFeedback(320, 0.08);

        // Интеллектуальный снап обратно на 5 через 700мс
        setTimeout(() => {
          gradeButtons.forEach((b) => b.classList.remove('selected'));
          const btn5 = document.querySelector('.grade-btn[data-val="5"]');
          if (btn5) {
            btn5.classList.add('selected');
            gradeFeedback.textContent = 'Оценка автоматически скорректирована на 5';
            gradeFeedback.classList.remove('warn');
            clickFeedback(650, 0.05);
          }
        }, 800);
      } else {
        gradeFeedback.textContent = feedbackMessages['5'];
        gradeFeedback.classList.remove('warn');
        clickFeedback(650, 0.05);
      }
    });
  });

  // Фиксация оценки
  confirmBtn.addEventListener('click', () => {
    clickFeedback(800, 0.08);
    resultBox.classList.add('show');
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Оценка 5 зафиксирована ✓';
    confirmBtn.style.opacity = '0.7';
    confirmBtn.style.cursor = 'default';
  });

  // Прямой переход по хэшу #rating
  if (window.location.hash === '#rating') {
    setTimeout(() => setSceneState(true), 150);
  }
});
