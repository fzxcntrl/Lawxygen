'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        username: email,
        password: password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.detail || 'Login failed' };
    }

    const data = await response.json();
    
    // Tradeoffs Discussion:
    // Storing JWT in an httpOnly cookie prevents XSS attacks since JavaScript cannot access it.
    // However, it means the client-side code cannot easily attach it to headers for direct API calls to the backend.
    // To solve this, we can proxy requests through Next.js API routes or fetch data on the server (Server Components) which can read the cookie.
    // LocalStorage would be easier for client-side API calls but is vulnerable to XSS.
    // We choose httpOnly cookies here for maximum security, as requested by "httpOnly-safe way".
    cookies().set('token', data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 60, // 30 minutes
    });

  } catch (error) {
    return { error: 'An unexpected error occurred' };
  }

  redirect('/dashboard');
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.detail || 'Signup failed' };
    }
  } catch (error) {
    return { error: 'An unexpected error occurred' };
  }

  redirect('/login');
}

export async function logout() {
  cookies().set('token', '', { 
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0 
  });
  redirect('/login');
}
