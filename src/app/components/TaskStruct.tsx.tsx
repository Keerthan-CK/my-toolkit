// components/TaskStruct.tsx
import React from "react";
import Head from "next/head";
import Link from "next/link";

type LayoutProps = {
  title?: string;
  children: React.ReactNode;
};

export default function Layout({ title, children }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title ? `${title} | Productivity Tools` : "Productivity Tools"}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="A collection of productivity and utility tools." />
      </Head>

      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-blue-600 text-white shadow">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <h1 className="text-lg font-semibold">
              <Link href="/">Productivity Tools</Link>
            </h1>
            <nav className="space-x-4 text-sm">
              <Link href="/tasks" className="hover:underline">
                Tasks
              </Link>
              <Link href="/notes" className="hover:underline">
                Notes
              </Link>
              <Link href="/links" className="hover:underline">
                Links
              </Link>
              <Link href="/converter" className="hover:underline">
                Converter
              </Link>
              <Link href="/qr" className="hover:underline">
                QR
              </Link>
            </nav>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="bg-slate-100 text-slate-500 text-xs py-4 text-center">
          &copy; {new Date().getFullYear()} Productivity Tools — All data stored locally in your browser
        </footer>
      </div>
    </>
  );
}
