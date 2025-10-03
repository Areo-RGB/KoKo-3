import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dg8zbx8ja',
  api_key: process.env.CLOUDINARY_API_KEY || '195935627435494',
  api_secret:
    process.env.CLOUDINARY_API_SECRET || 'UAsTzHNZMkAOihHq2pb2XGTrEWc',
});

/**
 * Generate an optimized Cloudinary URL
 * @param publicId - The public ID of the image in Cloudinary
 * @param options - Transformation options
 * @returns Optimized image URL
 */
export function getOptimizedImageUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: 'fill' | 'fit' | 'scale' | 'crop' | 'thumb';
    quality?: 'auto' | 'auto:best' | 'auto:good' | 'auto:eco' | number;
    format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
    blur?: number;
    sharpen?: boolean;
    grayscale?: boolean;
    sepia?: boolean;
    [key: string]: any;
  } = {},
) {
  const {
    width,
    height,
    crop = 'scale',
    quality = 'auto',
    format = 'auto',
    blur,
    sharpen,
    grayscale,
    sepia,
    ...otherOptions
  } = options;

  const transformations: string[] = [];

  // Auto optimizations (always applied)
  transformations.push(`f_${format}`);
  transformations.push(`q_${quality}`);

  // Dimensions
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (width || height) transformations.push(`c_${crop}`);

  // Effects
  if (blur) transformations.push(`e_blur:${blur}`);
  if (sharpen) transformations.push('e_sharpen');
  if (grayscale) transformations.push('e_grayscale');
  if (sepia) transformations.push('e_sepia');

  // Additional transformations
  Object.entries(otherOptions).forEach(([key, value]) => {
    if (value !== undefined) {
      transformations.push(`${key}_${value}`);
    }
  });

  const transformationString = transformations.join(',');

  return cloudinary.url(publicId, {
    transformation: transformationString,
    secure: true,
  });
}

/**
 * Upload an image to Cloudinary with auto-optimization
 */
export async function uploadToCloudinary(
  filePath: string,
  options: {
    folder?: string;
    publicId?: string;
    tags?: string[];
    overwrite?: boolean;
  } = {},
) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: options.folder || 'uploads',
      public_id: options.publicId,
      tags: options.tags,
      overwrite: options.overwrite ?? true,
      // Auto-optimization settings
      quality: 'auto:best',
      fetch_format: 'auto',
      flags: 'progressive',
    });

    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
}

/**
 * Generate responsive image URLs for different breakpoints
 */
export function getResponsiveImageUrls(
  publicId: string,
  breakpoints: number[] = [320, 640, 768, 1024, 1280, 1536],
) {
  return breakpoints.map((width) => ({
    width,
    url: getOptimizedImageUrl(publicId, {
      width,
      format: 'auto',
      quality: 'auto',
    }),
  }));
}

/**
 * Generate avatar URLs with different sizes
 */
export function getAvatarUrls(
  publicId: string,
  sizes: number[] = [32, 48, 64, 96, 128, 256],
) {
  return sizes.reduce(
    (acc, size) => {
      acc[size] = getOptimizedImageUrl(publicId, {
        width: size,
        height: size,
        crop: 'fill',
        format: 'auto',
        quality: 'auto',
      });
      return acc;
    },
    {} as Record<number, string>,
  );
}

export default cloudinary;
