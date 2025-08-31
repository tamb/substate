# Performance Comparison Results

**🖥️ Test Environment**: win32, Node.js v22.18.0
**📊 Method**: Averaged over 1000 runs for statistical accuracy
**📅 Generated**: 8/30/2025, 1:57:37 PM

## 🎯 Property Access Performance (Average per access)

| Library | Small State | Medium State | Large State |
|---------|-------------|--------------|-------------|
| native | 51.36ns | 55.81ns | **153.08ns** |
| redux | **48.85ns** | **55.80ns** | 155.51ns |
| substate | 66.95ns | 71.63ns | 161.70ns |
| zustand | 51.04ns | 59.15ns | 182.42ns |

## 🔄 Update Performance (Average per update)

| Library | Small State | Medium State | Large State |
|---------|-------------|--------------|-------------|
| native | **86.73ns** | **115.05ns** | **530.14ns** |
| redux | 89.21ns | 119.49ns | 539.92ns |
| substate | 312.07ns | 361.54ns | 632.18ns |
| zustand | 90.01ns | 134.35ns | 878.82ns |

## 🏗️ Store Creation Performance

| Library | Small State | Medium State | Large State |
|---------|-------------|--------------|-------------|
| native | **1.10μs** | 6.25μs | 264.64μs |
| redux | 5.19μs | **1.61μs** | **3.42μs** |
| substate | 9.45μs | 3.29μs | 8.06μs |
| zustand | 7.45μs | 9.36μs | 258.52μs |

## 🧠 Memory Usage (Estimated)

| Library | Small State | Medium State | Large State |
|---------|-------------|--------------|-------------|
| native | **1KB** | **12KB** | **128KB** |
| redux | 61KB | 623KB | 6413KB |
| substate | 7KB | 70KB | 723KB |
| zustand | 61KB | 623KB | 6413KB |

## 📈 Key Performance Insights

- **Fastest Property Access**: redux (48.85ns)
- **Fastest Updates**: native (86.73ns)
- **Fastest Store Creation**: native (1.10μs)

- **Native JavaScript**: Baseline performance for direct object operations
- **Substate**: Optimized for reactive state management with built-in features
- **Redux**: Mature ecosystem with predictable state updates
- **Zustand**: Lightweight alternative with minimal boilerplate

> **💡 Note**: Performance varies by use case. Choose based on your specific requirements, not just raw speed.
> **📊 Data**: Results are averaged over 1000 runs with statistical analysis.
