import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrandThemeToggle, BrandThemeToggleCompact, useBrandTheme } from '@/components/BrandThemeToggle';
import { ThemeProvider } from '@/components/ThemeProvider';

// Mock the ThemeProvider context
const mockSetTheme = vi.fn();
const mockThemeContext = {
  theme: 'light' as const,
  setTheme: mockSetTheme,
  actualTheme: 'light' as const,
};

vi.mock('@/components/ThemeProvider', () => ({
  useTheme: () => mockThemeContext,
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Test component wrapper
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider defaultTheme="light" storageKey="test-theme">
    {children}
  </ThemeProvider>
);

describe('BrandThemeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset localStorage
    localStorage.clear();
  });

  it('renders theme toggle button', () => {
    render(
      <TestWrapper>
        <BrandThemeToggle />
      </TestWrapper>
    );

    const toggleButton = screen.getByRole('button', { name: /theme toggle/i });
    expect(toggleButton).toBeInTheDocument();
  });

  it('opens dropdown menu when clicked', async () => {
    render(
      <TestWrapper>
        <BrandThemeToggle />
      </TestWrapper>
    );

    const toggleButton = screen.getByRole('button', { name: /theme toggle/i });
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(screen.getByText('Kunduzgi')).toBeInTheDocument();
      expect(screen.getByText('Tungi')).toBeInTheDocument();
      expect(screen.getByText('Tizim')).toBeInTheDocument();
    });
  });

  it('changes theme when option is selected', async () => {
    render(
      <TestWrapper>
        <BrandThemeToggle />
      </TestWrapper>
    );

    const toggleButton = screen.getByRole('button', { name: /theme toggle/i });
    fireEvent.click(toggleButton);

    await waitFor(() => {
      const darkOption = screen.getByText('Tungi');
      fireEvent.click(darkOption);
    });

    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('shows current theme preview', async () => {
    render(
      <TestWrapper>
        <BrandThemeToggle />
      </TestWrapper>
    );

    const toggleButton = screen.getByRole('button', { name: /theme toggle/i });
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(screen.getByText(/joriy tema:/i)).toBeInTheDocument();
    });
  });

  it('closes dropdown when clicking outside', async () => {
    render(
      <TestWrapper>
        <BrandThemeToggle />
      </TestWrapper>
    );

    const toggleButton = screen.getByRole('button', { name: /theme toggle/i });
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(screen.getByText('Kunduzgi')).toBeInTheDocument();
    });

    // Click outside
    fireEvent.click(document.body);

    await waitFor(() => {
      expect(screen.queryByText('Kunduzgi')).not.toBeInTheDocument();
    });
  });
});

describe('BrandThemeToggleCompact', () => {
  it('renders compact toggle button', () => {
    render(
      <TestWrapper>
        <BrandThemeToggleCompact />
      </TestWrapper>
    );

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });
    expect(toggleButton).toBeInTheDocument();
  });

  it('cycles through themes when clicked', () => {
    render(
      <TestWrapper>
        <BrandThemeToggleCompact />
      </TestWrapper>
    );

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });
    
    // First click should change to dark
    fireEvent.click(toggleButton);
    expect(mockSetTheme).toHaveBeenCalledWith('dark');

    // Update mock context for next test
    mockThemeContext.theme = 'dark';
    mockThemeContext.actualTheme = 'dark';

    // Second click should change to system
    fireEvent.click(toggleButton);
    expect(mockSetTheme).toHaveBeenCalledWith('system');
  });

  it('applies correct styling based on theme', () => {
    // Test light theme
    render(
      <TestWrapper>
        <BrandThemeToggleCompact />
      </TestWrapper>
    );

    let toggleButton = screen.getByRole('button', { name: /toggle theme/i });
    expect(toggleButton).toHaveClass('hover:bg-brand-orange/10');

    // Test dark theme
    mockThemeContext.actualTheme = 'dark';
    render(
      <TestWrapper>
        <BrandThemeToggleCompact />
      </TestWrapper>
    );

    toggleButton = screen.getByRole('button', { name: /toggle theme/i });
    expect(toggleButton).toBeInTheDocument();
  });
});

describe('useBrandTheme', () => {
  const TestComponent = () => {
    const { isDark, colors, gradients } = useBrandTheme();
    return (
      <div>
        <div data-testid="is-dark">{isDark.toString()}</div>
        <div data-testid="primary-color">{colors.primary}</div>
        <div data-testid="primary-gradient">{gradients.primary}</div>
      </div>
    );
  };

  it('returns correct values for light theme', () => {
    mockThemeContext.actualTheme = 'light';
    
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    expect(screen.getByTestId('is-dark')).toHaveTextContent('false');
    expect(screen.getByTestId('primary-color')).toHaveTextContent('hsl(14 73% 58%)');
  });

  it('returns correct values for dark theme', () => {
    mockThemeContext.actualTheme = 'dark';
    
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    expect(screen.getByTestId('is-dark')).toHaveTextContent('true');
    expect(screen.getByTestId('primary-color')).toHaveTextContent('hsl(14 73% 65%)');
  });

  it('provides brand gradients', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    const gradientElement = screen.getByTestId('primary-gradient');
    expect(gradientElement.textContent).toContain('linear-gradient');
    expect(gradientElement.textContent).toContain('hsl(14 73%');
    expect(gradientElement.textContent).toContain('hsl(142 45%');
  });
});

describe('Theme Integration', () => {
  it('persists theme selection in localStorage', async () => {
    render(
      <TestWrapper>
        <BrandThemeToggle />
      </TestWrapper>
    );

    const toggleButton = screen.getByRole('button', { name: /theme toggle/i });
    fireEvent.click(toggleButton);

    await waitFor(() => {
      const darkOption = screen.getByText('Tungi');
      fireEvent.click(darkOption);
    });

    // Check if setTheme was called (which should handle localStorage)
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('applies correct CSS classes based on theme', () => {
    const TestComponent = () => {
      const { isDark } = useBrandTheme();
      return (
        <div className={isDark ? 'dark-theme' : 'light-theme'}>
          Theme Test
        </div>
      );
    };

    mockThemeContext.actualTheme = 'dark';
    
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    expect(screen.getByText('Theme Test')).toHaveClass('dark-theme');
  });

  it('handles system theme preference', () => {
    // Mock system preference
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    mockThemeContext.theme = 'system';
    mockThemeContext.actualTheme = 'dark';

    render(
      <TestWrapper>
        <BrandThemeToggle />
      </TestWrapper>
    );

    expect(screen.getByRole('button', { name: /theme toggle/i })).toBeInTheDocument();
  });
});
