import { Activity, Dna, Target, Zap, Microscope, AlertCircle } from 'lucide-react';

type ProcessingState = 'idle' | 'uploaded' | 'processing' | 'complete';

interface ResultsPanelProps {
  processingState: ProcessingState;
}

function ResultsPanel({ processingState }: ResultsPanelProps) {
  if (processingState === 'idle' || processingState === 'uploaded') {
    return (
      <div className="glass-card p-8 rounded-2xl flex items-center justify-center min-h-[500px]">
        <div className="text-center space-y-6 animate-float">
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center border border-cyan-500/30">
              <Dna className="w-12 h-12 text-cyan-400" />
            </div>
          </div>
          <p className="text-cyan-300 text-xl font-light max-w-md mx-auto">
            Upload a file to begin Influenza Virus Protein Classification
          </p>
        </div>
      </div>
    );
  }

  if (processingState === 'processing') {
    return (
      <div className="glass-card p-8 rounded-2xl flex items-center justify-center min-h-[500px] processing-glow">
        <div className="text-center space-y-6">
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full blur-xl opacity-50 animate-ping"></div>
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center border border-cyan-500/30 animate-spin-slow">
              <Microscope className="w-12 h-12 text-cyan-400" />
            </div>
          </div>
          <p className="text-cyan-300 text-xl font-medium animate-pulse">
            Analyzing protein structure...
          </p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-8 rounded-2xl space-y-6 animate-slide-up">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-cyan-300">Classification Results</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="stat-card">
          <p className="text-cyan-400/70 text-sm mb-1">Virus Type</p>
          <p className="text-cyan-200 text-xl font-semibold">Influenza A</p>
        </div>
        <div className="stat-card">
          <p className="text-cyan-400/70 text-sm mb-1">Protein Name</p>
          <p className="text-cyan-200 text-xl font-semibold">Hemagglutinin</p>
        </div>
        <div className="stat-card">
          <p className="text-cyan-400/70 text-sm mb-1">Classification Score</p>
          <div className="flex items-baseline gap-2">
            <p className="text-emerald-400 text-xl font-bold">0.943</p>
            <span className="text-emerald-400/60 text-xs">High</span>
          </div>
        </div>
        <div className="stat-card">
          <p className="text-cyan-400/70 text-sm mb-1">Sequence Length</p>
          <p className="text-cyan-200 text-xl font-semibold">487 AA</p>
        </div>
      </div>

      <div className="info-card">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-cyan-300">Functional Domains</h3>
        </div>
        <ul className="space-y-2">
          <li className="flex items-center gap-3 text-cyan-200/80">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
            Receptor Binding Region
          </li>
          <li className="flex items-center gap-3 text-cyan-200/80">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
            Fusion Peptide
          </li>
          <li className="flex items-center gap-3 text-cyan-200/80">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
            HA1 Globular Head
          </li>
          <li className="flex items-center gap-3 text-cyan-200/80">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
            HA2 Stem Domain
          </li>
        </ul>
      </div>

      <div className="info-card">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-cyan-300">Structure Features</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2"></div>
            <div>
              <p className="text-cyan-200/80">Alpha-helix clusters identified</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2"></div>
            <div>
              <p className="text-cyan-200/80">Beta-sheet probability: <span className="text-purple-400 font-semibold">71%</span></p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2"></div>
            <div>
              <p className="text-cyan-200/80">Hydrophobic core compactness: <span className="text-purple-400 font-semibold">High</span></p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2"></div>
            <div>
              <p className="text-cyan-200/80">Disulfide bond alignment consistent with HA patterns</p>
            </div>
          </div>
        </div>
      </div>

      <div className="info-card border-l-4 border-blue-500">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-cyan-300 mb-2">Notes</h3>
            <p className="text-cyan-200/70 leading-relaxed">
              This protein shows hallmark structural features of Influenza A HA glycoproteins with strong receptor-binding potential.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultsPanel;
