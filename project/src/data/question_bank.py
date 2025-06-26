from typing import List, Dict
from src.models.interview_models import Question, InterviewType, DifficultyLevel, AnswerFormat

QUESTION_BANK: List[Question] = [
    # Technical Questions - Beginner
    Question(
        id="tech-001",
        text="Explain the difference between let, const, and var in JavaScript.",
        type=InterviewType.TECHNICAL,
        difficulty=DifficultyLevel.BEGINNER,
        category="JavaScript",
        time_limit=180,
        expected_answer_format=AnswerFormat.TECHNICAL,
        follow_up_prompts=[
            "Can you provide examples of when you would use each?",
            "What happens with hoisting in each case?"
        ]
    ),
    Question(
        id="tech-002",
        text="What is the difference between == and === in JavaScript?",
        type=InterviewType.TECHNICAL,
        difficulty=DifficultyLevel.BEGINNER,
        category="JavaScript",
        time_limit=120,
        expected_answer_format=AnswerFormat.TECHNICAL
    ),
    Question(
        id="tech-003",
        text="Explain what a REST API is and its key principles.",
        type=InterviewType.TECHNICAL,
        difficulty=DifficultyLevel.BEGINNER,
        category="Web Development",
        time_limit=240,
        expected_answer_format=AnswerFormat.TECHNICAL
    ),

    # Technical Questions - Intermediate
    Question(
        id="tech-101",
        text="Implement a function to reverse a linked list.",
        type=InterviewType.TECHNICAL,
        difficulty=DifficultyLevel.INTERMEDIATE,
        category="Data Structures",
        time_limit=300,
        expected_answer_format=AnswerFormat.TECHNICAL,
        follow_up_prompts=[
            "Can you do this iteratively and recursively?",
            "What's the time and space complexity?"
        ]
    ),
    Question(
        id="tech-102",
        text="Explain the concept of closures in JavaScript with examples.",
        type=InterviewType.TECHNICAL,
        difficulty=DifficultyLevel.INTERMEDIATE,
        category="JavaScript",
        time_limit=300,
        expected_answer_format=AnswerFormat.TECHNICAL
    ),
    Question(
        id="tech-103",
        text="How would you optimize a slow database query?",
        type=InterviewType.TECHNICAL,
        difficulty=DifficultyLevel.INTERMEDIATE,
        category="Database",
        time_limit=360,
        expected_answer_format=AnswerFormat.TECHNICAL
    ),

    # Technical Questions - Advanced
    Question(
        id="tech-201",
        text="Design a system to handle millions of concurrent users for a social media platform.",
        type=InterviewType.TECHNICAL,
        difficulty=DifficultyLevel.ADVANCED,
        category="System Design",
        time_limit=600,
        expected_answer_format=AnswerFormat.TECHNICAL,
        follow_up_prompts=[
            "How would you handle data consistency?",
            "What about caching strategies?",
            "How would you scale the database?"
        ]
    ),
    Question(
        id="tech-202",
        text="Implement a distributed cache with consistent hashing.",
        type=InterviewType.TECHNICAL,
        difficulty=DifficultyLevel.ADVANCED,
        category="System Design",
        time_limit=900,
        expected_answer_format=AnswerFormat.TECHNICAL
    ),

    # Behavioral Questions
    Question(
        id="behav-001",
        text="Tell me about a time when you had to work with a difficult team member.",
        type=InterviewType.BEHAVIORAL,
        difficulty=DifficultyLevel.INTERMEDIATE,
        category="Teamwork",
        time_limit=240,
        expected_answer_format=AnswerFormat.STAR,
        follow_up_prompts=[
            "What was the outcome?",
            "What would you do differently?",
            "How did this experience change your approach to teamwork?"
        ]
    ),
    Question(
        id="behav-002",
        text="Describe a situation where you had to learn a new technology quickly.",
        type=InterviewType.BEHAVIORAL,
        difficulty=DifficultyLevel.BEGINNER,
        category="Learning",
        time_limit=180,
        expected_answer_format=AnswerFormat.STAR
    ),
    Question(
        id="behav-003",
        text="Tell me about a time when you made a mistake at work and how you handled it.",
        type=InterviewType.BEHAVIORAL,
        difficulty=DifficultyLevel.INTERMEDIATE,
        category="Problem Solving",
        time_limit=240,
        expected_answer_format=AnswerFormat.STAR
    ),
    Question(
        id="behav-004",
        text="Describe a time when you had to meet a tight deadline.",
        type=InterviewType.BEHAVIORAL,
        difficulty=DifficultyLevel.BEGINNER,
        category="Time Management",
        time_limit=180,
        expected_answer_format=AnswerFormat.STAR
    ),

    # HR Questions
    Question(
        id="hr-001",
        text="Why do you want to work for our company?",
        type=InterviewType.HR,
        difficulty=DifficultyLevel.BEGINNER,
        category="Motivation",
        time_limit=120,
        follow_up_prompts=[
            "What specifically attracts you to our mission?",
            "How do you see yourself contributing to our goals?"
        ]
    ),
    Question(
        id="hr-002",
        text="Where do you see yourself in 5 years?",
        type=InterviewType.HR,
        difficulty=DifficultyLevel.BEGINNER,
        category="Career Goals",
        time_limit=120
    ),
    Question(
        id="hr-003",
        text="What are your salary expectations?",
        type=InterviewType.HR,
        difficulty=DifficultyLevel.INTERMEDIATE,
        category="Compensation",
        time_limit=90
    ),
    Question(
        id="hr-004",
        text="Why are you leaving your current job?",
        type=InterviewType.HR,
        difficulty=DifficultyLevel.INTERMEDIATE,
        category="Career Change",
        time_limit=120
    ),

    # Design Questions
    Question(
        id="design-001",
        text="How would you improve the user experience of our mobile app?",
        type=InterviewType.DESIGN,
        difficulty=DifficultyLevel.INTERMEDIATE,
        category="UX Design",
        time_limit=300,
        follow_up_prompts=[
            "What research methods would you use?",
            "How would you measure success?"
        ]
    ),
    Question(
        id="design-002",
        text="Design a dashboard for a project management tool.",
        type=InterviewType.DESIGN,
        difficulty=DifficultyLevel.ADVANCED,
        category="UI Design",
        time_limit=480
    ),
    Question(
        id="design-003",
        text="How would you conduct user research for a new feature?",
        type=InterviewType.DESIGN,
        difficulty=DifficultyLevel.INTERMEDIATE,
        category="User Research",
        time_limit=240
    )
]

def get_questions_by_type(interview_type: InterviewType, difficulty: DifficultyLevel = None) -> List[Question]:
    """Get questions filtered by type and optionally by difficulty"""
    questions = QUESTION_BANK
    
    if interview_type != InterviewType.MIXED:
        questions = [q for q in questions if q.type == interview_type]
    
    if difficulty:
        questions = [q for q in questions if q.difficulty == difficulty]
    
    return questions

def get_questions_by_skills(skills: List[str]) -> List[Question]:
    """Get questions that match the provided skills"""
    relevant_questions = []
    skills_lower = [skill.lower() for skill in skills]
    
    for question in QUESTION_BANK:
        if any(skill in question.category.lower() or skill in question.text.lower() 
               for skill in skills_lower):
            relevant_questions.append(question)
    
    return relevant_questions