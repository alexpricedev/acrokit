# CLAUDE.md - Development Context & Guidelines

This file contains essential context and guidelines for Claude instances working on the AcroKit project.

## 🎯 Project Overview

AcroKit is a **constrained flow builder** for acroyoga sequences. The core concept is that users can only add poses that have valid transitions from their current sequence, preventing invalid flows.

### Key Principle: **Constraint-Based Building**
- Users cannot add invalid poses
- Only valid next moves are shown
- Each transition has a proper name (e.g., "Prasarita Twist")
- Sequential building with validation at each step

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
- **Schema**: Poses, transitions, and flows with proper relationships
- **Documentation**: Check `INSTANT.md` for InstantDB API reference, syntax, and best practices
- **Key Features**: Magic code auth, real-time queries, transactions, proper error handling
- **MCP**: You have access to the instant MCP server and can read data, push schema changes etc as you need

## 🧪 Testing Strategy

### Playwright Visual Testing
- **Purpose**: Test UI and user flows, validate design matches prototype
- **Key Commands**:
  ```bash
  npm run dev  # Start server (usually localhost:3000)
  npx playwright install  # Install browsers (one-time setup)
  ```
- **Testing Pattern**: Navigate → Screenshot → Interact → Screenshot
- **Example Usage**:
  ```typescript
  await mcp__playwright__browser_navigate({ url: "http://localhost:3000" })
  await mcp__playwright__browser_screenshot({ name: "homepage" })
  await mcp__playwright__browser_click({ selector: "button[class*='bg-blue-500']" })
  ```

### Design Validation
- **Key Elements**: Card layouts, gradient borders, difficulty tags
- **Colors**: Green (Easy), Blue (Medium), Red (Hard), Neutral grays

## 📁 Key Files & Responsibilities

### Core Components
- **`App.tsx`**: Main app, routing between builder/gallery, auth provider wrapper
- **`FlowBuilder.tsx`**: Main flow building logic, pose validation, constrained system
- **`FlowsGallery.tsx`**: Saved flows management, load/delete/share functionality
- **`AuthProvider.tsx`**: Authentication context, mock auth for demo
- **`Header.tsx`**: Navigation, user profile, sign in/out

### Data & Configuration  
- **`lib/instant.ts`**: InstantDB setup, TypeScript schemas
- **`tailwind.config.js`**: Tailwind CSS configuration

### UI Components
- **`PoseCard.tsx`**: Individual pose display with difficulty tags and gradients
- **`LoginModal.tsx`**: Magic link authentication flow
- **`FlowSaveModal.tsx`**: Flow saving interface with public/private settings

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
- **Primary**: localhost:3000
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

## 🔄 Data Flow Patterns

### Flow Building Process
1. User starts with empty flow
2. `getValidNextPoses()` filters available poses based on current flow end
3. User clicks "Add to flow" → `addPoseToFlow(pose, transition?)`
4. Flow state updates, UI re-renders with new valid options
5. Only last pose can be removed via `removeLastPose()`

### Save/Load Cycle
1. User builds flow → Save button enabled when authenticated
2. `FlowSaveModal` captures name, description, public setting
3. Flow serialized to localStorage (demo) or InstantDB (production)
4. `FlowsGallery` displays saved flows with management options
5. "Load & Edit" deserializes flow back to builder state

## 🔐 Authentication Patterns

```typescript
// Real InstantDB auth
const { user, isLoading } = db.useAuth()
await db.auth.sendMagicCode({ email })
```

## 📊 Database Schema

### Current Schema (InstantDB)
```typescript
type Schema = {
  $users: { id, email }
  poses: { id, name, description, difficulty, imageUrl?, baseImageUrl?, flyerImageUrl?, createdAt, isStartingPose? }
  transitions: { id, name, description?, fromPoseId, toPoseId, createdAt }
  flows: { id, name, description?, isPublic, userId, stepsData, createdAt, updatedAt }
  profiles: { id, displayName, createdAt, updatedAt }
  favorites: { id, profileId, poseId }
  comments: { id, content, createdAt, updatedAt }
}
```

### Data Relationships
- **Profiles** ↔ **$users** (one-to-one)
- **Poses** ↔ **Transitions** (many-to-many via fromPoseId/toPoseId)
- **Users** → **Flows** (one-to-many)
- **Flows** contain serialized `stepsData` (JSON of FlowStep[])
- **Favorites** → **Profiles** (many-to-one) ✨ **NEW SIMPLIFIED SYSTEM**
- **Favorites** → **Poses** (many-to-one) ✨ **NEW SIMPLIFIED SYSTEM**
- **Comments** → **Poses** (many-to-one)
- **Comments** → **Profiles** (many-to-one)

## 🎯 Testing Guidelines

### Before Making Changes
1. **Screenshot current state** with Playwright
2. **Test core flows**: Build flow → Save → Load → Edit
3. **Verify design consistency** with acrokit.com prototype
4. **Check TypeScript** with `npm run build`

### After Changes
1. **Visual regression testing** with screenshots
2. **User flow testing**: Full auth → build → save → load cycle
3. **Responsive testing**: Mobile and desktop views
4. **Error handling**: Invalid states, network issues

## 💡 Development Tips

### Working with Playwright
- Take screenshots at different viewport sizes for responsive testing
- Always wait for navigation before screenshots
- Use specific CSS selectors for interactions
- Capture screenshots to validate visual states
- Supports multiple browsers (Chromium, Firefox, WebKit)

### Component Patterns
- **Conditional rendering** based on auth state
- **Proper loading states** for async operations
- **Error boundaries** for graceful failures
- **Accessible markup** with proper ARIA labels

### State Management
- Keep auth in Context, local state in components
- Serialize complex state for persistence
- Use TypeScript interfaces for type safety
- Validate data on boundaries (user input, API responses)

## 🚀 Deployment Considerations

### Environment Variables
- `INSTANTDB_APP_ID`: Real app ID for production
- Consider environment-specific configurations

### Build Optimizations
- Tailwind CSS purging enabled
- TypeScript strict mode
- Modern browser targets

## 🚨 CRITICAL DEVELOPMENT WORKFLOW

### ⚠️ ALWAYS TEST IN BROWSER WITH PLAYWRIGHT

**MANDATORY**: Before and after ANY code changes, you MUST:

1. **Test with Playwright**: Use the browser tools to validate functionality
2. **Take screenshots**: Document current state vs expected state
3. **Test core flows**: Authentication → Flow Building → Saving → Loading

### Essential Testing Commands
```typescript
// Navigate to app
await mcp__playwright__browser_navigate({ url: "http://localhost:3000" })

// Take screenshots for validation
await mcp__playwright__browser_screenshot({ name: "current-state" })

// Test interactions
await mcp__playwright__browser_click({ selector: "button[class*='bg-blue-500']" })
await mcp__playwright__browser_fill({ selector: "input[type='email']", value: "test@example.com" })

// Execute JavaScript for complex interactions
await mcp__playwright__browser_evaluate({ script: "document.querySelector('button').click()" })
```

### Why This Matters
- **User Experience**: Every interaction must be smooth and intuitive  
- **Functionality**: Constrained flow system is complex and needs visual validation
- **Responsive Design**: Must work on mobile and desktop
- **Authentication Flow**: Multi-step process requires browser testing

**DO NOT** make changes without browser testing - this is a visual, interactive application that requires real browser validation.
