import { Injectable } from '@angular/core';
import { OpenRouterConfig, OpenRouterMessage } from '../interfaces/chat.interface';

@Injectable({
  providedIn: 'root'
})
export class OpenRouterService {
  // API configuration from environment variables
  private readonly apiKey = import.meta.env.NG_APP_OPENROUTER_API_KEY || '';
  private readonly baseUrl = 'https://openrouter.ai/api/v1';
  private readonly defaultModel = import.meta.env.NG_APP_OPENROUTER_MODEL || 'anthropic/claude-sonnet-4.5';

  constructor() {
    // Log configuration status in development
    if (!this.apiKey) {
      console.warn('OpenRouter API key not found. Please set NG_APP_OPENROUTER_API_KEY in your .env file');
    }
  }

  hasApiKey(): boolean {
    return !!this.apiKey;
  }

  /**
   * System prompt for Angular education
   */
  private getSystemPrompt(): OpenRouterMessage {
    return {
      role: 'system',
      content: `You are an expert Angular educator and mentor specializing in modern Angular development (Angular 17+). Your role is to:

        1. **Teach Angular Concepts**: Explain Angular concepts clearly with practical examples. Focus on Angular 17+ features like signals, standalone components, and the new control flow syntax.

        2. **Provide Code Examples**: When discussing Angular features, provide working code examples that demonstrate best practices. Always use:
          - Standalone components (no NgModules)
          - Signals for state management
          - inject() function for dependency injection
          - @if, @for, @switch instead of *ngIf, *ngFor, *ngSwitch
          - OnPush change detection strategy

        3. **Compare with Legacy Angular**: When relevant, explain how things were done in older Angular versions (like Angular 12) to help learners understand the evolution and improvements.

        4. **Best Practices**: Emphasize Angular best practices including:
          - Single Responsibility Principle
          - Component composition
          - Reactive programming with RxJS and signals
          - Performance optimization techniques
          - Accessibility considerations

        5. **Educational Approach**:
          - Start with simple explanations and build complexity gradually
          - Use analogies and real-world examples
          - Encourage questions and exploration
          - Provide exercises or challenges when appropriate

        6. **Stay Current**: Focus on modern Angular patterns and discourage outdated practices. Guide learners toward the latest Angular documentation and community resources.

        Remember to be encouraging, patient, and thorough in your explanations. Help learners not just understand 'how' but also 'why' certain patterns and practices are recommended in Angular development.`
    };
  }

  async streamChat(
    messages: OpenRouterMessage[],
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: string) => void,
    config?: Partial<OpenRouterConfig>
  ) {
    if (!this.hasApiKey()) {
      onError('API key is required. Please set NG_APP_OPENROUTER_API_KEY in your .env file.');
      return;
    }

    try {
      // Prepend system prompt to messages for educational context
      // This ensures the AI maintains its role as an Angular educator
      const messagesWithSystem = [
        this.getSystemPrompt(),
        ...messages
      ];

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Angular AI Chat'
        },
        body: JSON.stringify({
          model: config?.model || this.defaultModel,
          messages: messagesWithSystem,
          stream: true,
          temperature: config?.temperature || 0.7,
          max_tokens: config?.maxTokens || 1024
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              onComplete();
              return;
            }

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                onChunk(content);
              }
            } catch (e) {
              // Ignore parsing errors for incomplete chunks
            }
          }
        }
      }

      onComplete();
    } catch (error) {
      onError(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  }

  async getModels(): Promise<any[]> {
    if (!this.hasApiKey()) {
      throw new Error('API key is required');
    }

    const response = await fetch(`${this.baseUrl}/models`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data || [];
  }
}