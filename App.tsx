
import React, { useState, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CodeEditor from './components/CodeEditor';
import AnalysisResult from './components/AnalysisResult';
import Features from './components/Features';
import Footer from './components/Footer';
import { analyzeCodeWithAI } from './services/geminiService';
import { BugAnalysis, AnalysisStatus } from './types';

const App: React.FC = () => {
  const [code, setCode] = useState<string>('// Paste your code here\nfunction sum(a, b) {\n  return a + b;\n}');
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [analysis, setAnalysis] = useState<BugAnalysis | null>(null);
  const [subscriptionCount, setSubscriptionCount] = useState<number>(0);

  const checkCode = useCallback(async () => {
    if (!code.trim()) {
      alert("Please enter some code to analyze.");
      return;
    }

    setStatus(AnalysisStatus.LOADING);
    setAnalysis(null);

    let syntaxResult: BugAnalysis = {
      isValid: true,
      message: "Syntax check passed! No obvious errors found.",
      type: 'none',
      severity: 'success'
    };

    let syntaxErrorMessage = '';

    try {
      new Function(code);
    } catch (e: any) {
      syntaxErrorMessage = e.message || "Unknown syntax error";
      syntaxResult = {
        isValid: false,
        message: syntaxErrorMessage,
        line: e.lineNumber,
        column: e.columnNumber,
        type: 'syntax',
        severity: 'error'
      };
      
      if (!syntaxResult.line) {
        const lineMatch = syntaxErrorMessage.match(/line (\d+)/i);
        if (lineMatch) syntaxResult.line = parseInt(lineMatch[1]);
      }
    }

    try {
      const aiData = await analyzeCodeWithAI(code, syntaxErrorMessage);
      
      setAnalysis({
        ...syntaxResult,
        ...aiData,
        message: syntaxResult.isValid ? (aiData.type === 'logical' ? 'Possible logical bugs detected.' : syntaxResult.message) : syntaxResult.message,
        severity: syntaxResult.isValid ? (aiData.type === 'logical' ? 'warning' : 'success') : 'error'
      });
      setStatus(AnalysisStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setStatus(AnalysisStatus.ERROR);
      setAnalysis({
        isValid: false,
        message: err.message?.includes("403") 
          ? "API access denied. Please ensure your environment is correctly configured for the Gemini API." 
          : "An unexpected error occurred during AI analysis. Please try again.",
        severity: 'error',
        type: 'runtime'
      });
    }
  }, [code]);

  const clearCode = () => {
    setCode('');
    setAnalysis(null);
    setStatus(AnalysisStatus.IDLE);
  };

  const handleSubscribe = () => {
    setSubscriptionCount(prev => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar subscriptionCount={subscriptionCount} onSubscribe={handleSubscribe} />
      
      <main className="flex-grow">
        <Hero />
        
        <section id="checker" className="py-8 md:py-12 px-4 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            {/* Editor Side */}
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-4">
                <div className="flex flex-col">
                  <h3 className="text-xl md:text-2xl font-bold text-slate-800">Source Code</h3>
                  <p className="text-xs text-slate-500 font-medium">Supports high-volume scripts (1000+ lines)</p>
                </div>
                <div className="flex w-full sm:w-auto space-x-2 sm:space-x-3">
                  <button 
                    onClick={clearCode}
                    className="flex-1 sm:flex-none px-3 py-2 text-xs md:text-sm font-semibold text-slate-500 hover:text-red-600 transition-colors uppercase tracking-wider"
                  >
                    Clear
                  </button>
                  <button 
                    onClick={checkCode}
                    disabled={status === AnalysisStatus.LOADING}
                    className={`flex-1 sm:flex-none px-6 py-2.5 md:px-8 md:py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 transition-all active:scale-95 flex items-center justify-center text-sm md:text-base ${status === AnalysisStatus.LOADING ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {status === AnalysisStatus.LOADING ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 md:h-5 md:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing...
                      </>
                    ) : 'Analyze Code'}
                  </button>
                </div>
              </div>
              <CodeEditor value={code} onChange={setCode} />
            </div>

            {/* Results Side */}
            <div className="flex flex-col h-full pt-8 lg:pt-0">
              <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-6">Analysis & Insights</h3>
              <div className="lg:sticky lg:top-24">
                <AnalysisResult analysis={analysis} isLoading={status === AnalysisStatus.LOADING} />
              </div>
            </div>
          </div>
        </section>

        <Features />
      </main>

      <Footer />
    </div>
  );
};

export default App;
