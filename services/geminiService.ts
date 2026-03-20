import { GoogleGenAI, Type, Schema } from "@google/genai";
import { QualityReportData, RiskLevel, TestFile } from "../types";

const MODEL_FLASH = 'gemini-3-flash-preview';
const MODEL_PRO = 'gemini-3-pro-preview';
const ENV = import.meta.env;
const GEMINI_API_KEY = ENV.VITE_GEMINI_API_KEY || ENV.VITE_API_KEY || '';

// Lazy client — only instantiated when a call is made, prevents crash on load with missing key
let _ai: GoogleGenAI | null = null;
const getAI = (): GoogleGenAI => {
  if (!_ai) {
    if (!GEMINI_API_KEY) throw new Error('VITE_GEMINI_API_KEY is not set');
    _ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  }
  return _ai;
};

const NO_KEY = !GEMINI_API_KEY;

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
  if (NO_KEY) return [
    `# ${folder} — Module Summary`,
    '',
    `This module handles core signal processing and state management for the **${folder}** feature. It implements a pub-sub pattern to propagate CAN bus events, ensuring low-latency updates across dependent ECU subsystems.`,
    '',
    '## Architecture',
    'The module exposes three primary interfaces: `init()`, `process()`, and `shutdown()`. Signal validation is performed inline using range checks against the calibration dataset.',
    '',
    '## Key Findings',
    '- All boundary conditions handled via assertion macros',
    '- Memory footprint: 4.2 KB static, 0 dynamic',
    '- MISRA-C:2012 compliant',
  ].join('\n');

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
    const response = await getAI().models.generateContent({
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
  if (NO_KEY) return [
    {
      name: `test_${folder}_init.c`,
      code: `// Unit test — ${folder} init\n#include "unity.h"\n#include "${folder}.h"\n\nvoid test_init_success(void) {\n  TEST_ASSERT_EQUAL(0, ${folder}_init());\n}\n\nvoid test_init_invalid_param(void) {\n  TEST_ASSERT_EQUAL(-1, ${folder}_init_with_null());\n}`
    },
    {
      name: `test_${folder}_process.c`,
      code: `// Unit test — ${folder} process\n#include "unity.h"\n\nvoid test_process_nominal(void) {\n  Signal_t sig = { .id = 0x1A2, .value = 42 };\n  TEST_ASSERT_EQUAL(SIGNAL_OK, process_signal(&sig));\n}\n\nvoid test_process_out_of_range(void) {\n  Signal_t sig = { .id = 0x1A2, .value = 9999 };\n  TEST_ASSERT_EQUAL(SIGNAL_RANGE_ERR, process_signal(&sig));\n}`
    }
  ];

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
    const response = await getAI().models.generateContent({
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
  if (NO_KEY) return {
    summary: { totalTests: 142, coverage: 87, mutationScore: 74, riskLevel: RiskLevel.MEDIUM, totalSignals: 38, analyzedSignals: 35, issuesDetected: 3 },
    details: [
      { file: `src/${folder}/signal_handler.c`, coverage: 94, mutationScore: 82, risk: RiskLevel.LOW, recommendation: 'Add boundary tests for max signal value edge cases.', codeSnippet: 'if (sig->value > MAX_VAL) return ERR_RANGE;' },
      { file: `src/${folder}/state_machine.c`, coverage: 78, mutationScore: 61, risk: RiskLevel.MEDIUM, recommendation: 'State transitions lack negative-path tests; add timeout and fault injection scenarios.', codeSnippet: 'case STATE_IDLE: next = STATE_ACTIVE; break;' },
      { file: `src/${folder}/can_parser.c`, coverage: 85, mutationScore: 70, risk: RiskLevel.MEDIUM, recommendation: 'CRC mismatch path untested. Add fuzz tests for malformed CAN frames.', codeSnippet: 'if (frame.crc != calc_crc(frame)) return CAN_ERR;' },
      { file: `src/${folder}/calibration.c`, coverage: 96, mutationScore: 91, risk: RiskLevel.LOW, recommendation: 'Coverage excellent. Verify calibration table version check in integration.', codeSnippet: 'return cal_table[idx].gain * raw_val;' },
      { file: `src/${folder}/diagnostics.c`, coverage: 65, mutationScore: 48, risk: RiskLevel.HIGH, recommendation: 'Critical DTC reporting path has <70% coverage. Add tests for DTC debounce logic.', codeSnippet: 'report_dtc(DTC_SIGNAL_LOST, DEBOUNCE_10MS);' },
    ]
  };

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
    const response = await getAI().models.generateContent({
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
    return {
      summary: { totalTests: 0, coverage: 0, mutationScore: 0, riskLevel: RiskLevel.HIGH, totalSignals: 0, analyzedSignals: 0, issuesDetected: 0 },
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
  if (NO_KEY) return {
    investigationTitle: "Static Analysis Investigation",
    sections: [
      {
        title: "Runtime Error Validation",
        summary: "2 potential null-pointer dereferences identified in signal_handler.c.",
        content: "Astree detected unguarded pointer accesses on lines 142 and 178 of signal_handler.c. Both occur during CAN frame deserialization when the frame buffer pointer is not validated before use.\n\n**Recommended fix:**\n```c\nif (frame_ptr == NULL) return ERR_NULL_PTR;\n```",
        status: "Need to Review",
        iconType: "clock"
      },
      {
        title: "Assertion Violation Analysis",
        summary: "1 assertion violation in state_machine.c — invalid state transition.",
        content: "The transition from STATE_FAULT to STATE_ACTIVE bypasses the required reset sequence. The Astree assertion fires on this path.\n\n**Fix:** Add a guard in the state transition handler to enforce STATE_RESET before re-activation.",
        status: "Need to Review",
        iconType: "shield"
      },
      {
        title: "Memory Safety",
        summary: "No memory leaks or buffer overruns detected.",
        content: "Static analysis confirms all buffer accesses are within bounds. The module uses fixed-size stack allocations only — no dynamic memory. MISRA Rule 21.3 compliance confirmed.",
        status: "AI Verified",
        iconType: "activity"
      },
      {
        title: "Safety Recommendation",
        summary: "Module is conditionally safe to proceed with 2 fixes required.",
        content: "Address the null-pointer dereferences and the illegal state transition before proceeding to unit testing. Both are low-complexity fixes estimated at under 2 hours of engineering effort.",
        status: "Need to Review",
        iconType: "clipboard"
      }
    ]
  };

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
    const response = await getAI().models.generateContent({
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
      sections: [{ title: "Error", summary: "Failed to generate analysis.", content: "Please try again later.", status: "Need to Review", iconType: "clock" }]
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
  if (NO_KEY) return {
    investigationTitle: "Unit Testing Investigation",
    sections: [
      {
        title: "Test Case Validation",
        summary: "3 failing test cases identified — all in edge-case paths.",
        content: "**Failed Tests:**\n- test_signal_overflow — expected ERR_RANGE, got ERR_NONE. Signal range check missing for values > 0xFFFF.\n- test_state_timeout — timeout handler not invoked within 10ms window.\n- test_can_crc_mismatch — CRC error flag not set when frame CRC is corrupted.\n\n**Root cause:** All three failures stem from missing guard conditions added in the last feature branch.",
        status: "Need to Review",
        iconType: "clipboard"
      },
      {
        title: "Coverage Gap Analysis",
        summary: "Coverage at 87% — DTC debounce logic and fault injection paths uncovered.",
        content: "The following paths have 0% coverage:\n- diagnostics.c report_dtc() fault path\n- state_machine.c fault injection branch\n\n**Recommended:** Add 4 new test cases targeting these paths to reach the 92% target.",
        status: "Need to Review",
        iconType: "activity"
      },
      {
        title: "AI-Generated Test Suggestions",
        summary: "4 new tests recommended to close coverage gaps.",
        content: "1. test_dtc_debounce_fault — Inject DTC and verify 10ms debounce\n2. test_signal_max_boundary — Send MAX_VAL + 1 signal\n3. test_state_fault_injection — Force STATE_FAULT and verify recovery\n4. test_can_frame_corruption — Corrupt CAN frame bytes and check error flag",
        status: "AI Verified",
        iconType: "shield"
      },
      {
        title: "Recommendation",
        summary: "Fix 3 failing tests and add 4 new ones before approving.",
        content: "All fixes are targeted and low-risk. Estimated effort: 3-4 hours. Once fixed, re-run the full suite and verify coverage reaches at least 92% before proceeding to integration.",
        status: "Need to Review",
        iconType: "user"
      }
    ]
  };

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
    const response = await getAI().models.generateContent({
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
      sections: [{ title: "Error", summary: "Failed to generate analysis.", content: "Please try again later.", status: "Need to Review", iconType: "clock" }]
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
  if (NO_KEY) return {
    investigationTitle: "Integration Investigation",
    sections: [
      {
        title: "Integration Failure Analysis",
        summary: "2 integration failures detected in the CAN bus interface layer.",
        content: "**Failure 1:** MonEmmBatTm to DcpChassis signal handshake timeout after 50ms. Root cause: DcpChassis does not ACK the SYNC frame within the required window.\n\n**Failure 2:** SrsVReqVmsl speed-limit signal arrives out-of-sequence during emergency braking scenario. The arbitration logic in can_arbiter.c line 88 needs to prioritize safety-critical signals.",
        status: "Need to Review",
        iconType: "shield"
      },
      {
        title: "Knowledge Base Findings",
        summary: "Similar CAN arbitration issue logged in KB-2024-0041.",
        content: "A matching failure pattern was found in Knowledge Base entry **KB-2024-0041** (DtrTqshRbs integration, March 2024). The fix was to increase the SYNC ACK timeout from 50ms to 120ms and enable priority queuing in the CAN stack.\n\n**Action:** Apply the same patch to can_stack_config.h — specifically set CAN_SYNC_ACK_TIMEOUT_MS to 120.",
        status: "AI Verified",
        iconType: "clipboard"
      },
      {
        title: "Source Code Pinpoint",
        summary: "Root cause localized to can_arbiter.c and can_stack_config.h.",
        content: "- can_arbiter.c line 88 — Add priority flag for SAFETY_CRITICAL message class\n- can_stack_config.h line 14 — Change CAN_SYNC_ACK_TIMEOUT_MS from 50 to 120\n- signal_router.c line 211 — Add sequence number validation before dispatching speed-limit signal",
        status: "Need to Review",
        iconType: "activity"
      },
      {
        title: "Integration Recommendation",
        summary: "Apply 3 targeted fixes before re-running integration suite.",
        content: "Estimated fix effort: 2 hours. After applying changes, re-run the full hardware-in-the-loop integration test suite. Prioritize the CAN bus stress test (int_test_can_stress.c) which directly exercises the failing paths.",
        status: "Need to Review",
        iconType: "user"
      }
    ]
  };

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
    const response = await getAI().models.generateContent({
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
      sections: [{ title: "Error", summary: "Failed to generate analysis.", content: "Please try again later.", status: "Need to Review", iconType: "clock" }]
    };
  }
};
