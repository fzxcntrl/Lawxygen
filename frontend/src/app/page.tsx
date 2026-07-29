export default async function Home() {
  let healthStatus = "Loading...";
  try {
    // We use no-store to ensure we're getting real-time status on each refresh
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/health`, { cache: 'no-store' });
    const data = await res.json();
    healthStatus = data.message;
  } catch (error) {
    healthStatus = "Backend is unreachable";
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-50 dark:bg-slate-950">
      <h1 className="text-4xl font-bold mb-4 text-slate-800 dark:text-slate-200">Mini Legal-Tech Co-Counsel</h1>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 max-w-lg text-center">
        Your AI-powered legal assistant. Fast, reliable, and ready to help.
      </p>
      
      <div className="flex gap-4 mb-8">
        <a href="/login" className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors">
          Log In
        </a>
        <a href="/signup" className="px-6 py-2 bg-white dark:bg-slate-900 text-indigo-600 font-medium rounded-md border border-indigo-200 hover:bg-indigo-50 transition-colors">
          Sign Up
        </a>
      </div>

      <div className="p-6 bg-white dark:bg-slate-900 rounded-lg shadow-md border border-slate-100 dark:border-slate-800">
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Backend API Status: <span className="font-semibold text-indigo-600">{healthStatus}</span>
        </p>
      </div>
    </main>
  );
}
