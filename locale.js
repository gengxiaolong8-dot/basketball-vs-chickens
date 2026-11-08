(() => {
  const zh = {
    'Basketball vs Chickens':'篮球大战小鸡',
    brand:'球场大乱斗', edition:'迷你生存游戏', language:'语言', eyebrow:'鸡群来袭', basketball:'篮球', vs:'大战', chickens:'小鸡！',
    tagline:'一个篮球，面对整群小鸡。', tagline2:'灵活移动，收集升级，坚持 ', twoMinutes:'两分钟。',
    play:'开始游戏', install:'添加到手机桌面', free:'免费畅玩 · 无需账号', court:'主场 / 02:00', badge:'你一定可以！',
    step1:'保持移动', step1text:'手指按住屏幕即可移动。', step2:'升级能力', step2text:'收集宝石，选择升级。',
    step3:'坚持到底', step3text:'存活两分钟，赢得胜利。', auto:'篮球会自动攻击，你只需灵活移动。', download:'首次进入游戏需下载约 28 MB。',
    installTitle:'专属的游戏图标。', installIntro:'用手机浏览器打开本页，再添加到主屏幕。',
    ios:'iPhone / Safari：点击分享，再选“添加到主屏幕”。如果有“作为网页 App 打开”，请将它开启。',
    android:'安卓：打开浏览器菜单，选择“安装应用”或“添加到主屏幕”。',
    wechat:'在微信里？请先通过右上角菜单，用手机浏览器打开链接。不同浏览器的菜单名称可能不同。', gotIt:'知道了',
    'Downloading game files...':'正在下载游戏文件…', 'Loading game files...':'正在加载游戏文件…',
    'Preparing pictures and sound...':'正在准备图片和声音…', 'Starting the game...':'正在启动游戏…',
    'Ready! Tap Start Game to play with sound.':'准备好了！点击“开始游戏”即可开启声音。',
    'Could not start the game. Check your connection, then reload.':'游戏启动失败，请检查网络后重试。',
    'A game startup file could not be downloaded.':'未能下载启动文件，请检查网络。',
    'Start Game':'开始游戏', 'Reload':'重新加载',
    'First visit downloads about 28 MB.':'首次进入游戏需下载约 28 MB。', 'Keep this page open while it loads.':'加载时请保持页面打开。',
    'This connection is taking longer than usual. You can keep waiting or reload.':'当前网络加载较慢，你可以继续等待或重新加载。'
  };
  const english = new Map();
  let language;
  try { language = new URLSearchParams(location.search).get('lang') || localStorage.getItem('court-language') || 'en'; }
  catch { language = new URLSearchParams(location.search).get('lang') || 'en'; }
  language = language === 'zh' ? 'zh' : 'en';
  try { localStorage.setItem('court-language', language); } catch {}
  window.gameText = text => language === 'zh' ? (zh[text] || text) : text;
  window.getGameLanguage = () => language;
  function apply() {
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
    document.title = language === 'zh' ? '篮球大战小鸡' : 'Basketball vs Chickens';
    document.querySelectorAll('[data-i18n]').forEach(element => {
      if (!english.has(element)) english.set(element, element.textContent);
      element.textContent = language === 'zh' ? zh[element.dataset.i18n] : english.get(element);
    });
    const select = document.getElementById('language');
    if (select) { select.value = language; select.setAttribute('aria-label', language === 'zh' ? '语言' : 'Language'); }
    const play = document.querySelector('a.play');
    if (play) play.href = `play.html?lang=${language}`;
    const manifest = document.querySelector('link[rel="manifest"]');
    if (manifest) manifest.href = language === 'zh' ? 'manifest.zh.webmanifest' : 'manifest.webmanifest';
    document.querySelector('meta[name="apple-mobile-web-app-title"]')?.setAttribute('content', document.title);
    const art = document.querySelector('.court');
    if (art) art.setAttribute('aria-label', language === 'zh' ? '篮球在球场上面对一群像素小鸡' : 'A basketball faces a flock of pixel chickens on a basketball court');
    const close = document.getElementById('close-help');
    if (close) close.setAttribute('aria-label', language === 'zh' ? '关闭说明' : 'Close instructions');
  }
  window.setGameLanguage = value => {
    language = value === 'zh' ? 'zh' : 'en';
    try { localStorage.setItem('court-language', language); } catch { /* Storage can be disabled. */ }
    if (location.pathname.endsWith('/play.html') || new URLSearchParams(location.search).has('lang')) {
      const url = new URL(location.href); url.searchParams.set('lang', language);
      history.replaceState(null, '', url);
    }
    apply();
    window.dispatchEvent(new Event('gamelanguagechange'));
  };
  // Always put the selected locale in the game URL, including direct visits.
  if (location.pathname.endsWith('/play.html')) {
    const url = new URL(location.href); url.searchParams.set('lang', language);
    history.replaceState(null, '', url);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply);
  else apply();
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('language')?.addEventListener('change', event => window.setGameLanguage(event.target.value));
  });
})();
