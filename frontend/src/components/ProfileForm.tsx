import React, { useState } from 'react';
import { BookOpen, ChevronDown, GraduationCap, MapPin, Target, Wallet } from 'lucide-react';
import { profileService } from '../services/api';

interface ProfileFormProps {
  onSuccess: () => void;
}

const COURSES = [
  'B.Tech Computer Science',
  'B.Tech Electronics',
  'B.Tech Mechanical',
  'B.Tech Civil',
  'B.Tech Electrical',
  'B.A Economics',
  'B.B.A',
  'B.Sc Physics',
];

const CITIES = [
  'Ahmedabad',
  'Bengaluru',
  'Chennai',
  'Delhi',
  'Hyderabad',
  'Kolkata',
  'Mumbai',
  'Pune',
  'Agra',
  'Ajmer',
  'Aligarh',
  'Amravati',
  'Amritsar',
  'Asansol',
  'Aurangabad',
  'Bareilly',
  'Belagavi',
  'Bhilai',
  'Bhopal',
  'Bhubaneswar',
  'Bikaner',
  'Chandigarh',
  'Coimbatore',
  'Cuttack',
  'Dehradun',
  'Dhanbad',
  'Durgapur',
  'Faridabad',
  'Ghaziabad',
  'Gorakhpur',
  'Greater Noida',
  'Guntur',
  'Guwahati',
  'Gwalior',
  'Hubballi',
  'Indore',
  'Jabalpur',
  'Jaipur',
  'Jalandhar',
  'Jammu',
  'Jamshedpur',
  'Jodhpur',
  'Kanpur',
  'Kochi',
  'Kolhapur',
  'Kota',
  'Kozhikode',
  'Lucknow',
  'Ludhiana',
  'Madurai',
  'Mangaluru',
  'Mangalore',
  'Manipal',
  'Meerut',
  'Mysuru',
  'Nagpur',
  'Nashik',
  'Noida',
  'Patna',
  'Pilani',
  'Prayagraj',
  'Raipur',
  'Rajkot',
  'Ranchi',
  'Roorkee',
  'Rourkela',
  'Salem',
  'Siliguri',
  'Solapur',
  'Surat',
  'Thiruvananthapuram',
  'Tiruchirappalli',
  'Udaipur',
  'Vadodara',
  'Varanasi',
  'Vellore',
  'Vijayawada',
  'Visakhapatnam',
  'Warangal',
];

const HOBBY_OPTIONS = ['Sports', 'Music', 'Art', 'Coding', 'Gaming', 'Reading', 'Debating', 'Volunteering'];
const GOAL_OPTIONS = ['High Package Job', 'Entrepreneurship', 'Further Studies', 'Research', 'Civil Services', 'Social Impact'];

const fieldClass =
  'w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-950 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100';

export const ProfileForm: React.FC<ProfileFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    course: '',
    entranceExam: '',
    entranceScore: '',
    class10Marks: '',
    class12Marks: '',
    hobbies: [] as string[],
    goals: [] as string[],
    dreams: '',
    budget: '',
    preferredCities: [] as string[],
    preferredStates: [] as string[],
  });
  const [cityMenuOpen, setCityMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'entranceExam' ? { entranceScore: '' } : {}),
    }));
  };

  const handleCheckboxChange = (field: 'hobbies' | 'goals' | 'preferredCities', value: string) => {
    setFormData((prev) => {
      const list = prev[field];
      return {
        ...prev,
        [field]: list.includes(value) ? list.filter((item) => item !== value) : [...list, value],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await profileService.saveProfile({
        ...formData,
        entranceScore: formData.entranceScore ? Number(formData.entranceScore) : null,
        class10Marks: Number(formData.class10Marks),
        class12Marks: Number(formData.class12Marks),
        budget: Number(formData.budget),
      });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const entranceScoreLabel = formData.entranceExam === 'NEET' ? 'NEET Marks' : 'JEE Percentile / Marks';
  const entranceMax = formData.entranceExam === 'NEET' ? 720 : 100;
  const selectedCitiesLabel =
    formData.preferredCities.length > 0 ? formData.preferredCities.join(', ') : 'Select preferred cities';

  return (
    <div className="mx-auto max-w-5xl rounded-lg border border-gray-200 bg-white shadow-xl">
      <div className="border-b border-gray-200 px-6 py-7 md:px-8">
        <p className="text-sm font-semibold uppercase text-blue-700">Student profile</p>
        <h2 className="mt-2 text-3xl font-bold text-gray-950">Build Your College Match</h2>
        <p className="mt-3 max-w-2xl text-gray-600">
          Academic record, entrance score, budget, and city preferences are used to rank colleges.
        </p>
      </div>

      {error && (
        <div className="mx-6 mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700 md:mx-8">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 px-6 py-7 md:px-8">
        <section>
          <div className="mb-4 flex items-center gap-2 text-gray-950">
            <BookOpen size={20} className="text-blue-700" />
            <h3 className="text-xl font-semibold">Course & Entrance</h3>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block font-semibold text-gray-700">Course of Interest *</label>
              <select name="course" value={formData.course} onChange={handleChange} className={fieldClass} required>
                <option value="">Select a course</option>
                {COURSES.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block font-semibold text-gray-700">Entrance Exam</label>
              <select name="entranceExam" value={formData.entranceExam} onChange={handleChange} className={fieldClass}>
                <option value="">Select exam</option>
                <option value="JEE">JEE</option>
                <option value="NEET">NEET</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block font-semibold text-gray-700">{entranceScoreLabel}</label>
              <input
                type="number"
                name="entranceScore"
                value={formData.entranceScore}
                onChange={handleChange}
                min="0"
                max={entranceMax}
                placeholder={formData.entranceExam === 'NEET' ? 'Out of 720' : 'Percentile preferred'}
                className={fieldClass}
              />
            </div>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center gap-2 text-gray-950">
            <GraduationCap size={20} className="text-emerald-700" />
            <h3 className="text-xl font-semibold">Academic Details</h3>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block font-semibold text-gray-700">Class 10 Marks (%) *</label>
              <input
                type="number"
                name="class10Marks"
                value={formData.class10Marks}
                onChange={handleChange}
                min="0"
                max="100"
                className={fieldClass}
                required
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold text-gray-700">Class 12 Marks (%) *</label>
              <input
                type="number"
                name="class12Marks"
                value={formData.class12Marks}
                onChange={handleChange}
                min="0"
                max="100"
                className={fieldClass}
                required
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold text-gray-700">Annual Budget (Rs) *</label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                min="0"
                placeholder="Example: 500000"
                className={fieldClass}
                required
              />
            </div>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center gap-2 text-gray-950">
            <MapPin size={20} className="text-amber-700" />
            <h3 className="text-xl font-semibold">Preferred Cities</h3>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setCityMenuOpen((open) => !open)}
              className={`${fieldClass} flex items-center justify-between text-left`}
            >
              <span className={`min-w-0 truncate ${formData.preferredCities.length > 0 ? 'text-gray-950' : 'text-gray-500'}`}>
                {selectedCitiesLabel}
              </span>
              <ChevronDown size={20} className="shrink-0 text-gray-700" />
            </button>

            {cityMenuOpen && (
              <div className="absolute z-20 mt-2 max-h-72 w-full overflow-y-auto rounded-lg border border-gray-300 bg-white py-2 shadow-xl">
                {CITIES.map((city) => (
                  <label key={city} className="flex cursor-pointer items-center px-4 py-2 text-gray-900 hover:bg-blue-50">
                    <input
                      type="checkbox"
                      checked={formData.preferredCities.includes(city)}
                      onChange={() => handleCheckboxChange('preferredCities', city)}
                      className="mr-3 h-4 w-4 accent-blue-600"
                    />
                    <span>{city}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center gap-2 text-gray-950">
            <Target size={20} className="text-violet-700" />
            <h3 className="text-xl font-semibold">Interests & Goals</h3>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-3 block font-semibold text-gray-700">Your Goals</label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {GOAL_OPTIONS.map((goal) => (
                  <label key={goal} className="flex items-center rounded-lg border border-gray-200 px-3 py-2">
                    <input
                      type="checkbox"
                      checked={formData.goals.includes(goal)}
                      onChange={() => handleCheckboxChange('goals', goal)}
                      className="mr-3 h-4 w-4 accent-blue-600"
                    />
                    <span className="text-gray-700">{goal}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-3 block font-semibold text-gray-700">Your Hobbies</label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {HOBBY_OPTIONS.map((hobby) => (
                  <label key={hobby} className="flex items-center rounded-lg border border-gray-200 px-3 py-2">
                    <input
                      type="checkbox"
                      checked={formData.hobbies.includes(hobby)}
                      onChange={() => handleCheckboxChange('hobbies', hobby)}
                      className="mr-3 h-4 w-4 accent-blue-600"
                    />
                    <span className="text-gray-700">{hobby}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section>
          <label className="mb-2 flex items-center gap-2 font-semibold text-gray-700">
            <Wallet size={18} className="text-gray-500" />
            Your Dreams & Aspirations
          </label>
          <textarea
            name="dreams"
            value={formData.dreams}
            onChange={handleChange}
            placeholder="Career plans, preferred campus life, long-term goals..."
            className={`${fieldClass} h-28 resize-none`}
          />
        </section>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gradient-to-r from-blue-700 to-violet-700 px-6 py-4 font-semibold text-white shadow-lg transition hover:shadow-xl disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Generate My College Results'}
        </button>
      </form>
    </div>
  );
};
