// Benchmark Utilities
// Shared functions for performance comparison benchmarks

import fs from 'fs';
import path from 'path';

// Environment detection
const isCI = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';

export const NUM_RUNS = 100;
// Test configurations
export const TEST_CONFIGS = {
  iterations: {
    small: 1000,
    medium: 10000,
    large: 100000
  },
  testSizes: {
    small: 10,
    medium: 100,
    large: 1000
  }
};

// Utility functions
export function createInitialState(size) {
  const state = {};
  for (let i = 0; i < size; i++) {
    state[`prop${i}`] = {
      id: i,
      name: `item_${i}`,
      value: Math.random(),
      active: i % 2 === 0,
      metadata: { type: 'test', index: i }
    };
  }
  return state;
}

export function measureTime(label, fn) {
  const start = process.hrtime.bigint();
  const result = fn();
  const end = process.hrtime.bigint();
  const duration = Number(end - start) / 1000000; // Convert to milliseconds
  
  return { result, duration, label };
}

export function formatTime(ms) {
  if (ms < 1) return `${(ms * 1000).toFixed(2)}μs`;
  if (ms < 1000) return `${ms.toFixed(2)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

export function calculateStats(values) {
  const sorted = values.sort((a, b) => a - b);
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const median = sorted[Math.floor(sorted.length / 2)];
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const stdDev = Math.sqrt(values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length);
  
  return { mean, median, min, max, stdDev };
}

export function formatStats(stats) {
  if (stats.mean < 1) {
    return `${(stats.mean * 1000).toFixed(2)}μs (min: ${(stats.min * 1000).toFixed(2)}μs, max: ${(stats.max * 1000).toFixed(2)}μs, std: ${(stats.stdDev * 1000).toFixed(2)}μs)`;
  }
  return `${stats.mean.toFixed(2)}ms (min: ${stats.min.toFixed(2)}ms, max: ${stats.max.toFixed(2)}ms, std: ${stats.stdDev.toFixed(2)}ms)`;
}

export function logEnvironmentInfo() {
  console.log(`🌍 Environment: ${isCI ? 'CI' : 'Local'} (${process.platform})`);
  console.log(`🖥️ Node.js: ${process.version}`);
  console.log(`📊 Hardware: ${process.arch}, ${process.platform}`);
}

export function runBenchmark(testName, stateSize, iterations, benchmarkFn) {
  console.log(`\n📊 ${testName} (${stateSize} props, ${iterations.toLocaleString()} ops)`);
  console.log('-'.repeat(60));
  
  const results = [];
  
  // Run multiple iterations
  for (let run = 1; run <= NUM_RUNS; run++) {
    process.stdout.write(`\r  Running iteration ${run}/${NUM_RUNS}...`);
    results.push(benchmarkFn(stateSize, iterations));
  }
  
  console.log('\n');
  
  // Calculate statistics
  const stats = {
    creation: calculateStats(results.map(r => r.creation)),
    singleUpdate: calculateStats(results.map(r => r.singleUpdate)),
    batchUpdate: calculateStats(results.map(r => r.batchUpdate)),
    propertyAccess: calculateStats(results.map(r => r.propertyAccess)),
    memoryKB: calculateStats(results.map(r => r.memoryKB || 0))
  };
  
  // Display results
  console.log(`Store Creation: ${formatStats(stats.creation)}`);
  console.log(`Single Update: ${formatStats(stats.singleUpdate)}`);
  console.log(`Batch Updates (${results[0].batchIterations} ops): ${formatStats(stats.batchUpdate)}`);
  console.log(`Avg per update: ${formatTime(stats.batchUpdate.mean / results[0].batchIterations)}`);
  console.log(`Property Access (${iterations.toLocaleString()} ops): ${formatStats(stats.propertyAccess)}`);
  console.log(`Avg per access: ${formatTime(stats.propertyAccess.mean / iterations)}`);
  if (results[0].memoryKB !== undefined) {
    console.log(`Memory Usage: ${stats.memoryKB.mean.toFixed(0)}KB (${results[0].iterations} states)`);
  }
  
  return {
    testName,
    stateSize,
    iterations,
    stats,
    results,
    // Add computed averages for easy access
    averages: {
      creation: stats.creation.mean,
      singleUpdate: stats.singleUpdate.mean,
      avgUpdate: stats.batchUpdate.mean / results[0].batchIterations,
      avgAccess: stats.propertyAccess.mean / iterations,
      memoryKB: stats.memoryKB.mean
    }
  };
}

// Function to save benchmark results to JSON file
export function saveBenchmarkResults(libraryName, results) {
  const outputDir = './results';
  
  // Create results directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${outputDir}/${libraryName}-benchmark-${timestamp}.json`;
  
  const benchmarkData = {
    library: libraryName,
    timestamp: new Date().toISOString(),
    environment: {
      platform: process.platform,
      nodeVersion: process.version,
      isCI: isCI
    },
    results: results.map(result => ({
      testName: result.testName,
      stateSize: result.stateSize,
      iterations: result.iterations,
      averages: result.averages,
      stats: {
        creation: result.stats.creation,
        singleUpdate: result.stats.singleUpdate,
        batchUpdate: result.stats.batchUpdate,
        propertyAccess: result.stats.propertyAccess,
        memoryKB: result.stats.memoryKB
      }
    }))
  };
  
  fs.writeFileSync(filename, JSON.stringify(benchmarkData, null, 2));
  console.log(`\n💾 Results saved to: ${filename}`);
  
  return filename;
}
