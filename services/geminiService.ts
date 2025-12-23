import { GoogleGenAI, Type } from "@google/genai";
import { BugAnalysis } from "../types";

export const analyzeCodeWithAI = async (
  code: string,
  syntaxError?: string
): Promise<Partial<BugAnalysis>> => {
  try {
    // Get API key from environment variable
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    // Check if API key exists
    if (!apiKey) {
      throw new Error(
        "API key not found. Please check your .env file and ensure VITE_GEMINI_API_KEY is set."
      );
    }

    // Initialize Google Generative AI with environment variable
    const ai = new GoogleGenAI({
      apiKey: apiKey,
    });

    // Using gemini-3-flash-preview as the standard model for coding tasks
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the following JavaScript code for any bugs, logical errors, or performance issues.
      ${
        syntaxError
          ? `A syntax error was reported by the parser: "${syntaxError}". Please prioritize fixing this error.`
          : ""
      }

      Code to analyze:
      \`\`\`javascript
      ${code}
      \`\`\`
      
      Requirements for your response:
      1. For the 'aiSuggestion' field: List every error or issue. START each issue with "Line X:" on a NEW LINE. 
      2. For the 'fixedCode' field: Provide the complete, corrected version of the code.
      3. For 'logicalErrorExplanation': Provide a high-level overview.
      4. For 'performanceTips': Provide optimization advice.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isPotentiallyBuggy: { type: Type.BOOLEAN },
            aiSuggestion: {
              type: Type.STRING,
              description:
                "Detailed list of fixes, each starting with 'Line X:'",
            },
            fixedCode: {
              type: Type.STRING,
              description: "The full corrected JavaScript code snippet.",
            },
            logicalErrorExplanation: {
              type: Type.STRING,
              description: "A summary of the logical flaws found.",
            },
            performanceTips: {
              type: Type.STRING,
              description: "Optional tips for better performance.",
            },
          },
          required: [
            "isPotentiallyBuggy",
            "aiSuggestion",
            "fixedCode",
            "logicalErrorExplanation",
          ],
        },
      },
    });

    const responseText = response.text || "{}";
    const data = JSON.parse(responseText);

    return {
      aiSuggestion: data.aiSuggestion,
      fixedCode: data.fixedCode,
      logicalErrorExplanation: data.logicalErrorExplanation,
      performanceTips: data.performanceTips,
      type:
        data.isPotentiallyBuggy || !!syntaxError
          ? syntaxError
            ? "syntax"
            : "logical"
          : "none",
      severity:
        data.isPotentiallyBuggy || !!syntaxError
          ? syntaxError
            ? "error"
            : "warning"
          : "success",
    };
  } catch (error) {
    console.error("AI Analysis failed", error);
    throw error;
  }
};