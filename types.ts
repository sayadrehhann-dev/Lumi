
export type AppView = 'landing' | 'auth' | 'dashboard' | 'chat' | 'viva' | 'infographic';

export interface ActivityEvent {
  id: string;
  concept: string;
  previousMastery: number;
  newMastery: number;
  timestamp: number;
  type: 'gain' | 'loss' | 'neutral';
}

export interface ConceptMastery {
  concept: string;
  mastery: number;
  lastReviewed: number;
  misconceptions?: string[];
  prerequisites?: string[];
  notes?: string;
  retentionProbability?: number;
}

export interface UserProfile {
  name: string;
  educationLevel: string;
  majorSubject: string;
  learningGoal: string;
  difficultyLevel: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  isThinking?: boolean;
  imageUrl?: string;
}

export interface VivaTurn {
  id: string;
  role: 'me' | 'lumi';
  text: string;
  timestamp: number;
}

export interface VivaSession {
  id: string;
  timestamp: number;
  subject: string;
  difficulty: string;
  transcript: VivaTurn[];
}
