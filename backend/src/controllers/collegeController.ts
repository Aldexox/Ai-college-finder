import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import College from '../models/College';
import FavoriteCollege from '../models/FavoriteCollege';
import StudentProfile from '../models/StudentProfile';
import { TOP_COLLEGES } from '../data/colleges';
import { localStore } from '../utils/localStore';

type DatasetCollege = (typeof TOP_COLLEGES)[number];

const isMongoConnected = () => College.db.readyState === 1;

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');

const slugify = (value: string) =>
  normalize(value)
    .replace(/\s+/g, '-')
    .slice(0, 72);

const withClientId = (college: DatasetCollege) => ({
  _id: slugify(college.name),
  ...college,
});

const courseToDatasetName = (course?: string) => {
  const value = normalize(course || '');
  if (!value) return '';
  if (value.includes('computer') || value.includes('cs') || value.includes('cse')) return 'B.Tech CS';
  if (value.includes('electronics') || value.includes('ec') || value.includes('ece')) return 'B.Tech EC';
  if (value.includes('mechanical')) return 'B.Tech ME';
  if (value.includes('civil')) return 'B.Tech CE';
  if (value.includes('electrical')) return 'B.Tech Electrical';
  return course || '';
};

const supportsCourse = (college: DatasetCollege, course?: string) => {
  const mappedCourse = courseToDatasetName(course);
  if (!mappedCourse) return true;
  return college.courses.some((collegeCourse) => normalize(collegeCourse) === normalize(mappedCourse));
};

const toArray = (value: unknown): string[] => (Array.isArray(value) ? value.filter((item) => typeof item === 'string') : []);

const numberOrNull = (value: unknown) => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
};

const normalizeEntranceScore = (profile: any) => {
  const exam = normalize(profile?.entranceExam || '');
  const score = numberOrNull(profile?.entranceScore);
  if (score == null) return null;

  if (exam.includes('neet')) {
    return Math.min(100, Math.max(0, (score / 720) * 100));
  }

  if (score > 100) {
    return Math.min(100, Math.max(0, score / 3));
  }

  return Math.min(100, Math.max(0, score));
};

const getEntranceLabel = (profile: any) => {
  const exam = profile?.entranceExam || '';
  const score = numberOrNull(profile?.entranceScore);
  if (!exam || score == null) return 'Not added';
  return `${exam}: ${score}`;
};

const scoreCollege = (college: DatasetCollege, profile: any) => {
  const reasons: string[] = [];
  const preferredCities = toArray(profile?.preferredCities);
  const preferredStates = toArray(profile?.preferredStates);
  const goals = toArray(profile?.goals);
  const class12Marks = numberOrNull(profile?.class12Marks);
  const budget = numberOrNull(profile?.budget);
  const entranceIndex = normalizeEntranceScore(profile);

  let score = 32;

  if (supportsCourse(college, profile?.course)) {
    score += 18;
    reasons.push('Selected course available');
  } else if (profile?.course) {
    score -= 16;
  }

  if (preferredCities.length > 0) {
    const cityMatch = preferredCities.some((city) => normalize(city) === normalize(college.city));
    if (cityMatch) {
      score += 30;
      reasons.push('Matches preferred city');
    } else {
      score -= 6;
    }
  } else if (preferredStates.length > 0) {
    const stateMatch = preferredStates.some((state) => normalize(state) === normalize(college.state));
    if (stateMatch) {
      score += 14;
      reasons.push('Matches preferred state');
    }
  }

  if (budget && budget > 0) {
    if (college.avgFees <= budget) {
      score += 16;
      reasons.push('Within budget');
    } else if (college.avgFees <= budget * 1.25) {
      score += 4;
      reasons.push('Slightly above budget');
    } else {
      score -= Math.min(24, ((college.avgFees - budget) / budget) * 18);
    }
  }

  if (class12Marks != null) {
    const cutoffGap = class12Marks - college.cutoff;
    if (cutoffGap >= 6) {
      score += 16;
      reasons.push('Comfortable cutoff margin');
    } else if (cutoffGap >= 0) {
      score += 10;
      reasons.push('Cutoff is in range');
    } else if (cutoffGap >= -6) {
      score += 2;
      reasons.push('Reach option based on cutoff');
    } else {
      score -= Math.min(22, Math.abs(cutoffGap) * 1.7);
    }
  }

  if (entranceIndex != null) {
    const entranceGap = entranceIndex - college.cutoff;
    if (entranceGap >= 7) {
      score += 15;
      reasons.push('Entrance score strengthens admission chance');
    } else if (entranceGap >= 0) {
      score += 9;
      reasons.push('Entrance score aligns with cutoff');
    } else if (entranceGap >= -8) {
      score += 1;
      reasons.push('Entrance score makes this a reach');
    } else {
      score -= Math.min(18, Math.abs(entranceGap) * 1.2);
    }
  }

  if (goals.some((goal) => normalize(goal).includes('package') || normalize(goal).includes('job'))) {
    score += Math.min(13, college.avgPackage / 120000);
    if (college.placementRate >= 94) reasons.push('Strong placement outcomes');
  }

  if (goals.some((goal) => normalize(goal).includes('research'))) {
    score += college.type === 'government' ? 7 : 2;
  }

  score += Math.max(0, 12 - college.ranking * 0.18);
  score += Math.min(8, college.placementRate / 14);

  const academicIndex = Math.max(class12Marks ?? 0, entranceIndex ?? 0);
  const fitLabel =
    academicIndex > 0 && academicIndex < college.cutoff - 5
      ? 'Reach'
      : score >= 82
        ? 'Strong Match'
        : score >= 68
          ? 'Target'
          : 'Backup';

  return {
    ...withClientId(college),
    matchScore: Math.max(0, Math.min(100, Math.round(score))),
    fitLabel,
    reasons: reasons.slice(0, 4),
  };
};

const filterStaticColleges = (query: any) => {
  const course = typeof query.course === 'string' ? query.course : '';
  const state = typeof query.state === 'string' ? query.state : '';
  const type = typeof query.type === 'string' ? query.type : '';
  const budget = numberOrNull(query.budget);

  return TOP_COLLEGES.filter((college) => {
    if (course && !supportsCourse(college, course)) return false;
    if (state && college.state !== state) return false;
    if (type && college.type !== type) return false;
    if (budget && college.avgFees > budget) return false;
    return true;
  }).map(withClientId);
};

export const getColleges = async (req: AuthRequest, res: Response) => {
  try {
    const { course, state, type, budget } = req.query;
    const filter: any = {};

    if (!isMongoConnected()) {
      return res.json(filterStaticColleges(req.query).slice(0, 100));
    }

    if (course) filter.courses = { $in: [course] };
    if (state) filter.state = state;
    if (type) filter.type = type;
    if (budget) filter.avgFees = { $lte: budget };

    const colleges = await College.find(filter).sort({ ranking: 1 }).limit(100);
    res.json(colleges);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getRecommendations = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const profile = isMongoConnected()
      ? await StudentProfile.findOne({ userId: req.userId }).lean()
      : localStore.getProfile(req.userId);

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const budget = numberOrNull((profile as any).budget);
    const preferredCities = toArray((profile as any).preferredCities);
    const isPreferredCity = (college: { city: string }) =>
      preferredCities.some((city) => normalize(city) === normalize(college.city));
    const recommendations = TOP_COLLEGES.map((college) => scoreCollege(college, profile))
      .sort((a, b) => {
        if (preferredCities.length > 0) {
          const cityPriority = Number(isPreferredCity(b)) - Number(isPreferredCity(a));
          if (cityPriority !== 0) return cityPriority;
        }
        return b.matchScore - a.matchScore || a.ranking - b.ranking;
      })
      .slice(0, 18);

    const class12Marks = numberOrNull((profile as any).class12Marks);
    const entranceIndex = normalizeEntranceScore(profile);
    const academicIndex = Math.max(class12Marks ?? 0, entranceIndex ?? 0);

    res.json({
      profile: {
        course: (profile as any).course,
        entranceExam: (profile as any).entranceExam || '',
        entranceScore: (profile as any).entranceScore ?? null,
        class12Marks: (profile as any).class12Marks,
        budget: (profile as any).budget,
        preferredCities,
        goals: toArray((profile as any).goals),
      },
      summary: {
        topMatch: recommendations[0]?.name || '',
        entranceLabel: getEntranceLabel(profile),
        budgetMatches: budget ? recommendations.filter((college) => college.avgFees <= budget).length : 0,
        cityMatches:
          preferredCities.length > 0
            ? recommendations.filter((college) => preferredCities.some((city) => normalize(city) === normalize(college.city))).length
            : 0,
        likelyMatches: academicIndex
          ? recommendations.filter((college) => college.cutoff <= academicIndex).length
          : 0,
      },
      recommendations,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getCollegeDetails = async (req: AuthRequest, res: Response) => {
  try {
    if (!isMongoConnected()) {
      const college = TOP_COLLEGES.map(withClientId).find((item) => item._id === req.params.id);
      if (!college) {
        return res.status(404).json({ error: 'College not found' });
      }
      return res.json(college);
    }

    const college = await College.findById(req.params.id);
    if (!college) {
      return res.status(404).json({ error: 'College not found' });
    }
    res.json(college);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const addFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const { collegeId } = req.body;

    if (!isMongoConnected()) {
      return res.status(201).json({ userId: req.userId, collegeId });
    }

    const existing = await FavoriteCollege.findOne({ userId: req.userId, collegeId });
    if (existing) {
      return res.status(400).json({ error: 'Already in favorites' });
    }

    const favorite = new FavoriteCollege({ userId: req.userId, collegeId });
    await favorite.save();
    res.status(201).json(favorite);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const removeFavorite = async (req: AuthRequest, res: Response) => {
  try {
    if (!isMongoConnected()) {
      return res.json({ message: 'Removed from favorites' });
    }

    await FavoriteCollege.deleteOne({ userId: req.userId, collegeId: req.params.collegeId });
    res.json({ message: 'Removed from favorites' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getFavorites = async (req: AuthRequest, res: Response) => {
  try {
    if (!isMongoConnected()) {
      return res.json([]);
    }

    const favorites = await FavoriteCollege.find({ userId: req.userId }).populate('collegeId');
    res.json(favorites);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
