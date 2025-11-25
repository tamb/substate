#!/bin/bash

# Run GitHub Actions security audit locally
# Exact commands from .github/workflows/ci.yml security job

set -e

echo "Running GitHub Actions security audit steps locally..."
echo

echo "Step 1: Install dependencies"
npm ci

echo
echo "Step 2: Run linting"
npm run check

echo
echo "Step 3: Run isolation check"
npm run test:isolation

echo
echo "Step 4: Setup integrations"
npm run integration:setup

echo
echo "Step 5: Run security audit"
npm audit --audit-level moderate

echo
echo "Step 6: Check for known vulnerabilities"
npx audit-ci --moderate

echo
echo "✅ All security audit steps completed successfully!"
