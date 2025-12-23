import React from "react";

const Hero: React.FC = () => {
  return (
    <div className="bg-indigo-50 py-12 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
          Find Bugs in Your{" "}
          <span className="text-indigo-600 underline decoration-indigo-200">
            Programming
          </span>{" "}
          Code Instantly
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10">
          A lightning-fast, AI-enhanced debugging tool designed for developers
          and learners. Paste your code, detect syntax errors, and get deep
          logical insights.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <a
            href="#checker"
            className="w-full sm:w-auto px-8 py-3.5 md:py-4 bg-indigo-600 text-white rounded-xl font-bold text-base md:text-lg shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-all active:scale-95 text-center"
          >
            Start Debugging
          </a>
          <a
            href="#how-it-works"
            className="w-full sm:w-auto px-8 py-3.5 md:py-4 bg-white text-indigo-600 border-2 border-indigo-100 rounded-xl font-bold text-base md:text-lg hover:bg-indigo-50 transition-all active:scale-95 text-center"
          >
            Learn More
          </a>
        </div>
      </div>
    </div>
  );
};

export default Hero;
