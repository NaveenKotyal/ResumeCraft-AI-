import { useState } from 'react';
import { uploadResume } from '../api/client';

export function UploadResume() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setMessage(null);
    setLoading(true);
    try {
      await uploadResume(file);
      setMessage({ type: 'success', text: 'Resume uploaded successfully!' });
      setFile(null);
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Upload failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white">Upload Resume</h2>
        <p className="text-slate-400 mt-1">Upload your PDF resume. It will be used for analysis, chat, and cover letters.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="border-2 border-dashed border-slate-600 rounded-xl p-12 text-center hover:border-sky-500/50 transition-colors">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer block">
            <span className="text-5xl block mb-3">📄</span>
            <span className="text-slate-400">
              {file ? file.name : 'Click or drag to upload PDF'}
            </span>
          </label>
        </div>
        {message && (
          <p className={message.type === 'success' ? 'text-emerald-400' : 'text-red-400'}>
            {message.text}
          </p>
        )}
        <button
          type="submit"
          disabled={!file || loading}
          className="w-full py-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Uploading...' : 'Upload Resume'}
        </button>
      </form>
    </div>
  );
}
