// Quick test to compare object-bystring performance
import { byString } from 'object-bystring';
import { measureTime } from './benchmark-utils.mjs';

console.log('🔬 Testing object-bystring performance');
console.log('=====================================\n');

// Create test object
const testObj = {};
for (let i = 0; i < 1000; i++) {
  testObj[`prop${i}`] = {
    id: i,
    name: `item_${i}`,
    nested: { value: Math.random() }
  };
}

console.log('Testing simple property access...');

// Test simple property access (should be fast)
const simpleAccessResult = measureTime('Simple Access (1M ops)', () => {
  let sum = 0;
  for (let i = 0; i < 1000000; i++) {
    const key = `prop${i % 1000}`;
    sum += testObj[key].id;
  }
  return sum;
});

// Test byString access for simple properties
const byStringSimpleResult = measureTime('byString Simple (1M ops)', () => {
  let sum = 0;
  for (let i = 0; i < 1000000; i++) {
    const key = `prop${i % 1000}`;
    const value = byString(testObj, key);
    sum += value?.id || 0;
  }
  return sum;
});

// Test byString for nested properties  
const byStringNestedResult = measureTime('byString Nested (100K ops)', () => {
  let sum = 0;
  for (let i = 0; i < 100000; i++) {
    const key = `prop${i % 1000}.nested.value`;
    const value = byString(testObj, key);
    sum += value || 0;
  }
  return sum;
});

console.log('\n📊 Results:');
console.log(`Simple Access: ${simpleAccessResult.duration.toFixed(2)}ms`);
console.log(`byString Simple: ${byStringSimpleResult.duration.toFixed(2)}ms (${(byStringSimpleResult.duration / simpleAccessResult.duration * 100).toFixed(1)}% overhead)`);
console.log(`byString Nested: ${byStringNestedResult.duration.toFixed(2)}ms`);

console.log('\n🔍 Performance per operation:');
console.log(`Simple: ${(simpleAccessResult.duration * 1000000 / 1000000).toFixed(3)}μs per access`);
console.log(`byString Simple: ${(byStringSimpleResult.duration * 1000000 / 1000000).toFixed(3)}μs per access`);
console.log(`byString Nested: ${(byStringNestedResult.duration * 1000000 / 100000).toFixed(3)}μs per access`);

// Test object-bystring version
try {
  const pkg = await import('../node_modules/object-bystring/package.json', { with: { type: 'json' } });
  console.log(`\n📦 object-bystring version: ${pkg.default.version}`);
} catch (err) {
  console.log('\n⚠️ Could not detect object-bystring version');
}
