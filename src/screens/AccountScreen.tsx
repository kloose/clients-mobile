import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Alert,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { userService, User } from '../services/api';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../theme/colors';

export const AccountScreen = () => {
  const { user: authUser, logout } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setError(null);
      const data = await userService.getCurrentUser();
      setUser(data);
      setEditedUser(data);
    } catch (err) {
      setError('Failed to load profile');
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadUserProfile();
  };

  const handleEdit = () => {
    setEditing(true);
    setEditedUser({ ...user });
  };

  const handleCancel = () => {
    setEditing(false);
    setEditedUser({ ...user });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await userService.updateProfile({
        firstName: editedUser.firstName,
        lastName: editedUser.lastName,
        phoneNumber: editedUser.phoneNumber,
      });
      setUser(updated);
      setEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (err) {
      Alert.alert('Error', 'Failed to update profile');
      console.error('Error updating profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Theme.accent} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={64} color={Theme.danger} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadUserProfile}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={80} color={Theme.accent} />
        </View>
        <Text style={styles.userName}>
          {user?.firstName && user?.lastName
            ? `${user.firstName} ${user.lastName}`
            : user?.email || 'User'}
        </Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          {!editing && (
            <TouchableOpacity onPress={handleEdit}>
              <Ionicons name="pencil" size={20} color={Theme.accent} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>First Name</Text>
          {editing ? (
            <TextInput
              style={styles.input}
              value={editedUser.firstName || ''}
              onChangeText={(text) => setEditedUser({ ...editedUser, firstName: text })}
              placeholder="Enter first name"
            />
          ) : (
            <Text style={styles.fieldValue}>{user?.firstName || 'Not set'}</Text>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Last Name</Text>
          {editing ? (
            <TextInput
              style={styles.input}
              value={editedUser.lastName || ''}
              onChangeText={(text) => setEditedUser({ ...editedUser, lastName: text })}
              placeholder="Enter last name"
            />
          ) : (
            <Text style={styles.fieldValue}>{user?.lastName || 'Not set'}</Text>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Phone Number</Text>
          {editing ? (
            <TextInput
              style={styles.input}
              value={editedUser.phoneNumber || ''}
              onChangeText={(text) => setEditedUser({ ...editedUser, phoneNumber: text })}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
            />
          ) : (
            <Text style={styles.fieldValue}>{user?.phoneNumber || 'Not set'}</Text>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Email</Text>
          <Text style={styles.fieldValue}>{user?.email}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Account Type</Text>
          <Text style={styles.fieldValue}>{user?.role === 'USER' ? 'Client' : user?.role}</Text>
        </View>

        {editing && (
          <View style={styles.editActions}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.saveButtonText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Information</Text>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Version</Text>
          <Text style={styles.fieldValue}>1.0.0</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Support</Text>
          <Text style={styles.fieldValue}>support@rnrtraining.com</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color={Theme.danger} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
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
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: Theme.surface,
    borderBottomWidth: 1,
    borderBottomColor: Theme.border,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    color: Theme.textPrimary,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  userEmail: {
    fontSize: 14,
    color: Theme.textSecondary,
  },
  section: {
    backgroundColor: Theme.surfaceElevated,
    margin: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Theme.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Theme.textPrimary,
    letterSpacing: -0.3,
  },
  field: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 12,
    color: Theme.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  fieldValue: {
    fontSize: 16,
    color: Theme.textPrimary,
  },
  input: {
    fontSize: 16,
    color: Theme.textPrimary,
    borderWidth: 1,
    borderColor: Theme.border,
    borderRadius: 8,
    padding: 12,
    backgroundColor: Theme.surface,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Theme.surface,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Theme.border,
  },
  cancelButtonText: {
    color: Theme.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: Theme.accent,
    marginLeft: 8,
  },
  saveButtonText: {
    color: Theme.black,
    fontSize: 16,
    fontWeight: '700',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.surfaceElevated,
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Theme.danger,
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    color: Theme.danger,
    fontWeight: '700',
  },
});