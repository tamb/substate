# Performance Comparison Results

**🖥️ Test Environment**: win32, Node.js v22.18.0
**📊 Method**: Averaged over 10000 runs for statistical accuracy
**📅 Generated**: 9/5/2025, 10:26:32 AM

## 🎯 Property Access Performance (Average per access)

| Library | Small State | Small % | Medium State | Medium % | Large State | Large % |
|---------|-------------|---------|--------------|----------|-------------|---------|
| native | 45.79ns | 103.7% | 53.85ns | 101.5% | **141.68ns** | 100.0% |
| redux | **44.17ns** | 100.0% | **53.04ns** | 100.0% | 142.02ns | 100.2% |
| substate | 63.03ns | 142.7% | 71.26ns | 134.3% | 151.88ns | 107.2% |
| zustand | 45.70ns | 103.5% | 55.68ns | 105.0% | 154.25ns | 108.9% |

## 🔄 Update Performance (Average per update)

| Library | Small State | Small % | Medium State | Medium % | Large State | Large % |
|---------|-------------|---------|--------------|----------|-------------|---------|
| native | 89.23ns | 104.5% | 119.58ns | 104.1% | 459.21ns | 101.1% |
| redux | **85.42ns** | 100.0% | **114.82ns** | 100.0% | **454.42ns** | 100.0% |
| substate | 297.11ns | 347.8% | 348.25ns | 303.3% | 562.01ns | 123.7% |
| zustand | 88.86ns | 104.0% | 125.24ns | 109.1% | 755.96ns | 166.4% |

## 🏗️ Store Creation Performance

| Library | Small State | Small % | Medium State | Medium % | Large State | Large % |
|---------|-------------|---------|--------------|----------|-------------|---------|
| native | **576.28ns** | 100.0% | 6.56μs | 1181.1% | 214.00μs | 30346.9% |
| redux | 1.47μs | 255.9% | **555.53ns** | 100.0% | **705.19ns** | 100.0% |
| substate | 3.81μs | 661.4% | 1.49μs | 269.1% | 1.75μs | 247.8% |
| zustand | 2.42μs | 419.9% | 7.37μs | 1327.0% | 205.99μs | 29210.6% |

## 🧠 Memory Usage (Estimated)

| Library | Small State | Small % | Medium State | Medium % | Large State | Large % |
|---------|-------------|---------|--------------|----------|-------------|---------|
| native | **1KB** | 100.0% | **12KB** | 100.0% | **128KB** | 100.0% |
| redux | 61KB | 5000.0% | 623KB | 5000.0% | 6413KB | 5000.0% |
| substate | 7KB | 571.7% | 70KB | 562.1% | 723KB | 563.7% |
| zustand | 61KB | 4999.9% | 623KB | 5000.0% | 6413KB | 5000.0% |

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
