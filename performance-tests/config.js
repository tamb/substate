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
      creation: 0.15,        // 150μs
      singleUpdate: 0.2,     // 200μs
      avgUpdate: 0.005,      // 5μs
      avgAccess: 0.001,      // 1μs
      avgNestedAccess: 0.01, // 10μs
      avgEvent: 0.1,         // 100μs
      memoryKB: 150          // 150KB
    },
    medium: {
      creation: 0.3,         // 300μs (adjusted based on observed 260μs)
      singleUpdate: 0.5,     // 500μs (adjusted based on observed 432μs)
      avgUpdate: 0.05,       // 50μs
      avgAccess: 0.001,      // 1μs
      avgNestedAccess: 0.02, // 20μs
      avgEvent: 0.2,         // 200μs
      memoryKB: 1500         // 1.5MB
    },
    large: {
      creation: 0.1,         // 100μs
      singleUpdate: 5,       // 5ms
      avgUpdate: 0.5,        // 500μs
      avgAccess: 0.001,      // 1μs
      avgNestedAccess: 0.05, // 50μs
      avgEvent: 0.5,         // 500μs
      memoryKB: 15000        // 15MB
    }
  },
  deep: {
    shallow: {
      creation: 0.16,        // 160μs
      singleUpdate: 1.15,    // 1.15ms
      avgUpdate: 1,          // 1ms
      avgDeepAccess: 0.005,  // 5μs
      avgArrayAccess: 1,     // 1ms
      avgHistory: 10,        // 10ms
      avgCloning: 1,         // 1ms
      memoryKB: 12000        // 12MB
    },
    medium: {
      creation: 0.1,         // 100μs
      singleUpdate: 2,       // 2ms
      avgUpdate: 2,          // 2ms
      avgDeepAccess: 0.01,   // 10μs
      avgArrayAccess: 2,     // 2ms
      avgHistory: 20,        // 20ms
      avgCloning: 2,         // 2ms
      memoryKB: 50000        // 50MB
    },
    deep: {
      creation: 0.1,         // 100μs
      singleUpdate: 2,       // 2ms
      avgUpdate: 2,          // 2ms
      avgDeepAccess: 0.005,  // 5μs
      avgArrayAccess: 2,     // 2ms
      avgHistory: 20,        // 20ms
      avgCloning: 2,         // 2ms
      memoryKB: 48000        // 48MB
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
