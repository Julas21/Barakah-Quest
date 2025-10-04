export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  level: number;
  total_points: number;
  current_points: number;
  daily_streak: number;
  prayer_streak: number;
  location_lat: number | null;
  location_lng: number | null;
  location_name: string | null;
  prayer_calculation_method: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: TaskCategory;
  points: number;
  is_completed: boolean;
  is_recurring: boolean;
  recurrence_pattern: RecurrencePattern | null;
  deadline: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export type TaskCategory =
  | 'Personal'
  | 'Work'
  | 'Spiritual'
  | 'Learning'
  | 'Health'
  | 'Custom';

export type RecurrencePattern = 'Daily' | 'Weekly' | 'Monthly';

export interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  category: AchievementCategory;
  icon: string;
  points_required: number;
  unlock_criteria: Record<string, any>;
  created_at: string;
}

export type AchievementCategory =
  | 'Consistency'
  | 'Worship'
  | 'Knowledge'
  | 'Character'
  | 'Milestones'
  | 'Special';

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
  progress: Record<string, any>;
  achievement?: Achievement;
}

export interface PrayerLog {
  id: string;
  user_id: string;
  prayer_name: PrayerName;
  prayer_date: string;
  completed: boolean;
  logged_at: string;
  created_at: string;
}

export type PrayerName = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';

export interface SpiritualActivity {
  id: string;
  user_id: string;
  activity_type: ActivityType;
  activity_data: Record<string, any>;
  points_earned: number;
  activity_date: string;
  created_at: string;
}

export type ActivityType =
  | 'Quran'
  | 'Dhikr'
  | 'Dua'
  | 'Fasting'
  | 'Charity';

export interface IslamicContent {
  id: string;
  content_type: ContentType;
  title: string;
  arabic_text: string | null;
  transliteration: string | null;
  translation: string;
  reference: string | null;
  category: string;
  unlock_level: number;
  created_at: string;
}

export type ContentType =
  | 'Hadith'
  | 'Ayah'
  | 'Dhikr'
  | 'Quote'
  | 'Knowledge';

export interface PrayerTime {
  name: PrayerName;
  time: string;
  timestamp: number;
}

export interface DailyPrayerTimes {
  date: string;
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>;
      };
      tasks: {
        Row: Task;
        Insert: Omit<Task, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Task, 'id' | 'user_id' | 'created_at'>>;
      };
      achievements: {
        Row: Achievement;
        Insert: Omit<Achievement, 'id' | 'created_at'>;
        Update: Partial<Omit<Achievement, 'id' | 'created_at'>>;
      };
      user_achievements: {
        Row: UserAchievement;
        Insert: Omit<UserAchievement, 'id' | 'unlocked_at'>;
        Update: Partial<Omit<UserAchievement, 'id' | 'user_id' | 'achievement_id'>>;
      };
      prayer_logs: {
        Row: PrayerLog;
        Insert: Omit<PrayerLog, 'id' | 'logged_at' | 'created_at'>;
        Update: Partial<Omit<PrayerLog, 'id' | 'user_id' | 'created_at'>>;
      };
      spiritual_activities: {
        Row: SpiritualActivity;
        Insert: Omit<SpiritualActivity, 'id' | 'created_at'>;
        Update: Partial<Omit<SpiritualActivity, 'id' | 'user_id' | 'created_at'>>;
      };
      islamic_content: {
        Row: IslamicContent;
        Insert: Omit<IslamicContent, 'id' | 'created_at'>;
        Update: Partial<Omit<IslamicContent, 'id' | 'created_at'>>;
      };
    };
  };
}
