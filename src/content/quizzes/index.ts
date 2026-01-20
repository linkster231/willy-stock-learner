import { Quiz, QuizQuestion } from '@/types/content';
import { module1Quiz } from './module-1-quiz';
import { module2Quiz } from './module-2-quiz';
import { module3Quiz } from './module-3-quiz';
import { module4Quiz } from './module-4-quiz';
import { module5Quiz } from './module-5-quiz';
import { module6Quiz } from './module-6-quiz';
import { module7Quiz } from './module-7-quiz';
import { module8Quiz } from './module-8-quiz';
import { module9Quiz } from './module-9-quiz';

// =============================================================================
// RANDOMIZATION UTILITIES
// =============================================================================

/**
 * Fisher-Yates shuffle algorithm for randomizing arrays
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Randomize a question's answer options while tracking the correct answer
 */
function randomizeQuestionOptions(question: QuizQuestion): QuizQuestion {
  const shuffledOptions = shuffleArray(question.options);
  return {
    ...question,
    options: shuffledOptions,
  };
}

/**
 * Randomize all questions in a quiz (both order and answer options)
 */
export function getRandomizedQuiz(quiz: Quiz): Quiz {
  const shuffledQuestions = shuffleArray(quiz.questions).map(randomizeQuestionOptions);
  return {
    ...quiz,
    questions: shuffledQuestions,
  };
}

/**
 * Get a randomized quiz by module ID
 */
export function getRandomizedQuizByModuleId(moduleId: string): Quiz | undefined {
  const quiz = quizzes[moduleId];
  if (!quiz) return undefined;
  return getRandomizedQuiz(quiz);
}

/**
 * Get a Final Review quiz that combines questions from all modules
 * @param questionCount - Number of questions to include (default: 20)
 * @returns A randomized quiz with questions from all modules
 */
export function getFinalReviewQuiz(questionCount: number = 20): Quiz {
  // Collect all questions from all quizzes, tagging with module ID
  const allQuestions: QuizQuestion[] = [];

  Object.entries(quizzes).forEach(([moduleId, quiz]) => {
    quiz.questions.forEach((q) => {
      // Create a unique ID that includes module info
      allQuestions.push({
        ...q,
        id: `${moduleId}-${q.id}`,
      });
    });
  });

  // Shuffle all questions
  const shuffledQuestions = shuffleArray(allQuestions);

  // Take the requested number of questions
  const selectedQuestions = shuffledQuestions.slice(0, Math.min(questionCount, shuffledQuestions.length));

  // Randomize options for each selected question
  const finalQuestions = selectedQuestions.map(randomizeQuestionOptions);

  return {
    moduleId: 'final-review',
    questions: finalQuestions,
    passingScore: 80,
  };
}

/**
 * All quizzes indexed by module ID
 */
export const quizzes: Record<string, Quiz> = {
  'module-1': module1Quiz,
  'module-2': module2Quiz,
  'module-3': module3Quiz,
  'module-4': module4Quiz,
  'module-5': module5Quiz,
  'module-6': module6Quiz,
  'module-7': module7Quiz,
  'module-8': module8Quiz,
  'module-9': module9Quiz,
};

/**
 * Get a quiz by module ID
 * @param moduleId - The module ID (e.g., 'module-1')
 * @returns The quiz for the module, or undefined if not found
 */
export function getQuizByModuleId(moduleId: string): Quiz | undefined {
  return quizzes[moduleId];
}

/**
 * Get all quizzes as an array
 * @returns Array of all quizzes
 */
export function getAllQuizzes(): Quiz[] {
  return Object.values(quizzes);
}

/**
 * Check if a module has a quiz
 * @param moduleId - The module ID to check
 * @returns True if the module has a quiz
 */
export function hasQuiz(moduleId: string): boolean {
  return moduleId in quizzes;
}

// Re-export individual quizzes for direct imports
export {
  module1Quiz,
  module2Quiz,
  module3Quiz,
  module4Quiz,
  module5Quiz,
  module6Quiz,
  module7Quiz,
  module8Quiz,
  module9Quiz,
};
