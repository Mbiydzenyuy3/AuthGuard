import SignInDemo from './SignInDemo';

const ComponentShowcase = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Beautiful by default.
            <span className="block text-primary">Yours with one line.</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Drop in pre-built components and customize every detail. Or use our headless UI for
            complete control.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            <SignInDemo />
          </div>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <span className="text-accent font-bold">1</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Install in seconds</h3>
                <p className="text-muted-foreground">
                  npm install @authservice/react and import the component. That's it.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <span className="text-accent font-bold">2</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Customize with CSS</h3>
                <p className="text-muted-foreground">
                  Match your brand with simple CSS variables or Tailwind classes. No framework
                  restrictions.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <span className="text-accent font-bold">3</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Or go headless</h3>
                <p className="text-muted-foreground">
                  Need total control? Use our headless hooks and build your own UI from scratch.
                </p>
              </div>
            </div>

            <div className="pt-6">
              <div className="p-4 rounded-lg bg-card border border-border">
                <p className="text-sm text-muted-foreground mb-2">Example usage:</p>
                <code className="text-sm text-foreground">
                  {'<SignIn appearance={{ theme: "dark" }} />'}
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComponentShowcase;
