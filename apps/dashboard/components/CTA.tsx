import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CTA = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary opacity-10 blur-3xl rounded-full" />

          <div className="relative bg-card border border-border rounded-2xl p-12 shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Ready to take control?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join developers who chose DevGuard for secure, self-hosted authentication without
              vendor lock-in.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Button
                size="lg"
                className="bg-green-900 hover:bg-green-700 text-primary-foreground font-semibold gap-2 shadow-lg"
              >
                Start Building Free
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success" />
                AWS Cognito included
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success" />
                Self-host anywhere
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
