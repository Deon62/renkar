# Renkar - Car Rental PWA

A Progressive Web App (PWA) for car rentals with offline support and mobile-first design.

## Features

- ✅ **Progressive Web App (PWA)** - Installable on mobile devices
- ✅ **Offline Support** - Works without internet connection using service workers
- ✅ **Update Notifications** - Automatic updates with user-friendly notifications
- ✅ **Mobile-First Design** - Optimized for mobile devices
- ✅ **Fast & Lightweight** - Efficient caching strategy for quick loading
- ✅ **Add to Home Screen** - Install as native-like app

## Installation & Deployment

### Local Development

1. Clone the repository
2. Open `index.html` in your browser
3. For testing PWA features, use a local server:
   ```bash
   npx serve -s .
   ```

### Deploy to Vercel

This app is configured to deploy directly to Vercel without build errors.

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Deploy PWA to Vercel"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect the configuration
   - Deploy!

3. **No Build Required**: The `package.json` includes a minimal `vercel-build` script that prevents build errors.

## PWA Configuration

### manifest.json
- Name: Renkar - Car Rental App
- Icons: 192x192 and 512x512
- Theme: Deep navy (#0A1D37)
- Display: Standalone

### Service Worker
- **Cache Strategy**: Network first for pages, cache first for assets
- **Offline Support**: Shows offline page when network unavailable
- **Auto Update**: Checks for updates every hour
- **Version**: Currently v4

### Update Notifications
The app automatically detects new versions and shows a notification banner with:
- "New Update Available!" message
- "Update Now" button
- Auto-dismiss after 15 seconds

## Mobile Installation

### Android (Chrome/Edge)
1. Open the app in Chrome
2. Tap the menu (3 dots)
3. Select "Add to Home Screen"
4. Confirm installation

### iOS (Safari)
1. Open the app in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. Confirm installation

## Offline Features

When offline, the app will:
- Load cached pages instantly
- Show a friendly offline message
- Cache all assets for future use
- Work with bottom navigation

## File Structure

```
renkar/
├── index.html              # Main entry point
├── manifest.json           # PWA manifest
├── service-worker.js       # Service worker for offline support
├── js/
│   └── pwa.js             # PWA registration & update handler
├── assets/
│   ├── logo/
│   │   └── opa.png        # PWA icon
│   ├── cars/              # Car images
│   └── payments/          # Payment method logos
├── package.json           # Vercel build configuration
├── vercel.json            # Vercel deployment config
└── *.html, *.css, *.js    # App pages & styles
```

## Browser Support

- ✅ Chrome (Android & Desktop)
- ✅ Edge (Android & Desktop)
- ✅ Safari (iOS 11.3+)
- ✅ Firefox (Android)
- ✅ Samsung Internet

## Testing PWA

1. **Chrome DevTools**:
   - Open DevTools > Application tab
   - Check Service Workers status
   - Inspect Cache Storage
   - Test "Add to Home Screen"

2. **Lighthouse**:
   - Run Lighthouse audit
   - Should score 90+ for PWA

3. **Offline Test**:
   - Chrome DevTools > Network tab
   - Check "Offline" checkbox
   - Refresh page

## Troubleshooting

### Service Worker Not Registering
- Ensure HTTPS or localhost
- Check browser console for errors
- Clear site data and reload

### App Not Installing
- Verify manifest.json is valid
- Check icons are accessible
- Test on supported browser

### 404 Errors on Refresh
- Check vercel.json configuration
- Ensure proper routing rules

## Development

### Update Service Worker Version
Change `CACHE_NAME` in `service-worker.js`:
```javascript
const CACHE_NAME = 'renkar-v5'; // Increment version number
```

### Add New Pages to Cache
Edit `service-worker.js`:
```javascript
const PAGES_TO_CACHE = [
  // ... existing pages
  '/new-page.html'
];
```

## License

MIT

## Support

For issues or questions, open an issue on GitHub.

