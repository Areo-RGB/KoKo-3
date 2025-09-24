# Progressive Web App (PWA) Setup Guide

This document outlines the PWA implementation for the Q.V Sports Training Platform.

## Overview

The Q.V Sports Training Platform is now a fully-featured Progressive Web App that provides:

- **Offline Access**: Core functionality works without internet connection
- **App-like Experience**: Runs in standalone mode when installed
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Background Sync**: Automatic updates when connection is restored
- **Install Prompts**: Native installation experience

## Features

### 🔧 Core PWA Features

- ✅ Web App Manifest
- ✅ Service Worker with intelligent caching
- ✅ Offline functionality
- ✅ Install prompts
- ✅ App icons (all sizes)
- ✅ Splash screens
- ✅ Theme customization

### 📱 Installation

The app can be installed on:

- **Android**: Chrome, Edge, Samsung Internet
- **iOS**: Safari (Add to Home Screen)
- **Desktop**: Chrome, Edge, Firefox
- **Windows**: Microsoft Store (if published)

### 🎯 Shortcuts

Quick access shortcuts are available for:

- Junioren Training (`/junioren`)
- FIFA 11+ (`/fifa-11-plus`)
- Performance Charts (`/performance-charts`)

## Technical Implementation

### Manifest Configuration

Location: `/public/manifest.json`

Key features:

- Multiple icon sizes (72px to 512px)
- Maskable icons for Android
- App shortcuts
- Screenshots for app stores
- Protocol handlers
- Edge side panel support

### Service Worker

Location: `/public/sw.js`

Caching strategies:

- **Static Assets**: Cache first with network fallback
- **Training Materials**: Cache first with offline fallback
- **App Shell**: Network first with cache fallback
- **API Calls**: Network only
- **Other Resources**: Stale while revalidate

### Icons

Location: `/public/icons/`

Available sizes:

- 16x16, 32x32 (Favicon)
- 72x72, 96x96, 128x128, 144x144, 152x152 (Various devices)
- 192x192, 384x384, 512x512 (Android)
- 192x192, 512x512 (Maskable versions)
- 180x180 (Apple Touch Icon)

### Meta Tags

Comprehensive PWA meta tags include:

- Theme colors (light/dark mode support)
- Apple-specific meta tags
- Microsoft tile configuration
- Mobile web app capabilities

## Development

### Scripts

- `node scripts/generate-pwa-icons.js` - Generate icon placeholders
- `node scripts/generate-additional-icons.js` - Generate small icons

### Testing

Test PWA functionality:

1. **Chrome DevTools**:
   - Application tab → Manifest
   - Application tab → Service Workers
   - Lighthouse → PWA audit

2. **Installation**:
   - Desktop: Chrome address bar install button
   - Mobile: "Add to Home Screen" prompt

3. **Offline**:
   - DevTools → Network → Offline
   - Verify cached content loads

### Browser Support

| Feature            | Chrome | Firefox | Safari | Edge |
| ------------------ | ------ | ------- | ------ | ---- |
| Service Workers    | ✅     | ✅      | ✅     | ✅   |
| Web App Manifest   | ✅     | ✅      | ✅     | ✅   |
| Add to Home Screen | ✅     | ✅      | ✅     | ✅   |
| Install Prompts    | ✅     | ✅      | ❌     | ✅   |
| App Shortcuts      | ✅     | ❌      | ❌     | ✅   |

## Deployment Considerations

### Static Hosting

The app is configured for static export and works with:

- Vercel
- Netlify
- GitHub Pages
- AWS S3
- Any static file server

### HTTPS Requirement

PWAs require HTTPS in production. Service Workers only work over:

- HTTPS in production
- HTTP on localhost (development)

### Headers

Recommended HTTP headers:

```
Cache-Control: public, max-age=31536000 (for static assets)
Cache-Control: no-cache (for HTML files)
```

## Monitoring

### Analytics

Track PWA-specific metrics:

- Installation rate
- Standalone usage
- Offline usage
- Service worker performance

### Error Handling

Monitor for:

- Service worker registration failures
- Cache quota exceeded
- Offline functionality issues
- Install prompt dismissals

## Future Enhancements

### Planned Features

- [ ] Background sync for training data
- [ ] Push notifications for new content
- [ ] Periodic background updates
- [ ] Enhanced offline capabilities
- [ ] File sharing integration
- [ ] Web Share API

### Performance Optimizations

- [ ] Precache critical resources
- [ ] Implement resource prioritization
- [ ] Add compression for cached content
- [ ] Optimize icon loading

## Troubleshooting

### Common Issues

1. **Service Worker not updating**:
   - Clear browser cache
   - Unregister and re-register SW
   - Check for SW errors in DevTools

2. **Icons not displaying**:
   - Verify icon file paths
   - Check manifest syntax
   - Ensure proper MIME types

3. **Install prompt not showing**:
   - Check PWA criteria in Lighthouse
   - Verify HTTPS requirement
   - Test on supported browsers

### Debug Tools

- Chrome DevTools → Application
- Firefox DevTools → Application
- Lighthouse PWA audit
- PWA Builder (Microsoft)

## Resources

- [PWA Builder](https://www.pwabuilder.com/)
- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)
- [MDN Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Google PWA Checklist](https://web.dev/pwa-checklist/)
