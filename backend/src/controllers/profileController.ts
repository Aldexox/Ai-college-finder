import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import StudentProfile from '../models/StudentProfile';
import { localStore } from '../utils/localStore';

const isMongoConnected = () => StudentProfile.db.readyState === 1;

export const saveProfile = async (req: AuthRequest, res: Response) => {
  try {
    const {
      course,
      entranceExam = '',
      entranceScore = null,
      class10Marks,
      class12Marks,
      hobbies,
      goals,
      dreams,
      budget,
      preferredCities = [],
      preferredStates = [],
    } = req.body;

    if (!req.userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!isMongoConnected()) {
      const profile = localStore.saveProfile(req.userId, {
        course,
        entranceExam,
        entranceScore,
        class10Marks,
        class12Marks,
        hobbies,
        goals,
        dreams,
        budget,
        preferredCities,
        preferredStates,
      });

      return res.json(profile);
    }

    let profile = await StudentProfile.findOne({ userId: req.userId });

    if (profile) {
      profile.course = course;
      profile.entranceExam = entranceExam;
      profile.entranceScore = entranceScore;
      profile.class10Marks = class10Marks;
      profile.class12Marks = class12Marks;
      profile.hobbies = hobbies;
      profile.goals = goals;
      profile.dreams = dreams;
      profile.budget = budget;
      profile.preferredCities = preferredCities;
      profile.preferredStates = preferredStates;
    } else {
      profile = new StudentProfile({
        userId: req.userId,
        course,
        entranceExam,
        entranceScore,
        class10Marks,
        class12Marks,
        hobbies,
        goals,
        dreams,
        budget,
        preferredCities,
        preferredStates,
      });
    }

    await profile.save();
    res.json(profile);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!isMongoConnected()) {
      const profile = localStore.getProfile(req.userId);
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }

      return res.json(profile);
    }

    const profile = await StudentProfile.findOne({ userId: req.userId });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(profile);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
