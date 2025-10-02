# Video Processing Scripts

Automated Python scripts for processing training videos from YouTube to Cloudinary.

## Scripts

### 1. `process-video.py`

Downloads YouTube videos and cuts them into clips based on timestamps.

**Features:**
- Single-pass ffmpeg processing (efficient)
- Configurable quality and encoding settings
- JSON-based configuration
- Automatic directory creation
- Progress reporting and file size summary

**Usage:**
```bash
python3 process-video.py config.json
```

**Config Example:**
```json
{
  "youtube_url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "output_name": "video_name",
  "quality": "720p",
  "output_dir": "./clips",
  "encoding_preset": "medium",
  "crf": 23,
  "audio_bitrate": "128k",
  "clips": [
    {
      "filename": "01_CLIP_NAME.mp4",
      "start": "0:52",
      "end": "1:36"
    }
  ]
}
```

**Config Options:**
- `youtube_url`: YouTube video URL
- `output_name`: Base name for downloaded video
- `quality`: Video quality - `"1080p"`, `"720p"`, `"480p"`, or `"best"`
- `output_dir`: Directory for output clips (default: `"./clips"`)
- `encoding_preset`: ffmpeg preset - `"ultrafast"`, `"fast"`, `"medium"`, `"slow"` (default: `"medium"`)
- `crf`: Quality level 0-51, lower = better (default: `23`)
- `audio_bitrate`: Audio bitrate (default: `"128k"`)
- `clips`: Array of clip definitions with `filename`, `start`, and `end` times

### 2. `upload-to-cloudinary.py`

Uploads clips to Cloudinary and generates video-data.ts templates.

**Features:**
- Batch upload all MP4 files in a directory
- Automatic URL generation
- Generates ready-to-paste video-data.ts code
- Progress reporting
- Overwrite control

**Usage:**
```bash
python3 upload-to-cloudinary.py upload-config.json
```

**Config Example:**
```json
{
  "clips_dir": "./clips",
  "cloudinary_folder": "trainings-video/Category/Subcategory/clips",
  "cloudinary_cloud": "dg8zbx8ja",
  "overwrite": true,
  "generate_urls": true
}
```

**Config Options:**
- `clips_dir`: Directory containing MP4 files to upload
- `cloudinary_folder`: Target folder path in Cloudinary
- `cloudinary_cloud`: Your Cloudinary cloud name (default: `"dg8zbx8ja"`)
- `overwrite`: Whether to overwrite existing files (default: `true`)
- `generate_urls`: Whether to generate video-data.ts template (default: `true`)

## Requirements

### System Tools
```bash
# Install yt-dlp for YouTube downloads
pip install --user yt-dlp

# Install Cloudinary CLI
pipx install cloudinary-cli

# ffmpeg (usually pre-installed on Linux)
sudo apt install ffmpeg  # Ubuntu/Debian
```

### Configuration
```bash
# Set Cloudinary credentials
export CLOUDINARY_URL="cloudinary://API_KEY:API_SECRET@CLOUD_NAME"
```

## Complete Workflow Example

### 1. Create Config Files

**Process config** (`speed-training-config.json`):
```json
{
  "youtube_url": "https://youtu.be/OEYeRfzbOTM",
  "output_name": "speed_training",
  "quality": "720p",
  "output_dir": "./.video/Sprint/Speed Training/clips",
  "clips": [
    {
      "filename": "01_POGO_JUMPS.mp4",
      "start": "0:52",
      "end": "1:36"
    },
    {
      "filename": "02_JUMP_SQUATS.mp4",
      "start": "1:37",
      "end": "2:25"
    }
  ]
}
```

**Upload config** (`speed-training-upload.json`):
```json
{
  "clips_dir": "./.video/Sprint/Speed Training/clips",
  "cloudinary_folder": "trainings-video/Sprint/Speed_Training/clips",
  "cloudinary_cloud": "dg8zbx8ja",
  "overwrite": true,
  "generate_urls": true
}
```

### 2. Process Video
```bash
python3 scripts/process-video.py speed-training-config.json
```

### 3. Upload to Cloudinary
```bash
python3 scripts/upload-to-cloudinary.py speed-training-upload.json
```

### 4. Add to video-data.ts

The upload script generates a template that you can copy directly:

```typescript
chapters: [
  {
    id: 'pogo-jumps',
    title: 'Pogo Jumps',
    videoUrl: 'https://res.cloudinary.com/...',
  },
  {
    id: 'jump-squats',
    title: 'Jump Squats',
    videoUrl: 'https://res.cloudinary.com/...',
  },
]
```

Paste this into `app/video-player/_lib/video-data.ts` under the appropriate category/subcategory.

## Example Configs

Pre-configured examples are in the `examples/` directory:

- **`speed-training-config.json`**: Process Speed Training video (10 clips)
- **`speed-training-upload.json`**: Upload Speed Training clips

Use these as templates for new videos.

## Tips

1. **Test with a small clip first** - Process just 1-2 clips to verify timestamps before running the full batch
2. **Keep original videos** - Store downloaded videos for re-processing if needed
3. **Review clips before upload** - Check that all clips are correct before uploading to Cloudinary
4. **Use descriptive filenames** - Format: `01_EXERCISE_NAME.mp4` for easy sorting
5. **Store configs in version control** - Keep track of how each video was processed

## Troubleshooting

### yt-dlp not found
```bash
pip install --user yt-dlp
# or
pipx install yt-dlp
```

### Cloudinary CLI not found
```bash
pipx install cloudinary-cli
export CLOUDINARY_URL="cloudinary://API_KEY:API_SECRET@CLOUD_NAME"
```

### ffmpeg errors
- Ensure ffmpeg is installed: `ffmpeg -version`
- Check that input video was downloaded correctly
- Verify timestamps are valid (within video duration)

### Upload fails
- Check Cloudinary credentials are set: `echo $CLOUDINARY_URL`
- Verify clips directory exists and contains MP4 files
- Check network connectivity

## Advanced Usage

### Custom Encoding Settings

For higher quality or smaller file sizes, adjust encoding parameters:

```json
{
  "crf": 18,              // Higher quality (larger files)
  "encoding_preset": "slow",  // Better compression (slower)
  "audio_bitrate": "192k"     // Higher audio quality
}
```

### Quality Levels
- **CRF 18**: Very high quality, large files
- **CRF 23**: Good quality, balanced size (recommended)
- **CRF 28**: Lower quality, smaller files

### Encoding Presets
- **ultrafast**: Fastest encoding, largest files
- **fast**: Fast encoding, larger files
- **medium**: Balanced (recommended)
- **slow**: Better compression, slower encoding
- **veryslow**: Best compression, very slow

## Contributing

When adding new scripts:
1. Follow the existing code style
2. Add comprehensive error handling
3. Include progress reporting
4. Document all config options
5. Provide example configs in `examples/`
