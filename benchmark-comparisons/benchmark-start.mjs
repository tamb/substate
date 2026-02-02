#!/usr/bin/env node

// Benchmark Start Script
// Creates a timestamped directory and runs all benchmarks synchronously

import fs from 'fs';
import { execSync } from 'child_process';

console.log('🚀 Starting Benchmark Suite');
console.log('===========================\n');

// Create unique run directory based on timestamp
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const runDir = `./results/run-${timestamp}`;

console.log(`📁 Creating run directory: ${runDir}`);

// Create the run directory
if (!fs.existsSync('./results')) {
  fs.mkdirSync('./results', { recursive: true });
}
fs.mkdirSync(runDir, { recursive: true });

console.log(`🕒 Run started at: ${new Date().toLocaleString()}`);
console.log(`📁 Output directory: ${runDir}\n`);

// List of benchmarks to run
const benchmarks = [
  'benchmark-substate.mjs',
  'benchmark-redux.mjs',
  'benchmark-zustand.mjs',
  'benchmark-mobx.mjs',
  'benchmark-native.mjs'
];

// Run each benchmark synchronously
for (const benchmark of benchmarks) {
  try {
    console.log(`▶️  Running ${benchmark}...`);
    
    // Set environment variables and run the benchmark
    const env = {
      ...process.env,
      BENCHMARK_RUN_DIR: runDir,
      BENCHMARK_RUN_ID: timestamp
    };
    
    execSync(`node ${benchmark}`, {
      stdio: 'inherit',
      env: env
    });
    
    console.log(`✅ ${benchmark} completed\n`);
    
  } catch (error) {
    console.error(`❌ ${benchmark} failed:`, error.message);
    process.exit(1);
  }
}

console.log('🎉 All benchmarks completed successfully!');
console.log(`📁 Results saved in: ${runDir}`);
console.log(`🕒 Run completed at: ${new Date().toLocaleString()}`);

// Automatically generate report for this run
console.log('\n📊 Generating performance report...');
try {
  const reportEnv = {
    ...process.env,
    BENCHMARK_RUN_DIR: runDir
  };
  
  execSync('node generate-report.mjs', {
    stdio: 'inherit',
    env: reportEnv
  });
  
  console.log('\n🎉 Complete benchmark run finished!');
  console.log(`📁 All files saved in: ${runDir}`);
  console.log(`📖 View results: ${runDir.replace('./results/', 'results/')}/performance-tables-*.md`);
  
} catch (error) {
  console.error('\n⚠️  Report generation failed:', error.message);
  console.log(`\n💡 You can manually generate the report with:`);
  console.log(`   BENCHMARK_RUN_DIR="${runDir}" node generate-report.mjs`);
}
