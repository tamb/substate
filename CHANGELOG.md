# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive GitHub Actions CI/CD pipeline
- Performance benchmarking suite with automated monitoring
- Security audit integration
- Automated alpha release workflow

### Changed
- Improved build system with dual ESM/UMD outputs
- Enhanced TypeScript configuration for cleaner builds
- Updated comparison table to be more accurate about TypeScript support

### Fixed
- Import organization issues in test files

## [10.0.0-alpha.0] - 2024-08-17

### Added
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

### Breaking Changes
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
