    // D:/client/src/App.jsx
    import React from 'react';
    import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
    import HomePage from './pages/HomePage';
    import LoginPage from './pages/LoginPage';
    import SignupPage from './pages/SignupPage';
    import AvailablePlacesPage from './pages/AvailablePlacesPage';
    import UserProfilePage from './pages/UserProfilePage';
    import AdminDashboardPage from './pages/AdminDashboardPage';
    import AddPlacePage from './pages/admin/AddPlacePage';
    import ManagePlacesPage from './pages/admin/ManagePlacesPage';
    import AllBookingsPage from './pages/admin/AllBookingsPage';
    import ManageUsersPage from './pages/admin/ManageUsersPage';

    import Header from './components/Header';
    import Footer from './components/Footer';
    import { AuthProvider } from './context/AuthContext';
    import PrivateRoute from './components/PrivateRoute';
    import AdminRoute from './components/AdminRoute';


    function App() {
      return (
        <Router>
          <AuthProvider>
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                {/* Protected Routes (User) */}
                <Route element={<PrivateRoute />}>
                  <Route path="/places" element={<AvailablePlacesPage />} />
                  <Route path="/profile" element={<UserProfilePage />} />
                </Route>

                {/* Admin Protected Routes */}
                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<AdminDashboardPage />} />
                  <Route path="/admin/add-place" element={<AddPlacePage />} />
                  <Route path="/admin/manage-places" element={<ManagePlacesPage />} />
                  <Route path="/admin/all-bookings" element={<AllBookingsPage />} />
                  <Route path="/admin/manage-users" element={<ManageUsersPage />} />
                </Route>

                {/* Fallback for unknown routes */}
                <Route path="*" element={<div>404 Not Found</div>} />
              </Routes>
            </main>
            <Footer />
          </AuthProvider>
        </Router>
      );
    }

    export default App;
    