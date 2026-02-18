import { useState } from 'react';
import { generateCoverLetter } from '../api/client';
import { MarkdownContent } from './MarkdownContent';

export function CoverLetter() {
  const [jobDesc, setJobDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!jobDesc.trim()) return;
    setError('');
    setResult('');
    setLoading(true);
    try {
      const letter = await generateCoverLetter(jobDesc.trim());
      setResult(letter);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result) navigator.clipboard.writeText(result);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white">Cover Letter Generator</h2>
        <p className="text-slate-400 mt-1">Generate a tailored cover letter for any job from your resume.</p>
      </div>
      <textarea
        value={jobDesc}
        onChange={(e) => setJobDesc(e.target.value)}
        placeholder="Paste the job description here..."
        rows={10}
        className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-y mb-4"
      />
      <button
        onClick={handleGenerate}
        disabled={loading || !jobDesc.trim()}
        className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium disabled:opacity-50 transition-colors"
      >
        {loading ? 'Generating...' : 'Generate Cover Letter'}
      </button>
      {error && <p className="text-red-400 mt-4">{error}</p>}
      {result && (
        <div className="mt-8 p-6 rounded-xl bg-slate-900/60 border border-slate-700/50 animate-fade-in">
          <div className="flex justify-end mb-3">
            <button
              onClick={copyToClipboard}
              className="text-sm px-3 py-1 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600"
            >
              Copy
            </button>
          </div>
          <MarkdownContent content={result} />
        </div>
      )}
    </div>
  );
}
