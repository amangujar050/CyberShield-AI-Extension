// CyberShield AI - popup.js
// Presentation-based threat detection logic

// Known phishing/malicious keywords
const PHISHING_KEYWORDS = [
  'login', 'signin', 'account', 'verify', 'secure', 'update', 'confirm',
  'banking', 'paypal', 'ebay', 'amazon', 'google', 'microsoft', 'apple',
  'password', 'credential', 'suspend', 'limited', 'unlock', 'alert'
];

const SUSPICIOUS_TLDS = ['.xyz', '.tk', '.ml', '.ga', '.cf', '.gq', '.top', '.click', '.download'];

const MALWARE_PATTERNS = [
  'free-download', 'crack', 'keygen', 'serial', 'hack', 'cheat',
  'torrent', 'warez', 'nulled', 'exploit'
];

const SAFE_DOMAINS = [
  'google.com', 'youtube.com', 'wikipedia.org', 'github.com',
  'stackoverflow.com', 'microsoft.com', 'apple.com', 'amazon.com',
  'facebook.com', 'twitter.com', 'linkedin.com', 'reddit.com',
  'bbc.com', 'cnn.com', 'mozilla.org', 'chrome.google.com'
];

let scanCount = 0;
let blockedCount = 0;

// Load stored counts
chrome.storage.local.get(['scanCount', 'blockedCount'], (data) => {
  scanCount = data.scanCount || 0;
  blockedCount = data.blockedCount || 0;
  document.getElementById('scanCount').textContent = scanCount;
  document.getElementById('blockedCount').textContent = blockedCount;
});

// Get current tab and analyze
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const tab = tabs[0];
  if (!tab || !tab.url) return;

  const url = tab.url;
  document.getElementById('currentUrl').textContent = url;

  // Show scanning animation
  document.getElementById('scanBar').classList.add('active');
  document.getElementById('scanningText').classList.add('active');

  setTimeout(() => {
    analyzeUrl(url);
  }, 1800);
});

function analyzeUrl(url) {
  let urlLower = url.toLowerCase();
  let results = {};
  let totalScore = 0;

  // Hide scanning animation
  document.getElementById('scanBar').classList.remove('active');
  document.getElementById('scanningText').classList.remove('active');

  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    const protocol = urlObj.protocol;
    const path = urlObj.pathname + urlObj.search;

    // --- 1. SSL/HTTPS Check ---
    const isHttps = protocol === 'https:';
    if (isHttps) {
      setCard('ssl', 'safe', 'SECURE ✓');
      addLog('ok', 'HTTPS connection verified');
    } else {
      setCard('ssl', 'danger', 'NO HTTPS ✗');
      totalScore += 30;
      addLog('err', 'WARNING: Insecure HTTP connection!');
    }

    // --- 2. Phishing Detection (NLP-style keyword check) ---
    const isKnownSafe = SAFE_DOMAINS.some(d => hostname.endsWith(d));
    const phishingMatches = PHISHING_KEYWORDS.filter(k =>
      urlLower.includes(k) && !isKnownSafe
    );
    const hasSuspiciousTLD = SUSPICIOUS_TLDS.some(t => hostname.endsWith(t));
    const hasIPInURL = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(hostname);

    if (isKnownSafe) {
      setCard('phishing', 'safe', 'SAFE ✓');
      addLog('ok', 'Domain reputation: TRUSTED');
    } else if (phishingMatches.length >= 2 || hasSuspiciousTLD || hasIPInURL) {
      setCard('phishing', 'danger', 'DETECTED ✗');
      totalScore += 35;
      addLog('err', `Phishing signals found: ${phishingMatches.slice(0,2).join(', ')}`);
    } else if (phishingMatches.length === 1) {
      setCard('phishing', 'warning', 'SUSPICIOUS ⚠');
      totalScore += 15;
      addLog('warn', `Phishing keyword: "${phishingMatches[0]}"`);
    } else {
      setCard('phishing', 'safe', 'CLEAN ✓');
      addLog('ok', 'No phishing patterns found');
    }

    // --- 3. Malware Detection (Behavioral pattern check) ---
    const malwareMatches = MALWARE_PATTERNS.filter(p => urlLower.includes(p));
    if (malwareMatches.length > 0) {
      setCard('malware', 'danger', 'RISK FOUND ✗');
      totalScore += 30;
      addLog('err', `Malware pattern: "${malwareMatches[0]}"`);
      blockedCount++;
    } else if (hasSuspiciousTLD) {
      setCard('malware', 'warning', 'MONITOR ⚠');
      totalScore += 10;
      addLog('warn', 'Suspicious TLD detected: ' + hostname.split('.').pop());
    } else {
      setCard('malware', 'safe', 'CLEAN ✓');
      addLog('ok', 'No malware patterns detected');
    }

    // --- 4. Anomaly Detection ---
    const urlLength = url.length;
    const hasEncodedChars = (url.match(/%[0-9a-fA-F]{2}/g) || []).length;
    const subdomain_count = hostname.split('.').length;

    if (urlLength > 150 || hasEncodedChars > 5 || subdomain_count > 4) {
      setCard('anomaly', 'danger', 'ANOMALY ✗');
      totalScore += 20;
      addLog('err', `Anomaly: URL length=${urlLength}, encoded=${hasEncodedChars}`);
    } else if (urlLength > 80 || hasEncodedChars > 2) {
      setCard('anomaly', 'warning', 'UNUSUAL ⚠');
      totalScore += 8;
      addLog('warn', 'URL has unusual characteristics');
    } else {
      setCard('anomaly', 'safe', 'NORMAL ✓');
      addLog('ok', 'URL structure looks normal');
    }

    // --- 5. Redirect Detection ---
    const hasRedirectParam = ['redirect', 'url=', 'goto', 'return', 'next=', 'redir'].some(p =>
      urlLower.includes(p)
    );
    if (hasRedirectParam && !isKnownSafe) {
      setCard('redirect', 'warning', 'REDIRECT ⚠');
      totalScore += 10;
      addLog('warn', 'Redirect parameter found in URL');
    } else {
      setCard('redirect', 'safe', 'CLEAR ✓');
      addLog('ok', 'No suspicious redirects');
    }

    // --- 6. Domain Reputation ---
    const domainAge = estimateDomainTrust(hostname);
    if (isKnownSafe) {
      setCard('reputation', 'safe', 'TRUSTED ✓');
      addLog('ok', 'Domain: High reputation');
    } else if (domainAge === 'low') {
      setCard('reputation', 'danger', 'UNKNOWN ✗');
      totalScore += 15;
      addLog('warn', 'Domain reputation: UNKNOWN');
    } else {
      setCard('reputation', 'safe', 'NEUTRAL ✓');
      addLog('info', 'Domain appears legitimate');
    }

  } catch (e) {
    addLog('err', 'URL parse error: ' + e.message);
    totalScore = 100;
  }

  // Cap score
  totalScore = Math.min(totalScore, 100);

  // Update scan count
  scanCount++;
  chrome.storage.local.set({ scanCount, blockedCount });
  document.getElementById('scanCount').textContent = scanCount;
  document.getElementById('blockedCount').textContent = blockedCount;

  // Show final score
  setTimeout(() => updateScore(totalScore), 300);
  addLog('info', `Scan complete. Threat score: ${totalScore}/100`);
}

function estimateDomainTrust(hostname) {
  const trustedExtensions = ['.com', '.org', '.edu', '.gov', '.net'];
  const hasTrustedExt = trustedExtensions.some(e => hostname.endsWith(e));
  if (!hasTrustedExt) return 'low';
  if (hostname.split('.').length > 3) return 'medium';
  return 'high';
}

function setCard(id, level, text) {
  const card = document.getElementById('card-' + id);
  const status = document.getElementById('status-' + id);
  card.className = 'det-card ' + level;
  status.textContent = text;
}

function updateScore(score) {
  const scoreVal = document.getElementById('scoreVal');
  const scoreFill = document.getElementById('scoreFill');
  const badge = document.getElementById('threatBadge');

  // Animate number
  let current = 0;
  const target = score;
  const interval = setInterval(() => {
    current = Math.min(current + 2, target);
    scoreVal.textContent = current;
    if (current >= target) clearInterval(interval);
  }, 30);

  // Update ring
  const circumference = 283;
  const offset = circumference - (score / 100) * circumference;
  scoreFill.style.strokeDashoffset = offset;

  if (score === 0) {
    scoreFill.style.stroke = '#00ff88';
    badge.style.color = '#00ff88';
    badge.style.borderColor = 'rgba(0,255,136,0.5)';
    badge.textContent = 'SAFE';
  } else if (score <= 20) {
    scoreFill.style.stroke = '#00ff88';
    badge.style.color = '#00ff88';
    badge.style.borderColor = 'rgba(0,255,136,0.5)';
    badge.textContent = 'LOW RISK';
  } else if (score <= 40) {
    scoreFill.style.stroke = '#ffcc00';
    badge.style.color = '#ffcc00';
    badge.style.borderColor = 'rgba(255,204,0,0.5)';
    badge.textContent = 'MODERATE RISK';
  } else if (score <= 65) {
    scoreFill.style.stroke = '#ff6600';
    badge.style.color = '#ff6600';
    badge.style.borderColor = 'rgba(255,102,0,0.5)';
    badge.textContent = 'HIGH RISK';
    showNotification('⚠️ High Risk Website Detected!', score);
  } else {
    scoreFill.style.stroke = '#ff3355';
    badge.style.color = '#ff3355';
    badge.style.borderColor = 'rgba(255,51,85,0.5)';
    badge.textContent = 'CRITICAL THREAT';
    showNotification('🚨 CRITICAL THREAT DETECTED!', score);
  }
}

function addLog(type, msg) {
  const logBox = document.getElementById('logBox');
  const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const line = document.createElement('div');
  line.className = 'log-line';
  line.innerHTML = `<span class="log-time">${time}</span><span class="log-msg ${type}">${msg}</span>`;
  logBox.appendChild(line);
  logBox.scrollTop = logBox.scrollHeight;
}

function showNotification(title, score) {
  chrome.notifications && chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon48.png',
    title: 'CyberShield AI Alert',
    message: title + ' Threat Score: ' + score + '/100'
  });
}

function rescan() {
  location.reload();
}

function reportSite() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = tabs[0]?.url;
    if (url) {
      chrome.tabs.create({
        url: `https://safebrowsing.google.com/safebrowsing/report_phish/?url=${encodeURIComponent(url)}`
      });
    }
  });
}
