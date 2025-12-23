import { ShieldCheckIcon, SparklesIcon, ChatBubbleLeftIcon, CheckCircleIcon, GlobeAltIcon, ArrowPathIcon, LockClosedIcon, ServerIcon, UserGroupIcon } from '@heroicons/react/24/solid';

const badges = [
  { text: 'Bank-Level Security', icon: ShieldCheckIcon, color: 'text-green-500' },
  { text: '99.9% Uptime', icon: ServerIcon, color: 'text-blue-500' },
  { text: '24/7 Support', icon: ChatBubbleLeftIcon, color: 'text-purple-500' },
  { text: 'Instant Setup', icon: CheckCircleIcon, color: 'text-green-500' },
  { text: 'Global Coverage', icon: GlobeAltIcon, color: 'text-blue-500' },
  { text: '30-Day Guarantee', icon: ArrowPathIcon, color: 'text-orange-500' },
  { text: 'Encrypted Data', icon: LockClosedIcon, color: 'text-red-500' },
  { text: '10K+ Users', icon: UserGroupIcon, color: 'text-indigo-500' },
  { text: 'No Contracts', icon: SparklesIcon, color: 'text-yellow-500' }
];

export function TrustBadges() {
  return (
    <div className="grid gap-4 rounded-2xl border border-border bg-surface/50 backdrop-blur-sm p-6 shadow-2xl shadow-primary/10 sm:grid-cols-3 lg:grid-cols-3">
      {badges.map((badge, index) => {
        const Icon = badge.icon;
        return (
          <div
            key={badge.text}
            className="group flex items-center gap-3 rounded-xl bg-background/50 border border-border/50 px-4 py-3 text-sm font-semibold text-text hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={`rounded-lg bg-surface p-2 group-hover:scale-110 transition-transform duration-300`}>
              <Icon className={`h-5 w-5 ${badge.color}`} />
            </div>
            <span className="text-text">{badge.text}</span>
          </div>
        );
      })}
    </div>
  );
}
