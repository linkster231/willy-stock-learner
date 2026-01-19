/**
 * Module 8: Using Trading Platforms
 *
 * Learn to use Fidelity and other platforms to trade stocks,
 * including fees, order types, and market mechanics.
 */

import { Module } from '@/types/content';

export const module8: Module = {
  id: 'module-8',
  titleKey: 'learn.modules.8.title',
  descriptionKey: 'learn.modules.8.description',
  icon: '📱',
  lessons: [
    {
      id: 'lesson-8-1',
      titleKey: 'learn.modules.8.lessons.1.title',
      contentKey: 'learn.modules.8.lessons.1.content',
      videoUrl: 'https://www.youtube.com/watch?v=4j2emMn7UaI',
      duration: 15,
      keyPoints: [
        'learn.modules.8.lessons.1.point1',
        'learn.modules.8.lessons.1.point2',
        'learn.modules.8.lessons.1.point3',
        'learn.modules.8.lessons.1.point4',
      ],
    },
    {
      id: 'lesson-8-2',
      titleKey: 'learn.modules.8.lessons.2.title',
      contentKey: 'learn.modules.8.lessons.2.content',
      videoUrl: 'https://www.youtube.com/watch?v=OI-TzQm0R7Y',
      duration: 18,
      keyPoints: [
        'learn.modules.8.lessons.2.point1',
        'learn.modules.8.lessons.2.point2',
        'learn.modules.8.lessons.2.point3',
        'learn.modules.8.lessons.2.point4',
      ],
    },
    {
      id: 'lesson-8-3',
      titleKey: 'learn.modules.8.lessons.3.title',
      contentKey: 'learn.modules.8.lessons.3.content',
      videoUrl: 'https://www.youtube.com/watch?v=Ll3TCEz4g1k',
      duration: 12,
      keyPoints: [
        'learn.modules.8.lessons.3.point1',
        'learn.modules.8.lessons.3.point2',
        'learn.modules.8.lessons.3.point3',
      ],
    },
    {
      id: 'lesson-8-4',
      titleKey: 'learn.modules.8.lessons.4.title',
      contentKey: 'learn.modules.8.lessons.4.content',
      videoUrl: 'https://www.youtube.com/watch?v=8Yh8xB9eHI0',
      duration: 15,
      keyPoints: [
        'learn.modules.8.lessons.4.point1',
        'learn.modules.8.lessons.4.point2',
        'learn.modules.8.lessons.4.point3',
        'learn.modules.8.lessons.4.point4',
      ],
    },
    {
      id: 'lesson-8-5',
      titleKey: 'learn.modules.8.lessons.5.title',
      contentKey: 'learn.modules.8.lessons.5.content',
      videoUrl: 'https://www.youtube.com/watch?v=2zNVyMK7Jgo',
      duration: 15,
      keyPoints: [
        'learn.modules.8.lessons.5.point1',
        'learn.modules.8.lessons.5.point2',
        'learn.modules.8.lessons.5.point3',
        'learn.modules.8.lessons.5.point4',
      ],
    },
  ],
  prerequisites: ['module-1', 'module-2'],
  estimatedHours: 2,
};

export default module8;
