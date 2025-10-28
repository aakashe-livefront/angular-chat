# Angular 12 NgModule Example


## The Code

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';

// Import the component this module will declare
import { MessageListComponent } from './message-list.component';

@NgModule({
  // DECLARATIONS: Components, directives, and pipes that belong to this module
  // These are PRIVATE to this module unless you export them
  // In Angular 19: Components declare themselves, no module needed
  declarations: [
    MessageListComponent
  ],

  // IMPORTS: Other modules whose exported components/directives/pipes are needed
  // You must import CommonModule for basic directives like *ngIf, *ngFor
  // In Angular 19: Each component imports what it needs directly
  imports: [
    CommonModule,    // Required for *ngIf, *ngFor, *ngSwitch, pipes
    AvatarModule     // PrimeNG module for avatar component
  ],

  // EXPORTS: Make components available to other modules that import this module
  // If you forget to export, other modules can't use your component!
  // In Angular 19: Just import the component where you need it
  exports: [
    MessageListComponent
  ],

  // PROVIDERS: Services scoped to this module (rarely used here)
  // Usually services use providedIn: 'root' instead
  // In Angular 19: Same as Angular 12, services unchanged
  providers: [
    // ChatStateService would go here if not using providedIn: 'root'
  ]
})
export class MessageListModule { }
```
@