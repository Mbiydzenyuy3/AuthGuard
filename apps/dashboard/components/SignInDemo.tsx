'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Chrome } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

const SignInDemo = () => {
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [focusedField, setFocusedField] = useState<'email' | 'password' | 'button' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const demoEmail = 'useremail@gmail.com';
  const demoPassword = '••••••••••••';

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const runTypingSequence = () => {
      let emailIndex = 0;
      let passwordIndex = 0;

      setTimeout(() => {
        setFocusedField('email');

        const emailInterval = setInterval(() => {
          if (emailIndex < demoEmail.length) {
            setEmailValue(demoEmail.slice(0, emailIndex + 1));
            emailIndex++;
          } else {
            clearInterval(emailInterval);

            setTimeout(() => {
              setFocusedField(null);

              setTimeout(() => {
                setFocusedField('password');

                const passwordInterval = setInterval(() => {
                  if (passwordIndex < demoPassword.length) {
                    setPasswordValue(demoPassword.slice(0, passwordIndex + 1));
                    passwordIndex++;
                  } else {
                    clearInterval(passwordInterval);

                    setTimeout(() => {
                      setFocusedField(null);

                      setTimeout(() => {
                        setFocusedField('button');
                        setIsSubmitting(true);

                        setTimeout(() => {
                          setIsSubmitting(false);
                          setFocusedField(null);

                          setTimeout(() => {
                            setEmailValue('');
                            setPasswordValue('');

                            timeoutId = setTimeout(runTypingSequence, 2000);
                          }, 1000);
                        }, 800);
                      }, 400);
                    }, 500);
                  }
                }, 80);
              }, 300);
            }, 500);
          }
        }, 80);
      }, 800);
    };

    runTypingSequence();

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <Card className="w-full max-w-md p-8 border-border bg-card">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Sign in to your account</h2>
        <p className="text-sm text-muted-foreground">Enter your credentials to continue</p>
      </div>

      <div className="space-y-3 mb-6">
        <Button
          variant="outline"
          className="w-full justify-start gap-3 border-border text-muted-foreground hover:bg-muted"
        >
          <Chrome className="w-5 h-5" />
          Continue with Google
        </Button>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
        </div>
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
            Email address
          </label>
          <Input
            ref={emailInputRef}
            id="email"
            type="email"
            value={emailValue}
            onChange={(e) => setEmailValue(e.target.value)}
            placeholder="you@example.com"
            className={`w-full transition-all duration-200 ${
              focusedField === 'email' ? 'ring-2 ring-primary border-primary' : 'border-border'
            }`}
            readOnly
            tabIndex={-1}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
            Password
          </label>
          <Input
            ref={passwordInputRef}
            id="password"
            type="password"
            value={passwordValue}
            onChange={(e) => setPasswordValue(e.target.value)}
            placeholder="Enter your password"
            className={`w-full transition-all duration-200 ${
              focusedField === 'password' ? 'ring-2 ring-primary border-primary' : 'border-border'
            }`}
            readOnly
            tabIndex={-1}
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-muted-foreground">
            <input type="checkbox" className="rounded border-border" />
            Remember me
          </label>
          <a href="#" className="text-brand-medium hover:text-primary transition-colors">
            Forgot password?
          </a>
        </div>

        <Button
          ref={buttonRef}
          type="submit"
          tabIndex={-1}
          className={`w-full bg-green-900 hover:bg-green-700 text-primary-foreground font-medium transition-all duration-200 ${
            focusedField === 'button' ? 'ring-2 ring-primary ring-offset-2' : ''
          } ${isSubmitting ? 'scale-[0.98] opacity-80' : ''}`}
        >
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <a href="#" className="text-brand-medium hover:text-primary transition-colors font-medium">
          Sign up
        </a>
      </p>
    </Card>
  );
};

export default SignInDemo;
