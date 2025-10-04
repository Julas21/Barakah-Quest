import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Sparkles, Trophy, Calendar } from 'lucide-react-native';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={[colors.primary[700], colors.primary[500], colors.accent[500]]}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Sparkles color={colors.text.inverse} size={48} />
          </View>
          <Text style={styles.title}>Barakah Quest</Text>
          <Text style={styles.subtitle}>
            Transform Your Daily Routine into a Spiritual Journey
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Trophy color={colors.primary[700]} size={32} />
            </View>
            <Text style={styles.featureTitle}>Earn Rewards</Text>
            <Text style={styles.featureDescription}>
              Complete tasks and earn Barakah points to level up and unlock
              achievements
            </Text>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Calendar color={colors.primary[700]} size={32} />
            </View>
            <Text style={styles.featureTitle}>Prayer Times</Text>
            <Text style={styles.featureDescription}>
              Never miss a prayer with accurate times and reminders for your
              location
            </Text>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Sparkles color={colors.primary[700]} size={32} />
            </View>
            <Text style={styles.featureTitle}>Build Habits</Text>
            <Text style={styles.featureDescription}>
              Track spiritual activities and build consistent Islamic habits
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push('/(auth)/signup')}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push('/(auth)/login')}
          >
            <Text style={styles.secondaryButtonText}>
              Already have an account? Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl * 2,
    paddingBottom: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.inverse,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.fontSize.lg,
    color: colors.text.inverse,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: typography.lineHeight.relaxed * typography.fontSize.lg,
  },
  featuresContainer: {
    marginBottom: spacing.xl,
  },
  featureCard: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  featureIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  featureTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  featureDescription: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: typography.lineHeight.relaxed * typography.fontSize.base,
  },
  buttonContainer: {
    marginTop: 'auto',
  },
  primaryButton: {
    backgroundColor: colors.background.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  primaryButtonText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary[700],
  },
  secondaryButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: typography.fontSize.base,
    color: colors.text.inverse,
    opacity: 0.9,
  },
});
