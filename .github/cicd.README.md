# GitHub Actions CI/CD Pipeline

This directory contains the automated workflows for Substate's continuous integration and deployment.

## 🚀 Workflows

### 1. **CI Workflow** (`ci.yml`)
**Triggers**: Push to main/v10 branches, Pull Requests

**Features**:
- **Multi-platform testing**: Ubuntu, Windows, macOS
- **Multi-Node.js versions**: 20.x, 22.x, 24.x
- **Comprehensive testing**: Unit tests, build tests, linting
- **Coverage reporting**: Automatic Codecov integration
- **Security auditing**: Dependency vulnerability scanning

### 2. **Performance Monitoring** (`performance.yml`)
**Triggers**: Push, PR, Manual dispatch

**Features**:
- **Multi-Node testing**: Node.js 20.x and 22.x (LTS versions)
- **Automated benchmarks**: Shallow and deep state performance
- **Performance regression detection**: Threshold-based alerts
- **PR comments**: Performance results automatically posted
- **Daily monitoring**: Catch performance drift over time
- **Artifact storage**: 30-day retention of benchmark results

### 3. **Release Workflow** (`release.yml`)
**Triggers**: Git tags matching `v*` pattern

**Features**:
- **Multi-stage pipeline**: Validate → Prepare → Publish → Release
- **Job dependencies**: Publishing only happens after all checks pass
- **Full test suite**: All tests must pass before release
- **Automated publishing**: NPM with provenance (currently disabled)
- **GitHub releases**: Automatic release notes generation
- **Artifact preservation**: 90-day retention
- **Prerelease detection**: Automatic alpha/beta/rc handling
- **Failure isolation**: Each stage can fail independently

### 4. **Alpha Publishing** (`publish-alpha.yml.disabled`)
**Status**: Currently disabled - workflow renamed to `.disabled` extension

**Features** (when enabled):
- **Alpha releases**: Automatic alpha versioning
- **NPM alpha tag**: Separate distribution channel
- **Testing gate**: Must pass all tests
- **Manual control**: Optional custom alpha suffixes

## 🔧 Setup Requirements

### Repository Secrets
```
NPM_TOKEN - NPM automation token for publishing
CODECOV_TOKEN - Codecov integration token (optional)
```

### Branch Protection
Recommended branch protection rules for `main`:
- Require status checks: CI workflow
- Require up-to-date branches
- Require signed commits (optional)

## 📊 Performance Monitoring

The performance workflow provides:
- **Benchmark results** on every PR
- **Regression detection** with configurable thresholds
- **Artifact storage** for performance analysis

### Thresholds
- Shallow update time: < 50μs
- Medium state memory: < 2MB
- Deep clone time: < 5ms

## 🚦 Release Process

### Alpha Releases (Currently Disabled)
1. ~~Push to `v10` branch~~
2. ~~Alpha workflow publishes `substate@alpha`~~
3. ~~Available for testing immediately~~

**To re-enable**: `mv publish-alpha.yml.disabled publish-alpha.yml`

### Stable Releases (Tag-based from main)
1. Merge `v10` → `main` when ready for release
2. Create and push version tag: `git tag v10.0.0 && git push origin v10.0.0`
3. **Validate**: All tests, builds, and performance checks run
4. **Prepare**: Version extraction and changelog generation
5. **Publish**: NPM publishing (currently disabled)
6. **Release**: GitHub release creation with notes

**Note**: Release workflow only runs on version tags, not on `v10` branch pushes

## 📈 Monitoring & Alerts

- **CI failures**: Immediate feedback on PRs
- **Performance regressions**: Automated detection and PR comments
- **Security vulnerabilities**: Weekly audit reports
- **Release status**: Automatic notifications on success/failure

## 🛠️ Local Testing

Run the same checks locally:
```bash
npm run test:ci        # Run CI checks locally
npm run test:performance  # Run performance benchmarks
npm audit --audit-level moderate  # Security audit
```

This ensures your changes will pass CI before pushing.
