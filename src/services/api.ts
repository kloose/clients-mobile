import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/auth';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Types
export interface Program {
  id: string;
  name: string;
  description?: string;
  duration?: number;
  weeklySchedule?: WeeklySchedule;
}

export interface WeeklySchedule {
  id: string;
  userId: string;
  name: string;
  weeks: Week[];
}

export interface Week {
  weekNumber: number;
  days: Day[];
}

export interface Day {
  dayOfWeek: string;
  exercises: ExerciseSlot[];
}

export interface ExerciseSlot {
  id: string;
  exerciseName: string;
  sets?: number;
  reps?: number;
  weight?: number;
  restSeconds?: number;
  notes?: string;
}

export interface MealPlan {
  id: string;
  userId: string;
  name: string;
  startDate?: string;
  endDate?: string;
  meals: Meal[];
  createdAt: string;
  updatedAt: string;
}

export interface Meal {
  id: string;
  mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';
  recipeName: string;
  recipeDescription?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  ingredients: string[];
  instructions?: string;
  dayOfWeek?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  phoneNumber?: string;
}

// API Services
export const programService = {
  getMyPrograms: async (): Promise<Program[]> => {
    const response = await api.get('/programs/my-programs');
    return response.data;
  },

  getProgramById: async (id: string): Promise<Program> => {
    const response = await api.get(`/programs/${id}`);
    return response.data;
  },

  getMyWeeklySchedule: async (): Promise<WeeklySchedule> => {
    const response = await api.get('/weekly-programs/my-schedule');
    return response.data;
  },
};

export const mealPlanService = {
  getMyMealPlans: async (): Promise<MealPlan[]> => {
    const response = await api.get('/user-meal-plans/my-plans');
    return response.data;
  },

  getMealPlanById: async (id: string): Promise<MealPlan> => {
    const response = await api.get(`/user-meal-plans/${id}`);
    return response.data;
  },

  getCurrentMealPlan: async (): Promise<MealPlan | null> => {
    const response = await api.get('/user-meal-plans/current');
    return response.data;
  },
};

export const userService = {
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/users/me');
    return response.data;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await api.put('/users/me', data);
    return response.data;
  },
};

export default api;