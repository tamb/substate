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

// Performance thresholds (in milliseconds) - High standards for production-ready performance
// Memory thresholds account for 50-state history (default maxHistorySize) with realistic overhead
const PERFORMANCE_THRESHOLDS = {
  small: {
    creation: 5,           // Store creation should be nearly instantaneous
    singleUpdate: 1,       // Single updates should be sub-millisecond
    avgUpdate: 0.1,        // Average update should be extremely fast
    avgAccess: 0.01,       // Property access should be ultra-fast
    avgNestedAccess: 0.05, // Nested access with minimal overhead
    avgEvent: 0.1,         // Event firing should be very fast
    memoryKB: 150          // ~127KB observed, allow 20% headroom for 10 props * 50 states
  },
  medium: {
    creation: 15,          // Still very fast creation for medium state
    singleUpdate: 2,       // Single updates remain fast
    avgUpdate: 0.2,        // Slightly higher but still very fast
    avgAccess: 0.02,       // Access time scales linearly but stays low
    avgNestedAccess: 0.1,  // Nested access remains efficient
    avgEvent: 0.2,         // Events should scale well
    memoryKB: 1500         // ~1257KB observed, allow 20% headroom for 100 props * 50 states
  },
  large: {
    creation: 50,          // Acceptable creation time for large state
    singleUpdate: 5,       // Updates should still be fast even for large state
    avgUpdate: 0.5,        // Individual updates remain quick
    avgAccess: 0.05,       // Access time should scale well
    avgNestedAccess: 0.2,  // Nested access with good performance
    avgEvent: 0.5,         // Events should remain responsive
    memoryKB: 15000        // ~12.8MB observed, allow 17% headroom for 1000 props * 50 states
  }
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

function checkThreshold(actual, threshold, metric, testSize, isMemory = false) {
  const passed = actual <= threshold;
  const status = passed ? '✅' : '❌';
  const percentage = ((actual / threshold) * 100).toFixed(1);
  
  if (isMemory) {
    console.log(`  ${status} ${metric}: ${actual.toFixed(0)}KB (threshold: ${threshold}KB, ${percentage}% of limit)`);
  } else {
    console.log(`  ${status} ${metric}: ${formatTime(actual)} (threshold: ${formatTime(threshold)}, ${percentage}% of limit)`);
  }
  
  return passed;
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
  
  // Performance validation
  console.log('\n🎯 Performance Validation:');
  const testSizeKey = stateSize === TEST_SIZES.small ? 'small' : 
                     stateSize === TEST_SIZES.medium ? 'medium' : 'large';
  const thresholds = PERFORMANCE_THRESHOLDS[testSizeKey];
  
  const validationResults = {
    creation: checkThreshold(createResult.duration, thresholds.creation, 'Store Creation', testSizeKey),
    singleUpdate: checkThreshold(singleUpdateResult.duration, thresholds.singleUpdate, 'Single Update', testSizeKey),
    avgUpdate: checkThreshold(batchUpdateResult.duration / Math.min(iterations, 1000), thresholds.avgUpdate, 'Avg Update', testSizeKey),
    avgAccess: checkThreshold(accessResult.duration / iterations, thresholds.avgAccess, 'Avg Property Access', testSizeKey),
    avgNestedAccess: checkThreshold(nestedAccessResult.duration / iterations, thresholds.avgNestedAccess, 'Avg Nested Access', testSizeKey),
    avgEvent: checkThreshold(eventResult.duration / Math.min(iterations, 100), thresholds.avgEvent, 'Avg Event', testSizeKey),
    memory: checkThreshold(memUsage.estimatedSizeKB, thresholds.memoryKB, 'Memory Usage', testSizeKey, true)
  };

  const allPassed = Object.values(validationResults).every(passed => passed);
  console.log(`\n${allPassed ? '🎉' : '💥'} Overall Performance: ${allPassed ? 'PASSED' : 'FAILED'}`);

  return {
    testName,
    stateSize,
    iterations,
    thresholds,
    validationResults,
    allPassed,
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

let overallSuccess = true;
results.forEach(result => {
  const status = result.allPassed ? '✅' : '❌';
  console.log(`\n${status} ${result.testName} - ${result.allPassed ? 'PASSED' : 'FAILED'}:`);
  console.log(`  Store Creation: ${formatTime(result.results.creation)}`);
  console.log(`  Single Update: ${formatTime(result.results.singleUpdate)}`);
  console.log(`  Avg Update: ${formatTime(result.results.batchUpdate / Math.min(result.iterations, 1000))}`);
  console.log(`  Avg Property Access: ${formatTime(result.results.propertyAccess / result.iterations)}`);
  console.log(`  Memory Usage: ${result.results.memoryKB}KB`);
  
  if (!result.allPassed) {
    overallSuccess = false;
    console.log(`  💡 Failed metrics: ${Object.entries(result.validationResults)
      .filter(([_, passed]) => !passed)
      .map(([metric]) => metric)
      .join(', ')}`);
  }
});

console.log('\n' + '='.repeat(50));
if (overallSuccess) {
  console.log('🎉 ALL SHALLOW STATE PERFORMANCE TESTS PASSED!');
  console.log('✅ Substate meets high performance standards for shallow operations');
  process.exit(0);
} else {
  console.log('💥 SOME PERFORMANCE TESTS FAILED!');
  console.log('❌ Performance optimization needed to meet standards');
  console.log('💡 Consider optimizing failing operations or adjusting thresholds if justified');
  process.exit(1);
}
