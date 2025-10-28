import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { ChatStateService } from '../../services/chat-state.service';

/**
 * ChatHeaderComponent - Application header with title and controls
 *
 * Angular 19 patterns used:
 * - Standalone component (no module needed)
 * - Computed signals for derived state (messageCount, isStreaming)
 * - inject() for service access
 * - OnPush change detection for optimal performance
 */
@Component({
  selector: 'app-chat-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonModule,
    ChipModule
  ],
  templateUrl: './chat-header.component.html',
  styleUrl: './chat-header.component.css'
})
export class ChatHeaderComponent {
  // Inject service using inject() function
  private chatState = inject(ChatStateService);

  // Expose computed signals as component properties
  // These automatically update when the underlying state changes
  messageCount = this.chatState.messageCount;
  isStreaming = this.chatState.isStreaming;

}