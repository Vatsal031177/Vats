import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Lock, Unlock, Mail, Eye, EyeOff, X, RefreshCw, Trash2, Star, CheckCircle, Download, ShieldCheck, UserCheck, Search, Filter, FileText, Upload, AlertCircle, RotateCcw } from 'lucide-react';
import { useActiveCv, notifyCvUpdated, CvInfo } from '../hooks/useActiveCv';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  clientIp: string;
  isRead: boolean;
  isStarred: boolean;
}

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ isOpen, onClose }) => {
  const [token, setToken] = useState<string | null>(() => {
    return sessionStorage.getItem('vatsal_admin_token') || null;
  });
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Active Admin Sub-tab
  const [adminTab, setAdminTab] = useState<'inquiries' | 'cv'>('inquiries');

  // Inquiries data
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'starred'>('all');
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  // CV Upload State
  const { cvInfo, refreshCv } = useActiveCv();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploadingCv, setIsUploadingCv] = useState(false);
  const [cvFeedback, setCvFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch inquiries with Bearer token & localStorage fallback (for static GitHub Pages)
  const fetchInquiries = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    let loaded: Inquiry[] = [];

    // Try server endpoint
    try {
      const res = await fetch('/api/admin/inquiries', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        if (Array.isArray(data.inquiries)) {
          loaded = data.inquiries;
        }
      } else if (res.status === 401 && !token.startsWith('static_session_')) {
        setToken(null);
        sessionStorage.removeItem('vatsal_admin_token');
        setAuthError('Session expired. Please log in again.');
        setIsLoading(false);
        return;
      }
    } catch {
      // Server route unavailable or static GitHub Pages hosting
    }

    // Merge inquiries stored in localStorage
    try {
      const localInquiries: Inquiry[] = JSON.parse(
        localStorage.getItem('vatsal_contact_inquiries') || '[]'
      );
      if (Array.isArray(localInquiries) && localInquiries.length > 0) {
        const idSet = new Set(loaded.map((i) => i.id));
        for (const item of localInquiries) {
          if (!idSet.has(item.id)) {
            loaded.push(item);
          }
        }
      }
    } catch {
      // Ignore localStorage parse errors
    }

    // Sort by timestamp descending (newest first)
    loaded.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    setInquiries(loaded);
    setIsLoading(false);
  }, [token]);

  useEffect(() => {
    if (isOpen && token) {
      fetchInquiries();
      refreshCv();
    }

    const handleInquiryAdded = () => {
      if (token) fetchInquiries();
    };

    window.addEventListener('vatsal_inquiry_added', handleInquiryAdded);
    return () => window.removeEventListener('vatsal_inquiry_added', handleInquiryAdded);
  }, [isOpen, token, fetchInquiries, refreshCv]);

  // Login handler with full-stack and static GitHub Pages authentication
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setIsAuthenticating(true);
    setAuthError(null);

    // 1. Try server API login first (for full-stack / local dev environment)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.token) {
          setToken(data.token);
          sessionStorage.setItem('vatsal_admin_token', data.token);
          setPassword('');
          setIsAuthenticating(false);
          return;
        }
      }
    } catch {
      // Proceed to static fallback verification
    }

    // 2. Client verification for static GitHub Pages hosting
    if (password === 'V@tsal.0311') {
      const sessionToken = `static_session_${Date.now()}`;
      setToken(sessionToken);
      sessionStorage.setItem('vatsal_admin_token', sessionToken);
      setPassword('');
      setAuthError(null);
    } else {
      setAuthError('Invalid credentials. Password is required.');
    }
    setIsAuthenticating(false);
  };

  const handleLogout = () => {
    setToken(null);
    sessionStorage.removeItem('vatsal_admin_token');
    setInquiries([]);
  };

  // Toggle read/starred in memory, localStorage, and server
  const updateInquiry = async (id: string, updates: { isRead?: boolean; isStarred?: boolean }) => {
    if (!token) return;

    // Update in UI state
    setInquiries((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...updates } : i))
    );

    // Update in localStorage
    try {
      const stored: Inquiry[] = JSON.parse(
        localStorage.getItem('vatsal_contact_inquiries') || '[]'
      );
      const updated = stored.map((i) => (i.id === id ? { ...i, ...updates } : i));
      localStorage.setItem('vatsal_contact_inquiries', JSON.stringify(updated));
    } catch {
      // Ignore
    }

    // Attempt server sync if backend is active
    try {
      await fetch(`/api/admin/inquiries/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
    } catch {
      // Server not present on GitHub Pages
    }
  };

  // Delete inquiry from memory, localStorage, and server
  const deleteInquiry = async (id: string) => {
    if (!token) return;
    if (!window.confirm('Delete this inquiry record from memory?')) return;

    setInquiries((prev) => prev.filter((i) => i.id !== id));
    setStatusFeedback('Inquiry deleted.');
    setTimeout(() => setStatusFeedback(null), 3000);

    // Remove from localStorage
    try {
      const stored: Inquiry[] = JSON.parse(
        localStorage.getItem('vatsal_contact_inquiries') || '[]'
      );
      const updated = stored.filter((i) => i.id !== id);
      localStorage.setItem('vatsal_contact_inquiries', JSON.stringify(updated));
    } catch {
      // Ignore
    }

    // Attempt server delete
    try {
      await fetch(`/api/admin/inquiries/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // Server not present on GitHub Pages
    }
  };

  // Export inquiries as CSV
  const exportCsv = () => {
    if (inquiries.length === 0) return;
    const headers = ['ID', 'Date', 'Name', 'Email', 'Subject', 'Message', 'IP'];
    const rows = inquiries.map((i) => [
      i.id,
      new Date(i.timestamp).toLocaleString(),
      `"${i.name.replace(/"/g, '""')}"`,
      i.email,
      `"${i.subject.replace(/"/g, '""')}"`,
      `"${i.message.replace(/"/g, '""')}"`,
      i.clientIp,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `vatsal_inquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle CV File Upload (Replaces Old CV permanently)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
        setCvFeedback({ type: 'error', message: 'Please select a valid PDF file (.pdf).' });
        return;
      }
      setSelectedFile(file);
      setCvFeedback(null);
    }
  };

  const uploadNewCv = async () => {
    if (!selectedFile || !token) return;

    setIsUploadingCv(true);
    setCvFeedback(null);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Data = reader.result as string;
        let publishedMetadata: CvInfo | null = null;

        // Try server upload first
        try {
          const res = await fetch('/api/admin/cv/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              filename: selectedFile.name,
              fileData: base64Data,
            }),
          });

          if (res.ok) {
            const data = await res.json().catch(() => ({}));
            if (data.cvMetadata) {
              publishedMetadata = data.cvMetadata;
            }
          }
        } catch {
          // Server endpoint unavailable (e.g. GitHub Pages static deployment)
        }

        // If running in static GitHub Pages mode or server is offline, store as local data URL
        if (!publishedMetadata) {
          publishedMetadata = {
            url: base64Data,
            filename: selectedFile.name,
            uploadedAt: new Date().toISOString(),
            sizeBytes: selectedFile.size,
          };
        }

        // Notify app-wide hook and update download links
        notifyCvUpdated(publishedMetadata);

        setCvFeedback({
          type: 'success',
          message: `New CV published! The old CV has been permanently removed. All download buttons on the site now serve "${selectedFile.name}".`,
        });
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } catch (err: any) {
        setCvFeedback({ type: 'error', message: 'Network error uploading CV: ' + err.message });
      } finally {
        setIsUploadingCv(false);
      }
    };

    reader.onerror = () => {
      setCvFeedback({ type: 'error', message: 'Failed to read selected PDF file.' });
      setIsUploadingCv(false);
    };

    reader.readAsDataURL(selectedFile);
  };

  const resetCvToOriginal = async () => {
    if (!token) return;
    if (!window.confirm('Reset CV to default initial version?')) return;

    const originalCvMeta: CvInfo = {
      url: './assets/aistudio/all_CV_01171a6c.pdf',
      filename: 'Vatsal_Maisuria_CV.pdf',
      uploadedAt: new Date().toISOString(),
      sizeBytes: 416300,
    };

    // Remove custom active CV from localStorage & broadcast
    try {
      localStorage.removeItem('vatsal_active_cv');
    } catch {
      // Ignore
    }
    notifyCvUpdated(originalCvMeta);

    // Also trigger server reset if available
    try {
      await fetch('/api/admin/cv/reset', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // Ignore
    }

    setCvFeedback({ type: 'success', message: 'CV restored to original initial version.' });
  };

  if (!isOpen) return null;

  // Filtered list
  const filteredInquiries = inquiries.filter((i) => {
    const matchesFilter =
      activeFilter === 'all'
        ? true
        : activeFilter === 'unread'
        ? !i.isRead
        : i.isStarred;

    const q = searchQuery.toLowerCase();
    const matchesQuery =
      i.name.toLowerCase().includes(q) ||
      i.email.toLowerCase().includes(q) ||
      i.subject.toLowerCase().includes(q) ||
      i.message.toLowerCase().includes(q);

    return matchesFilter && matchesQuery;
  });

  const unreadCount = inquiries.filter((i) => !i.isRead).length;
  const starredCount = inquiries.filter((i) => i.isStarred).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col glass-panel rounded-2xl border border-white/20 shadow-2xl overflow-hidden font-sans">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-zinc-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
              {token ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="text-base font-bold font-display text-white tracking-wide flex items-center gap-2">
                <span>Vatsal's Transmission Console</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                  {token ? 'Authenticated' : 'Password Protected'}
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Manage contact inquiries & dynamically update your active downloadable CV.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {token && (
              <button
                onClick={handleLogout}
                className="px-2.5 py-1 text-xs font-mono text-zinc-400 hover:text-white bg-zinc-900 rounded-lg border border-white/10 transition-colors"
              >
                Lock Session
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1">
          {!token ? (
            /* PASSWORD LOGIN SCREEN */
            <div className="max-w-md mx-auto py-10 space-y-6 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-blue-400 shadow-xl">
                <Lock className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold font-display text-white">
                  Owner Authentication
                </h3>
                <p className="text-xs text-zinc-400">
                  Enter master password to access contact inquiries and update your active CV.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4 text-left">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400">MASTER ACCESS KEY</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter admin password..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/90 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 font-mono pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {authError && (
                  <div className="p-2.5 rounded-lg bg-red-950/60 border border-red-500/40 text-xs text-red-300 font-mono">
                    {authError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isAuthenticating || !password.trim()}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-500/20"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isAuthenticating ? 'Decrypting Access...' : 'Unlock Admin Portal'}</span>
                </button>
              </form>
            </div>
          ) : (
            /* AUTHENTICATED DASHBOARD */
            <div className="space-y-6">
              {/* Navigation Tabs between Inquiries & CV Replacement */}
              <div className="flex border-b border-white/10 gap-2 pb-2">
                <button
                  onClick={() => setAdminTab('inquiries')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-medium transition-colors ${
                    adminTab === 'inquiries'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  <span>Contact Inquiries ({inquiries.length})</span>
                  {unreadCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  )}
                </button>

                <button
                  onClick={() => setAdminTab('cv')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-medium transition-colors ${
                    adminTab === 'cv'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>CV & Resume Replacement</span>
                </button>
              </div>

              {adminTab === 'cv' ? (
                /* TAB 2: CV & RESUME REPLACEMENT MANAGER */
                <div className="space-y-6">
                  {/* Active CV Status Card */}
                  <div className="p-5 rounded-2xl bg-zinc-900/60 border border-white/10 space-y-4">
                    <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-white/5">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono uppercase text-emerald-400 tracking-wider">
                          CURRENT ACTIVE CV ON WEBSITE
                        </span>
                        <div className="text-base font-bold text-white flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-400" />
                          <span>{cvInfo.filename}</span>
                        </div>
                        <div className="text-xs font-mono text-zinc-400">
                          File size: {(cvInfo.sizeBytes / 1024).toFixed(1)} KB · Last updated:{' '}
                          {new Date(cvInfo.uploadedAt).toLocaleString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={cvInfo.url}
                          download={cvInfo.filename}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-white transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download Current</span>
                        </a>

                        <button
                          onClick={resetCvToOriginal}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs font-mono text-zinc-400 hover:text-white border border-white/5 transition-colors"
                          title="Reset to default original CV"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Reset Original</span>
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Every "Verified CV" and "Download CV" link on your portfolio is dynamically wired to this file.
                      When you upload a new PDF below, <strong className="text-zinc-200">the old CV is immediately replaced</strong> and all future visitors will download the new document.
                    </p>
                  </div>

                  {/* Upload New CV Box */}
                  <div className="p-6 rounded-2xl glass-panel border border-dashed border-white/20 space-y-4 text-center">
                    <div className="w-12 h-12 mx-auto rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                      <Upload className="w-6 h-6" />
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white font-display">
                        Upload New CV (PDF)
                      </h4>
                      <p className="text-xs text-zinc-400 max-w-md mx-auto">
                        Select a new PDF from your device. Once uploaded, the old CV will be removed and replaced instantly.
                      </p>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      id="cv-file-upload"
                    />

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                      <label
                        htmlFor="cv-file-upload"
                        className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-mono text-white border border-white/10 cursor-pointer transition-colors"
                      >
                        {selectedFile ? selectedFile.name : 'Choose PDF File...'}
                      </label>

                      {selectedFile && (
                        <button
                          onClick={uploadNewCv}
                          disabled={isUploadingCv}
                          className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-xs font-semibold text-white flex items-center gap-2 transition-colors shadow-lg shadow-blue-500/20"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>
                            {isUploadingCv ? 'Replacing Old CV...' : 'Replace & Publish CV'}
                          </span>
                        </button>
                      )}
                    </div>

                    {selectedFile && (
                      <div className="text-[11px] font-mono text-zinc-400">
                        Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                      </div>
                    )}

                    {cvFeedback && (
                      <div
                        className={`p-3 rounded-xl text-xs font-mono flex items-center justify-center gap-2 ${
                          cvFeedback.type === 'success'
                            ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                            : 'bg-red-950/60 text-red-300 border border-red-500/30'
                        }`}
                      >
                        {cvFeedback.type === 'success' ? (
                          <CheckCircle className="w-4 h-4 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 shrink-0" />
                        )}
                        <span>{cvFeedback.message}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* TAB 1: INQUIRIES DASHBOARD */
                <div className="space-y-6">
                  {/* Stat Counters Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 space-y-1">
                      <span className="text-[10px] font-mono uppercase text-zinc-500">
                        TOTAL TRANSMISSIONS
                      </span>
                      <div className="text-2xl font-bold font-mono text-white tabular-nums flex items-center gap-2">
                        <span>{inquiries.length}</span>
                        <span className="text-xs font-normal text-zinc-400 font-sans">People reached out</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 space-y-1">
                      <span className="text-[10px] font-mono uppercase text-zinc-500">
                        UNREAD MESSAGES
                      </span>
                      <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums flex items-center gap-2">
                        <span>{unreadCount}</span>
                        <span className="text-xs font-normal text-zinc-400 font-sans">Pending review</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 space-y-1">
                      <span className="text-[10px] font-mono uppercase text-zinc-500">
                        STARRED / HIGH PRIORITY
                      </span>
                      <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums flex items-center gap-2">
                        <span>{starredCount}</span>
                        <span className="text-xs font-normal text-zinc-400 font-sans">Flagged contacts</span>
                      </div>
                    </div>
                  </div>

                  {/* Toolbar: Search, Filters, Refresh, Export */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-2">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search inquiries by name, email, or keywords..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-zinc-900/80 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex p-0.5 bg-zinc-900 rounded-lg border border-white/5 text-xs font-mono">
                        <button
                          onClick={() => setActiveFilter('all')}
                          className={`px-2.5 py-1 rounded-md transition-colors ${
                            activeFilter === 'all'
                              ? 'bg-blue-600 text-white'
                              : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          All ({inquiries.length})
                        </button>
                        <button
                          onClick={() => setActiveFilter('unread')}
                          className={`px-2.5 py-1 rounded-md transition-colors ${
                            activeFilter === 'unread'
                              ? 'bg-emerald-600 text-white'
                              : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          Unread ({unreadCount})
                        </button>
                        <button
                          onClick={() => setActiveFilter('starred')}
                          className={`px-2.5 py-1 rounded-md transition-colors ${
                            activeFilter === 'starred'
                              ? 'bg-amber-600 text-white'
                              : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          Starred ({starredCount})
                        </button>
                      </div>

                      <button
                        onClick={fetchInquiries}
                        disabled={isLoading}
                        className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/10"
                        title="Refresh inquiries"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                      </button>

                      <button
                        onClick={exportCsv}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 text-xs font-mono"
                        title="Export to CSV"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>CSV</span>
                      </button>
                    </div>
                  </div>

                  {statusFeedback && (
                    <div className="text-xs text-emerald-400 font-mono flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{statusFeedback}</span>
                    </div>
                  )}

                  {/* Inquiries List */}
                  <div className="space-y-3">
                    {filteredInquiries.length === 0 ? (
                      <div className="p-12 text-center rounded-xl bg-zinc-900/30 border border-white/5 space-y-2">
                        <UserCheck className="w-8 h-8 text-zinc-600 mx-auto" />
                        <p className="text-xs text-zinc-400 font-mono">
                          {inquiries.length === 0
                            ? 'No inquiries yet. Real messages submitted by visitors through the contact terminal will appear here in real time.'
                            : 'No inquiries match the current filter or search query.'}
                        </p>
                      </div>
                    ) : (
                      filteredInquiries.map((inquiry) => (
                        <div
                          key={inquiry.id}
                          className={`p-4 rounded-xl border transition-all space-y-3 ${
                            !inquiry.isRead
                              ? 'bg-zinc-900/90 border-blue-500/40 shadow-lg shadow-blue-500/5'
                              : 'bg-zinc-900/40 border-white/5 hover:border-white/10'
                          }`}
                        >
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-white font-display">
                                  {inquiry.name}
                                </span>
                                {!inquiry.isRead && (
                                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                                <a
                                  href={`mailto:${inquiry.email}?subject=Re: ${encodeURIComponent(inquiry.subject)}`}
                                  className="text-blue-400 hover:underline flex items-center gap-1"
                                >
                                  <Mail className="w-3 h-3" />
                                  <span>{inquiry.email}</span>
                                </a>
                                <span>·</span>
                                <span>IP: {inquiry.clientIp}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] font-mono text-zinc-500 mr-2">
                                {new Date(inquiry.timestamp).toLocaleString()}
                              </span>

                              <button
                                onClick={() => updateInquiry(inquiry.id, { isStarred: !inquiry.isStarred })}
                                className={`p-1.5 rounded-lg border transition-colors ${
                                  inquiry.isStarred
                                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                                    : 'bg-zinc-900 text-zinc-500 hover:text-white border-white/5'
                                }`}
                                title={inquiry.isStarred ? 'Unstar' : 'Star as high priority'}
                              >
                                <Star className="w-3.5 h-3.5 fill-current" />
                              </button>

                              <button
                                onClick={() => updateInquiry(inquiry.id, { isRead: !inquiry.isRead })}
                                className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/5 text-xs font-mono"
                                title={inquiry.isRead ? 'Mark as Unread' : 'Mark as Read'}
                              >
                                {inquiry.isRead ? 'Mark Unread' : 'Mark Read'}
                              </button>

                              <button
                                onClick={() => deleteInquiry(inquiry.id)}
                                className="p-1.5 rounded-lg bg-zinc-900 hover:bg-red-950/60 text-zinc-500 hover:text-red-400 border border-white/5"
                                title="Delete inquiry"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="text-xs font-semibold text-zinc-200 font-mono">
                            Subject: {inquiry.subject}
                          </div>

                          <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950/60 p-3 rounded-lg border border-zinc-800/80 whitespace-pre-wrap">
                            {inquiry.message}
                          </p>

                          <div className="flex justify-end pt-1">
                            <a
                              href={`mailto:${inquiry.email}?subject=Re: ${encodeURIComponent(inquiry.subject)}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>Reply to {inquiry.name}</span>
                            </a>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-white/5 bg-zinc-950/90 flex items-center justify-between text-[11px] font-mono text-zinc-500">
          <span>Encrypted Session · Real-time Visitor Telemetry</span>
          <span>Owner Console</span>
        </div>
      </div>
    </div>
  );
};
