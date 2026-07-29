import Link from 'next/link';
import { logout } from '../actions/auth';
import { Scale, LogOut, FileText, Search, LayoutDashboard } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors">
      {/* Top Navigation Bar */}
      <header className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Branding / Logo */}
            <div className="flex-shrink-0 flex items-center gap-2">
              <Scale className="w-6 h-6 text-blue-400" />
              <Link href="/dashboard" className="text-xl font-bold tracking-tight hover:text-slate-200 transition-colors">
                Lawxygen<span className="text-blue-400 font-light">Co-Counsel</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              <Link href="/dashboard" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
              <Link href="/dashboard/draft" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
                <FileText className="w-4 h-4 mr-2" />
                Drafting
              </Link>
              <Link href="/dashboard/research" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
                <Search className="w-4 h-4 mr-2" />
                Research
              </Link>
            </nav>

            {/* User Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              <ThemeToggle />
              <form action={logout}>
                <button 
                  type="submit" 
                  className="flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-1 md:mr-2" />
                  <span className="hidden md:inline">Log out</span>
                </button>
              </form>
            </div>
            
          </div>
        </div>
        
        {/* Mobile Navigation (Bottom bar approach for simpler responsiveness) */}
        <div className="md:hidden border-t border-slate-800 bg-slate-900">
          <div className="flex justify-around px-2 py-2">
            <Link href="/dashboard" className="flex flex-col items-center p-2 text-xs font-medium text-slate-400 hover:text-white">
              <LayoutDashboard className="w-5 h-5 mb-1" />
              Dashboard
            </Link>
            <Link href="/dashboard/draft" className="flex flex-col items-center p-2 text-xs font-medium text-slate-400 hover:text-white">
              <FileText className="w-5 h-5 mb-1" />
              Drafting
            </Link>
            <Link href="/dashboard/research" className="flex flex-col items-center p-2 text-xs font-medium text-slate-400 hover:text-white">
              <Search className="w-5 h-5 mb-1" />
              Research
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </div>
    </div>
  );
}
