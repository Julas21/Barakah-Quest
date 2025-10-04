/*
  # Initial Barakah Quest Database Schema

  ## Overview
  This migration creates the foundational database structure for Barakah Quest,
  a gamified Islamic productivity application.

  ## New Tables

  ### 1. profiles
  - `id` (uuid, primary key) - Links to auth.users
  - `email` (text) - User email
  - `full_name` (text) - User's full name
  - `avatar_url` (text) - Profile picture URL
  - `level` (integer) - Current gamification level
  - `total_points` (integer) - Lifetime Barakah points earned
  - `current_points` (integer) - Points in current level
  - `daily_streak` (integer) - Consecutive days of app usage
  - `prayer_streak` (integer) - Consecutive days of prayer completion
  - `location_lat` (numeric) - Latitude for prayer times
  - `location_lng` (numeric) - Longitude for prayer times
  - `location_name` (text) - City/location name
  - `prayer_calculation_method` (text) - Calculation method for prayer times
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. tasks
  - `id` (uuid, primary key) - Unique task identifier
  - `user_id` (uuid, foreign key) - References profiles
  - `title` (text) - Task title
  - `description` (text) - Detailed description
  - `category` (text) - Task category (Personal, Work, Spiritual, etc.)
  - `points` (integer) - Barakah points awarded on completion
  - `is_completed` (boolean) - Completion status
  - `is_recurring` (boolean) - Whether task repeats
  - `recurrence_pattern` (text) - Daily, Weekly, Monthly
  - `deadline` (timestamptz) - Task due date
  - `completed_at` (timestamptz) - Completion timestamp
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 3. achievements
  - `id` (uuid, primary key) - Achievement identifier
  - `code` (text, unique) - Unique achievement code
  - `title` (text) - Achievement name
  - `description` (text) - How to unlock
  - `category` (text) - Achievement category
  - `icon` (text) - Icon identifier
  - `points_required` (integer) - Points needed (if applicable)
  - `unlock_criteria` (jsonb) - Complex unlock conditions
  - `created_at` (timestamptz) - Creation timestamp

  ### 4. user_achievements
  - `id` (uuid, primary key) - Record identifier
  - `user_id` (uuid, foreign key) - References profiles
  - `achievement_id` (uuid, foreign key) - References achievements
  - `unlocked_at` (timestamptz) - When achievement was unlocked
  - `progress` (jsonb) - Progress toward unlocking

  ### 5. prayer_logs
  - `id` (uuid, primary key) - Log identifier
  - `user_id` (uuid, foreign key) - References profiles
  - `prayer_name` (text) - Fajr, Dhuhr, Asr, Maghrib, Isha
  - `prayer_date` (date) - Date of prayer
  - `completed` (boolean) - Whether prayer was performed
  - `logged_at` (timestamptz) - When it was logged
  - `created_at` (timestamptz) - Creation timestamp

  ### 6. spiritual_activities
  - `id` (uuid, primary key) - Activity identifier
  - `user_id` (uuid, foreign key) - References profiles
  - `activity_type` (text) - Quran, Dhikr, Dua, Fasting, Charity
  - `activity_data` (jsonb) - Flexible data storage for different activities
  - `points_earned` (integer) - Barakah points earned
  - `activity_date` (date) - Date of activity
  - `created_at` (timestamptz) - Creation timestamp

  ### 7. islamic_content
  - `id` (uuid, primary key) - Content identifier
  - `content_type` (text) - Hadith, Ayah, Dhikr, Quote, Knowledge
  - `title` (text) - Content title
  - `arabic_text` (text) - Original Arabic text
  - `transliteration` (text) - Romanized pronunciation
  - `translation` (text) - English translation
  - `reference` (text) - Source reference
  - `category` (text) - Content category
  - `unlock_level` (integer) - Required level to unlock (0 for public)
  - `created_at` (timestamptz) - Creation timestamp

  ## Security
  - Enable Row Level Security (RLS) on all tables
  - Add policies for authenticated users to access their own data
  - Ensure users can only read public Islamic content
  - Prevent unauthorized data access

  ## Indexes
  - Add indexes on foreign keys for optimal query performance
  - Add indexes on frequently queried fields (dates, user_id, completion status)
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  avatar_url text,
  level integer DEFAULT 1 NOT NULL,
  total_points integer DEFAULT 0 NOT NULL,
  current_points integer DEFAULT 0 NOT NULL,
  daily_streak integer DEFAULT 0 NOT NULL,
  prayer_streak integer DEFAULT 0 NOT NULL,
  location_lat numeric,
  location_lng numeric,
  location_name text,
  prayer_calculation_method text DEFAULT 'MWL',
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  category text DEFAULT 'Personal' NOT NULL,
  points integer DEFAULT 10 NOT NULL,
  is_completed boolean DEFAULT false NOT NULL,
  is_recurring boolean DEFAULT false NOT NULL,
  recurrence_pattern text,
  deadline timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  category text DEFAULT 'General' NOT NULL,
  icon text NOT NULL,
  points_required integer DEFAULT 0,
  unlock_criteria jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  achievement_id uuid REFERENCES achievements(id) ON DELETE CASCADE NOT NULL,
  unlocked_at timestamptz DEFAULT now() NOT NULL,
  progress jsonb DEFAULT '{}',
  UNIQUE(user_id, achievement_id)
);

-- Create prayer_logs table
CREATE TABLE IF NOT EXISTS prayer_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  prayer_name text NOT NULL,
  prayer_date date DEFAULT CURRENT_DATE NOT NULL,
  completed boolean DEFAULT true NOT NULL,
  logged_at timestamptz DEFAULT now() NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, prayer_name, prayer_date)
);

-- Create spiritual_activities table
CREATE TABLE IF NOT EXISTS spiritual_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  activity_type text NOT NULL,
  activity_data jsonb DEFAULT '{}' NOT NULL,
  points_earned integer DEFAULT 5 NOT NULL,
  activity_date date DEFAULT CURRENT_DATE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create islamic_content table
CREATE TABLE IF NOT EXISTS islamic_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type text NOT NULL,
  title text NOT NULL,
  arabic_text text,
  transliteration text,
  translation text NOT NULL,
  reference text,
  category text DEFAULT 'General',
  unlock_level integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE spiritual_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE islamic_content ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Tasks policies
CREATE POLICY "Users can view own tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
  ON tasks FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks"
  ON tasks FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Achievements policies (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view achievements"
  ON achievements FOR SELECT
  TO authenticated
  USING (true);

-- User achievements policies
CREATE POLICY "Users can view own achievements"
  ON user_achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON user_achievements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Prayer logs policies
CREATE POLICY "Users can view own prayer logs"
  ON prayer_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own prayer logs"
  ON prayer_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own prayer logs"
  ON prayer_logs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own prayer logs"
  ON prayer_logs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Spiritual activities policies
CREATE POLICY "Users can view own spiritual activities"
  ON spiritual_activities FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own spiritual activities"
  ON spiritual_activities FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own spiritual activities"
  ON spiritual_activities FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Islamic content policies (read for authenticated users based on level)
CREATE POLICY "Users can view unlocked islamic content"
  ON islamic_content FOR SELECT
  TO authenticated
  USING (
    unlock_level = 0 OR
    unlock_level <= (SELECT level FROM profiles WHERE id = auth.uid())
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(is_completed);
CREATE INDEX IF NOT EXISTS idx_tasks_deadline ON tasks(deadline);
CREATE INDEX IF NOT EXISTS idx_tasks_category ON tasks(category);

CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON user_achievements(achievement_id);

CREATE INDEX IF NOT EXISTS idx_prayer_logs_user_id ON prayer_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_prayer_logs_date ON prayer_logs(prayer_date);
CREATE INDEX IF NOT EXISTS idx_prayer_logs_user_date ON prayer_logs(user_id, prayer_date);

CREATE INDEX IF NOT EXISTS idx_spiritual_activities_user_id ON spiritual_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_spiritual_activities_date ON spiritual_activities(activity_date);
CREATE INDEX IF NOT EXISTS idx_spiritual_activities_type ON spiritual_activities(activity_type);

CREATE INDEX IF NOT EXISTS idx_islamic_content_type ON islamic_content(content_type);
CREATE INDEX IF NOT EXISTS idx_islamic_content_level ON islamic_content(unlock_level);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();