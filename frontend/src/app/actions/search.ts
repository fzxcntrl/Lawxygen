'use server';

import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function searchDocs(query: string) {
  const token = cookies().get('token')?.value;
  if (!token) return { error: 'Unauthorized', results: [] };

  try {
    const res = await fetch(`${API_URL}/research/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
      cache: 'no-store',
    });

    if (!res.ok) {
      return { error: `Search failed with status ${res.status}`, results: [] };
    }

    const results = await res.json();
    return { results };
  } catch (e) {
    return { error: 'Failed to communicate with the backend API.', results: [] };
  }
}
