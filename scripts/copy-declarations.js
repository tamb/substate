#!/usr/bin/env node

import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

async function ensureDir(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

async function createDeclarationReference(targetDir, relativePath, frameworkName) {
  await ensureDir(targetDir);
  
  const declarationContent = `// TypeScript declarations for ${frameworkName} integration
// This file re-exports the main integration declarations
export * from '${relativePath}';
`;

  const indexPath = join(targetDir, 'index.d.ts');
  await fs.writeFile(indexPath, declarationContent);
  
  console.log(`✅ Created ${frameworkName} declaration reference`);
}

async function createDeclarationReferences() {
  try {
    console.log('Creating framework declaration references...');
    /**
     *  To create a new framework declaration reference, 
     * add the framework name to the createDeclarationReference function
     *  and add the framework name to the package.json exports object
     * @example
     * await createDeclarationReference(
     *  join(rootDir, 'dist/vue'),
     *  '../integrations/vue',
     *  'Vue'
     * );
     * 
     */

    // Create React declaration reference
    await createDeclarationReference(
      join(rootDir, 'dist/react'),
      '../integrations/react',
      'React'
    );
    
    // Create Preact declaration reference  
    await createDeclarationReference(
      join(rootDir, 'dist/preact'),
      '../integrations/preact',
      'Preact'
    );
    
    console.log('✅ All declaration references created successfully!');
    console.log('');
    console.log('📦 Package exports now work:');
    console.log('  import { useSubstate } from "substate/react"  ✅');
    console.log('  import { useSubstate } from "substate/preact" ✅');
  } catch (error) {
    console.error('❌ Error creating declaration references:', error);
    process.exit(1);
  }
}

createDeclarationReferences();
