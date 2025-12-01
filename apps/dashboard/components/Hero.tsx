import { Button } from '@/components/ui/button';
import { ArrowRight, Lock, Zap, Shield } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative py-24 md:py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--accent)/0.05)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,hsl(var(--primary)/0.05)_0%,transparent_50%)]" />

      <div className="max-w-7xl mx-auto relative">
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border shadow-sm">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm font-medium text-foreground ">
              DevGuard - Open Source Auth
            </span>
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-center text-foreground mb-6 leading-tight tracking-tight">
          Authentication
          <span className="block text-green-700 mt-2 text-4xl">Without The Hassle</span>
        </h1>

        <p className="text-xl md:text-2xl text-center text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
          DevGuard abstracts AWS Cognito complexity with a universal JavaScript SDK, pre-built UI,
          webhooks, and multi-tenant projects—so you ship faster without vendor lock-in.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-20">
          <Button
            size="lg"
            className="bg-green-900 hover:bg-green-700 text-primary-foreground font-semibold gap-2 shadow-lg hover:shadow-xl transition-all h-12 px-8 text-base"
          >
            Start Building for Free
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border shadow-sm">
            <Lock className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Self-Hosted & Secure</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border shadow-sm">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-foreground">SDK + Webhooks Included</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border shadow-sm">
            <Shield className="w-4 h-4 text-success" />
            <span className="text-sm font-medium text-foreground">AWS Cognito Powered</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
