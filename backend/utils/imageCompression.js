import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

const compressImage = async (filePath, quality = 80) => {
  try {
    const ext = path.extname(filePath).toLowerCase();
    const filename = path.basename(filePath, ext);
    const outputPath = path.join(path.dirname(filePath), `${filename}-compressed${ext}`);

    // Determine format based on extension
    let format = 'jpeg'; // default
    if (ext === '.png') format = 'png';
    if (ext === '.webp') format = 'webp';

    // Read the input file
    const inputBuffer = await fs.readFile(filePath);

    // Process the image
    let sharpImage = sharp(inputBuffer)
      .resize(1200, 1200, { // Max dimensions
        fit: 'inside',
        withoutEnlargement: true
      });

    // Apply format-specific compression
    if (format === 'jpeg') {
      sharpImage = sharpImage.jpeg({ quality });
    } else if (format === 'png') {
      sharpImage = sharpImage.png({ quality });
    } else if (format === 'webp') {
      sharpImage = sharpImage.webp({ quality });
    }

    // Save the compressed image
    await sharpImage.toFile(outputPath);

    // Return the path to the compressed image
    return outputPath;
  } catch (error) {
    console.error('Image compression error:', error);
    // If compression fails, return original file path
    return filePath;
  }
};

const getImageMetadata = async (filePath) => {
  try {
    const metadata = await sharp(filePath).metadata();
    return {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      size: metadata.size
    };
  } catch (error) {
    console.error('Error getting image metadata:', error);
    return null;
  }
};

const shouldCompress = async (filePath, maxSize = 1024 * 1024) => { // maxSize = 1MB
  try {
    const stats = await fs.stat(filePath);
    return stats.size > maxSize;
  } catch (error) {
    console.error('Error checking file size:', error);
    return true; // Compress by default if we can't check size
  }
};

export { compressImage, getImageMetadata, shouldCompress };