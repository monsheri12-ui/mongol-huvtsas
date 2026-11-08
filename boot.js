(() => {
  'use strict';
  const root = document.documentElement;
  const resources = new Set(['styles', 'wardrobe', 'stories', 'audio', 'app']);
  const loaded = new Set();
  const failed = new Set();
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
    if (!loader) return;
    loader.hidden = phase === 'ready';
    loader.classList.toggle('has-error', phase === 'error');
    loader.setAttribute('aria-busy', phase === 'loading' ? 'true' : 'false');
    const count = phase === 'ready' ? resources.size : loaded.size;
    const progress = $('gameLoaderProgress');
    if (progress) {
      progress.setAttribute('aria-valuenow', String(count));
      progress.setAttribute('aria-valuetext', message());
    }
    const fill = $('gameLoaderFill');
    if (fill) fill.style.width = (count / resources.size * 100) + '%';
    const status = $('gameLoaderStatus');
    if (status) status.textContent = phase === 'ready' ? 'Примерочная готова.' : message();
    const retry = $('gameLoaderRetry');
    if (retry) retry.hidden = phase !== 'error' && !slow;
  }
  function clearTimers() {
    clearTimeout(slowTimer);
    clearTimeout(timeoutTimer);
  }
  function ready() {
    // App initialization can succeed with missing optional globals. Every marked
    // asset is required for the complete game, so its download failure needs a
    // fresh attempt. Slow/timeout screens still recover after a late ready signal.
    if (phase === 'ready' || failed.size) return;
    phase = 'ready';
    clearTimers();
    root.classList.remove('game-booting');
    render();
    document.dispatchEvent(new CustomEvent('huvtsas:ready'));
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
  slowTimer = setTimeout(() => {
    if (phase !== 'loading') return;
    slow = true;
    render();
  }, 20000);
  timeoutTimer = setTimeout(() => fail('Игра пока не загрузилась. Проверь соединение и попробуй ещё раз.'), 60000);
  render();
})();
