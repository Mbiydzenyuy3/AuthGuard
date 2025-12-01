'use strict';

export default function Footer() {
  return (
    <footer className="py-10 border-t bg-gray-50 border-gray-200 text-center">
      <p className="text-gray-600">
        © {new Date().getFullYear()} DevGuard — Authentication made simple.
      </p>
    </footer>
  );
}
