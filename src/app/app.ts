import { Component, ChangeDetectionStrategy } from '@angular/core';
import { 
  ChatHeaderComponent, 
  MessageListComponent, 
  MessageInputComponent 
} from './components';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ChatHeaderComponent,
    MessageListComponent,
    MessageInputComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.css'
})
export class App {}