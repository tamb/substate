# Performance Comparison Results

**🖥️ Test Environment**: win32, Node.js v22.18.0
**📊 Method**: Averaged over 10000 runs for statistical accuracy
**📅 Generated**: 9/1/2025, 10:00:28 PM

## 🎯 Property Access Performance (Average per access)

| Library | Small State | Medium State | Large State |
|---------|-------------|--------------|-------------|
| native | 48.58ns | 59.55ns | **143.42ns** |
| redux | 49.23ns | **57.92ns** | 144.87ns |
| substate | 63.06ns | 70.43ns | 150.93ns |
| zustand | **47.83ns** | 59.97ns | 154.26ns |

## 🔄 Update Performance (Average per update)

| Library | Small State | Medium State | Large State |
|---------|-------------|--------------|-------------|
| native | **97.37ns** | **124.18ns** | **457.81ns** |
| redux | 100.55ns | 124.59ns | 463.22ns |
| substate | 323.93ns | 352.79ns | 575.44ns |
| zustand | 103.14ns | 135.70ns | 755.96ns |

## 🏗️ Store Creation Performance

| Library | Small State | Medium State | Large State |
|---------|-------------|--------------|-------------|
| native | **702.37ns** | 7.17μs | 215.64μs |
| redux | 1.92μs | **652.84ns** | **726.32ns** |
| substate | 4.52μs | 1.56μs | 1.73μs |
| zustand | 3.16μs | 8.25μs | 207.34μs |

## 🧠 Memory Usage (Estimated)

| Library | Small State | Medium State | Large State |
|---------|-------------|--------------|-------------|
| native | **1KB** | **12KB** | **128KB** |
| redux | 61KB | 623KB | 6413KB |
| substate | 7KB | 70KB | 723KB |
| zustand | 61KB | 623KB | 6413KB |

## 📈 Key Performance Insights

- **Fastest Property Access**: zustand (47.83ns)
- **Fastest Updates**: native (97.37ns)
- **Fastest Store Creation**: native (702.37ns)

- **Native JavaScript**: Baseline performance for direct object operations
- **Substate**: Optimized for reactive state management with built-in features
- **Redux**: Mature ecosystem with predictable state updates
- **Zustand**: Lightweight alternative with minimal boilerplate

> **💡 Note**: Performance varies by use case. Choose based on your specific requirements, not just raw speed.
> **📊 Data**: Results are averaged over 10000 runs with statistical analysis.
