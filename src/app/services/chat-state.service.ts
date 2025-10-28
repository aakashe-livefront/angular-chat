import { Injectable, computed, signal } from '@angular/core';
import { Message } from '../interfaces/message.interface';
import { ChatStatus } from '../interfaces/chat.interface';

@Injectable({
  providedIn: 'root'
})
export class ChatStateService {
  // State signals
  private messagesSignal = signal<Message[]>([]);
  private statusSignal = signal<ChatStatus>(ChatStatus.IDLE);
  private currentStreamingIdSignal = signal<string | null>(null);

  // Public computed signals
  public readonly messages = this.messagesSignal.asReadonly();
  public readonly status = this.statusSignal.asReadonly();
  public readonly isStreaming = computed(() => this.statusSignal() === ChatStatus.STREAMING);
  public readonly messageCount = computed(() => this.messagesSignal().length);
  public readonly lastMessage = computed(() => {
    const msgs = this.messagesSignal();
    return msgs.length > 0 ? msgs[msgs.length - 1] : null;
  });

  addMessage(message: Omit<Message, 'id' | 'timestamp'>): Message {
    const newMessage: Message = {
      ...message,
      id: this.generateId(),
      timestamp: new Date()
    };

    this.messagesSignal.update(messages => [...messages, newMessage]);
    return newMessage;
  }

  updateMessage(id: string, updates: Partial<Message>) {
    this.messagesSignal.update(messages =>
      messages.map(msg =>
        msg.id === id ? { ...msg, ...updates } : msg
      )
    );
  }

  startStreaming(messageId: string) {
    this.currentStreamingIdSignal.set(messageId);
    this.statusSignal.set(ChatStatus.STREAMING);
    this.updateMessage(messageId, { isStreaming: true });
  }

  updateStreamingContent(content: string) {
    const streamingId = this.currentStreamingIdSignal();
    if (streamingId) {
      this.messagesSignal.update(messages =>
        messages.map(msg =>
          msg.id === streamingId
            ? { ...msg, content }
            : msg
        )
      );
    }
  }

  stopStreaming() {
    const streamingId = this.currentStreamingIdSignal();
    if (streamingId) {
      this.updateMessage(streamingId, { isStreaming: false });
    }
    this.currentStreamingIdSignal.set(null);
    this.statusSignal.set(ChatStatus.IDLE);
  }

  setError(error: string) {
    this.statusSignal.set(ChatStatus.ERROR);
    const streamingId = this.currentStreamingIdSignal();
    if (streamingId) {
      this.updateMessage(streamingId, {
        isStreaming: false,
        error: error
      });
    }
    this.currentStreamingIdSignal.set(null);
  }

  clearMessages() {
    this.messagesSignal.set([]);
    this.statusSignal.set(ChatStatus.IDLE);
    this.currentStreamingIdSignal.set(null);
  }

  private generateId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}