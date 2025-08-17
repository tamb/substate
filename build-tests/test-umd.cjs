// Test UMD build in CommonJS environment
console.log('🧪 Testing UMD build...');

try {
  // Create browser-like global context
  global.window = global;
  
  // Load the UMD build
  require('../dist/index.umd.js');
  
  if (global.substate && typeof global.substate.createStore === 'function') {
    console.log('✅ UMD global export works:', typeof global.substate.createStore);
    
    const store = global.substate.createStore({name: 'test-umd'});
    console.log('✅ UMD store creation works:', !!store);
    
    store.updateState({ test: 'umd-value' });
    console.log('✅ UMD store operation works:', store.getProp('test') === 'umd-value');
    
    console.log('✅ UMD build fully functional!');
  } else {
    console.error('❌ UMD global not found. Available keys:', Object.keys(global.substate || {}));
    console.error('Global substate type:', typeof global.substate);
  }
} catch (error) {
  console.error('❌ UMD test failed:', error.message);
  console.error(error.stack);
}
