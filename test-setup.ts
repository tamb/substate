import { beforeAll, afterAll, vi } from 'vitest';

// Suppress console.logs during tests
const originalConsoleLog = console.log;
const originalConsoleInfo = console.info;
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

// Suppress all console output during tests
beforeAll(() => {
  console.log = vi.fn();
  console.info = vi.fn();
  console.warn = vi.fn();
  console.error = vi.fn();
});

// Restore console output after tests
afterAll(() => {
  console.log = originalConsoleLog;
  console.info = originalConsoleInfo;
  console.warn = originalConsoleWarn;
  console.error = originalConsoleError;
});

// Alternative: Only suppress performance logs
// beforeAll(() => {
//   const originalLog = console.log;
//   console.log = (...args: any[]) => {
//     // Only suppress logs that contain performance emojis
//     const message = args.join(' ');
//     if (!message.includes('🚀') && !message.includes('📋') && !message.includes('📤') && !message.includes('⚡') && !message.includes('🔍') && !message.includes('🔄') && !message.includes('🏷️') && !message.includes('📡') && !message.includes('⏱️') && !message.includes('📊')) {
//       originalLog(...args);
//     }
//   };
// });
