import { Component, ElementRef, ViewChild, effect, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { ChatStateService } from '../../services/chat-state.service';

/**
 * MessageListComponent - Displays the chat messages
 * 
 * Angular 19 patterns used:
 * - Standalone component (no NgModule needed)
 * - inject() function instead of constructor injection
 * - @if/@for control flow instead of *ngIf/*ngFor
 * - OnPush change detection for performance
 * 
 * In Angular 12, this would require:
 * - Declaring in NgModule's declarations array
 * - Constructor injection
 * - *ngFor directive for loops
 * - Default change detection strategy
 */
@Component({
  selector: 'app-message-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    AvatarModule
  ],
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css'
})
export class MessageListComponent {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef<HTMLDivElement>;

  // Using inject() function - Angular 19 pattern
  // In Angular 12: would use constructor(private chatState: ChatStateService)
  chatState = inject(ChatStateService);

  // Computed signal from service - reactive state management
  messages = this.chatState.messages;

  constructor() {
    // Auto-scroll effect when new messages arrive
    // Using Angular's effect() for side effects instead of lifecycle hooks
    effect(() => {
      const messages = this.messages();
      if (messages.length > 0) {
        setTimeout(() => this.scrollToBottom(), 100);
      }
    });
  }

  private scrollToBottom(): void {
    if (this.messagesContainer) {
      const element = this.messagesContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }

  formatTime(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  }
}