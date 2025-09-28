I have the following verification comments after thorough review and exploration of the codebase. Implement the comments by following the instructions in the comments verbatim.

---
## Comment 1: Plugin still invoked with a raw string; needs `{ src }` options object to avoid runtime error.

Update `components/video-js/videojs-player.tsx` so that the VTT thumbnails plugin receives an options object. In `syncPlayerWithItem`, locate the VTT plugin invocation (`pluginAwarePlayer.vttThumbnails(spriteSource)`). Replace it with `pluginAwarePlayer.vttThumbnails({ src: spriteSource })`. Ensure any optional plugin settings are merged into that object if required, and confirm no other call sites pass a raw string. After the change, run TypeScript checks/build to verify no type errors and ensure thumbnails render without runtime issues.

### Referred Files
- /home/nwender/Koko-3/components/video-js/videojs-player.tsx/home/nwender/Koko-3/components/video-js/videojs-player.tsx
---