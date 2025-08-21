// Native JavaScript Object Performance Benchmark
// 
// Hardware Specifications:
// - Processor: 13th Gen Intel(R) Core(TM) i7-13650HX (14 cores)
// - RAM: 16 GB
// - OS: Windows 10 Home (Version 2009)
// - Node.js: v18+
//
import { createInitialState, measureTime, TEST_CONFIGS, logEnvironmentInfo, runBenchmark, saveBenchmarkResults } from './benchmark-utils.mjs';

console.log('🏃‍♂️ Native JavaScript Object Performance Benchmark');
console.log('==================================================\n');

// Log environment information
logEnvironmentInfo();

// Benchmark function for Native JavaScript Objects
function benchmarkNative(stateSize, iterations) {
  const initialState = createInitialState(stateSize);
  
  // Object Creation (equivalent to store creation)
  const createResult = measureTime('Object Creation', () => {
    return { ...initialState };
  });
  
  let state = createResult.result;
  
  // Single Update Performance
  const singleUpdateResult = measureTime('Single Update', () => {
    state = {
      ...state,
      prop0: { ...state.prop0, updated: true }
    };
    return state;
  });
  
  // Batch Updates Performance
  const batchUpdateResult = measureTime('Batch Updates', () => {
    const updates = {};
    for (let i = 0; i < Math.min(iterations, 1000); i++) {
      const propKey = `prop${i % stateSize}`;
      const currentProp = state[propKey];
      updates[propKey] = {
        ...currentProp,
        counter: (currentProp.counter || 0) + 1
      };
    }
    state = {
      ...state,
      ...updates
    };
    return state;
  });
  
  // Property Access Performance
  const accessResult = measureTime('Property Access', () => {
    let sum = 0;
    for (let i = 0; i < iterations; i++) {
      const propKey = `prop${i % stateSize}`;
      const value = state[propKey];
      sum += value?.id || 0;
    }
    return sum;
  });
  
  // Estimate memory usage
  const stateSizeBytes = JSON.stringify(state).length;
  const estimatedMemoryKB = stateSizeBytes / 1024; // Single state size
  
  return {
    creation: createResult.duration,
    singleUpdate: singleUpdateResult.duration,
    batchUpdate: batchUpdateResult.duration,
    propertyAccess: accessResult.duration,
    memoryKB: estimatedMemoryKB,
    batchIterations: Math.min(iterations, 1000),
    iterations
  };
}

// Run benchmarks
console.log('Starting Native JavaScript Object benchmarks...\n');

const results = [];

// Small state, many operations
results.push(runBenchmark('Small State', TEST_CONFIGS.testSizes.small, TEST_CONFIGS.iterations.large, benchmarkNative));

// Medium state, medium operations  
results.push(runBenchmark('Medium State', TEST_CONFIGS.testSizes.medium, TEST_CONFIGS.iterations.medium, benchmarkNative));

// Large state, fewer operations
results.push(runBenchmark('Large State', TEST_CONFIGS.testSizes.large, TEST_CONFIGS.iterations.small, benchmarkNative));

// Save results to JSON file
saveBenchmarkResults('native', results);

// Summary
console.log('\n🎯 NATIVE JAVASCRIPT OBJECT PERFORMANCE SUMMARY');
console.log('================================================');

results.forEach(result => {
  console.log(`\n✅ ${result.testName}:`);
  console.log(`  Object Creation: ${result.stats.creation.mean.toFixed(2)}ms`);
  console.log(`  Single Update: ${result.stats.singleUpdate.mean.toFixed(2)}ms`);
  console.log(`  Avg Update: ${(result.stats.batchUpdate.mean / result.results[0].batchIterations).toFixed(2)}ms`);
  console.log(`  Avg Property Access: ${(result.stats.propertyAccess.mean / result.iterations).toFixed(2)}ms`);
  if (result.stats.memoryKB.mean > 0) {
    console.log(`  Memory Usage: ${result.stats.memoryKB.mean.toFixed(0)}KB (single state)`);
  }
});

console.log('\n' + '='.repeat(50));
console.log('🎉 NATIVE JAVASCRIPT OBJECT BENCHMARK COMPLETE!');
console.log('✅ Native JavaScript Object performance data ready for comparison');
