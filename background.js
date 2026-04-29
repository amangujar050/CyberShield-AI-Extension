// CyberShield AI - background.js (Service Worker)
// Auto-detects threats when you navigate to any website

const DANGEROUS_PATTERNS = [
  /free[-_]?download/i, /crack/i, /keygen/i, /phishing/i,
  /malware/i, /exploit/i, /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/
];

const SUSPICIOUS_TLDS = ['.xyz', '.tk', '.ml', '.ga', '.cf', '.gq'];

// Listen for tab navigation
chrome.webNavigation.onCompleted.addListener((details) => {
  if (details.frameId !== 0) return; // Only main frame

  const url = details.url;
  if (!url || url.startsWith('chrome://') || url.startsWith('chrome-extension://')) return;

  analyzeInBackground(url, details.tabId);
});

function analyzeInBackground(url, tabId) {
  let threatScore = 0;
  let threatType = '';

  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;

    // Check protocol
    if (urlObj.protocol !== 'https:') threatScore += 20;

    // Check dangerous patterns
    for (const pattern of DANGEROUS_PATTERNS) {
      if (pattern.test(url)) {
        threatScore += 35;
        threatType = 'Malware/Exploit Pattern';
        break;
      }
    }

    // Check suspicious TLDs
    if (SUSPICIOUS_TLDS.some(tld => hostname.endsWith(tld))) {
      threatScore += 25;
      threatType = threatType || 'Suspicious Domain';
    }

    // Update badge
    if (threatScore >= 60) {
      chrome.action.setBadgeText({ text: '!!!', tabId });
      chrome.action.setBadgeBackgroundColor({ color: '#ff3355', tabId });

      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: '🚨 CyberShield AI - Threat Detected!',
        message: `Khatarnak website: ${hostname}\nThreat Score: ${threatScore}/100\nType: ${threatType}`
      });

    } else if (threatScore >= 30) {
      chrome.action.setBadgeText({ text: '⚠', tabId });
      chrome.action.setBadgeBackgroundColor({ color: '#ffcc00', tabId });
    } else {
      chrome.action.setBadgeText({ text: '✓', tabId });
      chrome.action.setBadgeBackgroundColor({ color: '#00ff88', tabId });
    }

    // Store result
    chrome.storage.local.get(['scanCount'], (data) => {
      const count = (data.scanCount || 0) + 1;
      chrome.storage.local.set({ scanCount: count, lastScan: { url, threatScore, threatType } });
    });

  } catch (e) {
    console.error('CyberShield background error:', e);
  }
}
