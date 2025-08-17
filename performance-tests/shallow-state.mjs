// Shallow State Management Performance Benchmark
import { createStore } from '../dist/index.esm.js';

console.log('🏃‍♂️ Shallow State Management Performance Benchmark');
console.log('================================================\n');

// Test configurations
const ITERATIONS = {
  small: 1000,
  medium: 10000,
  large: 100000
};

const TEST_SIZES = {
  small: 10,      // 10 properties
  medium: 100,    // 100 properties  
  large: 1000     // 1000 properties
};

// Utility functions
function createInitialState(size) {
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

function measureTime(label, fn) {
  const start = process.hrtime.bigint();
  const result = fn();
  const end = process.hrtime.bigint();
  const duration = Number(end - start) / 1000000; // Convert to milliseconds
  
  return { result, duration, label };
}

function formatTime(ms) {
  if (ms < 1) return `${(ms * 1000).toFixed(2)}μs`;
  if (ms < 1000) return `${ms.toFixed(2)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function runBenchmark(testName, stateSize, iterations) {
  console.log(`\n📊 ${testName} (${stateSize} props, ${iterations.toLocaleString()} ops)`);
  console.log('-'.repeat(60));
  
  const initialState = createInitialState(stateSize);
  
  // Store Creation
  const createResult = measureTime('Store Creation', () => {
    return createStore({
      name: `${testName}Store`,
      state: initialState,
      defaultDeep: false // Shallow cloning
    });
  });
  
  const store = createResult.result;
  console.log(`Store Creation: ${formatTime(createResult.duration)}`);
  
  // Single Update Performance
  const singleUpdateResult = measureTime('Single Update', () => {
    store.updateState({ prop0: { ...store.getProp('prop0'), updated: true } });
    return store.getCurrentState();
  });
  console.log(`Single Update: ${formatTime(singleUpdateResult.duration)}`);
  
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
  console.log(`Batch Updates (${Math.min(iterations, 1000)} ops): ${formatTime(batchUpdateResult.duration)}`);
  console.log(`Avg per update: ${formatTime(batchUpdateResult.duration / Math.min(iterations, 1000))}`);
  
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
  console.log(`Property Access (${iterations.toLocaleString()} ops): ${formatTime(accessResult.duration)}`);
  console.log(`Avg per access: ${formatTime(accessResult.duration / iterations)}`);
  
  // Nested Property Access Performance  
  const nestedAccessResult = measureTime('Nested Property Access', () => {
    let sum = 0;
    for (let i = 0; i < iterations; i++) {
      const propKey = `prop${i % stateSize}`;
      const value = store.getProp(`${propKey}.metadata.index`);
      sum += value || 0;
    }
    return sum;
  });
  console.log(`Nested Access (${iterations.toLocaleString()} ops): ${formatTime(nestedAccessResult.duration)}`);
  console.log(`Avg per nested access: ${formatTime(nestedAccessResult.duration / iterations)}`);
  
  // Memory Usage
  const memUsage = store.getMemoryUsage();
  console.log(`Memory Usage: ${memUsage.estimatedSizeKB}KB (${memUsage.stateCount} states)`);
  
  // Event System Performance
  let eventCount = 0;
  const listener = () => eventCount++;
  store.on('STATE_UPDATED', listener);
  
  const eventResult = measureTime('Event System', () => {
    for (let i = 0; i < Math.min(iterations, 100); i++) {
      store.updateState({ eventTest: i });
    }
    return eventCount;
  });
  console.log(`Event System (${Math.min(iterations, 100)} events): ${formatTime(eventResult.duration)}`);
  console.log(`Avg per event: ${formatTime(eventResult.duration / Math.min(iterations, 100))}`);
  
  store.off('STATE_UPDATED', listener);
  
  return {
    testName,
    stateSize,
    iterations,
    results: {
      creation: createResult.duration,
      singleUpdate: singleUpdateResult.duration,
      batchUpdate: batchUpdateResult.duration,
      propertyAccess: accessResult.duration,
      nestedAccess: nestedAccessResult.duration,
      eventSystem: eventResult.duration,
      memoryKB: memUsage.estimatedSizeKB
    }
  };
}

// Run benchmarks
console.log('Starting shallow state management benchmarks...\n');

const results = [];

// Small state, many operations
results.push(runBenchmark('Small State', TEST_SIZES.small, ITERATIONS.large));

// Medium state, medium operations  
results.push(runBenchmark('Medium State', TEST_SIZES.medium, ITERATIONS.medium));

// Large state, fewer operations
results.push(runBenchmark('Large State', TEST_SIZES.large, ITERATIONS.small));

// Summary
console.log('\n🎯 SHALLOW STATE PERFORMANCE SUMMARY');
console.log('=====================================');
results.forEach(result => {
  console.log(`\n${result.testName}:`);
  console.log(`  Store Creation: ${formatTime(result.results.creation)}`);
  console.log(`  Single Update: ${formatTime(result.results.singleUpdate)}`);
  console.log(`  Avg Update: ${formatTime(result.results.batchUpdate / Math.min(result.iterations, 1000))}`);
  console.log(`  Avg Property Access: ${formatTime(result.results.propertyAccess / result.iterations)}`);
  console.log(`  Memory Usage: ${result.results.memoryKB}KB`);
});

console.log('\n✅ Shallow state benchmarks completed!');
