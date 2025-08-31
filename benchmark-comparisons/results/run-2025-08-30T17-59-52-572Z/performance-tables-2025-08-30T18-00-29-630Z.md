# Performance Comparison Results

**🖥️ Test Environment**: win32, Node.js v22.18.0
**📊 Method**: Averaged over 1000 runs for statistical accuracy
**📅 Generated**: 8/30/2025, 2:00:29 PM

## 🎯 Property Access Performance (Average per access)

| Library | Small State | Medium State | Large State |
|---------|-------------|--------------|-------------|
| native | 50.76ns | **58.44ns** | **144.48ns** |
| redux | 50.71ns | 59.25ns | 146.23ns |
| substate | 66.01ns | 74.85ns | 160.89ns |
| zustand | **50.71ns** | 62.11ns | 158.13ns |

## 🔄 Update Performance (Average per update)

| Library | Small State | Medium State | Large State |
|---------|-------------|--------------|-------------|
| native | **91.80ns** | **123.37ns** | **470.62ns** |
| redux | 99.77ns | 128.26ns | 482.82ns |
| substate | 314.59ns | 367.74ns | 601.73ns |
| zustand | 96.95ns | 146.17ns | 782.91ns |

## 🏗️ Store Creation Performance

| Library | Small State | Medium State | Large State |
|---------|-------------|--------------|-------------|
| native | **876.80ns** | 7.34μs | 222.00μs |
| redux | 3.96μs | **1.78μs** | **2.08μs** |
| substate | 6.73μs | 3.38μs | 4.49μs |
| zustand | 4.64μs | 9.67μs | 220.58μs |

## 🧠 Memory Usage (Estimated)

| Library | Small State | Medium State | Large State |
|---------|-------------|--------------|-------------|
| native | **1KB** | **12KB** | **128KB** |
| redux | 61KB | 623KB | 6413KB |
| substate | 7KB | 70KB | 723KB |
| zustand | 61KB | 623KB | 6413KB |

## 📈 Key Performance Insights

- **Fastest Property Access**: zustand (50.71ns)
- **Fastest Updates**: native (91.80ns)
- **Fastest Store Creation**: native (876.80ns)

- **Native JavaScript**: Baseline performance for direct object operations
- **Substate**: Optimized for reactive state management with built-in features
- **Redux**: Mature ecosystem with predictable state updates
- **Zustand**: Lightweight alternative with minimal boilerplate

> **💡 Note**: Performance varies by use case. Choose based on your specific requirements, not just raw speed.
> **📊 Data**: Results are averaged over 1000 runs with statistical analysis.
