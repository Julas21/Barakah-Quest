import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Award, Lock } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { Achievement, UserAchievement } from '@/types/database';

export default function AchievementsScreen() {
  const { profile } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>(
    []
  );

  useEffect(() => {
    loadAchievements();
  }, [profile]);

  async function loadAchievements() {
    const { data: allAchievements } = await supabase
      .from('achievements')
      .select('*')
      .order('category');

    if (allAchievements) {
      setAchievements(allAchievements);
    }

    if (profile) {
      const { data: userUnlocked } = await supabase
        .from('user_achievements')
        .select('*, achievement:achievements(*)')
        .eq('user_id', profile.id);

      if (userUnlocked) {
        setUserAchievements(userUnlocked);
      }
    }
  }

  const isUnlocked = (achievementId: string) => {
    return userAchievements.some((ua) => ua.achievement_id === achievementId);
  };

  const groupedAchievements = achievements.reduce((acc, achievement) => {
    if (!acc[achievement.category]) {
      acc[achievement.category] = [];
    }
    acc[achievement.category].push(achievement);
    return acc;
  }, {} as Record<string, Achievement[]>);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Achievements</Text>
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            {userAchievements.length} / {achievements.length}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {Object.entries(groupedAchievements).map(([category, items]) => (
          <View key={category} style={styles.section}>
            <Text style={styles.sectionTitle}>{category}</Text>
            {items.map((achievement) => {
              const unlocked = isUnlocked(achievement.id);
              return (
                <View
                  key={achievement.id}
                  style={[
                    styles.achievementCard,
                    unlocked && styles.achievementUnlocked,
                  ]}
                >
                  <View style={styles.achievementIcon}>
                    {unlocked ? (
                      <Award color={colors.secondary[500]} size={32} />
                    ) : (
                      <Lock color={colors.text.tertiary} size={32} />
                    )}
                  </View>
                  <View style={styles.achievementContent}>
                    <Text
                      style={[
                        styles.achievementTitle,
                        !unlocked && styles.achievementTitleLocked,
                      ]}
                    >
                      {achievement.title}
                    </Text>
                    <Text
                      style={[
                        styles.achievementDescription,
                        !unlocked && styles.achievementDescriptionLocked,
                      ]}
                    >
                      {achievement.description}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  statsContainer: {
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  statsText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary[700],
  },
  scrollContent: {
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  achievementCard: {
    flexDirection: 'row',
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    opacity: 0.5,
  },
  achievementUnlocked: {
    opacity: 1,
    borderWidth: 2,
    borderColor: colors.secondary[200],
  },
  achievementIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  achievementTitleLocked: {
    color: colors.text.tertiary,
  },
  achievementDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  achievementDescriptionLocked: {
    color: colors.text.tertiary,
  },
});
