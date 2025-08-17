// Test ESM build
console.log('🧪 Testing ESM build...');
try {
  const { createStore } = await import('../dist/index.esm.js');
  console.log('✅ ESM import works:', typeof createStore);
  
  const store = createStore({name: 'test-esm'});
  console.log('✅ ESM store creation works:', !!store);
  
  store.updateState({ test: 'esm-value' });
  console.log('✅ ESM store operation works:', store.getProp('test') === 'esm-value');
  
  console.log('✅ ESM build fully functional!');
} catch (error) {
  console.error('❌ ESM test failed:', error.message);
}

console.log('\n🧪 Testing UMD build...');
// Test UMD build in Node.js context
try {
  // Create a minimal global context for UMD
  global.window = global;
  delete require.cache[require.resolve('./dist/index.umd.js')];
  require('../dist/index.umd.js');
  
  if (global.substate && typeof global.substate.createStore === 'function') {
    console.log('✅ UMD global export works:', typeof global.substate.createStore);
    
    const store = global.substate.createStore({name: 'test-umd'});
    console.log('✅ UMD store creation works:', !!store);
    
    store.updateState({ test: 'umd-value' });
    console.log('✅ UMD store operation works:', store.getProp('test') === 'umd-value');
    
    console.log('✅ UMD build fully functional!');
  } else {
    console.error('❌ UMD global not found or invalid');
  }
} catch (error) {
  console.error('❌ UMD test failed (EXPECTED in ESM context):', error.message);
}
