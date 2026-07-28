import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getDrafts } from '../actions/drafts';
import Link from 'next/link';
import { FileText, Search, ArrowRight } from 'lucide-react';

export default async function DashboardPage() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  const { drafts, error } = await getDrafts();

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      
      {/* Welcome / Summary Section */}
      <section className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome to Lawxygen</h1>
        <p className="text-slate-600 mt-2 max-w-2xl text-lg">
          Your AI-powered legal assistant. Draft notices customized to the Indian context or research specific case laws and acts in seconds.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Drafting Card */}
          <Link href="/dashboard/draft" className="group block bg-slate-50 rounded-lg p-6 border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white p-3 rounded-md shadow-sm border border-slate-100 group-hover:border-blue-200 transition-colors">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Draft Documents</h2>
            <p className="text-slate-600 text-sm">
              Generate structured, legally sound documents like Legal Notices based on specific facts and details.
            </p>
          </Link>

          {/* Research Card */}
          <Link href="/dashboard/research" className="group block bg-slate-50 rounded-lg p-6 border border-slate-200 hover:border-slate-800 hover:bg-slate-900 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white p-3 rounded-md shadow-sm border border-slate-100 group-hover:border-slate-700 transition-colors">
                <Search className="w-6 h-6 text-slate-800" />
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 group-hover:text-white mb-2 transition-colors">Search Library</h2>
            <p className="text-slate-600 text-sm group-hover:text-slate-300 transition-colors">
              Query the Indian Contract Act and relevant Supreme Court judgments to find supporting legal principles.
            </p>
          </Link>
        </div>
      </section>

      {/* Past Drafts Section */}
      <section className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Past Drafts</h2>
        
        {error && (
          <p className="text-red-600 mb-4 p-4 bg-red-50 rounded-md border border-red-100 text-sm">{error}</p>
        )}

        {!drafts || drafts.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-slate-700 mb-1">No drafts yet</h3>
            <p className="text-slate-500 mb-6 text-sm">You haven't generated any legal documents yet.</p>
            <Link 
              href="/dashboard/draft" 
              className="inline-flex items-center px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 font-medium text-sm transition-colors"
            >
              Create your first draft
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {drafts.map((draft: any) => (
              <div key={draft.id} className="border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-slate-300 transition-all bg-white flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                    {draft.document_type}
                  </span>
                  <span className="text-xs text-slate-500 font-medium bg-slate-50 px-2 py-1 rounded">
                    {new Date(draft.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                
                <div className="flex-1 mb-4">
                  <h3 className="text-base font-bold text-slate-900 line-clamp-1 mb-1" title={JSON.parse(draft.input_fields_json).subject}>
                    {JSON.parse(draft.input_fields_json).subject || 'Untitled Draft'}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-2">
                    <span className="font-medium text-slate-700">To:</span> {JSON.parse(draft.input_fields_json).recipient_details}
                  </p>
                </div>
                
                <div className="mt-auto pt-4 border-t border-slate-100">
                  <details className="group/details text-sm">
                    <summary className="text-blue-600 cursor-pointer hover:text-blue-800 font-medium list-none flex items-center justify-between">
                      <span>View Content</span>
                      <span className="text-slate-400 group-open/details:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200 shadow-inner max-h-64 overflow-y-auto">
                      <pre className="whitespace-pre-wrap font-serif text-[11px] leading-relaxed text-slate-800">
                        {draft.generated_text}
                      </pre>
                    </div>
                  </details>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      
    </div>
  );
}
