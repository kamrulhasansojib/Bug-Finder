
import React from 'react';

interface NavbarProps {
  subscriptionCount: number;
  onSubscribe: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ subscriptionCount, onSubscribe }) => {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">CodeBug <span className="text-indigo-600">Finder</span></span>
          </div>
          
          <div className="hidden md:flex space-x-8">
            <a href="#checker" className="text-slate-600 hover:text-indigo-600 transition-colors font-medium">Checker</a>
            <a href="#how-it-works" className="text-slate-600 hover:text-indigo-600 transition-colors font-medium">Features</a>
            <a href="#" className="text-slate-600 hover:text-indigo-600 transition-colors font-medium">Docs</a>
          </div>

          <div className="flex items-center">
             <button 
              onClick={onSubscribe}
              className="group relative bg-indigo-600 text-white pl-5 pr-3 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all active:scale-95 text-sm shadow-md shadow-indigo-100 flex items-center space-x-3"
             >
               <div className="flex items-center space-x-2">
                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                   <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                 </svg>
                 <span>Subscribe</span>
               </div>
               
               {/* Subscription Count Badge Inside Button */}
               <div className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/30 min-w-[24px] text-center text-[11px] font-black group-hover:bg-white/30 transition-colors">
                 {subscriptionCount}
               </div>
             </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
