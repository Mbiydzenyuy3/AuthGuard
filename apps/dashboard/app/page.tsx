import Footer from '@/components/Footer';
import Navbar from '@/components/navbar';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl font-bold text-gray-900 leading-tight">
          Simple, Secure Authentication
          <span className="text-green-700"> for Developers</span>
        </h1>

        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          Add Sign-Up, Sign-In, Forgot Password, and User Management in minutes,powered by an
          API-first authentication system.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <a
            href="/signup"
            className="bg-green-700 text-white px-6 py-3 rounded-lg text-lg hover:bg-green-800"
          >
            Get Started
          </a>

          <a
            href="#features"
            className="px-6 py-3 text-lg rounded-lg border border-gray-400 
                       text-gray-700 hover:bg-gray-100"
          >
            Learn More
          </a>
        </div>
      </section>

      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-gray-900 text-center">
          Everything you need to authenticate users
        </h2>

        <div className="grid md:grid-cols-3 gap-10 mt-16">
          <div className="p-6 border rounded-xl bg-white border-gray-200">
            <h3 className="font-semibold text-lg text-gray-900">Secure Sign-In</h3>
            <p className="text-gray-600 mt-2">Email, password, and more ready out of the box.</p>
          </div>

          <div className="p-6 border rounded-xl bg-white border-gray-200">
            <h3 className="font-semibold text-lg text-gray-900">Developer Dashboard</h3>
            <p className="text-gray-600 mt-2">
              Manage users, sessions, API keys, and security settings easily.
            </p>
          </div>

          <div className="p-6 border rounded-xl bg-white border-gray-200">
            <h3 className="font-semibold text-lg text-gray-900">SDK Ready</h3>
            <p className="text-gray-600 mt-2">
              Integrate authentication into your app with a simple JS SDK.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
