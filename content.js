// CyberShield AI - content.js
// Runs on every page to detect threats in page content

(function () {
  'use strict';

  // Don't run on extension pages
  if (location.protocol === 'chrome-extension:') return;

  const PHISHING_FORM_KEYWORDS = ['password', 'credit card', 'ssn', 'social security', 'bank account', 'pin number'];
  const SUSPICIOUS_FORM_ACTIONS = ['http://', 'data:', 'javascript:'];

  function analyzePageForms() {
    const forms = document.querySelectorAll('form');
    let suspiciousCount = 0;

    forms.forEach(form => {
      const action = (form.action || '').toLowerCase();
      const inputs = form.querySelectorAll('input');
      let hasPasswordField = false;

      inputs.forEach(input => {
        if (input.type === 'password') hasPasswordField = true;
        const placeholder = (input.placeholder || '').toLowerCase();
        const name = (input.name || '').toLowerCase();
        PHISHING_FORM_KEYWORDS.forEach(kw => {
          if (placeholder.includes(kw) || name.includes(kw)) suspiciousCount++;
        });
      });

      // Form sends password over HTTP
      if (hasPasswordField && action.startsWith('http://')) {
        suspiciousCount += 3;
      }

      // Suspicious form action
      SUSPICIOUS_FORM_ACTIONS.forEach(sa => {
        if (action.startsWith(sa) && sa !== 'http://') suspiciousCount += 5;
      });
    });

    return suspiciousCount;
  }

  function checkExternalScripts() {
    const scripts = document.querySelectorAll('script[src]');
    let suspicious = 0;
    scripts.forEach(s => {
      const src = s.src.toLowerCase();
      if (src.includes('cryptominer') || src.includes('coinhive') || src.includes('crypto-loot')) {
        suspicious++;
      }
    });
    return suspicious;
  }

  // Run analysis after page loads
  setTimeout(() => {
    const formRisk = analyzePageForms();
    const scriptRisk = checkExternalScripts();
    const totalRisk = formRisk + scriptRisk;

    // Send result to background
    if (totalRisk > 0) {
      chrome.runtime.sendMessage({
        type: 'PAGE_THREAT',
        url: location.href,
        risk: totalRisk,
        source: totalRisk >= 3 ? 'Suspicious Form/Script' : 'Minor Risk'
      });
    }
  }, 1500);

})();
