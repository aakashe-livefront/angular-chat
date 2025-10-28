export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  error?: string;
}

export interface StreamChunk {
  content: string;
  done: boolean;
  error?: string;
}