import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, X, CheckCircle, Circle } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { Task, TaskCategory } from '@/types/database';

export default function QuestsScreen() {
  const { profile } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPoints, setNewTaskPoints] = useState('10');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTasks();
  }, [profile]);

  async function loadTasks() {
    if (!profile) return;

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setTasks(data);
    }
  }

  async function createTask() {
    if (!profile || !newTaskTitle.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('tasks').insert({
        user_id: profile.id,
        title: newTaskTitle.trim(),
        category: 'Personal' as any,
        points: parseInt(newTaskPoints) || 10,
        is_completed: false,
        is_recurring: false,
      });

      if (error) throw error;

      setNewTaskTitle('');
      setNewTaskPoints('10');
      setModalVisible(false);
      await loadTasks();
    } catch (error: any) {
      Alert.alert('Error', 'Failed to create task');
    } finally {
      setLoading(false);
    }
  }

  async function toggleTaskCompletion(task: Task) {
    try {
      const newCompletedStatus = !task.is_completed;

      const { error } = await supabase
        .from('tasks')
        .update({
          is_completed: newCompletedStatus,
          completed_at: newCompletedStatus ? new Date().toISOString() : null,
        } as any)
        .eq('id', task.id);

      if (error) throw error;

      if (newCompletedStatus && profile) {
        await supabase
          .from('profiles')
          .update({
            total_points: (profile.total_points || 0) + task.points,
            current_points: (profile.current_points || 0) + task.points,
          } as any)
          .eq('id', profile.id);
      }

      await loadTasks();
    } catch (error: any) {
      Alert.alert('Error', 'Failed to update task');
    }
  }

  const activeTasks = tasks.filter((t) => !t.is_completed);
  const completedTasks = tasks.filter((t) => t.is_completed);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Quests</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Plus color={colors.text.inverse} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeTasks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Active Quests</Text>
            {activeTasks.map((task) => (
              <TouchableOpacity
                key={task.id}
                style={styles.taskCard}
                onPress={() => toggleTaskCompletion(task)}
              >
                <View style={styles.taskCheckbox}>
                  <Circle color={colors.primary[700]} size={24} />
                </View>
                <View style={styles.taskContent}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <Text style={styles.taskPoints}>+{task.points} points</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {completedTasks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Completed</Text>
            {completedTasks.map((task) => (
              <View key={task.id} style={[styles.taskCard, styles.completedTask]}>
                <View style={styles.taskCheckbox}>
                  <CheckCircle color={colors.success.main} size={24} />
                </View>
                <View style={styles.taskContent}>
                  <Text style={[styles.taskTitle, styles.completedTaskTitle]}>
                    {task.title}
                  </Text>
                  <Text style={styles.taskPoints}>+{task.points} points</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {tasks.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No quests yet. Tap + to create your first quest!
            </Text>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Quest</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X color={colors.text.secondary} size={24} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Quest title"
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
              placeholderTextColor={colors.text.tertiary}
            />

            <TextInput
              style={styles.input}
              placeholder="Barakah points"
              value={newTaskPoints}
              onChangeText={setNewTaskPoints}
              keyboardType="number-pad"
              placeholderTextColor={colors.text.tertiary}
            />

            <TouchableOpacity
              style={[styles.createButton, loading && styles.buttonDisabled]}
              onPress={createTask}
              disabled={loading}
            >
              <Text style={styles.createButtonText}>Create Quest</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary[700],
    justifyContent: 'center',
    alignItems: 'center',
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
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  completedTask: {
    opacity: 0.6,
  },
  taskCheckbox: {
    marginRight: spacing.md,
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
  completedTaskTitle: {
    textDecorationLine: 'line-through',
  },
  taskPoints: {
    fontSize: typography.fontSize.sm,
    color: colors.secondary[600],
    fontWeight: typography.fontWeight.medium,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl * 2,
  },
  emptyStateText: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background.primary,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  input: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  createButton: {
    backgroundColor: colors.primary[700],
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.inverse,
  },
});
