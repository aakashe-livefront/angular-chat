# Angular Chat

An educational Angular chat application demonstrating modern Angular 19 patterns and best practices.

## What is this?

A chat app powered by AI that teaches Angular concepts while you use it. Built to showcase the latest Angular features including:

- **Standalone Components** - No NgModules required
- **Signals** - Modern reactive state management
- **New Control Flow** - `@if`, `@for`, `@switch` syntax
- **SSR Support** - Server-side rendering with `@angular/ssr`
- **OnPush Change Detection** - Optimized performance

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- OpenRouter API key (for AI chat functionality)

## Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd angular-chat

# Install dependencies
npm install
```

## Configuration

Create a `.env` file in the project root:

```env
NG_APP_OPENROUTER_API_KEY=your_api_key_here
NG_APP_OPENROUTER_MODEL=anthropic/claude-haiku-4.5
```

Get your API key from [OpenRouter](https://openrouter.ai/).

## Development

```bash
# Start development server
npm start

# Open browser to http://localhost:4200
```

## Build

```bash
# Production build
npm run build

# Run SSR server
npm run serve
```

## Project Structure

```
src/app/
├── components/           # UI components
│   ├── chat-header/     # App header
│   ├── message-list/    # Message display
│   └── message-input/   # User input
├── services/            # Business logic
│   ├── chat-state.service.ts    # State management
│   └── openrouter.service.ts    # AI API integration
├── interfaces/          # TypeScript interfaces
└── app.ts              # Root component
```

## Educational Purpose

This project was built to demonstrate:

- **Angular 19 vs Angular 12** - See `message-list.module.angular12-example.md` for comparison
- **Best Practices** - Standalone components, signals, modern DI
- **Real-world Patterns** - Service-based architecture, reactive state

Check `presentation-outline.md` for a detailed guide on Angular's evolution.

## Technologies

- **Angular 20.3** - Latest Angular framework
- **TypeScript 5.9** - Type-safe development
- **PrimeNG 20.2** - UI component library
- **Tailwind CSS 4.1** - Utility-first styling
- **OpenRouter API** - AI integration
- **Express** - SSR server

## License

MIT

## Learn More

- [Angular Documentation](https://angular.dev)
- [Angular Signals Guide](https://angular.dev/guide/signals)
- [Standalone Components](https://angular.dev/guide/components/importing)
