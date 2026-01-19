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

/**
 * All modules in recommended learning order
 */
export const modules: Module[] = [
  module1,
  module2,
  module3,
  module4,
  module5,
  module6,
  module7,
  module8,
];

/**
 * Module map for quick lookup by ID
 */
export const moduleMap: Record<string, Module> = modules.reduce(
  (acc, module) => {
    acc[module.id] = module;
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
  const module = getModuleById(moduleId);
  if (!module) return undefined;
  return module.lessons.find((lesson) => lesson.id === lessonId);
}

/**
 * Get the next lesson in a module
 */
export function getNextLesson(
  moduleId: string,
  currentLessonId: string
): { lesson: Lesson; moduleId: string } | undefined {
  const module = getModuleById(moduleId);
  if (!module) return undefined;

  const currentIndex = module.lessons.findIndex(
    (lesson) => lesson.id === currentLessonId
  );
  if (currentIndex === -1) return undefined;

  // If there's a next lesson in the same module
  if (currentIndex < module.lessons.length - 1) {
    return {
      lesson: module.lessons[currentIndex + 1],
      moduleId: module.id,
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
  const module = getModuleById(moduleId);
  if (!module) return undefined;

  const currentIndex = module.lessons.findIndex(
    (lesson) => lesson.id === currentLessonId
  );
  if (currentIndex === -1) return undefined;

  // If there's a previous lesson in the same module
  if (currentIndex > 0) {
    return {
      lesson: module.lessons[currentIndex - 1],
      moduleId: module.id,
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
  const module = getModuleById(moduleId);
  if (!module) return false;

  return module.prerequisites.every((prereqId) =>
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
  const module = getModuleById(moduleId);
  if (!module || module.lessons.length === 0) return 0;

  const completedInModule = module.lessons.filter((lesson) =>
    completedLessonIds.includes(lesson.id)
  ).length;

  return Math.round((completedInModule / module.lessons.length) * 100);
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
export { module1, module2, module3, module4, module5, module6, module7, module8 };

// Default export
export default modules;
