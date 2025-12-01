import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white border-gray-200">
      <div className="max-w-8xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="logo flex items-center">
          <Image
            src="/devguard.png"
            alt="DevGuard Logo"
            width={56}
            height={56}
            className="inline-block"
          />
          <Link href="/" className="text-lg font-bold text-green-700">
            DevGuard
          </Link>
        </div>

        <div className="flex items-center gap-6">
          <Link href="#features" className="text-gray-700 hover:text-green-700">
            Features
          </Link>
          <Link href="/signin" className="text-gray-700 hover:text-green-700">
            Sign In
          </Link>
          <Link
            href="/signup"
            className="bg-green-900 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition"
          >
            Start Building
          </Link>
        </div>
      </div>
    </nav>
  );
}
