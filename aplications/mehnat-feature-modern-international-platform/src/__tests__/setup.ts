import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

// Mock window.open
Object.defineProperty(window, 'open', {
  value: vi.fn(),
});

// Mock navigator.clipboard
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn().mockResolvedValue(undefined),
    readText: vi.fn().mockResolvedValue(''),
  },
});

// Mock URL.createObjectURL
Object.defineProperty(URL, 'createObjectURL', {
  value: vi.fn().mockReturnValue('mock-url'),
});

// Mock URL.revokeObjectURL
Object.defineProperty(URL, 'revokeObjectURL', {
  value: vi.fn(),
});

// Mock fetch
global.fetch = vi.fn();

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue?: string) => defaultValue || key,
    i18n: {
      changeLanguage: vi.fn(),
      language: 'en',
    },
  }),
  Trans: ({ children }: { children: React.ReactNode }) => children,
  initReactI18next: {
    type: '3rdParty',
    init: vi.fn(),
  },
}));

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => ({
    pathname: '/',
    search: '',
    hash: '',
    state: null,
  }),
  Link: ({ children, to, ...props }: any) => {
    return React.createElement('a', { href: to, ...props }, children);
  },
  BrowserRouter: ({ children }: { children: React.ReactNode }) => children,
  Routes: ({ children }: { children: React.ReactNode }) => children,
  Route: ({ element }: { element: React.ReactNode }) => element,
}));

// Mock @tanstack/react-query
vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({
    data: null,
    isLoading: false,
    error: null,
    refetch: vi.fn(),
  }),
  useMutation: () => ({
    mutate: vi.fn(),
    isLoading: false,
    error: null,
  }),
  QueryClient: vi.fn().mockImplementation(() => ({
    invalidateQueries: vi.fn(),
    setQueryData: vi.fn(),
    getQueryData: vi.fn(),
  })),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock Supabase
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn().mockReturnValue({
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          data: [],
          error: null,
        }),
      }),
      insert: vi.fn().mockReturnValue({
        data: [],
        error: null,
      }),
      update: vi.fn().mockReturnValue({
        data: [],
        error: null,
      }),
      delete: vi.fn().mockReturnValue({
        data: [],
        error: null,
      }),
    }),
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      signIn: vi.fn().mockResolvedValue({ data: null, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
    },
    storage: {
      from: vi.fn().mockReturnValue({
        upload: vi.fn().mockResolvedValue({ data: null, error: null }),
        download: vi.fn().mockResolvedValue({ data: null, error: null }),
        remove: vi.fn().mockResolvedValue({ data: null, error: null }),
      }),
    },
  }),
}));

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks();
  localStorageMock.clear();
  sessionStorageMock.clear();
});
