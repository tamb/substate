# Performance Comparison Results

**🖥️ Test Environment**: win32, Node.js v22.18.0
**📊 Method**: Averaged over 1000 runs for statistical accuracy
**📅 Generated**: 8/30/2025, 11:19:37 PM

## 🎯 Property Access Performance (Average per access)

| Library | Small State | Medium State | Large State |
|---------|-------------|--------------|-------------|
| native | 50.09ns | 57.43ns | **145.84ns** |
| redux | 48.75ns | **57.39ns** | 147.69ns |
| substate | 66.75ns | 73.63ns | 155.92ns |
| zustand | **48.69ns** | 58.74ns | 155.90ns |

## 🔄 Update Performance (Average per update)

| Library | Small State | Medium State | Large State |
|---------|-------------|--------------|-------------|
| native | 102.22ns | 124.93ns | **468.48ns** |
| redux | 98.45ns | **121.75ns** | 477.30ns |
| substate | 311.16ns | 373.03ns | 586.39ns |
| zustand | **95.33ns** | 139.43ns | 776.32ns |

## 🏗️ Store Creation Performance

| Library | Small State | Medium State | Large State |
|---------|-------------|--------------|-------------|
| native | **1.04μs** | 7.17μs | 221.04μs |
| redux | 4.39μs | **1.52μs** | **1.89μs** |
| substate | 6.68μs | 3.80μs | 4.11μs |
| zustand | 4.59μs | 9.29μs | 215.46μs |

## 🧠 Memory Usage (Estimated)

| Library | Small State | Medium State | Large State |
|---------|-------------|--------------|-------------|
| native | **1KB** | **12KB** | **128KB** |
| redux | 61KB | 623KB | 6413KB |
| substate | 7KB | 70KB | 723KB |
| zustand | 61KB | 623KB | 6413KB |

## 📈 Key Performance Insights

- **Fastest Property Access**: zustand (48.69ns)
- **Fastest Updates**: zustand (95.33ns)
- **Fastest Store Creation**: native (1.04μs)

- **Native JavaScript**: Baseline performance for direct object operations
- **Substate**: Optimized for reactive state management with built-in features
- **Redux**: Mature ecosystem with predictable state updates
- **Zustand**: Lightweight alternative with minimal boilerplate

> **💡 Note**: Performance varies by use case. Choose based on your specific requirements, not just raw speed.
> **📊 Data**: Results are averaged over 1000 runs with statistical analysis.
