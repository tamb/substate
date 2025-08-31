# Performance Comparison Results

**🖥️ Test Environment**: win32, Node.js v22.18.0
**📊 Method**: Averaged over 1000 runs for statistical accuracy
**📅 Generated**: 8/30/2025, 11:12:18 PM

## 🎯 Property Access Performance (Average per access)

| Library | Small State | Medium State | Large State |
|---------|-------------|--------------|-------------|
| native | 49.02ns | 56.32ns | **146.45ns** |
| redux | **47.70ns** | **56.29ns** | 147.01ns |
| substate | 65.83ns | 73.29ns | 155.27ns |
| zustand | 50.65ns | 57.44ns | 156.80ns |

## 🔄 Update Performance (Average per update)

| Library | Small State | Medium State | Large State |
|---------|-------------|--------------|-------------|
| native | 93.34ns | **118.42ns** | **471.02ns** |
| redux | 92.79ns | 127.94ns | 474.41ns |
| substate | 304.86ns | 369.72ns | 589.51ns |
| zustand | **91.07ns** | 129.64ns | 769.20ns |

## 🏗️ Store Creation Performance

| Library | Small State | Medium State | Large State |
|---------|-------------|--------------|-------------|
| native | **959.20ns** | 6.36μs | 224.50μs |
| redux | 3.86μs | **1.95μs** | **1.85μs** |
| substate | 6.75μs | 3.54μs | 4.34μs |
| zustand | 4.60μs | 8.20μs | 213.98μs |

## 🧠 Memory Usage (Estimated)

| Library | Small State | Medium State | Large State |
|---------|-------------|--------------|-------------|
| native | **1KB** | **12KB** | **128KB** |
| redux | 61KB | 623KB | 6413KB |
| substate | 7KB | 70KB | 723KB |
| zustand | 61KB | 623KB | 6413KB |

## 📈 Key Performance Insights

- **Fastest Property Access**: redux (47.70ns)
- **Fastest Updates**: zustand (91.07ns)
- **Fastest Store Creation**: native (959.20ns)

- **Native JavaScript**: Baseline performance for direct object operations
- **Substate**: Optimized for reactive state management with built-in features
- **Redux**: Mature ecosystem with predictable state updates
- **Zustand**: Lightweight alternative with minimal boilerplate

> **💡 Note**: Performance varies by use case. Choose based on your specific requirements, not just raw speed.
> **📊 Data**: Results are averaged over 1000 runs with statistical analysis.
