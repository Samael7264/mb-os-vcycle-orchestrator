import { GoogleGenAI, Type, Schema } from "@google/genai";
import { QualityReportData, RiskLevel, TestFile } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const MODEL_FLASH = 'gemini-3-flash-preview';
const MODEL_PRO = 'gemini-3-pro-preview';

/**
 * Generates a text summary based on inputs.
 */
export const generateSummary = async (
  folder: string,
  type: string,
  includeDiagrams: boolean,
  includeSnippets: boolean,
  contextOverride: string
): Promise<string> => {
  const prompt = `
    You are a senior technical documentation engineer.
    Generate a ${type} summary for a codebase module located in "${folder}".
    
    Context/Code to analyze:
    ${contextOverride || "No specific code provided. Please generate a realistic, high-quality simulated summary for a hypothetical enterprise module of this name."}

    Requirements:
    - Include Diagrams: ${includeDiagrams} (Use mermaid text representation if yes)
    - Include Code Snippets: ${includeSnippets}
    - Format: Markdown
    - Tone: Professional, Enterprise
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_FLASH,
      contents: prompt,
    });
    return response.text || "No summary generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating summary. Please check your API key or try again.";
  }
};

/**
 * Generates test cases returning structured JSON.
 */
export const generateTestCases = async (
  folder: string,
  testType: string,
  language: string,
  framework: string,
  targetCoverage: number
): Promise<TestFile[]> => {
  const prompt = `
    You are a QA automation architect.
    Generate ${testType} test cases for a hypothetical ${language} module named "${folder}" using the ${framework} framework.
    Target coverage is ${targetCoverage}%.

    Output a JSON object with a "files" array. Each item should have "name" (filename) and "code" (full source code).
    Create at least 2 distinct test files.
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      files: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            code: { type: Type.STRING }
          },
          required: ["name", "code"]
        }
      }
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_FLASH,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    const json = JSON.parse(response.text || '{"files": []}');
    return json.files;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return [
      { name: "error.log", code: "// Failed to generate tests.\n// Error: " + error }
    ];
  }
};

/**
 * Analyzes quality and returns structured JSON report.
 */
export const analyzeQuality = async (
  folder: string,
  reportContent: string,
  branchCoverage: boolean,
  mutationScore: boolean
): Promise<QualityReportData> => {
  const prompt = `
    Analyze the following test coverage data/context for module "${folder}".
    Context: ${reportContent || "Simulate a realistic enterprise coverage report with mixed results."}
    
    Include Branch Coverage Analysis: ${branchCoverage}
    Include Mutation Score Analysis: ${mutationScore}

    Return a JSON object matching this structure:
    {
      "summary": {
        "totalTests": number,
        "coverage": number,
        "mutationScore": number,
        "riskLevel": "Low" | "Medium" | "High",
        "totalSignals": number,
        "analyzedSignals": number,
        "issuesDetected": number
      },
      "details": [
        {
          "file": string,
          "coverage": number,
          "mutationScore": number,
          "risk": "Low" | "Medium" | "High",
          "recommendation": string,
          "codeSnippet": string (a short example of code needing improvement)
        }
      ]
    }
    Generate at least 5 detailed file rows.
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      summary: {
        type: Type.OBJECT,
        properties: {
          totalTests: { type: Type.INTEGER },
          coverage: { type: Type.NUMBER },
          mutationScore: { type: Type.NUMBER },
          riskLevel: { type: Type.STRING, enum: [RiskLevel.LOW, RiskLevel.MEDIUM, RiskLevel.HIGH] },
          totalSignals: { type: Type.INTEGER },
          analyzedSignals: { type: Type.INTEGER },
          issuesDetected: { type: Type.INTEGER }
        }
      },
      details: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            file: { type: Type.STRING },
            coverage: { type: Type.NUMBER },
            mutationScore: { type: Type.NUMBER },
            risk: { type: Type.STRING, enum: [RiskLevel.LOW, RiskLevel.MEDIUM, RiskLevel.HIGH] },
            recommendation: { type: Type.STRING },
            codeSnippet: { type: Type.STRING }
          }
        }
      }
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_PRO,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    return JSON.parse(response.text || '{}') as QualityReportData;
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback mock data in case of error to keep UI functional
    return {
      summary: { 
        totalTests: 0, 
        coverage: 0, 
        mutationScore: 0, 
        riskLevel: RiskLevel.HIGH,
        totalSignals: 0,
        analyzedSignals: 0,
        issuesDetected: 0
      },
      details: []
    };
  }
};

export interface AIAnalysisItem {
  title: string;
  summary: string;
  content: string;
  status: 'Need to Review' | 'AI Verified';
  iconType: 'clock' | 'clipboard' | 'shield' | 'activity' | 'user';
}

export interface AIAnalysisReport {
  investigationTitle: string;
  sections: AIAnalysisItem[];
}

/**
 * Analyzes static code analysis results (like Astree) and provides AI insights.
 */
export const analyzeStaticCode = async (
  featureName: string,
  astreeReport: string
): Promise<AIAnalysisReport> => {
  const prompt = `
    You are a senior embedded software safety engineer at Mercedes-Benz.
    Analyze the following Astree Static Code Analysis report for the feature: "${featureName}".
    
    Astree Report Summary:
    ${astreeReport}

    Your task:
    1. Identify potential runtime errors, data races, or assertion violations mentioned.
    2. Provide a clear, professional explanation of the risks.
    3. Suggest specific code-level fixes or model adjustments.
    4. Conclude with a recommendation.
    
    Return a JSON object matching this structure:
    {
      "investigationTitle": "Static Analysis Investigation",
      "sections": [
        {
          "title": "Runtime Error Validation",
          "summary": "Brief summary of runtime error risks found.",
          "content": "Detailed markdown explanation and fixes.",
          "status": "Need to Review" or "AI Verified",
          "iconType": "clock"
        },
        ... (at least 3-4 sections)
      ]
    }
    
    Tone: Highly technical, safety-oriented, professional.
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      investigationTitle: { type: Type.STRING },
      sections: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            content: { type: Type.STRING },
            status: { type: Type.STRING, enum: ["Need to Review", "AI Verified"] },
            iconType: { type: Type.STRING, enum: ["clock", "clipboard", "shield", "activity", "user"] }
          },
          required: ["title", "summary", "content", "status", "iconType"]
        }
      }
    },
    required: ["investigationTitle", "sections"]
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_FLASH,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });
    return JSON.parse(response.text || '{}') as AIAnalysisReport;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      investigationTitle: "Analysis Error",
      sections: [{
        title: "Error",
        summary: "Failed to generate analysis.",
        content: "Please try again later.",
        status: "Need to Review",
        iconType: "clock"
      }]
    };
  }
};

/**
 * Analyzes unit testing results and provides AI insights.
 */
export const analyzeUnitTesting = async (
  featureName: string,
  unitTestReport: string
): Promise<AIAnalysisReport> => {
  const prompt = `
    You are a senior embedded software safety engineer at Mercedes-Benz.
    Analyze the following Unit Testing report for the feature: "${featureName}".
    
    Unit Test Report Summary:
    ${unitTestReport}

    Your task:
    1. Identify failed test cases and their root causes.
    2. Analyze coverage gaps and suggest new test scenarios.
    3. Provide a clear, professional explanation of the risks.
    4. Suggest specific code-level fixes.
    
    Return a JSON object matching this structure:
    {
      "investigationTitle": "Unit Testing Investigation",
      "sections": [
        {
          "title": "Test Case Validation",
          "summary": "Brief summary of test failures.",
          "content": "Detailed markdown explanation and fixes.",
          "status": "Need to Review" or "AI Verified",
          "iconType": "clipboard"
        },
        ... (at least 3-4 sections)
      ]
    }
    
    Tone: Highly technical, safety-oriented, professional.
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      investigationTitle: { type: Type.STRING },
      sections: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            content: { type: Type.STRING },
            status: { type: Type.STRING, enum: ["Need to Review", "AI Verified"] },
            iconType: { type: Type.STRING, enum: ["clock", "clipboard", "shield", "activity", "user"] }
          },
          required: ["title", "summary", "content", "status", "iconType"]
        }
      }
    },
    required: ["investigationTitle", "sections"]
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_FLASH,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });
    return JSON.parse(response.text || '{}') as AIAnalysisReport;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      investigationTitle: "Analysis Error",
      sections: [{
        title: "Error",
        summary: "Failed to generate analysis.",
        content: "Please try again later.",
        status: "Need to Review",
        iconType: "clock"
      }]
    };
  }
};

/**
 * Analyzes integration results and provides AI insights.
 */
export const analyzeIntegration = async (
  featureName: string,
  integrationReport: string
): Promise<AIAnalysisReport> => {
  const prompt = `
    You are a senior embedded software safety engineer at Mercedes-Benz.
    Analyze the following Integration Testing report for the feature: "${featureName}".
    
    Integration Report Summary:
    ${integrationReport}

    Your task:
    1. Identify integration failures and their root causes.
    2. Check knowledge base for past information about similar errors.
    3. Provide recommendations on how to fix by pinpointing the issue in the source code file.
    
    Return a JSON object matching this structure:
    {
      "investigationTitle": "Integration Investigation",
      "sections": [
        {
          "title": "Integration Failure Analysis",
          "summary": "Brief summary of integration failures.",
          "content": "Detailed markdown explanation, pinpointing source code issues and fix recommendations.",
          "status": "Need to Review" or "AI Verified",
          "iconType": "shield"
        },
        ... (at least 3-4 sections including one about Knowledge Base findings)
      ]
    }
    
    Tone: Highly technical, safety-oriented, professional.
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      investigationTitle: { type: Type.STRING },
      sections: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            content: { type: Type.STRING },
            status: { type: Type.STRING, enum: ["Need to Review", "AI Verified"] },
            iconType: { type: Type.STRING, enum: ["clock", "clipboard", "shield", "activity", "user"] }
          },
          required: ["title", "summary", "content", "status", "iconType"]
        }
      }
    },
    required: ["investigationTitle", "sections"]
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_FLASH,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });
    return JSON.parse(response.text || '{}') as AIAnalysisReport;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      investigationTitle: "Analysis Error",
      sections: [{
        title: "Error",
        summary: "Failed to generate analysis.",
        content: "Please try again later.",
        status: "Need to Review",
        iconType: "clock"
      }]
    };
  }
};
