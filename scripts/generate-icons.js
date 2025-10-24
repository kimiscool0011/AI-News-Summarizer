const { createCanvas } = require('canvas');

// Simple icon generation (you can replace with proper logos later)
const sizes = [192, 256, 384, 512];

sizes.forEach(size => {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, size, size);
  
  // Text
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${size * 0.2}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('📰', size / 2, size / 2);
  
  // Save to public folder
  const fs = require('fs');
  fs.writeFileSync(`public/icon-${size}x${size}.png`, canvas.toBuffer('image/png'));
});

console.log('✅ Icons generated in public folder!');