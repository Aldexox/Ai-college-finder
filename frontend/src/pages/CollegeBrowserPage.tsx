import React, { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { CollegeCard } from '../components/CollegeCard';
import { collegeService } from '../services/api';

export const CollegeBrowserPage: React.FC = () => {
  const [colleges, setColleges] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    course: '',
    state: '',
    type: '',
    budget: '',
  });
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadColleges();
    loadFavorites();
  }, []);

  const loadColleges = async () => {
    setLoading(true);
    try {
      const response = await collegeService.getColleges(filters);
      setColleges(response.data);
    } catch (error) {
      console.error('Failed to load colleges');
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const response = await collegeService.getFavorites();
      setFavorites(response.data.map((fav: any) => fav.collegeId._id || fav.collegeId));
    } catch (error) {
      console.error('Failed to load favorites');
    }
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    loadColleges();
    setShowFilters(false);
  };

  const handleFavorite = async (collegeId: string) => {
    try {
      if (favorites.includes(collegeId)) {
        await collegeService.removeFavorite(collegeId);
        setFavorites((prev) => prev.filter((id) => id !== collegeId));
      } else {
        await collegeService.addFavorite(collegeId);
        setFavorites((prev) => [...prev, collegeId]);
      }
    } catch (error) {
      console.error('Failed to update favorite');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
        <h1 className="text-4xl font-bold mb-2">Browse Colleges</h1>
        <p className="text-blue-100">Explore top colleges across India tailored to your profile</p>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filter Section */}
        <div className="mb-8">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 btn-primary"
          >
            <Filter size={20} />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>

          {showFilters && (
            <div className="mt-6 glass-effect p-6 rounded-2xl grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Course</label>
                <select
                  name="course"
                  value={filters.course}
                  onChange={handleFilterChange}
                  className="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="">All Courses</option>
                  <option value="B.Tech CS">B.Tech CS</option>
                  <option value="B.Tech EC">B.Tech EC</option>
                  <option value="B.Tech ME">B.Tech ME</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">State</label>
                <select
                  name="state"
                  value={filters.state}
                  onChange={handleFilterChange}
                  className="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="">All States</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Delhi">Delhi</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Type</label>
                <select
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  className="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="government">Government</option>
                  <option value="private">Private</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Max Budget (₹)</label>
                <input
                  type="number"
                  name="budget"
                  value={filters.budget}
                  onChange={handleFilterChange}
                  placeholder="Enter budget"
                  className="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                onClick={handleApplyFilters}
                className="col-span-2 md:col-span-4 btn-primary w-full"
              >
                Apply Filters
              </button>
            </div>
          )}
        </div>

        {/* Colleges Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500 text-xl">Loading colleges...</p>
          </div>
        ) : colleges.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500 text-xl">No colleges found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {colleges.map((college) => (
              <CollegeCard
                key={college._id}
                college={college}
                onFavorite={handleFavorite}
                isFavorite={favorites.includes(college._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
