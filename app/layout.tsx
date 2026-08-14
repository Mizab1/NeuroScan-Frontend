import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'NeuroScan AI — Client-Side Brain Tumor MRI Detection & Classification',
  description:
    'Pure client-side WebGL-accelerated 5-layer Convolutional Neural Network for brain MRI tumor detection (Glioma, Meningioma, Pituitary, No Tumor). Zero server uploads.',
  keywords: [
    'NeuroScan',
    'Brain Tumor MRI',
    'TensorFlow.js',
    'Client-Side AI',
    'Glioma',
    'Meningioma',
    'Pituitary',
    'Medical Imaging',
    'WebGL',
  ],
  authors: [{ name: 'NeuroScan Team' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#07090e] text-slate-100 selection:bg-cyan-500 selection:text-black`}
      >
        {children}
      </body>
    </html>
  );
}
