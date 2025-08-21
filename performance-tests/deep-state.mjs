// Deep State Management Performance Benchmark
// 
// Hardware Specifications:
// - Processor: 13th Gen Intel(R) Core(TM) i7-13650HX (14 cores)
// - RAM: 16 GB
// - OS: Windows 10 Home (Version 2009)
// - Node.js: v18+
//
import { createStore } from '../dist/index.esm.js';
import { PERFORMANCE_THRESHOLDS, TEST_CONFIGS, logEnvironmentInfo } from './config.js';

console.log('🏃‍♂️ Deep State Management Performance Benchmark');
console.log('===============================================\n');

// Parse command line arguments
const args = process.argv.slice(2);
const runsArg = args.find(arg => arg.startsWith('--runs='));
const NUM_RUNS = runsArg ? parseInt(runsArg.split('=')[1]) : 1;

if (NUM_RUNS > 1) {
  console.log(`🔄 Running ${NUM_RUNS} iterations for statistical accuracy...\n`);
}

// Log environment information
logEnvironmentInfo();

// Test configurations
const ITERATIONS = TEST_CONFIGS.deepIterations;
const TEST_CONFIGS_DEEP = TEST_CONFIGS.deepConfigs;

// Performance thresholds from centralized config
const THRESHOLDS = PERFORMANCE_THRESHOLDS.deep;

// Utility functions
function createDeepState(depth, breadth, currentDepth = 0) {
  if (currentDepth >= depth) {
    return {
      value: Math.random(),
      timestamp: Date.now(),
      id: `leaf_${currentDepth}_${Math.random().toString(36).substr(2, 9)}`
    };
  }
  
  const state = {};
  for (let i = 0; i < breadth; i++) {
    state[`branch_${i}`] = createDeepState(depth, breadth, currentDepth + 1);
  }
  
  // Add some array structures for complexity
  if (currentDepth < depth - 1) {
    state.arrayData = Array.from({ length: Math.min(breadth, 10) }, (_, i) => ({
      index: i,
      data: createDeepState(depth, Math.ceil(breadth / 2), currentDepth + 2)
    }));
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

function checkThreshold(actual, threshold, metric, testType, isMemory = false) {
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

function calculateComplexity(depth, breadth) {
  let nodeCount = 0;
  let maxDepth = 0;
  
  function countNodes(currentDepth = 0) {
    if (currentDepth >= depth) {
      nodeCount++;
      maxDepth = Math.max(maxDepth, currentDepth);
      return;
    }
    
    for (let i = 0; i < breadth; i++) {
      countNodes(currentDepth + 1);
    }
    
    // Add array nodes
    if (currentDepth < depth - 1) {
      const arrayLength = Math.min(breadth, 10);
      for (let i = 0; i < arrayLength; i++) {
        countNodes(currentDepth + 2);
      }
    }
  }
  
  countNodes();
  return { nodeCount, maxDepth };
}

function runSingleDeepBenchmark(testName, config, iterations) {
  const { depth, breadth } = config;
  const complexity = calculateComplexity(depth, breadth);
  
  // Create deep state
  const initialState = createDeepState(depth, breadth);
  
  // Store Creation
  const createResult = measureTime('Store Creation', () => {
    return createStore({
      name: `${testName}Store`,
      state: initialState,
      defaultDeep: true // Deep cloning for complex state
    });
  });
  
  const store = createResult.result;
  
  // Single Deep Update Performance
  const singleUpdateResult = measureTime('Single Deep Update', () => {
    store.updateState({ 
      [`branch_0.deepUpdate`]: { timestamp: Date.now(), value: Math.random() }
    });
    return store.getCurrentState();
  });
  
  // Batch Deep Updates Performance
  const batchUpdateResult = measureTime('Batch Deep Updates', () => {
    for (let i = 0; i < iterations; i++) {
      const branchKey = `branch_${i % breadth}`;
      const currentValue = store.getProp(`${branchKey}.value`);
      store.updateState({ 
        [`${branchKey}.value`]: (currentValue || 0) + 1,
        [`${branchKey}.updated`]: true
      });
    }
    return store.getCurrentState();
  });
  
  // Deep Property Access Performance
  const deepAccessResult = measureTime('Deep Property Access', () => {
    let sum = 0;
    for (let i = 0; i < iterations * 2; i++) {
      const branchKey = `branch_${i % breadth}`;
      const value = store.getProp(`${branchKey}.value`);
      const timestamp = store.getProp(`${branchKey}.timestamp`);
      sum += (value || 0) + (timestamp || 0);
    }
    return sum;
  });
  
  // Array Access Performance
  const arrayAccessResult = measureTime('Array Access', () => {
    let sum = 0;
    for (let i = 0; i < iterations; i++) {
      const arrayData = store.getProp(`branch_${i % breadth}.arrayData`);
      if (arrayData && Array.isArray(arrayData)) {
        sum += arrayData.reduce((acc, item) => acc + (item?.index || 0), 0);
      }
    }
    return sum;
  });
  
  // Memory Usage and History
  const memUsage = store.getMemoryUsage();
  
  // State History Performance with Deep Cloning
  const historyResult = measureTime('State History', () => {
    // Create several states to test history
    for (let i = 0; i < Math.min(iterations, 20); i++) {
      store.updateState({ 
        [`branch_0.historyTest`]: i,
        $tag: `history_${i}`
      });
    }
    
    // Access different states
    let sum = 0;
    for (let i = 0; i < Math.min(iterations, 20); i++) {
      const taggedState = store.getTaggedState(`history_${i}`);
      sum += taggedState?.branch_0?.historyTest || 0;
    }
    return sum;
  });
  
  // Deep State Cloning Performance (explicit test)
  const cloneResult = measureTime('Deep State Cloning', () => {
    for (let i = 0; i < Math.min(iterations, 10); i++) {
      // Force deep clone by updating with $deep: true
      store.updateState({ 
        [`cloneTest_${i}`]: { deep: { nested: { value: i } } },
        $deep: true 
      });
    }
    return store.getCurrentState();
  });
  
  // Memory cleanup test
  const finalMemUsage = store.getMemoryUsage();
  
  return {
    creation: createResult.duration,
    singleUpdate: singleUpdateResult.duration,
    batchUpdate: batchUpdateResult.duration,
    deepAccess: deepAccessResult.duration,
    arrayAccess: arrayAccessResult.duration,
    history: historyResult.duration,
    cloning: cloneResult.duration,
    memoryKB: finalMemUsage.estimatedSizeKB,
    stateCount: finalMemUsage.stateCount,
    iterations: iterations,
    historyIterations: Math.min(iterations, 20),
    cloneIterations: Math.min(iterations, 10),
    deepAccessIterations: iterations * 2
  };
}

function runDeepBenchmark(testName, config, iterations) {
  const { depth, breadth } = config;
  const complexity = calculateComplexity(depth, breadth);
  
  console.log(`\n📊 ${testName} (depth: ${depth}, breadth: ${breadth}, ${iterations} ops)`);
  console.log('-'.repeat(70));
  console.log(`State Complexity: ${complexity.nodeCount.toLocaleString()} nodes, max depth: ${complexity.maxDepth}`);
  
  const results = [];
  
  // Run multiple iterations
  for (let run = 1; run <= NUM_RUNS; run++) {
    if (NUM_RUNS > 1) {
      process.stdout.write(`\r  Running iteration ${run}/${NUM_RUNS}...`);
    }
    results.push(runSingleDeepBenchmark(testName, config, iterations));
  }
  
  if (NUM_RUNS > 1) {
    console.log('\n');
  }
  
  // Calculate statistics
  const stats = {
    creation: calculateStats(results.map(r => r.creation)),
    singleUpdate: calculateStats(results.map(r => r.singleUpdate)),
    batchUpdate: calculateStats(results.map(r => r.batchUpdate)),
    deepAccess: calculateStats(results.map(r => r.deepAccess)),
    arrayAccess: calculateStats(results.map(r => r.arrayAccess)),
    history: calculateStats(results.map(r => r.history)),
    cloning: calculateStats(results.map(r => r.cloning)),
    memoryKB: calculateStats(results.map(r => r.memoryKB))
  };
  
  // Display results
  console.log(`Store Creation: ${formatStats(stats.creation)}`);
  console.log(`Single Deep Update: ${formatStats(stats.singleUpdate)}`);
  console.log(`Batch Deep Updates (${iterations} ops): ${formatStats(stats.batchUpdate)}`);
  console.log(`Avg per deep update: ${formatTime(stats.batchUpdate.mean / iterations)}`);
  console.log(`Deep Property Access (${results[0].deepAccessIterations} ops): ${formatStats(stats.deepAccess)}`);
  console.log(`Avg per deep access: ${formatTime(stats.deepAccess.mean / results[0].deepAccessIterations)}`);
  console.log(`Array Access (${iterations} ops): ${formatStats(stats.arrayAccess)}`);
  console.log(`Avg per array access: ${formatTime(stats.arrayAccess.mean / iterations)}`);
  console.log(`Memory Usage: ${stats.memoryKB.mean.toFixed(0)}KB (${results[0].stateCount} states)`);
  console.log(`State History (${results[0].historyIterations} ops): ${formatStats(stats.history)}`);
  console.log(`Deep Cloning (${results[0].cloneIterations} ops): ${formatStats(stats.cloning)}`);
  console.log(`Avg per deep clone: ${formatTime(stats.cloning.mean / results[0].cloneIterations)}`);
  console.log(`Final Memory Usage: ${stats.memoryKB.mean.toFixed(0)}KB (${results[0].stateCount} states, ${results[0].historyIterations} tagged)`);
  
  // Performance validation
  console.log('\n🎯 Performance Validation (Averages Only):');
  const testType = testName.includes('Shallow') ? 'shallow' : 
                  testName.includes('Medium') ? 'medium' : 'deep';
  const thresholds = THRESHOLDS[testType];
  
  // Only check average (mean) values
  const avgUpdateTime = stats.batchUpdate.mean / iterations;
  const avgDeepAccessTime = stats.deepAccess.mean / results[0].deepAccessIterations;
  const avgArrayAccessTime = stats.arrayAccess.mean / iterations;
  const avgHistoryTime = stats.history.mean / results[0].historyIterations;
  const avgCloningTime = stats.cloning.mean / results[0].cloneIterations;
  
  const validationResults = {
    creation: checkThreshold(stats.creation.mean, thresholds.creation, 'Store Creation (avg)', testType),
    singleUpdate: checkThreshold(stats.singleUpdate.mean, thresholds.singleUpdate, 'Single Deep Update (avg)', testType),
    avgUpdate: checkThreshold(avgUpdateTime, thresholds.avgUpdate, 'Avg Deep Update', testType),
    avgDeepAccess: checkThreshold(avgDeepAccessTime, thresholds.avgDeepAccess, 'Avg Deep Access', testType),
    avgArrayAccess: checkThreshold(avgArrayAccessTime, thresholds.avgArrayAccess, 'Avg Array Access', testType),
    avgHistory: checkThreshold(avgHistoryTime, thresholds.avgHistory, 'Avg History Operation', testType),
    avgCloning: checkThreshold(avgCloningTime, thresholds.avgCloning, 'Avg Deep Clone', testType),
    memory: checkThreshold(stats.memoryKB.mean, thresholds.memoryKB, 'Memory Usage (avg)', testType, true)
  };

  const allPassed = Object.values(validationResults).every(passed => passed);
  console.log(`\n${allPassed ? '🎉' : '💥'} Overall Performance (Averages): ${allPassed ? 'PASSED' : 'FAILED'}`);

  return {
    testName,
    config,
    iterations,
    complexity,
    thresholds,
    validationResults,
    allPassed,
    stats,
    results
  };
}

// Run deep state benchmarks
console.log('Starting deep state management benchmarks...\n');

const results = [];

// Shallow deep structure (more breadth, less depth)
results.push(runDeepBenchmark('Shallow Deep', TEST_CONFIGS_DEEP.shallow, ITERATIONS.small));

// Medium deep structure (balanced)
results.push(runDeepBenchmark('Medium Deep', TEST_CONFIGS_DEEP.medium, ITERATIONS.medium));

// Very deep structure (more depth, less breadth)
results.push(runDeepBenchmark('Very Deep', TEST_CONFIGS_DEEP.deep, ITERATIONS.large));

// Summary
console.log('\n🎯 DEEP STATE PERFORMANCE SUMMARY');
console.log('==================================');

let overallSuccess = true;
results.forEach(result => {
  const status = result.allPassed ? '✅' : '❌';
  console.log(`\n${status} ${result.testName} (${result.complexity.nodeCount.toLocaleString()} nodes) - ${result.allPassed ? 'PASSED' : 'FAILED'}:`);
  console.log(`  Store Creation: ${formatTime(result.stats.creation.mean)}`);
  console.log(`  Single Deep Update: ${formatTime(result.stats.singleUpdate.mean)}`);
  console.log(`  Avg Deep Update: ${formatTime(result.stats.batchUpdate.mean / result.iterations)}`);
  console.log(`  Avg Deep Access: ${formatTime(result.stats.deepAccess.mean / result.results[0].deepAccessIterations)}`);
  console.log(`  Avg Deep Clone: ${formatTime(result.stats.cloning.mean / result.results[0].cloneIterations)}`);
  console.log(`  Final Memory: ${result.stats.memoryKB.mean.toFixed(0)}KB`);
  
  if (!result.allPassed) {
    overallSuccess = false;
    console.log(`  💡 Failed metrics: ${Object.entries(result.validationResults)
      .filter(([_, passed]) => !passed)
      .map(([metric]) => metric)
      .join(', ')}`);
  }
});

// Performance comparison
console.log('\n📈 DEEP VS SHALLOW COMPARISON INSIGHTS');
console.log('======================================');
console.log('• Deep cloning is ~10-100x slower than shallow operations');
console.log('• Memory usage scales with state complexity and history size');
console.log('• Nested property access has minimal overhead with dot notation');
console.log('• Tagged states provide efficient checkpoints for complex states');
console.log('• Automatic memory management prevents unbounded growth');

console.log('\n' + '='.repeat(50));
if (overallSuccess) {
  console.log('🎉 ALL DEEP STATE PERFORMANCE TESTS PASSED!');
  console.log('✅ Substate meets high performance standards for deep operations');
  process.exit(0);
} else {
  console.log('💥 SOME DEEP STATE PERFORMANCE TESTS FAILED!');
  console.log('❌ Performance optimization needed to meet deep operation standards');
  console.log('💡 Consider optimizing failing operations or adjusting thresholds if justified');
  process.exit(1);
}
