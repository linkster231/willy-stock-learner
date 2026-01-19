/**
 * Content Types
 *
 * TypeScript types for learning modules, quizzes, and glossary.
 */

/**
 * A single lesson within a module
 */
export interface Lesson {
  id: string;
  titleKey: string; // Translation key
  contentKey: string; // Translation key for content
  videoUrl?: string; // Optional YouTube video
  duration: number; // Estimated minutes to complete
  keyPoints: string[]; // Translation keys for key takeaways
}

/**
 * A learning module containing multiple lessons
 */
export interface Module {
  id: string;
  titleKey: string;
  descriptionKey: string;
  icon: string; // Emoji
  lessons: Lesson[];
  prerequisites: string[]; // Module IDs that must be completed first
  estimatedHours: number;
}

/**
 * A quiz question
 */
export interface QuizQuestion {
  id: string;
  questionKey: string; // Translation key
  options: {
    id: string;
    labelKey: string; // Translation key
  }[];
  correctOptionId: string;
  explanationKey: string; // Translation key for explanation
}

/**
 * A quiz for a module
 */
export interface Quiz {
  moduleId: string;
  questions: QuizQuestion[];
  passingScore: number; // Percentage required to pass (0-100)
}

/**
 * A glossary term
 */
export interface GlossaryTerm {
  id: string;
  termKey: string; // Translation key
  definitionKey: string; // Translation key
  category: 'basics' | 'trading' | 'analysis' | 'psychology' | 'tax';
  relatedTerms?: string[]; // IDs of related terms
  example?: string; // Translation key for example usage
}

/**
 * User's progress on a module
 */
export interface ModuleProgress {
  moduleId: string;
  startedAt: Date;
  completedLessons: string[]; // Lesson IDs
  isCompleted: boolean;
  completedAt?: Date;
  quizScore?: number;
  quizPassed?: boolean;
}

/**
 * User's glossary word with spaced repetition data
 */
export interface UserGlossaryWord {
  termId: string;
  addedAt: Date;
  lastReviewed?: Date;
  reviewCount: number;
  confidenceLevel: 0 | 1 | 2 | 3 | 4 | 5; // 0 = new, 5 = mastered
  nextReviewAt?: Date;
  notes?: string;
}
