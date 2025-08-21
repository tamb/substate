# Performance Testing Strategy

This directory contains performance benchmarks for Substate to ensure high performance standards are maintained across different environments.

## 🎯 Strategy Overview

### Environment-Aware Thresholds

The performance tests use **environment-aware thresholds** to handle the differences between local development and CI environments:

- **Local Development**: Tight thresholds to catch real performance regressions
- **CI Environments**: Relaxed thresholds that account for CI hardware differences

### Why This Approach?

1. **CI Performance Variability**: GitHub Actions runners have different performance characteristics than development machines
2. **Local Development**: Developers need tight thresholds to catch real regressions during development
3. **Maintainability**: Centralized configuration makes it easy to adjust thresholds
4. **Future-Proof**: Easy to add new environments or adjust multipliers

## 📊 Threshold Configuration

### Base Thresholds (Local Development)

The base thresholds are optimized for high-performance development machines:

```javascript
// Shallow State - Small (10 properties)
creation: 0.15ms        // 150μs
singleUpdate: 0.2ms     // 200μs
avgUpdate: 0.005ms      // 5μs
avgAccess: 0.001ms      // 1μs
memoryKB: 150           // 150KB

// Deep State - Medium (4 levels, 8 props each)
creation: 0.1ms         // 100μs
singleUpdate: 2ms       // 2ms
avgUpdate: 2ms          // 2ms
avgDeepAccess: 0.01ms   // 10μs
memoryKB: 50000         // 50MB
```

### CI Multipliers

CI environments use multipliers to account for performance differences:

```javascript
CI_MULTIPLIERS = {
  time: 3.0,      // CI operations are typically 3x slower
  memory: 2.0,    // CI memory usage can be 2x higher
  cpu: 2.5        // CI CPU operations are typically 2.5x slower
}
```

### Final CI Thresholds

```javascript
// Shallow State - Small (CI)
creation: 0.45ms        // 150μs * 3.0
singleUpdate: 0.6ms     // 200μs * 3.0
avgUpdate: 0.015ms      // 5μs * 3.0
avgAccess: 0.003ms      // 1μs * 3.0
memoryKB: 300           // 150KB * 2.0

// Deep State - Medium (CI)
creation: 0.3ms         // 100μs * 3.0
singleUpdate: 6ms       // 2ms * 3.0
avgUpdate: 6ms          // 2ms * 3.0
avgDeepAccess: 0.03ms   // 10μs * 3.0
memoryKB: 100000        // 50MB * 2.0
```

## 🚀 Running Performance Tests

### Local Development

```bash
# Single run (fast)
npm run test:performance

# Multiple runs for statistical accuracy
npm run test:performance:avg

# Individual tests
npm run test:perf:shallow
npm run test:perf:deep
```

### CI Environment

Performance tests run automatically in CI with relaxed thresholds:

```bash
# CI automatically detects environment and applies multipliers
npm run test:performance
```

## 📈 Test Categories

### Shallow State Tests

Tests for shallow cloning performance with different state sizes:

- **Small**: 10 properties, 1000 operations
- **Medium**: 100 properties, 10,000 operations  
- **Large**: 1000 properties, 100,000 operations

### Deep State Tests

Tests for deep cloning performance with different complexity:

- **Shallow Deep**: 3 levels, 10 props each (~1K nodes)
- **Medium Deep**: 4 levels, 8 props each (~5K nodes)
- **Very Deep**: 5 levels, 5 props each (~4K nodes)

## 🔧 Configuration

### Environment Detection

The system automatically detects the environment:

```javascript
const isCI = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';
```

### Adjusting Thresholds

To adjust thresholds, modify `performance-tests/config.js`:

```javascript
// Adjust base thresholds for local development
const BASE_THRESHOLDS = {
  shallow: {
    small: {
      creation: 0.15,  // Adjust this value
      // ... other metrics
    }
  }
};

// Adjust CI multipliers
const CI_MULTIPLIERS = {
  time: 3.0,      // Adjust for CI performance
  memory: 2.0,    // Adjust for CI memory usage
  cpu: 2.5        // Adjust for CI CPU performance
};
```

## 📊 Performance Metrics

### Time Metrics

- **Store Creation**: Time to create a new store instance
- **Single Update**: Time for a single state update
- **Average Update**: Average time per update in batch operations
- **Property Access**: Time to access a single property
- **Nested Access**: Time to access deeply nested properties
- **Event System**: Time for event firing and handling

### Memory Metrics

- **Memory Usage**: Estimated memory usage in KB
- **State Count**: Number of states in history
- **Memory Growth**: Memory usage over time

## 🎯 Success Criteria

### Local Development

- All metrics must pass tight thresholds
- Performance regressions are caught immediately
- Development workflow remains fast

### CI Environment

- All metrics must pass relaxed thresholds
- Tests complete within reasonable time
- No false failures due to environment differences

## 🔍 Troubleshooting

### CI Failures

If CI tests are failing:

1. **Check Environment**: Verify CI environment detection is working
2. **Adjust Multipliers**: Increase CI multipliers if needed
3. **Review Hardware**: Check if CI runner specifications have changed
4. **Performance Regression**: Verify if it's a real regression vs environment issue

### Local Failures

If local tests are failing:

1. **Check Hardware**: Ensure your machine meets performance expectations
2. **Background Processes**: Close unnecessary applications
3. **Node.js Version**: Ensure you're using the expected Node.js version
4. **Real Regression**: This might indicate a real performance regression

## 📝 Best Practices

1. **Run Locally First**: Always test performance locally before pushing
2. **Use Multiple Runs**: Use `--runs=5` for statistical accuracy
3. **Monitor Trends**: Watch for gradual performance degradation
4. **Document Changes**: Document any threshold adjustments
5. **Environment Consistency**: Keep local and CI environments as similar as possible

## 🔗 Related Files

- `config.js` - Centralized configuration
- `shallow-state.mjs` - Shallow state performance tests
- `deep-state.mjs` - Deep state performance tests
- `package.json` - Test scripts and dependencies
