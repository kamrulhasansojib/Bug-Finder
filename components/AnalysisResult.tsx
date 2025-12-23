
import React, { useState, useMemo, useRef } from 'react';
import { BugAnalysis } from '../types';

interface AnalysisResultProps {
  analysis: BugAnalysis | null;
  isLoading: boolean;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ analysis, isLoading }) => {
  const [copied, setCopied] = useState(false);
  const containerHeightClass = "h-[500px] md:h-[700px] lg:h-[800px]";
  const codeBodyRef = useRef<HTMLDivElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCodeScroll = () => {
    if (codeBodyRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = codeBodyRef.current.scrollTop;
    }
  };

  const cleanedFixedCode = useMemo(() => {
    if (!analysis?.fixedCode) return '';
    let code = analysis.fixedCode;
    code = code.replace(/^```[a-z]*\n/i, '').replace(/\n```$/i, '').trim();
    return code;
  }, [analysis?.fixedCode]);

  const fixedLines = useMemo(() => {
    if (!cleanedFixedCode) return [];
    return cleanedFixedCode.split('\n');
  }, [cleanedFixedCode]);

  const LINE_HEIGHT = 24; 

  // Robust parsing of the AI suggestion text
  const suggestionBlocks = useMemo(() => {
    if (!analysis?.aiSuggestion) return [];
    
    // Regex to split by "Line X:" or "Line X "
    const regex = /(Line\s+\d+[:\s]+)/gi;
    const parts = analysis.aiSuggestion.split(regex);
    
    const blocks: { line: string, content: string }[] = [];
    let currentLine = "";

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i].trim();
      if (!part) continue;

      if (part.match(/^Line\s+\d+[:\s]+$/i)) {
        currentLine = part.replace(/[:\s]+$/, ''); // Normalize to "Line X"
      } else if (currentLine) {
        blocks.push({ line: currentLine, content: part });
        currentLine = "";
      } else {
        // This is text before any "Line X" was found
        blocks.push({ line: "", content: part });
      }
    }
    return blocks;
  }, [analysis?.aiSuggestion]);

  if (isLoading) {
    return (
      <div className={`bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm flex flex-col items-center justify-center space-y-4 ${containerHeightClass}`}>
        <div className="relative w-16 h-16 md:w-20 md:h-20">
          <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
          <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
        </div>
        <p className="text-slate-600 font-bold text-base md:text-lg animate-pulse text-center">Scanning Code Logic...</p>
        <p className="text-slate-400 text-xs md:text-sm max-w-xs text-center">Gemini is looking for logical flaws and performance bottlenecks.</p>
        <div className="w-full max-w-[200px] md:max-w-xs bg-slate-100 h-2 rounded-full overflow-hidden mt-4">
          <div className="bg-indigo-600 h-full animate-[loading_2s_ease-in-out_infinite]" style={{ width: '40%' }}></div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className={`bg-white border border-slate-200 border-dashed rounded-xl p-6 md:p-10 shadow-sm flex flex-col items-center justify-center text-center space-y-6 ${containerHeightClass}`}>
        <div className="bg-indigo-50 p-6 md:p-8 rounded-3xl">
          <svg className="w-12 h-12 md:w-16 md:h-16 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
        <div className="space-y-3 px-4">
          <p className="text-xl md:text-2xl font-extrabold text-slate-800">Diagnostics Ready</p>
          <p className="text-sm md:text-base text-slate-500 max-w-md">Input your code to receive instant syntax validation and deep logical bug detection using Google's latest models.</p>
        </div>
      </div>
    );
  }

  const getSeverityStyles = () => {
    switch (analysis.severity) {
      case 'error': return 'bg-red-50 border-red-200 text-red-800 ring-4 ring-red-500/5';
      case 'warning': return 'bg-amber-50 border-amber-200 text-amber-800 ring-4 ring-amber-500/5';
      case 'success': return 'bg-emerald-50 border-emerald-200 text-emerald-800 ring-4 ring-emerald-500/5';
      default: return 'bg-slate-50 border-slate-200 text-slate-800';
    }
  };

  const getIcon = () => {
    switch (analysis.severity) {
      case 'error': return (
        <svg className="w-6 h-6 md:w-8 md:h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
      case 'warning': return (
        <svg className="w-6 h-6 md:w-8 md:h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
      case 'success': return (
        <svg className="w-6 h-6 md:w-8 md:h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
  };

  return (
    <div className={`space-y-6 ${containerHeightClass} overflow-y-auto pr-1 md:pr-4 custom-scrollbar pb-20`}>
      {/* Status Banner */}
      <div className={`flex items-start p-4 md:p-6 border rounded-2xl shadow-sm transition-all duration-300 ${getSeverityStyles()}`}>
        <div className="mr-3 md:mr-4 mt-0.5">{getIcon()}</div>
        <div>
          <h4 className="text-lg md:text-xl font-extrabold mb-1">
            {analysis.severity === 'error' ? 'Syntax Violation Detected' : 
             analysis.severity === 'warning' ? 'Logical Optimization Found' : 
             'Standard Validation Clear'}
          </h4>
          <p className="text-sm md:text-base opacity-90 leading-relaxed font-medium">
            {analysis.message}
          </p>
          {analysis.line && (
            <div className="mt-3 md:mt-4 flex items-center space-x-2">
              <span className="bg-red-600 text-white px-2.5 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest">
                Line {analysis.line}
              </span>
              <span className="text-[10px] md:text-xs font-semibold opacity-70">Likely error location</span>
            </div>
          )}
        </div>
      </div>

      {/* Corrected Code / Solution Section */}
      {cleanedFixedCode && (
        <div className="bg-[#1e1e1e] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="bg-[#252526] px-4 md:px-6 py-3 border-b border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-emerald-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-bold text-slate-300 text-[10px] md:text-xs tracking-wider uppercase">Proposed Solution</span>
            </div>
            <button 
              onClick={() => copyToClipboard(cleanedFixedCode)}
              className={`w-full sm:w-auto flex items-center justify-center space-x-2 text-[10px] md:text-xs font-bold px-4 py-2 rounded-lg transition-all duration-200 ${
                copied 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
          </div>
          
          <div className="flex bg-[#1e1e1e] h-[300px] md:h-[400px] overflow-hidden">
             <div 
                ref={lineNumbersRef}
                className="w-8 md:w-12 bg-[#252526] text-[#858585] text-right pr-2 md:pr-3 pt-4 select-none code-font text-[10px] md:text-[12px] border-r border-slate-700 overflow-hidden flex flex-col"
              >
                {fixedLines.map((_, i) => (
                  <div key={i} style={{ height: `${LINE_HEIGHT}px`, lineHeight: `${LINE_HEIGHT}px` }}>{i + 1}</div>
                ))}
             </div>
             <div 
                ref={codeBodyRef}
                onScroll={handleCodeScroll}
                className="flex-grow overflow-auto custom-scrollbar pt-4 px-3 md:px-4"
              >
                <pre className="code-font text-xs md:text-sm text-[#d4d4d4] whitespace-pre block min-w-full leading-6">
                  {cleanedFixedCode}
                </pre>
                <div style={{ height: '40px' }}></div>
             </div>
          </div>
        </div>
      )}

      {/* AI Insights Section */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-slate-50 px-4 md:px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center">
            <svg className="w-5 h-5 md:w-6 md:h-6 text-indigo-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            <span className="font-extrabold text-slate-800 text-[10px] md:text-sm tracking-widest uppercase">Debugging Explanation</span>
          </div>
          <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded-full">AI INSIGHT</span>
        </div>
        <div className="p-4 md:p-6 space-y-4">
          {suggestionBlocks.length > 0 ? (
            suggestionBlocks.map((block, idx) => (
              <div key={idx} className={`${block.line ? 'bg-slate-50 border-l-4 border-indigo-500 p-4' : 'px-4 py-2'} rounded-r-lg transition-all`}>
                {block.line && (
                  <span className="inline-block bg-indigo-600 text-white text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded mb-2 uppercase tracking-tighter">
                    {block.line}
                  </span>
                )}
                <p className={`text-slate-800 ${block.line ? 'font-medium' : 'text-slate-600 italic'} text-sm md:text-base leading-relaxed`}>
                  {block.content}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-slate-400 italic text-sm">
              AI explanation will appear here...
            </div>
          )}

          {/* Logic Summary Section */}
          {analysis.logicalErrorExplanation && (
            <div className="mt-8 pt-6 border-t border-slate-100">
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Logic Summary</h5>
              <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100">
                <p className="text-sm md:text-base text-slate-700 leading-relaxed font-medium">
                  {analysis.logicalErrorExplanation}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Performance Tips */}
      {analysis.performanceTips && (
        <div className="bg-indigo-600 rounded-2xl p-4 md:p-6 text-white shadow-xl shadow-indigo-100">
          <div className="flex items-center mb-3">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-bold text-xs md:text-sm uppercase tracking-wider">Performance Tip</span>
          </div>
          <p className="text-xs md:text-sm text-indigo-50 leading-relaxed">
            {analysis.performanceTips}
          </p>
        </div>
      )}

      <div className="h-12"></div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default AnalysisResult;
