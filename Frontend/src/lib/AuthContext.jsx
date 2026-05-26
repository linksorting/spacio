import React, { createContext, useState, useContext, useEffect } from 'react';
import { apiClient } from '@/api/apiClient';
import { appParams } from '@/lib/app-params';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [appPublicSettings, setAppPublicSettings] = useState(null); // Contains only { id, public_settings }

  useEffect(() => {
    checkAppState();
  }, []);

  const checkAppState = async () => {
    try {
      setIsLoadingPublicSettings(true);
      setAuthError(null);

      try {
        const token = apiClient.getToken();
        if (token) {
          apiClient.setToken(token);
        }

        const publicSettings = await apiClient.apps.getPublicSettings(appParams.appId);
        setAppPublicSettings(publicSettings);

        if (token) {
          await checkUserAuth();
        } else {
          setIsLoadingAuth(false);
          setIsAuthenticated(false);
          setAuthChecked(true);
        }
      } catch (appError) {
        console.warn('App state check failed (continuing offline):', appError);

        if (appError.status === 403 && appError.data?.extra_data?.reason) {
          const reason = appError.data.extra_data.reason;
          if (reason === 'auth_required') {
            setAuthError({
              type: 'auth_required',
              message: 'Authentication required'
            });
          } else if (reason === 'user_not_registered') {
            setAuthError({
              type: 'user_not_registered',
              message: 'User not registered for this app'
            });
          } else {
            setAuthError({
              type: reason,
              message: appError.message
            });
          }
        } else if (appError.status >= 500 || appError.status === 0) {
          // Backend unavailable — allow local editor use in dev
          setAppPublicSettings({ id: appParams.appId, public_settings: { app_name: 'Designer Pro', auth_required: false } });
          setIsLoadingAuth(false);
          setIsAuthenticated(false);
          setAuthChecked(true);
        } else {
          setAuthError({
            type: 'unknown',
            message: appError.message || 'Failed to load app state'
          });
          setIsLoadingAuth(false);
          setAuthChecked(true);
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setAuthError({
        type: 'unknown',
        message: error.message || 'An unexpected error occurred'
      });
      setIsLoadingAuth(false);
      setAuthChecked(true);
    } finally {
      setIsLoadingPublicSettings(false);
    }
  };

  const checkUserAuth = async () => {
    setIsLoadingAuth(true);
    try {
      const currentUser = await apiClient.auth.me();
      setUser(currentUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('User auth check failed:', error);
      setUser(null);
      setIsAuthenticated(false);
      if (error.status === 401 || error.status === 403) {
        setAuthError({
          type: 'auth_required',
          message: 'Authentication required'
        });
      }
    } finally {
      setIsLoadingAuth(false);
      setAuthChecked(true);
    }
  };

  const logout = (shouldRedirect = true) => {
    setUser(null);
    setIsAuthenticated(false);
    apiClient.auth.logout(shouldRedirect ? window.location.href : null);
  };

  const navigateToLogin = () => {
    apiClient.auth.redirectToLogin(window.location.href);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      authChecked,
      logout,
      navigateToLogin,
      checkUserAuth,
      checkAppState
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
