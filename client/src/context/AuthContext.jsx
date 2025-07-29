    // D:/client/src/context/AuthContext.jsx
    import React, { createContext, useState, useEffect, useContext } from 'react';
    import axios from 'axios';
    import authService from '../services/authService'; // Use the service

    const AuthContext = createContext(null);

    export const AuthProvider = ({ children }) => {
      const [user, setUser] = useState(null); // user will now include { id, name, email, role }
      const [loading, setLoading] = useState(true);

      // Function to set user and token in localStorage
      const login = (userData, token) => {
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
        setUser(userData);
      };

      // Function to clear user and token from localStorage
      const logout = async () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        // Optional: Call backend logout endpoint if needed for session invalidation (less common with JWT)
        try {
          await authService.logout();
        } catch (error) {
          console.error('Error during backend logout:', error);
        }
      };

      useEffect(() => {
        const checkAuthStatus = async () => {
          const storedUser = localStorage.getItem('user');
          const storedToken = localStorage.getItem('token');

          if (storedUser && storedToken) {
            try {
              // Set Authorization header for this specific check
              axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
              const response = await authService.checkLoginStatus(); // Use the service
              if (response.data.loggedIn) {
                setUser(response.data.user); // user object from backend will contain role
              } else {
                logout(); // Token invalid or expired
              }
            } catch (error) {
              console.error('Failed to verify token with backend:', error);
              logout(); // Clear invalid token
            }
          }
          setLoading(false);
        };

        checkAuthStatus();
      }, []); // Run once on component mount

      // Axios Interceptor for automatically adding JWT to requests
      useEffect(() => {
        const requestInterceptor = axios.interceptors.request.use(
          (config) => {
            const token = localStorage.getItem('token');
            if (token) {
              config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
          },
          (error) => {
            return Promise.reject(error);
          }
        );

        const responseInterceptor = axios.interceptors.response.use(
          (response) => response,
          (error) => {
            // Check for 403 Forbidden specifically for invalid/expired token message
            if (error.response && error.response.status === 403 &&
                (error.response.data.message === 'Forbidden: Invalid or expired token.' ||
                 error.response.data.message === 'Unauthorized: No token provided.' ||
                 error.response.data.message === 'Unauthorized: Token format invalid.')) {
              console.warn("Token expired or invalid. Logging out.");
              logout(); // Auto-logout on token expiration
            }
            return Promise.reject(error);
          }
        );

        return () => {
          axios.interceptors.request.eject(requestInterceptor);
          axios.interceptors.response.eject(responseInterceptor);
        };
      }, []);

      return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
          {!loading && children} {/* Render children only after auth status is checked */}
        </AuthContext.Provider>
      );
    };

    export const useAuth = () => useContext(AuthContext);
    