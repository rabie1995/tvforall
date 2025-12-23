import Link from 'next/link';
import { Logo } from './Logo';

export function NavBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur-lg shadow-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center">
          <Logo animated={true} />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="#features"
            className="text-text-muted hover:text-text transition-colors duration-200 font-medium"
          >
            Features
          </Link>
          <Link
            href="#plans"
            className="text-text-muted hover:text-text transition-colors duration-200 font-medium"
          >
            Plans
          </Link>
          <Link
            href="#support"
            className="text-text-muted hover:text-text transition-colors duration-200 font-medium"
          >
            Support
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="/checkout?plan=plan_12m"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-200 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Get Started
          </a>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-light transition-colors">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
