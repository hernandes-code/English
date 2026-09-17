import type { Metadata } from 'next';
import './globals.css';
import './game-v2.css';
import './sidebar-v2.css';
import './journey-v2.css';
import { LearningProvider } from '@/components/learning-provider';

export const metadata: Metadata = {
  title: 'English Level Up',
  description: 'Learning-first Business English progression dashboard.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><LearningProvider>{children}</LearningProvider></body></html>;
}
