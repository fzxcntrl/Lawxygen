'use server';

import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function generateDraft(formData: FormData) {
  const token = cookies().get('token')?.value;
  if (!token) return { error: 'Unauthorized' };

  const data = {
    sender_details: formData.get('sender_details') as string,
    recipient_details: formData.get('recipient_details') as string,
    subject: formData.get('subject') as string,
    facts: formData.get('facts') as string,
    relief_sought: formData.get('relief_sought') as string,
    deadline: formData.get('deadline') as string,
  };

  try {
    const res = await fetch(`${API_URL}/drafts/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return { error: errorData.detail || `Generation failed with status ${res.status}` };
    }

    return await res.json();
  } catch (e) {
    return { error: 'Failed to communicate with the backend API.' };
  }
}

export async function getDrafts() {
  const token = cookies().get('token')?.value;
  if (!token) return { error: 'Unauthorized', drafts: [] };

  try {
    const res = await fetch(`${API_URL}/drafts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      return { error: 'Failed to fetch past drafts', drafts: [] };
    }

    const drafts = await res.json();
    return { drafts };
  } catch (e) {
    return { error: 'Failed to communicate with the backend API.', drafts: [] };
  }
}
