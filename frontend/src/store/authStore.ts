import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
}

interface StudentProfile {
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
}

interface AuthStore {
  user: User | null;
  token: string | null;
  profile: StudentProfile | null;
  isLoggedIn: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setProfile: (profile: StudentProfile) => void;
}

const TOKEN_KEY = 'token';
const USER_KEY = 'user';
const REMEMBER_EMAIL_KEY = 'collegeguide_remember_email';
const REMEMBER_FLAG_KEY = 'collegeguide_remember_me';

function normalizeUser(raw: unknown): User | null {
  if (!raw || typeof raw !== 'object') return null;
  const u = raw as Record<string, unknown>;
  const id = u.id != null ? String(u.id) : '';
  const name = typeof u.name === 'string' ? u.name : '';
  const email = typeof u.email === 'string' ? u.email : '';
  if (!id || !email) return null;
  return { id, name, email };
}

function readPersistedAuth(): { token: string | null; user: User | null } {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const rawUser = localStorage.getItem(USER_KEY);
    if (!token || !rawUser) return { token: null, user: null };
    const parsed = JSON.parse(rawUser) as unknown;
    const user = normalizeUser(parsed);
    if (!user) return { token: null, user: null };
    return { token, user };
  } catch {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch {
      /* ignore */
    }
    return { token: null, user: null };
  }
}

export const useAuthStore = create<AuthStore>((set) => {
  const { token: storedToken, user: storedUser } = readPersistedAuth();

  return {
    user: storedUser,
    token: storedToken,
    profile: null,
    isLoggedIn: !!storedToken && !!storedUser,
    login: (user: User, token: string) => {
      const safe = normalizeUser(user) ?? user;
      try {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(safe));
      } catch {
        /* quota / private mode — still keep session in memory */
      }
      set({ user: safe, token, isLoggedIn: true });
    },
    logout: () => {
      try {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(REMEMBER_EMAIL_KEY);
        localStorage.removeItem(REMEMBER_FLAG_KEY);
      } catch {
        /* ignore */
      }
      set({ user: null, token: null, isLoggedIn: false, profile: null });
    },
    setProfile: (profile: StudentProfile) => {
      set({ profile });
    },
  };
});
