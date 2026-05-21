import React, { useEffect, useState } from 'react';
import { Heart, Trash2 } from 'lucide-react';
import { CollegeCard } from '../components/CollegeCard';
import { collegeService } from '../services/api';

export const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const response = await collegeService.getFavorites();
      setFavorites(response.data);
    } catch (error) {
      console.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (collegeId: string) => {
    try {
      await collegeService.removeFavorite(collegeId);
      setFavorites((prev) => prev.filter((fav) => fav.collegeId._id !== collegeId));
    } catch (error) {
      console.error('Failed to remove favorite');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
        <div className="flex items-center gap-3">
          <Heart size={40} fill="white" />
          <div>
            <h1 className="text-4xl font-bold">My Favorites</h1>
            <p className="text-blue-100">Colleges you've saved for later</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500 text-xl">Loading favorites...</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Heart size={60} className="text-gray-300 mb-4" />
            <p className="text-gray-500 text-xl">You haven't saved any colleges yet</p>
            <p className="text-gray-400 mt-2">Browse colleges and click the heart icon to save them</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((fav) => (
              <div key={fav._id} className="relative">
                <CollegeCard
                  college={fav.collegeId}
                  isFavorite={true}
                />
                <button
                  onClick={() => handleRemoveFavorite(fav.collegeId._id)}
                  className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
