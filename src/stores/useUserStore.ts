/**
 * User Store
 *
 * Zustand store for managing user accounts with simple username + PIN authentication.
 * Persists to localStorage for offline-first experience.
 *
 * Features:
 * - Create accounts with username + 4-digit PIN
 * - Login/logout
 * - Multiple users on same device
 * - User-specific progress tracking
 */

'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// =============================================================================
// TYPES
// =============================================================================

/**
 * A user account
 */
export interface User {
  /** Unique user ID */
  id: string;
  /** Display username */
  username: string;
  /** Hashed PIN (simple hash for local storage) */
  pinHash: string;
  /** When the account was created */
  createdAt: number;
  /** Preferred language */
  preferredLanguage: 'en' | 'es';
}

/**
 * Learning progress for a user
 */
export interface UserProgress {
  /** User ID this progress belongs to */
  userId: string;
  /** Completed lesson IDs */
  completedLessons: string[];
  /** Completed module IDs (all lessons + quiz passed) */
  completedModules: string[];
  /** Quiz attempts per module */
  quizAttempts: Record<string, QuizAttemptRecord[]>;
  /** Final review best score */
  finalReviewBestScore: number | null;
  /** Final review passed */
  finalReviewPassed: boolean;
  /** Total time spent learning (seconds) */
  totalTimeSpent: number;
  /** Last activity timestamp */
  lastActivity: number;
}

/**
 * A quiz attempt record
 */
export interface QuizAttemptRecord {
  /** When the attempt was made */
  attemptedAt: number;
  /** Score (correct answers) */
  score: number;
  /** Total questions */
  totalQuestions: number;
  /** Percentage score */
  percentage: number;
  /** Whether the quiz was passed */
  passed: boolean;
}

/**
 * User store state
 */
export interface UserState {
  /** All registered users */
  users: Record<string, User>;
  /** Progress data for each user */
  progress: Record<string, UserProgress>;
  /** Currently logged in user ID (null if not logged in) */
  currentUserId: string | null;
}

/**
 * User store actions
 */
export interface UserActions {
  // Auth actions
  /** Create a new user account */
  createUser: (username: string, pin: string, language?: 'en' | 'es') => { success: boolean; error?: string; userId?: string };
  /** Login with username and PIN */
  login: (username: string, pin: string) => { success: boolean; error?: string };
  /** Logout current user */
  logout: () => void;
  /** Check if a username is taken */
  isUsernameTaken: (username: string) => boolean;
  /** Get current user */
  getCurrentUser: () => User | null;
  /** Delete a user account (requires PIN) */
  deleteUser: (userId: string, pin: string) => { success: boolean; error?: string };

  // Progress actions
  /** Mark a lesson as completed */
  completeLesson: (lessonId: string) => void;
  /** Check if a lesson is completed */
  isLessonCompleted: (lessonId: string) => boolean;
  /** Record a quiz attempt */
  recordQuizAttempt: (moduleId: string, score: number, totalQuestions: number) => void;
  /** Check if a module's quiz is passed */
  isQuizPassed: (moduleId: string) => boolean;
  /** Mark a module as completed */
  completeModule: (moduleId: string) => void;
  /** Check if a module is completed */
  isModuleCompleted: (moduleId: string) => boolean;
  /** Get progress for current user */
  getProgress: () => UserProgress | null;
  /** Get quiz attempts for a module */
  getQuizAttempts: (moduleId: string) => QuizAttemptRecord[];
  /** Record final review attempt */
  recordFinalReviewAttempt: (score: number, totalQuestions: number) => void;
  /** Add time spent */
  addTimeSpent: (seconds: number) => void;
  /** Reset progress for current user */
  resetProgress: () => void;
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Simple hash function for PIN (not cryptographically secure, but fine for local storage)
 * For production with sensitive data, use a proper hashing library
 */
function hashPin(pin: string, salt: string): string {
  const combined = pin + salt;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString(16);
}

/**
 * Generate a unique user ID
 */
function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create empty progress for a user
 */
function createEmptyProgress(userId: string): UserProgress {
  return {
    userId,
    completedLessons: [],
    completedModules: [],
    quizAttempts: {},
    finalReviewBestScore: null,
    finalReviewPassed: false,
    totalTimeSpent: 0,
    lastActivity: Date.now(),
  };
}

/**
 * Validate PIN format (4 digits)
 */
function isValidPin(pin: string): boolean {
  return /^\d{4}$/.test(pin);
}

/**
 * Validate username (3-20 chars, alphanumeric and underscores)
 */
function isValidUsername(username: string): boolean {
  return /^[a-zA-Z0-9_]{3,20}$/.test(username);
}

// =============================================================================
// STORE
// =============================================================================

export const useUserStore = create<UserState & UserActions>()(
  persist(
    (set, get) => ({
      // Initial state
      users: {},
      progress: {},
      currentUserId: null,

      // =======================================================================
      // AUTH ACTIONS
      // =======================================================================

      createUser: (username, pin, language = 'en') => {
        // Validate username
        if (!isValidUsername(username)) {
          return {
            success: false,
            error: 'Username must be 3-20 characters (letters, numbers, underscores)',
          };
        }

        // Validate PIN
        if (!isValidPin(pin)) {
          return {
            success: false,
            error: 'PIN must be exactly 4 digits',
          };
        }

        // Check if username is taken (case-insensitive)
        const normalizedUsername = username.toLowerCase();
        const { users } = get();
        const isTaken = Object.values(users).some(
          (u) => u.username.toLowerCase() === normalizedUsername
        );

        if (isTaken) {
          return {
            success: false,
            error: 'Username is already taken',
          };
        }

        // Create user
        const userId = generateUserId();
        const newUser: User = {
          id: userId,
          username,
          pinHash: hashPin(pin, userId),
          createdAt: Date.now(),
          preferredLanguage: language,
        };

        // Create empty progress
        const newProgress = createEmptyProgress(userId);

        set((state) => ({
          users: { ...state.users, [userId]: newUser },
          progress: { ...state.progress, [userId]: newProgress },
          currentUserId: userId, // Auto-login after creation
        }));

        return { success: true, userId };
      },

      login: (username, pin) => {
        const { users } = get();

        // Find user by username (case-insensitive)
        const normalizedUsername = username.toLowerCase();
        const user = Object.values(users).find(
          (u) => u.username.toLowerCase() === normalizedUsername
        );

        if (!user) {
          return { success: false, error: 'User not found' };
        }

        // Verify PIN
        const inputHash = hashPin(pin, user.id);
        if (inputHash !== user.pinHash) {
          return { success: false, error: 'Incorrect PIN' };
        }

        // Login successful
        set({ currentUserId: user.id });
        return { success: true };
      },

      logout: () => {
        set({ currentUserId: null });
      },

      isUsernameTaken: (username) => {
        const { users } = get();
        const normalizedUsername = username.toLowerCase();
        return Object.values(users).some(
          (u) => u.username.toLowerCase() === normalizedUsername
        );
      },

      getCurrentUser: () => {
        const { users, currentUserId } = get();
        if (!currentUserId) return null;
        return users[currentUserId] || null;
      },

      deleteUser: (userId, pin) => {
        const { users, progress, currentUserId } = get();
        const user = users[userId];

        if (!user) {
          return { success: false, error: 'User not found' };
        }

        // Verify PIN
        const inputHash = hashPin(pin, user.id);
        if (inputHash !== user.pinHash) {
          return { success: false, error: 'Incorrect PIN' };
        }

        // Remove user and their progress
        const { [userId]: _removedUser, ...remainingUsers } = users;
        const { [userId]: _removedProgress, ...remainingProgress } = progress;

        set({
          users: remainingUsers,
          progress: remainingProgress,
          currentUserId: currentUserId === userId ? null : currentUserId,
        });

        return { success: true };
      },

      // =======================================================================
      // PROGRESS ACTIONS
      // =======================================================================

      completeLesson: (lessonId) => {
        const { currentUserId, progress } = get();
        if (!currentUserId) return;

        const userProgress = progress[currentUserId];
        if (!userProgress) return;

        // Don't add duplicates
        if (userProgress.completedLessons.includes(lessonId)) return;

        set((state) => ({
          progress: {
            ...state.progress,
            [currentUserId]: {
              ...userProgress,
              completedLessons: [...userProgress.completedLessons, lessonId],
              lastActivity: Date.now(),
            },
          },
        }));
      },

      isLessonCompleted: (lessonId) => {
        const { currentUserId, progress } = get();
        if (!currentUserId) return false;

        const userProgress = progress[currentUserId];
        if (!userProgress) return false;

        return userProgress.completedLessons.includes(lessonId);
      },

      recordQuizAttempt: (moduleId, score, totalQuestions) => {
        const { currentUserId, progress } = get();
        if (!currentUserId) return;

        const userProgress = progress[currentUserId];
        if (!userProgress) return;

        const percentage = Math.round((score / totalQuestions) * 100);
        const passed = percentage >= 80;

        const attempt: QuizAttemptRecord = {
          attemptedAt: Date.now(),
          score,
          totalQuestions,
          percentage,
          passed,
        };

        const existingAttempts = userProgress.quizAttempts[moduleId] || [];

        set((state) => ({
          progress: {
            ...state.progress,
            [currentUserId]: {
              ...userProgress,
              quizAttempts: {
                ...userProgress.quizAttempts,
                [moduleId]: [...existingAttempts, attempt],
              },
              lastActivity: Date.now(),
            },
          },
        }));
      },

      isQuizPassed: (moduleId) => {
        const { currentUserId, progress } = get();
        if (!currentUserId) return false;

        const userProgress = progress[currentUserId];
        if (!userProgress) return false;

        const attempts = userProgress.quizAttempts[moduleId] || [];
        return attempts.some((a) => a.passed);
      },

      completeModule: (moduleId) => {
        const { currentUserId, progress } = get();
        if (!currentUserId) return;

        const userProgress = progress[currentUserId];
        if (!userProgress) return;

        // Don't add duplicates
        if (userProgress.completedModules.includes(moduleId)) return;

        set((state) => ({
          progress: {
            ...state.progress,
            [currentUserId]: {
              ...userProgress,
              completedModules: [...userProgress.completedModules, moduleId],
              lastActivity: Date.now(),
            },
          },
        }));
      },

      isModuleCompleted: (moduleId) => {
        const { currentUserId, progress } = get();
        if (!currentUserId) return false;

        const userProgress = progress[currentUserId];
        if (!userProgress) return false;

        return userProgress.completedModules.includes(moduleId);
      },

      getProgress: () => {
        const { currentUserId, progress } = get();
        if (!currentUserId) return null;

        return progress[currentUserId] || null;
      },

      getQuizAttempts: (moduleId) => {
        const { currentUserId, progress } = get();
        if (!currentUserId) return [];

        const userProgress = progress[currentUserId];
        if (!userProgress) return [];

        return userProgress.quizAttempts[moduleId] || [];
      },

      recordFinalReviewAttempt: (score, totalQuestions) => {
        const { currentUserId, progress } = get();
        if (!currentUserId) return;

        const userProgress = progress[currentUserId];
        if (!userProgress) return;

        const percentage = Math.round((score / totalQuestions) * 100);
        const passed = percentage >= 80;

        // Update best score if this is better
        const currentBest = userProgress.finalReviewBestScore || 0;
        const newBest = Math.max(currentBest, percentage);

        set((state) => ({
          progress: {
            ...state.progress,
            [currentUserId]: {
              ...userProgress,
              finalReviewBestScore: newBest,
              finalReviewPassed: userProgress.finalReviewPassed || passed,
              lastActivity: Date.now(),
            },
          },
        }));
      },

      addTimeSpent: (seconds) => {
        const { currentUserId, progress } = get();
        if (!currentUserId) return;

        const userProgress = progress[currentUserId];
        if (!userProgress) return;

        set((state) => ({
          progress: {
            ...state.progress,
            [currentUserId]: {
              ...userProgress,
              totalTimeSpent: userProgress.totalTimeSpent + seconds,
              lastActivity: Date.now(),
            },
          },
        }));
      },

      resetProgress: () => {
        const { currentUserId } = get();
        if (!currentUserId) return;

        set((state) => ({
          progress: {
            ...state.progress,
            [currentUserId]: createEmptyProgress(currentUserId),
          },
        }));
      },
    }),
    {
      name: 'willy-user-store',
      storage: createJSONStorage(() => {
        // SSR-safe storage
        if (typeof window !== 'undefined') {
          return localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
    }
  )
);

export default useUserStore;
