from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import os
from dotenv import load_dotenv

from src.workflows.interview_workflow import InterviewWorkflow
from src.models.interview_models import InterviewSession, Question, Answer, Feedback
from src.data.question_bank import get_questions_by_type, QUESTION_BANK
from src.utils.job_parser import JobDescriptionParser

load_dotenv()

app = FastAPI(title="Interview Preparation Bot API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize workflow
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY environment variable is required")

interview_workflow = InterviewWorkflow(OPENAI_API_KEY)

# Request/Response models
class InterviewConfigRequest(BaseModel):
    job_role: str = "Software Engineer"
    difficulty: str = "intermediate"
    type: str = "mixed"
    question_count: int = 5
    job_description_text: Optional[str] = None

class AnswerRequest(BaseModel):
    session_id: str
    question_id: str
    answer_text: str
    time_spent: int
    confidence: int

class SessionResponse(BaseModel):
    session_id: str
    current_question: Optional[Question]
    question_presentation: Optional[str]
    progress: Dict[str, Any]

# In-memory storage (in production, use a proper database)
active_sessions: Dict[str, InterviewSession] = {}

@app.get("/")
async def root():
    return {"message": "Interview Preparation Bot API", "version": "1.0.0"}

@app.get("/questions")
async def get_questions(type: str = "mixed", difficulty: str = None):
    """Get available questions by type and difficulty"""
    try:
        from src.models.interview_models import InterviewType, DifficultyLevel
        
        interview_type = InterviewType(type)
        diff_level = DifficultyLevel(difficulty) if difficulty else None
        
        questions = get_questions_by_type(interview_type, diff_level)
        return {"questions": questions}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/interview/start")
async def start_interview(config: InterviewConfigRequest):
    """Start a new interview session"""
    try:
        # Prepare configuration for workflow
        workflow_config = {
            "session_config": {
                "job_role": config.job_role,
                "difficulty": config.difficulty,
                "type": config.type,
                "question_count": config.question_count
            }
        }
        
        if config.job_description_text:
            workflow_config["job_description_text"] = config.job_description_text
        
        # Run workflow to initialize session
        state = interview_workflow.run_interview(workflow_config)
        
        if not state.session:
            raise HTTPException(status_code=500, detail="Failed to initialize session")
        
        # Store session
        active_sessions[state.session.id] = state.session
        
        return SessionResponse(
            session_id=state.session.id,
            current_question=state.current_question,
            question_presentation=state.context.get("question_presentation"),
            progress={
                "current_index": state.session.current_question_index,
                "total_questions": len(state.session.questions),
                "completed": len(state.session.answers)
            }
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/interview/answer")
async def submit_answer(answer_request: AnswerRequest):
    """Submit an answer and get feedback"""
    try:
        session = active_sessions.get(answer_request.session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # Find the question
        question = next(
            (q for q in session.questions if q.id == answer_request.question_id),
            None
        )
        if not question:
            raise HTTPException(status_code=404, detail="Question not found")
        
        # Create answer and generate feedback
        from src.utils.feedback_generator import FeedbackGenerator
        
        answer = Answer(
            question_id=answer_request.question_id,
            text=answer_request.answer_text,
            time_spent=answer_request.time_spent,
            confidence=answer_request.confidence
        )
        
        feedback = FeedbackGenerator.generate_feedback(answer, question)
        answer.feedback = feedback
        
        # Add to session
        session.answers.append(answer)
        session.current_question_index += 1
        
        # Get next question if available
        next_question = None
        if session.current_question_index < len(session.questions):
            next_question = session.questions[session.current_question_index]
        
        return {
            "feedback": feedback,
            "next_question": next_question,
            "progress": {
                "current_index": session.current_question_index,
                "total_questions": len(session.questions),
                "completed": len(session.answers)
            },
            "is_complete": session.current_question_index >= len(session.questions)
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/interview/{session_id}/results")
async def get_interview_results(session_id: str):
    """Get final interview results"""
    try:
        session = active_sessions.get(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        if not session.answers:
            raise HTTPException(status_code=400, detail="No answers submitted yet")
        
        # Calculate overall score
        total_score = sum(answer.feedback.score for answer in session.answers)
        average_score = total_score / len(session.answers)
        
        return {
            "session": session,
            "overall_score": average_score,
            "total_questions": len(session.questions),
            "answered_questions": len(session.answers),
            "detailed_feedback": [
                {
                    "question": next(q for q in session.questions if q.id == answer.question_id),
                    "answer": answer,
                    "feedback": answer.feedback
                }
                for answer in session.answers
            ]
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/job-description/parse")
async def parse_job_description(request: Dict[str, str]):
    """Parse a job description and extract information"""
    try:
        description = request.get("description", "")
        if not description:
            raise HTTPException(status_code=400, detail="Description is required")
        
        parsed_job = JobDescriptionParser.parse(description)
        research_tips = JobDescriptionParser.generate_research_tips(parsed_job)
        
        return {
            "job_info": parsed_job,
            "research_tips": research_tips
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/resources")
async def get_resources():
    """Get helpful interview preparation resources"""
    return {
        "star_method": "https://www.thebalancemoney.com/what-is-the-star-interview-response-technique-2061629",
        "interview_questions": "https://www.thebalancemoney.com/top-job-interview-questions-2061228",
        "salary_negotiation_tips": [
            "Research industry standards and company salary ranges before negotiating",
            "Consider the total compensation package, not just base salary",
            "Practice your negotiation conversation beforehand",
            "Be prepared to justify your salary request with specific examples",
            "Know your minimum acceptable offer before starting negotiations"
        ],
        "body_language_tips": [
            "Maintain good eye contact - shows confidence and engagement",
            "Sit up straight with shoulders back - projects professionalism",
            "Use open gestures - avoid crossing arms or fidgeting",
            "Mirror the interviewer's energy level appropriately",
            "Smile genuinely when appropriate - shows enthusiasm"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)