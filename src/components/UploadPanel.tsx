import React, { useState, useRef } from 'react';
import { Upload, Activity, Dna, Target, Zap, Microscope, AlertCircle, CheckCircle2, Loader2, FileText, Box, BarChart3, Download, Database } from 'lucide-react';

const API_URL = 'http://localhost:5000';

type ProcessingState = 'idle' | 'uploaded' | 'processing' | 'complete';

const CryoEMDashboard = () => {
  const [processingState, setProcessingState] = useState<ProcessingState>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedVirion, setSelectedVirion] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (uploadedFile: File) => {
    const ext = uploadedFile.name.split('.').pop()?.toLowerCase();
    if (['map', 'mrc', 'pdb', 'ent', 'cif'].includes(ext || '')) {
      setFile(uploadedFile);
      setProcessingState('uploaded');
      setError(null);
    } else {
      setError('Unsupported file format');
    }
  };

  const handleStartProcessing = async () => {
    if (!file) return;

    setProcessingState('processing');
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      setAnalysisResult(result);
      setSelectedVirion(0);
      setProcessingState('complete');
      setActiveTab('overview');
    } catch (err: any) {
      setError(err.message || 'Failed to upload and analyze file');
      setProcessingState('uploaded');
    }
  };

  const handleNewUpload = () => {
    setProcessingState('idle');
    setFile(null);
    setAnalysisResult(null);
    setError(null);
    setSelectedVirion(0);
    setActiveTab('overview');
  };

  const downloadJSON = () => {
    if (!analysisResult) return;
    window.open(`${API_URL}/api/download/${analysisResult.analysis_id}`, '_blank');
  };

  const downloadCSV = () => {
    if (!analysisResult) return;
    window.open(`${API_URL}/api/export_csv/${analysisResult.analysis_id}`, '_blank');
  };

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
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileUpload(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileUpload(selectedFile);
    }
  };

  const handleClick = () => {
    if (processingState === 'idle') {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <style>{`
        .glass-card {
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(96, 165, 250, 0.2);
        }
        .stat-card {
          background: linear-gradient(135deg, rgba(34, 211, 238, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%);
          border: 1px solid rgba(34, 211, 238, 0.2);
          border-radius: 12px;
          padding: 16px;
        }
        .info-card {
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid rgba(96, 165, 250, 0.2);
          border-radius: 12px;
          padding: 20px;
        }
        .processing-glow {
          animation: glow 2s ease-in-out infinite;
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(34, 211, 238, 0.3); }
          50% { box-shadow: 0 0 40px rgba(34, 211, 238, 0.6); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slideUp 0.6s ease-out;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="glass-card rounded-2xl p-8 mb-6 animate-fade-in">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-3">
            Cryo-EM Analysis Dashboard
          </h1>
          <p className="text-cyan-300/70 text-lg">
            Upload and analyze cryo-EM density maps and PDB structures with ML-powered classification
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Panel */}
          <div className={`glass-card p-8 rounded-2xl transition-all duration-500 ${
            processingState === 'processing' ? 'processing-glow' : ''
          }`}>
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
                className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${
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
                      Accepts .map, .mrc, .pdb, .ent, .cif files (max 500MB)
                    </p>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".map,.mrc,.pdb,.ent,.cif"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            )}

            {processingState === 'uploaded' && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border border-cyan-500/30 rounded-xl p-6">
                  <p className="text-cyan-300/70 text-sm mb-2">File Selected</p>
                  <p className="text-cyan-200 font-medium text-lg">{file?.name}</p>
                </div>
                <button
                  onClick={handleStartProcessing}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  Start Processing
                </button>
              </div>
            )}

            {processingState === 'processing' && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border border-cyan-500/30 rounded-xl p-6">
                  <p className="text-cyan-300/70 text-sm mb-2">File Selected</p>
                  <p className="text-cyan-200 font-medium text-lg">{file?.name}</p>
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
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    <p className="text-emerald-300 text-sm font-medium">
                      Processing Complete
                    </p>
                  </div>
                  <p className="text-emerald-200/80 font-medium text-lg">{file?.name}</p>
                </div>
                <button
                  onClick={handleNewUpload}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  New Upload
                </button>
              </div>
            )}

            {error && (
              <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start animate-fade-in">
                <AlertCircle className="w-5 h-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-red-300">{error}</p>
              </div>
            )}
          </div>

          {/* Results Panel */}
          <div>
            {(processingState === 'idle' || processingState === 'uploaded') && (
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
            )}

            {processingState === 'processing' && (
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
            )}

            {processingState === 'complete' && analysisResult && (
              <div className="glass-card p-8 rounded-2xl animate-slide-up">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-cyan-300">Quick Overview</h2>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="stat-card">
                    <p className="text-cyan-400/70 text-sm mb-1">File Type</p>
                    <p className="text-cyan-200 text-xl font-semibold">{analysisResult.file_info.file_type}</p>
                  </div>
                  <div className="stat-card">
                    <p className="text-cyan-400/70 text-sm mb-1">Size</p>
                    <p className="text-cyan-200 text-xl font-semibold">{analysisResult.file_info.size_mb} MB</p>
                  </div>
                  <div className="stat-card">
                    <p className="text-cyan-400/70 text-sm mb-1">Virions Detected</p>
                    <p className="text-emerald-400 text-xl font-bold">{analysisResult.processing_stats.num_virions}</p>
                  </div>
                  <div className="stat-card">
                    <p className="text-cyan-400/70 text-sm mb-1">Points Processed</p>
                    <p className="text-cyan-200 text-xl font-semibold">{analysisResult.processing_stats.points_after_cleaning.toLocaleString()}</p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('virions')}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
                >
                  View Detailed Results
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Results Section */}
        {processingState === 'complete' && analysisResult && (
          <div className="mt-6 animate-fade-in">
            {/* Tabs */}
            <div className="glass-card rounded-2xl mb-6 overflow-hidden">
              <div className="flex border-b border-cyan-500/20">
                {['overview', 'virions', 'visualizations', '3d-models'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-4 px-6 font-medium transition-all ${
                      activeTab === tab
                        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border-b-2 border-cyan-400 text-cyan-300'
                        : 'text-cyan-500/60 hover:text-cyan-400 hover:bg-cyan-500/5'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* File Info */}
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-cyan-300 mb-4 flex items-center">
                    <FileText className="w-6 h-6 mr-2" />
                    File Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-cyan-500/5 rounded-lg">
                      <span className="text-cyan-400/70">Filename</span>
                      <span className="text-cyan-200 font-medium">{analysisResult.file_info.filename}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-cyan-500/5 rounded-lg">
                      <span className="text-cyan-400/70">Type</span>
                      <span className="text-cyan-200 font-medium">{analysisResult.file_info.file_type}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-cyan-500/5 rounded-lg">
                      <span className="text-cyan-400/70">Size</span>
                      <span className="text-cyan-200 font-medium">{analysisResult.file_info.size_mb} MB</span>
                    </div>
                    {analysisResult.file_info.map_shape && (
                      <div className="flex justify-between items-center p-3 bg-cyan-500/5 rounded-lg">
                        <span className="text-cyan-400/70">Dimensions</span>
                        <span className="text-cyan-200 font-medium">{analysisResult.file_info.map_shape.join(' × ')}</span>
                      </div>
                    )}
                    {analysisResult.file_info.atom_count && (
                      <div className="flex justify-between items-center p-3 bg-cyan-500/5 rounded-lg">
                        <span className="text-cyan-400/70">Atoms</span>
                        <span className="text-cyan-200 font-medium">{analysisResult.file_info.atom_count.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Processing Stats */}
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-cyan-300 mb-4 flex items-center">
                    <Activity className="w-6 h-6 mr-2" />
                    Processing Statistics
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="stat-card">
                      <p className="text-cyan-400/70 text-sm mb-1">Points Extracted</p>
                      <p className="text-2xl font-bold text-blue-400">{analysisResult.processing_stats.total_points_extracted.toLocaleString()}</p>
                    </div>
                    <div className="stat-card">
                      <p className="text-cyan-400/70 text-sm mb-1">After Cleaning</p>
                      <p className="text-2xl font-bold text-green-400">{analysisResult.processing_stats.points_after_cleaning.toLocaleString()}</p>
                    </div>
                    <div className="stat-card">
                      <p className="text-cyan-400/70 text-sm mb-1">Virions Detected</p>
                      <p className="text-2xl font-bold text-purple-400">{analysisResult.processing_stats.num_virions}</p>
                    </div>
                    <div className="stat-card">
                      <p className="text-cyan-400/70 text-sm mb-1">Points Removed</p>
                      <p className="text-2xl font-bold text-orange-400">{analysisResult.processing_stats.points_removed.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Download Section */}
                <div className="glass-card rounded-2xl p-6 lg:col-span-2">
                  <h3 className="text-xl font-bold text-cyan-300 mb-4 flex items-center">
                    <Download className="w-6 h-6 mr-2" />
                    Export Results
                  </h3>
                  <div className="flex gap-4">
                    <button
                      onClick={downloadJSON}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/50 transition-all flex items-center justify-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      Download JSON
                    </button>
                    <button
                      onClick={downloadCSV}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg hover:shadow-green-500/50 transition-all flex items-center justify-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      Download CSV
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'virions' && (
              <>
                {/* Virion Selector */}
                <div className="glass-card rounded-2xl p-6 mb-6">
                  <h3 className="text-xl font-bold text-cyan-300 mb-4">Select Virion</h3>
                  <div className="flex gap-2 flex-wrap">
                    {analysisResult.virions.map((virion: any, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedVirion(idx)}
                        className={`py-3 px-6 rounded-xl font-medium transition-all ${
                          selectedVirion === idx
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/50'
                            : 'bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 border border-cyan-500/30'
                        }`}
                      >
                        Virion {virion.virion_id}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Virion Details */}
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-cyan-300 mb-4 flex items-center">
                    <Box className="w-6 h-6 mr-2" />
                    Virion {analysisResult.virions[selectedVirion].virion_id} - Details
                  </h3>

                  {/* Classification */}
                  <div className="mb-6 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-purple-500/30 rounded-xl">
                    <h4 className="font-bold text-cyan-300 mb-3 flex items-center">
                      <CheckCircle2 className="w-5 h-5 mr-2 text-green-400" />
                      Classification Result
                    </h4>
                    <p className="text-3xl font-bold text-purple-400 mb-2">
                      {analysisResult.virions[selectedVirion].classification.predicted_label}
                    </p>
                    <p className="text-cyan-300/70 mb-4">
                      Confidence: <span className="font-bold text-green-400">{(analysisResult.virions[selectedVirion].classification.confidence * 100).toFixed(1)}%</span>
                    </p>
                    <div className="space-y-3">
                      {Object.entries(analysisResult.virions[selectedVirion].classification.probabilities || {}).map(([cls, prob]: [string, any]) => (
                        <div key={cls}>
                          <div className="flex justify-between text-sm mb-1 text-cyan-300">
                            <span>{cls}</span>
                            <span className="font-medium">{(prob * 100).toFixed(1)}%</span>
                          </div>
                          <div className="h-2 bg-cyan-900/30 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                              style={{ width: `${prob * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <h4 className="font-bold text-cyan-300 mb-3">Extracted Features</h4>
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {Object.entries(analysisResult.virions[selectedVirion].features).map(([key, value]: [string, any]) => (
                      <div key={key} className="stat-card">
                        <p className="text-xs text-cyan-400/70 mb-1">{key.replace(/_/g, ' ').toUpperCase()}</p>
                        <p className="font-bold text-cyan-200">
                          {typeof value === 'number' ? value.toFixed(4) : value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Statistics */}
                  <h4 className="font-bold text-cyan-300 mb-3">Spatial Statistics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between p-3 bg-cyan-500/5 rounded-lg">
                      <span className="text-cyan-400/70">Centroid (X, Y, Z)</span>
                      <span className="text-cyan-200 font-medium">
                        {analysisResult.virions[selectedVirion].statistics.centroid.map((v: number) => v.toFixed(2)).join(', ')}
                      </span>
                    </div>
                    <div className="flex justify-between p-3 bg-cyan-500/5 rounded-lg">
                      <span className="text-cyan-400/70">Std Dev (X, Y, Z)</span>
                      <span className="text-cyan-200 font-medium">
                        {analysisResult.virions[selectedVirion].statistics.std_dev.map((v: number) => v.toFixed(2)).join(', ')}
                      </span>
                    </div>
                    <div className="flex justify-between p-3 bg-cyan-500/5 rounded-lg">
                      <span className="text-cyan-400/70">X Range</span>
                      <span className="text-cyan-200 font-medium">
                        [{analysisResult.virions[selectedVirion].statistics.coord_range.x.map((v: number) => v.toFixed(2)).join(' to ')}]
                      </span>
                    </div>
                    <div className="flex justify-between p-3 bg-cyan-500/5 rounded-lg">
                      <span className="text-cyan-400/70">Y Range</span>
                      <span className="text-cyan-200 font-medium">
                        [{analysisResult.virions[selectedVirion].statistics.coord_range.y.map((v: number) => v.toFixed(2)).join(' to ')}]
                      </span>
                    </div>
                    <div className="flex justify-between p-3 bg-cyan-500/5 rounded-lg">
                      <span className="text-cyan-400/70">Z Range</span>
                      <span className="text-cyan-200 font-medium">
                        [{analysisResult.virions[selectedVirion].statistics.coord_range.z.map((v: number) => v.toFixed(2)).join(' to ')}]
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'visualizations' && (
              <div className="space-y-6">
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-cyan-300 mb-4 flex items-center">
                    <BarChart3 className="w-6 h-6 mr-2" />
                    Density Distribution
                  </h3>
                  <img 
                    src={`data:image/png;base64,${analysisResult.visualizations.density_histogram}`}
                    alt="Density Histogram"
                    className="w-full rounded-xl border border-cyan-500/20"
                  />
                </div>

                <div className="glass-card rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-cyan-300 mb-4">Cluster Projections</h3>
                  <img 
                    src={`data:image/png;base64,${analysisResult.visualizations.cluster_projections}`}
                    alt="Cluster Projections"
                    className="w-full rounded-xl border border-cyan-500/20"
                  />
                </div>

                <div className="glass-card rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-cyan-300 mb-4">Feature Comparison</h3>
                  <img 
                    src={`data:image/png;base64,${analysisResult.visualizations.feature_comparison}`}
                    alt="Feature Comparison"
                    className="w-full rounded-xl border border-cyan-500/20"
                  />
                </div>
              </div>
            )}

            {activeTab === '3d-models' && (
              <>
                {/* Virion Selector */}
                <div className="glass-card rounded-2xl p-6 mb-6">
                  <h3 className="text-xl font-bold text-cyan-300 mb-4">Select Virion</h3>
                  <div className="flex gap-2 flex-wrap">
                    {analysisResult.virions.map((virion: any, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedVirion(idx)}
                        className={`py-3 px-6 rounded-xl font-medium transition-all ${
                          selectedVirion === idx
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/50'
                            : 'bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 border border-cyan-500/30'
                        }`}
                      >
                        Virion {virion.virion_id}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3D Model Info */}
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-cyan-300 mb-4 flex items-center">
                    <Database className="w-6 h-6 mr-2" />
                    3D Point Cloud Data
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="stat-card">
                      <p className="text-cyan-400/70 text-sm mb-2">Original Points</p>
                      <p className="text-2xl font-bold text-cyan-200">
                        {analysisResult.model_3d[selectedVirion].original_points.toLocaleString()}
                      </p>
                    </div>
                    <div className="stat-card">
                      <p className="text-cyan-400/70 text-sm mb-2">Displayed Points</p>
                      <p className="text-2xl font-bold text-cyan-200">
                        {analysisResult.model_3d[selectedVirion].displayed_points.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="info-card mb-4">
                    <p className="text-cyan-300/70 text-sm mb-3">
                      Downsampling applied for optimal web visualization performance
                    </p>
                    <div className="space-y-2">
                      <p className="text-xs text-cyan-400/70 mb-2">Bounds (Angstroms):</p>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-cyan-500/5 rounded-lg p-3">
                          <p className="font-bold text-cyan-300 text-sm mb-1">Min</p>
                          <p className="text-cyan-200/80 text-xs">
                            {analysisResult.model_3d[selectedVirion].bounds.min.map((v: number) => v.toFixed(1)).join(', ')}
                          </p>
                        </div>
                        <div className="bg-cyan-500/5 rounded-lg p-3">
                          <p className="font-bold text-cyan-300 text-sm mb-1">Max</p>
                          <p className="text-cyan-200/80 text-xs">
                            {analysisResult.model_3d[selectedVirion].bounds.max.map((v: number) => v.toFixed(1)).join(', ')}
                          </p>
                        </div>
                        <div className="bg-cyan-500/5 rounded-lg p-3">
                          <p className="font-bold text-cyan-300 text-sm mb-1">Center</p>
                          <p className="text-cyan-200/80 text-xs">
                            {analysisResult.model_3d[selectedVirion].bounds.center.map((v: number) => v.toFixed(1)).join(', ')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <p className="text-cyan-300/70 text-sm italic">
                      Note: Integrate Three.js or similar library for interactive 3D visualization of the point cloud data
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CryoEMDashboard;