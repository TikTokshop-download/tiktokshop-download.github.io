'use strict';
(() => {
  const config = window.SITE_CONFIG || {};
  const messages = document.querySelector('#site-messages').dataset;
  const safeUrl = (value) => {
    try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password ? url : null; }
    catch { return null; }
  };
  document.querySelector('#language-select').addEventListener('change', (event) => {
    const permitted = ['index.html', 'cn.html', 'fr.html', 'de.html', 'it.html', 'es.html', 'ko.html', 'jp.html', 'ms.html', 'th.html'];
    if (permitted.includes(event.target.value)) window.location.assign(event.target.value);
  });
  document.querySelectorAll('[data-download]').forEach((button) => {
    const url = safeUrl(button.dataset.download === 'android' ? config.androidUrl : config.iosUrl);
    if (!url) {
      button.disabled = true;
      button.title = messages.unavailable;
      return;
    }
    button.addEventListener('click', () => window.location.assign(url.href));
  });
  document.querySelector('#publisher-text').textContent = messages.publisher + ': ' + (config.publisher || messages.publisherUnknown);
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
