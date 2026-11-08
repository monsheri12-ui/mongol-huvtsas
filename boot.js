(() => {
  'use strict';
  const root = document.documentElement;
  const resources = new Set(['styles', 'wardrobe', 'stories', 'audio', 'app']);
  const loaded = new Set();
  const failed = new Set();
  const welcomeSessionKey = 'huvtsas:welcome-started';
  const heroes = new Set(['nomin', 'temuulen']);
  let selectedHero = 'nomin';
  let phase = 'loading';
  let slow = false;
  let failureText = '';
  let slowTimer;
  let timeoutTimer;
  const $ = id => document.getElementById(id);
  root.classList.add('game-booting');

  function lockGame(locked) {
    const shell = document.querySelector('.app-shell');
    if (!shell) return;
    shell.inert = locked;
    if (locked) shell.setAttribute('aria-hidden', 'true');
    else shell.removeAttribute('aria-hidden');
  }
  function message() {
    if (failureText) return failureText;
    if (slow) return 'Загрузка занимает чуть больше времени. Можно подождать или попробовать ещё раз.';
    if (!loaded.has('wardrobe')) return 'Загружаем гардероб…';
    if (!loaded.has('stories')) return 'Загружаем истории…';
    if (!loaded.has('audio')) return 'Загружаем озвучку…';
    return 'Готовим примерочную…';
  }
  function render() {
    const loader = $('gameLoader');
    lockGame(phase !== 'ready');
    const welcome = $('gameWelcome');
    if (welcome) {
      welcome.hidden = phase !== 'welcome';
      welcome.inert = phase !== 'welcome';
    }
    root.classList.toggle('game-welcome', phase === 'welcome');
    if (!loader) return;
    loader.hidden = phase === 'ready' || phase === 'welcome';
    loader.classList.toggle('has-error', phase === 'error');
    loader.setAttribute('aria-busy', phase === 'loading' ? 'true' : 'false');
    const count = phase === 'ready' || phase === 'welcome' ? resources.size : loaded.size;
    const percent = Math.round(count / resources.size * 100);
    const progress = $('gameLoaderProgress');
    if (progress) {
      progress.setAttribute('aria-valuenow', String(percent));
      progress.setAttribute('aria-valuetext', percent + '% · ' + count + ' из ' + resources.size + ' этапов. ' + message());
    }
    const number = $('gameLoaderPercent');
    if (number) number.textContent = percent + '%';
    const fill = $('gameLoaderFill');
    if (fill) fill.style.width = percent + '%';
    const status = $('gameLoaderStatus');
    if (status) status.textContent = phase === 'ready' ? 'Примерочная готова.' : message();
    const retry = $('gameLoaderRetry');
    if (retry) retry.hidden = phase !== 'error' && !slow;
  }
  function clearTimers() {
    clearTimeout(slowTimer);
    clearTimeout(timeoutTimer);
  }
  function hasStarted() {
    try { return sessionStorage.getItem(welcomeSessionKey) === '1'; }
    catch (_) { return false; }
  }
  function drawWelcome() {
    const wardrobe = window.WARDROBE;
    if (typeof wardrobe?.avatar === 'function') {
      const nomin = $('welcomeArtNomin');
      const temuulen = $('welcomeArtTemuulen');
      // Preview outfits live only inside these SVG illustrations. They never
      // change the learner's equipped clothes, saved looks, or progress.
      if (nomin) nomin.innerHTML = wardrobe.avatar('nomin',
        { top: 'shirt', bottom: 'jeans', shoes: 'sneakers' },
        { shirt: '#91bfd4', jeans: '#648ab7', sneakers: '#f1eee4' });
      if (temuulen) temuulen.innerHTML = wardrobe.avatar('temuulen',
        { top: 'sweater', bottom: 'pants', shoes: 'sneakers' },
        { sweater: '#84a77c', pants: '#ccba91', sneakers: '#f1eee4' });
      for (const preview of [nomin, temuulen]) {
        preview?.querySelector?.('svg')?.setAttribute('preserveAspectRatio', 'xMidYMax meet');
      }
    }
    const nominRadio = $('welcomeHeroNomin');
    const temuulenRadio = $('welcomeHeroTemuulen');
    if (nominRadio) nominRadio.checked = selectedHero === 'nomin';
    if (temuulenRadio) temuulenRadio.checked = selectedHero === 'temuulen';
  }
  function enterGame() {
    phase = 'ready';
    root.classList.remove('game-booting');
    render();
    document.dispatchEvent(new CustomEvent('huvtsas:ready'));
  }
  function ready(options = {}) {
    // App initialization can succeed with missing optional globals. Every marked
    // asset is required for the complete game, so its download failure needs a
    // fresh attempt. Slow/timeout screens still recover after a late ready signal.
    if (phase === 'ready' || phase === 'welcome' || failed.size) return;
    clearTimers();
    failureText = '';
    slow = false;
    if (hasStarted()) {
      enterGame();
      return;
    }
    selectedHero = heroes.has(options.hero) ? options.hero : 'nomin';
    drawWelcome();
    phase = 'welcome';
    render();
    document.dispatchEvent(new CustomEvent('huvtsas:welcome'));
    $('gameWelcomeTitle')?.focus?.({ preventScroll: true });
  }
  function fail(text) {
    if (phase === 'ready') return;
    phase = 'error';
    failureText = text || 'Не получилось открыть игру. Проверь соединение и попробуй ещё раз.';
    clearTimers();
    render();
  }
  window.HUVTSAS_BOOT = Object.freeze({
    ready,
    fail,
    get state() { return phase; },
    get loaded() { return [...loaded]; }
  });
  document.addEventListener('load', event => {
    const asset = event.target?.getAttribute?.('data-game-asset');
    if (!resources.has(asset) || phase === 'ready') return;
    loaded.add(asset);
    render();
  }, true);
  window.addEventListener('error', event => {
    const asset = event.target?.getAttribute?.('data-game-asset');
    if (resources.has(asset)) {
      failed.add(asset);
      fail();
    } else if (typeof event.message === 'string' && event.message) fail();
  }, true);
  window.addEventListener('unhandledrejection', () => fail());
  document.addEventListener('readystatechange', render);
  document.addEventListener('DOMContentLoaded', render, { once: true });
  document.addEventListener('click', event => {
    if (event.target?.closest?.('#gameLoaderRetry')) location.reload();
  });
  document.addEventListener('change', event => {
    const target = event.target;
    if (phase === 'welcome' && target?.name === 'welcomeHero' && heroes.has(target.value)) {
      selectedHero = target.value;
    }
  });
  document.addEventListener('submit', event => {
    if (event.target?.id !== 'gameWelcomeForm') return;
    event.preventDefault();
    if (phase !== 'welcome' || failed.size) return;
    // The app applies the selected hero synchronously while it is still hidden.
    const accepted = document.dispatchEvent(new CustomEvent('huvtsas:start', {
      detail: { hero: selectedHero }, cancelable: true
    }));
    if (accepted === false || phase !== 'welcome' || failed.size) return;
    try { sessionStorage.setItem(welcomeSessionKey, '1'); } catch (_) {}
    enterGame();
    const game = $('game');
    if (game) {
      game.setAttribute('tabindex', '-1');
      game.focus?.({ preventScroll: true });
    }
  });
  slowTimer = setTimeout(() => {
    if (phase !== 'loading') return;
    slow = true;
    render();
  }, 20000);
  timeoutTimer = setTimeout(() => fail('Игра пока не загрузилась. Проверь соединение и попробуй ещё раз.'), 60000);
  render();
})();
