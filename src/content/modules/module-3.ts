/**
 * Module 3: Understanding Risk
 *
 * Learn about investment risk, diversification strategies,
 * volatility, and how to protect your money.
 */

import { Module } from '@/types/content';

export const module3: Module = {
  id: 'module-3',
  titleKey: 'learn.modules.3.title',
  descriptionKey: 'learn.modules.3.description',
  icon: '🛡️',
  lessons: [
    {
      id: 'lesson-3-1',
      titleKey: 'learn.modules.3.lessons.1.title',
      contentKey: 'learn.modules.3.lessons.1.content',
      videoUrl: 'https://www.youtube.com/watch?v=7ZL1TUxcRag',
      duration: 12,
      keyPoints: [
        'learn.modules.3.lessons.1.point1',
        'learn.modules.3.lessons.1.point2',
        'learn.modules.3.lessons.1.point3',
        'learn.modules.3.lessons.1.point4',
      ],
    },
    {
      id: 'lesson-3-2',
      titleKey: 'learn.modules.3.lessons.2.title',
      contentKey: 'learn.modules.3.lessons.2.content',
      videoUrl: 'https://www.youtube.com/watch?v=wMaENRBZiQk',
      duration: 15,
      keyPoints: [
        'learn.modules.3.lessons.2.point1',
        'learn.modules.3.lessons.2.point2',
        'learn.modules.3.lessons.2.point3',
      ],
    },
    {
      id: 'lesson-3-3',
      titleKey: 'learn.modules.3.lessons.3.title',
      contentKey: 'learn.modules.3.lessons.3.content',
      videoUrl: 'https://www.youtube.com/watch?v=qIw-yFC-HNU',
      duration: 14,
      keyPoints: [
        'learn.modules.3.lessons.3.point1',
        'learn.modules.3.lessons.3.point2',
        'learn.modules.3.lessons.3.point3',
        'learn.modules.3.lessons.3.point4',
      ],
    },
    {
      id: 'lesson-3-4',
      titleKey: 'learn.modules.3.lessons.4.title',
      contentKey: 'learn.modules.3.lessons.4.content',
      videoUrl: 'https://www.youtube.com/watch?v=fTTGALaRZoc',
      duration: 12,
      keyPoints: [
        'learn.modules.3.lessons.4.point1',
        'learn.modules.3.lessons.4.point2',
        'learn.modules.3.lessons.4.point3',
      ],
    },
    {
      id: 'lesson-3-5',
      titleKey: 'learn.modules.3.lessons.5.title',
      contentKey: 'learn.modules.3.lessons.5.content',
      videoUrl: 'https://www.youtube.com/watch?v=yRRiswMsFqk',
      duration: 10,
      keyPoints: [
        'learn.modules.3.lessons.5.point1',
        'learn.modules.3.lessons.5.point2',
        'learn.modules.3.lessons.5.point3',
      ],
    },
  ],
  prerequisites: ['module-1', 'module-2'],
  estimatedHours: 1.5,
};

export default module3;
