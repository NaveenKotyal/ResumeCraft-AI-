import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import { LoginForm } from './components/LoginForm';
import { UploadResume } from './components/UploadResume';
import { CareerChat } from './components/CareerChat';
import { ResumeAnalyzer } from './components/ResumeAnalyzer';
import { JdMatcher } from './components/JdMatcher';
import { CoverLetter } from './components/CoverLetter';

type Tab = 'upload' | 'chat' | 'analyzer' | 'matcher' | 'cover';

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'upload', label: 'Upload Resume', icon: '📄' },
  { id: 'chat', label: 'Career Chat', icon: '💬' },
  { id: 'analyzer', label: 'Resume Analyzer', icon: '📊' },
  { id: 'matcher', label: 'JD Matcher', icon: '📈' },
  { id: 'cover', label: 'Cover Letter', icon: '✉️' },
];

function AppContent() {
  const [activeTab, setActiveTab] = useState<Tab>('upload');

  const sidebar = (
    <nav className="flex-1 p-4 space-y-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
            activeTab === tab.id
              ? 'bg-sky-600/20 text-sky-400 border border-sky-500/30'
              : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-300'
          }`}
        >
          <span className="text-xl">{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );

  return (
    <Layout sidebar={sidebar}>
      <div className="p-8 max-h-screen overflow-auto">
        {activeTab === 'upload' && <UploadResume />}
        {activeTab === 'chat' && <CareerChat />}
        {activeTab === 'analyzer' && <ResumeAnalyzer />}
        {activeTab === 'matcher' && <JdMatcher />}
        {activeTab === 'cover' && <CoverLetter />}
      </div>
    </Layout>
  );
}

function App() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <header className="p-6 text-center">
          <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
            <span className="text-4xl">💼</span>
            ResumeCraft AI
          </h1>
          <p className="text-slate-400 mt-1">AI Career Copilot</p>
        </header>
        <LoginForm />
      </div>
    );
  }

  return <AppContent />;
}

export default App;
