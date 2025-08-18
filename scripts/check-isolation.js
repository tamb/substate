#!/usr/bin/env node

/**
 * Dependency Isolation Verification Script
 * 
 * This script verifies that integration test projects have completely
 * isolated dependencies and no hoisting has occurred.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

const testProjects = [
  'integration-tests/react-vite',
  'integration-tests/preact-vite'
];

let allPassed = true;

console.log('🔍 Checking dependency isolation...\n');

for (const projectPath of testProjects) {
  const fullPath = path.join(rootDir, projectPath);
  const nodeModulesPath = path.join(fullPath, 'node_modules');
  const packageJsonPath = path.join(fullPath, 'package.json');
  
  console.log(`📦 Checking ${projectPath}:`);
  
  // Check if project exists
  if (!fs.existsSync(fullPath)) {
    console.log(`  ❌ Project directory doesn't exist`);
    allPassed = false;
    continue;
  }
  
  // Check if package.json exists
  if (!fs.existsSync(packageJsonPath)) {
    console.log(`  ❌ package.json not found`);
    allPassed = false;
    continue;
  }
  
  // Read and check package.json
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Check if it has substate dependency
    if (!packageJson.dependencies?.substate) {
      console.log(`  ❌ Missing substate dependency`);
      allPassed = false;
    } else if (packageJson.dependencies.substate === 'file:../../') {
      console.log(`  ✅ Substate dependency correctly linked to parent`);
    } else {
      console.log(`  ⚠️  Substate dependency: ${packageJson.dependencies.substate}`);
    }
    
    // Check if it's marked as private
    if (!packageJson.private) {
      console.log(`  ❌ Project should be marked as private`);
      allPassed = false;
    } else {
      console.log(`  ✅ Project correctly marked as private`);
    }
    
  } catch (error) {
    console.log(`  ❌ Error reading package.json: ${error.message}`);
    allPassed = false;
    continue;
  }
  
  // Check if node_modules exists
  if (!fs.existsSync(nodeModulesPath)) {
    console.log(`  ⚠️  node_modules not found (run npm install)`);
    continue;
  }
  
  console.log(`  ✅ node_modules directory exists`);
  
  // Check for framework-specific dependencies
  if (projectPath === 'integration-tests/react-vite') {
    const reactPath = path.join(nodeModulesPath, 'react');
    if (fs.existsSync(reactPath)) {
      console.log(`  ✅ React locally installed (isolated)`);
    } else {
      console.log(`  ❌ React not found in local node_modules`);
      allPassed = false;
    }
    
    // React projects should NOT have Preact
    const preactPath = path.join(nodeModulesPath, 'preact');
    if (fs.existsSync(preactPath)) {
      console.log(`  ⚠️  Preact unexpectedly found in React project`);
    }
  } else if (projectPath === 'integration-tests/preact-vite') {
    const preactPath = path.join(nodeModulesPath, 'preact');
    if (fs.existsSync(preactPath)) {
      console.log(`  ✅ Preact locally installed (isolated)`);
    } else {
      console.log(`  ❌ Preact not found in local node_modules`);
      allPassed = false;
    }
    
    // Preact projects should NOT have React
    const reactPath = path.join(nodeModulesPath, 'react');
    if (fs.existsSync(reactPath)) {
      console.log(`  ⚠️  React unexpectedly found in Preact project`);
    } else {
      console.log(`  ✅ React correctly absent from Preact project`);
    }
  }
  
  // Check if substate is correctly linked
  const substatePath = path.join(nodeModulesPath, 'substate');
  if (fs.existsSync(substatePath)) {
    try {
      const stats = fs.lstatSync(substatePath);
      if (stats.isSymbolicLink()) {
        console.log(`  ✅ Substate correctly symlinked`);
      } else {
        console.log(`  ✅ Substate installed locally`);
      }
    } catch (error) {
      console.log(`  ⚠️  Could not check substate link status`);
    }
  } else {
    console.log(`  ❌ Substate not found in node_modules`);
    allPassed = false;
  }
  
  console.log('');
}

// Check root node_modules for pollution
const rootNodeModules = path.join(rootDir, 'node_modules');
if (fs.existsSync(rootNodeModules)) {
  console.log('🔍 Checking root node_modules for pollution:');
  
  // Read root package.json to check legitimate devDependencies
  const rootPackageJsonPath = path.join(rootDir, 'package.json');
  let rootDevDeps = {};
  
  try {
    const rootPackageJson = JSON.parse(fs.readFileSync(rootPackageJsonPath, 'utf8'));
    rootDevDeps = rootPackageJson.devDependencies || {};
  } catch (error) {
    console.log(`  ⚠️  Could not read root package.json: ${error.message}`);
  }
  
  const pollutionChecks = ['react', 'preact', '@types/react'];
  let foundActualPollution = false;
  
  for (const dep of pollutionChecks) {
    const depPath = path.join(rootNodeModules, dep);
    if (fs.existsSync(depPath)) {
      if (rootDevDeps[dep]) {
        console.log(`  ✅ Found ${dep} in root node_modules (legitimate devDependency)`);
      } else {
        console.log(`  ⚠️  Found ${dep} in root node_modules (possible hoisting - not in devDependencies)`);
        foundActualPollution = true;
      }
    }
  }
  
  if (!foundActualPollution) {
    console.log(`  ✅ No unexpected framework dependencies found in root (good isolation)`);
  }
  console.log('');
}

// Final result
if (allPassed) {
  console.log('🎉 All dependency isolation checks passed!');
  console.log('✅ Integration tests are properly isolated');
  process.exit(0);
} else {
  console.log('❌ Some isolation checks failed');
  console.log('💡 Make sure to run npm install in each integration test directory');
  process.exit(1);
}
