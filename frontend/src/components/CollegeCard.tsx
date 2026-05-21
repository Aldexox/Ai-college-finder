import React from 'react';
import { Heart, MapPin } from 'lucide-react';

interface CollegeCardProps {
  college: any;
  onFavorite?: (collegeId: string) => void;
  isFavorite?: boolean;
}

export const CollegeCard: React.FC<CollegeCardProps> = ({ college, onFavorite, isFavorite }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-blue-100 hover:border-blue-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
        <h3 className="text-xl font-bold">{college.name}</h3>
        <div className="flex items-center gap-2 mt-2 text-blue-100">
          <MapPin size={16} />
          <span>{college.city}, {college.state}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Type Badge */}
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            college.type === 'government' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {college.type.charAt(0).toUpperCase() + college.type.slice(1)}
          </span>
          <span className="text-sm font-semibold text-purple-600">Rank #{college.ranking}</span>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-xs text-gray-600">Average Package</p>
            <p className="text-lg font-bold text-blue-600">₹{(college.avgPackage / 100000).toFixed(2)}L</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-xs text-gray-600">Placement Rate</p>
            <p className="text-lg font-bold text-green-600">{college.placementRate}%</p>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <p className="text-xs text-gray-600">Annual Fees</p>
            <p className="text-lg font-bold text-purple-600">₹{(college.avgFees / 100000).toFixed(2)}L</p>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg">
            <p className="text-xs text-gray-600">Cutoff</p>
            <p className="text-lg font-bold text-yellow-600">{college.cutoff}%</p>
          </div>
        </div>

        {/* Courses */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">Courses:</p>
          <div className="flex flex-wrap gap-2">
            {college.courses.slice(0, 2).map((course: string) => (
              <span key={course} className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded-full">
                {course}
              </span>
            ))}
            {college.courses.length > 2 && (
              <span className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded-full">
                +{college.courses.length - 2} more
              </span>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>University:</strong> {college.affiliatedUniversity}</p>
          <p><strong>Established:</strong> {college.established}</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-4">
          <button
            onClick={() => window.open(college.website, '_blank')}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-semibold"
          >
            Visit Website
          </button>
          {onFavorite && (
            <button
              onClick={() => onFavorite(college._id)}
              className={`px-4 py-2 rounded-lg transition-all ${
                isFavorite
                  ? 'bg-red-100 text-red-600 hover:bg-red-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
