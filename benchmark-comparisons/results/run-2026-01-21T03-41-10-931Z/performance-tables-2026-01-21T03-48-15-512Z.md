# Performance Comparison Results

**🖥️ Test Environment**: win32, Node.js v24.13.0
**📊 Method**: Averaged over 10000 runs for statistical accuracy
**📅 Generated**: 1/20/2026, 10:48:15 PM

## 🎯 Property Access Performance (Average per access)

| Library | Small State | Small % | Medium State | Medium % | Large State | Large % |
|---------|-------------|---------|--------------|----------|-------------|---------|
| native | **36.41ns** | 100.0% | **43.02ns** | 100.0% | **124.74ns** | 100.0% |
| redux | 38.44ns | 105.6% | 44.75ns | 104.0% | 447.00ns | 358.4% |
| substate | 66.41ns | 182.4% | 59.00ns | 137.1% | 138.76ns | 111.2% |
| zustand | 76.07ns | 208.9% | 44.36ns | 103.1% | 131.84ns | 105.7% |

## 🔄 Update Performance (Average per update)

| Library | Small State | Small % | Medium State | Medium % | Large State | Large % |
|---------|-------------|---------|--------------|----------|-------------|---------|
| native | **60.24ns** | 100.0% | **78.68ns** | 100.0% | **411.70ns** | 100.0% |
| redux | 61.66ns | 102.4% | 80.88ns | 102.8% | 1.34μs | 325.6% |
| substate | 264.83ns | 439.7% | 252.38ns | 320.8% | 506.00ns | 122.9% |
| zustand | 117.25ns | 194.7% | 83.91ns | 106.6% | 494.44ns | 120.1% |

## 🏗️ Store Creation Performance

| Library | Small State | Small % | Medium State | Medium % | Large State | Large % |
|---------|-------------|---------|--------------|----------|-------------|---------|
| native | **345.64ns** | 100.0% | 3.19μs | 869.1% | 195.67μs | 13875.4% |
| redux | 999.03ns | 289.0% | **367.59ns** | 100.0% | 3.21μs | 227.9% |
| substate | 2.98μs | 861.5% | 931.20ns | 253.3% | **1.41μs** | 100.0% |
| zustand | 3.55μs | 1026.2% | 4.21μs | 1146.4% | 194.38μs | 13784.0% |

## 🧠 Memory Usage (Estimated)

| Library | Small State | Small % | Medium State | Medium % | Large State | Large % |
|---------|-------------|---------|--------------|----------|-------------|---------|
| native | **1KB** | 100.0% | **12KB** | 100.0% | **128KB** | 100.0% |
| redux | 61KB | 5000.0% | 623KB | 5000.0% | 6413KB | 5000.0% |
| substate | 7KB | 571.8% | 70KB | 562.1% | 723KB | 563.7% |
| zustand | 61KB | 5000.0% | 623KB | 4999.9% | 6413KB | 5000.0% |

## 📈 Key Performance Insights

- **Fastest Property Access**: native (36.41ns)
- **Fastest Updates**: native (60.24ns)
- **Fastest Store Creation**: native (345.64ns)

- **Native JavaScript**: Baseline performance for direct object operations
- **Substate**: Optimized for reactive state management with built-in features
- **Redux**: Mature ecosystem with predictable state updates
- **Zustand**: Lightweight alternative with minimal boilerplate

> **💡 Note**: Performance varies by use case. Choose based on your specific requirements, not just raw speed.
> **📊 Data**: Results are averaged over 10000 runs with statistical analysis.
