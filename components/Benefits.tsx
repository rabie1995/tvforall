import { ShieldCheckIcon, CheckCircleIcon, ChatBubbleLeftRightIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';

const benefits = [
  {
    title: 'Secure payments',
    description: 'USDT payments with address + amount verification. We never store private keys.',
    badge: 'Crypto-native',
    icon: ShieldCheckIcon
  },
  {
    title: 'Instant activation',
    description: 'Orders are provisioned automatically after on-chain confirmations. Manual override available.',
    badge: 'Fast',
    icon: CheckCircleIcon
  },
  {
    title: '24/7 support',
    description: 'Live agents in English, French, and Arabic with remote troubleshooting.',
    badge: 'Humans only',
    icon: ChatBubbleLeftRightIcon
  },
  {
    title: 'Legal & licensed',
    description: 'All streams provided by the client with valid rights. No piracy or scraping.',
    badge: 'Compliant',
    icon: CheckBadgeIcon
  }
];

export function Benefits() {
  return (
    <section id="benefits" className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-teal">Why tv for all</p>
            <h2 className="text-3xl font-bold text-navy" style={{ fontFamily: 'var(--font-poppins)' }}>Trusted IPTV without friction</h2>
            <p className="text-slate-600">Built for reliability, transparency, and global audiences.</p>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <div className="rounded-full bg-teal/10 px-3 py-1 text-teal">99.95% uptime</div>
            <div className="rounded-full bg-orange/10 px-3 py-1 text-orange">Refund-friendly</div>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {benefits.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-surface p-6 shadow-card hover:shadow-md transition hover:border-teal/50">
                <div className="flex items-center gap-3">
                  <div className="inline-flex rounded-lg bg-teal/10 p-3 text-teal">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="inline-flex rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal">
                    {item.badge}
                  </div>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-navy" style={{ fontFamily: 'var(--font-poppins)' }}>{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
