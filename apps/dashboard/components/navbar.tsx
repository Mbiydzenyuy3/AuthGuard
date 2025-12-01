import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="w-full border-b bg-white border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-green-700">
          DevGuard
        </Link>

        <div className="flex items-center gap-6">
          <Link href="#features" className="text-gray-700 hover:text-green-700">
            Features
          </Link>
          <Link href="/signin" className="text-gray-700 hover:text-green-700">
            Sign In
          </Link>
          <Link
            href="/signup"
            className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
