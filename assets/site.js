'use strict';
(() => {
  const config = window.SITE_CONFIG || {};
  const dialog = document.querySelector('#download-dialog');
  const target = document.querySelector('#download-target');
  const continueLink = document.querySelector('#download-continue');
  const messages = document.querySelector('#site-messages').dataset;
  let previousFocus;
  const safeUrl = (value) => {
    try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password ? url : null; }
    catch { return null; }
  };
  document.querySelector('#language-select').addEventListener('change', (event) => {
    const permitted = ['index.html', 'cn.html', 'fr.html', 'de.html', 'it.html', 'es.html', 'ko.html', 'jp.html', 'ms.html', 'th.html'];
    if (permitted.includes(event.target.value)) window.location.assign(event.target.value);
  });
  document.querySelectorAll('[data-download]').forEach((button) => {
    button.addEventListener('click', () => {
      const platform = button.dataset.download;
      const url = safeUrl(platform === 'android' ? config.androidUrl : config.iosUrl);
      previousFocus = button;
      document.querySelector('#download-title').textContent = platform === 'android' ? messages.androidTitle : messages.iosTitle;
      target.textContent = url ? url.href : messages.unavailable;
      // 地址作为文本展示，继续按钮是唯一导航入口，避免误触下载。
      target.removeAttribute('href');
      document.querySelector('#publisher-text').textContent = messages.publisher + ': ' + (config.publisher || messages.publisherUnknown);
      if (url) {
        continueLink.href = url.href;
        continueLink.removeAttribute('aria-disabled');
        continueLink.hidden = false;
      } else {
        continueLink.removeAttribute('href');
        continueLink.setAttribute('aria-disabled', 'true');
        continueLink.hidden = true;
      }
      dialog.showModal();
    });
  });
  const closeDialog = () => { dialog.close(); };
  document.querySelectorAll('[data-close-dialog]').forEach((button) => button.addEventListener('click', closeDialog));
  dialog.addEventListener('click', (event) => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) closeDialog();
  });
  dialog.addEventListener('close', () => { previousFocus?.focus(); });
  const operator = document.querySelector('#operator-name');
  operator.textContent = config.operator || messages.operatorUnknown;
  const email = document.querySelector('#operator-email');
  if (typeof config.contactEmail === 'string' && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(config.contactEmail) && !/[\r\n]/.test(config.contactEmail)) {
    email.href = 'mailto:' + config.contactEmail;
    email.textContent = config.contactEmail;
    email.hidden = false;
  }
  [['relationship-link', config.relationshipUrl], ['privacy-link', config.privacyUrl]].forEach(([id, value]) => {
    const url = safeUrl(value);
    if (url) { const link = document.getElementById(id); link.href = url.href; link.hidden = false; }
  });
})();
