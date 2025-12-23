import Link from 'next/link';
import { EnvelopeIcon, GlobeAltIcon, PhoneIcon, MapPinIcon, ShieldCheckIcon } from '@heroicons/react/24/solid';
import { Logo } from './Logo';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border/50 bg-surface text-text">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-background to-surface/50"></div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Logo />
            <p className="mt-6 text-sm text-text-muted leading-relaxed max-w-xs">
              Premium IPTV streaming with enterprise-grade security and worldwide content access. Licensed and trusted by millions.
            </p>
            <div className="mt-6 flex items-center gap-2">
              <ShieldCheckIcon className="h-5 w-5 text-green-500" />
              <span className="text-sm font-semibold text-text">Licensed & Secure</span>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold text-text mb-6">Services</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/plans" className="text-text-muted hover:text-primary transition-colors duration-300">Subscription Plans</Link></li>
              <li><Link href="/channels" className="text-text-muted hover:text-primary transition-colors duration-300">Channel Guide</Link></li>
              <li><Link href="/devices" className="text-text-muted hover:text-primary transition-colors duration-300">Device Support</Link></li>
              <li><Link href="/quality" className="text-text-muted hover:text-primary transition-colors duration-300">Streaming Quality</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-bold text-text mb-6">Support</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/help" className="text-text-muted hover:text-primary transition-colors duration-300">Help Center</Link></li>
              <li><Link href="/contact" className="text-text-muted hover:text-primary transition-colors duration-300">Contact Us</Link></li>
              <li><Link href="/status" className="text-text-muted hover:text-primary transition-colors duration-300">System Status</Link></li>
              <li><Link href="/refund-policy" className="text-text-muted hover:text-primary transition-colors duration-300">Refund Policy</Link></li>
            </ul>
          </div>

          {/* Contact & Legal */}
          <div>
            <h3 className="text-lg font-bold text-text mb-6">Contact Info</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <EnvelopeIcon className="h-4 w-4 text-primary" />
                </div>
                <a href="mailto:support@tvforall.store" className="text-text-muted hover:text-primary transition-colors duration-300">
                  support@tvforall.store
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="rounded-lg bg-secondary/10 p-2">
                  <PhoneIcon className="h-4 w-4 text-secondary" />
                </div>
                <span className="text-text-muted">24/7 Live Support</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="rounded-lg bg-accent/10 p-2">
                  <GlobeAltIcon className="h-4 w-4 text-accent" />
                </div>
                <span className="text-text-muted">EN / FR / AR</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="rounded-lg bg-green-500/10 p-2">
                  <MapPinIcon className="h-4 w-4 text-green-500" />
                </div>
                <span className="text-text-muted">Global Coverage</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-12 border-t border-border/50" />

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-6 text-sm text-text-muted">
            <p>© {currentYear} TVFORALL. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="/terms" className="hover:text-primary transition-colors duration-300">Terms of Service</Link>
              <Link href="/privacy" className="hover:text-primary transition-colors duration-300">Privacy Policy</Link>
              <Link href="/legal" className="hover:text-primary transition-colors duration-300">Legal</Link>
            </div>
          </div>
          <div className="flex gap-6">
            <a
              href="https://twitter.com/tvforall"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-surface/50 p-2 text-text-muted hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-110"
              aria-label="Follow us on Twitter"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            <a
              href="https://telegram.me/your_support"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-surface/50 p-2 text-text-muted hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-110"
              aria-label="Join our Telegram"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12.013 12.013 0 0 0-1.444.07 5.985 5.985 0 0 1 3.534 2.653L15.9 5.316a3.986 3.986 0 0 1 2.31 3.99 4.017 4.017 0 0 1-4.017 4.017 4.017 4.017 0 0 1-4.017-4.017A3.986 3.986 0 0 1 12.683 6L15.244 2.359A5.985 5.985 0 0 1 17.778.07 12.013 12.013 0 0 0 12 0zM9.5 6.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm5 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
              </svg>
            </a>
            <a
              href="https://discord.gg/your_server"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-surface/50 p-2 text-text-muted hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-110"
              aria-label="Join our Discord"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0189 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
