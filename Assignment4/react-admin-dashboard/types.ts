
export enum Theme {
  Light = 'light',
  Dark = 'dark',
}

export interface NavItem {
  name: string;
  path: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export interface User {
  name: string;
  avatarUrl?: string;
  email?: string;
}

// Table data types
export interface TableRow {
  id: string | number;
  [key: string]: any; 
}

export interface TableColumn {
  key: string;
  header: string;
  render?: (row: TableRow) => React.ReactNode;
}

// Calendar event type
export interface CalendarEvent {
  id: string;
  date: Date; // Store as Date object
  title: string;
  description?: string;
  color?: string; // Optional color for the event
}

// Kanban types
export interface KanbanTask {
  id: string;
  content: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface KanbanColumn {
  id: string;
  title: string;
  tasks: KanbanTask[];
}

export type KanbanBoardData = Record<string, KanbanColumn>;

// Gemini API related types
export interface GeminiContentPart {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string;
  };
}
export interface GeminiSafetyRating {
    category: string;
    probability: string;
}

export interface GeminiCandidate {
    content: {
        parts: GeminiContentPart[];
        role: string;
    };
    finishReason: string;
    index: number;
    safetyRatings: GeminiSafetyRating[];
    groundingMetadata?: {
      groundingChunks?: { web: { uri: string; title: string } }[];
      searchQueries?: string[];
    };
}
export interface GeminiGenerateContentResponse {
    candidates: GeminiCandidate[];
    promptFeedback: {
        safetyRatings: GeminiSafetyRating[];
    };
    text: string; // Helper to get text directly
}
