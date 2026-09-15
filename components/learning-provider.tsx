'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { learningApi } from '@/lib/api';
import type { DashboardData, LearningAnalytics, SessionDetail, SessionRow, SkillDetail } from '@/lib/types';

const STORAGE_KEY = 'elu_access_code';

type LearningContextValue = {
  code: string;
  dashboard: DashboardData | null;
  status: 'booting' | 'locked' | 'loading' | 'ready' | 'error';
  error: string;
  login: (code: string) => Promise<boolean>;
  logout: () => void;
  refresh: () => Promise<void>;
  loadSessions: () => Promise<SessionRow[]>;
  loadAnalytics: () => Promise<LearningAnalytics>;
  loadSkill: (skillId: string) => Promise<SkillDetail>;
  loadSession: (sessionId: number) => Promise<SessionDetail>;
};

const LearningContext = createContext<LearningContextValue | null>(null);

export function LearningProvider({ children }: { children: React.ReactNode }) {
  const [code, setCode] = useState('');
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [status, setStatus] = useState<LearningContextValue['status']>('booting');
  const [error, setError] = useState('');
  const sessionsCache = useRef<SessionRow[] | null>(null);
  const analyticsCache = useRef<LearningAnalytics | null>(null);

  const authenticate = useCallback(async (value: string, remember = true) => {
    setStatus('loading');
    setError('');
    try {
      const data = await learningApi.dashboard(value);
      setDashboard(data);
      setCode(value);
      if (remember) localStorage.setItem(STORAGE_KEY, value);
      sessionsCache.current = null;
      analyticsCache.current = null;
      setStatus('ready');
      return true;
    } catch (cause) {
      console.error('Dashboard authentication failed', cause);
      setStatus('locked');
      setDashboard(null);
      setError('Access denied. Check the code and try again.');
      return false;
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) void authenticate(stored, false);
    else setStatus('locked');
  }, [authenticate]);

  const refresh = useCallback(async () => {
    if (!code) return;
    try {
      const data = await learningApi.dashboard(code);
      setDashboard(data);
      sessionsCache.current = null;
      analyticsCache.current = null;
      setStatus('ready');
    } catch (cause) {
      console.error('Dashboard refresh failed', cause);
      setError('Could not refresh live learning data.');
      setStatus('error');
    }
  }, [code]);

  useEffect(() => {
    const handleFocus = () => {
      if (code && document.visibilityState === 'visible') void refresh();
    };
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
    };
  }, [code, refresh]);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setCode('');
    setDashboard(null);
    sessionsCache.current = null;
    analyticsCache.current = null;
    setStatus('locked');
    setError('');
  }, []);

  const loadSessions = useCallback(async () => {
    if (!code) throw new Error('Dashboard locked');
    if (sessionsCache.current) return sessionsCache.current;
    const rows = await learningApi.sessions(code);
    sessionsCache.current = rows;
    return rows;
  }, [code]);

  const loadAnalytics = useCallback(async () => {
    if (!code) throw new Error('Dashboard locked');
    if (analyticsCache.current) return analyticsCache.current;
    const data = await learningApi.analytics(code);
    analyticsCache.current = data;
    return data;
  }, [code]);

  const loadSkill = useCallback(async (skillId: string) => {
    if (!code) throw new Error('Dashboard locked');
    return learningApi.skill(code, skillId);
  }, [code]);

  const loadSession = useCallback(async (sessionId: number) => {
    if (!code) throw new Error('Dashboard locked');
    return learningApi.session(code, sessionId);
  }, [code]);

  const value = useMemo<LearningContextValue>(() => ({
    code, dashboard, status, error,
    login: (value: string) => authenticate(value, true),
    logout, refresh, loadSessions, loadAnalytics, loadSkill, loadSession,
  }), [code, dashboard, status, error, authenticate, logout, refresh, loadSessions, loadAnalytics, loadSkill, loadSession]);

  return <LearningContext.Provider value={value}>{children}</LearningContext.Provider>;
}

export function useLearning() {
  const context = useContext(LearningContext);
  if (!context) throw new Error('useLearning must be used inside LearningProvider');
  return context;
}
