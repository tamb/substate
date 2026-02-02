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
  time: isCI ? 4.0 : 1.0,      // CI operations are typically 3x slower
  memory: isCI ? 4.0 : 1.0,    // CI memory usage can be 2x higher due to overhead
  cpu: isCI ? 4.0 : 1.0        // CI CPU operations are typically 2.5x slower
};

// Base performance thresholds (optimized for local development)
const BASE_THRESHOLDS = {
  shallow: {
    small: {
      creation: 1,           // 1ms
      singleUpdate: 1,      // 1ms
      avgUpdate: 0.02,      // 20μs
      avgAccess: 0.002,     // 2μs
      avgNestedAccess: 0.05, // 50μs
      avgEvent: 0.2,        // 200μs
      memoryKB: 200         // 200KB
    },
    medium: {
      creation: 0.5,        // 500μs
      singleUpdate: 1,      // 1ms
      avgUpdate: 0.1,       // 100μs
      avgAccess: 0.002,     // 2μs
      avgNestedAccess: 0.05, // 50μs
      avgEvent: 0.4,        // 400μs
      memoryKB: 2000        // 2MB
    },
    large: {
      creation: 0.2,        // 200μs
      singleUpdate: 50,     // 50ms
      avgUpdate: 1,         // 1ms
      avgAccess: 0.02,      // 20μs
      avgNestedAccess: 0.1, // 100μs
      avgEvent: 1,          // 1ms
      memoryKB: 20000       // 20MB
    }
  },
  deep: {
    shallow: {
      creation: 0.5,        // 500μs
      singleUpdate: 4,     // 4ms
      avgUpdate: 3,        // 3ms
      avgDeepAccess: 0.02, // 20μs
      avgArrayAccess: 2.5, // 2.5ms
      avgHistory: 25,      // 25ms
      avgCloning: 3,       // 3ms
      memoryKB: 20000      // 20MB
    },
    medium: {
      creation: 0.3,       // 300μs
      singleUpdate: 5,     // 5ms
      avgUpdate: 5,       // 5ms
      avgDeepAccess: 0.02, // 20μs
      avgArrayAccess: 4,   // 4ms
      avgHistory: 40,      // 40ms
      avgCloning: 5,       // 5ms
      memoryKB: 60000      // 60MB
    },
    deep: {
      creation: 0.3,       // 300μs
      singleUpdate: 5,     // 5ms
      avgUpdate: 5,       // 5ms
      avgDeepAccess: 0.02, // 20μs
      avgArrayAccess: 5,   // 5ms
      avgHistory: 50,      // 50ms
      avgCloning: 5,       // 5ms
      memoryKB: 60000      // 60MB
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
