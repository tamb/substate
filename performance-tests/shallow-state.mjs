// Shallow State Management Performance Benchmark
// 
// Hardware Specifications:
// - Processor: 13th Gen Intel(R) Core(TM) i7-13650HX (14 cores)
// - RAM: 16 GB
// - OS: Windows 10 Home (Version 2009)
// - Node.js: v18+
//
import { createStore } from '../dist/index.esm.js';

console.log('🏃‍♂️ Shallow State Management Performance Benchmark');
console.log('================================================\n');

// Parse command line arguments
const args = process.argv.slice(2);
const runsArg = args.find(arg => arg.startsWith('--runs='));
const NUM_RUNS = runsArg ? parseInt(runsArg.split('=')[1]) : 1;

if (NUM_RUNS > 1) {
  console.log(`🔄 Running ${NUM_RUNS} iterations for statistical accuracy...\n`);
}

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

// Performance thresholds (in milliseconds) - Updated for improved performance
// Memory thresholds account for 50-state history (default maxHistorySize) with realistic overhead
const PERFORMANCE_THRESHOLDS = {
  small: {
    creation: 0.15,        // Store creation should be very fast (121μs observed, allowing 25% headroom)
    singleUpdate: 0.2,     // Single updates should be fast (163μs observed, allowing 20% headroom)
    avgUpdate: 0.005,      // Average update should be ultra-fast (1.58μs observed)
    avgAccess: 0.001,      // Property access should be ultra-fast (0.07μs observed)
    avgNestedAccess: 0.01, // Nested access with minimal overhead
    avgEvent: 0.1,         // Event firing should be very fast
    memoryKB: 150          // ~126KB observed, allow 20% headroom for 10 props * 50 states
  },
  medium: {
    creation: 0.1,         // Very fast creation for medium state (29μs observed)
    singleUpdate: 0.1,     // Single updates remain fast (63μs observed)
    avgUpdate: 0.05,       // Slightly higher but still very fast (25.93μs observed)
    avgAccess: 0.001,      // Access time scales linearly but stays low (0.15μs observed)
    avgNestedAccess: 0.02, // Nested access remains efficient
    avgEvent: 0.2,         // Events should scale well
    memoryKB: 1500         // ~1.3MB observed, allow 20% headroom for 100 props * 50 states
  },
  large: {
    creation: 0.1,         // Very fast creation time for large state (15μs observed)
    singleUpdate: 1,       // Updates should still be fast even for large state (598μs observed)
    avgUpdate: 0.5,        // Individual updates remain quick (254μs observed)
    avgAccess: 0.001,      // Access time should scale well (0.32μs observed)
    avgNestedAccess: 0.05, // Nested access with good performance
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

function calculateStats(values) {
  const sorted = values.sort((a, b) => a - b);
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const median = sorted[Math.floor(sorted.length / 2)];
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const stdDev = Math.sqrt(values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length);
  
  return { mean, median, min, max, stdDev };
}

function formatStats(stats) {
  if (stats.mean < 1) {
    return `${(stats.mean * 1000).toFixed(2)}μs (min: ${(stats.min * 1000).toFixed(2)}μs, max: ${(stats.max * 1000).toFixed(2)}μs, std: ${(stats.stdDev * 1000).toFixed(2)}μs)`;
  }
  return `${stats.mean.toFixed(2)}ms (min: ${stats.min.toFixed(2)}ms, max: ${stats.max.toFixed(2)}ms, std: ${stats.stdDev.toFixed(2)}ms)`;
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

function runSingleBenchmark(testName, stateSize, iterations) {
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
  
  // Memory Usage
  const memUsage = store.getMemoryUsage();
  
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
  
  store.off('STATE_UPDATED', listener);
  
  return {
    creation: createResult.duration,
    singleUpdate: singleUpdateResult.duration,
    batchUpdate: batchUpdateResult.duration,
    propertyAccess: accessResult.duration,
    nestedAccess: nestedAccessResult.duration,
    eventSystem: eventResult.duration,
    memoryKB: memUsage.estimatedSizeKB,
    iterations: iterations,
    batchIterations: Math.min(iterations, 1000),
    eventIterations: Math.min(iterations, 100)
  };
}

function runBenchmark(testName, stateSize, iterations) {
  console.log(`\n📊 ${testName} (${stateSize} props, ${iterations.toLocaleString()} ops)`);
  console.log('-'.repeat(60));
  
  const results = [];
  
  // Run multiple iterations
  for (let run = 1; run <= NUM_RUNS; run++) {
    if (NUM_RUNS > 1) {
      process.stdout.write(`\r  Running iteration ${run}/${NUM_RUNS}...`);
    }
    results.push(runSingleBenchmark(testName, stateSize, iterations));
  }
  
  if (NUM_RUNS > 1) {
    console.log('\n');
  }
  
  // Calculate statistics
  const stats = {
    creation: calculateStats(results.map(r => r.creation)),
    singleUpdate: calculateStats(results.map(r => r.singleUpdate)),
    batchUpdate: calculateStats(results.map(r => r.batchUpdate)),
    propertyAccess: calculateStats(results.map(r => r.propertyAccess)),
    nestedAccess: calculateStats(results.map(r => r.nestedAccess)),
    eventSystem: calculateStats(results.map(r => r.eventSystem)),
    memoryKB: calculateStats(results.map(r => r.memoryKB))
  };
  
  // Display results
  console.log(`Store Creation: ${formatStats(stats.creation)}`);
  console.log(`Single Update: ${formatStats(stats.singleUpdate)}`);
  console.log(`Batch Updates (${results[0].batchIterations} ops): ${formatStats(stats.batchUpdate)}`);
  console.log(`Avg per update: ${formatTime(stats.batchUpdate.mean / results[0].batchIterations)}`);
  console.log(`Property Access (${iterations.toLocaleString()} ops): ${formatStats(stats.propertyAccess)}`);
  console.log(`Avg per access: ${formatTime(stats.propertyAccess.mean / iterations)}`);
  console.log(`Nested Access (${iterations.toLocaleString()} ops): ${formatStats(stats.nestedAccess)}`);
  console.log(`Avg per nested access: ${formatTime(stats.nestedAccess.mean / iterations)}`);
  console.log(`Memory Usage: ${stats.memoryKB.mean.toFixed(0)}KB (${results[0].iterations} states)`);
  console.log(`Event System (${results[0].eventIterations} events): ${formatStats(stats.eventSystem)}`);
  console.log(`Avg per event: ${formatTime(stats.eventSystem.mean / results[0].eventIterations)}`);
  
  // Performance validation
  console.log('\n🎯 Performance Validation (Averages Only):');
  const testSizeKey = stateSize === TEST_SIZES.small ? 'small' : 
                     stateSize === TEST_SIZES.medium ? 'medium' : 'large';
  const thresholds = PERFORMANCE_THRESHOLDS[testSizeKey];
  
  // Only check average (mean) values
  const avgUpdateTime = stats.batchUpdate.mean / results[0].batchIterations;
  const avgAccessTime = stats.propertyAccess.mean / iterations;
  const avgNestedAccessTime = stats.nestedAccess.mean / iterations;
  const avgEventTime = stats.eventSystem.mean / results[0].eventIterations;
  
  const validationResults = {
    creation: checkThreshold(stats.creation.mean, thresholds.creation, 'Store Creation (avg)', testSizeKey),
    singleUpdate: checkThreshold(stats.singleUpdate.mean, thresholds.singleUpdate, 'Single Update (avg)', testSizeKey),
    avgUpdate: checkThreshold(avgUpdateTime, thresholds.avgUpdate, 'Avg Update', testSizeKey),
    avgAccess: checkThreshold(avgAccessTime, thresholds.avgAccess, 'Avg Property Access', testSizeKey),
    avgNestedAccess: checkThreshold(avgNestedAccessTime, thresholds.avgNestedAccess, 'Avg Nested Access', testSizeKey),
    avgEvent: checkThreshold(avgEventTime, thresholds.avgEvent, 'Avg Event', testSizeKey),
    memory: checkThreshold(stats.memoryKB.mean, thresholds.memoryKB, 'Memory Usage (avg)', testSizeKey, true)
  };

  const allPassed = Object.values(validationResults).every(passed => passed);
  console.log(`\n${allPassed ? '🎉' : '💥'} Overall Performance (Averages): ${allPassed ? 'PASSED' : 'FAILED'}`);

  return {
    testName,
    stateSize,
    iterations,
    thresholds,
    validationResults,
    allPassed,
    stats,
    results
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
  console.log(`  Store Creation: ${formatTime(result.stats.creation.mean)}`);
  console.log(`  Single Update: ${formatTime(result.stats.singleUpdate.mean)}`);
  console.log(`  Avg Update: ${formatTime(result.stats.batchUpdate.mean / result.results[0].batchIterations)}`);
  console.log(`  Avg Property Access: ${formatTime(result.stats.propertyAccess.mean / result.iterations)}`);
  console.log(`  Memory Usage: ${result.stats.memoryKB.mean.toFixed(0)}KB`);
  
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
