// Progressive Web App - Service Worker Registration and Update Handler
(function() {
  'use strict';

  // Service Worker Registration
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('✅ ServiceWorker registration successful with scope:', registration.scope);

          // Check for updates every hour
          setInterval(() => {
            registration.update();
          }, 3600000); // 1 hour
          
          // Handle updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New update available
                showUpdateNotification();
              }
            });
          });
        })
        .catch(err => {
          console.error('❌ ServiceWorker registration failed:', err);
        });
    });
  }

  // Show update notification
  function showUpdateNotification() {
    // Remove existing notification if any
    const existing = document.getElementById('pwa-update-notification');
    if (existing) {
      existing.remove();
    }

    const notification = document.createElement('div');
    notification.id = 'pwa-update-notification';
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #0A1D37 0%, #061426 100%);
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      z-index: 10000;
      display: flex;
      align-items: center;
      gap: 16px;
      animation: slideUp 0.3s ease-out;
      max-width: 90%;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
    `;
    
    notification.innerHTML = `
      <span style="flex: 1;">
        <strong>🔄 New Update Available!</strong><br>
        <span style="opacity: 0.9; font-size: 12px;">Get the latest features and improvements</span>
      </span>
      <button id="updateButton" style="
        background: #FFD700;
        color: #0A1D37;
        border: none;
        padding: 8px 20px;
        border-radius: 8px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.2s;
        white-space: nowrap;
        font-size: 14px;
      ">Update Now</button>
      <button id="closeButton" style="
        background: transparent;
        color: white;
        border: 1px solid rgba(255,255,255,0.3);
        padding: 8px 12px;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
      ">✕</button>
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideUp {
        from {
          transform: translateX(-50%) translateY(100px);
          opacity: 0;
        }
        to {
          transform: translateX(-50%) translateY(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Update button handler
    document.getElementById('updateButton').addEventListener('click', () => {
      const registration = navigator.serviceWorker.getRegistration();
      if (registration && registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
      notification.remove();
      window.location.reload();
    });
    
    // Close button handler
    document.getElementById('closeButton').addEventListener('click', () => {
      notification.style.animation = 'slideUp 0.3s ease-out reverse';
      setTimeout(() => notification.remove(), 300);
    });
    
    // Hover effects
    document.getElementById('updateButton').addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.05)';
      this.style.boxShadow = '0 4px 12px rgba(255,215,0,0.4)';
    });
    document.getElementById('updateButton').addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
      this.style.boxShadow = 'none';
    });
    
    document.getElementById('closeButton').addEventListener('mouseenter', function() {
      this.style.background = 'rgba(255,255,255,0.1)';
    });
    document.getElementById('closeButton').addEventListener('mouseleave', function() {
      this.style.background = 'transparent';
    });
    
    // Auto-hide after 15 seconds
    setTimeout(() => {
      notification.style.animation = 'slideUp 0.3s ease-out reverse';
      setTimeout(() => notification.remove(), 300);
    }, 15000);
  }

  // Listen for controller change (new service worker activated)
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      console.log('🔄 New service worker activated, reloading...');
      window.location.reload();
      refreshing = true;
    }
  });

  // Prompt for install (optional - shown by browser on supported browsers)
  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    console.log('💾 PWA install prompt available');
    
    // Optional: Show custom install button
    // showInstallPrompt();
  });

  // Track if app was installed from homescreen
  window.addEventListener('appinstalled', () => {
    console.log('✅ PWA installed successfully');
    deferredPrompt = null;
  });

  // Expose for debugging
  window.pwa = {
    showUpdate: showUpdateNotification,
    version: '1.0.0'
  };

})();

