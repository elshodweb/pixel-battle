// app/layout.tsx
import React from 'react';

export const metadata = {
  title: 'Pixel Battle',
  description: 'Pixel battle game',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
