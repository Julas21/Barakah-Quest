# Barakah Quest

A gamified Islamic productivity application built with React Native and Expo. Transform your daily tasks, personal goals, and spiritual practices into an engaging quest system.

## Features Implemented

### Authentication System
- **Welcome Screen**: Beautiful onboarding with gradient backgrounds and Islamic-themed design
- **Sign Up**: User registration with email and password
- **Sign In**: Secure login with session management
- **Protected Routes**: Automatic navigation based on authentication state

### Dashboard
- **Personalized Greeting**: Islamic greeting with user's name
- **Statistics Overview**: Display of Barakah points, current level, and daily streak
- **Prayer Times**: Integration with AlAdhan API for accurate prayer times based on user location
- **Next Prayer Countdown**: Real-time countdown to the next prayer
- **Today's Quests**: Quick view of active tasks with points
- **Motivational Quotes**: Random Islamic quotes from Quran and Hadith
- **Quick Actions**: Floating action button to quickly create new quests

### Quests (Tasks) Management
- **Create Tasks**: Modal interface to create new quests with custom points
- **Task List**: View all active and completed tasks
- **Task Completion**: Tap to mark tasks complete and earn Barakah points
- **Points System**: Automatic point calculation and profile updates
- **Categories**: Support for different task categories (Personal, Work, Spiritual, etc.)

### Achievements System
- **30+ Achievements**: Pre-seeded Islamic-themed achievements across multiple categories:
  - Consistency (First Steps, Daily Devotion, Month Warrior)
  - Worship (Prayer Starter, Five Pillars, Salah Master)
  - Knowledge (Quran Companion, Daily Reader, Knowledge Seeker)
  - Character (Generous Soul, Sadaqa Star, Grateful Heart)
  - Milestones (Century Club, Barakah levels)
- **Achievement Tracking**: Visual distinction between locked and unlocked achievements
- **Progress Display**: Shows total unlocked achievements

### User Profile
- **Profile Overview**: Display user information and avatar
- **Statistics Dashboard**: Comprehensive stats including:
  - Total Barakah Points
  - Current Level Points
  - Daily Streak
  - Prayer Streak
- **Account Management**: Sign out functionality

### Database Architecture
- **Profiles**: User information, gamification stats, and prayer settings
- **Tasks**: Quest tracking with categories, points, deadlines, and completion status
- **Achievements**: Achievement definitions with unlock criteria
- **User Achievements**: Tracking of unlocked achievements per user
- **Prayer Logs**: Daily prayer tracking for consistency monitoring
- **Spiritual Activities**: Flexible storage for Quran reading, Dhikr, etc.
- **Islamic Content**: Library of Hadith, Quranic verses, and Dhikr with level-based unlocking

### Design System
- **Islamic-Inspired Theme**: Green primary color palette with earthy tones
- **Modern UI**: Clean, card-based design with proper spacing and typography
- **Gradients**: Beautiful gradient backgrounds for key screens
- **Icons**: Lucide React Native icons throughout the app
- **Responsive**: Proper safe area handling and responsive layouts

## Technology Stack

- **Framework**: Expo SDK 54 with React Native
- **Navigation**: Expo Router with typed routes
- **Backend**: Supabase (PostgreSQL database with Row Level Security)
- **Authentication**: Supabase Auth with email/password
- **Storage**: AsyncStorage for local data persistence
- **Prayer Times**: AlAdhan API integration
- **Date Handling**: date-fns and date-fns-tz
- **UI Components**: Native React Native components with custom styling
- **Icons**: lucide-react-native
- **Gradients**: expo-linear-gradient

## Database Schema

### Profiles Table
Stores user information and gamification progress:
- Personal info (name, email, avatar)
- Gamification stats (level, points, streaks)
- Location data for prayer times
- Prayer calculation method preference

### Tasks Table
Quest/task management with full CRUD operations:
- Title, description, and category
- Point values and completion status
- Recurring task support
- Deadline tracking

### Achievements Table
Pre-defined achievements with unlock criteria:
- Multiple categories (Consistency, Worship, Knowledge, Character, Milestones)
- Point requirements
- JSON-based unlock criteria for flexibility

### Prayer Logs Table
Daily prayer tracking:
- Five daily prayers (Fajr, Dhuhr, Asr, Maghrib, Isha)
- Completion status
- Date tracking for streaks

### Islamic Content Table
Spiritual knowledge library:
- Hadith, Quranic verses, Dhikr, quotes
- Arabic text with transliteration and translation
- Level-based unlocking system
- Proper source references

## Security

- **Row Level Security (RLS)**: Enabled on all tables
- **User Isolation**: Users can only access their own data
- **Authenticated Access**: Most features require authentication
- **Public Content**: Islamic content accessible based on user level
- **Secure Authentication**: Supabase Auth with JWT tokens

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Scan the QR code with Expo Go app on your device

## Available Scripts

- `npm run dev` - Start the Expo development server
- `npm run build:web` - Build for web platform
- `npm run typecheck` - Run TypeScript type checking
- `npm run lint` - Run ESLint

## Environment Variables

The following environment variables are configured in `.env`:
- `EXPO_PUBLIC_SUPABASE_URL` - Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

## Future Enhancements

While the core functionality is complete, here are some planned features:

1. **Prayer Times Enhancements**
   - Local notifications for prayer times
   - Prayer time reminders with Adhan sounds
   - Qibla direction compass
   - Prayer logging from dashboard

2. **Spiritual Activities**
   - Quran reading tracker with Surah/Ayah progress
   - Dhikr counter with preset formulas
   - Dua list management
   - Fasting tracker for Ramadan
   - Charity/Sadaqa logging

3. **Gamification Enhancements**
   - Achievement unlock animations
   - Level-up celebrations
   - Daily challenges
   - Reward redemption system
   - Leaderboards (optional, for friendly competition)

4. **Content Library**
   - Expanded Islamic content
   - Audio recitations
   - Tafsir integration
   - 99 Names of Allah

5. **Productivity Features**
   - Task priorities and sorting
   - Task categories customization
   - Recurring task patterns
   - Task reminders and notifications
   - Project grouping

6. **User Experience**
   - Dark mode support
   - Language localization (Arabic, etc.)
   - Offline mode improvements
   - Data export/backup
   - Profile customization

## Contributing

This is a personal productivity app focused on helping Muslims integrate their spiritual practices with daily task management. The codebase follows React Native and Expo best practices.

## License

Private project - All rights reserved.
