// Substate Performance Benchmark
// 
// Hardware Specifications:
// - Processor: 13th Gen Intel(R) Core(TM) i7-13650HX (14 cores)
// - RAM: 16 GB
// - OS: Windows 10 Home (Version 2009)
// - Node.js: v18+
//
import { createStore } from '../dist/index.esm.js';
import { createInitialState, measureTime, TEST_CONFIGS, logEnvironmentInfo, runBenchmark, saveBenchmarkResults } from './benchmark-utils.mjs';

console.log('🏃‍♂️ Substate Performance Benchmark');
console.log('==================================\n');

// Log environment information
logEnvironmentInfo();

// Benchmark function for Substate
function benchmarkSubstate(stateSize, iterations) {
  const initialState = createInitialState(stateSize);
  
  // Store Creation
  const createResult = measureTime('Store Creation', () => {
    return createStore({
      name: 'SubstateStore',
      state: initialState,
      defaultDeep: false // Shallow cloning for fair comparison
    });
  });
  
  const store = createResult.result;
  
  // Single Update Performance
  const singleUpdateResult = measureTime('Single Update', () => {
    store.updateState({ prop0: { ...store.getProp('prop0'), updated: true } });
    return store.getCurrentState();
  });
  
  // Batch Updates Performance
  const batchUpdateResult = measureTime('Batch Updates', () => {
    for (let i = 0; i < Math.min(iterations, 1000); i++) {
      const propKey = `prop${i % stateSize}`;
      const currentProp = store.getProp(propKey);
      store.updateState({ 
        [propKey]: { ...currentProp, counter: (currentProp.counter || 0) + 1 }
      });
    }
    return store.getCurrentState();
  });
  
  // Property Access Performance
  const accessResult = measureTime('Property Access', () => {
    let sum = 0;
    for (let i = 0; i < iterations; i++) {
      const propKey = `prop${i % stateSize}`;
      const value = store.getProp(propKey);
      sum += value?.id || 0;
    }
    return sum;
  });
  
  // Memory Usage
  const memUsage = store.getMemoryUsage();
  
  return {
    creation: createResult.duration,
    singleUpdate: singleUpdateResult.duration,
    batchUpdate: batchUpdateResult.duration,
    propertyAccess: accessResult.duration,
    memoryKB: memUsage.estimatedSizeKB,
    batchIterations: Math.min(iterations, 1000),
    iterations
  };
}

// Run benchmarks
console.log('Starting Substate benchmarks...\n');

const results = [];

// Small state, many operations
results.push(runBenchmark('Small State', TEST_CONFIGS.testSizes.small, TEST_CONFIGS.iterations.large, benchmarkSubstate));

// Medium state, medium operations  
results.push(runBenchmark('Medium State', TEST_CONFIGS.testSizes.medium, TEST_CONFIGS.iterations.medium, benchmarkSubstate));

// Large state, fewer operations
results.push(runBenchmark('Large State', TEST_CONFIGS.testSizes.large, TEST_CONFIGS.iterations.small, benchmarkSubstate));

// Save results to JSON file
saveBenchmarkResults('substate', results);

// Summary
console.log('\n🎯 SUBSTATE PERFORMANCE SUMMARY');
console.log('================================');

results.forEach(result => {
  console.log(`\n✅ ${result.testName}:`);
  console.log(`  Store Creation: ${result.stats.creation.mean.toFixed(2)}ms`);
  console.log(`  Single Update: ${result.stats.singleUpdate.mean.toFixed(2)}ms`);
  console.log(`  Avg Update: ${(result.stats.batchUpdate.mean / result.results[0].batchIterations).toFixed(2)}ms`);
  console.log(`  Avg Property Access: ${(result.stats.propertyAccess.mean / result.iterations).toFixed(2)}ms`);
  if (result.stats.memoryKB.mean > 0) {
    console.log(`  Memory Usage: ${result.stats.memoryKB.mean.toFixed(0)}KB`);
  }
});

console.log('\n' + '='.repeat(50));
console.log('🎉 SUBSTATE BENCHMARK COMPLETE!');
console.log('✅ Substate performance data ready for comparison');
