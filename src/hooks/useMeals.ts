import { useEffect, useCallback } from 'react';
import { useSelector } from '@legendapp/state/react';
import { appState$, mealActions, uiActions } from '../state/store';
import { mealPlanService } from '../services/api';

export const useMeals = () => {
  const meals = useSelector(() => appState$.meals.get());
  const token = useSelector(() => appState$.auth.token.get());
  const selectedDay = useSelector(() => appState$.ui.selectedDay.get());

  const loadMealPlan = useCallback(async () => {
    if (!token) return;

    try {
      mealActions.setLoading(true);
      mealActions.setError(null);

      const mealPlan = await mealPlanService.getCurrentMealPlan();
      mealActions.setCurrentMealPlan(mealPlan);
    } catch (error: any) {
      console.error('Error loading meal plan:', error);
      mealActions.setError(error.message || 'Failed to load meal plan');
    } finally {
      mealActions.setLoading(false);
      uiActions.setRefreshing(false);
    }
  }, [token]);

  const loadAllMealPlans = useCallback(async () => {
    if (!token) return;

    try {
      mealActions.setLoading(true);
      mealActions.setError(null);

      const plans = await mealPlanService.getMyMealPlans();
      mealActions.setMealPlans(plans);
    } catch (error: any) {
      console.error('Error loading meal plans:', error);
      mealActions.setError(error.message || 'Failed to load meal plans');
    } finally {
      mealActions.setLoading(false);
    }
  }, [token]);

  const refresh = useCallback(async () => {
    uiActions.setRefreshing(true);
    await loadMealPlan();
  }, [loadMealPlan]);

  const getMealsForDay = useCallback((day: string) => {
    if (!meals.currentMealPlan) return [];
    return meals.currentMealPlan.meals.filter(meal => meal.dayOfWeek === day);
  }, [meals.currentMealPlan]);

  const selectDay = useCallback((day: string) => {
    uiActions.setSelectedDay(day);
  }, []);

  useEffect(() => {
    if (token && mealActions.shouldRefetch()) {
      loadMealPlan();
    }
  }, [token, loadMealPlan]);

  return {
    currentMealPlan: meals.currentMealPlan,
    mealPlans: meals.mealPlans,
    loading: meals.loading,
    error: meals.error,
    selectedDay,
    loadMealPlan,
    loadAllMealPlans,
    refresh,
    getMealsForDay,
    selectDay,
  };
};