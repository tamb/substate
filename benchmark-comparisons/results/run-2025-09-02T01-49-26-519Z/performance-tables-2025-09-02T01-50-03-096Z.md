# Performance Comparison Results

**🖥️ Test Environment**: win32, Node.js v22.18.0
**📊 Method**: Averaged over 1000 runs for statistical accuracy
**📅 Generated**: 9/1/2025, 9:50:03 PM

## 🎯 Property Access Performance (Average per access)

| Library | Small State | Medium State | Large State |
|---------|-------------|--------------|-------------|
| native | 50.02ns | **57.99ns** | **142.61ns** |
| redux | **49.01ns** | 59.19ns | 143.75ns |
| substate | 62.48ns | 69.93ns | 151.84ns |
| zustand | 49.07ns | 61.31ns | 153.13ns |

## 🔄 Update Performance (Average per update)

| Library | Small State | Medium State | Large State |
|---------|-------------|--------------|-------------|
| native | 97.33ns | **114.21ns** | **464.77ns** |
| redux | 96.46ns | 128.00ns | 467.75ns |
| substate | 307.13ns | 359.94ns | 569.79ns |
| zustand | **95.96ns** | 137.15ns | 747.83ns |

## 🏗️ Store Creation Performance

| Library | Small State | Medium State | Large State |
|---------|-------------|--------------|-------------|
| native | **1.16μs** | 6.34μs | 220.58μs |
| redux | 3.85μs | **2.30μs** | **1.98μs** |
| substate | 6.74μs | 3.94μs | 3.99μs |
| zustand | 4.99μs | 9.42μs | 206.97μs |

## 🧠 Memory Usage (Estimated)

| Library | Small State | Medium State | Large State |
|---------|-------------|--------------|-------------|
| native | **1KB** | **12KB** | **128KB** |
| redux | 61KB | 623KB | 6413KB |
| substate | 7KB | 70KB | 723KB |
| zustand | 61KB | 623KB | 6413KB |

## 📈 Key Performance Insights

- **Fastest Property Access**: redux (49.01ns)
- **Fastest Updates**: zustand (95.96ns)
- **Fastest Store Creation**: native (1.16μs)

- **Native JavaScript**: Baseline performance for direct object operations
- **Substate**: Optimized for reactive state management with built-in features
- **Redux**: Mature ecosystem with predictable state updates
- **Zustand**: Lightweight alternative with minimal boilerplate

> **💡 Note**: Performance varies by use case. Choose based on your specific requirements, not just raw speed.
> **📊 Data**: Results are averaged over 1000 runs with statistical analysis.
