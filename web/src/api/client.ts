const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

function getToken(): string | null {
  return localStorage.getItem('token');
}

function getHeaders(): HeadersInit {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function register(username: string, password: string) {
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Registration failed');
  return data;
}

export async function login(username: string, password: string) {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Login failed');
  return data;
}

export async function uploadResume(file: File) {
  const token = getToken();
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/upload-resume`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Upload failed');
  return data;
}

export async function careerChat(question: string) {
  const res = await fetch(`${API_BASE}/career-chat`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ question }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Chat failed');
  return data.response;
}

export async function analyzeResume() {
  const headers: HeadersInit = {};
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}/analyze-resume`, {
    method: 'POST',
    headers,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(Array.isArray(data.detail) ? data.detail[0]?.msg : (data.detail || 'Analysis failed'));
  return data.analysis;
}

export async function matchJD(jobDescription: string) {
  const res = await fetch(`${API_BASE}/match-jd`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ job_description: jobDescription }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Match failed');
  return data.match;
}

export async function generateCoverLetter(jobDescription: string) {
  const res = await fetch(`${API_BASE}/generate-cover-letter`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ job_description: jobDescription }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Generation failed');
  return data.cover_letter;
}
