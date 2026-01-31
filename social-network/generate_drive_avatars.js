/**
 * Alternative: Add Google Drive image URLs directly to the avatar pool
 * 
 * This script generates avatar entries using Google Drive direct image links
 * You can get direct links by:
 * 1. Right-click image in Google Drive
 * 2. Get link -> Anyone with the link can view
 * 3. Convert sharing link to direct link format
 */

const fs = require('fs');

// Google Drive file IDs (you'll need to add these)
// Format: https://drive.google.com/uc?export=view&id=FILE_ID
const DRIVE_IMAGE_IDS = [
    // Add your image file IDs here
    // Example: '1fcTYMwtQuvNWEJjtmaVxbYB5lO6bD9VI',
];

// Generate avatar URLs
const driveAvatars = DRIVE_IMAGE_IDS.map((id, index) => ({
    src: `https://drive.google.com/uc?export=view&id=${id}`,
    fallback: '',
    tooltip: `User ${index + 1}`,
}));

console.log('Generated avatars:', driveAvatars.length);
console.log('\nAdd these to your GENERATED_AVATARS array in RoomCard.jsx:');
console.log(JSON.stringify(driveAvatars, null, 2));
