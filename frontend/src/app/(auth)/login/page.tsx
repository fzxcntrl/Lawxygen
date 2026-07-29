'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { login } from '../../actions/auth';
import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setError(null);
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);
    
    const result = await login(formData);
    if (result?.error) {
      setError(result.error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-slate-900 rounded-lg shadow-md border border-slate-100 dark:border-slate-800">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Welcome Back</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Log in to Legal-Tech Co-Counsel</p>
        </div>
        
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
            <input 
              {...register('email')}
              type="email"
              placeholder="Email address"
              className="appearance-none rounded-t-lg relative block w-full px-4 py-3 border border-slate-300 dark:border-slate-700 placeholder-slate-400 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 rounded-t-md focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 focus:z-10 sm:text-sm"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
            <div className="relative">
              <input 
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="appearance-none rounded-b-lg relative block w-full px-4 py-3 pr-10 border border-slate-300 dark:border-slate-700 placeholder-slate-400 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 rounded-b-md focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 focus:z-10 sm:text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-500 z-20"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <div className="text-center text-sm">
          <span className="text-slate-500 dark:text-slate-400">Don't have an account? </span>
          <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign up
          </Link>
        </div>
      </div>
    </main>
  );
}
