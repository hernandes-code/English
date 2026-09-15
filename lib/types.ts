export type NullableNumber = number | null;

export type Player = {
  player_id?: string;
  display_name?: string;
  timezone?: string;
  total_xp?: number;
  coin_balance?: number;
  level?: number;
  current_level_floor_xp?: number;
  next_level_xp?: number;
  level_progress_pct?: number;
};

export type DailyMission = {
  title?: string;
  date?: string;
  is_required?: boolean;
  target_sessions?: number;
  min_session_minutes?: number;
  total_sessions?: number;
  qualifying_sessions?: number;
  remaining_sessions?: number;
  total_minutes?: number;
  qualifying_minutes?: number;
  completed?: boolean;
  reward_xp?: number;
  reward_coins?: number;
  reward_awarded?: boolean;
};

export type DashboardSummary = {
  latest_session?: number;
  total_sessions?: number;
  total_skill_observations?: number;
  latest_benchmark_session?: number;
  current_overall_skill_score_observed?: number;
  skills_due_for_review?: number;
  strong_mastered_automatic?: number;
};

export type SkillState = {
  skill_id: string;
  domain: string;
  skill_name: string;
  strategic_weight?: number;
  current_score?: NullableNumber;
  lifetime_avg?: NullableNumber;
  last_5_avg?: NullableNumber;
  previous_5_avg?: NullableNumber;
  trend?: NullableNumber;
  observations?: number;
  distinct_sessions?: number;
  last_tested_session?: number;
  latest_independence?: NullableNumber;
  transfer_success_rate?: NullableNumber;
  spontaneous_uses?: number;
  confidence?: string;
  status?: string;
  next_review_session?: number;
  review_due?: boolean;
  priority_score?: NullableNumber;
  main_known_issue?: string;
  recommended_focus?: string;
  automatic?: boolean;
};

export type PrioritySkill = Pick<
  SkillState,
  | 'skill_id'
  | 'domain'
  | 'skill_name'
  | 'current_score'
  | 'trend'
  | 'confidence'
  | 'status'
  | 'review_due'
  | 'priority_score'
  | 'main_known_issue'
  | 'recommended_focus'
>;

export type DomainSummary = {
  domain: string;
  current_score?: NullableNumber;
  observed_skills?: number;
};

export type SessionRow = {
  session_id: number;
  session_date: string;
  duration_min?: NullableNumber;
  session_type?: string;
  primary_language_topic?: string;
  secondary_topics?: string;
  marketing_context?: string;
  main_objective?: string;
  exercises_used?: string;
  skills_observed_count?: number;
  strongest_improvement?: string;
  main_difficulty?: string;
  next_priority?: string;
  session_summary?: string;
  is_benchmark?: boolean;
  coach_notes?: string;
  started_at?: string;
  ended_at?: string;
  daypart?: string;
  lifecycle_status?: string;
};

export type Benchmark = {
  benchmark_id?: string;
  session_id?: number;
  benchmark_date?: string;
  overall_score?: NullableNumber;
  fluency?: NullableNumber;
  retrieval_speed?: NullableNumber;
  clarity?: NullableNumber;
  language_accuracy?: NullableNumber;
  professional_communication?: NullableNumber;
  independence?: NullableNumber;
  top_strength?: string;
  top_weakness?: string;
};

export type Sprint = {
  sprint_id?: number;
  status?: string;
  start_session?: number;
  target_end_session?: number;
  completed_sessions?: number;
  sprint_target_min?: number;
  sprint_target_max?: number;
  benchmark_candidate?: boolean;
};

export type RewardEvent = {
  reward_event_id?: number;
  event_type?: string;
  source_type?: string;
  source_key?: string;
  xp_delta?: number;
  coin_delta?: number;
  created_at?: string;
};

export type DashboardData = {
  player?: Player;
  daily_mission?: DailyMission;
  current_weekday_streak?: number;
  summary?: DashboardSummary;
  domains?: DomainSummary[];
  top_priorities?: PrioritySkill[];
  skill_tree?: SkillState[];
  current_sprint?: Sprint;
  last_benchmark?: Benchmark;
  benchmark_history?: Benchmark[];
  recent_sessions?: SessionRow[];
  reward_history?: RewardEvent[];
};

export type Observation = {
  observation_id?: string;
  session_id?: number;
  observation_date?: string;
  skill_id?: string;
  skill_name?: string;
  domain?: string;
  quality?: number;
  independence?: number;
  transfer?: NullableNumber;
  observation_score?: NullableNumber;
  retrieval_result?: string;
  prompted?: boolean;
  spontaneous?: boolean;
  context_task?: string;
  evidence?: string;
  correction_natural_version?: string;
  issue_type?: string;
  error_severity?: string;
  transfer_tested?: boolean;
  review_interval?: number;
  next_review_session?: number;
  coach_confidence?: string;
  notes?: string;
};

export type SkillDetail = {
  state?: SkillState;
  catalog?: Record<string, unknown>;
  observations?: Observation[];
};

export type SessionDetail = {
  session?: SessionRow & Record<string, unknown>;
  observations?: Observation[];
};

export type SessionAnalytics = {
  session_id: number;
  session_date: string;
  duration_min?: NullableNumber;
  session_type?: string;
  daypart?: string;
  overall_fluency?: NullableNumber;
  overall_retrieval?: NullableNumber;
  overall_clarity?: NullableNumber;
  overall_accuracy?: NullableNumber;
  professional_communication?: NullableNumber;
  overall_independence?: NullableNumber;
  skills_observed_count?: number;
  evidence_score?: NullableNumber;
  avg_independence?: NullableNumber;
  observation_count?: number;
  spontaneous_rate?: NullableNumber;
};

export type DomainCoverage = {
  domain: string;
  total_skills: number;
  observed_skills: number;
  current_score?: NullableNumber;
};

export type LearningAnalytics = {
  practice?: {
    total_sessions?: number;
    total_minutes?: number;
    avg_minutes?: number;
    qualifying_sessions?: number;
  };
  skill_movers?: SkillState[];
  total_skills?: number;
  assessed_skills?: number;
  session_series?: SessionAnalytics[];
  domain_coverage?: DomainCoverage[];
  benchmark_history?: Benchmark[];
  confidence_distribution?: { confidence?: string; skills?: number }[];
};
