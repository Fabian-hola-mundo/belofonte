const PROXY_CONFIG = {
  "/__/auth/**": {
    "target": "https://belofonte-sw.firebaseapp.com",
    "secure": true,
    "changeOrigin": true,
    "logLevel": "debug",
    "headers": {
      "Referer": "https://belofonte-sw.firebaseapp.com"
    }
  }
};

module.exports = PROXY_CONFIG; 