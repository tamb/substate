## 🛠️ Development

### Project Structure

```
substate/
├── src/
│   ├── index.ts                    # Main exports and type definitions
│   ├── index.test.ts               # Main export tests
│   └── core/
│       ├── consts.ts               # Event constants and shared values
│       ├── createStore/
│       │   ├── createStore.ts      # Factory function for store creation
│       │   └── createStore.interface.ts
│       ├── Substate/
│       │   ├── Substate.ts         # Main Substate class implementation
│       │   ├── Substate.interface.ts # Substate class interfaces
│       │   ├── interfaces.ts       # Type definitions for state and middleware
│       │   ├── helpers/            # Utility functions for optimization
│       │   │   ├── canUseFastPath.ts
│       │   │   ├── checkForFastPathPossibility.ts
│       │   │   ├── isDeep.ts
│       │   │   ├── requiresByString.ts
│       │   │   ├── tempUpdate.ts
│       │   │   └── tests/          # Helper function tests
│       │   └── tests/              # Substate class tests
│       │       ├── Substate.test.ts
│       │       ├── sync.test.ts    # Sync functionality tests
│       │       ├── tagging.test.ts # Tag functionality tests
│       │       ├── memory-management.test.ts
│       │       └── mocks.ts        # Test utilities
│       └── PubSub/
│           ├── PubSub.ts           # Event system base class
│           ├── PubSub.interface.ts
│           └── PubSub.test.ts
│   └── integrations/               # Framework-specific integrations
│       ├── preact/                 # Preact hooks and components
│       └── react/                  # React hooks and components
├── dist/                           # Compiled output (ESM, UMD, declarations)
├── coverage/                       # Test coverage reports
├── integration-tests/              # End-to-end integration tests
│   ├── lit-vite/                   # Lit integration test
│   ├── preact-vite/                # Preact integration test
│   └── react-vite/                 # React integration test
├── benchmark-comparisons/          # Performance comparison suite
├── performance-tests/              # Internal performance testing
└── scripts/                        # Build and utility scripts
```

### Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes with tests
4. Run tests: `npm test`
5. Run linting: `npm run lint:fix`
6. Commit your changes: `git commit -m 'Add amazing feature'`
7. Push to the branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

### Scripts

#### Core Development
```bash
npm run build         # Build all distributions (ESM, UMD, declarations)
npm run clean         # Clean dist directory
npm run fix           # Auto-fix formatting and linting issues
npm run format        # Format code with Biome
npm run lint          # Check code linting with Biome
npm run check         # Run Biome checks on source code
```

#### Testing Suite
```bash
npm test              # Run all tests (core + integration)
npm run test:core     # Run core unit tests only
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
npm run test:all      # Comprehensive test suite (check + test + builds + integrations + perf)
```

#### Build Testing
```bash
npm run test:builds   # Test both ESM and UMD builds
npm run _test:esm     # Test ESM build specifically
npm run _test:umd     # Test UMD build specifically
```

#### Performance Testing
```bash
npm run test:perf           # Run all performance tests (shallow + deep)
npm run _test:perf:shallow   # Shallow state performance test
npm run _test:perf:deep      # Deep state performance test
npm run test:perf:avg        # Run performance tests with 5-run averages
npm run _test:perf:shallow:avg # Shallow performance with averaging
npm run _test:perf:deep:avg    # Deep performance with averaging
```

#### Integration Testing
```bash
npm run test:integrations           # Run all integration tests
npm run _test:integrations:check     # Check dependency compatibility
npm run _test:integration:react      # Test React integration
npm run _test:integration:preact     # Test Preact integration
```

#### Isolation Testing
```bash
npm run test:isolation # Test module isolation and integrity
```

#### Development Servers
```bash
npm run dev:react     # Start React integration dev server
npm run dev:preact    # Start Preact integration dev server
```

#### Setup and Maintenance
```bash
npm run integration:setup           # Setup all integration test environments
npm run _integration:setup:react    # Setup React integration only
npm run _integration:setup:preact   # Setup Preact integration only
npm run reset                       # Clear all dependencies and reinstall
npm run refresh                     # Clean install and setup integrations
```

#### Performance Benchmarking
```bash
npm run benchmark   # Run performance comparisons vs other libraries
```

#### Publishing
```bash
npm run pre         # Pre-publish checks (test + build) - publishes to 'next' tag
npm run safe-publish # Full publish pipeline (test + build + publish)
```
