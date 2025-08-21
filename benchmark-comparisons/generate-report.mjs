// Performance Comparison Report Generator
// Reads JSON benchmark results and generates comparison tables

import fs from 'fs';
import path from 'path';
import { NUM_RUNS } from './benchmark-utils.mjs';

console.log('📊 Performance Comparison Report Generator');
console.log('==========================================\n');

// Function to read all benchmark JSON files
function readBenchmarkResults() {
  const resultsDir = './results';
  
  if (!fs.existsSync(resultsDir)) {
    console.log('❌ No results directory found. Run benchmarks first:');
    console.log('   npm run benchmark:all');
    return null;
  }
  
  const files = fs.readdirSync(resultsDir).filter(file => file.endsWith('.json'));
  
  if (files.length === 0) {
    console.log('❌ No benchmark result files found. Run benchmarks first:');
    console.log('   npm run benchmark:all');
    return null;
  }
  
  const results = {};
  
  for (const file of files) {
    try {
      const filePath = path.join(resultsDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      // Extract library name from filename (e.g., "substate-benchmark-2024-01-01.json" -> "substate")
      const libraryName = file.split('-')[0];
      results[libraryName] = data;
      
      console.log(`✅ Loaded: ${libraryName} (${data.timestamp})`);
    } catch (error) {
      console.log(`⚠️  Skipped ${file}: ${error.message}`);
    }
  }
  
  return results;
}

// Function to format time values
function formatTime(ms) {
  if (ms < 0.001) return `${(ms * 1000000).toFixed(2)}ns`;
  if (ms < 1) return `${(ms * 1000).toFixed(2)}μs`;
  if (ms < 1000) return `${ms.toFixed(2)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

// Function to find test result by name
function findTestResult(results, testName) {
  return results.find(result => 
    result.testName.toLowerCase().includes(testName.toLowerCase())
  );
}

// Function to create summary JSON
function createSummaryJSON(results) {
  const summary = {
    timestamp: new Date().toISOString(),
    environment: {
      platform: process.platform,
      nodeVersion: process.version
    },
    libraries: {}
  };
  
  for (const [library, data] of Object.entries(results)) {
    summary.libraries[library] = {
      timestamp: data.timestamp,
      environment: data.environment,
      results: {}
    };
    
    for (const result of data.results) {
      const testType = result.testName.toLowerCase().replace(' ', '-');
      summary.libraries[library].results[testType] = {
        stateSize: result.stateSize,
        iterations: result.iterations,
        averages: result.averages
      };
    }
  }
  
  return summary;
}

// Function to generate markdown tables
function generateMarkdownTables(results) {
  const libraries = Object.keys(results);
  const testTypes = ['small', 'medium', 'large'];
  
  let markdown = `# Performance Comparison Results\n\n`;
  markdown += `**🖥️ Test Environment**: ${process.platform}, Node.js ${process.version}\n`;
  markdown += `**📊 Method**: Averaged over ${NUM_RUNS} runs for statistical accuracy\n`;
  markdown += `**📅 Generated**: ${new Date().toLocaleString()}\n\n`;
  
  // Property Access Comparison
  markdown += `## 🎯 Property Access Performance (Average per access)\n\n`;
  markdown += `| Library | Small State | Medium State | Large State |\n`;
  markdown += `|---------|-------------|--------------|-------------|\n`;
  
  // Find fastest for each column
  const fastestAccess = {
    small: libraries.reduce((fastest, lib) => {
      const avg = findTestResult(results[lib].results, 'small')?.averages?.avgAccess;
      if (avg && (!fastest || avg < fastest.value)) {
        return { library: lib, value: avg };
      }
      return fastest;
    }, null),
    medium: libraries.reduce((fastest, lib) => {
      const avg = findTestResult(results[lib].results, 'medium')?.averages?.avgAccess;
      if (avg && (!fastest || avg < fastest.value)) {
        return { library: lib, value: avg };
      }
      return fastest;
    }, null),
    large: libraries.reduce((fastest, lib) => {
      const avg = findTestResult(results[lib].results, 'large')?.averages?.avgAccess;
      if (avg && (!fastest || avg < fastest.value)) {
        return { library: lib, value: avg };
      }
      return fastest;
    }, null)
  };
  
  for (const library of libraries) {
    const libraryResults = results[library].results;
    const small = findTestResult(libraryResults, 'small')?.averages?.avgAccess || 'N/A';
    const medium = findTestResult(libraryResults, 'medium')?.averages?.avgAccess || 'N/A';
    const large = findTestResult(libraryResults, 'large')?.averages?.avgAccess || 'N/A';
    
    const smallStr = typeof small === 'number' ? formatTime(small) : small;
    const mediumStr = typeof medium === 'number' ? formatTime(medium) : medium;
    const largeStr = typeof large === 'number' ? formatTime(large) : large;
    
    // Bold the fastest in each column
    const smallBold = (fastestAccess.small && typeof small === 'number' && small === fastestAccess.small.value) ? `**${smallStr}**` : smallStr;
    const mediumBold = (fastestAccess.medium && typeof medium === 'number' && medium === fastestAccess.medium.value) ? `**${mediumStr}**` : mediumStr;
    const largeBold = (fastestAccess.large && typeof large === 'number' && large === fastestAccess.large.value) ? `**${largeStr}**` : largeStr;
    
    markdown += `| ${library} | ${smallBold} | ${mediumBold} | ${largeBold} |\n`;
  }
  markdown += '\n';
  
  // Update Performance Comparison
  markdown += `## 🔄 Update Performance (Average per update)\n\n`;
  markdown += `| Library | Small State | Medium State | Large State |\n`;
  markdown += `|---------|-------------|--------------|-------------|\n`;
  
  // Find fastest for each column
  const fastestUpdate = {
    small: libraries.reduce((fastest, lib) => {
      const avg = findTestResult(results[lib].results, 'small')?.averages?.avgUpdate;
      if (avg && (!fastest || avg < fastest.value)) {
        return { library: lib, value: avg };
      }
      return fastest;
    }, null),
    medium: libraries.reduce((fastest, lib) => {
      const avg = findTestResult(results[lib].results, 'medium')?.averages?.avgUpdate;
      if (avg && (!fastest || avg < fastest.value)) {
        return { library: lib, value: avg };
      }
      return fastest;
    }, null),
    large: libraries.reduce((fastest, lib) => {
      const avg = findTestResult(results[lib].results, 'large')?.averages?.avgUpdate;
      if (avg && (!fastest || avg < fastest.value)) {
        return { library: lib, value: avg };
      }
      return fastest;
    }, null)
  };
  
  for (const library of libraries) {
    const libraryResults = results[library].results;
    const small = findTestResult(libraryResults, 'small')?.averages?.avgUpdate || 'N/A';
    const medium = findTestResult(libraryResults, 'medium')?.averages?.avgUpdate || 'N/A';
    const large = findTestResult(libraryResults, 'large')?.averages?.avgUpdate || 'N/A';
    
    const smallStr = typeof small === 'number' ? formatTime(small) : small;
    const mediumStr = typeof medium === 'number' ? formatTime(medium) : medium;
    const largeStr = typeof large === 'number' ? formatTime(large) : large;
    
    // Bold the fastest in each column
    const smallBold = (fastestUpdate.small && typeof small === 'number' && small === fastestUpdate.small.value) ? `**${smallStr}**` : smallStr;
    const mediumBold = (fastestUpdate.medium && typeof medium === 'number' && medium === fastestUpdate.medium.value) ? `**${mediumStr}**` : mediumStr;
    const largeBold = (fastestUpdate.large && typeof large === 'number' && large === fastestUpdate.large.value) ? `**${largeStr}**` : largeStr;
    
    markdown += `| ${library} | ${smallBold} | ${mediumBold} | ${largeBold} |\n`;
  }
  markdown += '\n';
  
  // Store Creation Performance
  markdown += `## 🏗️ Store Creation Performance\n\n`;
  markdown += `| Library | Small State | Medium State | Large State |\n`;
  markdown += `|---------|-------------|--------------|-------------|\n`;
  
  // Find fastest for each column
  const fastestCreation = {
    small: libraries.reduce((fastest, lib) => {
      const avg = findTestResult(results[lib].results, 'small')?.averages?.creation;
      if (avg && (!fastest || avg < fastest.value)) {
        return { library: lib, value: avg };
      }
      return fastest;
    }, null),
    medium: libraries.reduce((fastest, lib) => {
      const avg = findTestResult(results[lib].results, 'medium')?.averages?.creation;
      if (avg && (!fastest || avg < fastest.value)) {
        return { library: lib, value: avg };
      }
      return fastest;
    }, null),
    large: libraries.reduce((fastest, lib) => {
      const avg = findTestResult(results[lib].results, 'large')?.averages?.creation;
      if (avg && (!fastest || avg < fastest.value)) {
        return { library: lib, value: avg };
      }
      return fastest;
    }, null)
  };
  
  for (const library of libraries) {
    const libraryResults = results[library].results;
    const small = findTestResult(libraryResults, 'small')?.averages?.creation || 'N/A';
    const medium = findTestResult(libraryResults, 'medium')?.averages?.creation || 'N/A';
    const large = findTestResult(libraryResults, 'large')?.averages?.creation || 'N/A';
    
    const smallStr = typeof small === 'number' ? formatTime(small) : small;
    const mediumStr = typeof medium === 'number' ? formatTime(medium) : medium;
    const largeStr = typeof large === 'number' ? formatTime(large) : large;
    
    // Bold the fastest in each column
    const smallBold = (fastestCreation.small && typeof small === 'number' && small === fastestCreation.small.value) ? `**${smallStr}**` : smallStr;
    const mediumBold = (fastestCreation.medium && typeof medium === 'number' && medium === fastestCreation.medium.value) ? `**${mediumStr}**` : mediumStr;
    const largeBold = (fastestCreation.large && typeof large === 'number' && large === fastestCreation.large.value) ? `**${largeStr}**` : largeStr;
    
    markdown += `| ${library} | ${smallBold} | ${mediumBold} | ${largeBold} |\n`;
  }
  markdown += '\n';
  
  // Memory Usage Comparison
  markdown += `## 🧠 Memory Usage (Estimated)\n\n`;
  markdown += `| Library | Small State | Medium State | Large State |\n`;
  markdown += `|---------|-------------|--------------|-------------|\n`;
  
  // Find lowest memory for each column
  const lowestMemory = {
    small: libraries.reduce((lowest, lib) => {
      const avg = findTestResult(results[lib].results, 'small')?.averages?.memoryKB;
      if (avg && (!lowest || avg < lowest.value)) {
        return { library: lib, value: avg };
      }
      return lowest;
    }, null),
    medium: libraries.reduce((lowest, lib) => {
      const avg = findTestResult(results[lib].results, 'medium')?.averages?.memoryKB;
      if (avg && (!lowest || avg < lowest.value)) {
        return { library: lib, value: avg };
      }
      return lowest;
    }, null),
    large: libraries.reduce((lowest, lib) => {
      const avg = findTestResult(results[lib].results, 'large')?.averages?.memoryKB;
      if (avg && (!lowest || avg < lowest.value)) {
        return { library: lib, value: avg };
      }
      return lowest;
    }, null)
  };
  
  for (const library of libraries) {
    const libraryResults = results[library].results;
    const small = findTestResult(libraryResults, 'small')?.averages?.memoryKB || 'N/A';
    const medium = findTestResult(libraryResults, 'medium')?.averages?.memoryKB || 'N/A';
    const large = findTestResult(libraryResults, 'large')?.averages?.memoryKB || 'N/A';
    
    const smallStr = typeof small === 'number' ? `${small.toFixed(0)}KB` : small;
    const mediumStr = typeof medium === 'number' ? `${medium.toFixed(0)}KB` : medium;
    const largeStr = typeof large === 'number' ? `${large.toFixed(0)}KB` : large;
    
    // Bold the lowest memory in each column
    const smallBold = (lowestMemory.small && typeof small === 'number' && small === lowestMemory.small.value) ? `**${smallStr}**` : smallStr;
    const mediumBold = (lowestMemory.medium && typeof medium === 'number' && medium === lowestMemory.medium.value) ? `**${mediumStr}**` : mediumStr;
    const largeBold = (lowestMemory.large && typeof large === 'number' && large === lowestMemory.large.value) ? `**${largeStr}**` : largeStr;
    
    markdown += `| ${library} | ${smallBold} | ${mediumBold} | ${largeBold} |\n`;
  }
  markdown += '\n';
  
  // Performance Insights
  markdown += `## 📈 Key Performance Insights\n\n`;
  
  // Find fastest for each metric (small state)
  const fastestAccessOverall = libraries.reduce((fastest, lib) => {
    const avg = findTestResult(results[lib].results, 'small')?.averages?.avgAccess;
    if (avg && (!fastest || avg < fastest.value)) {
      return { library: lib, value: avg };
    }
    return fastest;
  }, null);
  
  const fastestUpdateOverall = libraries.reduce((fastest, lib) => {
    const avg = findTestResult(results[lib].results, 'small')?.averages?.avgUpdate;
    if (avg && (!fastest || avg < fastest.value)) {
      return { library: lib, value: avg };
    }
    return fastest;
  }, null);
  
  const fastestCreationOverall = libraries.reduce((fastest, lib) => {
    const avg = findTestResult(results[lib].results, 'small')?.averages?.creation;
    if (avg && (!fastest || avg < fastest.value)) {
      return { library: lib, value: avg };
    }
    return fastest;
  }, null);
  
  if (fastestAccessOverall) {
    markdown += `- **Fastest Property Access**: ${fastestAccessOverall.library} (${formatTime(fastestAccessOverall.value)})\n`;
  }
  
  if (fastestUpdateOverall) {
    markdown += `- **Fastest Updates**: ${fastestUpdateOverall.library} (${formatTime(fastestUpdateOverall.value)})\n`;
  }
  
  if (fastestCreationOverall) {
    markdown += `- **Fastest Store Creation**: ${fastestCreationOverall.library} (${formatTime(fastestCreationOverall.value)})\n`;
  }
  
  markdown += '\n';
  markdown += `- **Native JavaScript**: Baseline performance for direct object operations\n`;
  markdown += `- **Substate**: Optimized for reactive state management with built-in features\n`;
  markdown += `- **Redux**: Mature ecosystem with predictable state updates\n`;
  markdown += `- **Zustand**: Lightweight alternative with minimal boilerplate\n\n`;
  
  markdown += `> **💡 Note**: Performance varies by use case. Choose based on your specific requirements, not just raw speed.\n`;
  markdown += `> **📊 Data**: Results are averaged over ${NUM_RUNS} runs with statistical analysis.\n`;
  
  return markdown;
}

// Function to generate comparison table for console
function generateComparisonTable(results) {
  const libraries = Object.keys(results);
  const testTypes = ['small', 'medium', 'large'];
  
  console.log('## ⚡ Performance Comparison');
  console.log();
  
  // Environment info
  const firstResult = Object.values(results)[0];
  console.log(`**🖥️ Test Environment**: ${firstResult.environment.platform}, Node.js ${firstResult.environment.nodeVersion}`);
  console.log(`**📊 Method**: Averaged over ${NUM_RUNS} runs for statistical accuracy`);
  console.log(`**📅 Generated**: ${new Date().toLocaleString()}`);
  console.log();
  
  // Property Access Comparison
  console.log('### 🎯 Property Access Performance (Average per access)');
  console.log();
  console.log('| Library | Small State | Medium State | Large State |');
  console.log('|---------|-------------|--------------|-------------|');
  
  for (const library of libraries) {
    const libraryResults = results[library].results;
    const small = findTestResult(libraryResults, 'small')?.averages?.avgAccess || 'N/A';
    const medium = findTestResult(libraryResults, 'medium')?.averages?.avgAccess || 'N/A';
    const large = findTestResult(libraryResults, 'large')?.averages?.avgAccess || 'N/A';
    
    const smallStr = typeof small === 'number' ? formatTime(small) : small;
    const mediumStr = typeof medium === 'number' ? formatTime(medium) : medium;
    const largeStr = typeof large === 'number' ? formatTime(large) : large;
    
    console.log(`| ${library} | ${smallStr} | ${mediumStr} | ${largeStr} |`);
  }
  console.log();
  
  // Update Performance Comparison
  console.log('### 🔄 Update Performance (Average per update)');
  console.log();
  console.log('| Library | Small State | Medium State | Large State |');
  console.log('|---------|-------------|--------------|-------------|');
  
  for (const library of libraries) {
    const libraryResults = results[library].results;
    const small = findTestResult(libraryResults, 'small')?.averages?.avgUpdate || 'N/A';
    const medium = findTestResult(libraryResults, 'medium')?.averages?.avgUpdate || 'N/A';
    const large = findTestResult(libraryResults, 'large')?.averages?.avgUpdate || 'N/A';
    
    const smallStr = typeof small === 'number' ? formatTime(small) : small;
    const mediumStr = typeof medium === 'number' ? formatTime(medium) : medium;
    const largeStr = typeof large === 'number' ? formatTime(large) : large;
    
    console.log(`| ${library} | ${smallStr} | ${mediumStr} | ${largeStr} |`);
  }
  console.log();
  
  // Store Creation Performance
  console.log('### 🏗️ Store Creation Performance');
  console.log();
  console.log('| Library | Small State | Medium State | Large State |');
  console.log('|---------|-------------|--------------|-------------|');
  
  for (const library of libraries) {
    const libraryResults = results[library].results;
    const small = findTestResult(libraryResults, 'small')?.averages?.creation || 'N/A';
    const medium = findTestResult(libraryResults, 'medium')?.averages?.creation || 'N/A';
    const large = findTestResult(libraryResults, 'large')?.averages?.creation || 'N/A';
    
    const smallStr = typeof small === 'number' ? formatTime(small) : small;
    const mediumStr = typeof medium === 'number' ? formatTime(medium) : medium;
    const largeStr = typeof large === 'number' ? formatTime(large) : large;
    
    console.log(`| ${library} | ${smallStr} | ${mediumStr} | ${largeStr} |`);
  }
  console.log();
  
  // Memory Usage Comparison
  console.log('### 🧠 Memory Usage (Estimated)');
  console.log();
  console.log('| Library | Small State | Medium State | Large State |');
  console.log('|---------|-------------|--------------|-------------|');
  
  for (const library of libraries) {
    const libraryResults = results[library].results;
    const small = findTestResult(libraryResults, 'small')?.averages?.memoryKB || 'N/A';
    const medium = findTestResult(libraryResults, 'medium')?.averages?.memoryKB || 'N/A';
    const large = findTestResult(libraryResults, 'large')?.averages?.memoryKB || 'N/A';
    
    const smallStr = typeof small === 'number' ? `${small.toFixed(0)}KB` : small;
    const mediumStr = typeof medium === 'number' ? `${medium.toFixed(0)}KB` : medium;
    const largeStr = typeof large === 'number' ? `${large.toFixed(0)}KB` : large;
    
    console.log(`| ${library} | ${smallStr} | ${mediumStr} | ${largeStr} |`);
  }
  console.log();
  
  // Performance Insights
  console.log('### 📈 Key Performance Insights');
  console.log();
  
  // Find fastest for each metric (small state)
  const fastestAccess = libraries.reduce((fastest, lib) => {
    const avg = findTestResult(results[lib].results, 'small')?.averages?.avgAccess;
    if (avg && (!fastest || avg < fastest.value)) {
      return { library: lib, value: avg };
    }
    return fastest;
  }, null);
  
  const fastestUpdate = libraries.reduce((fastest, lib) => {
    const avg = findTestResult(results[lib].results, 'small')?.averages?.avgUpdate;
    if (avg && (!fastest || avg < fastest.value)) {
      return { library: lib, value: avg };
    }
    return fastest;
  }, null);
  
  const fastestCreation = libraries.reduce((fastest, lib) => {
    const avg = findTestResult(results[lib].results, 'small')?.averages?.creation;
    if (avg && (!fastest || avg < fastest.value)) {
      return { library: lib, value: avg };
    }
    return fastest;
  }, null);
  
  if (fastestAccess) {
    console.log(`- **Fastest Property Access**: ${fastestAccess.library} (${formatTime(fastestAccess.value)})`);
  }
  
  if (fastestUpdate) {
    console.log(`- **Fastest Updates**: ${fastestUpdate.library} (${formatTime(fastestUpdate.value)})`);
  }
  
  if (fastestCreation) {
    console.log(`- **Fastest Store Creation**: ${fastestCreation.library} (${formatTime(fastestCreation.value)})`);
  }
  
  console.log();
  console.log('- **Native JavaScript**: Baseline performance for direct object operations');
  console.log('- **Substate**: Optimized for reactive state management with built-in features');
  console.log('- **Redux**: Mature ecosystem with predictable state updates');
  console.log('- **Zustand**: Lightweight alternative with minimal boilerplate');
  console.log();
  
  console.log('> **💡 Note**: Performance varies by use case. Choose based on your specific requirements, not just raw speed.');
  console.log(`> **📊 Data**: Results are averaged over ${NUM_RUNS} runs with statistical analysis.`);
}

// Function to generate detailed breakdown
function generateDetailedBreakdown(results) {
  console.log('\n## 📋 Detailed Performance Breakdown');
  console.log();
  
  for (const [library, data] of Object.entries(results)) {
    console.log(`### ${library.toUpperCase()}`);
    console.log();
    console.log(`**Test Environment**: ${data.environment.platform}, Node.js ${data.environment.nodeVersion}`);
    console.log(`**Timestamp**: ${new Date(data.timestamp).toLocaleString()}`);
    console.log();
    
    for (const result of data.results) {
      console.log(`#### ${result.testName} (${result.stateSize} props, ${result.iterations.toLocaleString()} ops)`);
      console.log();
      console.log('| Metric | Average | Min | Max | Std Dev |');
      console.log('|--------|---------|-----|-----|---------|');
      
      const metrics = [
        { name: 'Store Creation', value: result.averages.creation },
        { name: 'Single Update', value: result.averages.singleUpdate },
        { name: 'Avg Update', value: result.averages.avgUpdate },
        { name: 'Avg Access', value: result.averages.avgAccess },
        { name: 'Memory (KB)', value: result.averages.memoryKB }
      ];
      
      for (const metric of metrics) {
        const stats = result.stats[metric.name.toLowerCase().replace(/\s+/g, '')] || 
                     result.stats[metric.name.toLowerCase().replace(/\s+/g, '').replace('avg', '')] ||
                     result.stats.memorykb;
        
        if (stats) {
          const avg = metric.name.includes('Memory') ? 
            `${stats.mean.toFixed(0)}KB` : 
            formatTime(stats.mean);
          const min = metric.name.includes('Memory') ? 
            `${stats.min.toFixed(0)}KB` : 
            formatTime(stats.min);
          const max = metric.name.includes('Memory') ? 
            `${stats.max.toFixed(0)}KB` : 
            formatTime(stats.max);
          const std = metric.name.includes('Memory') ? 
            `${stats.stdDev.toFixed(0)}KB` : 
            formatTime(stats.stdDev);
          
          console.log(`| ${metric.name} | ${avg} | ${min} | ${max} | ${std} |`);
        }
      }
      console.log();
    }
  }
}

// Function to save files
function saveReportFiles(summaryJSON, markdownTables) {
  const outputDir = './results';
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  // Save summary JSON
  const summaryFile = `${outputDir}/performance-summary-${timestamp}.json`;
  fs.writeFileSync(summaryFile, JSON.stringify(summaryJSON, null, 2));
  console.log(`💾 Summary JSON saved to: ${summaryFile}`);
  
  // Save markdown tables
  const markdownFile = `${outputDir}/performance-tables-${timestamp}.md`;
  fs.writeFileSync(markdownFile, markdownTables);
  console.log(`📄 Markdown tables saved to: ${markdownFile}`);
  
  // Save latest versions (without timestamp)
  const latestSummaryFile = `${outputDir}/performance-summary-latest.json`;
  fs.writeFileSync(latestSummaryFile, JSON.stringify(summaryJSON, null, 2));
  
  const latestMarkdownFile = `${outputDir}/performance-tables-latest.md`;
  fs.writeFileSync(latestMarkdownFile, markdownTables);
  
  return { summaryFile, markdownFile, latestSummaryFile, latestMarkdownFile };
}

// Main execution
async function main() {
  try {
    console.log('🔍 Reading benchmark results...\n');
    
    const results = readBenchmarkResults();
    
    if (!results) {
      process.exit(1);
    }
    
    console.log(`\n📊 Found ${Object.keys(results).length} benchmark result(s)`);
    console.log();
    
    // Generate summary JSON
    const summaryJSON = createSummaryJSON(results);
    
    // Generate markdown tables
    const markdownTables = generateMarkdownTables(results);
    
    // Save files
    const savedFiles = saveReportFiles(summaryJSON, markdownTables);
    
    // Generate console output
    generateComparisonTable(results);
    
    // Generate detailed breakdown
    generateDetailedBreakdown(results);
    
    console.log('\n' + '='.repeat(60));
    console.log('🎉 Performance comparison report generated successfully!');
    console.log('📁 Results saved in: ./results/');
    console.log(`📊 Summary JSON: ${savedFiles.latestSummaryFile}`);
    console.log(`📄 Markdown tables: ${savedFiles.latestMarkdownFile}`);
    console.log('📊 Run benchmarks again to update results: npm run benchmark:all');
    
  } catch (error) {
    console.error('❌ Error generating report:', error.message);
    process.exit(1);
  }
}

main();
