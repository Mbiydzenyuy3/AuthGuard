import { Card } from '@/components/ui/card';
import { Check, X } from 'lucide-react';

const platforms = [
  {
    name: 'Clerk',
    features: [
      { text: 'Vendor lock-in', available: false },
      { text: 'Closed source', available: false },
      { text: 'Expensive at scale ($99-$499+/mo)', available: false },
      { text: 'Data stored on their servers', available: false },
      { text: 'Limited customization', available: false },
    ],
  },
  {
    name: 'Auth0',
    features: [
      { text: 'Vendor lock-in', available: false },
      { text: 'Closed source', available: false },
      { text: 'Complex pricing ($240-$1,200+/mo)', available: false },
      { text: 'Data stored on their servers', available: false },
      { text: 'Steep learning curve', available: false },
    ],
  },
  {
    name: 'Firebase Auth',
    features: [
      { text: 'Vendor lock-in (Google)', available: false },
      { text: 'Closed source', available: false },
      { text: 'Limited to Firebase ecosystem', available: false },
      { text: 'Data stored on Google servers', available: false },
      { text: 'Basic user management only', available: false },
    ],
  },
  {
    name: 'Supabase Auth',
    features: [
      { text: 'Open source', available: true },
      { text: 'Vendor lock-in', available: false },
      { text: 'Requires Supabase backend', available: false },
      { text: 'Limited UI components', available: false },
      { text: 'Manual configuration needed', available: false },
    ],
  },
];

const Comparison = () => {
  return (
    <section className="py-20 px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Why DevGuard?</h2>
          <p className="text-lg text-muted-foreground">
            Great developer experience without vendor lock-in or hidden costs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* DevGuard - Featured */}
          <Card className="p-8 border-2 border-primary bg-card relative overflow-hidden lg:col-span-3">
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-bold">
                RECOMMENDED
              </span>
            </div>
            <h3 className="text-2xl font-bold text-primary mb-6">DevGuard</h3>

            <div className="grid md:grid-cols-3 gap-x-8 gap-y-4">
              {[
                'Self-hosted on your infrastructure',
                'Zero vendor lock-in',
                'Open source (AGPL license)',
                'Predictable costs at any scale',
                'Full data ownership',
                'Automated AWS Cognito setup',
                'Pre-built + headless components',
                'Webhooks with auto-retry',
                'TypeScript SDK included',
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-success" />
                  </div>
                  <span className="text-foreground text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Comparison Cards */}
          {platforms.map((platform, idx) => (
            <Card key={idx} className="p-6 border-border bg-card">
              <h3 className="text-xl font-bold text-muted-foreground mb-4">{platform.name}</h3>

              <div className="space-y-3">
                {platform.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        feature.available ? 'bg-success/10' : 'bg-destructive/10'
                      }`}
                    >
                      {feature.available ? (
                        <Check className="w-2.5 h-2.5 text-success" />
                      ) : (
                        <X className="w-2.5 h-2.5 text-destructive" />
                      )}
                    </div>
                    <span className="text-muted-foreground text-sm">{feature.text}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <div className="p-6 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-center text-foreground">
            <span className="font-semibold">Migrating from another platform?</span> DevGuard
            provides migration guides and tools to help you transfer users and settings seamlessly.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Comparison;
