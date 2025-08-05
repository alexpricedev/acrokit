# CLAUDE.md - Development Context & Guidelines

This file contains essential context and guidelines for Claude instances working on the AcroKit project.

## 🏗️ Architecture Decisions

### Authentication System
- **Current**: Real InstantDB authentication with magic codes (6-digit verification)
- **Implementation**: Uses `db.useAuth()` for real-time auth state
- **Auth Flow**: Email → Magic code → 6-digit verification → Sign in
- **File**: `/src/components/AuthProvider.tsx` - Real InstantDB auth integrated

### Railway PR Deployments
- Each new PR will get a unique testing deployment on Railway
- The URL to this deployment should be included in the PR description
- The URL will always follow this format: `acrokit-acrokit-pr-XX.up.railway.app` where XX is the number of the PR

### State Management
- **Flow Building**: Local React state in `FlowBuilder.tsx`
- **Auth**: React Context in `AuthProvider.tsx` with real InstantDB integration
- **Persistence**: InstantDB real-time database with optimistic updates
- **Page Routing**: Simple state-based routing in `App.tsx` with shared flow support
- **Notifications**: Global ToastProvider for user feedback

### InstantDB Integration
- **Database**: Real-time database with optimistic updates and real auth
- **App ID**: `63c65c15-20c2-418f-b504-a823ecadb2d0` (production)
- **Schema**: Poses, transitions, favorites, and flows with proper entity relationships
- **Data Standards**: Difficulty levels use "Easy", "Medium", "Hard"; All dates use ISO string format "2025-07-07T20:50:38.091Z"
- **Documentation**: Check `INSTANT.md` for InstantDB API reference, syntax, and best practices
- **Key Features**: Magic code auth, real-time queries, transactions, proper error handling
- **MCP**: You have access to the instant MCP server and can read data, push schema changes etc as you need
- **Entity Linking**: All relationships use proper InstantDB entity linking (transitions ↔ poses, favorites ↔ poses/profiles) instead of foreign keys

## 🧪 Testing Strategy

### Vitest with Mock Service Worker
- **Testing Framework**: Vitest for fast unit and integration tests
- **Mocking**: Mock Service Worker (MSW) for API and authentication mocking
- **Test Environment**: jsdom for DOM simulation
- **React Testing**: @testing-library/react for component testing
- **Commands**:
  ```bash
  npm test              # Run all tests
  npm run test:watch    # Run tests in watch mode
  npm run test:ui       # Run tests with UI
  ```

### Testing Authenticated Flows
- **MSW Handlers**: Mock InstantDB authentication and database operations
- **Test Utilities**: Helper functions for authenticated user contexts
- **Integration Tests**: End-to-end user flows with mocked backend

## 🔧 Development Commands

### Essential Commands
```bash
npm run dev          # Start development server (assume always running)
npm run build        # Check TypeScript errors
npm run lint         # Check code quality with ESLint
npm run lint:fix     # Auto-fix linting issues
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
```

**Note**: Always assume the dev server is running when testing - don't start it manually.

### Code Quality Tools
- **ESLint**: Code linting with TypeScript and React rules
- **Prettier**: Code formatting with consistent style
- **Configuration Files**: `.eslintrc.cjs`, `.prettierrc`, `.prettierignore`

### Server Ports
- **Primary**: localhost:3000 (should always be running, no need to manually run it yourself)
- **Fallback**: localhost:3001, localhost:3002 (if ports occupied)

## 🎨 Design System

### Color Palette
- **Difficulty**: Green (beginner/easy), Blue (intermediate/medium), Red (advanced/hard)
- **Gradients**: Used on card borders, difficulty-based
- **Neutral**: Grays for text, whites for cards, subtle backgrounds

### Layout Patterns
- **Two-column**: Flow panel (left) + Available poses (right)
- **Card-based**: Rounded corners, shadows, hover effects
- **Responsive**: Mobile-first, grid layouts

### Typography
- **Headers**: Bold, proper hierarchy
- **Body**: Clean sans-serif, good contrast
- **Interactive**: Proper hover states, transitions

## 📊 Database Schema

Check the `src/lib/` dir for the schema files and context on the DB set up. Also refer to `INSTANT.md` when making any DB changes.

## 🎯 Testing Guidelines

### Test Coverage Areas
1. **Authentication flows**: Login, logout, session persistence
2. **Flow building**: Creating, editing, saving flows
3. **Component rendering**: UI components with different states
4. **Data operations**: CRUD operations with mocked InstantDB

### Best Practices
- **Mock external dependencies**: Use MSW for all API calls
- **Test user interactions**: Focus on user behavior rather than implementation
- **Authenticated contexts**: Test components with logged-in users
- **Error scenarios**: Test error handling and edge cases
