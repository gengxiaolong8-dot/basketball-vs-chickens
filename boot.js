// A visible, accessible loading screen while the local Python game starts.
(() => {
  const t = text => window.gameText ? window.gameText(text) : text;
  let panel, message, progress, start, retry, details;
  let stage = 'Downloading game files...';
  let received = 0;
  let failed = false;
  let finished = false;
  let startRequested = false;
  const total = 28500000;
  const observed = new Set();

  function render() {
    if (!panel || finished) return;
    message.textContent = t(stage);
    progress.value = Math.min(95, Math.round(received / total * 100));
    const info = document.getElementById('infobox');
    if (!failed && !startRequested && info && info.textContent.includes('Ready to start')) {
      stage = 'Ready! Tap Start Game to play with sound.';
      message.textContent = t(stage);
      progress.value = 100;
      start.hidden = false;
    }
  }

  window.gameLoadStage = text => { stage = text; render(); };
  window.gameLoadFinished = () => {
    finished = true;
    if (panel) panel.remove();
    clearInterval(timer);
  };
  window.gameLoadError = text => {
    if (finished || failed) return;
    failed = true;
    stage = 'Could not start the game. Check your connection, then reload.';
    if (details) { details.hidden = false; details.textContent = t(String(text)); }
    if (retry) retry.hidden = false;
    render();
  };

  new PerformanceObserver(list => {
    for (const entry of list.getEntries()) {
      if (!observed.has(entry.name) && (entry.name.includes('/runtime/') || entry.name.includes('/game.tar.gz'))) {
        observed.add(entry.name);
        received += entry.decodedBodySize || entry.transferSize || 0;
      }
    }
    render();
  }).observe({ entryTypes: ['resource'] });
  window.addEventListener('error', event => {
    const target = event.target;
    if (target && target.tagName === 'SCRIPT') {
      window.gameLoadError('A game startup file could not be downloaded.');
    } else if (event.message) {
      window.gameLoadError(event.message);
    }
  }, true);
  window.addEventListener('unhandledrejection', event => window.gameLoadError(String(event.reason)));

  document.addEventListener('DOMContentLoaded', () => {
    panel = document.createElement('section');
    panel.id = 'game-loader';
    panel.innerHTML = `<div class="load-card"><img src="favicon.png" alt="" width="64" height="64">
      <h1>${t('Basketball vs Chickens')}</h1><p id="load-message" role="status" aria-live="polite"></p>
      <progress id="load-progress" max="100" value="0" aria-label="Game download progress"></progress>
      <p class="load-note">${t('First visit downloads about 28 MB.')}<br>${t('Keep this page open while it loads.')}</p>
      <button id="start-game" type="button" hidden>${t('Start Game')}</button>
      <button id="retry-game" type="button" hidden>${t('Reload')}</button><pre id="load-details" hidden></pre></div>`;
    document.body.appendChild(panel);
    message = document.getElementById('load-message');
    progress = document.getElementById('load-progress');
    start = document.getElementById('start-game');
    retry = document.getElementById('retry-game');
    details = document.getElementById('load-details');
    start.addEventListener('click', () => {
      startRequested = true;
      start.hidden = true;
      stage = 'Starting the game...';
      message.textContent = t(stage);
      // This real click also unlocks audio through pygbag's window listener.
    });
    retry.addEventListener('click', () => location.reload());
    render();
  });
  window.addEventListener('gamelanguagechange', render);
  const timer = setInterval(render, 250);
  setTimeout(() => {
    if (!finished && !failed && retry) {
      retry.hidden = false;
      const note = panel.querySelector('.load-note');
      if (start.hidden) note.textContent = t('This connection is taking longer than usual. You can keep waiting or reload.');
    }
  }, 60000);
})();
