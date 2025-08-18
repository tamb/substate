// Deep State Management Performance Benchmark
import { createStore } from '../dist/index.esm.js';

console.log('🏃‍♂️ Deep State Management Performance Benchmark');
console.log('===============================================\n');

// Test configurations
const ITERATIONS = {
  small: 500,     // Fewer iterations for deep cloning (more expensive)
  medium: 100,    // Much fewer for complex deep structures
  large: 50       // Very few for large deep structures
};

const TEST_CONFIGS = {
  shallow: { depth: 3, breadth: 10 },     // 3 levels, 10 props each (~1K nodes)
  medium: { depth: 4, breadth: 8 },       // 4 levels, 8 props each (~5K nodes)  
  deep: { depth: 5, breadth: 5 }          // 5 levels, 5 props each (~4K nodes)
};

// Performance thresholds (in milliseconds) - Strict standards accounting for deep operation complexity
// Memory thresholds account for 50-state history + tagged states + deep structure overhead
const PERFORMANCE_THRESHOLDS = {
  shallow: {
    creation: 25,          // Deep store creation with cloning overhead
    singleUpdate: 10,      // Single deep updates with cloning
    avgUpdate: 5,          // Average deep update should be reasonable
    avgDeepAccess: 1,      // Deep property access should be fast
    avgArrayAccess: 2,     // Array access with deep structures
    avgHistory: 20,        // State history operations
    avgCloning: 50,        // Deep cloning operations
    memoryKB: 12000        // ~10.5MB observed, allow 15% headroom for ~5K nodes * 50 states
  },
  medium: {
    creation: 50,          // More complex state creation
    singleUpdate: 25,      // Deep updates for medium complexity
    avgUpdate: 15,         // Average updates with more complexity
    avgDeepAccess: 3,      // Deep access time scales with complexity
    avgArrayAccess: 5,     // Array operations in complex structures
    avgHistory: 50,        // History operations with larger states
    avgCloning: 100,       // Deep cloning for medium structures
    memoryKB: 50000        // ~46MB observed, allow 10% headroom for ~22K nodes * 50 states
  },
  deep: {
    creation: 100,         // Very deep structures take longer to create
    singleUpdate: 50,      // Deep updates for very complex structures
    avgUpdate: 30,         // Updates with maximum complexity
    avgDeepAccess: 5,      // Access time for very deep structures
    avgArrayAccess: 10,    // Array operations in very deep structures
    avgHistory: 100,       // History with very complex states
    avgCloning: 200,       // Deep cloning for very complex structures
    memoryKB: 48000        // ~43MB observed, allow 11% headroom for ~21K nodes * 50 states
  }
};

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

function calculateStateComplexity(state, depth = 0) {
  let nodeCount = 0;
  let maxDepth = depth;
  
  if (typeof state === 'object' && state !== null && !Array.isArray(state)) {
    nodeCount++;
    for (const key in state) {
      const subResult = calculateStateComplexity(state[key], depth + 1);
      nodeCount += subResult.nodeCount;
      maxDepth = Math.max(maxDepth, subResult.maxDepth);
    }
  } else if (Array.isArray(state)) {
    nodeCount++;
    state.forEach(item => {
      const subResult = calculateStateComplexity(item, depth + 1);
      nodeCount += subResult.nodeCount;
      maxDepth = Math.max(maxDepth, subResult.maxDepth);
    });
  } else {
    nodeCount++;
  }
  
  return { nodeCount, maxDepth };
}

function runDeepBenchmark(testName, config, iterations) {
  console.log(`\n📊 ${testName} (depth: ${config.depth}, breadth: ${config.breadth}, ${iterations} ops)`);
  console.log('-'.repeat(70));
  
  const initialState = createDeepState(config.depth, config.breadth);
  const complexity = calculateStateComplexity(initialState);
  console.log(`State Complexity: ${complexity.nodeCount.toLocaleString()} nodes, max depth: ${complexity.maxDepth}`);
  
  // Store Creation
  const createResult = measureTime('Store Creation', () => {
    return createStore({
      name: `${testName}DeepStore`,
      state: initialState,
      defaultDeep: true // Deep cloning enabled
    });
  });
  
  const store = createResult.result;
  console.log(`Store Creation: ${formatTime(createResult.duration)}`);
  
  // Single Deep Update Performance
  const singleUpdateResult = measureTime('Single Deep Update', () => {
    store.updateState({ 
      'branch_0.branch_0.value': Math.random(),
      'branch_0.arrayData.0.data.value': Math.random()
    });
    return store.getCurrentState();
  });
  console.log(`Single Deep Update: ${formatTime(singleUpdateResult.duration)}`);
  
  // Batch Deep Updates Performance
  const batchUpdateResult = measureTime('Batch Deep Updates', () => {
    for (let i = 0; i < iterations; i++) {
      const branchIndex = i % config.breadth;
      store.updateState({ 
        [`branch_${branchIndex}.value`]: Math.random(),
        [`branch_${branchIndex}.timestamp`]: Date.now()
      });
    }
    return store.getCurrentState();
  });
  console.log(`Batch Deep Updates (${iterations} ops): ${formatTime(batchUpdateResult.duration)}`);
  console.log(`Avg per deep update: ${formatTime(batchUpdateResult.duration / iterations)}`);
  
  // Deep Property Access Performance
  const deepAccessResult = measureTime('Deep Property Access', () => {
    let sum = 0;
    for (let i = 0; i < iterations * 2; i++) {
      const branchIndex = i % config.breadth;
      const value = store.getProp(`branch_${branchIndex}.branch_0.value`);
      sum += value || 0;
    }
    return sum;
  });
  console.log(`Deep Property Access (${iterations * 2} ops): ${formatTime(deepAccessResult.duration)}`);
  console.log(`Avg per deep access: ${formatTime(deepAccessResult.duration / (iterations * 2))}`);
  
  // Array Access Performance
  const arrayAccessResult = measureTime('Array Access', () => {
    let sum = 0;
    for (let i = 0; i < iterations; i++) {
      const branchIndex = i % config.breadth;
      const arrayIndex = i % Math.min(config.breadth, 10);
      const value = store.getProp(`branch_${branchIndex}.arrayData.${arrayIndex}.index`);
      sum += value || 0;
    }
    return sum;
  });
  console.log(`Array Access (${iterations} ops): ${formatTime(arrayAccessResult.duration)}`);
  console.log(`Avg per array access: ${formatTime(arrayAccessResult.duration / iterations)}`);
  
  // Memory Usage and History
  const memUsage = store.getMemoryUsage();
  console.log(`Memory Usage: ${memUsage.estimatedSizeKB}KB (${memUsage.stateCount} states)`);
  
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
  console.log(`State History (${Math.min(iterations, 20)} ops): ${formatTime(historyResult.duration)}`);
  
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
  console.log(`Deep Cloning (${Math.min(iterations, 10)} ops): ${formatTime(cloneResult.duration)}`);
  console.log(`Avg per deep clone: ${formatTime(cloneResult.duration / Math.min(iterations, 10))}`);
  
  // Memory cleanup test
  const finalMemUsage = store.getMemoryUsage();
  console.log(`Final Memory Usage: ${finalMemUsage.estimatedSizeKB}KB (${finalMemUsage.stateCount} states, ${finalMemUsage.taggedCount} tagged)`);
  
  // Performance validation
  console.log('\n🎯 Performance Validation:');
  const testType = testName.includes('Shallow') ? 'shallow' : 
                  testName.includes('Medium') ? 'medium' : 'deep';
  const thresholds = PERFORMANCE_THRESHOLDS[testType];
  
  const validationResults = {
    creation: checkThreshold(createResult.duration, thresholds.creation, 'Store Creation', testType),
    singleUpdate: checkThreshold(singleUpdateResult.duration, thresholds.singleUpdate, 'Single Deep Update', testType),
    avgUpdate: checkThreshold(batchUpdateResult.duration / iterations, thresholds.avgUpdate, 'Avg Deep Update', testType),
    avgDeepAccess: checkThreshold(deepAccessResult.duration / (iterations * 2), thresholds.avgDeepAccess, 'Avg Deep Access', testType),
    avgArrayAccess: checkThreshold(arrayAccessResult.duration / iterations, thresholds.avgArrayAccess, 'Avg Array Access', testType),
    avgHistory: checkThreshold(historyResult.duration / Math.min(iterations, 20), thresholds.avgHistory, 'Avg History Operation', testType),
    avgCloning: checkThreshold(cloneResult.duration / Math.min(iterations, 10), thresholds.avgCloning, 'Avg Deep Clone', testType),
    memory: checkThreshold(finalMemUsage.estimatedSizeKB, thresholds.memoryKB, 'Memory Usage', testType, true)
  };

  const allPassed = Object.values(validationResults).every(passed => passed);
  console.log(`\n${allPassed ? '🎉' : '💥'} Overall Performance: ${allPassed ? 'PASSED' : 'FAILED'}`);

  return {
    testName,
    config,
    iterations,
    complexity,
    thresholds,
    validationResults,
    allPassed,
    results: {
      creation: createResult.duration,
      singleUpdate: singleUpdateResult.duration,
      batchUpdate: batchUpdateResult.duration,
      deepAccess: deepAccessResult.duration,
      arrayAccess: arrayAccessResult.duration,
      history: historyResult.duration,
      cloning: cloneResult.duration,
      memoryKB: finalMemUsage.estimatedSizeKB,
      stateCount: finalMemUsage.stateCount
    }
  };
}

// Run deep state benchmarks
console.log('Starting deep state management benchmarks...\n');

const results = [];

// Shallow deep structure (more breadth, less depth)
results.push(runDeepBenchmark('Shallow Deep', TEST_CONFIGS.shallow, ITERATIONS.small));

// Medium deep structure (balanced)
results.push(runDeepBenchmark('Medium Deep', TEST_CONFIGS.medium, ITERATIONS.medium));

// Very deep structure (more depth, less breadth)
results.push(runDeepBenchmark('Very Deep', TEST_CONFIGS.deep, ITERATIONS.large));

// Summary
console.log('\n🎯 DEEP STATE PERFORMANCE SUMMARY');
console.log('==================================');

let overallSuccess = true;
results.forEach(result => {
  const status = result.allPassed ? '✅' : '❌';
  console.log(`\n${status} ${result.testName} (${result.complexity.nodeCount.toLocaleString()} nodes) - ${result.allPassed ? 'PASSED' : 'FAILED'}:`);
  console.log(`  Store Creation: ${formatTime(result.results.creation)}`);
  console.log(`  Single Deep Update: ${formatTime(result.results.singleUpdate)}`);
  console.log(`  Avg Deep Update: ${formatTime(result.results.batchUpdate / result.iterations)}`);
  console.log(`  Avg Deep Access: ${formatTime(result.results.deepAccess / (result.iterations * 2))}`);
  console.log(`  Avg Deep Clone: ${formatTime(result.results.cloning / Math.min(result.iterations, 10))}`);
  console.log(`  Final Memory: ${result.results.memoryKB}KB`);
  
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
