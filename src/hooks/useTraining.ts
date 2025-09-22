import { useEffect, useCallback } from 'react';
import { useSelector } from '@legendapp/state/react';
import { appState$, trainingActions, uiActions } from '../state/store';
import { programService } from '../services/api';

export const useTraining = () => {
  const training = useSelector(() => appState$.training.get());
  const token = useSelector(() => appState$.auth.token.get());

  const loadSchedule = useCallback(async () => {
    if (!token) return;

    try {
      trainingActions.setLoading(true);
      trainingActions.setError(null);

      const schedule = await programService.getMyWeeklySchedule();
      trainingActions.setCurrentSchedule(schedule);
    } catch (error: any) {
      console.error('Error loading schedule:', error);
      trainingActions.setError(error.message || 'Failed to load training schedule');
    } finally {
      trainingActions.setLoading(false);
      uiActions.setRefreshing(false);
    }
  }, [token]);

  const loadPrograms = useCallback(async () => {
    if (!token) return;

    try {
      trainingActions.setLoading(true);
      trainingActions.setError(null);

      const programs = await programService.getMyPrograms();
      trainingActions.setPrograms(programs);
    } catch (error: any) {
      console.error('Error loading programs:', error);
      trainingActions.setError(error.message || 'Failed to load programs');
    } finally {
      trainingActions.setLoading(false);
    }
  }, [token]);

  const refresh = useCallback(async () => {
    uiActions.setRefreshing(true);
    await loadSchedule();
  }, [loadSchedule]);

  useEffect(() => {
    if (token && trainingActions.shouldRefetch()) {
      loadSchedule();
    }
  }, [token, loadSchedule]);

  return {
    schedule: training.currentSchedule,
    programs: training.programs,
    loading: training.loading,
    error: training.error,
    loadSchedule,
    loadPrograms,
    refresh,
  };
};