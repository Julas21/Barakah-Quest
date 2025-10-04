import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Plus,
  Sparkles,
  Clock,
  CheckCircle,
  TrendingUp,
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { Task, DailyPrayerTimes, PrayerTime } from '@/types/database';
import { prayerTimesService } from '@/lib/prayer-times';
import { format } from 'date-fns';

export default function DashboardScreen() {
  const { profile, refreshProfile } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [prayerTimes, setPrayerTimes] = useState<DailyPrayerTimes | null>(null);
  const [nextPrayer, setNextPrayer] = useState<PrayerTime | null>(null);
  const [timeUntil, setTimeUntil] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [profile]);

  useEffect(() => {
    if (nextPrayer) {
      const interval = setInterval(() => {
        const time = prayerTimesService.getTimeUntilPrayer(nextPrayer);
        setTimeUntil(time);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [nextPrayer]);

  async function loadDashboardData() {
    if (!profile) return;

    try {
      await Promise.all([loadTasks(), loadPrayerTimes()]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadTasks() {
    if (!profile) return;

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', profile.id)
      .eq('is_completed', false)
      .order('deadline', { ascending: true })
      .limit(5);

    if (!error && data) {
      setTasks(data);
    }
  }

  async function loadPrayerTimes() {
    if (!profile?.location_lat || !profile?.location_lng) return;

    const times = await prayerTimesService.fetchPrayerTimes(
      profile.location_lat,
      profile.location_lng,
      profile.prayer_calculation_method
    );

    if (times) {
      setPrayerTimes(times);
      const next = prayerTimesService.getNextPrayer(times);
      setNextPrayer(next);
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    await refreshProfile();
    await loadDashboardData();
    setRefreshing(false);
  }

  const completedTodayCount = tasks.filter((t) => t.is_completed).length;
  const totalTodayCount = tasks.length;
  const progressPercentage =
    totalTodayCount > 0 ? (completedTodayCount / totalTodayCount) * 100 : 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <LinearGradient
          colors={[colors.primary[600], colors.primary[700]]}
          style={styles.headerGradient}
        >
          <View style={styles.greetingSection}>
            <Text style={styles.greeting}>As-salamu alaykum,</Text>
            <Text style={styles.userName}>{profile?.full_name}</Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Sparkles color={colors.secondary[500]} size={20} />
              </View>
              <Text style={styles.statValue}>{profile?.total_points || 0}</Text>
              <Text style={styles.statLabel}>Barakah Points</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <TrendingUp color={colors.accent[500]} size={20} />
              </View>
              <Text style={styles.statValue}>Level {profile?.level || 1}</Text>
              <Text style={styles.statLabel}>Current Level</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <CheckCircle color={colors.success.main} size={20} />
              </View>
              <Text style={styles.statValue}>{profile?.daily_streak || 0}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
          </View>
        </LinearGradient>

        {nextPrayer && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Clock color={colors.primary[700]} size={20} />
              <Text style={styles.cardTitle}>Next Prayer: {nextPrayer.name}</Text>
            </View>
            <View style={styles.prayerTimeContainer}>
              <Text style={styles.prayerTime}>{nextPrayer.time}</Text>
              <Text style={styles.timeRemaining}>
                {prayerTimesService.formatTimeUntil(timeUntil)} remaining
              </Text>
            </View>
          </View>
        )}

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Today's Quests</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push('/(tabs)/quests')}
            >
              <Plus color={colors.primary[700]} size={20} />
            </TouchableOpacity>
          </View>

          {tasks.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No quests yet. Tap + to create your first quest!
              </Text>
            </View>
          ) : (
            <>
              {tasks.slice(0, 3).map((task) => (
                <View key={task.id} style={styles.taskItem}>
                  <View style={styles.taskContent}>
                    <Text style={styles.taskTitle}>{task.title}</Text>
                    <View style={styles.taskMeta}>
                      <Text style={styles.taskPoints}>+{task.points} points</Text>
                    </View>
                  </View>
                </View>
              ))}
              {tasks.length > 3 && (
                <TouchableOpacity
                  style={styles.viewAllButton}
                  onPress={() => router.push('/(tabs)/quests')}
                >
                  <Text style={styles.viewAllText}>
                    View all {tasks.length} quests
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>

        <View style={styles.motivationCard}>
          <LinearGradient
            colors={[colors.accent[500], colors.accent[700]]}
            style={styles.motivationGradient}
          >
            <Text style={styles.motivationQuote}>
              "Indeed, with hardship comes ease"
            </Text>
            <Text style={styles.motivationReference}>Surah Ash-Sharh 94:6</Text>
          </LinearGradient>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/(tabs)/quests')}
      >
        <Plus color={colors.text.inverse} size={28} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  scrollContent: {
    paddingBottom: spacing.xxl * 2,
  },
  headerGradient: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
  greetingSection: {
    marginBottom: spacing.lg,
  },
  greeting: {
    fontSize: typography.fontSize.base,
    color: colors.text.inverse,
    opacity: 0.9,
  },
  userName: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.inverse,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    alignItems: 'center',
  },
  statIcon: {
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.inverse,
  },
  statLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.text.inverse,
    opacity: 0.8,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  cardTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    flex: 1,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
  prayerTimeContainer: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  prayerTime: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.primary[700],
    marginBottom: spacing.xs,
  },
  timeRemaining: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
  },
  emptyState: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskPoints: {
    fontSize: typography.fontSize.sm,
    color: colors.secondary[600],
    fontWeight: typography.fontWeight.medium,
  },
  viewAllButton: {
    paddingVertical: spacing.sm,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  viewAllText: {
    fontSize: typography.fontSize.base,
    color: colors.primary[700],
    fontWeight: typography.fontWeight.medium,
  },
  motivationCard: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  motivationGradient: {
    padding: spacing.lg,
  },
  motivationQuote: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.inverse,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  motivationReference: {
    fontSize: typography.fontSize.sm,
    color: colors.text.inverse,
    opacity: 0.8,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary[700],
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
