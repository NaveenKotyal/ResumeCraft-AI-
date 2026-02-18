import { useState } from 'react';
import { analyzeResume } from '../api/client';
import { MarkdownContent } from './MarkdownContent';

export function ResumeAnalyzer() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    setError('');
    setResult('');
    setLoading(true);
    try {
      const analysis = await analyzeResume();
      setResult(analysis);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Analysis failed';
      setError(msg === 'Failed to fetch'
        ? 'Could not reach the server. Is the backend running at http://127.0.0.1:8000?'
        : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white">Resume Analyzer</h2>
        <p className="text-slate-400 mt-1">Get AI feedback on your resume: score, strengths, gaps, and improvement suggestions.</p>
      </div>
      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium disabled:opacity-50 transition-colors"
      >
        {loading ? 'Analyzing...' : 'Analyze Resume'}
      </button>
      {error && <p className="text-red-400 mt-4">{error}</p>}
      {result && (
        <div className="mt-8 p-6 rounded-xl bg-slate-900/60 border border-slate-700/50 animate-fade-in">
          <MarkdownContent content={result} />
        </div>
      )}
    </div>
  );
}
