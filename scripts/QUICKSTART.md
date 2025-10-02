# Quick Reference: Video Processing

## 🚀 Quick Start

### 1. Create Config Files

**process-config.json:**
```json
{
  "youtube_url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "output_name": "my_video",
  "quality": "720p",
  "output_dir": "./.video/Category/Subcategory/clips",
  "clips": [
    {"filename": "01_CLIP.mp4", "start": "0:00", "end": "0:30"},
    {"filename": "02_CLIP.mp4", "start": "0:31", "end": "1:00"}
  ]
}
```

**upload-config.json:**
```json
{
  "clips_dir": "./.video/Category/Subcategory/clips",
  "cloudinary_folder": "trainings-video/Category/Subcategory/clips"
}
```

### 2. Run Commands

```bash
# Download and cut
python3 scripts/process-video.py process-config.json

# Upload to Cloudinary
python3 scripts/upload-to-cloudinary.py upload-config.json
```

### 3. Add to Code

Copy the generated template into `app/video-player/_lib/video-data.ts`

## 📋 Cheat Sheet

### Common Quality Settings
- **720p** - Recommended for training videos (balanced quality/size)
- **1080p** - Higher quality (larger files)
- **480p** - Lower quality (smaller files)

### Encoding Presets
- **fast** - Quick encoding, larger files
- **medium** - Balanced (recommended)
- **slow** - Better compression, slower

### CRF Quality Levels
- **18** - Very high quality (large files)
- **23** - Good quality (recommended)
- **28** - Lower quality (smaller files)

## 🔧 Setup Requirements

```bash
# One-time setup
pip install --user yt-dlp
pipx install cloudinary-cli
export CLOUDINARY_URL="cloudinary://KEY:SECRET@CLOUD"
```

## 📁 File Structure

```
scripts/
├── process-video.py           # Download & cut script
├── upload-to-cloudinary.py    # Upload script
├── README.md                  # Full documentation
└── examples/
    ├── speed-training-config.json
    └── speed-training-upload.json

.video/                        # Working directory
└── Category/
    └── Subcategory/
        ├── video.mp4          # Downloaded video
        └── clips/             # Cut clips
```

## ⚡ Tips

1. **Test first** - Process 1-2 clips to verify timestamps
2. **Keep originals** - Store downloaded videos for re-processing
3. **Review clips** - Check all clips before uploading
4. **Use examples** - Copy `scripts/examples/*.json` as templates
5. **Descriptive names** - Use format `01_EXERCISE_NAME.mp4`

## 🐛 Common Issues

**yt-dlp not found:**
```bash
pip install --user yt-dlp
```

**Cloudinary CLI not found:**
```bash
pipx install cloudinary-cli
export CLOUDINARY_URL="cloudinary://KEY:SECRET@CLOUD"
```

**ffmpeg errors:**
- Check timestamps are within video duration
- Ensure input video downloaded correctly
- Verify ffmpeg is installed: `ffmpeg -version`

## 🎯 Full Example

```bash
# 1. Create config (see examples above)

# 2. Process video
python3 scripts/process-video.py my-config.json
# Output: Created 10 clips in ./.video/Sprint/Speed Training/clips/

# 3. Upload to Cloudinary
python3 scripts/upload-to-cloudinary.py my-upload.json
# Output: Uploaded 10 files + generated video-data.ts template

# 4. Copy template into app/video-player/_lib/video-data.ts
```

## 📚 More Info

- **Full documentation:** `scripts/README.md`
- **Video player docs:** `app/video-player/README.md`
- **Example configs:** `scripts/examples/`
