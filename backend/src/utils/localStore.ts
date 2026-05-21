import bcrypt from 'bcryptjs';

export interface LocalUser {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
}

export interface LocalStudentProfile {
  userId: string;
  course: string;
  entranceExam: string;
  entranceScore: number | null;
  class10Marks: number;
  class12Marks: number;
  hobbies: string[];
  goals: string[];
  dreams: string;
  budget: number;
  preferredCities: string[];
  preferredStates: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface LocalChatMessage {
  userId: string;
  message: string;
  response: string;
  timestamp: Date;
}

const users = new Map<string, LocalUser>();
const profiles = new Map<string, LocalStudentProfile>();
const chats = new Map<string, LocalChatMessage[]>();

const createId = () => `local_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

export const localStore = {
  async createUser(email: string, password: string, name: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = Array.from(users.values()).find((user) => user.email === normalizedEmail);

    if (existingUser) {
      return { user: null, error: 'Email already exists' };
    }

    const user: LocalUser = {
      id: createId(),
      email: normalizedEmail,
      name: name.trim(),
      passwordHash: await bcrypt.hash(password, 10),
    };

    users.set(user.id, user);
    return { user, error: null };
  },

  async findUserByEmail(email: string) {
    const normalizedEmail = email.trim().toLowerCase();
    return Array.from(users.values()).find((user) => user.email === normalizedEmail) || null;
  },

  getUserById(userId: string) {
    return users.get(userId) || null;
  },

  async verifyPassword(user: LocalUser, password: string) {
    return bcrypt.compare(password, user.passwordHash);
  },

  saveProfile(userId: string, profileData: Omit<LocalStudentProfile, 'userId' | 'createdAt' | 'updatedAt'>) {
    const existingProfile = profiles.get(userId);
    const now = new Date();
    const profile: LocalStudentProfile = {
      ...profileData,
      userId,
      createdAt: existingProfile?.createdAt || now,
      updatedAt: now,
    };

    profiles.set(userId, profile);
    return profile;
  },

  getProfile(userId: string) {
    return profiles.get(userId) || null;
  },

  addChatMessage(userId: string, message: string, response: string) {
    const chatMessage: LocalChatMessage = {
      userId,
      message,
      response,
      timestamp: new Date(),
    };
    const history = chats.get(userId) || [];
    history.push(chatMessage);
    chats.set(userId, history);
    return chatMessage;
  },

  getChatHistory(userId: string) {
    return (chats.get(userId) || []).slice().reverse().slice(0, 50);
  },
};
