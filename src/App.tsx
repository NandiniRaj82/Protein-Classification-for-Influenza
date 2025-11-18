import { useState } from 'react';
import UploadPanel from './components/UploadPanel';
import ResultsPanel from './components/ResultsPanel';
import BackgroundEffect from './components/BackgroundEffect';

type ProcessingState = 'idle' | 'uploaded' | 'processing' | 'complete';

function App() {
  const [processingState, setProcessingState] = useState<ProcessingState>('idle');
  const [fileName, setFileName] = useState<string>('');

  const handleFileUpload = (file: File) => {
    setFileName(file.name);
    setProcessingState('uploaded');
  };

  const handleStartProcessing = () => {
    setProcessingState('processing');
    setTimeout(() => {
      setProcessingState('complete');
    }, 2500);
  };

  const handleNewUpload = () => {
    setProcessingState('idle');
    setFileName('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
      <BackgroundEffect />

      <div className="relative z-10 min-h-screen p-4 md:p-8">
        <header className="text-center mb-8 md:mb-12 pt-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent mb-3">
            Protein Classification
          </h1>
          <p className="text-cyan-300/70 text-lg md:text-xl font-light">
            Advanced AI-Powered Influenza Virus Analysis
          </p>
        </header>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <UploadPanel
            processingState={processingState}
            fileName={fileName}
            onFileUpload={handleFileUpload}
            onStartProcessing={handleStartProcessing}
            onNewUpload={handleNewUpload}
          />
          <ResultsPanel processingState={processingState} />
        </div>
      </div>
    </div>
  );
}

export default App;
