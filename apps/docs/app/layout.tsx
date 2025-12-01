import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import React from 'react';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  title: 'DevGuard Documentation',
  description:
    'Comprehensive documentation for DevGuard - a modern authentication and authorization solution',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'Inter, sans-serif' }}>
        <aside
          style={{
            width: '260px',
            position: 'fixed',
            top: 0,
            bottom: 0,
            left: 0,
            background: '#fafafa',
            padding: '20px',
            borderRight: '1px solid #eee',
          }}
        >
          <h2>DevGuard Docs</h2>
          <ul>
            <li>
              <a href="/">Introduction</a>
            </li>
            <li>
              <a href="/guide/quickstart">Quickstart</a>
            </li>
            <li>
              <a href="/api-reference">API Reference</a>
            </li>
          </ul>
        </aside>

        <main style={{ marginLeft: '280px', padding: '40px' }}>{children}</main>
      </body>
    </html>
  );
}
