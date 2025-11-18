import { useRef, useState } from 'react';
import { Upload, CheckCircle2, Loader2 } from 'lucide-react';

type ProcessingState = 'idle' | 'uploaded' | 'processing' | 'complete';

interface UploadPanelProps {
  processingState: ProcessingState;
  fileName: string;
  onFileUpload: (file: File) => void;
  onStartProcessing: () => void;
  onNewUpload: () => void;
}

function UploadPanel({
  processingState,
  fileName,
  onFileUpload,
  onStartProcessing,
  onNewUpload,
}: UploadPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.pdb') || file.name.endsWith('.map'))) {
      onFileUpload(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleClick = () => {
    if (processingState === 'idle') {
      fileInputRef.current?.click();
    }
  };

  return (
    <div
      className={`glass-card p-8 rounded-2xl transition-all duration-500 ${
        processingState === 'processing' ? 'processing-glow' : ''
      }`}
    >
      <h2 className="text-2xl font-bold text-cyan-300 mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
          <Upload className="w-5 h-5 text-white" />
        </div>
        Upload PDB or MAP File
      </h2>

      {processingState === 'idle' && (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`upload-zone border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${
            isDragging
              ? 'border-cyan-400 bg-cyan-500/10 scale-105'
              : 'border-cyan-500/30 hover:border-cyan-400/50 hover:bg-cyan-500/5'
          }`}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
              <Upload className="w-10 h-10 text-cyan-400" />
            </div>
            <div>
              <p className="text-lg text-cyan-300 font-medium mb-2">
                Drop your file here or click to browse
              </p>
              <p className="text-sm text-cyan-500/60">
                Accepts .pdb and .map files only
              </p>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdb,.map"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}

      {processingState === 'uploaded' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border border-cyan-500/30 rounded-xl p-6">
            <p className="text-cyan-300/70 text-sm mb-2">File Selected</p>
            <p className="text-cyan-200 font-medium text-lg">{fileName}</p>
          </div>
          <button
            onClick={onStartProcessing}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-lg hover:shadow-neon transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Start Processing
          </button>
        </div>
      )}

      {processingState === 'processing' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border border-cyan-500/30 rounded-xl p-6">
            <p className="text-cyan-300/70 text-sm mb-2">File Selected</p>
            <p className="text-cyan-200 font-medium text-lg">{fileName}</p>
          </div>
          <button
            disabled
            className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-lg flex items-center justify-center gap-3 opacity-90"
          >
            <Loader2 className="w-6 h-6 animate-spin" />
            Processing...
          </button>
        </div>
      )}

      {processingState === 'complete' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-gradient-to-r from-emerald-500/10 to-green-600/10 border border-emerald-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 animate-success" />
              <p className="text-emerald-300 text-sm font-medium">
                Processing Complete
              </p>
            </div>
            <p className="text-emerald-200/80 font-medium text-lg">{fileName}</p>
          </div>
          <button
            onClick={onNewUpload}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold text-lg hover:shadow-neon transition-all duration-300 hover:scale-105 active:scale-95"
          >
            New Upload
          </button>
        </div>
      )}
    </div>
  );
}

export default UploadPanel;
