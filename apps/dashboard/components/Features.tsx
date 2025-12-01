import { Card } from '@/components/ui/card';
import { Code, Shield, Zap, Globe, Key, Blocks, Webhook, Database, Settings } from 'lucide-react';

const features = [
  {
    icon: Code,
    title: 'Vanilla JavaScript SDK',
    description:
      'Universal SDK with .mount() for instant UI injection and headless APIs for complete custom control. TypeScript support included.',
  },
  {
    icon: Blocks,
    title: 'Pre-built UI Components',
    description:
      'Drop-in components for Sign-Up, Sign-In, Forgot Password, and profile management. Fully customizable or use our defaults.',
  },
  {
    icon: Shield,
    title: 'AWS Cognito Orchestration',
    description:
      'Automated Cognito User Pool creation and configuration. Enterprise-grade security without manual AWS setup.',
  },
  {
    icon: Database,
    title: 'Multi-Tenancy & Projects',
    description:
      'Complete project isolation with dedicated Cognito User Pools. Manage multiple apps from a single dashboard.',
  },
  {
    icon: Key,
    title: 'Secure API Key Management',
    description:
      'Generate, rotate, and revoke API keys with confidence. Hashed storage and full lifecycle management.',
  },
  {
    icon: Webhook,
    title: 'Lifecycle Webhooks',
    description:
      'Signed webhooks with automatic retries for user.created, user.signed_in, and user.updated events.',
  },
  {
    icon: Settings,
    title: 'Admin Dashboard',
    description:
      'Manage projects, monitor analytics, view integration guides, and track signups—all from one powerful interface.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description:
      'Authentication endpoints respond in ≤300ms. SDK .mount() renders in 50-150ms. Built for performance.',
  },
  {
    icon: Globe,
    title: 'OAuth Social Logins',
    description:
      'Google, Microsoft, Apple, and more. Passwordless authentication with email and SMS codes included.',
  },
];

const Features = () => {
  return (
    <section id="features" className="py-20 px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Everything you need.
            <span className="block text-primary">Nothing you don&apos;t.</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Production-ready authentication with AWS Cognito abstraction, webhooks, and SDK—so you
            can focus on building your app.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="p-6 border-border bg-card hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
