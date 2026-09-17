import type { Metadata } from 'next';
import './globals.css';
import './player-book.css';
import { LearningProvider } from '@/components/learning-provider';
import { PaperBookShell } from '@/components/paper-book-shell';

export const metadata: Metadata = {
  title: 'English Level Up',
  description: 'Learning-first Business English progression journal.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <LearningProvider>
          <PaperBookShell>{children}</PaperBookShell>
        </LearningProvider>
      </body>
    </html>
  );
}
