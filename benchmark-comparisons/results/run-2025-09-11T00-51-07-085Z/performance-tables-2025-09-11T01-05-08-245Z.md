# Performance Comparison Results

**🖥️ Test Environment**: linux, Node.js v22.19.0
**📊 Method**: Averaged over 10000 runs for statistical accuracy
**📅 Generated**: 9/10/2025, 9:05:08 PM

## 🎯 Property Access Performance (Average per access)

| Library | Small State | Small % | Medium State | Medium % | Large State | Large % |
|---------|-------------|---------|--------------|----------|-------------|---------|
| native | **113.69ns** | 100.0% | 187.54ns | 102.2% | **433.96ns** | 100.0% |
| redux | 114.90ns | 101.1% | 186.13ns | 101.4% | 439.01ns | 101.2% |
| substate | 157.61ns | 138.6% | 230.66ns | 125.7% | 441.60ns | 101.8% |
| zustand | 114.71ns | 100.9% | **183.57ns** | 100.0% | 500.94ns | 115.4% |

## 🔄 Update Performance (Average per update)

| Library | Small State | Small % | Medium State | Medium % | Large State | Large % |
|---------|-------------|---------|--------------|----------|-------------|---------|
| native | **220.52ns** | 100.0% | 376.99ns | 100.4% | 1.28μs | 100.0% |
| redux | 223.68ns | 101.4% | **375.44ns** | 100.0% | **1.28μs** | 100.0% |
| substate | 777.07ns | 352.4% | 980.77ns | 261.2% | 1.70μs | 132.9% |
| zustand | 225.20ns | 102.1% | 398.57ns | 106.2% | 2.09μs | 163.3% |

## 🏗️ Store Creation Performance

| Library | Small State | Small % | Medium State | Medium % | Large State | Large % |
|---------|-------------|---------|--------------|----------|-------------|---------|
| native | **1.69μs** | 100.0% | 16.86μs | 763.0% | 528.75μs | 17225.0% |
| redux | 5.93μs | 350.5% | **2.21μs** | 100.0% | **3.07μs** | 100.0% |
| substate | 10.32μs | 610.3% | 6.91μs | 312.9% | 8.54μs | 278.2% |
| zustand | 10.97μs | 648.7% | 22.95μs | 1038.8% | 531.82μs | 17324.9% |

## 🧠 Memory Usage (Estimated)

| Library | Small State | Small % | Medium State | Medium % | Large State | Large % |
|---------|-------------|---------|--------------|----------|-------------|---------|
| native | **1KB** | 100.0% | **12KB** | 100.0% | **128KB** | 100.0% |
| redux | 61KB | 5000.1% | 623KB | 5000.1% | 6413KB | 5000.0% |
| substate | 7KB | 571.8% | 70KB | 562.1% | 723KB | 563.7% |
| zustand | 61KB | 5000.3% | 623KB | 5000.1% | 6413KB | 5000.0% |

## 📈 Key Performance Insights

- **Fastest Property Access**: native (113.69ns)
- **Fastest Updates**: native (220.52ns)
- **Fastest Store Creation**: native (1.69μs)

- **Native JavaScript**: Baseline performance for direct object operations
- **Substate**: Optimized for reactive state management with built-in features
- **Redux**: Mature ecosystem with predictable state updates
- **Zustand**: Lightweight alternative with minimal boilerplate

> **💡 Note**: Performance varies by use case. Choose based on your specific requirements, not just raw speed.
> **📊 Data**: Results are averaged over 10000 runs with statistical analysis.
