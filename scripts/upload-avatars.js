#!/usr/bin/env node

// Require the cloudinary library
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary with environment variables
cloudinary.config({
  secure: true
});

// Log the configuration (without showing secrets)
console.log('Cloudinary configured for cloud:', cloudinary.config().cloud_name);

// Path to avatar images
const AVATARS_DIR = '/home/nwender/Koko-3/public/assets/images/spieler-avatars';

/////////////////////////
// Uploads an image file
/////////////////////////
const uploadImage = async (imagePath, publicId) => {
    const options = {
        public_id: publicId,
        folder: 'spieler-avatars',
        use_filename: false,
        unique_filename: false,
        overwrite: true,
        tags: ['avatar', 'player'],
        context: {
            alt: `Avatar of ${path.basename(publicId)}`,
            category: 'player-avatar'
        }
    };

    try {
        console.log(`Uploading ${imagePath}...`);
        const result = await cloudinary.uploader.upload(imagePath, options);
        console.log(`✅ Successfully uploaded: ${result.public_id}`);
        console.log(`   URL: ${result.secure_url}`);
        return result;
    } catch (error) {
        console.error(`❌ Error uploading ${imagePath}:`, error.message);
        return null;
    }
};

//////////////////
// Main function
//////////////////
(async () => {
    try {
        // Check if avatars directory exists
        if (!fs.existsSync(AVATARS_DIR)) {
            console.error(`❌ Avatars directory not found: ${AVATARS_DIR}`);
            process.exit(1);
        }

        // Get all PNG files in the avatars directory
        const files = fs.readdirSync(AVATARS_DIR)
            .filter(file => file.toLowerCase().endsWith('.png'))
            .sort();

        console.log(`Found ${files.length} avatar files to upload:\n`);

        const results = [];
        
        // Upload each file
        for (const file of files) {
            const filePath = path.join(AVATARS_DIR, file);
            const publicId = path.parse(file).name; // filename without extension
            
            const result = await uploadImage(filePath, publicId);
            if (result) {
                results.push(result);
            }
            
            // Add a small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        console.log(`\n🎉 Upload complete! ${results.length}/${files.length} files uploaded successfully.`);
        
        // Show summary of uploaded files
        console.log('\n📋 Uploaded files summary:');
        results.forEach(result => {
            console.log(`   ${result.public_id}: ${result.secure_url}`);
        });

    } catch (error) {
        console.error('❌ Script error:', error.message);
        process.exit(1);
    }
})();