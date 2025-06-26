import re
from typing import List, Dict
from src.models.interview_models import JobDescription

class JobDescriptionParser:
    """Parse job descriptions and extract relevant information"""
    
    SKILL_KEYWORDS = [
        'javascript', 'typescript', 'react', 'vue', 'angular', 'node.js', 'python',
        'java', 'c++', 'c#', 'go', 'rust', 'swift', 'kotlin', 'php', 'ruby',
        'html', 'css', 'sass', 'bootstrap', 'tailwind', 'sql', 'mongodb',
        'postgresql', 'mysql', 'redis', 'docker', 'kubernetes', 'aws', 'azure',
        'gcp', 'git', 'jenkins', 'terraform', 'ansible', 'microservices',
        'rest', 'graphql', 'websockets', 'oauth', 'jwt', 'testing', 'jest',
        'cypress', 'selenium', 'agile', 'scrum', 'kanban', 'jira', 'confluence',
        'figma', 'sketch', 'adobe', 'photoshop', 'illustrator', 'ux', 'ui',
        'design thinking', 'user research', 'wireframing', 'prototyping'
    ]
    
    INDUSTRY_KEYWORDS = {
        'Technology': ['tech', 'software', 'saas', 'startup', 'ai', 'ml'],
        'Finance': ['finance', 'banking', 'fintech', 'investment', 'trading'],
        'Healthcare': ['healthcare', 'medical', 'pharma', 'biotech', 'health'],
        'Retail': ['retail', 'ecommerce', 'e-commerce', 'shopping', 'consumer'],
        'Education': ['education', 'edtech', 'learning', 'university', 'school'],
        'Marketing': ['marketing', 'advertising', 'digital marketing', 'seo', 'sem']
    }
    
    @classmethod
    def parse(cls, description: str) -> JobDescription:
        """Parse a job description and extract structured information"""
        text_lower = description.lower()
        
        # Extract skills
        skills = cls._extract_skills(text_lower)
        
        # Extract experience level
        experience = cls._extract_experience(text_lower)
        
        # Determine industry
        industry = cls._determine_industry(text_lower)
        
        # Extract title and company (simplified extraction)
        title, company = cls._extract_title_company(description)
        
        return JobDescription(
            title=title,
            company=company,
            skills=skills,
            experience=experience,
            description=description,
            industry=industry
        )
    
    @classmethod
    def _extract_skills(cls, text: str) -> List[str]:
        """Extract technical skills from job description"""
        found_skills = []
        for skill in cls.SKILL_KEYWORDS:
            if skill.replace('.', '') in text:
                found_skills.append(skill)
        return found_skills
    
    @classmethod
    def _extract_experience(cls, text: str) -> str:
        """Extract experience requirements"""
        experience_patterns = [
            r'(\d+)\+?\s*years?\s*(of\s*)?experience',
            r'(\d+)\+?\s*years?\s*in',
            r'minimum\s*(\d+)\s*years?',
            r'at least\s*(\d+)\s*years?'
        ]
        
        for pattern in experience_patterns:
            match = re.search(pattern, text)
            if match:
                return f"{match.group(1)}+ years"
        
        return "Not specified"
    
    @classmethod
    def _determine_industry(cls, text: str) -> str:
        """Determine industry based on keywords"""
        for industry, keywords in cls.INDUSTRY_KEYWORDS.items():
            if any(keyword in text for keyword in keywords):
                return industry
        return "Technology"  # Default
    
    @classmethod
    def _extract_title_company(cls, description: str) -> tuple:
        """Extract job title and company name"""
        lines = description.split('\n')
        first_line = lines[0].strip() if lines else ""
        
        # Simple heuristic for title extraction
        title = first_line if len(first_line) < 100 else "Software Engineer"
        
        # Look for company name patterns
        company_match = re.search(r'at\s+([A-Z][a-zA-Z\s&]+)', description)
        company = company_match.group(1).strip() if company_match else "TechCorp"
        
        return title, company
    
    @classmethod
    def generate_research_tips(cls, job: JobDescription) -> List[str]:
        """Generate research tips based on job description"""
        tips = [
            f"Research {job.company}'s recent news, product launches, and company culture",
            f"Study the {job.industry} industry trends and challenges",
            f"Prepare examples demonstrating your experience with: {', '.join(job.skills[:5])}",
            "Review the job requirements and match them to your background",
            "Prepare questions about the team structure and growth opportunities"
        ]
        
        # Industry-specific tips
        if job.industry == 'Finance':
            tips.extend([
                'Understand regulatory compliance requirements',
                'Study fintech trends and security protocols'
            ])
        elif job.industry == 'Healthcare':
            tips.extend([
                'Learn about HIPAA and patient data privacy',
                'Research healthcare technology trends'
            ])
        elif job.industry == 'Retail':
            tips.extend([
                'Understand e-commerce trends and customer experience',
                'Study omnichannel retail strategies'
            ])
        
        return tips