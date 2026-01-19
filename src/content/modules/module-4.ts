/**
 * Module 4: Psychology of Trading
 *
 * Understanding emotions in trading, building discipline,
 * and avoiding common psychological pitfalls like revenge trading.
 */

import { Module } from '@/types/content';

export const module4: Module = {
  id: 'module-4',
  titleKey: 'learn.modules.4.title',
  descriptionKey: 'learn.modules.4.description',
  icon: '🧠',
  lessons: [
    {
      id: 'lesson-4-1',
      titleKey: 'learn.modules.4.lessons.1.title',
      contentKey: 'learn.modules.4.lessons.1.content',
      videoUrl: 'https://www.youtube.com/watch?v=BU7WfEuqLfI',
      duration: 14,
      keyPoints: [
        'learn.modules.4.lessons.1.point1',
        'learn.modules.4.lessons.1.point2',
        'learn.modules.4.lessons.1.point3',
        'learn.modules.4.lessons.1.point4',
      ],
    },
    {
      id: 'lesson-4-2',
      titleKey: 'learn.modules.4.lessons.2.title',
      contentKey: 'learn.modules.4.lessons.2.content',
      videoUrl: 'https://www.youtube.com/watch?v=Y5TlFyGj3xk',
      duration: 12,
      keyPoints: [
        'learn.modules.4.lessons.2.point1',
        'learn.modules.4.lessons.2.point2',
        'learn.modules.4.lessons.2.point3',
      ],
    },
    {
      id: 'lesson-4-3',
      titleKey: 'learn.modules.4.lessons.3.title',
      contentKey: 'learn.modules.4.lessons.3.content',
      videoUrl: 'https://www.youtube.com/watch?v=F3bj1XjBd1s',
      duration: 15,
      keyPoints: [
        'learn.modules.4.lessons.3.point1',
        'learn.modules.4.lessons.3.point2',
        'learn.modules.4.lessons.3.point3',
        'learn.modules.4.lessons.3.point4',
      ],
    },
    {
      id: 'lesson-4-4',
      titleKey: 'learn.modules.4.lessons.4.title',
      contentKey: 'learn.modules.4.lessons.4.content',
      videoUrl: 'https://www.youtube.com/watch?v=Xq4yMOFjFXE',
      duration: 10,
      keyPoints: [
        'learn.modules.4.lessons.4.point1',
        'learn.modules.4.lessons.4.point2',
        'learn.modules.4.lessons.4.point3',
      ],
    },
  ],
  prerequisites: ['module-1', 'module-2', 'module-3'],
  estimatedHours: 1.5,
};

export default module4;
