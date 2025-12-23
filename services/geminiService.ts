import { GoogleGenAI, Chat, Type, FunctionDeclaration } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";
import { UserProfile, ConceptMastery } from "../types";

let chatSession: Chat | null = null;
let currentAiClient: GoogleGenAI | null = null;

const logMasteryDeclaration: FunctionDeclaration = {
  name: 'log_concept_mastery',
  parameters: {
    type: Type.OBJECT,
    description: 'Update student mastery for a concept.',
    properties: {
      concept: {
        type: Type.STRING,
        description: 'Concept name.',
      },
      mastery: {
        type: Type.NUMBER,
        description: 'Mastery score (0-100).',
      },
      misconceptions: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'Detected misconceptions.',
      },
      prerequisites: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'Concepts required for this one.',
      },
      notes: {
        type: Type.STRING,
        description: 'Progress notes.',
      },
    },
    required: ['concept', 'mastery'],
  },
};

const getDifficultyInstruction = (level: string) => {
  switch (level) {
    case 'Beginner':
      return "Use simple language and analogies. Avoid heavy jargon. Assume no prior knowledge.";
    case 'Intermediate':
      return "Balance intuition with technical details. Explain nuances.";
    case 'Advanced':
      return "Focus on technical rigor, edge cases, and complex applications.";
    default:
      return "Adapt to user level.";
  }
};

export const initializeChat = (userProfile: UserProfile, history: ConceptMastery[]) => {
  currentAiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const historyText = history.length > 0 
    ? history.map(h => `- ${h.concept}: ${h.mastery}% mastery. ${h.misconceptions?.length ? 'Misconceptions: ' + h.misconceptions.join(', ') : ''}`).join('\n')
    : "No previous concepts.";

  const personalizedSystemInstruction = `
${SYSTEM_PROMPT}

**PROFILE**
User: ${userProfile.name} (${userProfile.educationLevel})
Subject: ${userProfile.majorSubject}
Level: ${userProfile.difficultyLevel}
Strategy: ${getDifficultyInstruction(userProfile.difficultyLevel)}

**HISTORY**
${historyText}
`;

  chatSession = currentAiClient.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: personalizedSystemInstruction,
      temperature: 0.7,
      tools: [{ functionDeclarations: [logMasteryDeclaration] }],
    },
  });

  return chatSession;
};

export const sendMessage = async (message: string) => {
  if (!chatSession) {
    throw new Error("Chat session not initialized");
  }

  try {
    const response = await chatSession.sendMessage({ message });
    return response;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message?.includes('500') || error.status === 'INTERNAL') {
      throw new Error("INTERNAL_AI_ERROR");
    }
    throw error;
  }
};

export const generateInfographic = async (text: string, style: string = 'Modern', onProgress?: (stage: string) => void) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  onProgress?.("Extracting Luminous Structure...");
  const analysisResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the following text and create a highly structured "Visual Narrative" for an educational infographic. 
    Identify: 1. Main Topic. 2. Three critical takeaways/facts. 3. A clear logical sequence or cycle.
    Provide the output as a concise visual blueprint for a render engine.
    Text: ${text.substring(0, 3000)}`,
  });
  
  const blueprint = analysisResponse.text || text.substring(0, 500);

  onProgress?.("Refracting Concepts via Prism...");
  
  const stylePrompts: Record<string, string> = {
    'Modern': 'Ultra-modern, professional, vibrant mint accents, clean lines, minimalist flat icons, soft shadows, high legibility.',
    'Cyberpunk': 'High-tech neon HUD, dark carbon-fiber background, electric blue and magenta glows, futuristic data-vis, synthwave vibe.',
    'Academic': 'Elegant classical textbook style, clean parchment-white background, fine-line ink diagrams, sophisticated serif typography, muted earth tones.',
    'Hand-drawn': 'Creative artist sketchbook, charcoal and watercolor textures, hand-lettered annotations, organic flow, warm and personal feel.',
    'Blueprint': 'Industrial engineering schematic, architectural blueprint blue, white technical grid, precise line-art diagrams, isometric labels.'
  };

  const prompt = `Synthesize a professional and eye-catching educational infographic.
  VISUAL STYLE: ${stylePrompts[style] || stylePrompts['Modern']}
  INFOGRAPHIC TYPE: ${style === 'Blueprint' ? 'Technical Schematic' : 'Conceptual Process Map'}
  CORE KNOWLEDGE BLUEPRINT: ${blueprint}
  DIRECTIVES: Ensure perfect logical flow, high-contrast hierarchical headers, professional iconography, and pedagogical clarity. Optimized for student retention by Lumi.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "3:4",
        },
      },
    });

    onProgress?.("Finalizing Spectral Render...");
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated");
  } catch (error) {
    console.error("Infographic Gen Error:", error);
    throw error;
  }
};

export const resetChat = () => {
  chatSession = null;
  currentAiClient = null;
};