# 🛡️ CyberShield AI — Chrome Extension

> **AI-powered cybersecurity extension jo automatically phishing, malware, aur suspicious websites detect karta hai — real time mein!**

![Version](https://img.shields.io/badge/Version-1.0.0-00d4ff?style=flat-square)
![Manifest](https://img.shields.io/badge/Manifest-V3-00ff88?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)
![Platform](https://img.shields.io/badge/Platform-Chrome-red?style=flat-square)

---

## 📌 Yeh Extension Kya Hai?

**CyberShield AI** ek Google Chrome Extension hai jo tumhare browser mein AI-based cybersecurity tools add karta hai. Jab bhi tum koi website open karo, yeh automatically scan karta hai aur batata hai ke site safe hai ya khatarnak.

Yeh extension **AI in Cybersecurity** presentation ke concepts par based hai:
- Machine Learning threat detection
- Anomaly Detection
- NLP-based Phishing Analysis
- Behavioral Analysis
- Real-time threat scoring

---

## ✨ Features

| Feature | Description |
|--------|-------------|
| 🤖 **AI Threat Scoring** | Har website ka 0-100 threat score calculate karta hai |
| 📧 **Phishing Detection** | NLP-style analysis se phishing URLs pakadta hai |
| 💀 **Malware Detection** | Malware/crack/exploit patterns detect karta hai |
| 📊 **Anomaly Detection** | URL ki unusual structure aur encoding flag karta hai |
| 🔒 **SSL/HTTPS Check** | Insecure HTTP connections warn karta hai |
| 🌐 **Domain Reputation** | Suspicious TLDs aur unknown domains identify karta hai |
| ↪️ **Redirect Detection** | Hidden redirect parameters pakadta hai |
| 🔔 **Auto Notifications** | Khatarnak site pe khud-ba-khud alert deta hai |
| 📋 **Live Scan Log** | Real-time log dikhata hai kya detect hua |
| 🚨 **Report Site** | Google Safe Browsing par directly report kar sako |

---

## 🖥️ Screenshots

```
┌─────────────────────────────────────┐
│  🛡️ CYBERSHIELD AI   THREAT ACTIVE ● │
├─────────────────────────────────────┤
│         THREAT SCORE                │
│              ╭───╮                  │
│             ( 15  )  ← LOW RISK     │
│              ╰───╯                  │
│  🔗 https://example.com             │
├─────────────────────────────────────┤
│  📧 Phishing  CLEAN ✓               │
│  💀 Malware   CLEAN ✓               │
│  🔒 SSL       SECURE ✓              │
│  📊 Anomaly   NORMAL ✓              │
└─────────────────────────────────────┘
```

---

## 📁 Project Structure

```
CyberShield-AI-Extension/
│
├── manifest.json        # Extension configuration (Manifest V3)
├── popup.html           # Main UI - jo icon dabane par khulta hai
├── popup.js             # Threat detection logic & UI updates
├── background.js        # Service worker - auto background scanning
├── content.js           # Page-level form & script analysis
│
└── icons/
    ├── icon16.png       # Toolbar icon (small)
    ├── icon48.png       # Extensions page icon
    └── icon128.png      # Chrome Web Store icon
```

---

## 🚀 Installation — Chrome Mein Kaise Add Karein

### Method 1: Manual Install (Developer Mode)

**Step 1** — Yeh repository download karo:
```
Code → Download ZIP → Extract karo
```

**Step 2** — Chrome mein yeh address likho:
```
chrome://extensions
```

**Step 3** — Upar daayein taraf **Developer mode** toggle ON karo

**Step 4** — **"Load unpacked"** button dabao

**Step 5** — Woh folder select karo jisme `manifest.json` ho

**Step 6** — ✅ Extension install ho gayi! Toolbar mein shield icon dikhega

---

### Method 2: Git Clone

```bash
# Repository clone karo
git clone https://github.com/YOUR_USERNAME/CyberShield-AI-Extension.git

# Folder mein jao
cd CyberShield-AI-Extension

# Chrome mein load karo (upar wale steps follow karo)
```

---

## 🔍 Kaise Kaam Karta Hai?

```
Tum website open karo
        ↓
Background.js automatic scan shuru karta hai
        ↓
┌─────────────────────────────────────┐
│  Phishing Keywords Check (NLP)      │
│  Malware Pattern Detection          │
│  SSL Certificate Verify             │
│  URL Anomaly Analysis               │
│  Domain Reputation Check            │
│  Redirect Parameter Detection       │
└─────────────────────────────────────┘
        ↓
Threat Score Calculate (0-100)
        ↓
Badge Update + Notification (agar khatarnak ho)
        ↓
Popup mein detailed results
```

---

## 🎯 Threat Score Levels

| Score | Level | Badge | Matlab |
|-------|-------|-------|--------|
| 0-20 | ✅ SAFE / LOW RISK | 🟢 | Website safe hai |
| 21-40 | ⚠️ MODERATE RISK | 🟡 | Thodi احتیاط karo |
| 41-65 | 🔶 HIGH RISK | 🟠 | Careful rahо — suspicious |
| 66-100 | 🚨 CRITICAL THREAT | 🔴 | Site dangerous hai! |

---

## 🛠️ Technologies Used

- **JavaScript (Vanilla)** — Core logic
- **Chrome Extension API (Manifest V3)** — Browser integration
- **Chrome Storage API** — Scan history save karna
- **Chrome Notifications API** — Auto alerts
- **Chrome WebNavigation API** — Page navigation detect karna
- **CSS3 Animations** — Cyberpunk UI design
- **Google Fonts** — Rajdhani + Share Tech Mono

---

## 🧠 AI Detection Methods (Presentation Based)

Yeh extension presentation ke in concepts implement karta hai:

### 1. Machine Learning Style Pattern Matching
Known attack patterns ki list se compare karta hai — jaise supervised learning mein labeled data hota hai.

### 2. Anomaly Detection
URL length, encoding, subdomain count analyze karta hai — normal baseline se comparison.

### 3. NLP-Based Phishing Detection
Phishing keywords (login, verify, secure, bank) scan karta hai — jaise NLP emails scan karta hai.

### 4. Behavioral Analysis (Content Script)
Page ke forms aur scripts analyze karta hai — suspicious behavior detect karta hai.

### 5. Reputation System
Known safe domains aur suspicious TLDs ki list se match karta hai.

---

## ⚠️ Limitations

- Yeh extension educational purposes ke liye hai
- 100% accuracy guarantee nahi — AI bhi kabhi kabhi galat hota hai
- Advanced zero-day attacks ke liye professional tools use karein (Darktrace, CrowdStrike)
- Background scanning sirf navigation events par hota hai

---

## 🔮 Future Improvements

- [ ] VirusTotal API integration — real threat database
- [ ] Machine Learning model (TensorFlow.js)
- [ ] Phishing URL database sync
- [ ] Dark web monitoring
- [ ] Email header analysis
- [ ] Password breach checker (HaveIBeenPwned API)

---

## 👨‍💻 Developer

**Aman Gujar**
- 📚 BSAI Student | Section A | B2533012
- 🎓 Submitted To: Sir Usama Khalid
- 📌 Based on: AI in Cybersecurity Presentation

---

## 📄 License

```
MIT License — Free to use, modify, and distribute
```

---


---

> 💡 **Note:** Yeh extension sirf educational aur awareness purposes ke liye hai. Professional cybersecurity ke liye enterprise-grade tools use karein.

```
🔐 CyberShield AI — Smarter, Safer Browsing
```
