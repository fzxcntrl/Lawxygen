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
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-50">
      <h1 className="text-4xl font-bold mb-4 text-slate-800">Mini Legal-Tech Co-Counsel</h1>
      <p className="text-lg text-slate-500 mb-8 max-w-lg text-center">
        Your AI-powered legal assistant. Fast, reliable, and ready to help.
      </p>
      <div className="p-6 bg-white rounded-lg shadow-md border border-slate-100">
        <p className="text-lg text-slate-600">
          Backend API Status: <span className="font-semibold text-indigo-600">{healthStatus}</span>
        </p>
      </div>
    </main>
  );
}
