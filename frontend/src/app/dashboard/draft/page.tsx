'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { generateDraft } from '../../actions/drafts';
import { useState } from 'react';
import { Copy, Download, ArrowLeft, FileText } from 'lucide-react';
import Link from 'next/link';

const draftSchema = z.object({
  sender_details: z.string().min(5, 'Required'),
  recipient_details: z.string().min(5, 'Required'),
  subject: z.string().min(5, 'Required'),
  facts: z.string().min(20, 'Provide at least a brief description of facts'),
  relief_sought: z.string().min(5, 'Required'),
  deadline: z.string().min(2, 'Required'),
});

type DraftFormValues = z.infer<typeof draftSchema>;

export default function DraftPage() {
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<DraftFormValues>({
    resolver: zodResolver(draftSchema),
  });

  const onSubmit = async (data: DraftFormValues) => {
    setError(null);
    setDraft(null);
    setIsCopied(false);
    
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    
    const result = await generateDraft(formData);
    
    if (result?.error) {
      setError(result.error);
    } else if (result?.generated_text) {
      setDraft(result.generated_text);
    }
  };

  const copyToClipboard = async () => {
    if (draft) {
      await navigator.clipboard.writeText(draft);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const downloadTxt = () => {
    if (draft) {
      const element = document.createElement("a");
      const file = new Blob([draft], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = "legal_notice.txt";
      document.body.appendChild(element); // Required for this to work in FireFox
      element.click();
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 h-fit">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-50 p-2.5 rounded-lg border border-blue-100">
              <FileText className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Draft Legal Notice</h2>
            </div>
          </div>
          
          {error && (
            <div className="mb-6 p-4 text-sm text-red-700 bg-red-50 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1.5">Sender Details</label>
              <input {...register('sender_details')} placeholder="Name, Address, Contact" className="block w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
              {errors.sender_details && <p className="text-red-500 text-xs mt-1.5">{errors.sender_details.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1.5">Recipient Details</label>
              <input {...register('recipient_details')} placeholder="Name, Address" className="block w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
              {errors.recipient_details && <p className="text-red-500 text-xs mt-1.5">{errors.recipient_details.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1.5">Subject</label>
              <input {...register('subject')} placeholder="e.g. Legal Notice for Breach of Contract" className="block w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
              {errors.subject && <p className="text-red-500 text-xs mt-1.5">{errors.subject.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1.5">Facts of the Matter</label>
              <textarea {...register('facts')} rows={5} placeholder="Describe what happened..." className="block w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none" />
              {errors.facts && <p className="text-red-500 text-xs mt-1.5">{errors.facts.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">Relief Sought</label>
                <input {...register('relief_sought')} placeholder="e.g. Payment of Rs. 100,000" className="block w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                {errors.relief_sought && <p className="text-red-500 text-xs mt-1.5">{errors.relief_sought.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">Deadline to Respond</label>
                <input {...register('deadline')} placeholder="e.g. 15 days" className="block w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                {errors.deadline && <p className="text-red-500 text-xs mt-1.5">{errors.deadline.message}</p>}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 rounded-lg shadow-sm text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:opacity-70 transition-all mt-6"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Drafting with Groq...
                </span>
              ) : 'Generate Legal Notice'}
            </button>
          </form>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 flex flex-col h-[850px]">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-800">Generated Draft</h2>
            {draft && (
              <div className="flex gap-2">
                <button onClick={copyToClipboard} className="flex items-center text-xs font-semibold px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors">
                  <Copy className="w-3.5 h-3.5 mr-1.5" /> {isCopied ? 'Copied!' : 'Copy'}
                </button>
                <button onClick={downloadTxt} className="flex items-center text-xs font-semibold px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition-colors border border-blue-100">
                  <Download className="w-3.5 h-3.5 mr-1.5" /> Download
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto bg-slate-50 p-6 rounded-lg border border-slate-200 shadow-inner">
            {draft ? (
              <pre className="whitespace-pre-wrap font-serif text-sm text-slate-800 leading-relaxed">
                {draft}
              </pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <FileText className="w-12 h-12 text-slate-300 mb-3" />
                <p className="text-sm font-medium text-slate-500">Your draft will appear here.</p>
                <p className="text-xs mt-1">Fill out the form and generate to begin.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
