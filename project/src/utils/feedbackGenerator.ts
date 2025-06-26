import { Answer, Feedback } from '../types';

export const generateFeedback = (answer: Answer, questionText: string, expectedFormat?: string): Feedback => {
  const text = answer.text.toLowerCase();
  const wordCount = answer.text.split(' ').length;
  
  let score = 50; // Base score
  const strengths: string[] = [];
  const improvements: string[] = [];
  const suggestions: string[] = [];
  
  // Check length appropriateness
  if (wordCount < 20) {
    improvements.push('Answer is too brief - provide more detail and examples');
    score -= 15;
  } else if (wordCount > 300) {
    improvements.push('Answer is too lengthy - focus on key points and be more concise');
    score -= 10;
  } else {
    strengths.push('Good answer length and detail level');
    score += 10;
  }

  // Check for specific keywords that indicate good answers
  const positiveKeywords = ['experience', 'example', 'result', 'learned', 'improved', 'achieved', 'implemented', 'developed'];
  const keywordCount = positiveKeywords.filter(keyword => text.includes(keyword)).length;
  
  if (keywordCount >= 3) {
    strengths.push('Rich in relevant examples and specific outcomes');
    score += 15;
  } else if (keywordCount >= 1) {
    strengths.push('Includes some relevant examples');
    score += 5;
  } else {
    improvements.push('Add more specific examples and concrete outcomes');
    score -= 10;
  }

  // STAR method compliance for behavioral questions
  let starMethodCompliance = false;
  if (expectedFormat === 'star') {
    const starElements = {
      situation: ['situation', 'context', 'background', 'project', 'challenge'],
      task: ['task', 'responsibility', 'goal', 'objective', 'assigned'],
      action: ['action', 'did', 'implemented', 'decided', 'approached', 'used'],
      result: ['result', 'outcome', 'achieved', 'improved', 'increased', 'decreased', 'learned']
    };

    const starScore = Object.values(starElements).reduce((acc, keywords) => {
      return acc + (keywords.some(keyword => text.includes(keyword)) ? 1 : 0);
    }, 0);

    starMethodCompliance = starScore >= 3;
    
    if (starMethodCompliance) {
      strengths.push('Follows STAR method structure effectively');
      score += 20;
    } else {
      improvements.push('Structure your answer using the STAR method (Situation, Task, Action, Result)');
      suggestions.push('Learn more about the STAR method: https://www.thebalancemoney.com/what-is-the-star-interview-response-technique-2061629');
      score -= 15;
    }
  }

  // Check confidence level alignment
  if (answer.confidence > 80 && score < 60) {
    improvements.push('Your confidence level seems higher than your answer quality - practice more or be more realistic about your confidence');
  } else if (answer.confidence < 50 && score > 70) {
    strengths.push('Your answer quality is good - you can be more confident in your responses');
  }

  // Time management feedback
  if (answer.timeSpent > 300) {
    improvements.push('Work on being more concise - practice timing your responses');
  } else if (answer.timeSpent < 30) {
    improvements.push('Take more time to think through your answer before responding');
  } else {
    strengths.push('Good time management for your response');
  }

  // Ensure score is within bounds
  score = Math.max(0, Math.min(100, score));

  // Generate overall assessment
  let overallAssessment = '';
  if (score >= 80) {
    overallAssessment = 'Excellent response! You demonstrate strong communication skills and relevant experience.';
  } else if (score >= 60) {
    overallAssessment = 'Good response with room for improvement. Focus on the suggested areas to strengthen your answer.';
  } else if (score >= 40) {
    overallAssessment = 'Adequate response but needs significant improvement. Practice with the suggested resources.';
  } else {
    overallAssessment = 'Response needs substantial work. Consider practicing more and reviewing interview best practices.';
  }

  // Add general suggestions
  suggestions.push(
    'Review common interview questions: https://www.thebalancemoney.com/top-job-interview-questions-2061228',
    'Practice your responses out loud to improve fluency',
    'Research the company and role thoroughly before the interview'
  );

  return {
    score,
    strengths,
    improvements,
    starMethodCompliance,
    suggestions,
    overallAssessment
  };
};

export const calculateOverallScore = (answers: Answer[]): number => {
  if (answers.length === 0) return 0;
  const totalScore = answers.reduce((sum, answer) => sum + answer.feedback.score, 0);
  return Math.round(totalScore / answers.length);
};