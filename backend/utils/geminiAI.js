const axios = require('axios');

// Gemini API configuration
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Helper function to call Gemini API
const callGeminiAPI = async (prompt) => {
  const url = `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`;
  
  const data = {
    contents: [
      {
        parts: [
          { text: prompt }
        ]
      }
    ]
  };

  try {
    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const candidateContent = response.data.candidates[0].content;
    let generatedText = '';

    if (candidateContent.text) {
      generatedText = candidateContent.text;
    } else if (candidateContent.parts && candidateContent.parts.length > 0) {
      generatedText = candidateContent.parts.map(p => p.text).join('');
    } else {
      generatedText = '[No generated text found]';
    }

    return generatedText;
  } catch (error) {
    if (error.response) {
      console.error('Gemini API Error:', error.response.status, error.response.data);
      throw new Error(`Gemini API Error: ${error.response.status} - ${error.response.data.error?.message || 'Unknown error'}`);
    } else {
      console.error('Gemini API Error:', error.message);
      throw new Error(`Gemini API Error: ${error.message}`);
    }
  }
};

// Code Generator
const generateCode = async (problemStatement, language = 'javascript') => {
  try {
    const prompt = `
    You are an expert ${language} developer. Please generate clean, efficient code for the following problem:
    
    Problem: ${problemStatement}
    
    Requirements:
    1. Use ${language} programming language
    2. Include proper error handling
    3. Follow best practices and coding standards
    4. Make the code production-ready
    5. Do NOT include any comments, documentation, or JSDoc blocks
    6. Do NOT include example usage or test cases
    7. Do NOT include explanatory text
    8. Return ONLY the pure, executable code
    
    Return ONLY the clean code without any comments, documentation, examples, or additional text.
    `;

    const response = await callGeminiAPI(prompt);
   
    let cleanCode = response;
    
    cleanCode = cleanCode.replace(/```[\s\S]*?\n/g, ''); 
    cleanCode = cleanCode.replace(/```[\s\S]*$/g, ''); 
    cleanCode = cleanCode.replace(/^(javascript|js|python|py|java|cpp|csharp|php|ruby|go|rust|swift)\s*\n?/i, '');
    cleanCode = cleanCode.replace(/\/\*\*[\s\S]*?\*\//g, '');
    cleanCode = cleanCode.replace(/\/\*[\s\S]*?\*\//g, ''); 
    cleanCode = cleanCode.replace(/\/\/.*$/gm, '');
    cleanCode = cleanCode.trim();
    
    if (!cleanCode || cleanCode.length < 10) {
      return `// Code generation failed. Please try again with a more specific problem statement.
// Problem: ${problemStatement}
// Language: ${language}`;
    }
    
    return cleanCode;
  } catch (error) {
    console.error('Code generation error:', error);
    throw new Error('Failed to generate code');
  }
};

// Resume Analyzer
const analyzeResume = async (resumeText) => {
  try {
    const prompt = `
    You are an expert ATS (Applicant Tracking System) analyst and career advisor. Please analyze the following resume and provide detailed feedback:
    
    Resume Content:
    ${resumeText}
    
    Please provide analysis in the following JSON format:
    {
      "atsScore": "score out of 100",
      "strengths": ["list of strengths"],
      "weaknesses": ["list of areas for improvement"],
      "suggestions": ["specific suggestions for improvement"],
      "keywords": ["relevant keywords found"],
      "missingKeywords": ["important keywords that are missing"],
      "sectionAnalysis": {
        "contactInfo": "assessment of contact information",
        "summary": "assessment of professional summary",
        "experience": "assessment of work experience section",
        "education": "assessment of education section",
        "skills": "assessment of skills section",
        "formatting": "assessment of overall formatting"
      },
      "industryRecommendations": ["industry-specific recommendations"],
      "overallAssessment": "brief overall assessment"
    }
    
    Focus on:
    1. ATS compatibility and keyword optimization
    2. Content quality and relevance
    3. Format and structure analysis
    4. Section-by-section breakdown
    5. Industry-specific recommendations
    6. Actionable improvement suggestions
    7. Professional presentation and clarity
    
    Be specific and provide actionable feedback. Return only the JSON response without any additional text.
    `;

    const response = await callGeminiAPI(prompt);
    
    // Try to extract JSON from the response
    try {
      // Look for JSON in the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return JSON.parse(response);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      // Return a structured response if JSON parsing fails
      return {
        atsScore: "Unable to parse",
        strengths: ["Analysis completed but format error occurred"],
        weaknesses: ["Please check the response format"],
        suggestions: ["Try again or contact support"],
        keywords: [],
        missingKeywords: [],
        sectionAnalysis: {
          contactInfo: "Unable to analyze",
          summary: "Unable to analyze",
          experience: "Unable to analyze",
          education: "Unable to analyze",
          skills: "Unable to analyze",
          formatting: "Unable to analyze"
        },
        industryRecommendations: ["Analysis completed but there was a formatting issue"],
        overallAssessment: "Analysis completed but there was a formatting issue with the response."
      };
    }
  } catch (error) {
    console.error('Resume analysis error:', error);
    throw new Error('Failed to analyze resume');
  }
};

// Interview Question Generator
const generateInterviewQuestions = async (resumeText, jobTitle = 'Software Engineer') => {
  try {
    const prompt = `
    You are an expert technical interviewer with 15+ years of experience. Based on the following resume, generate comprehensive and challenging interview questions for a ${jobTitle} position.
    
    Resume Content:
    ${resumeText}
    
    Please provide questions in the following detailed JSON format:
    {
      "technical": [
        {
          "question": "Detailed technical question",
          "difficulty": "easy/medium/hard",
          "category": "specific category (e.g., algorithms, system design, databases, etc.)",
          "expectedAnswer": "brief outline of what a good answer should include",
          "followUpQuestions": ["follow-up question 1", "follow-up question 2"]
        }
      ],
      "behavioral": [
        {
          "question": "Detailed behavioral question",
          "focus": "what specific trait/skill this question assesses",
          "starMethod": "STAR method guidance for answering",
          "redFlags": ["warning signs to watch for"],
          "greenFlags": ["positive indicators to look for"]
        }
      ],
      "projectBased": [
        {
          "question": "Project-specific question",
          "basedOn": "which project/experience this relates to",
          "technicalDepth": "how deep to go technically",
          "businessImpact": "what business value to discuss",
          "challenges": ["specific challenges to explore"]
        }
      ],
      "systemDesign": [
        {
          "question": "System design scenario",
          "scale": "expected scale (users, data, etc.)",
          "constraints": ["key constraints to consider"],
          "components": ["main system components to discuss"],
          "tradeoffs": ["important tradeoffs to analyze"]
        }
      ],
      "coding": [
        {
          "question": "Coding problem description",
          "difficulty": "easy/medium/hard",
          "language": "preferred programming language",
          "approach": "expected problem-solving approach",
          "edgeCases": ["edge cases to consider"],
          "optimization": "optimization opportunities"
        }
      ],
      "tips": [
        {
          "category": "tip category",
          "tip": "specific interview tip",
          "reasoning": "why this tip is important"
        }
      ],
      "redFlags": [
        {
          "category": "warning category",
          "warning": "specific warning sign",
          "why": "why this is concerning"
        }
      ],
      "preparation": [
        {
          "area": "preparation area",
          "suggestion": "specific preparation suggestion",
          "resources": ["helpful resources"]
        }
      ]
    }
    
    Generate questions that are:
    1. Highly relevant to the candidate's specific experience and technologies
    2. Appropriate for the job level and company size
    3. Mix of theoretical knowledge and practical application
    4. Challenging but fair - should test real-world problem-solving
    5. Specific to the technologies, frameworks, and tools mentioned in the resume
    6. Include both breadth and depth questions
    7. Cover both technical skills and soft skills
    8. Include scenario-based questions that test decision-making
    
    Make the questions:
    - Specific and detailed (not generic)
    - Based on actual projects and technologies in the resume
    - Progressive in difficulty (start easy, get harder)
    - Include both conceptual and hands-on questions
    - Test both individual skills and team collaboration
    
    Return only the JSON response without any additional text.
    `;

    const response = await callGeminiAPI(prompt);
    
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return JSON.parse(response);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      return {
        technical: [
          {
            question: "Tell me about a challenging technical problem you solved in your React application.",
            difficulty: "medium",
            category: "frontend development",
            expectedAnswer: "Should include problem identification, solution approach, implementation details, and results",
            followUpQuestions: ["How did you handle state management?", "What performance optimizations did you implement?"]
          }
        ],
        behavioral: [
          {
            question: "Describe a situation where you had to work with a difficult team member on a critical project.",
            focus: "conflict resolution and teamwork",
            starMethod: "Situation: Describe the context. Task: What was your role? Action: What did you do? Result: What was the outcome?",
            redFlags: ["blaming others", "lack of empathy", "no resolution"],
            greenFlags: ["collaborative approach", "positive outcome", "learning experience"]
          }
        ],
        projectBased: [
          {
            question: "Walk me through the architecture of your most recent full-stack project.",
            basedOn: "resume projects",
            technicalDepth: "Discuss frontend, backend, database, deployment, and scalability",
            businessImpact: "How did it benefit users or the business?",
            challenges: ["Technical challenges", "Team coordination", "Timeline management"]
          }
        ],
        systemDesign: [
          {
            question: "Design a scalable web application that can handle 1 million users.",
            scale: "1M users, global distribution",
            constraints: ["Budget limitations", "Time to market", "Technical team size"],
            components: ["Load balancer", "Application servers", "Database", "CDN", "Caching"],
            tradeoffs: ["Consistency vs Availability", "Performance vs Cost", "Simplicity vs Scalability"]
          }
        ],
        coding: [
          {
            question: "Implement a function to find the longest palindromic substring in a string.",
            difficulty: "medium",
            language: "JavaScript",
            approach: "Dynamic programming or expand around center",
            edgeCases: ["Empty string", "Single character", "All same characters"],
            optimization: "Time complexity optimization from O(n³) to O(n²)"
          }
        ],
        tips: [
          {
            category: "Technical Preparation",
            tip: "Review the specific technologies mentioned in your resume thoroughly",
            reasoning: "Interviewers will dive deep into technologies you claim to know"
          }
        ],
        redFlags: [
          {
            category: "Technical Knowledge",
            warning: "Unable to explain basic concepts from their resume",
            why: "Indicates lack of understanding or exaggeration of skills"
          }
        ],
        preparation: [
          {
            area: "System Design",
            suggestion: "Practice designing scalable systems on a whiteboard",
            resources: ["System Design Primer", "Grokking the System Design Interview"]
          }
        ]
      };
    }
  } catch (error) {
    console.error('Interview question generation error:', error);
    throw new Error('Failed to generate interview questions');
  }
};

// Code Review Assistant
const reviewCode = async (code, language = 'javascript') => {
  try {
    const prompt = `
    You are an expert code reviewer. Please review the following ${language} code and provide detailed feedback:
    
    Code:
    ${code}
    
    Please provide review in the following JSON format:
    {
      "overallScore": "score out of 10",
      "strengths": ["list of good practices found"],
      "issues": [
        {
          "type": "error/warning/suggestion",
          "line": "line number or general",
          "description": "description of the issue",
          "suggestion": "how to fix or improve"
        }
      ],
      "securityConcerns": ["any security issues found"],
      "performanceTips": ["performance improvement suggestions"],
      "bestPractices": ["best practices to follow"],
      "overallFeedback": "summary of the review"
    }
    
    Focus on:
    1. Code quality and readability
    2. Security vulnerabilities
    3. Performance optimization
    4. Best practices
    5. Error handling
    
    Return only the JSON response without any additional text.
    `;

    const response = await callGeminiAPI(prompt);
    
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return JSON.parse(response);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      return {
        overallScore: "Unable to parse",
        strengths: ["Code review completed but format error occurred"],
        issues: [],
        securityConcerns: [],
        performanceTips: [],
        bestPractices: [],
        overallFeedback: "Code review completed but there was a formatting issue with the response."
      };
    }
  } catch (error) {
    console.error('Code review error:', error);
    throw new Error('Failed to review code');
  }
};

// Algorithm Explanation
const explainAlgorithm = async (algorithmName, complexity = 'detailed') => {
  try {
    const prompt = `
    You are an expert computer science educator. Please explain the ${algorithmName} algorithm in a ${complexity} manner.
    
    Please provide explanation in the following JSON format:
    {
      "name": "algorithm name",
      "description": "brief description",
      "howItWorks": "step-by-step explanation",
      "pseudocode": "pseudocode representation",
      "timeComplexity": "time complexity analysis",
      "spaceComplexity": "space complexity analysis",
      "useCases": ["when to use this algorithm"],
      "advantages": ["advantages of this algorithm"],
      "disadvantages": ["disadvantages of this algorithm"],
      "example": "simple example with input/output"
    }
    
    Make the explanation:
    1. Clear and easy to understand
    2. Suitable for computer science students
    3. Include practical examples
    4. Cover complexity analysis
    
    Return only the JSON response without any additional text.
    `;

    const response = await callGeminiAPI(prompt);
    
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return JSON.parse(response);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      return {
        name: algorithmName,
        description: "Algorithm explanation completed but format error occurred",
        howItWorks: "Please try again or contact support",
        pseudocode: "",
        timeComplexity: "Unable to parse",
        spaceComplexity: "Unable to parse",
        useCases: [],
        advantages: [],
        disadvantages: [],
        example: "Explanation completed but there was a formatting issue with the response."
      };
    }
  } catch (error) {
    console.error('Algorithm explanation error:', error);
    throw new Error('Failed to explain algorithm');
  }
};

// Learning Roadmap Generator
const generateRoadmap = async (domain, experienceLevel = 'beginner', focusAreas = []) => {
  try {
    const focusAreasText = focusAreas.length > 0 ? `Focus areas: ${focusAreas.join(', ')}` : '';
    
    const prompt = `
    You are an expert tech educator and career advisor. Please create a comprehensive learning roadmap for ${domain} at ${experienceLevel} level. ${focusAreasText}
    
    Please provide roadmap in the following JSON format:
    {
      "domain": "${domain}",
      "experienceLevel": "${experienceLevel}",
      "estimatedDuration": "estimated time to complete",
      "overview": "brief overview of the roadmap",
      "prerequisites": ["required knowledge before starting"],
      "phases": [
        {
          "phase": "Phase 1: Foundation",
          "duration": "estimated duration",
          "description": "what this phase covers",
          "topics": [
            {
              "topic": "topic name",
              "description": "what to learn",
              "resources": ["recommended learning resources"],
              "projects": ["hands-on projects to build"],
              "milestone": "what you should be able to do after this topic"
            }
          ]
        }
      ],
      "advancedTopics": ["topics for advanced learners"],
      "careerPaths": ["possible career paths after completion"],
      "tips": ["learning tips and best practices"],
      "tools": ["essential tools and technologies"],
      "communities": ["recommended communities and forums"]
    }
    
    Make the roadmap:
    1. Structured and progressive
    2. Practical with hands-on projects
    3. Industry-relevant
    4. Suitable for the specified experience level
    5. Include modern tools and technologies
    6. Provide clear milestones and goals
    
    Return only the JSON response without any additional text.
    `;

    const response = await callGeminiAPI(prompt);
    
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return JSON.parse(response);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      return {
        domain: domain,
        experienceLevel: experienceLevel,
        estimatedDuration: "Unable to parse",
        overview: "Roadmap generation completed but format error occurred",
        prerequisites: ["Please try again or contact support"],
        phases: [],
        advancedTopics: [],
        careerPaths: [],
        tips: [],
        tools: [],
        communities: []
      };
    }
  } catch (error) {
    console.error('Roadmap generation error:', error);
    throw new Error('Failed to generate roadmap');
  }
};

// Time Complexity Analyzer
const analyzeTimeComplexity = async (code, language = 'javascript') => {
  try {
    const prompt = `
    You are an expert computer scientist specializing in algorithm analysis and complexity theory. Please analyze the following ${language} code and provide a comprehensive time and space complexity analysis.
    
    Code to analyze:
    ${code}
    
    Please provide analysis in the following detailed JSON format:
    {
      "overview": "brief overview of what the code does",
      "timeComplexity": {
        "bestCase": "O(notation) - explanation",
        "averageCase": "O(notation) - explanation",
        "worstCase": "O(notation) - explanation",
        "detailedAnalysis": "step-by-step analysis of time complexity",
        "factors": ["key factors affecting time complexity"],
        "examples": ["specific examples of input sizes and their impact"]
      },
      "spaceComplexity": {
        "auxiliary": "O(notation) - explanation",
        "total": "O(notation) - explanation",
        "detailedAnalysis": "step-by-step analysis of space complexity",
        "factors": ["key factors affecting space complexity"],
        "memoryUsage": "explanation of memory usage patterns"
      },
      "algorithmAnalysis": {
        "algorithmType": "type of algorithm (e.g., sorting, searching, dynamic programming)",
        "efficiency": "overall efficiency rating (excellent/good/fair/poor)",
        "optimizationOpportunities": ["potential optimizations"],
        "tradeoffs": ["tradeoffs between time and space complexity"],
        "comparison": "comparison with other algorithms for the same problem"
      },
      "codeBreakdown": [
        {
          "line": "line number or section",
          "operation": "what operation is performed",
          "complexity": "O(notation) for this specific operation",
          "explanation": "why this complexity"
        }
      ],
      "optimizationSuggestions": [
        {
          "suggestion": "specific optimization suggestion",
          "impact": "expected impact on complexity",
          "implementation": "how to implement the optimization",
          "tradeoff": "any tradeoffs involved"
        }
      ],
      "realWorldImplications": {
        "scalability": "how well the code scales with input size",
        "performance": "performance characteristics in practice",
        "useCases": ["appropriate use cases for this implementation"],
        "limitations": ["limitations and when to avoid this approach"]
      },
      "visualization": {
        "complexityGraph": "description of how complexity grows with input size",
        "comparisonChart": "comparison with other complexity classes"
      }
    }
    
    Analysis Guidelines:
    1. Be thorough and accurate in complexity analysis
    2. Consider all loops, nested structures, and recursive calls
    3. Account for data structure operations (array access, object lookup, etc.)
    4. Include both time and space complexity
    5. Provide practical examples and implications
    6. Suggest optimizations where applicable
    7. Compare with alternative approaches
    8. Consider edge cases and worst scenarios
    
    Return only the JSON response without any additional text.
    `;

    const response = await callGeminiAPI(prompt);
    
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return JSON.parse(response);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      return generateFallbackAnalysis(code, language);
    }
  } catch (error) {
    console.error('Time complexity analysis error:', error);
    
    // Check if it's a Gemini API error (503, 429, etc.)
    if (error.message && (error.message.includes('503') || error.message.includes('429') || error.message.includes('UNAVAILABLE'))) {
      console.log('Gemini API temporarily unavailable, using fallback analysis');
      return generateFallbackAnalysis(code, language);
    }
    
    throw new Error('Failed to analyze time complexity');
  }
};

// Fallback analysis function when Gemini API is unavailable
const generateFallbackAnalysis = (code, language) => {
  // Basic complexity analysis based on code patterns
  const codeLines = code.split('\n').filter(line => line.trim().length > 0);
  const hasNestedLoops = (code.match(/for|while|forEach/g) || []).length > 1;
  const hasRecursion = code.includes('function') && code.includes('(') && code.includes(')') && code.includes('return');
  const hasArrayOperations = code.includes('[') && code.includes(']');
  const hasObjectOperations = code.includes('{') && code.includes('}');
  
  // More sophisticated pattern detection
  const loopPatterns = code.match(/for\s*\([^)]*\)|while\s*\([^)]*\)|forEach\s*\([^)]*\)/g) || [];
  const nestedLoopCount = loopPatterns.length;
  const hasSorting = code.toLowerCase().includes('sort') || code.toLowerCase().includes('bubble') || code.toLowerCase().includes('quick') || code.toLowerCase().includes('merge');
  const hasSearching = code.toLowerCase().includes('search') || code.toLowerCase().includes('find') || code.toLowerCase().includes('indexof');
  const hasBinarySearch = code.toLowerCase().includes('binary') && code.toLowerCase().includes('search');
  const hasDynamicProgramming = code.toLowerCase().includes('memo') || code.toLowerCase().includes('dp') || code.toLowerCase().includes('cache');
  const hasTreeTraversal = code.toLowerCase().includes('tree') || code.toLowerCase().includes('node') || code.toLowerCase().includes('traverse');
  const hasGraphAlgo = code.toLowerCase().includes('graph') || code.toLowerCase().includes('bfs') || code.toLowerCase().includes('dfs');
  
  // Determine algorithm type based on code patterns
  let algorithmType = 'General Algorithm';
  if (hasSorting) algorithmType = 'Sorting Algorithm';
  else if (hasBinarySearch) algorithmType = 'Binary Search Algorithm';
  else if (hasSearching) algorithmType = 'Search Algorithm';
  else if (hasDynamicProgramming) algorithmType = 'Dynamic Programming Algorithm';
  else if (hasTreeTraversal) algorithmType = 'Tree Traversal Algorithm';
  else if (hasGraphAlgo) algorithmType = 'Graph Algorithm';
  else if (hasRecursion) algorithmType = 'Recursive Algorithm';
  else if (nestedLoopCount > 1) algorithmType = 'Nested Loop Algorithm';
  
  // Estimate complexity based on patterns
  let timeComplexity = 'O(n)';
  let spaceComplexity = 'O(1)';
  let efficiency = 'Good';
  
  if (hasBinarySearch) {
    timeComplexity = 'O(log n)';
    efficiency = 'Excellent';
  } else if (hasSorting) {
    if (code.toLowerCase().includes('bubble')) {
      timeComplexity = 'O(n²)';
      efficiency = 'Poor';
    } else if (code.toLowerCase().includes('quick') || code.toLowerCase().includes('merge')) {
      timeComplexity = 'O(n log n)';
      efficiency = 'Good';
    } else {
      timeComplexity = 'O(n log n)';
      efficiency = 'Good';
    }
  } else if (nestedLoopCount > 1) {
    timeComplexity = 'O(n²)';
    efficiency = 'Fair';
  } else if (hasRecursion) {
    timeComplexity = 'O(2ⁿ)';
    spaceComplexity = 'O(n)';
    efficiency = 'Poor';
  } else if (hasDynamicProgramming) {
    timeComplexity = 'O(n²)';
    spaceComplexity = 'O(n²)';
    efficiency = 'Good';
  } else if (hasTreeTraversal || hasGraphAlgo) {
    timeComplexity = 'O(V + E)';
    spaceComplexity = 'O(V)';
    efficiency = 'Good';
  }
  
  // Generate more detailed analysis
  const detailedTimeAnalysis = generateDetailedTimeAnalysis(code, timeComplexity, nestedLoopCount, hasRecursion);
  const detailedSpaceAnalysis = generateDetailedSpaceAnalysis(code, spaceComplexity, hasRecursion, hasDynamicProgramming);
  
  return {
    overview: `This appears to be a ${algorithmType.toLowerCase()} written in ${language}. The code contains ${codeLines.length} lines of logic with ${nestedLoopCount} loop structures.`,
    timeComplexity: {
      bestCase: `${timeComplexity} - Best case scenario`,
      averageCase: `${timeComplexity} - Average case scenario`,
      worstCase: `${timeComplexity} - Worst case scenario`,
      detailedAnalysis: detailedTimeAnalysis,
      factors: ['Input size', nestedLoopCount > 1 ? 'Nested iterations' : 'Single iterations', hasRecursion ? 'Recursive depth' : 'Iterative approach'],
      examples: ['Small input (n=10): Fast execution', 'Medium input (n=1000): Moderate performance', 'Large input (n=100000): May be slow']
    },
    spaceComplexity: {
      auxiliary: `${spaceComplexity} - Additional space required`,
      total: `${spaceComplexity} - Total space complexity`,
      detailedAnalysis: detailedSpaceAnalysis,
      factors: ['Input storage', hasRecursion ? 'Call stack' : 'Variables', 'Temporary data structures'],
      memoryUsage: `Memory usage is ${spaceComplexity === 'O(1)' ? 'constant' : spaceComplexity === 'O(n)' ? 'linear' : 'quadratic'} with respect to input size.`
    },
    algorithmAnalysis: {
      algorithmType: algorithmType,
      efficiency: efficiency,
      optimizationOpportunities: generateOptimizationSuggestions(algorithmType, timeComplexity, hasRecursion, nestedLoopCount),
      tradeoffs: [
        'Time vs Space complexity tradeoffs',
        'Readability vs Performance',
        'Memory usage vs Speed'
      ],
      comparison: `This implementation is ${efficiency.toLowerCase()} compared to optimized versions of similar algorithms.`
    },
    codeBreakdown: generateCodeBreakdown(code, timeComplexity, nestedLoopCount),
    optimizationSuggestions: generateOptimizationSuggestions(algorithmType, timeComplexity, hasRecursion, nestedLoopCount),
    realWorldImplications: {
      scalability: `This algorithm ${efficiency === 'Poor' ? 'does not scale well' : efficiency === 'Excellent' ? 'scales very well' : 'scales moderately well'} with large inputs.`,
      performance: `Performance is ${efficiency.toLowerCase()} for typical use cases.`,
      useCases: generateUseCases(algorithmType, efficiency),
      limitations: generateLimitations(algorithmType, efficiency, timeComplexity)
    },
    visualization: {
      complexityGraph: `The complexity grows ${timeComplexity === 'O(1)' ? 'constantly' : timeComplexity === 'O(log n)' ? 'logarithmically' : timeComplexity === 'O(n)' ? 'linearly' : timeComplexity === 'O(n log n)' ? 'linearithmically' : timeComplexity === 'O(n²)' ? 'quadratically' : 'exponentially'} with input size.`,
      comparisonChart: `Compared to optimal solutions, this is ${efficiency.toLowerCase()} in terms of both time and space complexity.`
    }
  };
};

// Helper functions for more detailed analysis
const generateDetailedTimeAnalysis = (code, timeComplexity, nestedLoopCount, hasRecursion) => {
  let analysis = `Based on code analysis, this algorithm has ${timeComplexity} time complexity. `;
  
  if (nestedLoopCount > 1) {
    analysis += `Nested loops detected (${nestedLoopCount} loop structures). `;
  }
  if (hasRecursion) {
    analysis += `Recursive calls detected. `;
  }
  if (code.toLowerCase().includes('sort')) {
    analysis += `Sorting algorithm identified. `;
  }
  if (code.toLowerCase().includes('search')) {
    analysis += `Search algorithm identified. `;
  }
  
  analysis += `The algorithm processes the input data through ${nestedLoopCount || 1} iteration${nestedLoopCount !== 1 ? 's' : ''}.`;
  
  return analysis;
};

const generateDetailedSpaceAnalysis = (code, spaceComplexity, hasRecursion, hasDynamicProgramming) => {
  let analysis = `The algorithm uses ${spaceComplexity} space complexity. `;
  
  if (hasRecursion) {
    analysis += `Recursive call stack contributes to space usage. `;
  }
  if (hasDynamicProgramming) {
    analysis += `Dynamic programming table/memoization requires additional space. `;
  }
  if (spaceComplexity === 'O(1)') {
    analysis += `Minimal additional space required.`;
  } else {
    analysis += `Space usage grows with input size.`;
  }
  
  return analysis;
};

const generateOptimizationSuggestions = (algorithmType, timeComplexity, hasRecursion, nestedLoopCount) => {
  const suggestions = [];
  
  if (timeComplexity === 'O(n²)' && nestedLoopCount > 1) {
    suggestions.push({
      suggestion: 'Reduce nested loops',
      impact: 'Can improve time complexity from O(n²) to O(n log n)',
      implementation: 'Use more efficient algorithms or data structures',
      tradeoff: 'May increase code complexity'
    });
  }
  
  if (hasRecursion) {
    suggestions.push({
      suggestion: 'Implement memoization',
      impact: 'Can reduce time complexity from exponential to polynomial',
      implementation: 'Cache results of recursive calls',
      tradeoff: 'Uses more memory'
    });
  }
  
  if (algorithmType.includes('Sorting')) {
    suggestions.push({
      suggestion: 'Use built-in sorting',
      impact: 'Leverage optimized language implementations',
      implementation: 'Use language-specific sort methods',
      tradeoff: 'Less control over algorithm'
    });
  }
  
  return suggestions;
};

const generateCodeBreakdown = (code, timeComplexity, nestedLoopCount) => {
  const breakdown = [
    {
      line: '1',
      operation: 'Code initialization',
      complexity: 'O(1)',
      explanation: 'Constant time setup operations'
    }
  ];
  
  if (nestedLoopCount > 0) {
    breakdown.push({
      line: '2',
      operation: `Main algorithm logic (${nestedLoopCount} loop${nestedLoopCount !== 1 ? 's' : ''})`,
      complexity: timeComplexity,
      explanation: `Main computational complexity: ${timeComplexity}`
    });
  }
  
  return breakdown;
};

const generateUseCases = (algorithmType, efficiency) => {
  const useCases = [];
  
  if (efficiency === 'Excellent' || efficiency === 'Good') {
    useCases.push('Production applications');
    useCases.push('Large-scale data processing');
  }
  
  useCases.push('Small to medium-sized datasets');
  useCases.push('Prototyping and development');
  useCases.push('Educational purposes');
  
  if (algorithmType.includes('Sorting')) {
    useCases.push('Data organization');
    useCases.push('Database operations');
  }
  
  if (algorithmType.includes('Search')) {
    useCases.push('Information retrieval');
    useCases.push('Lookup operations');
  }
  
  return useCases;
};

const generateLimitations = (algorithmType, efficiency, timeComplexity) => {
  const limitations = [];
  
  if (efficiency === 'Poor') {
    limitations.push('May be slow for large inputs');
    limitations.push('Not suitable for production use with large datasets');
  }
  
  if (timeComplexity === 'O(n²)' || timeComplexity === 'O(2ⁿ)') {
    limitations.push('Poor scalability with large inputs');
  }
  
  limitations.push('Memory usage could be optimized');
  limitations.push('Consider using built-in language functions');
  
  return limitations;
};

// ATS-Friendly Resume Generator
const generateATSResume = async (originalResume, analysis, targetJobTitle = 'Software Engineer') => {
  try {
    const prompt = `
    You are an expert ATS (Applicant Tracking System) optimization specialist. Your task is to improve the user's resume while PRESERVING their exact format, template, and structure. Only edit the text content to make it more ATS-friendly and impactful.

    Original Resume (PRESERVE THIS EXACT FORMAT):
    ${originalResume}

    Analysis Feedback:
    ${JSON.stringify(analysis, null, 2)}

    Target Job Title: ${targetJobTitle}

    IMPORTANT INSTRUCTIONS:
    1. KEEP the exact same format, layout, and structure as the original
    2. KEEP the same section headers and organization
    3. KEEP the same spacing, indentation, and visual layout
    4. ONLY improve the text content within each section
    5. Add missing keywords from the analysis
    6. Quantify achievements where possible
    7. Use stronger action verbs
    8. Make descriptions more specific and impactful
    9. Ensure ATS compatibility while maintaining readability

    Please provide the improved resume in the following JSON format:
    {
      "improvedResume": "The complete improved resume with exact same format as original but with enhanced content",
      "changesMade": [
        {
          "section": "section name",
          "originalText": "original text that was changed",
          "improvedText": "improved version of the text",
          "reason": "why this change was made"
        }
      ],
      "atsOptimization": {
        "keywordDensity": "analysis of keyword optimization",
        "formattingScore": "score out of 100",
        "readabilityScore": "score out of 100",
        "improvements": ["list of specific improvements made"],
        "estimatedATSScore": "estimated new ATS score"
      },
      "summary": "Brief summary of what was improved while maintaining the original format"
    }

    Content Improvement Guidelines:
    1. Replace generic verbs with strong action verbs (e.g., "did" → "implemented", "worked on" → "developed")
    2. Add specific numbers and metrics where possible (e.g., "improved performance" → "improved performance by 40%")
    3. Include relevant keywords from the job title and industry
    4. Make achievements more specific and measurable
    5. Use industry-standard terminology
    6. Ensure all information is accurate and verifiable
    7. Maintain professional tone throughout

    Format Preservation Rules:
    1. Keep exact same section order
    2. Keep exact same headers and subheaders
    3. Keep exact same bullet point structure
    4. Keep exact same spacing and indentation
    5. Keep exact same contact information format
    6. Keep exact same date formats
    7. Keep exact same company/location format
    8. Only change the descriptive text within each section

    Return only the JSON response without any additional text.
    `;

    const response = await callGeminiAPI(prompt);
    
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return JSON.parse(response);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      return {
        improvedResume: originalResume,
        changesMade: [
          {
            section: "General",
            originalText: "Resume optimization failed",
            improvedText: "Please try again or contact support",
            reason: "Format parsing error occurred"
          }
        ],
        atsOptimization: {
          keywordDensity: "Unable to analyze",
          formattingScore: "0",
          readabilityScore: "0",
          improvements: ["Please try again or contact support"],
          estimatedATSScore: "0"
        },
        summary: "Resume optimization completed but there was a formatting issue with the response."
      };
    }
  } catch (error) {
    console.error('ATS resume generation error:', error);
    throw new Error('Failed to generate ATS-optimized resume');
  }
};

module.exports = {
  generateCode,
  analyzeResume,
  generateInterviewQuestions,
  reviewCode,
  explainAlgorithm,
  generateRoadmap,
  generateATSResume,
  analyzeTimeComplexity
}; 