# Testing Setup

This directory contains the Vitest testing setup with Mock Service Worker (MSW) for testing authenticated flows in AcroKit.

## Directory Structure

```
src/
├── test-setup/          # Test configuration and utilities
│   ├── setup.ts         # Global test setup, configures MSW and jest-dom
│   ├── server.ts        # MSW server configuration with InstantDB API mocks
│   ├── mocks.ts         # Mock implementations for InstantDB React library
│   └── test-utils.tsx   # Custom render functions and testing utilities
└── __tests__/           # Actual test files
    └── example.test.tsx # Example tests demonstrating the setup
```

## Files

- **`setup.ts`** - Global test setup, configures MSW and jest-dom
- **`server.ts`** - MSW server configuration with InstantDB API mocks
- **`mocks.ts`** - Mock implementations for InstantDB React library
- **`test-utils.tsx`** - Custom render functions and testing utilities

## Usage

### Running Tests

```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:ui       # Run tests with UI interface
npm run test:coverage # Run tests with coverage report
```

### Writing Tests

```typescript
import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { useAuthWithProfile } from '../hooks/useAuthWithProfile'

// Mock the auth hook
vi.mock('../hooks/useAuthWithProfile')
const mockUseAuthWithProfile = vi.mocked(useAuthWithProfile)

// Mock authenticated user
mockUseAuthWithProfile.mockReturnValue({
  user: { id: 'test-user', email: 'test@example.com' },
  profile: { id: 'test-profile', displayName: 'Test User' },
  isLoading: false,
  needsDisplayName: false,
})
```

### Testing Authenticated Components

Use the provided test utilities for different auth states:

```typescript
import { renderWithAuth, renderWithoutAuth } from '../test-setup/test-utils'

// Test with authenticated user
renderWithAuth(<MyComponent />)

// Test with unauthenticated user  
renderWithoutAuth(<MyComponent />)
```

### Writing Tests in __tests__ Directory

Create your test files in the `src/__tests__/` directory:

```typescript
// src/__tests__/MyComponent.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MyComponent } from '../components/MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })
})
```

## Mock Service Worker (MSW)

MSW intercepts network requests and provides mock responses for:

- InstantDB authentication endpoints
- Database query endpoints  
- Database mutation endpoints

This allows testing of complete user flows without hitting real APIs.

## Key Features

- ✅ Vitest for fast, modern testing
- ✅ React Testing Library for component testing
- ✅ MSW for API mocking
- ✅ InstantDB authentication mocking
- ✅ TypeScript support
- ✅ jsdom environment for DOM testing