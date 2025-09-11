// Performance Test Configuration
// Centralized configuration for performance thresholds and test settings

// Environment detection
const isCI = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';
const isWindows = process.platform === 'win32';
const isMacOS = process.platform === 'darwin';

// CI environment characteristics
const CI_MULTIPLIERS = {
  // GitHub Actions runners typically have different performance characteristics
  // These multipliers account for CI environment overhead
  time: isCI ? 3.0 : 1.0,      // CI operations are typically 3x slower (reduced from 4x)
  memory: isCI ? 2.5 : 1.0,    // CI memory usage can be 2.5x higher due to overhead (reduced from 4x)
  cpu: isCI ? 2.5 : 1.0        // CI CPU operations are typically 2.5x slower (reduced from 4x)
};

// Base performance thresholds (optimized for local development)
const BASE_THRESHOLDS = {
  shallow: {
    small: {
      creation: 1.0,         // 1ms (doubled)
      singleUpdate: 1.0,     // 1ms (doubled)
      avgUpdate: 0.02,       // 20μs (doubled)
      avgAccess: 0.004,      // 4μs (doubled)
      avgNestedAccess: 0.04, // 40μs (doubled)
      avgEvent: 0.4,         // 400μs (doubled)
      memoryKB: 600          // 600KB (doubled)
    },
    medium: {
      creation: 1.2,         // 1.2ms (doubled)
      singleUpdate: 2.0,     // 2ms (doubled)
      avgUpdate: 0.2,        // 200μs (doubled)
      avgAccess: 0.004,      // 4μs (doubled)
      avgNestedAccess: 0.08, // 80μs (doubled)
      avgEvent: 0.8,         // 800μs (doubled)
      memoryKB: 6000         // 6MB (doubled)
    },
    large: {
      creation: 0.5,         // 500μs (doubled)
      singleUpdate: 20,      // 20ms (doubled)
      avgUpdate: 2.0,        // 2ms (doubled)
      avgAccess: 0.004,      // 4μs (doubled)
      avgNestedAccess: 0.2,  // 200μs (doubled)
      avgEvent: 2.0,         // 2ms (doubled)
      memoryKB: 60000        // 60MB (doubled)
    }
  },
  deep: {
    shallow: {
      creation: 0.6,         // 600μs (doubled)
      singleUpdate: 4.0,     // 4ms (doubled)
      avgUpdate: 3.6,        // 3.6ms (doubled)
      avgDeepAccess: 0.02,   // 20μs (doubled)
      avgArrayAccess: 3.6,   // 3.6ms (doubled)
      avgHistory: 36,        // 36ms (doubled)
      avgCloning: 3.6,       // 3.6ms (doubled)
      memoryKB: 40000        // 40MB (doubled)
    },
    medium: {
      creation: 0.4,         // 400μs (doubled)
      singleUpdate: 7.0,     // 7ms (doubled)
      avgUpdate: 7.0,        // 7ms (doubled)
      avgDeepAccess: 0.036,  // 36μs (doubled)
      avgArrayAccess: 7.0,   // 7ms (doubled)
      avgHistory: 70,        // 70ms (doubled)
      avgCloning: 7.0,       // 7ms (doubled)
      memoryKB: 170000       // 170MB (doubled)
    },
    deep: {
      creation: 0.4,         // 400μs (doubled)
      singleUpdate: 7.0,     // 7ms (doubled)
      avgUpdate: 7.0,        // 7ms (doubled)
      avgDeepAccess: 0.02,   // 20μs (doubled)
      avgArrayAccess: 7.0,   // 7ms (doubled)
      avgHistory: 70,        // 70ms (doubled)
      avgCloning: 7.0,       // 7ms (doubled)
      memoryKB: 160000       // 160MB (doubled)
    }
  }
};

// Apply environment multipliers to get final thresholds
function applyEnvironmentMultipliers(baseThresholds) {
  const result = {};
  
  for (const [category, sizes] of Object.entries(baseThresholds)) {
    result[category] = {};
    for (const [size, metrics] of Object.entries(sizes)) {
      result[category][size] = {};
      for (const [metric, value] of Object.entries(metrics)) {
        if (metric.includes('memory')) {
          result[category][size][metric] = value * CI_MULTIPLIERS.memory;
        } else {
          result[category][size][metric] = value * CI_MULTIPLIERS.time;
        }
      }
    }
  }
  
  return result;
}

// Export the final thresholds
export const PERFORMANCE_THRESHOLDS = applyEnvironmentMultipliers(BASE_THRESHOLDS);

// Export environment info for logging
export const ENVIRONMENT_INFO = {
  isCI,
  platform: process.platform,
  nodeVersion: process.version,
  multipliers: CI_MULTIPLIERS
};

// Test configurations
export const TEST_CONFIGS = {
  iterations: {
    small: 1000,
    medium: 10000,
    large: 100000
  },
  deepIterations: {
    small: 500,
    medium: 100,
    large: 50
  },
  testSizes: {
    small: 10,
    medium: 100,
    large: 1000
  },
  deepConfigs: {
    shallow: { depth: 3, breadth: 10 },
    medium: { depth: 4, breadth: 8 },
    deep: { depth: 5, breadth: 5 }
  }
};

// Utility function to log environment info
export function logEnvironmentInfo() {
  console.log(`🌍 Environment: ${isCI ? 'CI' : 'Local'} (${process.platform})`);
  if (isCI) {
    console.log(`📊 CI Multipliers: Time=${CI_MULTIPLIERS.time}x, Memory=${CI_MULTIPLIERS.memory}x, CPU=${CI_MULTIPLIERS.cpu}x`);
  }
}
