/**
 * Module 5: Market Manipulation
 *
 * Learn about insider trading, pump-and-dump schemes,
 * and how to protect yourself from market manipulation and scams.
 */

import { Module } from '@/types/content';

export const module5: Module = {
  id: 'module-5',
  titleKey: 'learn.modules.5.title',
  descriptionKey: 'learn.modules.5.description',
  icon: '🚨',
  lessons: [
    {
      id: 'lesson-5-1',
      titleKey: 'learn.modules.5.lessons.1.title',
      contentKey: 'learn.modules.5.lessons.1.content',
      videoUrl: 'https://www.youtube.com/watch?v=YrLDAoR-gVE',
      duration: 15,
      keyPoints: [
        'learn.modules.5.lessons.1.point1',
        'learn.modules.5.lessons.1.point2',
        'learn.modules.5.lessons.1.point3',
        'learn.modules.5.lessons.1.point4',
      ],
    },
    {
      id: 'lesson-5-2',
      titleKey: 'learn.modules.5.lessons.2.title',
      contentKey: 'learn.modules.5.lessons.2.content',
      videoUrl: 'https://www.youtube.com/watch?v=7LU2Rv9xC8k',
      duration: 14,
      keyPoints: [
        'learn.modules.5.lessons.2.point1',
        'learn.modules.5.lessons.2.point2',
        'learn.modules.5.lessons.2.point3',
      ],
    },
    {
      id: 'lesson-5-3',
      titleKey: 'learn.modules.5.lessons.3.title',
      contentKey: 'learn.modules.5.lessons.3.content',
      videoUrl: 'https://www.youtube.com/watch?v=ytDamqTjPwg',
      duration: 12,
      keyPoints: [
        'learn.modules.5.lessons.3.point1',
        'learn.modules.5.lessons.3.point2',
        'learn.modules.5.lessons.3.point3',
        'learn.modules.5.lessons.3.point4',
      ],
    },
    {
      id: 'lesson-5-4',
      titleKey: 'learn.modules.5.lessons.4.title',
      contentKey: 'learn.modules.5.lessons.4.content',
      videoUrl: 'https://www.youtube.com/watch?v=lKbdRJPj4WM',
      duration: 10,
      keyPoints: [
        'learn.modules.5.lessons.4.point1',
        'learn.modules.5.lessons.4.point2',
        'learn.modules.5.lessons.4.point3',
      ],
    },
  ],
  prerequisites: ['module-1', 'module-2'],
  estimatedHours: 1.5,
};

export default module5;
