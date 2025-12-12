export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  COURSES = 'COURSES',
  CHATBOT = 'CHATBOT',
  LIVE_INTERVIEW = 'LIVE_INTERVIEW',
  IMAGE_GEN = 'IMAGE_GEN',
  VIDEO_ANALYSIS = 'VIDEO_ANALYSIS',
  QUIZ = 'QUIZ'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  link: string;
}

export enum QuizCategory {
  DSA = 'Data Structures',
  ML = 'Machine Learning',
  PYTHON = 'Python',
  SYSTEM_DESIGN = 'System Design'
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}
