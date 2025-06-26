import { Question } from '../types';

export const questionBank: Question[] = [
  // Technical Questions
  {
    id: 'tech-1',
    text: 'Explain the difference between let, const, and var in JavaScript.',
    type: 'technical',
    difficulty: 'beginner',
    category: 'JavaScript',
    timeLimit: 180,
    expectedAnswerFormat: 'technical',
    followUpPrompts: [
      'Can you provide examples of when you would use each?',
      'What happens with hoisting in each case?'
    ]
  },
  {
    id: 'tech-2',
    text: 'Design a system to handle millions of concurrent users for a social media platform.',
    type: 'technical',
    difficulty: 'advanced',
    category: 'System Design',
    timeLimit: 600,
    expectedAnswerFormat: 'technical',
    followUpPrompts: [
      'How would you handle data consistency?',
      'What about caching strategies?',
      'How would you scale the database?'
    ]
  },
  {
    id: 'tech-3',
    text: 'Implement a function to reverse a linked list.',
    type: 'technical',
    difficulty: 'intermediate',
    category: 'Data Structures',
    timeLimit: 300,
    expectedAnswerFormat: 'technical'
  },

  // Behavioral Questions
  {
    id: 'behavioral-1',
    text: 'Tell me about a time when you had to work with a difficult team member.',
    type: 'behavioral',
    difficulty: 'intermediate',
    category: 'Teamwork',
    timeLimit: 240,
    expectedAnswerFormat: 'star',
    followUpPrompts: [
      'What was the outcome?',
      'What would you do differently?',
      'How did this experience change your approach to teamwork?'
    ]
  },
  {
    id: 'behavioral-2',
    text: 'Describe a situation where you had to learn a new technology quickly.',
    type: 'behavioral',
    difficulty: 'beginner',
    category: 'Learning',
    timeLimit: 180,
    expectedAnswerFormat: 'star'
  },
  {
    id: 'behavioral-3',
    text: 'Tell me about a time when you made a mistake at work and how you handled it.',
    type: 'behavioral',
    difficulty: 'intermediate',
    category: 'Problem Solving',
    timeLimit: 240,
    expectedAnswerFormat: 'star'
  },

  // HR Questions
  {
    id: 'hr-1',
    text: 'Why do you want to work for our company?',
    type: 'hr',
    difficulty: 'beginner',
    category: 'Motivation',
    timeLimit: 120,
    followUpPrompts: [
      'What specifically attracts you to our mission?',
      'How do you see yourself contributing to our goals?'
    ]
  },
  {
    id: 'hr-2',
    text: 'Where do you see yourself in 5 years?',
    type: 'hr',
    difficulty: 'beginner',
    category: 'Career Goals',
    timeLimit: 120
  },
  {
    id: 'hr-3',
    text: 'What are your salary expectations?',
    type: 'hr',
    difficulty: 'intermediate',
    category: 'Compensation',
    timeLimit: 90
  },

  // Design Questions
  {
    id: 'design-1',
    text: 'How would you improve the user experience of our mobile app?',
    type: 'design',
    difficulty: 'intermediate',
    category: 'UX Design',
    timeLimit: 300,
    followUpPrompts: [
      'What research methods would you use?',
      'How would you measure success?'
    ]
  },
  {
    id: 'design-2',
    text: 'Design a dashboard for a project management tool.',
    type: 'design',
    difficulty: 'advanced',
    category: 'UI Design',
    timeLimit: 480
  }
];

export const getQuestionsByType = (type: string, difficulty?: string) => {
  return questionBank.filter(q => {
    const typeMatch = type === 'mixed' || q.type === type;
    const difficultyMatch = !difficulty || q.difficulty === difficulty;
    return typeMatch && difficultyMatch;
  });
};

export const getQuestionsBySkills = (skills: string[]) => {
  return questionBank.filter(q => 
    skills.some(skill => 
      q.category.toLowerCase().includes(skill.toLowerCase()) ||
      q.text.toLowerCase().includes(skill.toLowerCase())
    )
  );
};