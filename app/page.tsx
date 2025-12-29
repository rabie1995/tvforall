import { Hero } from '@/components/Hero';
import { NavBar } from '@/components/NavBar';
import { PricingGrid } from '@/components/PricingCard';
import { Benefits } from '@/components/Benefits';
import { TrustBadges } from '@/components/TrustBadges';
import { Features } from '@/components/Features';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-text">
      <NavBar />
      <Hero />

      {/* Pricing Section - surfaced early for primary action */}
      <section id="plans" className="pt-16 pb-24 bg-surface/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text mb-4">Choose Your Plan</h2>
            <p className="text-text-muted text-lg max-w-3xl mx-auto">
              Flexible subscription pricing with instant activation. Subscribe securely with cryptocurrency and start streaming live sports, series, and movies right away.
            </p>
          </div>
          <PricingGrid />
        </div>
      </section>

      {/* Trust Signals Section */}
      <section className="py-16 bg-surface/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text mb-4">Trusted Streaming for US Sports & Entertainment</h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              Instant activation, secure crypto checkout, no contracts, and 24/7 support built for American sports fans and movie lovers
            </p>
          </div>
          <TrustBadges />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text mb-4">Why US Fans Choose TV For All</h2>
            <p className="text-text-muted text-lg max-w-3xl mx-auto">
              Stream live NFL, NBA, MLB, NHL plus top series and movies with low latency, uptime guarantees, and smooth HD quality
            </p>
          </div>
          <Features />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Benefits />
        </div>
      </section>

      {/* FAQ/Support Section */}
      <section id="support" className="py-20 bg-surface/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text mb-4">Get Started Today</h2>
            <p className="text-text-muted text-lg max-w-3xl mx-auto mb-8">
              Ready to experience premium streaming? Choose your subscription plan above and start watching in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/checkout?plan=plan_12m"
                className="inline-flex items-center justify-center gap-3 rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-primary/25 transition-all duration-300 hover:bg-primary/90 hover:shadow-2xl hover:shadow-primary/30 hover:scale-105"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Subscribe Securely
              </a>
              <a
                href="https://t.me/myiptv99"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 rounded-xl border border-border bg-surface/50 backdrop-blur-sm px-8 py-4 text-lg font-semibold text-text hover:bg-surface hover:border-primary/50 transition-all duration-300"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12.013 12.013 0 0 0-1.444.07 5.985 5.985 0 0 1 3.534 2.653L15.9 5.316a3.986 3.986 0 0 1 2.31 3.99 4.017 4.017 0 0 1-4.017 4.017 4.017 4.017 0 0 1-4.017-4.017A3.986 3.986 0 0 1 12.683 6L15.244 2.359A5.985 5.985 0 0 1 17.778.07 12.013 12.013 0 0 0 12 0zM9.5 6.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm5 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
                </svg>
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
