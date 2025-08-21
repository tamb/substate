// Zustand Performance Benchmark
// 
// Hardware Specifications:
// - Processor: 13th Gen Intel(R) Core(TM) i7-13650HX (14 cores)
// - RAM: 16 GB
// - OS: Windows 10 Home (Version 2009)
// - Node.js: v18+
//
import { create } from 'zustand';
import { createInitialState, measureTime, TEST_CONFIGS, logEnvironmentInfo, runBenchmark, saveBenchmarkResults } from './benchmark-utils.mjs';

console.log('🏃‍♂️ Zustand Performance Benchmark');
console.log('==================================\n');

// Log environment information
logEnvironmentInfo();

// Benchmark function for Zustand
function benchmarkZustand(stateSize, iterations) {
  const initialState = createInitialState(stateSize);
  
  // Store Creation
  const createResult = measureTime('Store Creation', () => {
    return create((set, get) => ({
      ...initialState,
      updateProp: (propKey, payload) => set((state) => ({
        ...state,
        [propKey]: {
          ...state[propKey],
          ...payload
        }
      })),
      batchUpdate: (updates) => set((state) => ({
        ...state,
        ...updates
      }))
    }));
  });
  
  const store = createResult.result;
  
  // Single Update Performance
  const singleUpdateResult = measureTime('Single Update', () => {
    store.getState().updateProp('prop0', { updated: true });
    return store.getState();
  });
  
  // Batch Updates Performance
  const batchUpdateResult = measureTime('Batch Updates', () => {
    const updates = {};
    for (let i = 0; i < Math.min(iterations, 1000); i++) {
      const propKey = `prop${i % stateSize}`;
      const currentProp = store.getState()[propKey];
      updates[propKey] = {
        ...currentProp,
        counter: (currentProp.counter || 0) + 1
      };
    }
    store.getState().batchUpdate(updates);
    return store.getState();
  });
  
  // Property Access Performance
  const accessResult = measureTime('Property Access', () => {
    let sum = 0;
    for (let i = 0; i < iterations; i++) {
      const propKey = `prop${i % stateSize}`;
      const value = store.getState()[propKey];
      sum += value?.id || 0;
    }
    return sum;
  });
  
  // Estimate memory usage (Zustand doesn't have built-in memory tracking)
  const stateSizeBytes = JSON.stringify(store.getState()).length;
  const estimatedMemoryKB = (stateSizeBytes * 50) / 1024; // Rough estimate for 50 states
  
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
console.log('Starting Zustand benchmarks...\n');

const results = [];

// Small state, many operations
results.push(runBenchmark('Small State', TEST_CONFIGS.testSizes.small, TEST_CONFIGS.iterations.large, benchmarkZustand));

// Medium state, medium operations  
results.push(runBenchmark('Medium State', TEST_CONFIGS.testSizes.medium, TEST_CONFIGS.iterations.medium, benchmarkZustand));

// Large state, fewer operations
results.push(runBenchmark('Large State', TEST_CONFIGS.testSizes.large, TEST_CONFIGS.iterations.small, benchmarkZustand));

// Save results to JSON file
saveBenchmarkResults('zustand', results);

// Summary
console.log('\n🎯 ZUSTAND PERFORMANCE SUMMARY');
console.log('================================');

results.forEach(result => {
  console.log(`\n✅ ${result.testName}:`);
  console.log(`  Store Creation: ${result.stats.creation.mean.toFixed(2)}ms`);
  console.log(`  Single Update: ${result.stats.singleUpdate.mean.toFixed(2)}ms`);
  console.log(`  Avg Update: ${(result.stats.batchUpdate.mean / result.results[0].batchIterations).toFixed(2)}ms`);
  console.log(`  Avg Property Access: ${(result.stats.propertyAccess.mean / result.iterations).toFixed(2)}ms`);
  if (result.stats.memoryKB.mean > 0) {
    console.log(`  Memory Usage: ${result.stats.memoryKB.mean.toFixed(0)}KB (estimated)`);
  }
});

console.log('\n' + '='.repeat(50));
console.log('🎉 ZUSTAND BENCHMARK COMPLETE!');
console.log('✅ Zustand performance data ready for comparison');
