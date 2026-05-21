import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import ChatMessage from '../models/ChatMessage';
import StudentProfile from '../models/StudentProfile';
import { TOP_COLLEGES } from '../data/colleges';
import { askGrokAI } from '../utils/grokAI';
import { localStore } from '../utils/localStore';

const isMongoConnected = () => ChatMessage.db.readyState === 1;

const buildCollegeDigest = () =>
  TOP_COLLEGES.map(
    (c) =>
      `#${c.ranking} ${c.name} | ${c.city}, ${c.state} | ${c.type} | fees ₹${c.avgFees} | avgPkg ₹${c.avgPackage} | placement ${c.placementRate}% | cutoff ${c.cutoff}% | site ${c.website}`
  ).join('\n');

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!req.userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const profile = isMongoConnected()
      ? await StudentProfile.findOne({ userId: req.userId })
      : localStore.getProfile(req.userId);

    const baseInstructions = `You are CollegeGuide AI: an expert mentor for higher education in India and general academic/career topics.
You can answer any question the student asks—college admissions, JEE/entrance exams, branches, placements, scholarships, study skills, or broader factual topics.
When discussing Indian colleges, fees, cutoffs, or rankings, ground your reasoning in the APP_DATASET below (approximate demo figures for this product—not official admission data). Clearly say official cutoffs and fees change every year and the student must verify on college websites.
Be concise, accurate, and encouraging. If a question is unrelated to education, answer helpfully in a few sentences without pretending the dataset covers it.

APP_DATASET (100 colleges, illustrative):
${buildCollegeDigest()}`;

    const systemPrompt = profile
      ? `${baseInstructions}

Student profile (use for personalization):
- Course: ${profile.course}
- Entrance Exam: ${(profile as any).entranceExam || 'Not added'}
- Entrance Score: ${(profile as any).entranceScore ?? 'Not added'}
- Class 10 Marks: ${profile.class10Marks}%
- Class 12 Marks: ${profile.class12Marks}%
- Hobbies: ${profile.hobbies.join(', ')}
- Goals: ${profile.goals.join(', ')}
- Dreams: ${profile.dreams}
- Budget: ₹${profile.budget}
- Preferred Cities: ${(profile.preferredCities || []).join(', ')}
- Preferred States: ${profile.preferredStates.join(', ')}

When suggesting colleges, treat Preferred Cities as high-priority location choices. If suitable colleges are available in those cities, recommend those before colleges elsewhere.
Tailor college suggestions and advice to this profile when relevant.`
      : baseInstructions;

    const response = await askGrokAI(message, systemPrompt);

    if (!isMongoConnected()) {
      localStore.addChatMessage(req.userId, message, response);
      return res.json({ message, response });
    }

    const chatMessage = new ChatMessage({
      userId: req.userId,
      message,
      response,
    });

    await chatMessage.save();
    res.json({ message, response });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const getChatHistory = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!isMongoConnected()) {
      return res.json(localStore.getChatHistory(req.userId));
    }

    const messages = await ChatMessage.find({ userId: req.userId }).sort({ timestamp: -1 }).limit(50);
    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
