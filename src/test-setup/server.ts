import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

// Mock InstantDB API endpoints
const handlers = [
  // Mock auth endpoints
  http.post('https://api.instantdb.com/runtime/magic_codes', async () => {
    return HttpResponse.json({ success: true });
  }),

  http.post('https://api.instantdb.com/runtime/auth', async ({ request }) => {
    const body = (await request.json()) as any;

    if (body.magic_code) {
      // Mock successful login
      return HttpResponse.json({
        user: {
          id: 'test-user-id',
          email: body.email || 'test@example.com',
        },
        token: 'mock-auth-token',
      });
    }

    return HttpResponse.json({ error: 'Invalid code' }, { status: 400 });
  }),

  // Mock database queries
  http.post('https://api.instantdb.com/runtime/query', async () => {
    return HttpResponse.json({
      data: {
        poses: [],
        flows: [],
        profiles: [],
        favorites: [],
        transitions: [],
      },
    });
  }),

  // Mock database mutations
  http.post('https://api.instantdb.com/runtime/mutation', async () => {
    return HttpResponse.json({ success: true });
  }),
];

export const server = setupServer(...handlers);
