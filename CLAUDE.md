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

### Data Flow
```
Sample Data (sampleData.ts) 
  → FlowBuilder state 
  → InstantDB real-time database
  → Toast notifications for user feedback
```

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

## 🧪 Testing Strategy

### Puppeteer Visual Testing
- **Purpose**: Test UI and user flows, validate design matches prototype
- **Key Commands**:
  ```bash
  npm run dev  # Start server (usually localhost:3000)
  ```
- **Testing Pattern**: Navigate → Screenshot → Interact → Screenshot
- **Example Usage**:
  ```typescript
  await mcp__puppeteer__puppeteer_navigate({ url: "http://localhost:3000" })
  await mcp__puppeteer__puppeteer_screenshot({ name: "feature-test" })
  await mcp__puppeteer__puppeteer_click({ selector: "button[class*='bg-blue-500']" })
  ```

### Design Validation
- **Reference**: acrokit.com prototype
- **Key Elements**: Card layouts, gradient borders, difficulty tags, two-column layout
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
- **`data/sampleData.ts`**: Sample poses and transitions for demo
- **`tailwind.config.js`**: Tailwind CSS configuration

### UI Components
- **`PoseCard.tsx`**: Individual pose display with difficulty tags and gradients
- **`LoginModal.tsx`**: Magic link authentication flow
- **`FlowSaveModal.tsx`**: Flow saving interface with public/private settings

## 🔧 Development Commands

### Essential Commands
```bash
npm run dev          # Start development server
npm run build        # Check TypeScript errors
npm run lint         # Check code quality
```

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

## 🐛 Known Issues & Areas for Improvement

### Current Issues
1. **Flow Loading**: Loading flows from gallery to builder needs refinement
2. **Auth Integration**: Using mock auth instead of real InstantDB
3. **Data Persistence**: localStorage instead of real database

### Future Enhancements
1. **Real InstantDB Integration**: Replace mock auth and localStorage
2. **Image Support**: Add pose images to cards
3. **Advanced Filtering**: Difficulty-based filtering in gallery
4. **Flow Sharing**: Improve sharing UX and URL handling

## 🔐 Authentication Patterns

### Current (Demo)
```typescript
// Mock auth in AuthProvider.tsx
const [mockUser, setMockUser] = useState<any>(null)
// Simulate login with timeout
setTimeout(() => setMockUser({ id: 'demo-user', email }), 1000)
```

### Production Pattern
```typescript
// Real InstantDB auth
const { user, isLoading } = db.useAuth()
await db.auth.sendMagicCode({ email })
```

## 📊 Database Schema

### Current Schema (InstantDB)
```typescript
type Schema = {
  poses: { id, name, description, difficulty, imageUrl?, createdAt }
  transitions: { id, name, description?, fromPoseId, toPoseId, createdAt }
  flows: { id, name, description?, isPublic, userId, stepsData, createdAt, updatedAt }
  users: { id, email, createdAt }
}
```

### Data Relationships
- **Poses** ↔ **Transitions** (many-to-many via fromPoseId/toPoseId)
- **Users** → **Flows** (one-to-many)
- **Flows** contain serialized `stepsData` (JSON of FlowStep[])

## 🎯 Testing Guidelines

### Before Making Changes
1. **Screenshot current state** with Puppeteer
2. **Test core flows**: Build flow → Save → Load → Edit
3. **Verify design consistency** with acrokit.com prototype
4. **Check TypeScript** with `npm run build`

### After Changes
1. **Visual regression testing** with screenshots
2. **User flow testing**: Full auth → build → save → load cycle
3. **Responsive testing**: Mobile and desktop views
4. **Error handling**: Invalid states, network issues

## 💡 Development Tips

### Working with Puppeteer
- Use `width: 1200, height: 800` for desktop testing
- Use `width: 375, height: 667` for mobile testing
- Always wait for navigation before screenshots
- Use CSS selectors, avoid text-based selectors when possible

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

### ⚠️ ALWAYS TEST IN BROWSER WITH PUPPETEER MCP

**MANDATORY**: Before and after ANY code changes, you MUST:

1. **Start the dev server**: `npm run dev` 
2. **Test with Puppeteer MCP**: Use the browser tools to validate functionality
3. **Take screenshots**: Document current state vs expected state
4. **Test core flows**: Authentication → Flow Building → Saving → Loading
5. **Verify design**: Compare against acrokit.com prototype

### Essential Testing Commands
```typescript
// Navigate to app
await mcp__puppeteer__puppeteer_navigate({ url: "http://localhost:3000" })

// Take screenshots for validation
await mcp__puppeteer__puppeteer_screenshot({ name: "feature-test", width: 1200, height: 800 })

// Test interactions
await mcp__puppeteer__puppeteer_click({ selector: "button[class*='bg-blue-500']" })
await mcp__puppeteer__puppeteer_fill({ selector: "input[type='email']", value: "test@example.com" })
```

### Why This Matters
- **Visual Design**: Must match acrokit.com prototype exactly
- **User Experience**: Every interaction must be smooth and intuitive  
- **Functionality**: Constrained flow system is complex and needs visual validation
- **Responsive Design**: Must work on mobile and desktop
- **Authentication Flow**: Multi-step process requires browser testing

**DO NOT** make changes without browser testing - this is a visual, interactive application that requires real browser validation.

---

**Remember**: This is a constrained flow builder - the validation system is the core feature that makes AcroKit unique. Always preserve the constraint logic when making changes!