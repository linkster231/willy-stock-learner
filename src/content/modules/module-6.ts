/**
 * Module 6: Politics and Markets
 *
 * Understanding how elections, Federal Reserve policies,
 * and world events impact the stock market.
 */

import { Module } from '@/types/content';

export const module6: Module = {
  id: 'module-6',
  titleKey: 'learn.modules.6.title',
  descriptionKey: 'learn.modules.6.description',
  icon: '🏛️',
  lessons: [
    {
      id: 'lesson-6-1',
      titleKey: 'learn.modules.6.lessons.1.title',
      contentKey: 'learn.modules.6.lessons.1.content',
      videoUrl: 'https://www.youtube.com/watch?v=PHe0bXAIuk0',
      duration: 14,
      keyPoints: [
        'learn.modules.6.lessons.1.point1',
        'learn.modules.6.lessons.1.point2',
        'learn.modules.6.lessons.1.point3',
        'learn.modules.6.lessons.1.point4',
      ],
    },
    {
      id: 'lesson-6-2',
      titleKey: 'learn.modules.6.lessons.2.title',
      contentKey: 'learn.modules.6.lessons.2.content',
      videoUrl: 'https://www.youtube.com/watch?v=mQuvGqUUM-0',
      duration: 18,
      keyPoints: [
        'learn.modules.6.lessons.2.point1',
        'learn.modules.6.lessons.2.point2',
        'learn.modules.6.lessons.2.point3',
        'learn.modules.6.lessons.2.point4',
      ],
    },
    {
      id: 'lesson-6-3',
      titleKey: 'learn.modules.6.lessons.3.title',
      contentKey: 'learn.modules.6.lessons.3.content',
      videoUrl: 'https://www.youtube.com/watch?v=RHWLM7HCQzg',
      duration: 12,
      keyPoints: [
        'learn.modules.6.lessons.3.point1',
        'learn.modules.6.lessons.3.point2',
        'learn.modules.6.lessons.3.point3',
      ],
    },
    {
      id: 'lesson-6-4',
      titleKey: 'learn.modules.6.lessons.4.title',
      contentKey: 'learn.modules.6.lessons.4.content',
      videoUrl: 'https://www.youtube.com/watch?v=ZfYsNnPEbm8',
      duration: 15,
      keyPoints: [
        'learn.modules.6.lessons.4.point1',
        'learn.modules.6.lessons.4.point2',
        'learn.modules.6.lessons.4.point3',
        'learn.modules.6.lessons.4.point4',
      ],
    },
    {
      id: 'lesson-6-5',
      titleKey: 'learn.modules.6.lessons.5.title',
      contentKey: 'learn.modules.6.lessons.5.content',
      videoUrl: 'https://www.youtube.com/watch?v=0ecCG6pd1AU',
      duration: 10,
      keyPoints: [
        'learn.modules.6.lessons.5.point1',
        'learn.modules.6.lessons.5.point2',
        'learn.modules.6.lessons.5.point3',
      ],
    },
  ],
  prerequisites: ['module-1', 'module-3'],
  estimatedHours: 1.5,
};

export default module6;
