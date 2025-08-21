# Performance Comparison Results

**🖥️ Test Environment**: win32, Node.js v22.18.0
**📊 Method**: Averaged over 5 runs for statistical accuracy
**📅 Generated**: 8/20/2025, 10:28:36 PM

## 🎯 Property Access Performance (Average per access)

| Library | Small State | Medium State | Large State |
|---------|-------------|--------------|-------------|
| native | 51.09ns | 58.99ns | 143.28ns |
| redux | **49.19ns** | **57.10ns** | **135.05ns** |
| substate | 56.39ns | 66.17ns | 179.41ns |
| zustand | 49.71ns | 64.81ns | 145.93ns |

## 🔄 Update Performance (Average per update)

| Library | Small State | Medium State | Large State |
|---------|-------------|--------------|-------------|
| native | **121.49ns** | **133.29ns** | 742.33ns |
| redux | 153.69ns | 144.71ns | **671.49ns** |
| substate | 636.45ns | 26.34μs | 228.04μs |
| zustand | 131.99ns | 189.55ns | 892.53ns |

## 🏗️ Store Creation Performance

| Library | Small State | Medium State | Large State |
|---------|-------------|--------------|-------------|
| native | **3.17μs** | 10.87μs | 516.13μs |
| redux | 16.05μs | **5.77μs** | **1.92μs** |
| substate | 21.28μs | 7.89μs | 8.00μs |
| zustand | 31.95μs | 17.00μs | 635.14μs |

## 🧠 Memory Usage (Estimated)

| Library | Small State | Medium State | Large State |
|---------|-------------|--------------|-------------|
| native | **1KB** | **12KB** | **128KB** |
| redux | 61KB | 623KB | 6413KB |
| substate | 126KB | 1255KB | 12801KB |
| zustand | 61KB | 623KB | 6414KB |

## 📈 Key Performance Insights

- **Fastest Property Access**: redux (49.19ns)
- **Fastest Updates**: native (121.49ns)
- **Fastest Store Creation**: native (3.17μs)

- **Native JavaScript**: Baseline performance for direct object operations
- **Substate**: Optimized for reactive state management with built-in features
- **Redux**: Mature ecosystem with predictable state updates
- **Zustand**: Lightweight alternative with minimal boilerplate

> **💡 Note**: Performance varies by use case. Choose based on your specific requirements, not just raw speed.
> **📊 Data**: Results are averaged over 5 runs with statistical analysis.
