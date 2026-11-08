(() => {
  const install = document.getElementById('install');
  const help = document.getElementById('install-help');
  let installPrompt;
  const standalone = matchMedia('(display-mode: standalone)');
  function updateInstall() { install.hidden = standalone.matches || navigator.standalone === true; }
  updateInstall();
  standalone.addEventListener('change', updateInstall);
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    installPrompt = event;
  });
  window.addEventListener('appinstalled', () => { installPrompt = null; install.hidden = true; });
  install.addEventListener('click', async () => {
    if (installPrompt) {
      const prompt = installPrompt;
      try { await prompt.prompt(); await prompt.userChoice; }
      catch { help.showModal(); }
      installPrompt = null;
    } else { help.showModal(); }
  });
  document.getElementById('close-help').addEventListener('click', () => help.close());
  document.getElementById('done-help').addEventListener('click', () => help.close());
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(error => console.warn('Home-screen cache unavailable:', error));
  }
})();
