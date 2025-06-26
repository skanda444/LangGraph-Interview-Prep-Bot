import React, { useState } from 'react';
import { FileText, Lightbulb, Target, Search, ExternalLink, BookOpen, Users, DollarSign } from 'lucide-react';
import { parseJobDescription, generateResearchTips } from '../utils/jobDescriptionParser';
import { questionBank } from '../data/questions';

const PreparationTools: React.FC = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [parsedJob, setParsedJob] = useState<any>(null);
  const [selectedDomain, setSelectedDomain] = useState<'technical' | 'behavioral' | 'hr' | 'design'>('technical');

  const handleParseJob = () => {
    if (jobDescription.trim()) {
      const parsed = parseJobDescription(jobDescription);
      setParsedJob(parsed);
    }
  };

  const getDomainQuestions = (domain: string) => {
    return questionBank.filter(q => q.type === domain).slice(0, 10);
  };

  const salaryNegotiationTips = [
    "Research industry standards and company salary ranges before negotiating",
    "Consider the total compensation package, not just base salary",
    "Practice your negotiation conversation beforehand",
    "Be prepared to justify your salary request with specific examples",
    "Know your minimum acceptable offer before starting negotiations",
    "Consider non-salary benefits that might be valuable to you",
    "Time your negotiation appropriately - usually after receiving an offer",
    "Be professional and collaborative, not confrontational"
  ];

  const bodyLanguageTips = [
    "Maintain good eye contact - shows confidence and engagement",
    "Sit up straight with shoulders back - projects professionalism",
    "Use open gestures - avoid crossing arms or fidgeting",
    "Mirror the interviewer's energy level appropriately",
    "Smile genuinely when appropriate - shows enthusiasm",
    "Use hand gestures to emphasize points, but don't overdo it",
    "Lean in slightly when listening - shows active engagement",
    "Practice a firm handshake - first impressions matter"
  ];

  const industryQuestions = {
    'Technology': [
      'How do you stay updated with the latest tech trends?',
      'Describe your experience with agile development methodologies.',
      'How do you approach debugging complex technical issues?'
    ],
    'Finance': [
      'How do you handle working with sensitive financial data?',
      'Describe your experience with financial regulations and compliance.',
      'How do you approach risk assessment in your work?'
    ],
    'Healthcare': [
      'How do you ensure patient privacy and data security?',
      'Describe your experience working in a regulated environment.',
      'How do you handle high-pressure situations?'
    ],
    'Retail': [
      'How do you approach customer experience optimization?',
      'Describe your experience with omnichannel retail strategies.',
      'How do you handle seasonal demand fluctuations?'
    ]
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">Interview Preparation Tools</h1>
        <p className="text-lg text-slate-600">Comprehensive resources to help you prepare for your next interview</p>
      </div>

      {/* Job Description Parser */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center space-x-2 mb-6">
          <FileText className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-slate-800">Job Description Analyzer</h2>
        </div>
        
        <div className="space-y-4">
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here to get personalized preparation tips..."
            className="w-full h-32 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
          
          <button
            onClick={handleParseJob}
            disabled={!jobDescription.trim()}
            className="bg-blue-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Analyze Job Description
          </button>
        </div>

        {parsedJob && (
          <div className="mt-6 p-6 bg-slate-50 rounded-lg">
            <h3 className="font-semibold text-slate-800 mb-4">Analysis Results</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-medium text-slate-700 mb-2">Job Details</h4>
                <p><strong>Title:</strong> {parsedJob.title}</p>
                <p><strong>Company:</strong> {parsedJob.company}</p>
                <p><strong>Industry:</strong> {parsedJob.industry}</p>
                <p><strong>Experience:</strong> {parsedJob.experience}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-slate-700 mb-2">Required Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {parsedJob.skills.map((skill: string, index: number) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-slate-700 mb-2">Research Tips</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                {generateResearchTips(parsedJob).map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Common Questions by Domain */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center space-x-2 mb-6">
          <Target className="h-6 w-6 text-green-600" />
          <h2 className="text-xl font-semibold text-slate-800">Common Questions by Domain</h2>
        </div>

        <div className="mb-6">
          <div className="flex space-x-2">
            {(['technical', 'behavioral', 'hr', 'design'] as const).map((domain) => (
              <button
                key={domain}
                onClick={() => setSelectedDomain(domain)}
                className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors duration-200 ${
                  selectedDomain === domain
                    ? 'bg-green-100 text-green-700'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {domain}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {getDomainQuestions(selectedDomain).map((question, index) => (
            <div key={question.id} className="p-4 border border-slate-200 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-slate-800">{question.text}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  question.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                  question.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {question.difficulty}
                </span>
              </div>
              <p className="text-sm text-slate-600">Category: {question.category}</p>
              {question.expectedAnswerFormat === 'star' && (
                <p className="text-sm text-blue-600 mt-1">💡 Use the STAR method for this question</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Additional Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Salary Negotiation */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <DollarSign className="h-6 w-6 text-yellow-600" />
            <h3 className="text-lg font-semibold text-slate-800">Salary Negotiation Tips</h3>
          </div>
          <ul className="space-y-2 text-sm text-slate-600">
            {salaryNegotiationTips.slice(0, 6).map((tip, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-yellow-600 mt-1">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Body Language Tips */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="h-6 w-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-slate-800">Body Language & Presence</h3>
          </div>
          <ul className="space-y-2 text-sm text-slate-600">
            {bodyLanguageTips.slice(0, 6).map((tip, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Helpful Resources */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center space-x-2 mb-6">
          <BookOpen className="h-6 w-6 text-indigo-600" />
          <h2 className="text-xl font-semibold text-slate-800">Helpful Resources</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-800">Interview Techniques</h3>
            <div className="space-y-2">
              <a
                href="https://www.thebalancemoney.com/what-is-the-star-interview-response-technique-2061629"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm"
              >
                <ExternalLink className="h-4 w-4" />
                <span>STAR Method Guide</span>
              </a>
              <a
                href="https://www.thebalancemoney.com/top-job-interview-questions-2061228"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Top Interview Questions</span>
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-slate-800">Industry-Specific Questions</h3>
            <div className="space-y-2">
              {Object.entries(industryQuestions).map(([industry, questions]) => (
                <div key={industry} className="text-sm">
                  <h4 className="font-medium text-slate-700">{industry}</h4>
                  <ul className="list-disc list-inside text-slate-600 ml-2">
                    {questions.slice(0, 2).map((question, index) => (
                      <li key={index}>{question}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreparationTools;