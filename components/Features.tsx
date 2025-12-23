import { SparklesIcon, PlayCircleIcon, StarIcon, DevicePhoneMobileIcon, GlobeAltIcon, ShieldCheckIcon, CpuChipIcon } from '@heroicons/react/24/solid';

const features = [
  {
    id: 1,
    title: '4K Ultra HD Streaming',
    description: 'Experience crystal-clear video quality with adaptive bitrate technology for seamless playback on any device.',
    icon: PlayCircleIcon,
    color: 'bg-gradient-to-br from-blue-500 to-purple-600',
    delay: '0ms'
  },
  {
    id: 2,
    title: 'Global Content Library',
    description: 'Access premium channels from 50+ countries in multiple languages including Arabic, English, and French.',
    icon: GlobeAltIcon,
    color: 'bg-gradient-to-br from-green-500 to-teal-600',
    delay: '100ms'
  },
  {
    id: 3,
    title: 'Multi-Device Sync',
    description: 'Stream seamlessly across all your devices. Start on your phone, continue on your TV without missing a beat.',
    icon: DevicePhoneMobileIcon,
    color: 'bg-gradient-to-br from-purple-500 to-pink-600',
    delay: '200ms'
  },
  {
    id: 4,
    title: 'Enterprise Uptime',
    description: '99.9% uptime guarantee with redundant global servers ensuring zero buffering and maximum reliability.',
    icon: ShieldCheckIcon,
    color: 'bg-gradient-to-br from-orange-500 to-red-600',
    delay: '300ms'
  },
  {
    id: 5,
    title: 'AI-Powered Quality',
    description: 'Advanced AI optimization delivers the perfect streaming quality based on your connection speed.',
    icon: CpuChipIcon,
    color: 'bg-gradient-to-br from-indigo-500 to-blue-600',
    delay: '400ms'
  },
  {
    id: 6,
    title: 'Premium Support',
    description: '24/7 expert support team ready to help you with any questions or technical issues instantly.',
    icon: StarIcon,
    color: 'bg-gradient-to-br from-yellow-500 to-orange-600',
    delay: '500ms'
  },
];

export function Features() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-surface/30 py-20 sm:py-28">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }}></div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary mb-4">
            <SparklesIcon className="h-4 w-4" />
            Premium Features
          </div>
          <h2 className="text-4xl font-bold text-text sm:text-5xl mb-6">
            Why Millions Choose TVFORALL
          </h2>
          <p className="text-lg text-text-muted max-w-3xl mx-auto">
            Experience the future of streaming with cutting-edge technology, global content, and unmatched reliability
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className="group relative rounded-2xl border border-border/50 bg-surface/50 backdrop-blur-sm p-8 shadow-xl shadow-primary/5 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30 hover:scale-105 animate-fade-in"
                style={{ animationDelay: feature.delay }}
              >
                {/* Gradient border effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative">
                  <div className={`mb-6 inline-flex rounded-2xl ${feature.color} p-4 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-text mb-3 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-text-muted leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
