import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider, useTheme } from '@/components/ThemeProvider';
import { ThemeToggle } from '@/components/ThemeToggle';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

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

// Test component that uses the theme
function TestComponent() {
  const { theme, actualTheme, setTheme } = useTheme();
  
  return (
    <div>
      <span data-testid="current-theme">{theme}</span>
      <span data-testid="actual-theme">{actualTheme}</span>
      <button onClick={() => setTheme('dark')} data-testid="set-dark">
        Set Dark
      </button>
      <button onClick={() => setTheme('light')} data-testid="set-light">
        Set Light
      </button>
      <button onClick={() => setTheme('system')} data-testid="set-system">
        Set System
      </button>
    </div>
  );
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    document.documentElement.className = '';
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render with default theme', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('system');
  });

  it('should load theme from localStorage', () => {
    localStorageMock.getItem.mockReturnValue('dark');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
  });

  it('should set theme and save to localStorage', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByTestId('set-dark'));

    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith('uztrain-theme', 'dark');
  });

  it('should apply theme class to document element', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByTestId('set-dark'));

    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });

  it('should handle system theme preference', () => {
    // Mock system preference for dark mode
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('actual-theme')).toHaveTextContent('dark');
  });

  it('should update meta theme-color', async () => {
    // Add meta theme-color element
    const metaElement = document.createElement('meta');
    metaElement.name = 'theme-color';
    metaElement.content = '#ffffff';
    document.head.appendChild(metaElement);

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByTestId('set-dark'));

    await waitFor(() => {
      expect(metaElement.content).toBe('#0f0f17');
    });

    // Cleanup
    document.head.removeChild(metaElement);
  });
});

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
  });

  it('should render theme toggle button', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should open dropdown when clicked', async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText('Light')).toBeInTheDocument();
      expect(screen.getByText('Dark')).toBeInTheDocument();
      expect(screen.getByText('System')).toBeInTheDocument();
    });
  });

  it('should change theme when option is selected', async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
        <TestComponent />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByRole('button'));
    
    await waitFor(() => {
      expect(screen.getByText('Dark')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Dark'));

    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    });
  });

  it('should show current theme with check mark', async () => {
    localStorageMock.getItem.mockReturnValue('dark');

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      const darkOption = screen.getByText('Dark').closest('[role="menuitem"]');
      expect(darkOption).toBeInTheDocument();
    });
  });
});

describe('Theme System Integration', () => {
  it('should persist theme across page reloads', () => {
    // First render with dark theme
    localStorageMock.getItem.mockReturnValue('dark');
    
    const { unmount } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    
    unmount();

    // Second render should load the same theme
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
  });

  it('should handle theme changes in system preference', async () => {
    const mockMatchMedia = vi.fn().mockImplementation(query => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    window.matchMedia = mockMatchMedia;

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // Should start with system theme (dark based on mock)
    expect(screen.getByTestId('actual-theme')).toHaveTextContent('dark');

    // Simulate system theme change to light
    mockMatchMedia.mockImplementation(query => ({
      matches: query === '(prefers-color-scheme: light)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    // Trigger system theme change
    fireEvent.click(screen.getByTestId('set-system'));

    await waitFor(() => {
      expect(screen.getByTestId('actual-theme')).toHaveTextContent('light');
    });
  });
});
