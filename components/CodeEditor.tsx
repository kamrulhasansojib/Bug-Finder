
import React, { useMemo, useRef, useEffect } from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (val: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const lines = useMemo(() => value.split('\n'), [value]);
  const lineNumbers = useMemo(() => {
    const count = Math.max(lines.length, 30);
    return Array.from({ length: count }, (_, i) => i + 1);
  }, [lines.length]);

  useEffect(() => {
    handleScroll();
  }, [value]);

  const LINE_HEIGHT = 24; 
  const PADDING_TOP = 16; 

  return (
    <div className="relative border border-slate-300 rounded-xl overflow-hidden bg-[#1e1e1e] shadow-2xl h-[500px] md:h-[700px] lg:h-[800px] flex group transition-shadow hover:shadow-indigo-500/10">
      {/* Line numbers column */}
      <div 
        ref={lineNumbersRef}
        className="w-10 md:w-14 bg-[#252526] text-[#858585] text-right select-none code-font text-xs md:text-sm border-r border-slate-700 overflow-hidden"
        style={{
          paddingTop: `${PADDING_TOP}px`,
          paddingRight: '0.5rem md:1rem',
          boxSizing: 'border-box'
        }}
      >
        {lineNumbers.map(n => (
          <div 
            key={n} 
            style={{ 
              height: `${LINE_HEIGHT}px`, 
              lineHeight: `${LINE_HEIGHT}px` 
            }}
          >
            {n}
          </div>
        ))}
        <div style={{ height: '100px' }}></div>
      </div>
      
      {/* Code Input Area */}
      <div className="relative flex-grow h-full bg-transparent overflow-hidden">
        <textarea
          ref={textareaRef}
          onScroll={handleScroll}
          spellCheck={false}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full bg-transparent text-[#d4d4d4] code-font text-xs md:text-sm outline-none resize-none placeholder-[#5a5a5a] overflow-y-auto overflow-x-auto whitespace-pre custom-editor-scrollbar"
          placeholder="// Paste your JavaScript code here..."
          style={{
            tabSize: 2,
            fontFamily: "'Fira Code', monospace",
            lineHeight: `${LINE_HEIGHT}px`,
            paddingTop: `${PADDING_TOP}px`,
            paddingBottom: `${PADDING_TOP}px`,
            paddingLeft: '1rem',
            paddingRight: '1rem',
            boxSizing: 'border-box'
          }}
        />
        
        <div className="absolute top-2 right-4 p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block">
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold bg-slate-800/80 backdrop-blur-sm px-2 py-1 rounded">
            JavaScript Context
          </span>
        </div>
      </div>

      <style>{`
        .custom-editor-scrollbar::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        .custom-editor-scrollbar::-webkit-scrollbar-track {
          background: #1e1e1e;
        }
        .custom-editor-scrollbar::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 6px;
          border: 2px solid #1e1e1e;
        }
        .custom-editor-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #444;
        }
        textarea {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>
    </div>
  );
};

export default CodeEditor;
