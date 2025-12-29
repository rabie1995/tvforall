import { ShieldCheckIcon, CheckCircleIcon, ChatBubbleLeftRightIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';

const benefits = [
  {
    title: 'Secure subscriptions',
    description: 'Crypto subscriptions with address + amount verification. We never store private keys.',
    badge: 'Subscription-ready',
    icon: ShieldCheckIcon
  },
  {
    title: 'Instant activation',
    description: 'Subscriptions activate automatically after on-chain confirmations for fast access to live games and shows.',
    badge: 'Fast',
    icon: CheckCircleIcon
  },
  {
    title: '24/7 support',
    description: 'Live English-first agents with remote troubleshooting so you never miss kickoff or premiere time.',
    badge: 'Humans only',
    icon: ChatBubbleLeftRightIcon
  },
  {
    title: 'Legal & licensed',
    description: 'All streams provided by the client with valid rights. No piracy or scraping. Transparent, contract-free access.',
    badge: 'Compliant',
    icon: CheckBadgeIcon
  }
];

export function Benefits() {
  return (
    <section id="benefits" className="bg-surface/30 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Why tv for all</p>
            <h2 className="text-3xl font-bold text-text" style={{ fontFamily: 'var(--font-poppins)' }}>Trusted Premium TV without friction</h2>
            <p className="text-text-muted">Built for reliability, transparency, and global audiences.</p>
          </div>
          <div className="flex items-center gap-3 text-sm text-text-muted">
            <div className="rounded-full bg-primary/10 px-3 py-1 text-primary">99.95% uptime</div>
            <div className="rounded-full bg-secondary/10 px-3 py-1 text-secondary">Refund-friendly</div>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {benefits.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-2xl border border-border/50 bg-surface/50 backdrop-blur-sm p-6 shadow-lg hover:shadow-xl hover:border-primary/50 transition-all">
                <div className="flex items-center gap-3">
                  <div className="inline-flex rounded-lg bg-primary/10 p-3 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                    {item.badge}
                  </div>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-text" style={{ fontFamily: 'var(--font-poppins)' }}>{item.title}</h3>
                <p className="mt-2 text-sm text-text-muted">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
