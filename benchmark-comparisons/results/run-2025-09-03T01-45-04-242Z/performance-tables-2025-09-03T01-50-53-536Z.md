# Performance Comparison Results

**🖥️ Test Environment**: win32, Node.js v22.18.0
**📊 Method**: Averaged over 10000 runs for statistical accuracy
**📅 Generated**: 9/2/2025, 9:50:53 PM

## 🎯 Property Access Performance (Average per access)

| Library | Small State | Medium State | Large State |
|---------|-------------|--------------|-------------|
| native | 47.90ns | **58.27ns** | 161.66ns |
| redux | **47.76ns** | 59.54ns | **146.33ns** |
| substate | 61.42ns | 70.28ns | 153.18ns |
| zustand | 48.07ns | 59.10ns | 161.96ns |

## 🔄 Update Performance (Average per update)

| Library | Small State | Medium State | Large State |
|---------|-------------|--------------|-------------|
| native | **75.19ns** | **108.54ns** | 544.20ns |
| redux | 78.20ns | 112.02ns | **498.78ns** |
| substate | 285.69ns | 331.69ns | 600.54ns |
| zustand | 78.62ns | 120.64ns | 813.80ns |

## 🏗️ Store Creation Performance

| Library | Small State | Medium State | Large State |
|---------|-------------|--------------|-------------|
| native | **525.13ns** | 5.23μs | 267.36μs |
| redux | 2.23μs | **600.70ns** | **1.11μs** |
| substate | 5.45μs | 1.44μs | 3.28μs |
| zustand | 3.29μs | 6.79μs | 230.19μs |

## 🧠 Memory Usage (Estimated)

| Library | Small State | Medium State | Large State |
|---------|-------------|--------------|-------------|
| native | **1KB** | **12KB** | **128KB** |
| redux | 61KB | 623KB | 6413KB |
| substate | 7KB | 70KB | 723KB |
| zustand | 61KB | 623KB | 6413KB |

## 📈 Key Performance Insights

- **Fastest Property Access**: redux (47.76ns)
- **Fastest Updates**: native (75.19ns)
- **Fastest Store Creation**: native (525.13ns)

- **Native JavaScript**: Baseline performance for direct object operations
- **Substate**: Optimized for reactive state management with built-in features
- **Redux**: Mature ecosystem with predictable state updates
- **Zustand**: Lightweight alternative with minimal boilerplate

> **💡 Note**: Performance varies by use case. Choose based on your specific requirements, not just raw speed.
> **📊 Data**: Results are averaged over 10000 runs with statistical analysis.
