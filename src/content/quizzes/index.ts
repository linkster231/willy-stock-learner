import { Quiz } from '@/types/content';
import { module1Quiz } from './module-1-quiz';
import { module2Quiz } from './module-2-quiz';
import { module3Quiz } from './module-3-quiz';
import { module4Quiz } from './module-4-quiz';
import { module5Quiz } from './module-5-quiz';
import { module6Quiz } from './module-6-quiz';
import { module7Quiz } from './module-7-quiz';
import { module8Quiz } from './module-8-quiz';

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
};
