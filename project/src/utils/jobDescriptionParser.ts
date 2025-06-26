import { JobDescription } from '../types';

export const parseJobDescription = (description: string): JobDescription => {
  const text = description.toLowerCase();
  
  // Extract skills - common tech skills
  const skillKeywords = [
    'javascript', 'typescript', 'react', 'vue', 'angular', 'node.js', 'python',
    'java', 'c++', 'c#', 'go', 'rust', 'swift', 'kotlin', 'php', 'ruby',
    'html', 'css', 'sass', 'bootstrap', 'tailwind', 'sql', 'mongodb',
    'postgresql', 'mysql', 'redis', 'docker', 'kubernetes', 'aws', 'azure',
    'gcp', 'git', 'jenkins', 'terraform', 'ansible', 'microservices',
    'rest', 'graphql', 'websockets', 'oauth', 'jwt', 'testing', 'jest',
    'cypress', 'selenium', 'agile', 'scrum', 'kanban', 'jira', 'confluence',
    'figma', 'sketch', 'adobe', 'photoshop', 'illustrator', 'ux', 'ui',
    'design thinking', 'user research', 'wireframing', 'prototyping'
  ];

  const extractedSkills = skillKeywords.filter(skill => 
    text.includes(skill.replace('.', ''))
  );

  // Extract experience level
  const experienceMatch = text.match(/(\d+)\+?\s*years?\s*(of\s*)?experience/);
  const experience = experienceMatch ? `${experienceMatch[1]}+ years` : 'Not specified';

  // Determine industry based on keywords
  let industry = 'Technology';
  if (text.includes('finance') || text.includes('banking')) industry = 'Finance';
  else if (text.includes('healthcare') || text.includes('medical')) industry = 'Healthcare';
  else if (text.includes('retail') || text.includes('ecommerce')) industry = 'Retail';
  else if (text.includes('education') || text.includes('edtech')) industry = 'Education';
  else if (text.includes('marketing') || text.includes('advertising')) industry = 'Marketing';

  // Extract title (first line or first sentence)
  const titleMatch = description.split('\n')[0] || description.split('.')[0];
  const title = titleMatch.length > 100 ? 'Software Engineer' : titleMatch;

  // Extract company (look for common patterns)
  const companyMatch = description.match(/at\s+([A-Z][a-zA-Z\s&]+)/);
  const company = companyMatch ? companyMatch[1].trim() : 'TechCorp';

  return {
    title: title.trim(),
    company: company,
    skills: extractedSkills,
    experience,
    description,
    industry
  };
};

export const generateResearchTips = (job: JobDescription): string[] => {
  const tips = [
    `Research ${job.company}'s recent news, product launches, and company culture`,
    `Study the ${job.industry} industry trends and challenges`,
    `Prepare examples demonstrating your experience with: ${job.skills.join(', ')}`,
    `Review the job requirements and match them to your background`,
    `Prepare questions about the team structure and growth opportunities`
  ];

  // Industry-specific tips
  if (job.industry === 'Finance') {
    tips.push('Understand regulatory compliance requirements', 'Study fintech trends and security protocols');
  } else if (job.industry === 'Healthcare') {
    tips.push('Learn about HIPAA and patient data privacy', 'Research healthcare technology trends');
  } else if (job.industry === 'Retail') {
    tips.push('Understand e-commerce trends and customer experience', 'Study omnichannel retail strategies');
  }

  return tips;
};