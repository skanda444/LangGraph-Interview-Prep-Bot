#!/usr/bin/env python3
"""
Command-line interface for the Interview Preparation Bot
"""
import asyncio
import os
import sys
from typing import Dict, Any
from dotenv import load_dotenv

# Add src to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from src.workflows.interview_workflow import InterviewWorkflow
from src.models.interview_models import InterviewType, DifficultyLevel
from src.utils.job_parser import JobDescriptionParser

load_dotenv()

class InterviewCLI:
    """Command-line interface for interview preparation"""
    
    def __init__(self):
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        if not self.openai_api_key:
            print("❌ Error: OPENAI_API_KEY environment variable is required")
            sys.exit(1)
        
        self.workflow = InterviewWorkflow(self.openai_api_key)
        self.current_session = None
    
    def print_banner(self):
        """Print welcome banner"""
        print("=" * 60)
        print("🤖 INTERVIEW PREPARATION BOT")
        print("   Powered by LangGraph & OpenAI GPT-4")
        print("=" * 60)
        print()
    
    def get_user_input(self, prompt: str, options: list = None) -> str:
        """Get user input with optional validation"""
        while True:
            try:
                response = input(f"{prompt}: ").strip()
                if options and response not in options:
                    print(f"Please choose from: {', '.join(options)}")
                    continue
                return response
            except KeyboardInterrupt:
                print("\n👋 Goodbye!")
                sys.exit(0)
    
    def configure_interview(self) -> Dict[str, Any]:
        """Configure interview parameters"""
        print("📋 INTERVIEW CONFIGURATION")
        print("-" * 30)
        
        # Job role
        job_role = self.get_user_input("Enter job role (default: Software Engineer)") or "Software Engineer"
        
        # Interview type
        print("\nInterview Types:")
        print("1. Technical")
        print("2. Behavioral") 
        print("3. HR/General")
        print("4. Design")
        print("5. Mixed (All types)")
        
        type_choice = self.get_user_input("Choose interview type (1-5)", ["1", "2", "3", "4", "5"])
        type_map = {
            "1": "technical",
            "2": "behavioral", 
            "3": "hr",
            "4": "design",
            "5": "mixed"
        }
        interview_type = type_map[type_choice]
        
        # Difficulty
        print("\nDifficulty Levels:")
        print("1. Beginner")
        print("2. Intermediate")
        print("3. Advanced")
        
        diff_choice = self.get_user_input("Choose difficulty (1-3)", ["1", "2", "3"])
        diff_map = {"1": "beginner", "2": "intermediate", "3": "advanced"}
        difficulty = diff_map[diff_choice]
        
        # Number of questions
        question_count = int(self.get_user_input("Number of questions (default: 5)") or "5")
        
        # Job description (optional)
        job_desc = None
        if self.get_user_input("Do you have a job description to analyze? (y/n)", ["y", "n"]) == "y":
            print("\nPaste the job description (press Enter twice when done):")
            lines = []
            while True:
                line = input()
                if line == "" and lines and lines[-1] == "":
                    break
                lines.append(line)
            job_desc = "\n".join(lines[:-1])  # Remove last empty line
        
        return {
            "session_config": {
                "job_role": job_role,
                "type": interview_type,
                "difficulty": difficulty,
                "question_count": question_count
            },
            "job_description_text": job_desc
        }
    
    def display_question(self, question, presentation: str = None):
        """Display interview question"""
        print("\n" + "=" * 60)
        print(f"📝 QUESTION ({question.type.upper()} - {question.difficulty.upper()})")
        print("=" * 60)
        print(f"\n{question.text}")
        
        if presentation:
            print(f"\n💡 Context: {presentation}")
        
        if question.expected_answer_format == "star":
            print("\n⭐ TIP: Use the STAR method (Situation, Task, Action, Result)")
        
        if question.time_limit:
            print(f"\n⏰ Suggested time limit: {question.time_limit // 60} minutes")
        
        print("\n" + "-" * 60)
    
    def collect_answer(self) -> tuple:
        """Collect user's answer"""
        print("Type your answer (press Enter twice when done):")
        lines = []
        while True:
            line = input()
            if line == "" and lines and lines[-1] == "":
                break
            lines.append(line)
        
        answer_text = "\n".join(lines[:-1])  # Remove last empty line
        
        # Get confidence level
        while True:
            try:
                confidence = int(self.get_user_input("Rate your confidence (1-100)"))
                if 1 <= confidence <= 100:
                    break
                print("Please enter a number between 1 and 100")
            except ValueError:
                print("Please enter a valid number")
        
        return answer_text, confidence
    
    def display_feedback(self, feedback):
        """Display feedback for an answer"""
        print("\n" + "=" * 60)
        print(f"📊 FEEDBACK - Score: {feedback.score}/100")
        print("=" * 60)
        
        if feedback.strengths:
            print("\n✅ STRENGTHS:")
            for strength in feedback.strengths:
                print(f"  • {strength}")
        
        if feedback.improvements:
            print("\n🔧 AREAS FOR IMPROVEMENT:")
            for improvement in feedback.improvements:
                print(f"  • {improvement}")
        
        if feedback.star_method_compliance is not None:
            status = "✅ Yes" if feedback.star_method_compliance else "❌ No"
            print(f"\n⭐ STAR Method Compliance: {status}")
        
        print(f"\n📝 OVERALL ASSESSMENT:")
        print(f"   {feedback.overall_assessment}")
        
        if feedback.suggestions:
            print(f"\n💡 HELPFUL RESOURCES:")
            for suggestion in feedback.suggestions:
                print(f"  • {suggestion}")
        
        print("\n" + "-" * 60)
    
    def display_final_results(self, session):
        """Display final interview results"""
        print("\n" + "=" * 60)
        print("🎯 FINAL INTERVIEW RESULTS")
        print("=" * 60)
        
        if session.score:
            print(f"\n📊 Overall Score: {session.score:.1f}/100")
        
        print(f"📝 Questions Answered: {len(session.answers)}/{len(session.questions)}")
        print(f"⏱️  Total Time: {(session.end_time - session.start_time).total_seconds() / 60:.1f} minutes")
        
        # Score breakdown
        print(f"\n📈 SCORE BREAKDOWN:")
        for i, answer in enumerate(session.answers):
            question = session.questions[i]
            print(f"  Q{i+1}: {answer.feedback.score}/100 - {question.category}")
        
        # Performance summary
        scores = [answer.feedback.score for answer in session.answers]
        avg_score = sum(scores) / len(scores)
        
        print(f"\n🎯 PERFORMANCE SUMMARY:")
        if avg_score >= 80:
            print("   🌟 Excellent! You're well-prepared for interviews.")
        elif avg_score >= 60:
            print("   👍 Good performance with room for improvement.")
        elif avg_score >= 40:
            print("   📚 Keep practicing - you're on the right track.")
        else:
            print("   💪 Focus on fundamentals and practice more.")
        
        print("\n" + "=" * 60)
    
    async def run_interview(self):
        """Run the complete interview process"""
        self.print_banner()
        
        # Configure interview
        config = self.configure_interview()
        
        print("\n🚀 Starting interview...")
        
        # Run workflow
        try:
            state = self.workflow.run_interview(config)
            
            if not state.session:
                print("❌ Failed to initialize interview session")
                return
            
            session = state.session
            print(f"\n✅ Interview initialized with {len(session.questions)} questions")
            
            # Process each question
            for i, question in enumerate(session.questions):
                print(f"\n📍 Question {i+1} of {len(session.questions)}")
                
                # Display question
                presentation = state.context.get("question_presentation", "")
                self.display_question(question, presentation)
                
                # Collect answer
                answer_text, confidence = self.collect_answer()
                
                # Create answer object and generate feedback
                from src.models.interview_models import Answer
                from src.utils.feedback_generator import FeedbackGenerator
                
                answer = Answer(
                    question_id=question.id,
                    text=answer_text,
                    time_spent=120,  # Placeholder
                    confidence=confidence
                )
                
                feedback = FeedbackGenerator.generate_feedback(answer, question)
                answer.feedback = feedback
                
                # Display feedback
                self.display_feedback(feedback)
                
                # Add to session
                session.answers.append(answer)
                
                # Ask if user wants to continue
                if i < len(session.questions) - 1:
                    if self.get_user_input("Continue to next question? (y/n)", ["y", "n"]) == "n":
                        break
            
            # Finalize session
            from datetime import datetime
            session.end_time = datetime.now()
            if session.answers:
                session.score = sum(a.feedback.score for a in session.answers) / len(session.answers)
            
            # Display final results
            self.display_final_results(session)
            
        except Exception as e:
            print(f"❌ Error during interview: {str(e)}")
            return
    
    def run(self):
        """Main entry point"""
        asyncio.run(self.run_interview())

def main():
    """Main function"""
    cli = InterviewCLI()
    cli.run()

if __name__ == "__main__":
    main()