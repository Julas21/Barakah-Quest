/*
  # Seed Initial Data

  ## Overview
  This migration populates the database with initial achievements and Islamic content
  to provide users with engaging goals and spiritual knowledge from day one.

  ## Data Added

  ### Achievements
  - 30+ Islamic-themed achievements across multiple categories
  - Categories: Consistency, Worship, Knowledge, Character, Milestones

  ### Islamic Content
  - Daily motivational quotes from Quran and Hadith
  - Common Dhikr formulas with translations
  - Inspirational Islamic wisdom

  ## Notes
  - All content includes proper references
  - Achievement criteria are stored in JSONB for flexibility
  - Content is categorized for easy discovery
*/

-- Insert initial achievements
INSERT INTO achievements (code, title, description, category, icon, points_required, unlock_criteria) VALUES
  -- Consistency Achievements
  ('first_steps', 'First Steps', 'Complete your first task', 'Consistency', 'footprints', 0, '{"tasks_completed": 1}'),
  ('daily_devotion', 'Daily Devotion', 'Use the app for 7 consecutive days', 'Consistency', 'calendar', 0, '{"daily_streak": 7}'),
  ('month_warrior', 'Month Warrior', 'Maintain a 30-day streak', 'Consistency', 'flame', 0, '{"daily_streak": 30}'),
  ('year_champion', 'Year Champion', 'Complete 365 days of continuous engagement', 'Consistency', 'trophy', 0, '{"daily_streak": 365}'),
  
  -- Worship Achievements
  ('prayer_starter', 'Prayer Starter', 'Log your first prayer', 'Worship', 'mosque', 0, '{"prayers_logged": 1}'),
  ('five_pillars', 'Five Pillars', 'Complete all 5 prayers in a single day', 'Worship', 'star', 0, '{"daily_prayers_complete": 1}'),
  ('prayer_guardian', 'Prayer Guardian', 'Maintain a 7-day prayer streak', 'Worship', 'shield', 0, '{"prayer_streak": 7}'),
  ('salah_master', 'Salah Master', 'Maintain a 30-day prayer streak', 'Worship', 'crown', 0, '{"prayer_streak": 30}'),
  ('night_worshipper', 'Night Worshipper', 'Complete Fajr prayer 10 times', 'Worship', 'moon', 0, '{"fajr_count": 10}'),
  
  -- Knowledge Achievements
  ('quran_companion', 'Quran Companion', 'Read Quran for the first time', 'Knowledge', 'book', 0, '{"quran_sessions": 1}'),
  ('daily_reader', 'Daily Reader', 'Read Quran for 7 consecutive days', 'Knowledge', 'book-open', 0, '{"quran_streak": 7}'),
  ('juz_master', 'Juz Master', 'Complete reading one Juz', 'Knowledge', 'bookmark', 0, '{"juz_completed": 1}'),
  ('quran_graduate', 'Quran Graduate', 'Complete reading the entire Quran', 'Knowledge', 'graduation-cap', 0, '{"quran_completed": 1}'),
  ('knowledge_seeker', 'Knowledge Seeker', 'Unlock 10 pieces of Islamic content', 'Knowledge', 'lightbulb', 0, '{"content_unlocked": 10}'),
  
  -- Character Achievements
  ('generous_soul', 'Generous Soul', 'Record your first charity', 'Character', 'heart', 0, '{"charities_logged": 1}'),
  ('sadaqa_star', 'Sadaqa Star', 'Give charity 10 times', 'Character', 'gift', 0, '{"charities_logged": 10}'),
  ('grateful_heart', 'Grateful Heart', 'Complete 100 gratitude reflections', 'Character', 'smile', 0, '{"gratitude_count": 100}'),
  ('patient_believer', 'Patient Believer', 'Complete a difficult task', 'Character', 'hourglass', 0, '{"hard_tasks_completed": 1}'),
  
  -- Milestone Achievements
  ('century_club', 'Century Club', 'Complete 100 tasks', 'Milestones', 'target', 0, '{"tasks_completed": 100}'),
  ('barakah_beginner', 'Barakah Beginner', 'Reach level 5', 'Milestones', 'award', 0, '{"level": 5}'),
  ('barakah_expert', 'Barakah Expert', 'Reach level 10', 'Milestones', 'medal', 0, '{"level": 10}'),
  ('barakah_master', 'Barakah Master', 'Reach level 25', 'Milestones', 'crown', 0, '{"level": 25}'),
  ('point_collector', 'Point Collector', 'Earn 1000 total Barakah points', 'Milestones', 'coins', 1000, '{}'),
  ('point_hoarder', 'Point Hoarder', 'Earn 5000 total Barakah points', 'Milestones', 'gem', 5000, '{}'),
  
  -- Dhikr Achievements
  ('dhikr_initiate', 'Dhikr Initiate', 'Complete your first Dhikr session', 'Worship', 'beads', 0, '{"dhikr_sessions": 1}'),
  ('morning_reminder', 'Morning Reminder', 'Complete morning Adhkar 7 times', 'Worship', 'sunrise', 0, '{"morning_adhkar": 7}'),
  ('evening_reminder', 'Evening Reminder', 'Complete evening Adhkar 7 times', 'Worship', 'sunset', 0, '{"evening_adhkar": 7}'),
  ('tasbeeh_counter', 'Tasbeeh Counter', 'Complete 1000 Tasbeeh', 'Worship', 'repeat', 0, '{"tasbeeh_count": 1000}'),
  
  -- Special Achievements
  ('ramadan_warrior', 'Ramadan Warrior', 'Complete all fasts in Ramadan', 'Special', 'moon-star', 0, '{"ramadan_fasts": 30}'),
  ('friday_faithful', 'Friday Faithful', 'Attend Jumuah for 4 consecutive weeks', 'Special', 'calendar-check', 0, '{"jumuah_streak": 4}')
ON CONFLICT (code) DO NOTHING;

-- Insert Islamic content (Motivational Quotes and Dhikr)
INSERT INTO islamic_content (content_type, title, arabic_text, transliteration, translation, reference, category, unlock_level) VALUES
  -- Quranic Verses
  ('Ayah', 'Patience and Prayer', 'وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ', 'Wastaʿīnū biṣ-ṣabri waṣ-ṣalāh', 'And seek help through patience and prayer', 'Surah Al-Baqarah 2:45', 'Motivation', 0),
  ('Ayah', 'Allah is with the Patient', 'إِنَّ اللَّهَ مَعَ الصَّابِرِينَ', 'Inna Allāha maʿa aṣ-ṣābirīn', 'Indeed, Allah is with the patient', 'Surah Al-Baqarah 2:153', 'Patience', 0),
  ('Ayah', 'Ease after Hardship', 'إِنَّ مَعَ الْعُسْرِ يُسْرًا', 'Inna maʿa al-ʿusri yusrā', 'Indeed, with hardship comes ease', 'Surah Ash-Sharh 94:6', 'Hope', 0),
  ('Ayah', 'Remember Me', 'فَاذْكُرُونِي أَذْكُرْكُمْ', 'Fadhkurūnī adhkurkum', 'So remember Me; I will remember you', 'Surah Al-Baqarah 2:152', 'Dhikr', 0),
  ('Ayah', 'Trust in Allah', 'وَتَوَكَّلْ عَلَى اللَّهِ', 'Wa tawakkal ʿalā Allāh', 'And put your trust in Allah', 'Surah Al-Ahzab 33:3', 'Trust', 0),
  
  -- Hadith Quotes
  ('Hadith', 'Actions by Intentions', NULL, NULL, 'Actions are judged by intentions, and every person will be rewarded according to their intention', 'Sahih Bukhari 1', 'Intention', 0),
  ('Hadith', 'Best of Deeds', NULL, NULL, 'The most beloved deeds to Allah are those done consistently, even if they are small', 'Sahih Bukhari 6464', 'Consistency', 0),
  ('Hadith', 'Prayer is Light', NULL, NULL, 'Prayer is light, charity is proof, patience is illumination', 'Sahih Muslim 223', 'Worship', 0),
  ('Hadith', 'Seeking Knowledge', NULL, NULL, 'Seeking knowledge is an obligation upon every Muslim', 'Sunan Ibn Majah 224', 'Knowledge', 0),
  ('Hadith', 'Power in Goodness', NULL, NULL, 'The strong person is not the one who can overpower others, but the one who controls themselves when angry', 'Sahih Bukhari 6114', 'Character', 0),
  
  -- Common Dhikr
  ('Dhikr', 'Subhanallah', 'سُبْحَانَ اللهِ', 'SubhanAllah', 'Glory be to Allah', 'Daily Dhikr', 'Tasbeeh', 0),
  ('Dhikr', 'Alhamdulillah', 'الْحَمْدُ لِلَّهِ', 'Alhamdulillah', 'All praise is due to Allah', 'Daily Dhikr', 'Tasbeeh', 0),
  ('Dhikr', 'Allahu Akbar', 'اللهُ أَكْبَرُ', 'Allahu Akbar', 'Allah is the Greatest', 'Daily Dhikr', 'Tasbeeh', 0),
  ('Dhikr', 'La ilaha illallah', 'لَا إِلَٰهَ إِلَّا ٱللَّٰهُ', 'La ilaha illallah', 'There is no deity except Allah', 'Daily Dhikr', 'Tahleel', 0),
  ('Dhikr', 'Astaghfirullah', 'أَسْتَغْفِرُ اللهَ', 'Astaghfirullah', 'I seek forgiveness from Allah', 'Daily Dhikr', 'Istighfar', 0),
  
  -- Morning Adhkar
  ('Dhikr', 'Morning Protection', 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ', 'Asbahna wa asbahal-mulku lillah', 'We have entered a new day and the dominion belongs to Allah', 'Morning Adhkar', 'Morning', 1),
  ('Dhikr', 'Ayat al-Kursi', 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ', 'Allahu la ilaha illa Huwa, Al-Hayyul-Qayyum', 'Allah, there is no deity except Him, the Ever-Living, the Sustainer', 'Surah Al-Baqarah 2:255', 'Protection', 1),
  
  -- Evening Adhkar
  ('Dhikr', 'Evening Protection', 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ', 'Amsayna wa amsal-mulku lillah', 'We have entered the evening and the dominion belongs to Allah', 'Evening Adhkar', 'Evening', 1),
  
  -- Level-locked Content
  ('Hadith', 'Kindness to Parents', NULL, NULL, 'Paradise lies at the feet of your mother', 'Sunan an-Nasa''i 3104', 'Family', 5),
  ('Quote', 'Imam Ali Wisdom', NULL, NULL, 'Do not let your difficulties fill you with anxiety. It is only in the darkest nights that stars shine more brightly', 'Imam Ali (RA)', 'Wisdom', 5),
  ('Hadith', 'Excellence in Work', NULL, NULL, 'Allah loves that when any of you does something, they do it with excellence', 'Sahih Al-Jami 1880', 'Excellence', 10),
  ('Quote', 'Rumi Wisdom', NULL, NULL, 'Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself', 'Rumi', 'Self-Development', 10),
  ('Hadith', 'Smile as Charity', NULL, NULL, 'Your smile for your brother is a charity', 'Jami at-Tirmidhi 1956', 'Kindness', 15)
ON CONFLICT DO NOTHING;