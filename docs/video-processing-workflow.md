# Video Processing Workflow for Training Videos

This document describes the complete workflow for adding new training videos to the video player, from downloading YouTube content to integrating it into the site.

## Prerequisites

### Required Tools

- `yt-dlp` - YouTube video downloader
- `ffmpeg` - Video processing tool
- `cloudinary-cli` - Cloudinary command-line interface
- `pipx` - Python application installer (for cloudinary-cli)

### Installation Commands

```bash
# Install yt-dlp
sudo apt install yt-dlp

# Install ffmpeg
sudo apt install ffmpeg

# Install Cloudinary CLI
pipx install cloudinary-cli
```

### Environment Setup

Ensure your `.env` file contains:

```bash
CLOUDINARY_URL="cloudinary://195935627435494:UAsTzHNZMkAOihHq2pb2XGTrEWc@dg8zbx8ja"
```

Set the environment variable in your terminal:

```bash
export CLOUDINARY_URL="cloudinary://195935627435494:UAsTzHNZMkAOihHq2pb2XGTrEWc@dg8zbx8ja"
```

Verify configuration:

```bash
cld config
```

## Workflow Steps

### 1. Create Folder Structure

Create folders matching the video player hierarchy:

```bash
cd /home/nwender/Koko-3/.video
mkdir -p Category/Subcategory
```

**Example:**

```bash
mkdir -p Sprint/Drills
cd Sprint/Drills
```

### 2. Download YouTube Video

Download video at 720p quality:

```bash
yt-dlp -f "bestvideo[height<=720]+bestaudio/best[height<=720]" \
  -o "video_name.%(ext)s" \
  --merge-output-format mp4 \
  "YOUTUBE_URL"
```

**Example:**

```bash
yt-dlp -f "bestvideo[height<=720]+bestaudio/best[height<=720]" \
  -o "sprint_drills_full.%(ext)s" \
  --merge-output-format mp4 \
  "https://youtu.be/xiYTMBLqp8c"
```

### 3. Create Clip Definitions

Create a bash script to cut the video into clips with your timestamps:

```bash
nano cut_clips.sh
```

**Template Script:**

```bash
#!/bin/bash

# Input video file
INPUT_VIDEO="your_video_full.mp4"
OUTPUT_DIR="clips"

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Video encoding settings for web optimization
ENCODING_SETTINGS="-c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k -movflags +faststart"

# Define clips: "START_TIME" "END_TIME" "OUTPUT_NAME"
declare -a clips=(
    "0:00" "0:53" "01_CLIP_NAME"
    "0:59" "1:29" "02_CLIP_NAME"
    # Add more clips...
)

# Process each clip
for ((i=0; i<${#clips[@]}; i+=3)); do
    START="${clips[i]}"
    END="${clips[i+1]}"
    NAME="${clips[i+2]}"
    OUTPUT="$OUTPUT_DIR/${NAME}.mp4"

    echo "Processing: $NAME ($START to $END)"

    ffmpeg -i "$INPUT_VIDEO" \
        -ss "$START" -to "$END" \
        $ENCODING_SETTINGS \
        "$OUTPUT"

    if [ $? -eq 0 ]; then
        echo "✓ Successfully created: $OUTPUT"
    else
        echo "✗ Failed to create: $OUTPUT"
    fi
    echo ""
done

echo "All clips processed!"
```

**Actual Example (Sprint Drills):**

```bash
#!/bin/bash

INPUT_VIDEO="sprint_drills_full.mp4"
OUTPUT_DIR="clips"

mkdir -p "$OUTPUT_DIR"

ENCODING_SETTINGS="-c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k -movflags +faststart"

declare -a clips=(
    "0:00" "0:53" "01_WALKING_HIGH_KNEES"
    "0:59" "1:29" "02_A-SKIP"
    "1:40" "2:33" "03_B-SKIP"
    "2:43" "3:39" "04_C-SKIP"
    "3:49" "4:36" "05_HIGH_KNEES"
    "4:46" "5:20" "06_KARAOKE"
    "5:30" "7:16" "07_FAST_LEGS"
    "7:26" "7:51" "08_ALTERNATING_FAST_LEGS"
    "8:01" "8:28" "09_DOUBLE_ALTERNATING_FAST_LEGS"
    "8:38" "9:55" "10_STICK_IT_DRILL"
    "10:05" "10:26" "11_1_2_3_DRILL"
)

for ((i=0; i<${#clips[@]}; i+=3)); do
    START="${clips[i]}"
    END="${clips[i+1]}"
    NAME="${clips[i+2]}"
    OUTPUT="$OUTPUT_DIR/${NAME}.mp4"

    echo "Processing: $NAME ($START to $END)"

    ffmpeg -i "$INPUT_VIDEO" \
        -ss "$START" -to "$END" \
        $ENCODING_SETTINGS \
        "$OUTPUT"

    if [ $? -eq 0 ]; then
        echo "✓ Successfully created: $OUTPUT"
    else
        echo "✗ Failed to create: $OUTPUT"
    fi
    echo ""
done

echo "All clips processed!"
```

### 4. Execute the Cutting Script

Make the script executable and run it:

```bash
chmod +x cut_clips.sh
./cut_clips.sh
```

Verify clips were created:

```bash
ls -lh clips/
```

### 5. Upload to Cloudinary

#### Cloudinary CLI Syntax Reference

The Cloudinary CLI uses a specific syntax for parameters. Understanding the correct format is crucial:

**Correct Syntax Formats:**

1. **Direct parameters (positional)** - parameter=value with NO dashes:
   ```bash
   cld uploader upload file.mp4 public_id=folder/name resource_type=video overwrite=true
   ```

2. **Optional parameters flag** - using `-o` flag:
   ```bash
   cld uploader upload file.mp4 -o public_id "folder/name" -o resource_type video
   ```

**Common Mistakes to Avoid:**
- ✗ `--public-id` (double dash doesn't work)
- ✗ `--public_id` (double dash doesn't work)
- ✗ `-public_id` (single dash without `-o` doesn't work)
- ✓ `public_id=value` (correct)
- ✓ `-o public_id value` (correct)

#### Method 1: Upload Individual Files (Recommended)

Upload clips one at a time with full control over naming:

```bash
cd clips
for file in *.mp4; do
  cld uploader upload "$file" \
    public_id="trainings-video/Category/Subcategory/clips/${file%.*}" \
    resource_type=video \
    overwrite=true
done
```

**Example:**

```bash
cd clips
for file in *.mp4; do
  cld uploader upload "$file" \
    public_id="trainings-video/Sprint/Drills/clips/${file%.*}" \
    resource_type=video \
    overwrite=true
done
```

**Benefits:**
- Full control over `public_id` naming
- See upload progress for each file
- Easy to retry individual failed uploads
- Get immediate JSON response with URLs

#### Method 2: Upload Entire Directory (Faster)

Upload all clips at once (good for large batches):

```bash
cld upload_dir \
  -f trainings-video/Category/Subcategory \
  -o resource_type video \
  -o overwrite true \
  clips
```

**Example:**

```bash
cld upload_dir \
  -f trainings-video/Sprint/Drills \
  -o resource_type video \
  -o overwrite true \
  clips
```

**Benefits:**
- Faster for many files
- Simpler command
- Automatic folder structure

### 6. Retrieve Cloudinary URLs

Search for uploaded videos to get their URLs:

```bash
cld search "asset_folder:trainings-video/Category/Subcategory/clips" \
  -f tags \
  -s public_id asc \
  -n 50
```

**Example:**

```bash
cld search "asset_folder:trainings-video/Sprint/Drills/clips" \
  -f tags \
  -s public_id asc \
  -n 20
```

Extract the `secure_url` values from the JSON response.

### 7. Update Video Data Structure

Edit `/home/nwender/Koko-3/app/video-player/_lib/video-data.ts`

#### For Playlist-type Videos (Individual Clip URLs)

Add a new subcategory under the appropriate category:

```typescript
{
  name: 'Category Name',
  videos: [
    {
      id: 'unique-video-id',
      title: 'Video Title',
      description: 'Video description',
      type: 'playlist',
      playlistTitle: 'Playlist Title',
      chapters: [
        {
          id: 'chapter-id-1',
          title: 'Chapter Title 1',
          videoUrl: 'https://res.cloudinary.com/dg8zbx8ja/video/upload/v.../clip_1.mp4',
        },
        {
          id: 'chapter-id-2',
          title: 'Chapter Title 2',
          videoUrl: 'https://res.cloudinary.com/dg8zbx8ja/video/upload/v.../clip_2.mp4',
        },
        // Add more chapters...
      ],
    },
  ],
},
```

**Actual Example (Sprint Drills):**

```typescript
{
  name: 'Sprint',
  videos: [
    {
      id: 'sprint-drills',
      title: 'Sprint Drills',
      description: 'Eleven essential sprint drills to improve acceleration, top speed, and running mechanics',
      type: 'playlist',
      playlistTitle: 'Sprint Drills',
      chapters: [
        {
          id: 'walking-high-knees',
          title: 'Walking High Knees',
          videoUrl: 'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759395562/01_WALKING_HIGH_KNEES_r7gpak.mp4',
        },
        {
          id: 'a-skip',
          title: 'A-Skip',
          videoUrl: 'https://res.cloudinary.com/dg8zbx8ja/video/upload/v1759395553/02_A-SKIP_hqmw0f.mp4',
        },
        // ... more chapters
      ],
    },
  ],
},
```

#### For Chapter-type Videos (Single Video with Timestamps)

```typescript
{
  id: 'unique-video-id',
  title: 'Video Title',
  description: 'Video description',
  type: 'chapters',
  videoUrl: 'https://full-video-url.mp4',
  playlistTitle: 'Playlist Title',
  chapters: [
    {
      id: 'chapter-id-1',
      title: 'Chapter Title 1',
      startTime: 0,
      endTime: 53,
    },
    {
      id: 'chapter-id-2',
      title: 'Chapter Title 2',
      startTime: 59,
      endTime: 89,
    },
    // Add more chapters...
  ],
},
```

### 8. Test the Integration

1. Start the development server:

   ```bash
   pnpm dev
   ```

2. Navigate to the video player page
3. Verify the new category/subcategory appears
4. Test video playback for each clip

## Quick Reference Commands

### Complete Workflow in One Go

```bash
# 1. Setup
cd /home/nwender/Koko-3/.video
mkdir -p Category/Subcategory
cd Category/Subcategory

# 2. Download
yt-dlp -f "bestvideo[height<=720]+bestaudio/best[height<=720]" \
  -o "video_full.%(ext)s" \
  --merge-output-format mp4 \
  "YOUTUBE_URL"

# 3. Create and run cutting script
nano cut_clips.sh
# (paste script content)
chmod +x cut_clips.sh
./cut_clips.sh

# 4. Upload to Cloudinary
export CLOUDINARY_URL="cloudinary://195935627435494:UAsTzHNZMkAOihHq2pb2XGTrEWc@dg8zbx8ja"
cld upload_dir -f trainings-video/Category/Subcategory -o resource_type video -o overwrite true clips

# 5. Get URLs
cld search "asset_folder:trainings-video/Category/Subcategory/clips" -f tags -s public_id asc -n 50

# 6. Edit video-data.ts with the URLs
# 7. Test with pnpm dev
```

## Troubleshooting

### Cloudinary CLI Not Found

```bash
pipx install cloudinary-cli
# Add to PATH if needed
export PATH="$PATH:$HOME/.local/bin"
```

### WSL Path Issues with Cloudinary MCP

The Cloudinary MCP server cannot access WSL filesystem paths. Always use the Cloudinary CLI instead:

```bash
# ✓ Works: CLI from within WSL
cld upload_dir -f folder clips

# ✗ Doesn't work: MCP with WSL paths
# MCP server runs in Windows context and cannot translate WSL paths
```

### Video Encoding Issues

If videos won't play, ensure proper encoding:

```bash
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k -movflags +faststart output.mp4
```

### Large File Uploads

For files larger than 100MB, consider:

1. Adjusting CRF value (higher = smaller file, lower quality)
2. Using two-pass encoding
3. Reducing resolution if 720p is too large

## Video Player Data Structure Reference

### Type Definitions

```typescript
interface VideoChapter {
  id: string; // Unique chapter identifier
  title: string; // Display name
  description?: string; // Optional description
  startTime?: number; // For 'chapters' type (seconds)
  endTime?: number; // For 'chapters' type (seconds)
  videoUrl?: string; // For 'playlist' type (individual URL)
}

interface Video {
  id: string; // Unique video identifier
  title: string; // Display name
  description?: string; // Optional description
  videoUrl?: string; // Full video URL (for 'chapters' type)
  chapters: VideoChapter[];
  type: 'chapters' | 'playlist';
  playlistTitle?: string;
}

interface Subcategory {
  name: string;
  videos: Video[];
}

interface Category {
  name: string;
  subcategories: Subcategory[];
}
```

### Existing Categories

- **Wissen** (Knowledge)
  - Ernährung (Nutrition)
  - Prävention (Prevention)
  - Talent

- **Training**
  - Agility & Speed
  - Ball Control & Dribbling
  - Ball Mastery
  - Skills
  - Sprint ← **New!**
  - Flexibility & Recovery
  - Passing & First Touch

- **Routines**
  - FIFA 11+

## Notes

- Always use 720p for consistency
- Use web-optimized encoding settings (`-movflags +faststart`)
- Maintain logical folder structure: `.video/Category/Subcategory/`
- Keep clip naming consistent: `01_NAME`, `02_NAME`, etc.
- Test videos locally before uploading
- Cloudinary URLs are permanent - use `overwrite=true` to replace

## Video Processing Tips

### Finding the Right Timestamps

1. Open video in VLC or similar player
2. Use frame-by-frame navigation (E key in VLC)
3. Note exact start/end times for clean cuts
4. Add 1-2 second buffer if needed

### Naming Conventions

- Use UPPERCASE with underscores for file names
- Use lowercase with hyphens for IDs in code
- Keep names descriptive but concise

### Quality Control Checklist

- [ ] All clips created successfully
- [ ] No audio/video sync issues
- [ ] Clean start/end points (no partial frames)
- [ ] Consistent quality across clips
- [ ] All clips uploaded to Cloudinary
- [ ] URLs added to video-data.ts
- [ ] Local testing completed
- [ ] Video player navigation works

## Related Files

- **Video Data**: `/home/nwender/Koko-3/app/video-player/_lib/video-data.ts`
- **Video Player**: `/home/nwender/Koko-3/app/video-player/page.tsx`
- **Cloudinary Config**: `/home/nwender/Koko-3/lib/cloudinary.ts`
- **Environment**: `/home/nwender/Koko-3/.env`
- **Video Storage**: `/home/nwender/Koko-3/.video/`

---

**Last Updated**: October 2, 2025  
**Example Workflow**: Sprint Drills (11 clips from https://youtu.be/xiYTMBLqp8c)
