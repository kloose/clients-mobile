import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../theme/colors';

export const LoginScreen = () => {
  const { login, loading } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.title}>RNR Training</Text>
          <Text style={styles.subtitle}>Client Portal</Text>
        </View>

        <View style={styles.loginContainer}>
          <Text style={styles.welcomeText}>Welcome Back!</Text>
          <Text style={styles.descriptionText}>
            Sign in to view your training plans and meal schedules
          </Text>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={login}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Sign in with Auth0</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.securityText}>
            Secure authentication powered by Auth0
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 48,
    fontWeight: '800',
    color: Theme.accent,
    marginBottom: 8,
    letterSpacing: -2,
  },
  subtitle: {
    fontSize: 18,
    color: Theme.textSecondary,
    fontWeight: '500',
  },
  loginContainer: {
    backgroundColor: Theme.surfaceElevated,
    padding: 30,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Theme.border,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: Theme.textPrimary,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  descriptionText: {
    fontSize: 16,
    color: Theme.textSecondary,
    marginBottom: 30,
    lineHeight: 24,
  },
  loginButton: {
    backgroundColor: Theme.accent,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  loginButtonText: {
    color: Theme.black,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  securityText: {
    fontSize: 12,
    color: Theme.textMuted,
    textAlign: 'center',
  },
});