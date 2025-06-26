import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, Clock, Star, CheckCircle } from 'lucide-react';
import { Question, InterviewSession, Answer } from '../types';
import { questionBank, getQuestionsByType } from '../data/questions';
import { generateFeedback } from '../utils/feedbackGenerator';

const InterviewSimulator: React.FC = () => {
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [confidence, setConfidence] = useState(50);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isAnswering, setIsAnswering] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Configuration state
  const [interviewType, setInterviewType] = useState<'technical' | 'behavioral' | 'hr' | 'design' | 'mixed'>('mixed');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [questionCount, setQuestionCount] = useState(5);

  // Timer effect
  useEffect(() => {
    if (session && isAnswering && !isPaused && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [session, isAnswering, isPaused, timeLeft]);

  const startInterview = () => {
    const questions = getQuestionsByType(interviewType, difficulty).slice(0, questionCount);
    
    const newSession: InterviewSession = {
      id: Date.now().toString(),
      jobRole: `${difficulty} ${interviewType} interview`,
      difficulty,
      type: interviewType,
      questions: questions.sort(() => Math.random() - 0.5), // Shuffle questions
      currentQuestionIndex: 0,
      answers: [],
      startTime: new Date()
    };
    
    setSession(newSession);
    setTimeLeft(questions[0]?.timeLimit || 300);
    setIsAnswering(true);
    setShowFeedback(false);
  };

  const submitAnswer = () => {
    if (!session || !session.questions[session.currentQuestionIndex]) return;

    const question = session.questions[session.currentQuestionIndex];
    const timeSpent = (question.timeLimit || 300) - timeLeft;
    
    const feedback = generateFeedback(
      { questionId: question.id, text: currentAnswer, timeSpent, confidence, feedback: {} as any },
      question.text,
      question.expectedAnswerFormat
    );

    const answer: Answer = {
      questionId: question.id,
      text: currentAnswer,
      timeSpent,
      confidence,
      feedback
    };

    const updatedSession = {
      ...session,
      answers: [...session.answers, answer]
    };

    setSession(updatedSession);
    setIsAnswering(false);
    setShowFeedback(true);
  };

  const nextQuestion = () => {
    if (!session) return;

    const nextIndex = session.currentQuestionIndex + 1;
    
    if (nextIndex >= session.questions.length) {
      // End interview
      const finalSession = {
        ...session,
        endTime: new Date(),
        score: session.answers.reduce((sum, answer) => sum + answer.feedback.score, 0) / session.answers.length
      };
      setSession(finalSession);
      setIsAnswering(false);
      setShowFeedback(true);
      return;
    }

    const updatedSession = {
      ...session,
      currentQuestionIndex: nextIndex
    };

    setSession(updatedSession);
    setCurrentAnswer('');
    setConfidence(50);
    setTimeLeft(session.questions[nextIndex].timeLimit || 300);
    setIsAnswering(true);
    setShowFeedback(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentQuestion = () => {
    if (!session) return null;
    return session.questions[session.currentQuestionIndex];
  };

  const isInterviewComplete = () => {
    return session && session.currentQuestionIndex >= session.questions.length;
  };

  if (!session) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-4">Interview Simulator</h1>
          <p className="text-lg text-slate-600">Practice your interview skills with AI-powered feedback</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-6">Configure Your Interview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Interview Type</label>
              <select
                value={interviewType}
                onChange={(e) => setInterviewType(e.target.value as any)}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="mixed">Mixed (All Types)</option>
                <option value="technical">Technical</option>
                <option value="behavioral">Behavioral</option>
                <option value="hr">HR/General</option>
                <option value="design">Design</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Difficulty Level</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Number of Questions</label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={3}>3 Questions</option>
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
                <option value={15}>15 Questions</option>
              </select>
            </div>
          </div>

          <button
            onClick={startInterview}
            className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <Play className="h-5 w-5" />
            <span>Start Interview</span>
          </button>
        </div>
      </div>
    );
  }

  if (isInterviewComplete()) {
    const averageScore = session.answers.reduce((sum, answer) => sum + answer.feedback.score, 0) / session.answers.length;
    
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Interview Complete!</h1>
            <p className="text-lg text-slate-600">Here's your performance summary</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">{Math.round(averageScore)}</div>
              <div className="text-sm text-slate-600">Overall Score</div>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">{session.answers.length}</div>
              <div className="text-sm text-slate-600">Questions Answered</div>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {Math.round(session.answers.reduce((sum, answer) => sum + answer.timeSpent, 0) / 60)}m
              </div>
              <div className="text-sm text-slate-600">Total Time</div>
            </div>
          </div>

          <div className="space-y-6">
            {session.answers.map((answer, index) => (
              <div key={answer.questionId} className="border border-slate-200 rounded-lg p-6">
                <h3 className="font-semibold text-slate-800 mb-3">
                  Question {index + 1}: {session.questions[index].text}
                </h3>
                
                <div className="bg-slate-50 p-4 rounded-lg mb-4">
                  <p className="text-slate-700">{answer.text}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-green-700 mb-2">Strengths:</h4>
                    <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                      {answer.feedback.strengths.map((strength, i) => (
                        <li key={i}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-orange-700 mb-2">Areas for Improvement:</h4>
                    <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                      {answer.feedback.improvements.map((improvement, i) => (
                        <li key={i}>{improvement}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">{answer.feedback.overallAssessment}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => setSession(null)}
              className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              Start New Interview
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = getCurrentQuestion();
  if (!currentQuestion) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-600">
              Question {session.currentQuestionIndex + 1} of {session.questions.length}
            </span>
            <span className="text-sm font-medium text-slate-600">
              {currentQuestion.type} • {currentQuestion.difficulty}
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((session.currentQuestionIndex + 1) / session.questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Timer */}
        <div className="flex items-center justify-center mb-6">
          <div className={`flex items-center space-x-2 p-3 rounded-lg ${
            timeLeft <= 30 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
          }`}>
            <Clock className="h-5 w-5" />
            <span className="font-mono text-lg font-semibold">{formatTime(timeLeft)}</span>
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="ml-2 p-1 hover:bg-white rounded"
            >
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">{currentQuestion.text}</h2>
          {currentQuestion.expectedAnswerFormat === 'star' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-yellow-800">
                <Star className="h-4 w-4 inline mr-1" />
                Use the STAR method: <strong>Situation</strong>, <strong>Task</strong>, <strong>Action</strong>, <strong>Result</strong>
              </p>
            </div>
          )}
        </div>

        {/* Answer Input */}
        <div className="mb-6">
          <textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full h-40 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            disabled={!isAnswering}
          />
        </div>

        {/* Confidence Slider */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Confidence Level: {confidence}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={confidence}
            onChange={(e) => setConfidence(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            disabled={!isAnswering}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          {isAnswering ? (
            <button
              onClick={submitAnswer}
              disabled={!currentAnswer.trim()}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <span>{session.currentQuestionIndex + 1 >= session.questions.length ? 'Complete Interview' : 'Next Question'}</span>
              <SkipForward className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Follow-up Questions */}
        {currentQuestion.followUpPrompts && currentQuestion.followUpPrompts.length > 0 && (
          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <h3 className="font-medium text-slate-800 mb-2">Potential Follow-up Questions:</h3>
            <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
              {currentQuestion.followUpPrompts.map((prompt, index) => (
                <li key={index}>{prompt}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewSimulator;