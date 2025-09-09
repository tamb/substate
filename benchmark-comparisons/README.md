# Performance Comparison Benchmarks

This directory contains comprehensive performance benchmarks comparing Substate with other popular state management libraries.

## 🎯 Purpose

The benchmarks provide **scientifically accurate** performance comparisons between:
- **Substate** - Our lightweight state management library
- **Redux** - Industry standard state management
- **Zustand** - Modern lightweight alternative
- **Native JavaScript Objects** - Baseline performance

## 📊 What We Measure

### Core Metrics
- **Store Creation** - Time to initialize a new store/state
- **Single Update** - Time for individual state updates
- **Batch Updates** - Time for multiple updates in sequence
- **Property Access** - Time to read state properties
- **Memory Usage** - Estimated memory consumption

### Test Scenarios
- **Small State** (10 properties) - 100,000 operations
- **Medium State** (100 properties) - 10,000 operations
- **Large State** (1,000 properties) - 1,000 operations

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd performance-comparison
npm install
```

### 2. Run Individual Benchmarks
```bash
# Run Substate benchmarks
npm run benchmark:substate

# Run Redux benchmarks
npm run benchmark:redux

# Run Zustand benchmarks
npm run benchmark:zustand

# Run Native JavaScript benchmarks
npm run benchmark:native
```

### 3. Run All Benchmarks
```bash
npm run benchmark:all
```

### 4. Generate Comparison Report
```bash
npm run report
```

## 📈 Understanding Results

### Statistical Accuracy
Each benchmark runs **15 iterations** and provides:
- **Mean** (average performance)
- **Median** (middle value)
- **Min/Max** (range of variation)
- **Standard Deviation** (consistency measure)

### Performance Categories
- **Excellent**: < 1μs per operation
- **Good**: 1-10μs per operation
- **Acceptable**: 10-100μs per operation
- **Slow**: > 100μs per operation

## 🔬 Benchmark Methodology

### Fair Comparison
All libraries are tested with:
- **Identical test data** - Same state structure and size
- **Same operations** - Equivalent update and access patterns
- **Same environment** - Identical hardware and Node.js version
- **Statistical rigor** - Multiple runs with proper analysis

### Test Environment
- **Hardware**: 13th Gen Intel(R) Core(TM) i7-13650HX (14 cores)
- **RAM**: 16 GB
- **OS**: Windows 10 Home
- **Node.js**: v18+

## 📋 Benchmark Details

### Substate (`benchmark-substate.mjs`)
- Tests `createStore()` with shallow cloning
- Measures `updateState()` performance
- Tests `getProp()` property access
- Includes built-in memory tracking

### Redux (`benchmark-redux.mjs`)
- Tests `createStore()` with custom reducer
- Measures `dispatch()` performance
- Tests `getState()` property access
- Estimates memory usage

### Zustand (`benchmark-zustand.mjs`)
- Tests `create()` store creation
- Measures `set()` update performance
- Tests `getState()` property access
- Estimates memory usage

### Native JavaScript (`benchmark-native.mjs`)
- Tests direct object spread operations
- Measures immutable update patterns
- Tests direct property access
- Single state memory usage

## 🎯 Key Insights

### Performance Characteristics
- **Native JavaScript**: Fastest raw performance, no overhead
- **Substate**: Optimized for reactive state with minimal overhead
- **Zustand**: Good balance of features and performance
- **Redux**: More overhead due to action/reducer pattern

### Use Case Recommendations
- **High-frequency updates**: Consider Native JS or Substate
- **Complex state logic**: Redux provides predictable patterns
- **Simple state management**: Zustand offers good balance
- **Reactive features needed**: Substate provides built-in Pub/Sub

## 🔧 Customization

### Adjusting Test Parameters
Edit `benchmark-utils.mjs` to modify:
- Test state sizes
- Number of iterations
- Number of benchmark runs

### Adding New Libraries
1. Create new benchmark file (e.g., `benchmark-newlib.mjs`)
2. Implement the same interface as other benchmarks
3. Add to `package.json` scripts
4. Update report generator

## 📊 Interpreting Results

### What Matters Most
- **Relative performance** between libraries
- **Consistency** (low standard deviation)
- **Scalability** across different state sizes
- **Memory efficiency** for your use case

### What Doesn't Matter
- **Absolute numbers** (hardware dependent)
- **Micro-optimizations** (unless you have specific bottlenecks)
- **Single-run results** (always use averages)

## 🤝 Contributing

### Adding New Benchmarks
1. Follow the existing pattern in benchmark files
2. Use the shared utilities from `benchmark-utils.mjs`
3. Test with multiple state sizes
4. Document any special considerations

### Improving Accuracy
- Run benchmarks on consistent hardware
- Close unnecessary applications during testing
- Use the same Node.js version
- Consider CI environment differences

## 📄 License

This benchmarking suite is part of the Substate project and follows the same MIT license.
