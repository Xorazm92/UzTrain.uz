import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FileViewer } from '@/components/FileViewer';
import { FilePreview } from '@/components/FilePreview';
import { PowerPointViewer } from '@/components/PowerPointViewer';
import { FileItem } from '@/lib/fileService';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock react-pdf
vi.mock('react-pdf', () => ({
  Document: ({ children, onLoadSuccess, onLoadError }: any) => {
    // Simulate successful PDF load
    setTimeout(() => {
      onLoadSuccess({ numPages: 5 });
    }, 100);
    return <div data-testid="pdf-document">{children}</div>;
  },
  Page: ({ pageNumber, scale, rotation }: any) => (
    <div data-testid={`pdf-page-${pageNumber}`} data-scale={scale} data-rotation={rotation}>
      PDF Page {pageNumber}
    </div>
  ),
  pdfjs: {
    GlobalWorkerOptions: { workerSrc: '' },
    version: '3.0.0'
  }
}));

// Mock window.open
const mockWindowOpen = vi.fn();
Object.defineProperty(window, 'open', {
  value: mockWindowOpen,
});

const mockPdfFile: FileItem = {
  name: 'Test PDF Document',
  path: '/test/document.pdf',
  size: 1024000,
  type: 'pdf',
  category: 'Test Category',
  description: 'A test PDF document',
  tags: ['test', 'pdf', 'document']
};

const mockPptFile: FileItem = {
  name: 'Test PowerPoint Presentation',
  path: '/test/presentation.pptx',
  size: 2048000,
  type: 'pptx',
  category: 'Test Category',
  description: 'A test PowerPoint presentation',
  tags: ['test', 'powerpoint', 'presentation']
};

const mockDocFile: FileItem = {
  name: 'Test Word Document',
  path: '/test/document.docx',
  size: 512000,
  type: 'docx',
  category: 'Test Category',
  description: 'A test Word document',
  tags: ['test', 'word', 'document']
};

describe('FileViewer', () => {
  beforeEach(() => {
    mockWindowOpen.mockClear();
  });

  it('should render file information correctly', () => {
    render(<FileViewer file={mockPdfFile} />);

    expect(screen.getByText('Test PDF Document')).toBeInTheDocument();
    expect(screen.getByText('Test Category')).toBeInTheDocument();
    expect(screen.getByText('A test PDF document')).toBeInTheDocument();
    expect(screen.getByText('PDF')).toBeInTheDocument();
  });

  it('should display file size and tags', () => {
    render(<FileViewer file={mockPdfFile} />);

    expect(screen.getByText('1.00 MB')).toBeInTheDocument();
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('pdf')).toBeInTheDocument();
    expect(screen.getByText('document')).toBeInTheDocument();
  });

  it('should handle download action', () => {
    render(<FileViewer file={mockPdfFile} />);

    const downloadButton = screen.getByText('Yuklab olish');
    fireEvent.click(downloadButton);

    expect(mockWindowOpen).toHaveBeenCalledWith('/test/document.pdf', '_blank');
  });

  it('should open preview dialog', async () => {
    render(<FileViewer file={mockPdfFile} />);

    const previewButton = screen.getByText("Ko'rish");
    fireEvent.click(previewButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('should render compact view', () => {
    render(<FileViewer file={mockPdfFile} compact />);

    // In compact view, should show minimal information
    expect(screen.getByText('Test PDF Document')).toBeInTheDocument();
    expect(screen.getByText('1.00 MB')).toBeInTheDocument();
  });

  it('should show appropriate file type colors', () => {
    const { rerender } = render(<FileViewer file={mockPdfFile} />);
    
    // PDF should have red color
    expect(screen.getByText('PDF')).toHaveClass('bg-red-100', 'text-red-800');

    rerender(<FileViewer file={mockPptFile} />);
    
    // PowerPoint should have orange color
    expect(screen.getByText('PPTX')).toHaveClass('bg-orange-100', 'text-orange-800');

    rerender(<FileViewer file={mockDocFile} />);
    
    // Word should have blue color
    expect(screen.getByText('DOCX')).toHaveClass('bg-blue-100', 'text-blue-800');
  });
});

describe('FilePreview', () => {
  beforeEach(() => {
    mockWindowOpen.mockClear();
  });

  it('should render PDF preview with controls', async () => {
    render(<FilePreview file={mockPdfFile} />);

    await waitFor(() => {
      expect(screen.getByTestId('pdf-document')).toBeInTheDocument();
    });

    // Check for PDF controls
    expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    expect(screen.getByText('1 / 5')).toBeInTheDocument();
  });

  it('should handle PDF navigation', async () => {
    render(<FilePreview file={mockPdfFile} />);

    await waitFor(() => {
      expect(screen.getByTestId('pdf-document')).toBeInTheDocument();
    });

    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText('2 / 5')).toBeInTheDocument();
    });
  });

  it('should handle zoom controls', async () => {
    render(<FilePreview file={mockPdfFile} />);

    await waitFor(() => {
      expect(screen.getByTestId('pdf-document')).toBeInTheDocument();
    });

    const zoomInButton = screen.getByRole('button', { name: /zoom in/i });
    fireEvent.click(zoomInButton);

    // Should show increased zoom percentage
    expect(screen.getByText('120%')).toBeInTheDocument();
  });

  it('should render PowerPoint preview', () => {
    render(<FilePreview file={mockPptFile} />);

    expect(screen.getByText('PowerPoint Prezentatsiya')).toBeInTheDocument();
    expect(screen.getByText('Interaktiv ko\'rish')).toBeInTheDocument();
    expect(screen.getByText('Yuklab olish')).toBeInTheDocument();
    expect(screen.getByText('Online ko\'rish')).toBeInTheDocument();
  });

  it('should render Word document preview', () => {
    render(<FilePreview file={mockDocFile} />);

    expect(screen.getByText('Word hujjat')).toBeInTheDocument();
    expect(screen.getByText('Bu Word hujjatini ko\'rish uchun yuklab oling')).toBeInTheDocument();
  });

  it('should handle preview errors', async () => {
    // Mock PDF loading error
    vi.mocked(require('react-pdf').Document).mockImplementationOnce(({ onLoadError }: any) => {
      setTimeout(() => {
        onLoadError(new Error('Failed to load PDF'));
      }, 100);
      return <div data-testid="pdf-error">Error loading PDF</div>;
    });

    render(<FilePreview file={mockPdfFile} />);

    await waitFor(() => {
      expect(screen.getByText('Xatolik yuz berdi')).toBeInTheDocument();
    });
  });
});

describe('PowerPointViewer', () => {
  beforeEach(() => {
    mockWindowOpen.mockClear();
  });

  it('should render PowerPoint viewer with controls', () => {
    render(<PowerPointViewer file={mockPptFile} />);

    expect(screen.getByText('Test PowerPoint Presentation')).toBeInTheDocument();
    expect(screen.getByText('PPTX')).toBeInTheDocument();
    expect(screen.getByText('Yuklab olish')).toBeInTheDocument();
    expect(screen.getByText('Online ko\'rish')).toBeInTheDocument();
  });

  it('should handle slide navigation', () => {
    render(<PowerPointViewer file={mockPptFile} />);

    const nextButton = screen.getByRole('button', { name: /next/i });
    const prevButton = screen.getByRole('button', { name: /previous/i });

    // Initially should be on slide 1
    expect(screen.getByText('1 / 10')).toBeInTheDocument();

    // Next button should work
    fireEvent.click(nextButton);
    expect(screen.getByText('2 / 10')).toBeInTheDocument();

    // Previous button should work
    fireEvent.click(prevButton);
    expect(screen.getByText('1 / 10')).toBeInTheDocument();
  });

  it('should handle playback controls', () => {
    render(<PowerPointViewer file={mockPptFile} />);

    const playButton = screen.getByRole('button', { name: /play/i });
    fireEvent.click(playButton);

    // Should change to pause button
    expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
  });

  it('should handle download action', () => {
    render(<PowerPointViewer file={mockPptFile} />);

    const downloadButton = screen.getByText('Yuklab olish');
    fireEvent.click(downloadButton);

    expect(mockWindowOpen).toHaveBeenCalledWith('/test/presentation.pptx', '_blank');
  });

  it('should handle online viewing', () => {
    render(<PowerPointViewer file={mockPptFile} />);

    const onlineButton = screen.getByText('Online ko\'rish');
    fireEvent.click(onlineButton);

    expect(mockWindowOpen).toHaveBeenCalledWith(
      expect.stringContaining('view.officeapps.live.com'),
      '_blank'
    );
  });

  it('should display file information', () => {
    render(<PowerPointViewer file={mockPptFile} />);

    expect(screen.getByText('2.00 MB')).toBeInTheDocument();
    expect(screen.getByText('10 ta')).toBeInTheDocument(); // Number of slides
    expect(screen.getByText('A test PowerPoint presentation')).toBeInTheDocument();
  });

  it('should handle loading state', () => {
    render(<PowerPointViewer file={mockPptFile} />);

    // Should show loading skeletons initially
    expect(screen.getAllByTestId(/skeleton/i)).toHaveLength(0); // Assuming skeleton has testid
  });

  it('should handle error state', () => {
    const errorFile = { ...mockPptFile, path: '' };
    render(<PowerPointViewer file={errorFile} />);

    // Should handle gracefully when file path is invalid
    expect(screen.getByText('Test PowerPoint Presentation')).toBeInTheDocument();
  });
});
