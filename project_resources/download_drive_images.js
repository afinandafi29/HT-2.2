/**
 * Script to download images from Google Drive folder
 * 
 * Instructions:
 * 1. Install required package: npm install axios
 * 2. Get the folder ID from your Google Drive link
 * 3. You'll need to use Google Drive API or manually download the folder
 * 
 * For manual download:
 * 1. Open the Google Drive link in browser
 * 2. Right-click the folder and select "Download"
 * 3. Extract the downloaded zip file
 * 4. Run this script to process the images
 */

const fs = require('fs');
const path = require('path');

// Configuration
const SOURCE_FOLDER = process.argv[2] || './downloaded_profiles'; // Folder where you extracted the images
const DEST_FOLDER = './public/profiles';
const OUTPUT_FILE = './src/data/localProfiles.js';

async function processImages() {
    console.log('Processing profile images...');

    // Create destination folder if it doesn't exist
    if (!fs.existsSync(DEST_FOLDER)) {
        fs.mkdirSync(DEST_FOLDER, { recursive: true });
    }

    // Check if source folder exists
    if (!fs.existsSync(SOURCE_FOLDER)) {
        console.error(`Source folder not found: ${SOURCE_FOLDER}`);
        console.log('\nPlease download the images from Google Drive first:');
        console.log('1. Open: https://drive.google.com/file/d/1uVb0V6J7JZmKlJQGUmzwvrqaxC-yB2wq/view');
        console.log('2. Download the folder');
        console.log('3. Extract to a folder');
        console.log('4. Run: node download_drive_images.js <path-to-extracted-folder>');
        return;
    }

    // Read all files from source folder
    const files = fs.readdirSync(SOURCE_FOLDER);
    const imageFiles = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
    });

    console.log(`Found ${imageFiles.length} images`);

    // Copy images to destination
    const copiedFiles = [];
    for (const file of imageFiles) {
        const sourcePath = path.join(SOURCE_FOLDER, file);
        const destPath = path.join(DEST_FOLDER, file);

        try {
            fs.copyFileSync(sourcePath, destPath);
            copiedFiles.push(file);
            if (copiedFiles.length % 100 === 0) {
                console.log(`Copied ${copiedFiles.length} images...`);
            }
        } catch (error) {
            console.error(`Error copying ${file}:`, error.message);
        }
    }

    console.log(`\nSuccessfully copied ${copiedFiles.length} images to ${DEST_FOLDER}`);

    // Generate localProfiles.js
    const profilesArray = copiedFiles.map(file => `"${file}"`).join(',\n');
    const fileContent = `export const LOCAL_PROFILES = [\n${profilesArray},\n];\n`;

    fs.writeFileSync(OUTPUT_FILE, fileContent);
    console.log(`\nGenerated ${OUTPUT_FILE} with ${copiedFiles.length} profiles`);
}

processImages().catch(console.error);
