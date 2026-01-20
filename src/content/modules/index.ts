/**
 * Module Content Index
 *
 * Central export point for all learning modules with helper functions
 * for module retrieval, ordering, and progress tracking.
 */

import { Module, Lesson } from '@/types/content';
import { module1 } from './module-1';
import { module2 } from './module-2';
import { module3 } from './module-3';
import { module4 } from './module-4';
import { module5 } from './module-5';
import { module6 } from './module-6';
import { module7 } from './module-7';
import { module8 } from './module-8';
import { module9 } from './module-9';

/**
 * All modules in recommended learning order
 *
 * Learning flow:
 * 1. Stock Basics → 2. Getting Started → 9. Chart Reading →
 * 3. Risk Management → 4. Trading Psychology → 6. Market Influences →
 * 5. Avoiding Fraud → 7. Taxes → 8. Using Fidelity (capstone)
 */
export const modules: Module[] = [
  module1,  // Stock Market Basics
  module2,  // Getting Started
  module9,  // Reading Charts (candlesticks)
  module3,  // Risk Management
  module4,  // Trading Psychology
  module6,  // Market Influences
  module5,  // Avoiding Fraud
  module7,  // Taxes & Strategy
  module8,  // Using Fidelity (capstone)
];

/**
 * Module map for quick lookup by ID
 */
export const moduleMap: Record<string, Module> = modules.reduce(
  (acc, mod) => {
    acc[mod.id] = mod;
    return acc;
  },
  {} as Record<string, Module>
);

/**
 * Get a module by its ID
 */
export function getModuleById(moduleId: string): Module | undefined {
  return moduleMap[moduleId];
}

/**
 * Get a lesson by module ID and lesson ID
 */
export function getLessonById(
  moduleId: string,
  lessonId: string
): Lesson | undefined {
  const learningModule = getModuleById(moduleId);
  if (!learningModule) return undefined;
  return learningModule.lessons.find((lesson) => lesson.id === lessonId);
}

/**
 * Get the next lesson in a module
 */
export function getNextLesson(
  moduleId: string,
  currentLessonId: string
): { lesson: Lesson; moduleId: string } | undefined {
  const learningModule = getModuleById(moduleId);
  if (!learningModule) return undefined;

  const currentIndex = learningModule.lessons.findIndex(
    (lesson) => lesson.id === currentLessonId
  );
  if (currentIndex === -1) return undefined;

  // If there's a next lesson in the same module
  if (currentIndex < learningModule.lessons.length - 1) {
    return {
      lesson: learningModule.lessons[currentIndex + 1],
      moduleId: learningModule.id,
    };
  }

  // Otherwise, get first lesson of next module
  const moduleIndex = modules.findIndex((m) => m.id === moduleId);
  if (moduleIndex < modules.length - 1) {
    const nextModule = modules[moduleIndex + 1];
    return {
      lesson: nextModule.lessons[0],
      moduleId: nextModule.id,
    };
  }

  return undefined;
}

/**
 * Get the previous lesson in a module
 */
export function getPreviousLesson(
  moduleId: string,
  currentLessonId: string
): { lesson: Lesson; moduleId: string } | undefined {
  const learningModule = getModuleById(moduleId);
  if (!learningModule) return undefined;

  const currentIndex = learningModule.lessons.findIndex(
    (lesson) => lesson.id === currentLessonId
  );
  if (currentIndex === -1) return undefined;

  // If there's a previous lesson in the same module
  if (currentIndex > 0) {
    return {
      lesson: learningModule.lessons[currentIndex - 1],
      moduleId: learningModule.id,
    };
  }

  // Otherwise, get last lesson of previous module
  const moduleIndex = modules.findIndex((m) => m.id === moduleId);
  if (moduleIndex > 0) {
    const prevModule = modules[moduleIndex - 1];
    return {
      lesson: prevModule.lessons[prevModule.lessons.length - 1],
      moduleId: prevModule.id,
    };
  }

  return undefined;
}

/**
 * Check if prerequisites are met for a module
 */
export function arePrerequisitesMet(
  moduleId: string,
  completedModuleIds: string[]
): boolean {
  const learningModule = getModuleById(moduleId);
  if (!learningModule) return false;

  return learningModule.prerequisites.every((prereqId) =>
    completedModuleIds.includes(prereqId)
  );
}

/**
 * Get modules available to the user based on completed modules
 */
export function getAvailableModules(completedModuleIds: string[]): Module[] {
  return modules.filter(
    (module) =>
      !completedModuleIds.includes(module.id) &&
      arePrerequisitesMet(module.id, completedModuleIds)
  );
}

/**
 * Get total estimated hours for all modules
 */
export function getTotalEstimatedHours(): number {
  return modules.reduce((total, module) => total + module.estimatedHours, 0);
}

/**
 * Get total number of lessons across all modules
 */
export function getTotalLessonCount(): number {
  return modules.reduce((total, module) => total + module.lessons.length, 0);
}

/**
 * Calculate completion percentage based on completed lessons
 */
export function calculateOverallProgress(
  completedLessonIds: string[]
): number {
  const totalLessons = getTotalLessonCount();
  if (totalLessons === 0) return 0;
  return Math.round((completedLessonIds.length / totalLessons) * 100);
}

/**
 * Calculate module completion percentage
 */
export function calculateModuleProgress(
  moduleId: string,
  completedLessonIds: string[]
): number {
  const learningModule = getModuleById(moduleId);
  if (!learningModule || learningModule.lessons.length === 0) return 0;

  const completedInModule = learningModule.lessons.filter((lesson) =>
    completedLessonIds.includes(lesson.id)
  ).length;

  return Math.round((completedInModule / learningModule.lessons.length) * 100);
}

/**
 * Get learning path with module status
 */
export function getLearningPath(
  completedModuleIds: string[],
  completedLessonIds: string[]
): Array<{
  module: Module;
  status: 'locked' | 'available' | 'in-progress' | 'completed';
  progress: number;
}> {
  return modules.map((module) => {
    const progress = calculateModuleProgress(module.id, completedLessonIds);
    const prereqsMet = arePrerequisitesMet(module.id, completedModuleIds);

    let status: 'locked' | 'available' | 'in-progress' | 'completed';
    if (completedModuleIds.includes(module.id)) {
      status = 'completed';
    } else if (progress > 0) {
      status = 'in-progress';
    } else if (prereqsMet) {
      status = 'available';
    } else {
      status = 'locked';
    }

    return { module, status, progress };
  });
}

// Named exports for individual modules
export { module1, module2, module3, module4, module5, module6, module7, module8, module9 };

// Default export
export default modules;
