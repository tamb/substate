# Substate Integration Tests

This directory contains self-contained integration test projects that verify Substate works correctly with different frameworks in realistic environments.

## 🎯 **Purpose**

- **Realistic Testing**: Test exactly how consumers will use the library
- **Dependency Isolation**: Ensure no hoisting or version conflicts
- **Framework Compatibility**: Verify React and Preact integrations work independently
- **Build Verification**: Test actual bundling and import paths

## 📁 **Project Structure**

```
integration-tests/
├── react-vite/          # React + Vite integration test
│   ├── .npmrc           # Prevents dependency hoisting
│   ├── package.json     # Links to parent Substate build
│   ├── node_modules/    # Completely isolated dependencies
│   └── src/             # Counter & TodoApp examples
└── preact-vite/         # Preact + Vite integration test
    ├── .npmrc           # Prevents dependency hoisting
    ├── package.json     # Links to parent Substate build
    ├── node_modules/    # Completely isolated dependencies
    └── src/             # Preact-specific examples
```

## 🚀 **Quick Start**

### **React Integration Test**
```bash
# Run React development server
npm run dev:react

# Or manually:
cd integration-tests/react-vite
npm install
npm run dev
```

### **Preact Integration Test**
```bash
# Run Preact development server  
npm run dev:preact

# Or manually:
cd integration-tests/preact-vite
npm install
npm run dev
```

### **Run All Integration Tests**
```bash
# Build library and test all integrations
npm run test:integrations

# Check dependency isolation
npm run test:isolation
```

## 🔒 **Dependency Isolation**

Each test project uses multiple layers of protection to prevent dependency hoisting:

### **1. Root `.npmrc`**
```ini
hoist=false
shamefully-hoist=false
public-hoist-pattern=""
```

### **2. Project-specific `.npmrc`**
```ini
hoist=false
shamefully-hoist=false
```

### **3. File-based Dependencies**
```json
{
  "dependencies": {
    "substate": "file:../../"
  }
}
```

### **4. Verification Script**
```bash
npm run test:isolation
```

## 🧪 **What's Being Tested**

### **React Integration (`react-vite/`)**
- ✅ Store injection pattern
- ✅ `useSubstate` hook with selectors  
- ✅ `useSubstateActions` comprehensive methods
- ✅ Counter example with tagged states
- ✅ TodoApp with sync functionality
- ✅ TypeScript integration
- ✅ Vite bundling

### **Preact Integration (`preact-vite/`)**
- ✅ Same API compatibility as React
- ✅ Preact-specific hooks implementation
- ✅ Counter example
- ✅ Framework comparison info
- ✅ TypeScript integration
- ✅ Vite bundling

## 📊 **Import Path Testing**

Each project tests the exact import paths consumers will use:

```typescript
// Core library
import { createStore } from 'substate'

// React integration
import { useSubstate, useSubstateActions } from 'substate/react'

// Preact integration  
import { useSubstate, useSubstateActions } from 'substate/preact'
```

## 🎨 **Features Demonstrated**

### **Core Substate Features**
- Store creation outside React/Preact
- State management with immutable updates
- History and memory management
- Tagged states for undo/redo functionality

### **Framework Integration**
- Hook-based API familiar to React/Preact developers
- Automatic re-render optimization with selectors
- Event cleanup on component unmount
- TypeScript type inference

### **Advanced Features**
- Sync functionality for form binding
- Memory usage monitoring
- Tagged state navigation
- Multi-component state sharing

## 💡 **Development Workflow**

1. **Make changes** to core Substate or integrations
2. **Build the library**: `npm run build`
3. **Test integrations**: `npm run test:integrations`
4. **Develop interactively**: `npm run dev:react` or `npm run dev:preact`
5. **Verify isolation**: `npm run test:isolation`

## 🔍 **Troubleshooting**

### **Dependencies Not Installing**
```bash
# Check isolation status
npm run test:isolation

# Clean and reinstall
cd integration-tests/react-vite
rm -rf node_modules package-lock.json
npm install
```

### **Import Errors**
- Ensure parent library is built: `npm run build`
- Check package.json exports are correct
- Verify no dependency hoisting occurred

### **TypeScript Errors**
- Check that integration TypeScript configs are correct
- Ensure parent library declarations are generated
- Verify import paths match package exports

## ✅ **Success Criteria**

A successful integration test should:
- ✅ Install dependencies without hoisting
- ✅ Build without TypeScript errors
- ✅ Import from correct subpaths (`substate/react`, `substate/preact`)
- ✅ Demonstrate all major Substate features
- ✅ Run in development mode with hot reload
- ✅ Pass the isolation verification script

## 🎯 **Why This Approach**

This isolated testing approach ensures:
- **Real-world accuracy**: Tests exactly how consumers use the library
- **Version safety**: No conflicts between React/Preact versions
- **Build confidence**: Catches integration issues before publishing
- **Documentation**: Living examples of proper usage patterns
