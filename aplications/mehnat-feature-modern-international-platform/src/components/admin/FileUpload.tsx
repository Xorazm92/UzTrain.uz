import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Upload, File, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  accept?: string;
  maxSize?: number; // in MB
  currentFile?: string;
  label?: string;
  className?: string;
}

export function FileUpload({
  onFileSelect,
  accept = '*/*',
  maxSize = 10,
  currentFile,
  label = 'Fayl tanlash',
  className,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      alert(`Fayl hajmi ${maxSize}MB dan oshmasligi kerak`);
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);
    
    // Simulate upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    onFileSelect(null);
    setUploadProgress(0);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    inputRef.current?.click();
  };

  return (
    <div className={cn('space-y-2', className)}>
      <Label>{label}</Label>
      
      {/* Current file display */}
      {currentFile && !selectedFile && (
        <div className="flex items-center space-x-2 p-2 border rounded-md bg-muted/50">
          {currentFile.startsWith('data:image') ? (
            <img
              src={currentFile}
              alt="Current file"
              className="w-8 h-8 object-cover rounded"
            />
          ) : (
            <File className="h-4 w-4" />
          )}
          <span className="text-sm truncate flex-1">
            {currentFile.startsWith('data:') ? 'Yuklangan fayl' : currentFile}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              if (currentFile.startsWith('data:')) {
                const link = document.createElement('a');
                link.href = currentFile;
                link.download = 'file';
                link.click();
              } else {
                window.open(currentFile, '_blank');
              }
            }}
          >
            Ko'rish
          </Button>
        </div>
      )}

      {/* Selected file display */}
      {selectedFile && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2 p-2 border rounded-md">
            <File className="h-4 w-4" />
            <span className="text-sm truncate flex-1">{selectedFile.name}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={removeFile}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          {uploadProgress > 0 && uploadProgress < 100 && (
            <Progress value={uploadProgress} className="w-full" />
          )}
        </div>
      )}

      {/* Upload area */}
      {!selectedFile && (
        <div
          className={cn(
            'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50'
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-2">
            Faylni bu yerga sudrab olib keling yoki tanlash uchun bosing
          </p>
          <p className="text-xs text-muted-foreground">
            Maksimal hajm: {maxSize}MB
          </p>
          {accept.includes('image') && (
            <p className="text-xs text-orange-600 mt-1">
              💡 Rasmlar avtomatik siqiladi (800px, 70% sifat)
            </p>
          )}
        </div>
      )}

      <Input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
}
