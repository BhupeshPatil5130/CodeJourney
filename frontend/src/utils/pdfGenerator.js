import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// PDF Generation Utility
export const generateResumePDF = async (resumeContent, originalFormat = 'text') => {
  try {
    // Create a temporary container to render the resume
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '210mm'; // A4 width
    container.style.backgroundColor = 'white';
    container.style.padding = '20mm';
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.fontSize = '12px';
    container.style.lineHeight = '1.4';
    container.style.color = '#000';
    
    // Apply resume formatting based on content analysis
    const formattedContent = formatResumeForPDF(resumeContent);
    container.innerHTML = formattedContent;
    
    // Add to DOM temporarily
    document.body.appendChild(container);
    
    // Generate PDF
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794, // A4 width in pixels at 96 DPI
      height: container.scrollHeight
    });
    
    // Remove temporary container
    document.body.removeChild(container);
    
    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');
    
    // Calculate dimensions
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth - 20; // 10mm margin on each side
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Add image to PDF
    pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
    
    return pdf;
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate PDF');
  }
};

// Format resume content for PDF with proper styling
const formatResumeForPDF = (content) => {
  // Split content into sections
  const lines = content.split('\n');
  let formattedHTML = '<div style="font-family: Arial, sans-serif; line-height: 1.4; color: #333; max-width: 100%;">';
  
  // Analyze the original formatting
  const formatting = analyzeResumeFormatting(lines);
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (!line) {
      formattedHTML += '<br>';
      continue;
    }
    
    // Apply formatting based on analysis
    const formattedLine = formatLine(line, formatting, i, lines);
    formattedHTML += formattedLine;
  }
  
  formattedHTML += '</div>';
  return formattedHTML;
};

// Analyze the original resume formatting
const analyzeResumeFormatting = (lines) => {
  const formatting = {
    hasHeader: false,
    hasSummary: false,
    sectionHeaders: [],
    bulletPoints: [],
    contactInfo: [],
    jobTitles: [],
    companyNames: [],
    education: [],
    skills: []
  };
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (isSectionHeader(line)) {
      formatting.sectionHeaders.push({ line, index: i });
    } else if (isContactInfo(line)) {
      formatting.contactInfo.push({ line, index: i });
    } else if (isJobTitle(line)) {
      formatting.jobTitles.push({ line, index: i });
    } else if (isCompanyName(line)) {
      formatting.companyNames.push({ line, index: i });
    } else if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
      formatting.bulletPoints.push({ line, index: i });
    }
  }
  
  return formatting;
};

// Format individual line based on analysis
const formatLine = (line, formatting, index, allLines) => {
  // Check if this is a name/title line (usually first line)
  if (index === 0 && !isContactInfo(line) && !isSectionHeader(line)) {
    return `<h1 style="font-size: 24px; font-weight: bold; color: #2c3e50; margin: 0 0 10px 0; text-align: center;">${line}</h1>`;
  }
  
  // Check if this is a job title line
  if (isJobTitle(line)) {
    return `<h3 style="font-size: 16px; font-weight: bold; color: #34495e; margin: 15px 0 5px 0;">${line}</h3>`;
  }
  
  // Check if this is a company name line
  if (isCompanyName(line)) {
    return `<p style="font-size: 14px; font-style: italic; color: #7f8c8d; margin: 5px 0;">${line}</p>`;
  }
  
  // Check if this is a section header
  if (isSectionHeader(line)) {
    return `<h2 style="font-size: 18px; font-weight: bold; color: #2c3e50; margin: 20px 0 10px 0; border-bottom: 2px solid #3498db; padding-bottom: 5px;">${line}</h2>`;
  }
  
  // Check if this is a bullet point
  if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
    const bulletChar = line.charAt(0);
    const content = line.substring(1).trim();
    return `<p style="margin: 5px 0 5px 20px; text-indent: -20px; line-height: 1.5;">${bulletChar} ${content}</p>`;
  }
  
  // Check if this is contact information
  if (isContactInfo(line)) {
    return `<p style="font-size: 12px; color: #7f8c8d; margin: 3px 0; text-align: center;">${line}</p>`;
  }
  
  // Check if this looks like a date range
  if (isDateRange(line)) {
    return `<p style="font-size: 12px; color: #7f8c8d; margin: 5px 0; text-align: right;">${line}</p>`;
  }
  
  // Check if this is a skill list
  if (isSkillList(line)) {
    return `<p style="font-size: 13px; margin: 3px 0; color: #2c3e50;">${line}</p>`;
  }
  
  // Regular content
  return `<p style="margin: 5px 0; line-height: 1.5;">${line}</p>`;
};

// Additional helper functions
const isDateRange = (line) => {
  const datePatterns = [
    /^\d{4}\s*-\s*\d{4}$/, // 2020 - 2024
    /^\d{4}\s*-\s*Present$/, // 2020 - Present
    /^[A-Za-z]+\s+\d{4}\s*-\s*[A-Za-z]+\s+\d{4}$/, // Jan 2020 - Dec 2024
    /^[A-Za-z]+\s+\d{4}\s*-\s*Present$/, // Jan 2020 - Present
    /^\d{1,2}\/\d{4}\s*-\s*\d{1,2}\/\d{4}$/, // 01/2020 - 12/2024
  ];
  
  return datePatterns.some(pattern => pattern.test(line.trim()));
};

const isSkillList = (line) => {
  const skillPatterns = [
    /^[A-Za-z\s,]+$/, // Simple skill list
    /^[A-Za-z\s,]+:\s*[A-Za-z\s,]+$/, // Skills: JavaScript, React
    /^[A-Za-z\s]+\([A-Za-z\s]+\)/, // Skill (Level)
  ];
  
  return skillPatterns.some(pattern => pattern.test(line.trim())) && 
         line.length > 10 && line.length < 200;
};

// Helper functions to detect different types of content
const isSectionHeader = (line) => {
  const sectionHeaders = [
    'EXPERIENCE', 'WORK EXPERIENCE', 'EMPLOYMENT HISTORY',
    'EDUCATION', 'ACADEMIC BACKGROUND',
    'SKILLS', 'TECHNICAL SKILLS', 'COMPETENCIES',
    'PROJECTS', 'PROJECT EXPERIENCE',
    'CERTIFICATIONS', 'CERTIFICATES',
    'AWARDS', 'ACHIEVEMENTS',
    'SUMMARY', 'PROFESSIONAL SUMMARY', 'OBJECTIVE',
    'LANGUAGES', 'LANGUAGE SKILLS',
    'VOLUNTEER', 'VOLUNTEER EXPERIENCE',
    'INTERESTS', 'HOBBIES'
  ];
  
  const upperLine = line.toUpperCase();
  return sectionHeaders.some(header => upperLine.includes(header)) || 
         (line.length < 50 && /^[A-Z\s]+$/.test(line));
};

const isJobTitle = (line) => {
  const jobTitlePatterns = [
    /(Senior|Junior|Lead|Principal|Staff|Associate|Assistant)\s+\w+/i,
    /(Engineer|Developer|Manager|Analyst|Specialist|Coordinator|Consultant|Director|Officer|Administrator)/i,
    /(Software|Frontend|Backend|Full Stack|Data|DevOps|Product|UI\/UX|QA|System|Cloud|Mobile|Machine Learning|Cybersecurity)/i
  ];
  
  return jobTitlePatterns.some(pattern => pattern.test(line)) && line.length < 100;
};

const isCompanyName = (line) => {
  const companyPatterns = [
    /(Inc\.|LLC|Ltd\.|Corp\.|Company|Co\.)/i,
    /(Technologies|Technology|Solutions|Systems|Services|Group|Team)/i
  ];
  
  return companyPatterns.some(pattern => pattern.test(line)) || 
         (line.length < 50 && /^[A-Z][a-z]+/.test(line));
};

const isContactInfo = (line) => {
  const contactPatterns = [
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Email
    /^[\+]?[1-9][\d]{0,15}$/, // Phone number
    /^https?:\/\//, // URL
    /linkedin\.com/i,
    /github\.com/i,
    /^[A-Za-z\s]+,\s*[A-Za-z\s]+$/, // City, State
    /^[A-Za-z\s]+,\s*[A-Z]{2}$/ // City, State abbreviation
  ];
  
  return contactPatterns.some(pattern => pattern.test(line));
};

// Download PDF function
export const downloadResumePDF = async (resumeContent, filename = 'improved-resume.pdf') => {
  try {
    const pdf = await generateResumePDF(resumeContent);
    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('PDF download error:', error);
    throw error;
  }
};

// Generate PDF from HTML element (for more complex layouts)
export const generatePDFFromElement = async (elementId, filename = 'resume.pdf') => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }
    
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: element.scrollWidth,
      height: element.scrollHeight
    });
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
    pdf.save(filename);
    
    return true;
  } catch (error) {
    console.error('PDF generation from element error:', error);
    throw error;
  }
};

// Generate PDF that preserves original PDF formatting
export const generatePDFWithOriginalFormatting = async (originalPDFBuffer, improvedContent) => {
  try {
    // This would require more advanced PDF manipulation libraries
    // For now, we'll use the enhanced formatting approach
    return await generateResumePDF(improvedContent, 'pdf');
  } catch (error) {
    console.error('PDF with original formatting error:', error);
    throw new Error('Failed to generate PDF with original formatting');
  }
};

// Enhanced PDF generation with better formatting preservation
export const generateEnhancedResumePDF = async (resumeContent, originalFormat = 'text') => {
  try {
    // Create a temporary container with enhanced styling
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '210mm'; // A4 width
    container.style.backgroundColor = 'white';
    container.style.padding = '20mm';
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.fontSize = '12px';
    container.style.lineHeight = '1.4';
    container.style.color = '#000';
    container.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
    
    // Apply enhanced resume formatting
    const formattedContent = formatResumeForPDF(resumeContent);
    container.innerHTML = formattedContent;
    
    // Add to DOM temporarily
    document.body.appendChild(container);
    
    // Generate PDF with higher quality
    const canvas = await html2canvas(container, {
      scale: 3, // Higher resolution
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794, // A4 width in pixels at 96 DPI
      height: container.scrollHeight,
      logging: false,
      imageTimeout: 0
    });
    
    // Remove temporary container
    document.body.removeChild(container);
    
    // Create PDF with better quality
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png', 1.0);
    
    // Calculate dimensions
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth - 20; // 10mm margin on each side
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Add image to PDF
    pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
    
    return pdf;
  } catch (error) {
    console.error('Enhanced PDF generation error:', error);
    throw new Error('Failed to generate enhanced PDF');
  }
};

// Download enhanced PDF function
export const downloadEnhancedResumePDF = async (resumeContent, filename = 'improved-resume.pdf') => {
  try {
    const pdf = await generateEnhancedResumePDF(resumeContent);
    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('Enhanced PDF download error:', error);
    throw error;
  }
}; 