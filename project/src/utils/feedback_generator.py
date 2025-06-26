from typing import List, Dict, Any
from src.models.interview_models import Answer, Feedback, Question, AnswerFormat

class FeedbackGenerator:
    """Generate detailed feedback for interview answers using AI-powered analysis"""
    
    POSITIVE_KEYWORDS = [
        'experience', 'example', 'result', 'learned', 'improved', 'achieved',
        'implemented', 'developed', 'created', 'solved', 'optimized', 'delivered'
    ]
    
    STAR_KEYWORDS = {
        'situation': ['situation', 'context', 'background', 'project', 'challenge', 'problem'],
        'task': ['task', 'responsibility', 'goal', 'objective', 'assigned', 'needed'],
        'action': ['action', 'did', 'implemented', 'decided', 'approached', 'used', 'created'],
        'result': ['result', 'outcome', 'achieved', 'improved', 'increased', 'decreased', 'learned']
    }
    
    @classmethod
    def generate_feedback(cls, answer: Answer, question: Question) -> Feedback:
        """Generate comprehensive feedback for an answer"""
        text = answer.text.lower()
        word_count = len(answer.text.split())
        
        score = 50  # Base score
        strengths = []
        improvements = []
        suggestions = []
        
        # Analyze answer length
        score, strengths, improvements = cls._analyze_length(
            word_count, score, strengths, improvements
        )
        
        # Analyze content quality
        score, strengths, improvements = cls._analyze_content_quality(
            text, score, strengths, improvements
        )
        
        # STAR method analysis for behavioral questions
        star_compliance = None
        if question.expected_answer_format == AnswerFormat.STAR:
            star_compliance, score, strengths, improvements = cls._analyze_star_method(
                text, score, strengths, improvements
            )
        
        # Analyze confidence alignment
        score, strengths, improvements = cls._analyze_confidence(
            answer.confidence, score, strengths, improvements
        )
        
        # Analyze time management
        score, strengths, improvements = cls._analyze_time_management(
            answer.time_spent, question.time_limit, score, strengths, improvements
        )
        
        # Generate suggestions
        suggestions = cls._generate_suggestions(question.expected_answer_format)
        
        # Ensure score is within bounds
        score = max(0, min(100, score))
        
        # Generate overall assessment
        overall_assessment = cls._generate_overall_assessment(score)
        
        return Feedback(
            score=score,
            strengths=strengths,
            improvements=improvements,
            star_method_compliance=star_compliance,
            suggestions=suggestions,
            overall_assessment=overall_assessment
        )
    
    @classmethod
    def _analyze_length(cls, word_count: int, score: int, strengths: List[str], improvements: List[str]) -> tuple:
        """Analyze answer length appropriateness"""
        if word_count < 20:
            improvements.append('Answer is too brief - provide more detail and examples')
            score -= 15
        elif word_count > 300:
            improvements.append('Answer is too lengthy - focus on key points and be more concise')
            score -= 10
        else:
            strengths.append('Good answer length and detail level')
            score += 10
        
        return score, strengths, improvements
    
    @classmethod
    def _analyze_content_quality(cls, text: str, score: int, strengths: List[str], improvements: List[str]) -> tuple:
        """Analyze the quality of content using keyword analysis"""
        keyword_count = sum(1 for keyword in cls.POSITIVE_KEYWORDS if keyword in text)
        
        if keyword_count >= 3:
            strengths.append('Rich in relevant examples and specific outcomes')
            score += 15
        elif keyword_count >= 1:
            strengths.append('Includes some relevant examples')
            score += 5
        else:
            improvements.append('Add more specific examples and concrete outcomes')
            score -= 10
        
        return score, strengths, improvements
    
    @classmethod
    def _analyze_star_method(cls, text: str, score: int, strengths: List[str], improvements: List[str]) -> tuple:
        """Analyze STAR method compliance"""
        star_score = 0
        for component, keywords in cls.STAR_KEYWORDS.items():
            if any(keyword in text for keyword in keywords):
                star_score += 1
        
        star_compliance = star_score >= 3
        
        if star_compliance:
            strengths.append('Follows STAR method structure effectively')
            score += 20
        else:
            improvements.append('Structure your answer using the STAR method (Situation, Task, Action, Result)')
            score -= 15
        
        return star_compliance, score, strengths, improvements
    
    @classmethod
    def _analyze_confidence(cls, confidence: int, score: int, strengths: List[str], improvements: List[str]) -> tuple:
        """Analyze confidence level alignment with answer quality"""
        if confidence > 80 and score < 60:
            improvements.append('Your confidence level seems higher than your answer quality - practice more or be more realistic')
        elif confidence < 50 and score > 70:
            strengths.append('Your answer quality is good - you can be more confident in your responses')
        
        return score, strengths, improvements
    
    @classmethod
    def _analyze_time_management(cls, time_spent: int, time_limit: int, score: int, strengths: List[str], improvements: List[str]) -> tuple:
        """Analyze time management"""
        if time_spent > time_limit:
            improvements.append('Work on being more concise - practice timing your responses')
        elif time_spent < 30:
            improvements.append('Take more time to think through your answer before responding')
        else:
            strengths.append('Good time management for your response')
        
        return score, strengths, improvements
    
    @classmethod
    def _generate_suggestions(cls, answer_format: AnswerFormat = None) -> List[str]:
        """Generate helpful suggestions"""
        suggestions = [
            'Review common interview questions: https://www.thebalancemoney.com/top-job-interview-questions-2061228',
            'Practice your responses out loud to improve fluency',
            'Research the company and role thoroughly before the interview'
        ]
        
        if answer_format == AnswerFormat.STAR:
            suggestions.insert(0, 'Learn more about the STAR method: https://www.thebalancemoney.com/what-is-the-star-interview-response-technique-2061629')
        
        return suggestions
    
    @classmethod
    def _generate_overall_assessment(cls, score: int) -> str:
        """Generate overall assessment based on score"""
        if score >= 80:
            return 'Excellent response! You demonstrate strong communication skills and relevant experience.'
        elif score >= 60:
            return 'Good response with room for improvement. Focus on the suggested areas to strengthen your answer.'
        elif score >= 40:
            return 'Adequate response but needs significant improvement. Practice with the suggested resources.'
        else:
            return 'Response needs substantial work. Consider practicing more and reviewing interview best practices.'