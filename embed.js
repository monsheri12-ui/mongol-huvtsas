/* The embedded game only shares its content height with its containing page. */
(function () {
  'use strict';

  if (window.parent === window) return;

  const RESIZE = 'huvtsas:resize';
  const MEASURE = 'huvtsas:measure';
  let framePending = false;
  let lastHeight = 0;

  function contentHeight() {
    const shell = document.querySelector('.app-shell');
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

  window.addEventListener('message', function (event) {
    if (event.source !== window.parent || !event.data || event.data.type !== MEASURE) return;
    scheduleMeasure();
  });
  window.addEventListener('load', scheduleMeasure);
  window.addEventListener('resize', scheduleMeasure);
  window.addEventListener('huvtsas:ready', scheduleMeasure);

  const shell = document.querySelector('.app-shell');
  if (typeof ResizeObserver === 'function') {
    const observer = new ResizeObserver(scheduleMeasure);
    if (shell) observer.observe(shell);
    if (document.body) observer.observe(document.body);
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(scheduleMeasure, function () {});
  }
  scheduleMeasure();
}());
