/* Embedding exchanges content height and visible viewport geometry only. */
(function () {
  'use strict';

  if (window.parent === window) return;

  const RESIZE = 'huvtsas:resize';
  const MEASURE = 'huvtsas:measure';
  const VIEWPORT = 'huvtsas:viewport';
  const root = document.documentElement;
  let framePending = false;
  let lastHeight = 0;
  let viewportPending = false;
  let nextViewport = null;
  let lastViewport = '';
  let visibleViewportHeight = 0;
  root.classList.add('game-embedded');

  function contentHeight() {
    const welcome = document.getElementById('gameWelcome');
    // During loading or a boot failure the app shell is deliberately hidden.
    // Keep the host's fitted loader height until real content is visible.
    if ((!welcome || welcome.hidden) && root.classList.contains('game-booting')) {
      // If a later startup error replaces an already expanded welcome, return
      // the loader to the visible host area instead of keeping that tall frame.
      if (lastHeight && window.HUVTSAS_BOOT?.state === 'error' && visibleViewportHeight > 0) {
        return Math.max(240, Math.min(window.innerHeight || visibleViewportHeight, visibleViewportHeight));
      }
      return 0;
    }
    const shell = welcome && !welcome.hidden ? welcome : document.querySelector('.app-shell');
    if (!shell) return 0;

    // scrollHeight is at least the current iframe viewport height. Measuring the
    // content shell instead lets the containing page shrink as well as grow.
    const shellStyle = window.getComputedStyle(shell);
    const bodyStyle = window.getComputedStyle(document.body);
    const bottomSpace = (parseFloat(shellStyle.marginBottom) || 0)
      + (parseFloat(bodyStyle.paddingBottom) || 0)
      + (parseFloat(bodyStyle.marginBottom) || 0);
    return Math.ceil(shell.getBoundingClientRect().bottom + window.scrollY + bottomSpace);
  }

  function measure() {
    framePending = false;
    const height = contentHeight();
    if (!Number.isFinite(height) || height <= 0 || height === lastHeight) return;
    lastHeight = height;
    // The host can be a published Tilda page or its editor preview. There is no
    // learner data in this message; the receiver validates our origin/source.
    window.parent.postMessage({ type: RESIZE, height: height }, '*');
  }

  function scheduleMeasure() {
    if (framePending) return;
    framePending = true;
    window.requestAnimationFrame(measure);
  }

  function applyViewport() {
    viewportPending = false;
    const viewport = nextViewport;
    if (!viewport) return;
    const layoutHeight = Math.max(1, window.innerHeight || root.clientHeight || contentHeight());
    const top = Math.min(Math.max(0, viewport.top), layoutHeight - 1);
    const height = Math.min(viewport.height, layoutHeight - top);
    visibleViewportHeight = height;
    const key = top + ':' + height;
    if (key === lastViewport) return;
    lastViewport = key;
    root.style.setProperty('--embed-view-top', top + 'px');
    root.style.setProperty('--embed-view-height', height + 'px');
    if (lastHeight && window.HUVTSAS_BOOT?.state === 'error') scheduleMeasure();
  }

  function scheduleViewport(data) {
    if (typeof data.top !== 'number' || typeof data.height !== 'number'
      || !Number.isFinite(data.top) || !Number.isFinite(data.height) || data.height <= 0) return;
    nextViewport = { top: data.top, height: data.height };
    if (viewportPending) return;
    viewportPending = true;
    window.requestAnimationFrame(applyViewport);
  }

  window.addEventListener('message', function (event) {
    if (event.source !== window.parent || !event.data) return;
    if (event.data.type === MEASURE) scheduleMeasure();
    else if (event.data.type === VIEWPORT) scheduleViewport(event.data);
  });
  window.addEventListener('load', scheduleMeasure);
  window.addEventListener('resize', function () {
    scheduleMeasure();
    if (nextViewport) scheduleViewport(nextViewport);
  });
  window.addEventListener('huvtsas:ready', scheduleMeasure);
  document.addEventListener('huvtsas:welcome', scheduleMeasure);
  document.addEventListener('huvtsas:ready', scheduleMeasure);

  const shell = document.querySelector('.app-shell');
  if (typeof ResizeObserver === 'function') {
    const observer = new ResizeObserver(scheduleMeasure);
    if (shell) observer.observe(shell);
    const welcome = document.getElementById('gameWelcome');
    if (welcome) observer.observe(welcome);
    if (document.body) observer.observe(document.body);
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(scheduleMeasure, function () {});
  }
  scheduleMeasure();
}());
