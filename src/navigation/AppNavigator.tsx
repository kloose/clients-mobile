import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { LoginScreen } from '../screens/LoginScreen';
import { TrainingPlansScreen } from '../screens/TrainingPlansScreen';
import { MealPlansScreen } from '../screens/MealPlansScreen';
import { AccountScreen } from '../screens/AccountScreen';
import { Theme } from '../theme/colors';

const navigationTheme = {
  dark: true,
  colors: {
    primary: Theme.accent,
    background: Theme.background,
    card: Theme.surface,
    text: Theme.textPrimary,
    border: Theme.border,
    notification: Theme.accent,
  },
};

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Training') {
            iconName = focused ? 'barbell' : 'barbell-outline';
          } else if (route.name === 'Meals') {
            iconName = focused ? 'nutrition' : 'nutrition-outline';
          } else if (route.name === 'Account') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Theme.accent,
        tabBarInactiveTintColor: Theme.textMuted,
        tabBarStyle: {
          backgroundColor: Theme.surfaceElevated,
          borderTopColor: Theme.border,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
        },
        headerStyle: {
          backgroundColor: Theme.surface,
          borderBottomColor: Theme.border,
          borderBottomWidth: 1,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: Theme.textPrimary,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
          letterSpacing: -0.5,
        },
      })}
    >
      <Tab.Screen
        name="Training"
        component={TrainingPlansScreen}
        options={{ title: 'My Training Plans' }}
      />
      <Tab.Screen
        name="Meals"
        component={MealPlansScreen}
        options={{ title: 'My Meal Plans' }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{ title: 'My Account' }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <Stack.Screen name="Main" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};