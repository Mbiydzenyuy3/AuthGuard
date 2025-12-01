import Navigation from '@/components/navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import ComponentShowcase from '@/components/ComponentShowCase';
import Comparison from '@/components/Comparison';
import CTA from '@/components/CTA';
import SignInDemo from '@/components/SignInDemo';
import Footer from '@/components/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />

      <section className="py-20 px-6 bg-card-pale/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Embed authentication in minutes
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Use our SDK to inject pre-built components or build custom flows with headless APIs.
              See it in action below.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <div className="w-3 h-3 rounded-full bg-[#fbbf24]" />
                  <div className="w-3 h-3 rounded-full bg-success" />
                  <span className="ml-auto text-xs text-muted-foreground">App.tsx</span>
                </div>
                <pre className="text-sm text-foreground overflow-x-auto">
                  <code>{`import DevGuard from '@devguard/sdk';

DevGuard.mount('#auth', {
  projectId: 'your-project-id',
  apiKey: 'your-api-key',
  mode: 'sign-in'
});`}</code>
                </pre>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Install DevGuard SDK</h3>
                    <p className="text-sm text-muted-foreground">npm install @devguard/sdk</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Mount UI or use headless</h3>
                    <p className="text-sm text-muted-foreground">
                      .mount() for instant UI, or build custom flows with APIs
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Authentication works</h3>
                    <p className="text-sm text-muted-foreground">
                      AWS Cognito, webhooks, and security handled automatically
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <SignInDemo />
            </div>
          </div>
        </div>
      </section>

      <Features />
      <ComponentShowcase />
      <Comparison />
      <CTA />

      <Footer />
    </div>
  );
};

export default LandingPage;
