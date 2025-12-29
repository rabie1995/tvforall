'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import { trackEvent } from '@/lib/analytics';

export function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  
  const handleSubscribe = () => {
    trackEvent('click_subscribe', { cta: 'navbar', plan_id: 'plan_12m' });
    trackEvent('cta_primary_click', { location: 'navbar', plan_id: 'plan_12m' });
  };

  const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#plans', label: 'Plans' },
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#support', label: 'Support' }
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0A0B0E]/80 backdrop-blur-xl shadow-sm">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center transition-opacity hover:opacity-80"
            aria-label="tvforall home"
          >
            <Logo animated={true} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" role="navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-[15px] font-medium tracking-wide text-gray-300 transition-colors duration-200 hover:text-white group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 h-[2px] w-0 bg-gradient-to-r from-primary/0 via-primary to-primary/0 transition-all duration-300 ease-out group-hover:w-full group-hover:left-0" />
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/checkout?plan=plan_12m"
              onClick={handleSubscribe}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-primary to-primary/90 px-6 py-2.5 text-[15px] font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <span className="relative z-10">Subscribe</span>
              <svg className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/10 to-primary/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden relative z-50 p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            <svg 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
          
          {/* Mobile Menu Drawer */}
          <div 
            className="absolute right-0 top-0 h-full w-full max-w-sm bg-[#0A0B0E] border-l border-white/10 shadow-2xl animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-full flex-col">
              {/* Mobile Header */}
              <div className="flex items-center justify-between border-b border-white/10 p-6">
                <span className="text-lg font-semibold text-white">Menu</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                  aria-label="Close menu"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Mobile Navigation Links */}
              <nav className="flex-1 overflow-y-auto p-6" role="navigation">
                <div className="space-y-1">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block rounded-lg px-4 py-3.5 text-[16px] font-medium text-gray-300 transition-all duration-200 hover:bg-white/5 hover:text-white hover:pl-6"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </nav>

              {/* Mobile CTA */}
              <div className="border-t border-white/10 p-6">
                <Link
                  href="/checkout?plan=plan_12m"
                  onClick={() => {
                    handleSubscribe();
                    setMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary/90 px-6 py-4 text-[16px] font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-200 hover:shadow-xl hover:shadow-primary/40"
                >
                  Subscribe Now
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
