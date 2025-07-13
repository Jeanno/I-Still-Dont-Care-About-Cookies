#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, 'src');
const buildDir = path.join(__dirname, 'build', 'chrome');
const manifestV3Path = path.join(srcDir, 'manifest_v3.json');
const manifestPath = path.join(srcDir, 'manifest.json');
const hotreloadPath = path.join(srcDir, 'data', 'hotreload.js');

console.log('🚀 Building Chrome extension...');

try {
  // Step 1: Copy manifest v3 to manifest.json
  console.log('📄 Setting up Manifest V3...');
  if (!fs.existsSync(manifestV3Path)) {
    throw new Error('manifest_v3.json not found in src directory');
  }
  
  fs.copyFileSync(manifestV3Path, manifestPath);
  console.log('✅ Manifest V3 copied to manifest.json');

  // Step 2: Clear hotreload.js for production
  console.log('🔥 Clearing hotreload script...');
  fs.writeFileSync(hotreloadPath, '', 'utf8');
  console.log('✅ Hotreload script cleared');

  // Step 3: Create build directory if it doesn't exist
  if (!fs.existsSync(path.join(__dirname, 'build'))) {
    fs.mkdirSync(path.join(__dirname, 'build'));
  }
  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
  }

  // Step 4: Copy all src files to build directory
  console.log('📦 Copying source files to build directory...');
  copyDirectory(srcDir, buildDir);
  console.log('✅ Source files copied to build/chrome/');

  console.log('🎉 Chrome extension build completed successfully!');
  console.log(`📁 Build output: ${buildDir}`);
  console.log('');
  console.log('To install in Chrome:');
  console.log('1. Open Chrome and go to chrome://extensions/');
  console.log('2. Enable "Developer mode" in the top right');
  console.log('3. Click "Load unpacked" and select the build/chrome directory');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}