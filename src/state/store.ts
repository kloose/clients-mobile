import { observable, Observable } from '@legendapp/state';
import {
  User,
  Program,
  WeeklySchedule,
  MealPlan
} from '../services/api';

// Define the app state interface
interface AppState {
  auth: {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
  };
  training: {
    programs: Program[];
    currentSchedule: WeeklySchedule | null;
    loading: boolean;
    error: string | null;
    lastFetch: number | null;
  };
  meals: {
    mealPlans: MealPlan[];
    currentMealPlan: MealPlan | null;
    loading: boolean;
    error: string | null;
    lastFetch: number | null;
  };
  ui: {
    selectedDay: string;
    expandedDays: Set<string>;
    refreshing: boolean;
  };
  settings: {
    theme: 'dark' | 'light';
    notificationsEnabled: boolean;
    biometricsEnabled: boolean;
  };
}

// Create the observable state
export const appState$ = observable<AppState>({
  auth: {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true,
  },
  training: {
    programs: [],
    currentSchedule: null,
    loading: false,
    error: null,
    lastFetch: null,
  },
  meals: {
    mealPlans: [],
    currentMealPlan: null,
    loading: false,
    error: null,
    lastFetch: null,
  },
  ui: {
    selectedDay: 'Monday',
    expandedDays: new Set(),
    refreshing: false,
  },
  settings: {
    theme: 'dark',
    notificationsEnabled: false,
    biometricsEnabled: false,
  },
});

// Helper functions for state management
export const authActions = {
  setUser: (user: User | null) => {
    appState$.auth.user.set(user);
  },
  setToken: (token: string | null) => {
    appState$.auth.token.set(token);
    appState$.auth.isAuthenticated.set(!!token);
  },
  setLoading: (loading: boolean) => {
    appState$.auth.loading.set(loading);
  },
  logout: () => {
    appState$.auth.set({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
    });
    // Clear cached data
    appState$.training.set({
      programs: [],
      currentSchedule: null,
      loading: false,
      error: null,
      lastFetch: null,
    });
    appState$.meals.set({
      mealPlans: [],
      currentMealPlan: null,
      loading: false,
      error: null,
      lastFetch: null,
    });
  },
};

export const trainingActions = {
  setPrograms: (programs: Program[]) => {
    appState$.training.programs.set(programs);
    appState$.training.lastFetch.set(Date.now());
  },
  setCurrentSchedule: (schedule: WeeklySchedule | null) => {
    appState$.training.currentSchedule.set(schedule);
    appState$.training.lastFetch.set(Date.now());
  },
  setLoading: (loading: boolean) => {
    appState$.training.loading.set(loading);
  },
  setError: (error: string | null) => {
    appState$.training.error.set(error);
  },
  shouldRefetch: (): boolean => {
    const lastFetch = appState$.training.lastFetch.peek();
    if (!lastFetch) return true;
    const hoursSinceLastFetch = (Date.now() - lastFetch) / (1000 * 60 * 60);
    return hoursSinceLastFetch > 1; // Refetch if data is older than 1 hour
  },
};

export const mealActions = {
  setMealPlans: (plans: MealPlan[]) => {
    appState$.meals.mealPlans.set(plans);
    appState$.meals.lastFetch.set(Date.now());
  },
  setCurrentMealPlan: (plan: MealPlan | null) => {
    appState$.meals.currentMealPlan.set(plan);
    appState$.meals.lastFetch.set(Date.now());
  },
  setLoading: (loading: boolean) => {
    appState$.meals.loading.set(loading);
  },
  setError: (error: string | null) => {
    appState$.meals.error.set(error);
  },
  shouldRefetch: (): boolean => {
    const lastFetch = appState$.meals.lastFetch.peek();
    if (!lastFetch) return true;
    const hoursSinceLastFetch = (Date.now() - lastFetch) / (1000 * 60 * 60);
    return hoursSinceLastFetch > 1; // Refetch if data is older than 1 hour
  },
};

export const uiActions = {
  setSelectedDay: (day: string) => {
    appState$.ui.selectedDay.set(day);
  },
  toggleExpandedDay: (dayKey: string) => {
    const expandedDays = new Set(appState$.ui.expandedDays.peek());
    if (expandedDays.has(dayKey)) {
      expandedDays.delete(dayKey);
    } else {
      expandedDays.add(dayKey);
    }
    appState$.ui.expandedDays.set(expandedDays);
  },
  setRefreshing: (refreshing: boolean) => {
    appState$.ui.refreshing.set(refreshing);
  },
};

export const settingsActions = {
  setTheme: (theme: 'dark' | 'light') => {
    appState$.settings.theme.set(theme);
  },
  toggleNotifications: () => {
    const current = appState$.settings.notificationsEnabled.peek();
    appState$.settings.notificationsEnabled.set(!current);
  },
  toggleBiometrics: () => {
    const current = appState$.settings.biometricsEnabled.peek();
    appState$.settings.biometricsEnabled.set(!current);
  },
};

// Export typed observables for use in components
export type AppStateObservable = Observable<AppState>;
export default appState$;