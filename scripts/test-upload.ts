import { UploadApiResponse } from 'cloudinary';
import path from 'path';
import { uploadFile } from '../lib/cloudinary';

async function testUpload() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'favicon.ico');
    console.log(`Uploading file from: ${filePath}`);

    const result = (await uploadFile(filePath, {
      folder: 'test-uploads',
      resource_type: 'auto',
    })) as UploadApiResponse;

    console.log('Upload successful!');
    console.log('Public ID:', result.public_id);
    console.log('URL:', result.secure_url);
  } catch (error) {
    console.error('Upload failed:', error);
  }
}

testUpload();
