import React, { useEffect, useState } from 'react';
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { useAuthStore } from './store/authStore';
import { LandingPage } from './pages/LandingPage';
import { ProfilePage } from './pages/ProfilePage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { CollegeBrowserPage } from './pages/CollegeBrowserPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { profileService } from './services/api';

const Navigation: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="border-b border-gray-200 bg-white text-gray-900 shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link to="/chat" className="flex items-center gap-3 text-2xl font-bold">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-950 text-base text-white">
            CG
          </span>
          CollegeGuide
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link to="/chat" className="font-semibold text-gray-700 transition-colors hover:text-blue-700">
            Results
          </Link>
          <Link to="/colleges" className="font-semibold text-gray-700 transition-colors hover:text-blue-700">
            Browse
          </Link>
          <Link to="/favorites" className="font-semibold text-gray-700 transition-colors hover:text-blue-700">
            Favorites
          </Link>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 rounded-lg bg-gray-950 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="space-y-3 border-t border-gray-200 bg-white p-4 md:hidden">
          <Link to="/chat" className="block font-semibold text-gray-700 transition-colors hover:text-blue-700">
            Results
          </Link>
          <Link to="/colleges" className="block font-semibold text-gray-700 transition-colors hover:text-blue-700">
            Browse
          </Link>
          <Link to="/favorites" className="block font-semibold text-gray-700 transition-colors hover:text-blue-700">
            Favorites
          </Link>
          <button
            onClick={onLogout}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-950 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

function App() {
  const { isLoggedIn, logout, setProfile } = useAuthStore();
  const [hasProfile, setHasProfile] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      if (isLoggedIn) {
        try {
          const response = await profileService.getProfile();
          setProfile(response.data);
          setHasProfile(true);
        } catch {
          setHasProfile(false);
        }
      }
      setChecking(false);
    };

    checkProfile();
  }, [isLoggedIn, setProfile]);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  if (checking) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <p className="text-2xl font-bold text-gray-700">Loading...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      {isLoggedIn && <Navigation onLogout={handleLogout} />}

      <Routes>
        {!isLoggedIn ? (
          <Route
            path="*"
            element={
              <LandingPage
                onAuthSuccess={() => {
                  window.location.href = '/profile';
                }}
              />
            }
          />
        ) : !hasProfile ? (
          <Route
            path="*"
            element={
              <ProfilePage
                onSuccess={() => {
                  window.location.href = '/chat';
                }}
              />
            }
          />
        ) : (
          <>
            <Route path="/chat" element={<RecommendationsPage />} />
            <Route path="/results" element={<RecommendationsPage />} />
            <Route
              path="/profile"
              element={
                <ProfilePage
                  onSuccess={() => {
                    window.location.href = '/chat';
                  }}
                />
              }
            />
            <Route path="/colleges" element={<CollegeBrowserPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="*" element={<Navigate to="/chat" />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
