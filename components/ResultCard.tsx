'use client';

import { useState } from 'react';
import { AnalysisResult, UserInput } from '@/lib/types';
import ScoreGauge from './ScoreGauge';
import { ShieldAlert, ShieldCheck, Shield, ChevronRight, Download, RefreshCw, BrainCircuit, Target, Lightbulb, Building2, Check, Copy } from 'lucide-react';
import { downloadShareCard, copyToClipboard } from '@/lib/share';
import ShareCard from './ShareCard';
import { motion } from 'framer-motion';

export default function ResultCard({ 
  result, 
  userInput, 
  onReset 
}: { 
  result: AnalysisResult; 
  userInput: UserInput;
  onReset: () => void;
}) {

  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleCopyPost = () => {
    copyToClipboard(result.linkedinPost);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareLinkedIn = () => {
    const postText = encodeURIComponent(result.linkedinPost);
    const url = `https://www.linkedin.com/shareArticle?mini=true&url=https%3A%2F%2Famireplaceablebyai.vercel.app&title=Am+I+Replaceable+By+AI%3F&summary=${postText}`;
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=700');
  };

  const handleDownloadImage = async () => {
    setDownloading(true);
    await downloadShareCard('share-card-node', `ai-risk-${userInput.jobTitle.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`);
    setDownloading(false);
  };

  const getRiskIcon = () => {
    if (result.riskScore > 75) return <ShieldAlert className="w-8 h-8 text-red-500" />;
    if (result.riskScore > 50) return <Shield className="w-8 h-8 text-orange-500" />;
    if (result.riskScore > 25) return <Shield className="w-8 h-8 text-yellow-500" />;
    return <ShieldCheck className="w-8 h-8 text-green-500" />;
  };

  const getRiskColor = () => {
    if (result.riskScore > 75) return 'text-red-500 border-red-500/20 bg-red-500/10';
    if (result.riskScore > 50) return 'text-orange-500 border-orange-500/20 bg-orange-500/10';
    if (result.riskScore > 25) return 'text-yellow-500 border-yellow-500/20 bg-yellow-500/10';
    return 'text-green-500 border-green-500/20 bg-green-500/10';
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Top Section: Score & Verdict */}
      <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="flex flex-col items-center">
            <ScoreGauge score={result.riskScore} />
            <div className={`mt-6 px-6 py-2 rounded-full border flex items-center gap-2 font-bold ${getRiskColor()}`}>
              {getRiskIcon()}
              {result.riskLabel}
            </div>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
              {result.verdict}
            </h2>
            <div className="flex flex-wrap gap-4">
              <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 flex-1 min-w-[140px]">
                <div className="text-gray-400 text-sm font-medium mb-1">Career Moat</div>
                <div className="text-2xl font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-500" />
                  {result.careerMoatScore}/100
                </div>
              </div>
              <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 flex-1 min-w-[140px]">
                <div className="text-gray-400 text-sm font-medium mb-1">Human Advantage</div>
                <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-purple-500" />
                  {result.humanAdvantage}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Column Task Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div whileHover={{ y: -5 }} className="bg-gray-900/50 backdrop-blur-xl border border-red-500/20 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
              <span className="text-red-500 font-bold">🤖</span>
            </div>
            <h3 className="font-bold text-white">Highly Automatable</h3>
          </div>
          <ul className="space-y-3">
            {result.automatableTasks.map((task, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-300">
                <ChevronRight className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <span className="text-sm">{task}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="bg-gray-900/50 backdrop-blur-xl border border-yellow-500/20 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
            <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <span className="text-yellow-500 font-bold">🤝</span>
            </div>
            <h3 className="font-bold text-white">AI Assisted</h3>
          </div>
          <ul className="space-y-3">
            {result.aiAssistedTasks.map((task, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-300">
                <ChevronRight className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                <span className="text-sm">{task}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="bg-gray-900/50 backdrop-blur-xl border border-green-500/20 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <span className="text-green-500 font-bold">🛡️</span>
            </div>
            <h3 className="font-bold text-white">Hard to Replace</h3>
          </div>
          <ul className="space-y-3">
            {result.hardToReplaceTasks.map((task, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-300">
                <ChevronRight className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm">{task}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Next Career Move & Mindset */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-900/50 backdrop-blur-xl border border-indigo-500/30 rounded-3xl p-8 shadow-[0_0_30px_rgba(99,102,241,0.1)]">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Target className="w-5 h-5" />
            </div>
            Next Career Move
          </h3>
          <div className="space-y-6">
            <div>
              <div className="text-gray-400 text-sm font-medium mb-2">Recommended Target Title</div>
              <div className="text-xl font-bold text-white">{result.recommendedTitle}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm font-medium mb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Where to Apply
              </div>
              <div className="flex flex-wrap gap-2">
                {result.recommendedCompanies.map((company, i) => (
                  <span key={i} className="px-3 py-1.5 bg-gray-950 border border-indigo-500/20 text-indigo-300 rounded-lg text-sm font-medium">
                    {company}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl border border-amber-500/30 rounded-3xl p-8 shadow-[0_0_30px_rgba(245,158,11,0.1)]">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
              <Lightbulb className="w-5 h-5" />
            </div>
            The AI Mindset Shift
          </h3>
          <div className="text-gray-300 leading-relaxed text-lg italic">
            &quot;{result.aiMindsetShift}&quot;
          </div>
        </div>
      </div>

      {/* Action Plan & Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-900/50 backdrop-blur-xl border border-blue-500/30 rounded-3xl p-8 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">📅</div>
            30-Day Action Plan
          </h3>
          <ul className="space-y-4">
            {result.actionPlan30Days.map((step, i) => (
              <li key={i} className="flex gap-4 p-4 rounded-xl bg-gray-950 border border-gray-800">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white shrink-0">
                  {i + 1}
                </div>
                <div className="text-gray-300 text-sm leading-relaxed">{step}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-8 shadow-[0_0_30px_rgba(168,85,247,0.1)]">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">⚡</div>
            Skills to Build
          </h3>
          <div className="flex flex-wrap gap-3">
            {result.skillsToBuild.map((skill, i) => (
              <div key={i} className="px-4 py-3 bg-gray-950 border border-purple-500/20 text-purple-300 rounded-xl font-medium">
                {skill}
              </div>
            ))}
          </div>
          
          <div className="mt-10 pt-8 border-t border-gray-800">
            <h4 className="text-gray-400 text-sm font-medium mb-4 uppercase tracking-wider">Share your results</h4>
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={handleShareLinkedIn}
                className="flex items-center justify-center gap-2 bg-[#0A66C2] hover:bg-[#004182] text-white py-3 px-4 rounded-xl font-medium transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
                Share on LinkedIn
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleCopyPost}
                  className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white py-3 px-4 rounded-xl font-medium transition-colors border border-gray-700"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy Post'}
                </button>
                <button
                  onClick={handleDownloadImage}
                  disabled={downloading}
                  className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white py-3 px-4 rounded-xl font-medium transition-colors border border-gray-700 disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  {downloading ? 'Saving...' : 'Save Card'}
                </button>
              </div>
            </div>
            <button 
              onClick={onReset}
              className="mt-3 w-full flex items-center justify-center gap-2 bg-transparent hover:bg-gray-800 text-gray-400 hover:text-white py-3 px-4 rounded-xl font-medium transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Try another role
            </button>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 max-w-2xl mx-auto pt-8">
        {result.caveat || "This is not career, hiring, or employment advice. For educational and entertainment purposes only."}
      </div>

      {/* Hidden Share Card purely for image generation - must be off-screen but not zero-sized */}
      <div style={{ position: 'fixed', top: 0, left: '-9999px', pointerEvents: 'none', zIndex: -1 }}>
        <ShareCard result={result} userInput={userInput} />
      </div>
    </div>
  );
}
