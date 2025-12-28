import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ResponsiveDesignHelper } from '@/components/ResponsiveDesignHelper';
import { ThemeProvider } from '@/components/ThemeProvider';

// Mock the theme providers
const mockThemeContext = {
  theme: 'light' as const,
  setTheme: vi.fn(),
  actualTheme: 'light' as const,
};

const mockBrandTheme = {
  isDark: false,
  colors: {
    primary: 'hsl(14 73% 58%)',
    secondary: 'hsl(142 45% 52%)',
    accent: 'hsl(0 0% 24%)',
    background: 'hsl(0 0% 100%)',
    foreground: 'hsl(240 10% 3.9%)',
  },
  gradients: {
    primary: 'linear-gradient(135deg, hsl(14 73% 58%), hsl(142 45% 52%))',
    hero: 'linear-gradient(135deg, hsl(14 73% 58%), hsl(0 0% 24%))',
    brand: 'linear-gradient(135deg, hsl(14 73% 58%) 0%, hsl(142 45% 52%) 50%, hsl(0 0% 24%) 100%)',
  }
};

vi.mock('@/components/ThemeProvider', () => ({
  useTheme: () => mockThemeContext,
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/components/BrandThemeToggle', () => ({
  useBrandTheme: () => mockBrandTheme,
}));

// Mock window.innerWidth and window.innerHeight
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024,
});

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  configurable: true,
  value: 768,
});

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider defaultTheme="light" storageKey="test-theme">
    {children}
  </ThemeProvider>
);

describe('ResponsiveDesignHelper', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset window size
    window.innerWidth = 1024;
    window.innerHeight = 768;
    
    // Mock NODE_ENV to development
    vi.stubEnv('NODE_ENV', 'development');
  });

  it('renders toggle button when closed', () => {
    render(
      <TestWrapper>
        <ResponsiveDesignHelper />
      </TestWrapper>
    );

    const toggleButton = screen.getByRole('button', { 
      name: /open responsive design helper/i 
    });
    expect(toggleButton).toBeInTheDocument();
  });

  it('opens helper panel when toggle button is clicked', async () => {
    render(
      <TestWrapper>
        <ResponsiveDesignHelper />
      </TestWrapper>
    );

    const toggleButton = screen.getByRole('button', { 
      name: /open responsive design helper/i 
    });
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(screen.getByText('Responsive Design')).toBeInTheDocument();
    });
  });

  it('displays current viewport information', async () => {
    render(
      <TestWrapper>
        <ResponsiveDesignHelper />
      </TestWrapper>
    );

    const toggleButton = screen.getByRole('button', { 
      name: /open responsive design helper/i 
    });
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(screen.getByText('Current Viewport')).toBeInTheDocument();
      expect(screen.getByText('1024 × 768px')).toBeInTheDocument();
    });
  });

  it('shows correct breakpoint for current viewport', async () => {
    render(
      <TestWrapper>
        <ResponsiveDesignHelper />
      </TestWrapper>
    );

    const toggleButton = screen.getByRole('button', { 
      name: /open responsive design helper/i 
    });
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument();
    });
  });

  it('displays all breakpoint testing buttons', async () => {
    render(
      <TestWrapper>
        <ResponsiveDesignHelper />
      </TestWrapper>
    );

    const toggleButton = screen.getByRole('button', { 
      name: /open responsive design helper/i 
    });
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(screen.getByText('Mobile')).toBeInTheDocument();
      expect(screen.getByText('Mobile L')).toBeInTheDocument();
      expect(screen.getByText('Tablet')).toBeInTheDocument();
      expect(screen.getByText('Laptop')).toBeInTheDocument();
      expect(screen.getByText('Desktop')).toBeInTheDocument();
    });
  });

  it('applies breakpoint when breakpoint button is clicked', async () => {
    // Mock querySelector to return a test element
    const mockElement = {
      style: {
        maxWidth: '',
        margin: '',
        border: '',
      }
    };
    
    vi.spyOn(document, 'querySelector').mockReturnValue(mockElement as any);

    render(
      <TestWrapper>
        <ResponsiveDesignHelper />
      </TestWrapper>
    );

    const toggleButton = screen.getByRole('button', { 
      name: /open responsive design helper/i 
    });
    fireEvent.click(toggleButton);

    await waitFor(() => {
      const mobileButton = screen.getByRole('button', { name: /mobile/i });
      fireEvent.click(mobileButton);
    });

    expect(mockElement.style.maxWidth).toBe('375px');
    expect(mockElement.style.margin).toBe('0 auto');
  });

  it('resets breakpoint when reset button is clicked', async () => {
    const mockElement = {
      style: {
        maxWidth: '375px',
        margin: '0 auto',
        border: '2px solid red',
      }
    };
    
    vi.spyOn(document, 'querySelector').mockReturnValue(mockElement as any);

    render(
      <TestWrapper>
        <ResponsiveDesignHelper />
      </TestWrapper>
    );

    const toggleButton = screen.getByRole('button', { 
      name: /open responsive design helper/i 
    });
    fireEvent.click(toggleButton);

    await waitFor(() => {
      const resetButton = screen.getByRole('button', { name: /reset to auto/i });
      fireEvent.click(resetButton);
    });

    expect(mockElement.style.maxWidth).toBe('');
    expect(mockElement.style.margin).toBe('');
    expect(mockElement.style.border).toBe('');
  });

  it('toggles grid overlay', async () => {
    render(
      <TestWrapper>
        <ResponsiveDesignHelper />
      </TestWrapper>
    );

    const toggleButton = screen.getByRole('button', { 
      name: /open responsive design helper/i 
    });
    fireEvent.click(toggleButton);

    await waitFor(() => {
      const gridButton = screen.getByRole('button', { name: /grid/i });
      fireEvent.click(gridButton);
    });

    expect(document.body).toHaveClass('show-grid');
  });

  it('updates viewport size on window resize', async () => {
    render(
      <TestWrapper>
        <ResponsiveDesignHelper />
      </TestWrapper>
    );

    const toggleButton = screen.getByRole('button', { 
      name: /open responsive design helper/i 
    });
    fireEvent.click(toggleButton);

    // Change window size
    window.innerWidth = 375;
    window.innerHeight = 667;
    
    // Trigger resize event
    fireEvent(window, new Event('resize'));

    await waitFor(() => {
      expect(screen.getByText('375 × 667px')).toBeInTheDocument();
    });
  });

  it('shows correct breakpoint name for mobile viewport', async () => {
    window.innerWidth = 375;
    
    render(
      <TestWrapper>
        <ResponsiveDesignHelper />
      </TestWrapper>
    );

    const toggleButton = screen.getByRole('button', { 
      name: /open responsive design helper/i 
    });
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(screen.getByText('Mobile')).toBeInTheDocument();
    });
  });

  it('closes helper when close button is clicked', async () => {
    render(
      <TestWrapper>
        <ResponsiveDesignHelper />
      </TestWrapper>
    );

    const toggleButton = screen.getByRole('button', { 
      name: /open responsive design helper/i 
    });
    fireEvent.click(toggleButton);

    await waitFor(() => {
      const closeButton = screen.getByRole('button', { 
        name: /close responsive design helper/i 
      });
      fireEvent.click(closeButton);
    });

    expect(screen.queryByText('Responsive Design')).not.toBeInTheDocument();
  });

  it('does not render in production by default', () => {
    vi.stubEnv('NODE_ENV', 'production');
    
    render(
      <TestWrapper>
        <ResponsiveDesignHelper />
      </TestWrapper>
    );

    expect(screen.queryByRole('button', { 
      name: /open responsive design helper/i 
    })).not.toBeInTheDocument();
  });

  it('renders in production when showInProduction is true', () => {
    vi.stubEnv('NODE_ENV', 'production');
    
    render(
      <TestWrapper>
        <ResponsiveDesignHelper showInProduction={true} />
      </TestWrapper>
    );

    expect(screen.getByRole('button', { 
      name: /open responsive design helper/i 
    })).toBeInTheDocument();
  });

  it('displays design tools section', async () => {
    render(
      <TestWrapper>
        <ResponsiveDesignHelper />
      </TestWrapper>
    );

    const toggleButton = screen.getByRole('button', { 
      name: /open responsive design helper/i 
    });
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(screen.getByText('Design Tools')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /grid/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /ruler/i })).toBeInTheDocument();
    });
  });

  it('shows quick info section', async () => {
    render(
      <TestWrapper>
        <ResponsiveDesignHelper />
      </TestWrapper>
    );

    const toggleButton = screen.getByRole('button', { 
      name: /open responsive design helper/i 
    });
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(screen.getByText(/theme:/i)).toBeInTheDocument();
      expect(screen.getByText(/grid:/i)).toBeInTheDocument();
      expect(screen.getByText(/mode:/i)).toBeInTheDocument();
    });
  });
});
