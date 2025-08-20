#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Directories to clean up - specify exact paths relative to project root
const directoriesToRemove = [
  'dist',
  'node_modules',
  'integration-tests/react-vite/node_modules',
  'integration-tests/react-vite/dist',
  'integration-tests/preact-vite/node_modules',
  'integration-tests/preact-vite/dist',
  'coverage'
];

// Function to remove directory recursively
function removeDirectory(dirPath) {
  const fullPath = path.resolve(projectRoot, dirPath);
  
  if (fs.existsSync(fullPath)) {
    console.log(`🗑️  Removing directory: ${dirPath}`);
    fs.rmSync(fullPath, { recursive: true, force: true });
  } else {
    console.log(`⚠️  Directory not found: ${dirPath}`);
  }
}

console.log('🧹 Starting cleanup...\n');

// Remove specified directories
console.log(`📁 Removing ${directoriesToRemove.length} directories:\n`);

for (const dirPath of directoriesToRemove) {
  removeDirectory(dirPath);
}

console.log('\n✅ Cleanup completed!');
console.log('\n💡 Next steps:');
console.log('   1. Run "npm install" to reinstall dependencies');
console.log('   2. Run "npm run build" to rebuild the project');
