import { useState } from 'react';
import { matchJD } from '../api/client';
import { MarkdownContent } from './MarkdownContent';

export function JdMatcher() {
  const [jobDesc, setJobDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleMatch = async () => {
    if (!jobDesc.trim()) return;
    setError('');
    setResult('');
    setLoading(true);
    try {
      const match = await matchJD(jobDesc.trim());
      setResult(match);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Match failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white">JD Matcher</h2>
        <p className="text-slate-400 mt-1">Paste a job description to see how well your resume matches and get improvement tips.</p>
      </div>
      <textarea
        value={jobDesc}
        onChange={(e) => setJobDesc(e.target.value)}
        placeholder="Paste the full job description here..."
        rows={10}
        className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-y mb-4"
      />
      <button
        onClick={handleMatch}
        disabled={loading || !jobDesc.trim()}
        className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium disabled:opacity-50 transition-colors"
      >
        {loading ? 'Analyzing...' : 'Match Resume'}
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
