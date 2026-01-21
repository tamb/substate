# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Changed

### Fixed

## [10.0.1] - 2025-11-25

### Added (10.0.1)

- Local security audit helper script (`run-security-audit-local.sh`)
- Updated benchmark comparison reporting artifacts (latest summaries/tables)

### Changed (10.0.1)

- Dependency and tooling bumps (Rollup/Vitest/TypeScript and related build/test tooling)
- React/Preact integration types refined for better inference and ergonomics
- Documentation refresh and re-organization across API, usage examples, and integration guides
- `syncEvents` support restored for `sync()` and deprecated (logs a `console.warn` when used)

### Fixed (10.0.1)

- Security vulnerabilities addressed via npm audit/audit-ci workflow updates
- Build/test reliability improvements (CI thresholds, dependency install consistency)

## [10.0.0] - 2025-09-23

### Added (10.0.0)

- New `createStore` factory and `Substate` core implementation with a modern TypeScript API
- Memory management (history limiting/clearing) and tagged states (named checkpoints)
- Sync support for unidirectional data binding with configurable middleware
- First-class React and Preact integrations (hook-based APIs) and package exports (`./react`, `./preact`)
- Performance test suite and comparative benchmark tooling/reports
- CI/CD automation (tests, performance monitoring, releases) and repo tooling configuration

### Changed (10.0.0)

- Build system reworked to output both ESM and UMD bundles, plus build verification tests
- Linting/formatting standardized with Biome

### Fixed (10.0.0)

- Multiple correctness and type-safety improvements discovered during the v10 rewrite and test expansion

## [10.0.0-alpha.0] - 2024-08-17

### Added (10.0.0-alpha.0)

- Complete rewrite for v10 with modern TypeScript
- ESM and UMD build outputs for maximum compatibility
- Comprehensive test suite with 100% coverage
- Performance benchmarking tools
- Memory management features with automatic history limiting
- Tagged states for named checkpoints
- Sync functionality for unidirectional data binding
- Enhanced middleware system with before/after hooks
- Complete TypeScript definitions with full type safety
- Automatic dependency bundling (no peer dependencies)
- Extensive documentation with examples and API reference

### Breaking Changes (10.0.0-alpha.0)

- API changes from v9 - see migration guide in README
- Import changes: use `{ createStore }` instead of default import
- Moved from peer dependencies to bundled dependencies

### Performance

- Optimized shallow state operations: ~2-275μs per update
- Deep state management: ~400μs-1.9ms per operation
- Property access: ~0.14-1.22μs per access
- Automatic memory management with configurable limits

### Developer Experience

- Professional build system with clean output
- Comprehensive test coverage
- Performance monitoring
- Security auditing
- Automated CI/CD pipeline
