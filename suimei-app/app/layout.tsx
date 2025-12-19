import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '四柱推命 - 命式鑑定',
  description: '四柱推命（BaZi）による命式鑑定・運勢診断アプリケーション',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="antialiased">
        <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 shadow-lg">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold">四柱推命 命式鑑定</h1>
            <p className="text-sm opacity-80">BaZi Fortune Telling</p>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="bg-gray-800 text-white py-6 mt-12">
          <div className="container mx-auto px-4 text-center text-sm">
            <p>四柱推命 Web Application</p>
            <p className="opacity-60 mt-1">Based on traditional Chinese astrology</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
