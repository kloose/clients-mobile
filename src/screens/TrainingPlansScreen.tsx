import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../theme/colors';
import { useTraining } from '../hooks/useTraining';
import { useObservable, useSelector } from '@legendapp/state/react';
import { appState$, uiActions } from '../state/store';
import { ExerciseSlot } from '../services/api';

export const TrainingPlansScreen = () => {
  const { schedule, loading, error, refresh } = useTraining();
  const expandedDays = useSelector(() => appState$.ui.expandedDays.get());
  const refreshing = useSelector(() => appState$.ui.refreshing.get());

  const toggleDay = (weekDay: string) => {
    uiActions.toggleExpandedDay(weekDay);
  };

  const renderExercise = (exercise: ExerciseSlot) => (
    <View key={exercise.id} style={styles.exerciseCard}>
      <Text style={styles.exerciseName}>{exercise.exerciseName}</Text>
      <View style={styles.exerciseDetails}>
        {exercise.sets && exercise.reps && (
          <Text style={styles.exerciseDetail}>
            {exercise.sets} sets × {exercise.reps} reps
          </Text>
        )}
        {exercise.weight && (
          <Text style={styles.exerciseDetail}>{exercise.weight} kg</Text>
        )}
        {exercise.restSeconds && (
          <Text style={styles.exerciseDetail}>Rest: {exercise.restSeconds}s</Text>
        )}
      </View>
      {exercise.notes && (
        <Text style={styles.exerciseNotes}>{exercise.notes}</Text>
      )}
    </View>
  );

  if (loading && !schedule) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Theme.accent} />
        <Text style={styles.loadingText}>Loading your training plan...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={64} color={Theme.danger} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refresh}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!schedule || !schedule.weeks || schedule.weeks.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="calendar-outline" size={64} color={Theme.textMuted} />
        <Text style={styles.emptyText}>No training plan assigned</Text>
        <Text style={styles.emptySubtext}>
          Contact your trainer to get started
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={refresh}
          tintColor={Theme.accent}
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.planName}>{schedule.name}</Text>
        <Text style={styles.planSubtitle}>
          {schedule.weeks.length} week program
        </Text>
      </View>

      {schedule.weeks.map((week) => (
        <View key={week.weekNumber} style={styles.weekContainer}>
          <Text style={styles.weekTitle}>Week {week.weekNumber}</Text>
          {week.days.map((day) => {
            const dayKey = `${week.weekNumber}-${day.dayOfWeek}`;
            const isExpanded = expandedDays?.has(dayKey) || false;
            return (
              <View key={dayKey} style={styles.dayContainer}>
                <TouchableOpacity
                  style={styles.dayHeader}
                  onPress={() => toggleDay(dayKey)}
                >
                  <View>
                    <Text style={styles.dayName}>{day.dayOfWeek}</Text>
                    <Text style={styles.exerciseCount}>
                      {day.exercises.length} exercises
                    </Text>
                  </View>
                  <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={24}
                    color={Theme.textMuted}
                  />
                </TouchableOpacity>
                {isExpanded && (
                  <View style={styles.exercisesContainer}>
                    {day.exercises.map(renderExercise)}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Theme.textSecondary,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: Theme.danger,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: Theme.accent,
    borderRadius: 12,
  },
  retryButtonText: {
    color: Theme.black,
    fontSize: 16,
    fontWeight: '700',
  },
  emptyText: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '600',
    color: Theme.textPrimary,
  },
  emptySubtext: {
    marginTop: 4,
    fontSize: 14,
    color: Theme.textMuted,
  },
  header: {
    padding: 20,
    backgroundColor: Theme.surface,
    borderBottomWidth: 1,
    borderBottomColor: Theme.border,
  },
  planName: {
    fontSize: 28,
    fontWeight: '700',
    color: Theme.textPrimary,
    letterSpacing: -0.5,
  },
  planSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: Theme.textSecondary,
  },
  weekContainer: {
    marginTop: 16,
    marginHorizontal: 16,
  },
  weekTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Theme.textPrimary,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  dayContainer: {
    backgroundColor: Theme.surfaceElevated,
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Theme.border,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  dayName: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.textPrimary,
  },
  exerciseCount: {
    fontSize: 14,
    color: Theme.textSecondary,
    marginTop: 2,
  },
  exercisesContainer: {
    padding: 16,
    paddingTop: 0,
  },
  exerciseCard: {
    backgroundColor: Theme.surface,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Theme.border,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '500',
    color: Theme.textPrimary,
    marginBottom: 8,
  },
  exerciseDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  exerciseDetail: {
    fontSize: 14,
    color: Theme.accent,
    marginRight: 16,
    marginBottom: 4,
    fontWeight: '600',
  },
  exerciseNotes: {
    marginTop: 8,
    fontSize: 14,
    color: Theme.textSecondary,
    fontStyle: 'italic',
  },
});