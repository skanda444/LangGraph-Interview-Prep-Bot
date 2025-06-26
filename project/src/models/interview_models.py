from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum

class DifficultyLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"

class InterviewType(str, Enum):
    TECHNICAL = "technical"
    BEHAVIORAL = "behavioral"
    HR = "hr"
    DESIGN = "design"
    MIXED = "mixed"

class AnswerFormat(str, Enum):
    STAR = "star"
    TECHNICAL = "technical"
    GENERAL = "general"

class Question(BaseModel):
    id: str
    text: str
    type: InterviewType
    difficulty: DifficultyLevel
    category: str
    follow_up_prompts: Optional[List[str]] = []
    time_limit: int = 300  # seconds
    expected_answer_format: Optional[AnswerFormat] = None

class JobDescription(BaseModel):
    title: str
    company: str
    skills: List[str]
    experience: str
    description: str
    industry: str

class Answer(BaseModel):
    question_id: str
    text: str
    time_spent: int
    confidence: int
    timestamp: datetime = Field(default_factory=datetime.now)

class Feedback(BaseModel):
    score: int = Field(ge=0, le=100)
    strengths: List[str]
    improvements: List[str]
    star_method_compliance: Optional[bool] = None
    suggestions: List[str]
    overall_assessment: str

class InterviewSession(BaseModel):
    id: str
    job_role: str
    difficulty: DifficultyLevel
    type: InterviewType
    questions: List[Question]
    current_question_index: int = 0
    answers: List[Answer] = []
    start_time: datetime = Field(default_factory=datetime.now)
    end_time: Optional[datetime] = None
    score: Optional[float] = None

class InterviewState(BaseModel):
    """State object for LangGraph workflow"""
    session: Optional[InterviewSession] = None
    current_question: Optional[Question] = None
    current_answer: Optional[Answer] = None
    feedback: Optional[Feedback] = None
    job_description: Optional[JobDescription] = None
    user_input: str = ""
    workflow_step: str = "start"
    context: Dict[str, Any] = Field(default_factory=dict)