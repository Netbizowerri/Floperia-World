import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Firebase
vi.mock('../firebase', () => ({
  auth: {
    currentUser: null,
    onAuthStateChanged: vi.fn(),
  },
  db: {},
  googleProvider: {},
  signInWithGoogle: vi.fn(),
}));

// Mock Zustand persist middleware
vi.mock('zustand/middleware', async (importOriginal) => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    persist: (config: any) => (set: any, get: any, api: any) => config(set, get, api),
  };
});
