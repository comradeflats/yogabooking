# Asset Placement Guide

This directory is where you should place your media assets for the website.

## Required Assets

### 1. Hero Video (Optional - currently using fallback image)
- **File**: `hero-video.mp4`
- **Recommended specs**:
  - Duration: 5-10 seconds (for seamless loop)
  - Size: Under 5-10MB (compress using HandBrake or similar)
  - Format: MP4 (H.264 codec) or WebM
  - Resolution: 1920x1080 or higher
- **Usage**: Background video for the hero section on the homepage

To enable the video background, uncomment the video element in:
`src/components/landing/HeroSection.tsx` (lines 17-22)

### 2. Hero Background Image (Current placeholder)
- **File**: `hero-bg.jpg`
- **Purpose**: Fallback image if video is not provided
- **Recommended specs**:
  - Resolution: 1920x1080 or higher
  - Format: JPG or WebP
  - Subject: Yoga studio, meditation, or serene yoga pose

### 3. Instructor Photo
- **File**: `polina.jpg`
- **Purpose**: About section instructor photo
- **Recommended specs**:
  - Resolution: At least 800x1000 (portrait orientation works best)
  - Format: JPG or WebP
  - Subject: Professional headshot or action shot teaching yoga

### 4. Logo (Optional)
- **File**: `logo.svg` or `logo.png`
- **Purpose**: Can be added to header navigation
- **Recommended specs**:
  - Format: SVG preferred (scalable), PNG acceptable
  - Size: 200x50 to 300x75 pixels
  - Transparent background

## Current Placeholders

The site currently uses Unsplash placeholder images:
- **Hero**: Yoga meditation scene
- **About section**: Yoga instructor teaching

These should be replaced with your actual photos.

## How to Update

1. Add your images to this `/public` directory
2. Update the image paths in the components:
   - Hero video: `/hero-video.mp4` in `HeroSection.tsx`
   - Hero image: `/hero-bg.jpg` in `HeroSection.tsx`
   - Instructor photo: `/polina.jpg` in `AboutSection.tsx`
   - Logo: `/logo.svg` in `Header.tsx` (if you want to add it)

## Image Optimization Tips

- Compress images before uploading (use tools like TinyPNG, Squoosh, or ImageOptim)
- Use WebP format for better compression
- Next.js will automatically optimize images served through the `<Image>` component
- For video, use H.264 codec with medium compression

## Social Media Icons

If you have specific social media handles, update them in your `.env.local` file:
```
NEXT_PUBLIC_INSTAGRAM_HANDLE=your_handle
NEXT_PUBLIC_TELEGRAM_HANDLE=your_handle
```
