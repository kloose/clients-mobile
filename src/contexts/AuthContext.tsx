import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as Crypto from 'expo-crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH0_CONFIG, AUTH0_DOMAIN, AUTH0_CLIENT_ID } from '../config/auth';

WebBrowser.maybeCompleteAuthSession();

interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const useProxy = __DEV__;
const redirectUri = AuthSession.makeRedirectUri({ useProxy });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const discovery = AuthSession.useAutoDiscovery(`https://${AUTH0_DOMAIN}`);

  const [request, result, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: AUTH0_CLIENT_ID,
      scopes: ['openid', 'profile', 'email', 'offline_access'],
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      codeChallenge: Crypto.randomUUID(),
      extraParams: {
        audience: AUTH0_CONFIG.audience,
      },
    },
    discovery
  );

  useEffect(() => {
    loadStoredAuth();
  }, []);

  useEffect(() => {
    if (result?.type === 'success' && request) {
      exchangeCodeForToken(result.params.code);
    }
  }, [result, request]);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('access_token');
      const storedUser = await AsyncStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const exchangeCodeForToken = async (code: string) => {
    try {
      const tokenResponse = await AuthSession.exchangeCodeAsync(
        {
          clientId: AUTH0_CLIENT_ID,
          code,
          redirectUri,
          extraParams: {
            code_verifier: request?.codeVerifier || '',
          },
        },
        discovery!
      );

      const accessToken = tokenResponse.accessToken;
      setToken(accessToken);
      await AsyncStorage.setItem('access_token', accessToken);

      // Get user info
      const userInfoResponse = await fetch(`https://${AUTH0_DOMAIN}/userinfo`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const userInfo = await userInfoResponse.json();
      const user: User = {
        id: userInfo.sub,
        email: userInfo.email,
        name: userInfo.name || userInfo.email,
        picture: userInfo.picture,
      };

      setUser(user);
      await AsyncStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Error exchanging code for token:', error);
    }
  };

  const login = useCallback(async () => {
    setLoading(true);
    try {
      await promptAsync();
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  }, [promptAsync]);

  const logout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('user');
      setToken(null);
      setUser(null);

      // Open logout URL
      await WebBrowser.openAuthSessionAsync(
        `https://${AUTH0_DOMAIN}/v2/logout?client_id=${AUTH0_CLIENT_ID}&returnTo=${encodeURIComponent(redirectUri)}`,
        redirectUri
      );
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};