import { vi } from 'vitest';

// Mock schema builder functions with chainable methods
const createChainableMock = () => ({
  unique: vi.fn(() => createChainableMock()),
  indexed: vi.fn(() => createChainableMock()),
  optional: vi.fn(() => createChainableMock()),
});

const mockSchemaBuilder = {
  schema: vi.fn(def => def),
  entity: vi.fn(def => def),
  string: vi.fn(() => createChainableMock()),
  number: vi.fn(() => createChainableMock()),
  boolean: vi.fn(() => createChainableMock()),
  date: vi.fn(() => createChainableMock()),
  json: vi.fn(() => createChainableMock()),
};

// Mock InstantDB React library
vi.mock('@instantdb/react', () => ({
  init: vi.fn(() => ({
    auth: {
      sendMagicCode: vi.fn().mockResolvedValue(undefined),
      signInWithMagicCode: vi.fn().mockResolvedValue(undefined),
      signOut: vi.fn(),
    },
    useAuth: vi.fn(() => ({
      user: null,
      isLoading: false,
    })),
    useQuery: vi.fn(() => ({
      data: {},
      isLoading: false,
      error: null,
    })),
    transact: vi.fn().mockResolvedValue(undefined),
  })),
  id: vi.fn(() => 'mock-id'),
  i: mockSchemaBuilder,
}));

// Mock useAuthWithProfile hook
vi.mock('../hooks/useAuthWithProfile', () => ({
  useAuthWithProfile: vi.fn(() => ({
    user: null,
    profile: null,
    isLoading: false,
    needsDisplayName: false,
  })),
}));
