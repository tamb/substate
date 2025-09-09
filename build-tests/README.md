# Substate Build Tests

This directory contains tests that verify the core Substate library builds correctly in different module formats and environments.

## 🎯 **Purpose**

- **Build Verification**: Ensure ESM and UMD builds are functional
- **Import Testing**: Verify module exports work correctly
- **Environment Compatibility**: Test Node.js and browser-like environments
- **CI/CD Integration**: Automated build validation before publishing

## 📁 **Test Files**

### **`test-esm.mjs`** - ESM Build Test
Tests the modern ES module build (`dist/index.esm.js`):

```javascript
import { createStore } from '../dist/index.esm.js'
```

**What it tests:**
- ✅ ESM import syntax works
- ✅ `createStore` function is available
- ✅ Store creation and basic operations
- ✅ Node.js ESM module resolution

### **`test-umd.cjs`** - UMD Build Test
Tests the Universal Module Definition build (`dist/index.umd.js`):

```javascript
require('../dist/index.umd.js')
// Uses global.substate.createStore
```

**What it tests:**
- ✅ UMD global variable creation
- ✅ Browser-like environment compatibility
- ✅ CommonJS require() loading
- ✅ Store functionality in UMD context

## 🚀 **Running Build Tests**

### **Individual Tests**
```bash
# Test ESM build
npm run test:esm

# Test UMD build  
npm run test:umd

# Test both builds
npm run test:builds
```

### **Full Test Suite**
```bash
# Run all tests including build tests
npm run test:all

# CI test suite
npm run test:ci
```

## 📊 **Test Output**

### **Successful ESM Test**
```
🧪 Testing ESM build...
✅ ESM import works: function
✅ ESM store creation works: true
✅ ESM store operation works: true
✅ ESM build fully functional!
```

### **Successful UMD Test**
```
🧪 Testing UMD build...
✅ UMD global export works: function
✅ UMD store creation works: true
✅ UMD store operation works: true
✅ UMD build fully functional!
```

## 🔧 **How It Works**

### **ESM Test Process**
1. **Dynamic Import**: Uses `import()` to load the built ESM file
2. **Function Check**: Verifies `createStore` is exported and callable
3. **Basic Operations**: Creates store, updates state, reads properties
4. **Type Validation**: Ensures functions and objects are correct types

### **UMD Test Process**
1. **Global Setup**: Creates browser-like `window` global environment
2. **UMD Loading**: Uses `require()` to load UMD build
3. **Global Check**: Verifies `global.substate` object is created
4. **API Testing**: Tests store creation and operations via global API

## 🎯 **What's Being Validated**

### **Build Quality**
- ✅ Rollup builds complete without errors
- ✅ TypeScript declarations are generated
- ✅ Source maps are created
- ✅ Bundle size is reasonable

### **Module Compatibility**
- ✅ ESM: Works with `import` syntax
- ✅ UMD: Works with `require()` and browser globals
- ✅ Node.js: Compatible with different Node.js versions
- ✅ Bundlers: Can be imported by Webpack, Vite, etc.

### **API Consistency**
- ✅ Same `createStore` function in both builds
- ✅ Store methods work identically
- ✅ Type definitions match implementation
- ✅ No missing exports or functionality

## 🐛 **Troubleshooting**

### **ESM Test Fails**
```bash
# Check if build exists
ls -la dist/index.esm.js

# Rebuild
npm run build

# Check Node.js version (requires 14+)
node --version
```

### **UMD Test Fails**
```bash
# Check if UMD build exists
ls -la dist/index.umd.js

# Check global object creation
node -e "require('./dist/index.umd.js'); console.log(Object.keys(global))"
```

### **Both Tests Fail**
```bash
# Clean and rebuild
npm run clean
npm run build

# Check build configuration
cat rollup.config.js
```

## 🔄 **Integration with CI/CD**

These tests are part of the automated test suite:

```bash
# Package.json scripts
"test:builds": "npm run test:esm && npm run test:umd"
"test:ci": "npm run check && npm run test && npm run test:builds"
"test:all": "npm run test && npm run test:builds && npm run test:performance"
```

**When builds are tested:**
- ✅ Before publishing to npm
- ✅ In CI/CD pipelines
- ✅ During development builds
- ✅ Before integration tests

## 📦 **Build Output Verification**

Expected files after successful build:

```
dist/
├── index.esm.js         # ES module build
├── index.esm.js.map     # Source map
├── index.umd.js         # UMD build  
├── index.umd.js.map     # Source map
├── index.d.ts           # TypeScript declarations
├── index.d.ts.map       # Declaration map
├── react/               # React integration build
└── preact/              # Preact integration build
```

## ✅ **Success Criteria**

A successful build test should:
- ✅ Import/require without errors
- ✅ Export `createStore` function
- ✅ Create functional store instances
- ✅ Execute basic store operations
- ✅ Maintain consistent API across formats
- ✅ Complete in under 5 seconds

## 🎯 **Why These Tests Matter**

1. **Publishing Confidence**: Ensures builds work before npm publish
2. **Environment Coverage**: Tests both modern (ESM) and legacy (UMD) environments
3. **Regression Prevention**: Catches build configuration issues early
4. **Consumer Validation**: Verifies end-user import experiences work
5. **CI/CD Integration**: Automated quality gates for releases

These build tests are the final validation before Substate reaches consumers, ensuring a smooth integration experience across all JavaScript environments.
