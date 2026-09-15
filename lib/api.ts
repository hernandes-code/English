import type { DashboardData, LearningAnalytics, SessionDetail, SessionRow, SkillDetail } from './types';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://rhbmgrwyxeexemtgqcto.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? 'sb_publishable_YxLVkClflfHL0akAQw9T7g_oAP3nBkN';

async function rpc<T>(name: string, body: Record<string, unknown>, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${name}`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    signal,
    cache: 'no-store',
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Supabase RPC ${name} failed`);
  }

  return response.json() as Promise<T>;
}

export const learningApi = {
  dashboard: (code: string, signal?: AbortSignal) =>
    rpc<DashboardData>('app_get_dashboard_with_code', { p_code: code }, signal),
  sessions: (code: string, limit = 100, offset = 0, signal?: AbortSignal) =>
    rpc<SessionRow[]>('app_get_session_history_with_code', { p_code: code, p_limit: limit, p_offset: offset }, signal),
  skill: (code: string, skillId: string, signal?: AbortSignal) =>
    rpc<SkillDetail>('app_get_skill_detail_with_code', { p_code: code, p_skill_id: skillId }, signal),
  session: (code: string, sessionId: number, signal?: AbortSignal) =>
    rpc<SessionDetail>('app_get_session_detail_with_code', { p_code: code, p_session_id: sessionId }, signal),
  analytics: (code: string, signal?: AbortSignal) =>
    rpc<LearningAnalytics>('app_get_learning_analytics_with_code', { p_code: code }, signal),
};
