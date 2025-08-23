# Minecraft Text Editor - Project Summary

## Overview

**Minecraft Text Editor** is a specialized WYSIWYG (What You See Is What You Get) editor designed for creating Minecraft formatted text with colors and styling. The project is specifically tailored for third-party Minecraft server players and provides a convenient way to edit colorful text that can be used in chat or commands.

## Key Features

### Core Functionality
- **Rich Text Editing**: Full WYSIWYG editor with color, formatting, and styling support
- **Minecraft Compatibility**: Generates text codes compatible with Minecraft's EssentialsX plugin
- **Real-time Preview**: Live preview of formatted text as it will appear in-game
- **Multiple Export Formats**: Supports both EssentialsX format and raw JSON text format
- **Color Picker**: Advanced color selection with support for both standard and custom RGB colors

### Editor Features
- **Text Formatting**: Bold, italic, underline, and strikethrough support
- **Color Management**: Comprehensive color system with predefined palettes and custom colors
- **Theme Selection**: Multiple editor themes to simulate different Minecraft environments (chat, books, signs)
- **Rainbow Text**: Automated rainbow text generation with customizable presets
- **Undo/Redo**: Full undo/redo functionality
- **Clear Formatting**: One-click formatting removal

### Export & Integration
- **EssentialsX Format**: Generates & codes compatible with EssentialsX plugin
- **JSON Export**: Raw JSON text format for advanced usage
- **Character Count**: Real-time character counting with Minecraft chat limit warnings (256 chars)
- **Clipboard Integration**: Easy copy-to-clipboard functionality

## Technical Architecture

### Technology Stack
- **Frontend Framework**: React 19.1.1 with TypeScript
- **Rich Text Editor**: Lexical 0.34.0 (Facebook's rich text editor framework)
- **Build System**: Farm (Rust-based build tool)
- **Styling**: Tailwind CSS 4.1.12 with custom components
- **State Management**: Zustand for global state management
- **UI Components**: Radix UI primitives with custom styling

### Key Dependencies
- **Lexical Ecosystem**: Comprehensive rich text editing capabilities
- **Color Management**: colorjs.io for advanced color operations
- **Icons**: lucide-react for consistent iconography
- **Utilities**: foxact for React hooks, sonner for notifications
- **Validation**: zod for schema validation
- **Clipboard**: foxact/use-clipboard for clipboard operations

### Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # Reusable UI components (Radix UI based)
│   ├── Toolbar.tsx      # Main toolbar with formatting options
│   ├── CodeEditor.tsx   # Generated code display and export
│   ├── ColorPicker.tsx  # Color selection component
│   └── Rainbow*.tsx     # Rainbow text generation dialogs
├── lib/                 # Core business logic
│   ├── editor.ts        # Lexical editor utilities
│   ├── parser.ts        # HTML ↔ Minecraft format conversion
│   ├── extendedTextNode.ts # Custom Lexical text node
│   └── utils.ts         # General utilities
├── store/               # State management
│   ├── settings.ts      # Editor settings and preferences
│   └── presets.ts       # Rainbow text presets
├── constants/           # Application constants
│   └── colors.ts        # Color definitions and themes
└── types/               # TypeScript type definitions
    └── main.ts          # Core type interfaces
```

## Color System

### Built-in Minecraft Colors
The application includes all 16 standard Minecraft color codes with their corresponding hex values:
- Black (#000000) through White (#FFFFFF)
- Includes all standard Minecraft chat colors

### Editor Themes
Multiple visual themes to simulate different Minecraft environments:
- **Chat Dark/Light**: Simulates Minecraft chat interface
- **Book**: Simulates written book appearance
- **Wood Types**: 12 different wood types for sign simulation
- **Custom RGB**: Full RGB color support for Minecraft 1.16+

## Data Flow

### Input Processing
1. **Rich Text Editor**: User creates formatted text using WYSIWYG interface
2. **HTML Generation**: Lexical converts editor content to HTML
3. **Parsing**: HTML is parsed into structured Minecraft text fragments
4. **Code Generation**: Fragments are converted to Minecraft format codes

### Output Generation
1. **Format Detection**: System detects color and style changes
2. **Code Construction**: Builds Minecraft-compatible & codes
3. **Export Options**: Provides both EssentialsX and JSON formats
4. **Validation**: Checks character limits and format compatibility

## Development & Build

### Scripts
- `npm run dev`: Development server with hot reloading
- `npm run build`: Production build optimization
- `npm run preview`: Preview production build
- `npm run lint`: ESLint code quality checks
- `npm run clean`: Clean build artifacts

### Build System
- **Farm**: Rust-based build tool for fast compilation
- **TypeScript**: Full TypeScript support with strict checking
- **PostCSS**: Modern CSS processing with Tailwind integration
- **ESLint**: Comprehensive linting with React and TypeScript rules

## Browser Compatibility
- Modern browsers with ES6+ support
- Full CSS Grid and Flexbox support required
- Clipboard API support for copy functionality

## License & Attribution
- **License**: MIT License
- **Copyright**: 2020-2025 tcdw
- **Trademark**: Minecraft® is a trademark of Microsoft Corporation
- **Source**: Available on GitHub at https://github.com/tcdw/minecraft-text-editor

## Usage Requirements

### Server Requirements
- **EssentialsX Plugin**: Required for full color code support
- **Permissions**: Color and formatting permissions must be enabled for players
- **Minecraft Version**: 1.16+ for custom RGB color support
- **EssentialsX Version**: 2.18.0+ for RGB color compatibility

### Target Audience
- Third-party Minecraft server administrators
- Minecraft players who need advanced text formatting
- Server staff creating formatted messages or announcements
- Content creators making colored text for Minecraft content

This project represents a modern, well-architected approach to Minecraft text editing with a focus on user experience and compatibility with existing Minecraft server ecosystems.