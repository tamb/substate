# Performance Comparison Results

**🖥️ Test Environment**: win32, Node.js v22.18.0
**📊 Method**: Averaged over 10000 runs for statistical accuracy
**📅 Generated**: 9/5/2025, 10:19:11 AM

## 🎯 Property Access Performance (Average per access)

| Library | Small State | Medium State | Large State |
|---------|-------------|--------------|-------------|
| native | 45.79ns | 53.85ns | **141.68ns** |
| redux | **44.17ns** | **53.04ns** | 142.02ns |
| substate | 63.03ns | 71.26ns | 151.88ns |
| zustand | 45.70ns | 55.68ns | 154.25ns |

## 🔄 Update Performance (Average per update)

| Library | Small State | Medium State | Large State |
|---------|-------------|--------------|-------------|
| native | 89.23ns | 119.58ns | 459.21ns |
| redux | **85.42ns** | **114.82ns** | **454.42ns** |
| substate | 297.11ns | 348.25ns | 562.01ns |
| zustand | 88.86ns | 125.24ns | 755.96ns |

## 🏗️ Store Creation Performance

| Library | Small State | Medium State | Large State |
|---------|-------------|--------------|-------------|
| native | **576.28ns** | 6.56μs | 214.00μs |
| redux | 1.47μs | **555.53ns** | **705.19ns** |
| substate | 3.81μs | 1.49μs | 1.75μs |
| zustand | 2.42μs | 7.37μs | 205.99μs |

## 🧠 Memory Usage (Estimated)

| Library | Small State | Medium State | Large State |
|---------|-------------|--------------|-------------|
| native | **1KB** | **12KB** | **128KB** |
| redux | 61KB | 623KB | 6413KB |
| substate | 7KB | 70KB | 723KB |
| zustand | 61KB | 623KB | 6413KB |

## 📈 Key Performance Insights

- **Fastest Property Access**: redux (44.17ns)
- **Fastest Updates**: redux (85.42ns)
- **Fastest Store Creation**: native (576.28ns)

- **Native JavaScript**: Baseline performance for direct object operations
- **Substate**: Optimized for reactive state management with built-in features
- **Redux**: Mature ecosystem with predictable state updates
- **Zustand**: Lightweight alternative with minimal boilerplate

> **💡 Note**: Performance varies by use case. Choose based on your specific requirements, not just raw speed.
> **📊 Data**: Results are averaged over 10000 runs with statistical analysis.
