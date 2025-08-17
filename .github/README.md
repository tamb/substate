# GitHub Actions CI/CD Pipeline

This directory contains the automated workflows for Substate's continuous integration and deployment.

## 🚀 Workflows

### 1. **CI Workflow** (`ci.yml`)
**Triggers**: Push to main/v10 branches, Pull Requests

**Features**:
- **Multi-platform testing**: Ubuntu, Windows, macOS
- **Multi-Node.js versions**: 18.x, 20.x, 22.x
- **Comprehensive testing**: Unit tests, build tests, linting
- **Coverage reporting**: Automatic Codecov integration
- **Security auditing**: Dependency vulnerability scanning

### 2. **Performance Monitoring** (`performance.yml`)
**Triggers**: Push, PR, Daily schedule (2 AM UTC), Manual dispatch

**Features**:
- **Automated benchmarks**: Shallow and deep state performance
- **Performance regression detection**: Threshold-based alerts
- **PR comments**: Performance results automatically posted
- **Daily monitoring**: Catch performance drift over time
- **Artifact storage**: 30-day retention of benchmark results

### 3. **Release Workflow** (`release.yml`)
**Triggers**: Git tags matching `v*` pattern

**Features**:
- **Full test suite**: All tests must pass before release
- **Automated publishing**: NPM with provenance
- **GitHub releases**: Automatic release notes generation
- **Artifact preservation**: 90-day retention
- **Prerelease detection**: Automatic alpha/beta/rc handling

### 4. **Alpha Publishing** (`publish-alpha.yml`)
**Triggers**: Push to v10 branch, Manual dispatch

**Features**:
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
- **Historical tracking** with daily automated runs
- **Artifact storage** for performance analysis

### Thresholds
- Shallow update time: < 50μs
- Medium state memory: < 2MB
- Deep clone time: < 5ms

## 🚦 Release Process

### Alpha Releases (Automated)
1. Push to `v10` branch
2. Alpha workflow publishes `substate@alpha`
3. Available for testing immediately

### Stable Releases (Tag-based)
1. Create and push version tag: `git tag v10.0.0 && git push origin v10.0.0`
2. Release workflow runs automatically
3. Publishes to NPM as `substate@latest`
4. Creates GitHub release with notes

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
