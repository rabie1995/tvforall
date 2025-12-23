import Link from 'next/link';
import { ShieldCheckIcon, ClockIcon, CheckCircleIcon, StarIcon } from '@heroicons/react/24/solid';

export function Hero() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-background via-background to-surface flex items-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-2 text-sm font-semibold text-primary backdrop-blur-sm">
              <ShieldCheckIcon className="h-4 w-4" />
              Secure IPTV Platform — Trusted by 10,000+ Users
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-black text-text leading-tight">
                Premium
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  Streaming
                </span>
                Experience
              </h1>
              <p className="text-xl text-text-muted max-w-xl leading-relaxed">
                Access thousands of channels worldwide with crystal-clear quality, instant activation, and 24/7 premium support. Pay securely with cryptocurrency.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/checkout?plan=plan_12m"
                className="group inline-flex items-center justify-center gap-3 rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-primary/25 transition-all duration-300 hover:bg-primary/90 hover:shadow-2xl hover:shadow-primary/30 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
              >
                <svg className="h-5 w-5 transition-transform group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Start Streaming Now
              </a>

              <Link
                href="#plans"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface/50 backdrop-blur-sm px-6 py-4 text-lg font-semibold text-text hover:bg-surface hover:border-primary/50 transition-all duration-300"
              >
                View Plans
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </Link>
            </div>

            {/* Trust Signals */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-text-muted">
              <div className="flex items-center gap-2">
                <ClockIcon className="h-4 w-4 text-secondary" />
                <span>Instant Activation</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="h-4 w-4 text-secondary" />
                <span>Secure Payments</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="h-4 w-4 text-secondary" />
                <span>24/7 Support</span>
              </div>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-4 pt-4 border-t border-border">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-secondary border-2 border-background" />
                ))}
              </div>
              <div className="text-sm text-text-muted">
                <div className="flex items-center gap-1">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <span className="font-semibold text-text">4.9/5</span>
                </div>
                <p>10,000+ satisfied customers</p>
              </div>
            </div>
          </div>

          {/* Right Content - Feature Showcase */}
          <div className="relative animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="relative">
              {/* Main Card */}
              <div className="rounded-2xl border border-border bg-surface/80 backdrop-blur-xl p-8 shadow-2xl hover:shadow-card-hover transition-all duration-500 hover:scale-105">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-text">Live Streaming</p>
                      <p className="text-sm text-text-muted">4K Ultra HD Quality</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 bg-secondary rounded-full animate-pulse" />
                    <span className="text-sm text-secondary font-medium">LIVE</span>
                  </div>
                </div>

                {/* Channel Grid */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { name: 'Sports HD', viewers: '2.1K' },
                    { name: 'Movies 4K', viewers: '1.8K' },
                    { name: 'News 24/7', viewers: '956' },
                    { name: 'Kids Zone', viewers: '742' },
                    { name: 'Documentary', viewers: '523' },
                    { name: 'Music TV', viewers: '389' },
                  ].map((channel, index) => (
                    <div
                      key={channel.name}
                      className="rounded-lg bg-surface-light p-3 hover:bg-primary/10 transition-colors cursor-pointer group"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded mb-2 group-hover:from-primary/30 group-hover:to-secondary/30 transition-all" />
                      <p className="text-xs font-medium text-text truncate">{channel.name}</p>
                      <p className="text-xs text-text-muted">{channel.viewers} watching</p>
                    </div>
                  ))}
                </div>

                {/* Payment Info */}
                <div className="rounded-xl bg-primary/10 border border-primary/20 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-secondary/20 flex items-center justify-center">
                        <svg className="h-4 w-4 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-text text-sm">Secure USDT Payment</p>
                        <p className="text-xs text-text-muted">Instant blockchain verification</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-secondary">$9.99</p>
                      <p className="text-xs text-text-muted">per month</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 animate-bounce-subtle">
                <div className="rounded-full bg-secondary/20 backdrop-blur-sm p-3 border border-secondary/30">
                  <CheckCircleIcon className="h-6 w-6 text-secondary" />
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 animate-bounce-subtle" style={{ animationDelay: '1s' }}>
                <div className="rounded-full bg-primary/20 backdrop-blur-sm p-3 border border-primary/30">
                  <ShieldCheckIcon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
