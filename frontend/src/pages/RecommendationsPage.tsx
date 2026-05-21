import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Award,
  BarChart3,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  MapPin,
  Pencil,
  ShieldCheck,
  Target,
  Wallet,
} from 'lucide-react';
import { FloatingChatAssistant } from '../components/FloatingChatAssistant';
import { collegeService } from '../services/api';

interface Recommendation {
  _id: string;
  name: string;
  type: 'government' | 'private';
  state: string;
  city: string;
  courses: string[];
  avgFees: number;
  placementRate: number;
  avgPackage: number;
  ranking: number;
  established: number;
  affiliatedUniversity: string;
  website: string;
  cutoff: number;
  matchScore: number;
  fitLabel: string;
  reasons: string[];
}

interface RecommendationProfile {
  course: string;
  entranceExam: string;
  entranceScore: number | null;
  class12Marks: number;
  budget: number;
  preferredCities: string[];
  goals: string[];
}

interface RecommendationSummary {
  topMatch: string;
  entranceLabel: string;
  budgetMatches: number;
  cityMatches: number;
  likelyMatches: number;
}

const formatMoney = (amount: number) => `Rs ${(amount / 100000).toFixed(amount >= 1000000 ? 1 : 2)}L`;

const getWebsiteUrl = (website: string) => {
  if (website.startsWith('http://') || website.startsWith('https://')) return website;
  return `https://${website}`;
};

const fitTone = (fitLabel: string) => {
  if (fitLabel === 'Strong Match') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (fitLabel === 'Target') return 'bg-blue-50 text-blue-700 border-blue-200';
  if (fitLabel === 'Reach') return 'bg-amber-50 text-amber-700 border-amber-200';
  return 'bg-gray-100 text-gray-700 border-gray-200';
};

const metricItems = (summary: RecommendationSummary, profile: RecommendationProfile | null) => [
  {
    label: 'Top Match',
    value: summary.topMatch || 'Calculating',
    icon: Award,
  },
  {
    label: 'Within Budget',
    value: `${summary.budgetMatches} colleges`,
    icon: Wallet,
  },
  {
    label: 'City Matches',
    value: profile?.preferredCities?.length ? `${summary.cityMatches} colleges` : 'All India',
    icon: MapPin,
  },
  {
    label: 'Likely by Marks',
    value: `${summary.likelyMatches} colleges`,
    icon: ShieldCheck,
  },
];

export const RecommendationsPage: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [profile, setProfile] = useState<RecommendationProfile | null>(null);
  const [summary, setSummary] = useState<RecommendationSummary>({
    topMatch: '',
    entranceLabel: 'Not added',
    budgetMatches: 0,
    cityMatches: 0,
    likelyMatches: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadRecommendations = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await collegeService.getRecommendations();
        setProfile(response.data.profile);
        setSummary(response.data.summary);
        setRecommendations(response.data.recommendations);
      } catch {
        setError('Unable to load college results. Please update your profile and try again.');
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-950">
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:px-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-blue-700">Profile results</p>
            <h1 className="mt-2 text-4xl font-bold">Your College Matches</h1>
            <p className="mt-3 max-w-3xl text-gray-600">
              Ranked using your course, JEE/NEET score, Class 12 marks, budget, preferred cities, cutoff, fees, and placements.
            </p>
          </div>
          <Link
            to="/profile"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-900 transition hover:border-blue-600 hover:text-blue-700"
          >
            <Pencil size={18} />
            Update Profile
          </Link>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        {loading ? (
          <div className="flex h-80 items-center justify-center rounded-lg border border-gray-200 bg-white">
            <p className="text-lg font-semibold text-gray-600">Calculating your best matches...</p>
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>
        ) : (
          <>
            <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {metricItems(summary, profile).map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                      <Icon size={22} />
                    </div>
                    <p className="text-sm font-semibold uppercase text-gray-500">{item.label}</p>
                    <p className="mt-2 line-clamp-2 text-xl font-bold text-gray-950">{item.value}</p>
                  </div>
                );
              })}
            </section>

            <section className="mb-8 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                <div>
                  <p className="text-sm font-semibold text-gray-500">Course</p>
                  <p className="mt-1 font-bold">{profile?.course || 'Not added'}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">Entrance</p>
                  <p className="mt-1 font-bold">{summary.entranceLabel}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">Class 12</p>
                  <p className="mt-1 font-bold">{profile?.class12Marks ?? '-'}%</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">Budget</p>
                  <p className="mt-1 font-bold">{profile?.budget ? formatMoney(profile.budget) : 'Not added'}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">Cities</p>
                  <p className="mt-1 truncate font-bold">{profile?.preferredCities?.join(', ') || 'All India'}</p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Best Colleges For You</h2>
                  <p className="text-gray-600">Cutoff, placements, fees, package, and match quality in one view.</p>
                </div>
                <p className="text-sm font-semibold text-gray-500">{recommendations.length} ranked results</p>
              </div>

              {recommendations.map((college, index) => (
                <article key={college._id} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md">
                  <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
                    <div>
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span className="rounded-lg bg-gray-950 px-3 py-1 text-sm font-bold text-white">#{index + 1}</span>
                        <span className={`rounded-lg border px-3 py-1 text-sm font-bold ${fitTone(college.fitLabel)}`}>
                          {college.fitLabel}
                        </span>
                        <span className="rounded-lg bg-gray-100 px-3 py-1 text-sm font-semibold capitalize text-gray-700">
                          {college.type}
                        </span>
                        <span className="rounded-lg bg-violet-50 px-3 py-1 text-sm font-semibold text-violet-700">
                          Rank #{college.ranking}
                        </span>
                      </div>

                      <h3 className="text-2xl font-bold text-gray-950">{college.name}</h3>
                      <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={16} />
                          {college.city}, {college.state}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <GraduationCap size={16} />
                          {college.courses.slice(0, 3).join(', ')}
                        </span>
                      </div>

                      <div className="mt-5">
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span className="font-semibold text-gray-600">Match score</span>
                          <span className="font-bold text-blue-700">{college.matchScore}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-100">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-emerald-500"
                            style={{ width: `${college.matchScore}%` }}
                          />
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {college.reasons.length > 0 ? (
                          college.reasons.map((reason) => (
                            <span key={reason} className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                              <CheckCircle2 size={15} />
                              {reason}
                            </span>
                          ))
                        ) : (
                          <span className="rounded-lg bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700">
                            General ranking match
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                          <p className="flex items-center gap-1 text-sm font-semibold text-gray-500">
                            <Target size={15} />
                            Cutoff
                          </p>
                          <p className="mt-2 text-2xl font-bold text-gray-950">{college.cutoff}%</p>
                        </div>
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                          <p className="flex items-center gap-1 text-sm font-semibold text-gray-500">
                            <BarChart3 size={15} />
                            Placement
                          </p>
                          <p className="mt-2 text-2xl font-bold text-gray-950">{college.placementRate}%</p>
                        </div>
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                          <p className="flex items-center gap-1 text-sm font-semibold text-gray-500">
                            <Wallet size={15} />
                            Fees
                          </p>
                          <p className="mt-2 text-2xl font-bold text-gray-950">{formatMoney(college.avgFees)}</p>
                        </div>
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                          <p className="flex items-center gap-1 text-sm font-semibold text-gray-500">
                            <ArrowUpRight size={15} />
                            Avg Package
                          </p>
                          <p className="mt-2 text-2xl font-bold text-gray-950">{formatMoney(college.avgPackage)}</p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                        <button
                          type="button"
                          onClick={() => window.open(getWebsiteUrl(college.website), '_blank')}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-3 font-semibold text-white transition hover:bg-blue-800"
                        >
                          Visit Website
                          <ExternalLink size={17} />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          </>
        )}
      </main>

      <FloatingChatAssistant />
    </div>
  );
};
