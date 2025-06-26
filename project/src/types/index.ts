export interface Question {
  id: string;
  text: string;
  type: 'technical' | 'behavioral' | 'hr' | 'design';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  followUpPrompts?: string[];
  timeLimit?: number; // in seconds
  expectedAnswerFormat?: 'star' | 'technical' | 'general';
}

export interface JobDescription {
  title: string;
  company: string;
  skills: string[];
  experience: string;
  description: string;
  industry: string;
}

export interface InterviewSession {
  id: string;
  jobRole: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'technical' | 'behavioral' | 'hr' | 'design' | 'mixed';
  questions: Question[];
  currentQuestionIndex: number;
  answers: Answer[];
  startTime: Date;
  endTime?: Date;
  score?: number;
}

export interface Answer {
  questionId: string;
  text: string;
  timeSpent: number;
  confidence: number;
  feedback: Feedback;
}

export interface Feedback {
  score: number; // 0-100
  strengths: string[];
  improvements: string[];
  starMethodCompliance?: boolean;
  suggestions: string[];
  overallAssessment: string;
}

export interface UserProfile {
  name: string;
  experience: string;
  targetRoles: string[];
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  completedSessions: InterviewSession[];
  totalPracticeTime: number;
  averageScore: number;
}