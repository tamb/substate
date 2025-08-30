# Updated Benchmark Workflow

## Overview

The benchmark system has been updated to organize results in timestamped directories, making it easier to track and compare benchmark runs over time.

## New Structure

```
benchmark-comparisons/
├── benchmark-start.mjs          # New: Main script to run all benchmarks
├── benchmark-*.mjs              # Individual benchmark scripts (unchanged)
├── generate-report.mjs          # Updated: Can read from specific run directories
├── benchmark-utils.mjs          # Updated: Uses environment variables for directory
└── results/
    ├── run-2025-01-15T10-30-00-000Z/    # Timestamped run directory
    │   ├── substate-benchmark-2025-01-15T10-30-00-000Z.json
    │   ├── redux-benchmark-2025-01-15T10-30-00-000Z.json
    │   ├── zustand-benchmark-2025-01-15T10-30-00-000Z.json
    │   ├── native-benchmark-2025-01-15T10-30-00-000Z.json
    │   ├── performance-summary-2025-01-15T10-30-01-000Z.json
    │   └── performance-tables-2025-01-15T10-30-01-000Z.md
    ├── run-2025-01-15T11-45-00-000Z/    # Another run
    │   └── ...
    ├── performance-summary-latest.json   # Latest results (for compatibility)
    └── performance-tables-latest.md     # Latest results (for compatibility)
```

## Usage

### Run All Benchmarks (Recommended)

Creates a timestamped directory and runs all benchmarks:

```bash
node benchmark-start.mjs
```

This will:
1. Create `results/run-YYYY-MM-DDTHH-MM-SS-sssZ/` directory
2. Run each benchmark script synchronously 
3. Save all results in the same directory
4. Show instructions for generating reports

### Generate Reports

For the latest run:
```bash
node generate-report.mjs
```

For a specific run:
```bash
BENCHMARK_RUN_DIR="./results/run-2025-01-15T10-30-00-000Z" node generate-report.mjs
```

### Individual Benchmarks (Still Works)

You can still run individual benchmarks:
```bash
node benchmark-substate.mjs
node benchmark-redux.mjs
# etc.
```

These will save to the default `./results/` directory if no `BENCHMARK_RUN_DIR` is set.

## Benefits

1. **Organized Results**: Each benchmark run is contained in its own directory
2. **Easy Comparison**: Compare different runs by looking at different directories  
3. **No Conflicts**: Multiple runs don't overwrite each other
4. **Backward Compatible**: Old scripts and workflows still work
5. **Clear History**: Easy to see when benchmarks were run

## Environment Variables

The system uses these environment variables (set automatically by `benchmark-start.mjs`):

- `BENCHMARK_RUN_DIR`: Directory to save results (e.g., `./results/run-2025-01-15T10-30-00-000Z`)
- `BENCHMARK_RUN_ID`: Timestamp ID for this run (e.g., `2025-01-15T10-30-00-000Z`)

## Migration

No migration needed! The new system:
- Works with existing benchmark scripts
- Maintains backward compatibility
- Generates the same `performance-tables-latest.md` and `performance-summary-latest.json` files

## Example Workflow

```bash
# Run benchmarks
node benchmark-start.mjs

# Generate report (uses latest run automatically)
node generate-report.mjs

# Compare with a previous run
BENCHMARK_RUN_DIR="./results/run-2025-01-14T09-15-00-000Z" node generate-report.mjs
```

## Tips

- Use `benchmark-start.mjs` for complete benchmark runs
- Individual scripts are useful for testing specific libraries
- The report generator automatically finds the latest run if no directory is specified
- All files from a single run are kept together in one directory
