import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom';
import { vi } from 'vitest';


// runs a clean after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

vi.stubGlobal('scrollTo', () => {});