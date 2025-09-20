import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { mealPlanService, MealPlan, Meal } from '../services/api';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../theme/colors';

export const MealPlansScreen = () => {
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>('Monday');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    loadMealPlan();
  }, []);

  const loadMealPlan = async () => {
    try {
      setError(null);
      const data = await mealPlanService.getCurrentMealPlan();
      setMealPlan(data);
    } catch (err) {
      setError('Failed to load meal plan');
      console.error('Error loading meal plan:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadMealPlan();
  };

  const getMealsForDay = (day: string): Meal[] => {
    if (!mealPlan) return [];
    return mealPlan.meals.filter(meal => meal.dayOfWeek === day);
  };

  const getMealTypeIcon = (mealType: string): keyof typeof Ionicons.glyphMap => {
    switch (mealType) {
      case 'BREAKFAST':
        return 'sunny-outline';
      case 'LUNCH':
        return 'partly-sunny-outline';
      case 'DINNER':
        return 'moon-outline';
      case 'SNACK':
        return 'nutrition-outline';
      default:
        return 'restaurant-outline';
    }
  };

  const renderMeal = (meal: Meal) => (
    <View key={meal.id} style={styles.mealCard}>
      <View style={styles.mealHeader}>
        <View style={styles.mealTypeContainer}>
          <Ionicons
            name={getMealTypeIcon(meal.mealType)}
            size={20}
            color={Theme.accent}
          />
          <Text style={styles.mealType}>{meal.mealType}</Text>
        </View>
      </View>

      <Text style={styles.mealName}>{meal.recipeName}</Text>

      {meal.recipeDescription && (
        <Text style={styles.mealDescription}>{meal.recipeDescription}</Text>
      )}

      <View style={styles.nutritionContainer}>
        {meal.calories && (
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{meal.calories}</Text>
            <Text style={styles.nutritionLabel}>Cal</Text>
          </View>
        )}
        {meal.protein && (
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{meal.protein}g</Text>
            <Text style={styles.nutritionLabel}>Protein</Text>
          </View>
        )}
        {meal.carbs && (
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{meal.carbs}g</Text>
            <Text style={styles.nutritionLabel}>Carbs</Text>
          </View>
        )}
        {meal.fat && (
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{meal.fat}g</Text>
            <Text style={styles.nutritionLabel}>Fat</Text>
          </View>
        )}
      </View>

      {meal.ingredients && meal.ingredients.length > 0 && (
        <View style={styles.ingredientsContainer}>
          <Text style={styles.ingredientsTitle}>Ingredients:</Text>
          {meal.ingredients.map((ingredient, index) => (
            <Text key={index} style={styles.ingredient}>• {ingredient}</Text>
          ))}
        </View>
      )}

      {meal.instructions && (
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Instructions:</Text>
          <Text style={styles.instructions}>{meal.instructions}</Text>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Theme.accent} />
        <Text style={styles.loadingText}>Loading your meal plan...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={64} color={Theme.danger} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadMealPlan}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!mealPlan) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="restaurant-outline" size={64} color={Theme.textMuted} />
        <Text style={styles.emptyText}>No meal plan assigned</Text>
        <Text style={styles.emptySubtext}>
          Contact your trainer to get started
        </Text>
      </View>
    );
  }

  const currentDayMeals = getMealsForDay(selectedDay);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.planName}>{mealPlan.name}</Text>
        {mealPlan.startDate && mealPlan.endDate && (
          <Text style={styles.planDates}>
            {new Date(mealPlan.startDate).toLocaleDateString()} - {new Date(mealPlan.endDate).toLocaleDateString()}
          </Text>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.daySelector}
      >
        {daysOfWeek.map((day) => (
          <TouchableOpacity
            key={day}
            style={[
              styles.dayButton,
              selectedDay === day && styles.dayButtonActive
            ]}
            onPress={() => setSelectedDay(day)}
          >
            <Text
              style={[
                styles.dayButtonText,
                selectedDay === day && styles.dayButtonTextActive
              ]}
            >
              {day.substring(0, 3)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.mealsContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {currentDayMeals.length > 0 ? (
          currentDayMeals.map(renderMeal)
        ) : (
          <View style={styles.noMealsContainer}>
            <Ionicons name="calendar-outline" size={48} color={Theme.textMuted} />
            <Text style={styles.noMealsText}>No meals planned for {selectedDay}</Text>
          </View>
        )}
      </ScrollView>
    </View>
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
  planDates: {
    marginTop: 4,
    fontSize: 14,
    color: Theme.textSecondary,
  },
  daySelector: {
    backgroundColor: Theme.surface,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Theme.border,
  },
  dayButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: Theme.surfaceElevated,
    borderWidth: 1,
    borderColor: Theme.border,
  },
  dayButtonActive: {
    backgroundColor: Theme.accent,
    borderColor: Theme.accent,
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.textSecondary,
  },
  dayButtonTextActive: {
    color: Theme.black,
    fontWeight: '700',
  },
  mealsContainer: {
    flex: 1,
    padding: 16,
  },
  mealCard: {
    backgroundColor: Theme.surfaceElevated,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Theme.border,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  mealTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealType: {
    fontSize: 12,
    fontWeight: '700',
    color: Theme.accent,
    textTransform: 'uppercase',
    marginLeft: 8,
  },
  mealName: {
    fontSize: 18,
    fontWeight: '600',
    color: Theme.textPrimary,
    marginBottom: 4,
  },
  mealDescription: {
    fontSize: 14,
    color: Theme.textSecondary,
    marginBottom: 12,
  },
  nutritionContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Theme.border,
  },
  nutritionItem: {
    marginRight: 24,
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.accent,
  },
  nutritionLabel: {
    fontSize: 12,
    color: Theme.textMuted,
    marginTop: 2,
  },
  ingredientsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Theme.border,
  },
  ingredientsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.textPrimary,
    marginBottom: 8,
  },
  ingredient: {
    fontSize: 14,
    color: Theme.textSecondary,
    marginBottom: 4,
  },
  instructionsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Theme.border,
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.textPrimary,
    marginBottom: 8,
  },
  instructions: {
    fontSize: 14,
    color: Theme.textSecondary,
    lineHeight: 20,
  },
  noMealsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  noMealsText: {
    marginTop: 12,
    fontSize: 16,
    color: Theme.textMuted,
  },
});