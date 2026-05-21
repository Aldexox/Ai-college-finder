import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';
import { generateToken } from '../utils/jwt';
import { localStore } from '../utils/localStore';

const isMongoConnected = () => User.db.readyState === 1;

export const signup = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!isMongoConnected()) {
      const { user, error } = await localStore.createUser(email, password, name);
      if (!user) {
        return res.status(400).json({ error });
      }

      const token = generateToken(user.id);
      return res.status(201).json({
        token,
        user: { id: user.id, name: user.name, email: user.email },
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const user = new User({ email: email.toLowerCase(), password, name });
    await user.save();

    const token = generateToken(user._id.toString());
    res.status(201).json({
      token,
      user: { id: user._id.toString(), name: user.name, email: user.email },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    if (!isMongoConnected()) {
      const user = await localStore.findUserByEmail(email);
      if (!user || !(await localStore.verifyPassword(user, password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = generateToken(user.id);
      return res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user._id.toString());
    res.json({ token, user: { id: user._id.toString(), name: user.name, email: user.email } });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!isMongoConnected()) {
      const user = req.userId ? localStore.getUserById(req.userId) : null;
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.json({ id: user.id, name: user.name, email: user.email });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ id: user._id.toString(), name: user.name, email: user.email });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
