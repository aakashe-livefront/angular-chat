import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Textarea } from 'primeng/textarea';
import { ChatStateService } from '../../services/chat-state.service';
import { OpenRouterService } from '../../services/openrouter.service';
import { OpenRouterMessage } from '../../interfaces/chat.interface';

/**
 * MessageInputComponent - Handles user input and message sending
 *
 * Angular 19 patterns used:
 * - Standalone component with direct imports
 * - Signals for local component state
 * - inject() for dependency injection
 * - OnPush change detection strategy
 */
@Component({
  selector: 'app-message-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ButtonModule,
    Textarea
  ],
  templateUrl: './message-input.component.html'
})
export class MessageInputComponent {
  private chatState = inject(ChatStateService);
  private openRouter = inject(OpenRouterService);

  // Local state for user input
  userInput = '';

  // Computed signal from service for reactive state
  isStreaming = this.chatState.isStreaming;

  async sendMessage(): Promise<void> {
    const content = this.userInput.trim();
    if (!content || this.isStreaming()) return;

    // Check API key configuration
    if (!this.openRouter.hasApiKey()) {
      console.error('OpenRouter API key not configured. Please set NG_APP_OPENROUTER_API_KEY in your .env file');
      return;
    }

    // Add user message to chat state
    this.chatState.addMessage({
      role: 'user',
      content
    });

    // Clear input field
    this.userInput = '';

    // Add assistant message placeholder for streaming
    const assistantMessage = this.chatState.addMessage({
      role: 'assistant',
      content: '',
      isStreaming: true
    });

    // Start streaming indicator
    this.chatState.startStreaming(assistantMessage.id);

    // Prepare messages history for API
    const messages: OpenRouterMessage[] = this.chatState.messages().map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    let streamedContent = '';

    // Stream the AI response
    await this.openRouter.streamChat(
      messages,
      (chunk) => {
        // Handle incoming stream chunks
        streamedContent += chunk;
        this.chatState.updateStreamingContent(streamedContent);
      },
      () => {
        // Stream completed
        this.chatState.stopStreaming();
      },
      (error) => {
        // Error handling
        this.chatState.setError(error);
        this.chatState.stopStreaming();
      }
    );
  }

  handleKeyPress(event: KeyboardEvent): void {
    // Submit on Enter, allow Shift+Enter for new lines
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}