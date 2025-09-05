# Performance Comparison Results

**🖥️ Test Environment**: win32, Node.js v22.18.0
**📊 Method**: Averaged over 10000 runs for statistical accuracy
**📅 Generated**: 9/5/2025, 10:53:23 AM

## 🎯 Property Access Performance (Average per access)

| Library | Small State | Small % | Medium State | Medium % | Large State | Large % |
|---------|-------------|---------|--------------|----------|-------------|---------|
| native | 46.62ns | 102.3% | 54.39ns | 100.0% | 145.20ns | 100.5% |
| redux | 46.45ns | 101.9% | **54.38ns** | 100.0% | **144.48ns** | 100.0% |
| substate | 61.54ns | 135.0% | 71.01ns | 130.6% | 153.81ns | 106.5% |
| zustand | **45.57ns** | 100.0% | 55.40ns | 101.9% | 158.13ns | 109.4% |

## 🔄 Update Performance (Average per update)

| Library | Small State | Small % | Medium State | Medium % | Large State | Large % |
|---------|-------------|---------|--------------|----------|-------------|---------|
| native | **78.92ns** | 100.0% | 107.38ns | 100.5% | 485.82ns | 100.7% |
| redux | 79.89ns | 101.2% | **106.87ns** | 100.0% | **482.66ns** | 100.0% |
| substate | 278.79ns | 353.3% | 340.34ns | 318.5% | 591.49ns | 122.5% |
| zustand | 79.06ns | 100.2% | 120.29ns | 112.6% | 820.54ns | 170.0% |

## 🏗️ Store Creation Performance

| Library | Small State | Small % | Medium State | Medium % | Large State | Large % |
|---------|-------------|---------|--------------|----------|-------------|---------|
| native | **544.51ns** | 100.0% | 5.27μs | 932.6% | 239.95μs | 22634.0% |
| redux | 2.07μs | 380.2% | **565.29ns** | 100.0% | **1.06μs** | 100.0% |
| substate | 5.27μs | 967.8% | 1.58μs | 279.9% | 3.21μs | 303.1% |
| zustand | 2.43μs | 446.0% | 6.75μs | 1194.9% | 232.84μs | 21963.0% |

## 🧠 Memory Usage (Estimated)

| Library | Small State | Small % | Medium State | Medium % | Large State | Large % |
|---------|-------------|---------|--------------|----------|-------------|---------|
| native | **1KB** | 100.0% | **12KB** | 100.0% | **128KB** | 100.0% |
| redux | 61KB | 5000.2% | 623KB | 5000.0% | 6413KB | 5000.0% |
| substate | 7KB | 571.8% | 70KB | 562.1% | 723KB | 563.7% |
| zustand | 61KB | 5000.2% | 623KB | 5000.0% | 6413KB | 5000.0% |

## 📈 Key Performance Insights

- **Fastest Property Access**: zustand (45.57ns)
- **Fastest Updates**: native (78.92ns)
- **Fastest Store Creation**: native (544.51ns)

- **Native JavaScript**: Baseline performance for direct object operations
- **Substate**: Optimized for reactive state management with built-in features
- **Redux**: Mature ecosystem with predictable state updates
- **Zustand**: Lightweight alternative with minimal boilerplate

> **💡 Note**: Performance varies by use case. Choose based on your specific requirements, not just raw speed.
> **📊 Data**: Results are averaged over 10000 runs with statistical analysis.
