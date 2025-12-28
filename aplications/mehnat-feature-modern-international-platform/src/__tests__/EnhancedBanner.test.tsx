import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { EnhancedBanner } from '@/components/EnhancedBanner';
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

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => fallback || key,
  }),
}));

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <ThemeProvider defaultTheme="light" storageKey="test-theme">
      {children}
    </ThemeProvider>
  </BrowserRouter>
);

describe('EnhancedBanner', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders banner with content', () => {
    render(
      <TestWrapper>
        <EnhancedBanner />
      </TestWrapper>
    );

    expect(screen.getByText(/Mehnat Muhofazasi Ta'limi/i)).toBeInTheDocument();
    expect(screen.getByText(/Professional xavfsizlik ta'limi/i)).toBeInTheDocument();
  });

  it('displays slide indicators', () => {
    render(
      <TestWrapper>
        <EnhancedBanner />
      </TestWrapper>
    );

    const indicators = screen.getAllByRole('button').filter(button => 
      button.className.includes('rounded-full') && 
      button.className.includes('w-3')
    );
    
    expect(indicators).toHaveLength(3); // Should have 3 slides
  });

  it('shows play/pause button', () => {
    render(
      <TestWrapper>
        <EnhancedBanner />
      </TestWrapper>
    );

    const playPauseButton = screen.getByRole('button', { 
      name: /pause|play/i 
    });
    expect(playPauseButton).toBeInTheDocument();
  });

  it('toggles playback when play/pause button is clicked', () => {
    render(
      <TestWrapper>
        <EnhancedBanner />
      </TestWrapper>
    );

    const playPauseButton = screen.getByRole('button', { 
      name: /pause/i 
    });
    
    fireEvent.click(playPauseButton);
    
    expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();
  });

  it('changes slides when indicators are clicked', async () => {
    render(
      <TestWrapper>
        <EnhancedBanner />
      </TestWrapper>
    );

    const indicators = screen.getAllByRole('button').filter(button => 
      button.className.includes('rounded-full') && 
      button.className.includes('w-3')
    );

    // Click second indicator
    fireEvent.click(indicators[1]);

    await waitFor(() => {
      expect(screen.getByText(/Temir Yo'l Xavfsizligi/i)).toBeInTheDocument();
    });
  });

  it('auto-advances slides', async () => {
    render(
      <TestWrapper>
        <EnhancedBanner />
      </TestWrapper>
    );

    // Initially should show first slide
    expect(screen.getByText(/Mehnat Muhofazasi Ta'limi/i)).toBeInTheDocument();

    // Fast-forward 5 seconds
    vi.advanceTimersByTime(5000);

    await waitFor(() => {
      expect(screen.getByText(/Temir Yo'l Xavfsizligi/i)).toBeInTheDocument();
    });
  });

  it('stops auto-advance when paused', async () => {
    render(
      <TestWrapper>
        <EnhancedBanner />
      </TestWrapper>
    );

    const playPauseButton = screen.getByRole('button', { 
      name: /pause/i 
    });
    
    // Pause the slideshow
    fireEvent.click(playPauseButton);

    // Fast-forward 5 seconds
    vi.advanceTimersByTime(5000);

    // Should still be on first slide
    expect(screen.getByText(/Mehnat Muhofazasi Ta'limi/i)).toBeInTheDocument();
  });

  it('displays stats for current slide', () => {
    render(
      <TestWrapper>
        <EnhancedBanner />
      </TestWrapper>
    );

    // First slide should show stats
    expect(screen.getByText('58')).toBeInTheDocument(); // Qonunlar count
    expect(screen.getByText('20')).toBeInTheDocument(); // Qoidalar count
    expect(screen.getByText('13')).toBeInTheDocument(); // Bannerlar count
  });

  it('shows badge for slides that have one', () => {
    render(
      <TestWrapper>
        <EnhancedBanner />
      </TestWrapper>
    );

    expect(screen.getByText('Yangi')).toBeInTheDocument();
  });

  it('has accessible CTA links', () => {
    render(
      <TestWrapper>
        <EnhancedBanner />
      </TestWrapper>
    );

    const ctaLink = screen.getByRole('link', { 
      name: /kurslarni boshlash/i 
    });
    expect(ctaLink).toBeInTheDocument();
    expect(ctaLink).toHaveAttribute('href', '/qonunlar');
  });

  it('applies correct theme styling', () => {
    render(
      <TestWrapper>
        <EnhancedBanner />
      </TestWrapper>
    );

    const banner = screen.getByText(/Mehnat Muhofazasi Ta'limi/i).closest('.card-professional');
    expect(banner).toBeInTheDocument();
  });

  it('handles dark theme correctly', () => {
    mockThemeContext.actualTheme = 'dark';
    mockBrandTheme.isDark = true;

    render(
      <TestWrapper>
        <EnhancedBanner />
      </TestWrapper>
    );

    expect(screen.getByText(/Mehnat Muhofazasi Ta'limi/i)).toBeInTheDocument();
  });

  it('shows floating decorative elements', () => {
    render(
      <TestWrapper>
        <EnhancedBanner />
      </TestWrapper>
    );

    const container = screen.getByText(/Mehnat Muhofazasi Ta'limi/i).closest('div');
    expect(container?.parentElement).toHaveClass('relative');
  });

  it('displays progress bar when playing', () => {
    render(
      <TestWrapper>
        <EnhancedBanner />
      </TestWrapper>
    );

    // Progress bar should be present when playing
    const progressContainer = document.querySelector('.bg-primary\\/20');
    expect(progressContainer).toBeInTheDocument();
  });

  it('hides progress bar when paused', () => {
    render(
      <TestWrapper>
        <EnhancedBanner />
      </TestWrapper>
    );

    const playPauseButton = screen.getByRole('button', { 
      name: /pause/i 
    });
    
    fireEvent.click(playPauseButton);

    // Progress bar should be hidden when paused
    const progressContainer = document.querySelector('.bg-primary\\/20');
    expect(progressContainer).not.toBeInTheDocument();
  });

  it('cycles through all slides', async () => {
    render(
      <TestWrapper>
        <EnhancedBanner />
      </TestWrapper>
    );

    // Start with first slide
    expect(screen.getByText(/Mehnat Muhofazasi Ta'limi/i)).toBeInTheDocument();

    // Advance to second slide
    vi.advanceTimersByTime(5000);
    await waitFor(() => {
      expect(screen.getByText(/Temir Yo'l Xavfsizligi/i)).toBeInTheDocument();
    });

    // Advance to third slide
    vi.advanceTimersByTime(5000);
    await waitFor(() => {
      expect(screen.getByText(/Interaktiv O'quv Materiallari/i)).toBeInTheDocument();
    });

    // Should cycle back to first slide
    vi.advanceTimersByTime(5000);
    await waitFor(() => {
      expect(screen.getByText(/Mehnat Muhofazasi Ta'limi/i)).toBeInTheDocument();
    });
  });
});
