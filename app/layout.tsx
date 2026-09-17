import type { Metadata } from 'next';
import './globals.css';
import './paper-book.css';
import './paper-book-polish.css';
import { LearningProvider } from '@/components/learning-provider';

export const metadata: Metadata = {
  title: 'English Level Up',
  description: 'Learning-first Business English progression journal.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><LearningProvider>{children}</LearningProvider></body></html>;
}
