// Redux Performance Benchmark
// 
// Hardware Specifications:
// - Processor: 13th Gen Intel(R) Core(TM) i7-13650HX (14 cores)
// - RAM: 16 GB
// - OS: Windows 10 Home (Version 2009)
// - Node.js: v18+
//
import { createStore } from 'redux';
import { createInitialState, measureTime, TEST_CONFIGS, logEnvironmentInfo, runBenchmark, saveBenchmarkResults } from './benchmark-utils.mjs';

console.log('🏃‍♂️ Redux Performance Benchmark');
console.log('==============================\n');

// Log environment information
logEnvironmentInfo();

// Create Redux reducer
function createReducer(stateSize) {
  const initialState = createInitialState(stateSize);
  
  return function reducer(state = initialState, action) {
    switch (action.type) {
      case 'UPDATE_PROP':
        return {
          ...state,
          [action.propKey]: {
            ...state[action.propKey],
            ...action.payload
          }
        };
      case 'BATCH_UPDATE':
        return {
          ...state,
          ...action.payload
        };
      default:
        return state;
    }
  };
}

// Benchmark function for Redux
function benchmarkRedux(stateSize, iterations) {
  const reducer = createReducer(stateSize);
  
  // Store Creation
  const createResult = measureTime('Store Creation', () => {
    return createStore(reducer);
  });
  
  const store = createResult.result;
  
  // Single Update Performance
  const singleUpdateResult = measureTime('Single Update', () => {
    store.dispatch({
      type: 'UPDATE_PROP',
      propKey: 'prop0',
      payload: { updated: true }
    });
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
    store.dispatch({
      type: 'BATCH_UPDATE',
      payload: updates
    });
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
  
  // Estimate memory usage (Redux doesn't have built-in memory tracking)
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
console.log('Starting Redux benchmarks...\n');

const results = [];

// Small state, many operations
results.push(runBenchmark('Small State', TEST_CONFIGS.testSizes.small, TEST_CONFIGS.iterations.large, benchmarkRedux));

// Medium state, medium operations  
results.push(runBenchmark('Medium State', TEST_CONFIGS.testSizes.medium, TEST_CONFIGS.iterations.medium, benchmarkRedux));

// Large state, fewer operations
results.push(runBenchmark('Large State', TEST_CONFIGS.testSizes.large, TEST_CONFIGS.iterations.small, benchmarkRedux));

// Save results to JSON file
saveBenchmarkResults('redux', results);

// Summary
console.log('\n🎯 REDUX PERFORMANCE SUMMARY');
console.log('=============================');

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
console.log('🎉 REDUX BENCHMARK COMPLETE!');
console.log('✅ Redux performance data ready for comparison');
