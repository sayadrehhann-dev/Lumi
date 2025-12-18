import { GoogleGenAI, Chat, Type, FunctionDeclaration } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";
import { UserProfile, ConceptMastery } from "../types";

let chatSession: Chat | null = null;
let aiClient: GoogleGenAI | null = null;

const logMasteryDeclaration: FunctionDeclaration = {
  name: 'log_concept_mastery',
  parameters: {
    type: Type.OBJECT,
    description: 'Updates the student mastery level and records pedagogical notes for a specific concept, including prerequisite dependencies.',
    properties: {
      concept: {
        type: Type.STRING,
        description: 'The name of the educational concept.',
      },
      mastery: {
        type: Type.NUMBER,
        description: 'The mastery score from 0 to 100.',
      },
      misconceptions: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'List of specific misconceptions detected (e.g. "Confusing mass with weight").',
      },
      prerequisites: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'List of concepts that should be understood before mastering this one.',
      },
      notes: {
        type: Type.STRING,
        description: 'Pedagogical notes on student progress or prerequisite gaps.',
      },
    },
    required: ['concept', 'mastery'],
  },
};

const getClient = () => {
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return aiClient;
};

const getDifficultyInstruction = (level: string) => {
  switch (level) {
    case 'Beginner':
      return "Focus on building intuition. Use simple language and relatable analogies. Avoid heavy jargon initially. Assume little prior knowledge.";
    case 'Intermediate':
      return "Balance conceptual depth with technical details. Use standard terminology but explain complex nuances. Bridge theory with practice.";
    case 'Advanced':
      return "Prioritize technical rigor and critical analysis. Skip basic definitions. Focus on edge cases, complex applications, and synthesis of ideas.";
    default:
      return "Adapt to the user's responses.";
  }
};

export const initializeChat = (userProfile: UserProfile, history: ConceptMastery[]) => {
  const client = getClient();
  
  const historyText = history.length > 0 
    ? history.map(h => `- ${h.concept}: ${h.mastery}% mastery. ${h.misconceptions?.length ? 'Known misconceptions: ' + h.misconceptions.join(', ') : ''} ${h.prerequisites?.length ? 'Prerequisites: ' + h.prerequisites.join(', ') : ''}`).join('\n')
    : "No previous concepts studied yet.";

  const personalizedSystemInstruction = `
${SYSTEM_PROMPT}

---
**CURRENT STUDENT PROFILE**
Name: ${userProfile.name}
Education Level: ${userProfile.educationLevel}
Major/Subject of Interest: ${userProfile.majorSubject}
Current Learning Goal: ${userProfile.learningGoal}

**SELECTED DIFFICULTY LEVEL: ${userProfile.difficultyLevel}**
Instruction: ${getDifficultyInstruction(userProfile.difficultyLevel)}

**STUDENT KNOWLEDGE MODEL (HISTORY)**
${historyText}

**MANDATORY:**
When using 'log_concept_mastery', be specific in the 'notes' about why the mastery changed. 
Always identify and include 'prerequisites' if the concept belongs to a structured hierarchy.
`;

  chatSession = client.chats.create({
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
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const resetChat = () => {
  chatSession = null;
};
