# 🤖 Interview Preparation Bot

A comprehensive LangGraph-based interview preparation system powered by OpenAI GPT-4, designed to help candidates practice and improve their interview skills across multiple domains.

## 🚀 Features

### Core Functionality
- **🎯 Interview Simulation**: Generate contextual questions based on job descriptions and roles
- **🔄 Dynamic Follow-ups**: AI-powered follow-up questions based on candidate responses
- **⏱️ Time Management**: Built-in countdown timers and time tracking
- **📊 Intelligent Feedback**: Comprehensive answer evaluation with improvement suggestions
- **⭐ STAR Method Validation**: Automatic assessment of behavioral answer structure

### Interview Types
- **💻 Technical**: Programming, system design, algorithms
- **🤝 Behavioral**: STAR method scenarios, teamwork, leadership
- **🏢 HR/General**: Company fit, career goals, motivation
- **🎨 Design**: UX/UI, user research, design thinking
- **🔀 Mixed**: Combination of all types

### Preparation Tools
- **📋 Job Description Parser**: Extract skills, requirements, and generate research tips
- **📚 Question Banks**: Domain-specific question libraries
- **💰 Salary Negotiation**: Guidance and best practices
- **👥 Body Language**: Professional presence tips
- **🏭 Industry-Specific**: Tailored questions by industry

## 🛠️ Technical Architecture

### LangGraph Workflow
The system uses LangGraph to orchestrate a sophisticated interview workflow:

```
Job Description → Session Init → Question Selection → Question Presentation
                                        ↓
Final Results ← Session Finalize ← Completion Check ← Follow-up Generation
                                        ↓
                               Answer Collection → Feedback Generation
```

### Key Components
- **Workflow Engine**: LangGraph-based state management
- **AI Integration**: OpenAI GPT-4 for contextual responses
- **Feedback System**: Multi-criteria answer evaluation
- **Question Bank**: Structured question database
- **Job Parser**: NLP-based job description analysis

## 📦 Installation

### Prerequisites
- Python 3.8+
- OpenAI API key
- (Optional) LangChain API key for tracing

### Setup
1. **Clone the repository**
```bash
git clone <repository-url>
cd interview-prep-bot
```

2. **Install dependencies**
```bash
pip install -r requirements.txt
```

3. **Environment configuration**
```bash
cp .env.example .env
# Edit .env with your API keys
```

4. **Required environment variables**
```env
OPENAI_API_KEY=your_openai_api_key_here
LANGCHAIN_TRACING_V2=true
LANGCHAIN_ENDPOINT=https://api.smith.langchain.com
LANGCHAIN_API_KEY=your_langchain_api_key_here
LANGCHAIN_PROJECT=interview-prep-bot
```

## 🚀 Usage

### Command Line Interface
```bash
python src/cli/interview_cli.py
```

The CLI provides an interactive interview experience with:
- Interview configuration (type, difficulty, question count)
- Job description analysis
- Real-time question presentation
- Answer collection and feedback
- Final performance summary

### Web API
```bash
python src/api/interview_api.py
```

The FastAPI server provides REST endpoints:

#### Start Interview
```bash
POST /interview/start
{
  "job_role": "Software Engineer",
  "difficulty": "intermediate",
  "type": "mixed",
  "question_count": 5,
  "job_description_text": "Optional job description..."
}
```

#### Submit Answer
```bash
POST /interview/answer
{
  "session_id": "session_123",
  "question_id": "tech-001",
  "answer_text": "Your answer here...",
  "time_spent": 120,
  "confidence": 75
}
```

#### Get Results
```bash
GET /interview/{session_id}/results
```

### API Documentation
Visit `http://localhost:8000/docs` for interactive API documentation.

## 📊 Evaluation Metrics

### Question Quality (40%)
- Relevance to job role and industry
- Appropriate difficulty progression
- Comprehensive domain coverage
- Realistic interview scenarios

### Feedback Helpfulness (25%)
- Specific, actionable improvements
- STAR method compliance checking
- Confidence-performance alignment
- Resource recommendations

### Domain Coverage (20%)
- Technical depth across technologies
- Behavioral scenario variety
- HR/cultural fit assessment
- Design thinking evaluation

### User Experience (15%)
- Intuitive interface design
- Smooth workflow transitions
- Clear progress indicators
- Helpful guidance and tips

## 🔧 Architecture Details

### LangGraph Workflow Nodes
- **parse_job_description**: Extract job requirements and skills
- **initialize_session**: Set up interview parameters and question selection
- **select_question**: Choose next question based on context
- **present_question**: Format and present question with helpful context
- **collect_answer**: Gather user response and metadata
- **generate_feedback**: AI-powered answer evaluation
- **generate_followup**: Create contextual follow-up questions
- **check_completion**: Determine workflow continuation
- **finalize_session**: Generate overall assessment

### Data Models
- **InterviewState**: LangGraph state management
- **InterviewSession**: Complete interview context
- **Question**: Structured question with metadata
- **Answer**: User response with timing and confidence
- **Feedback**: Comprehensive evaluation results

## 📚 Resources Integration

The system includes links to helpful resources:
- [STAR Method Guide](https://www.thebalancemoney.com/what-is-the-star-interview-response-technique-2061629)
- [Interview Best Practices](https://www.thebalancemoney.com/top-job-interview-questions-2061228)

## 🧪 Testing

Run the test suite:
```bash
python -m pytest tests/
```

## 📈 Performance Monitoring

The system integrates with LangSmith for:
- Workflow execution tracing
- Performance analytics
- Error monitoring
- Usage statistics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues and questions:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

## 🔮 Future Enhancements

- Video interview simulation
- Voice response analysis
- Industry-specific question expansion
- Multi-language support
- Advanced analytics dashboard
- Integration with job boards
- Mock interviewer personas
- Real-time collaboration features