'use client';

import { useState } from 'react';
import { searchDocs } from '../../actions/search';
import { Search, ArrowLeft, ExternalLink, Scale } from 'lucide-react';
import Link from 'next/link';

export default function ResearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setError(null);
    
    const { results, error } = await searchDocs(query);
    
    if (error) {
      setError(error);
    } else {
      setResults(results || []);
    }
    
    setHasSearched(true);
    setIsSearching(false);
  };

  return (
    <div className="animate-in fade-in duration-500 w-full max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-slate-100 dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <Scale className="w-5 h-5 text-slate-800 dark:text-slate-200" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Legal Research</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Semantic search across Contract Act & Supreme Court Judgments</p>
          </div>
        </div>
        
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Is a verbal contract binding?"
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all text-slate-900 dark:text-slate-100"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching || !query.trim()}
            className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold transition-all disabled:opacity-70 flex justify-center items-center shrink-0"
          >
            {isSearching ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching...
              </span>
            ) : 'Search'}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 text-sm text-red-700 bg-red-50 rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <div className="mt-8 space-y-4">
          {hasSearched && !isSearching && results.length === 0 && !error && (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-950/50">
              <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-700 dark:text-slate-300 font-medium">No relevant documents found.</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Try phrasing your question differently.</p>
            </div>
          )}

          {results.map((result, idx) => (
            <div key={idx} className="border border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:border-slate-300 dark:border-slate-700 hover:shadow-sm transition-all bg-white dark:bg-slate-900">
              <div className="flex justify-between items-start mb-3 gap-4">
                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 leading-snug">{result.title}</h3>
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-green-50 text-green-700 border border-green-100 shrink-0">
                  {(result.score * 100).toFixed(1)}% Match
                </span>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-100 dark:border-slate-800 mb-4">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-serif">
                  "...{result.chunk_text.replace(/<[^>]*>?/gm, '')}..."
                </p>
              </div>
              
              <div className="flex items-center justify-between pt-3">
                <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">
                  ID: {result.doc_id}
                </span>
                <a 
                  href={result.source_url}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  View Source <ExternalLink className="w-4 h-4 ml-1.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
