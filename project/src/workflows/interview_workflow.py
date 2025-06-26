from typing import Dict, Any, List
from langgraph.graph import StateGraph, END
from langchain_core.messages import HumanMessage, AIMessage
from langchain_openai import ChatOpenAI
import random
from datetime import datetime

from src.models.interview_models import (
    InterviewState, InterviewSession, Question, Answer, 
    InterviewType, DifficultyLevel
)
from src.data.question_bank import get_questions_by_type, get_questions_by_skills
from src.utils.feedback_generator import FeedbackGenerator
from src.utils.job_parser import JobDescriptionParser

class InterviewWorkflow:
    """LangGraph-based interview workflow"""
    
    def __init__(self, openai_api_key: str):
        self.llm = ChatOpenAI(
            api_key=openai_api_key,
            model="gpt-4",
            temperature=0.7
        )
        self.workflow = self._build_workflow()
    
    def _build_workflow(self) -> StateGraph:
        """Build the LangGraph workflow"""
        workflow = StateGraph(InterviewState)
        
        # Add nodes
        workflow.add_node("parse_job_description", self._parse_job_description)
        workflow.add_node("initialize_session", self._initialize_session)
        workflow.add_node("select_question", self._select_question)
        workflow.add_node("present_question", self._present_question)
        workflow.add_node("collect_answer", self._collect_answer)
        workflow.add_node("generate_feedback", self._generate_feedback)
        workflow.add_node("generate_followup", self._generate_followup)
        workflow.add_node("check_completion", self._check_completion)
        workflow.add_node("finalize_session", self._finalize_session)
        
        # Add edges
        workflow.add_edge("parse_job_description", "initialize_session")
        workflow.add_edge("initialize_session", "select_question")
        workflow.add_edge("select_question", "present_question")
        workflow.add_edge("present_question", "collect_answer")
        workflow.add_edge("collect_answer", "generate_feedback")
        workflow.add_edge("generate_feedback", "generate_followup")
        workflow.add_edge("generate_followup", "check_completion")
        
        # Conditional edges
        workflow.add_conditional_edges(
            "check_completion",
            self._should_continue,
            {
                "continue": "select_question",
                "end": "finalize_session"
            }
        )
        workflow.add_edge("finalize_session", END)
        
        # Set entry point
        workflow.set_entry_point("parse_job_description")
        
        return workflow.compile()
    
    def _parse_job_description(self, state: InterviewState) -> InterviewState:
        """Parse job description if provided"""
        if "job_description_text" in state.context:
            job_desc = JobDescriptionParser.parse(state.context["job_description_text"])
            state.job_description = job_desc
            state.context["research_tips"] = JobDescriptionParser.generate_research_tips(job_desc)
        
        state.workflow_step = "job_parsed"
        return state
    
    def _initialize_session(self, state: InterviewState) -> InterviewState:
        """Initialize interview session"""
        session_config = state.context.get("session_config", {})
        
        session = InterviewSession(
            id=f"session_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            job_role=session_config.get("job_role", "Software Engineer"),
            difficulty=DifficultyLevel(session_config.get("difficulty", "intermediate")),
            type=InterviewType(session_config.get("type", "mixed")),
            questions=[]
        )
        
        # Select questions based on job description or session config
        if state.job_description and state.job_description.skills:
            questions = get_questions_by_skills(state.job_description.skills)
        else:
            questions = get_questions_by_type(session.type, session.difficulty)
        
        # Shuffle and limit questions
        random.shuffle(questions)
        session.questions = questions[:session_config.get("question_count", 5)]
        
        state.session = session
        state.workflow_step = "session_initialized"
        return state
    
    def _select_question(self, state: InterviewState) -> InterviewState:
        """Select the next question"""
        if not state.session:
            raise ValueError("Session not initialized")
        
        if state.session.current_question_index < len(state.session.questions):
            state.current_question = state.session.questions[state.session.current_question_index]
            state.workflow_step = "question_selected"
        else:
            state.workflow_step = "interview_complete"
        
        return state
    
    def _present_question(self, state: InterviewState) -> InterviewState:
        """Present question to user with context"""
        if not state.current_question:
            return state
        
        # Generate contextual question presentation using LLM
        prompt = f"""
        Present this interview question in a professional and engaging way:
        
        Question: {state.current_question.text}
        Type: {state.current_question.type}
        Difficulty: {state.current_question.difficulty}
        Category: {state.current_question.category}
        
        Provide any helpful context or tips for answering this question.
        If this is a behavioral question, remind about the STAR method.
        """
        
        response = self.llm.invoke([HumanMessage(content=prompt)])
        state.context["question_presentation"] = response.content
        state.workflow_step = "question_presented"
        
        return state
    
    def _collect_answer(self, state: InterviewState) -> InterviewState:
        """Collect user's answer"""
        # In a real implementation, this would collect user input
        # For now, we'll use the user_input from state
        if not state.current_question:
            return state
        
        answer = Answer(
            question_id=state.current_question.id,
            text=state.user_input,
            time_spent=state.context.get("time_spent", 120),
            confidence=state.context.get("confidence", 70)
        )
        
        state.current_answer = answer
        state.workflow_step = "answer_collected"
        
        return state
    
    def _generate_feedback(self, state: InterviewState) -> InterviewState:
        """Generate AI-powered feedback"""
        if not state.current_answer or not state.current_question:
            return state
        
        # Generate feedback using our feedback generator
        feedback = FeedbackGenerator.generate_feedback(
            state.current_answer, 
            state.current_question
        )
        
        # Enhance feedback with LLM
        prompt = f"""
        Enhance this interview feedback with more personalized insights:
        
        Question: {state.current_question.text}
        Answer: {state.current_answer.text}
        Current Score: {feedback.score}
        Current Strengths: {', '.join(feedback.strengths)}
        Current Improvements: {', '.join(feedback.improvements)}
        
        Provide additional specific, actionable feedback that would help this candidate improve.
        """
        
        response = self.llm.invoke([HumanMessage(content=prompt)])
        feedback.overall_assessment = response.content
        
        state.current_answer.feedback = feedback
        state.feedback = feedback
        state.workflow_step = "feedback_generated"
        
        return state
    
    def _generate_followup(self, state: InterviewState) -> InterviewState:
        """Generate contextual follow-up questions"""
        if not state.current_question or not state.current_answer:
            return state
        
        # Use LLM to generate intelligent follow-ups
        prompt = f"""
        Based on this interview answer, generate 2-3 relevant follow-up questions:
        
        Original Question: {state.current_question.text}
        Candidate's Answer: {state.current_answer.text}
        
        Generate follow-up questions that would help assess the candidate's depth of knowledge
        and experience related to their answer.
        """
        
        response = self.llm.invoke([HumanMessage(content=prompt)])
        state.context["followup_questions"] = response.content
        
        # Add answer to session
        if state.session:
            state.session.answers.append(state.current_answer)
            state.session.current_question_index += 1
        
        state.workflow_step = "followup_generated"
        return state
    
    def _check_completion(self, state: InterviewState) -> InterviewState:
        """Check if interview should continue"""
        if not state.session:
            state.workflow_step = "interview_complete"
            return state
        
        if state.session.current_question_index >= len(state.session.questions):
            state.workflow_step = "interview_complete"
        else:
            state.workflow_step = "continue_interview"
        
        return state
    
    def _should_continue(self, state: InterviewState) -> str:
        """Determine if interview should continue"""
        return "continue" if state.workflow_step == "continue_interview" else "end"
    
    def _finalize_session(self, state: InterviewState) -> InterviewState:
        """Finalize interview session with overall assessment"""
        if not state.session:
            return state
        
        state.session.end_time = datetime.now()
        
        # Calculate overall score
        if state.session.answers:
            total_score = sum(answer.feedback.score for answer in state.session.answers)
            state.session.score = total_score / len(state.session.answers)
        
        # Generate overall session feedback using LLM
        prompt = f"""
        Generate an overall interview assessment based on these answers:
        
        Job Role: {state.session.job_role}
        Number of Questions: {len(state.session.questions)}
        Average Score: {state.session.score:.1f}
        
        Individual Scores: {[answer.feedback.score for answer in state.session.answers]}
        
        Provide a comprehensive assessment of the candidate's performance,
        highlighting key strengths and areas for improvement.
        """
        
        response = self.llm.invoke([HumanMessage(content=prompt)])
        state.context["overall_assessment"] = response.content
        
        state.workflow_step = "session_finalized"
        return state
    
    def run_interview(self, config: Dict[str, Any]) -> InterviewState:
        """Run the complete interview workflow"""
        initial_state = InterviewState(
            context=config,
            workflow_step="start"
        )
        
        final_state = self.workflow.invoke(initial_state)
        return final_state