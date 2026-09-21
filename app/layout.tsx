import type { Metadata } from 'next';
import './globals.css';
import { LearningProvider } from '@/components/learning-provider';
import { AppShell } from '@/components/core-ui';

export const metadata: Metadata = {
  title: 'English Progress',
  description: 'Business English learning analytics and progress dashboard.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <LearningProvider>
          <AppShell>{children}</AppShell>
        </LearningProvider>
      </body>
    </html>
  );
}
