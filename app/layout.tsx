import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "NeuroScan AI — Brain Tumor MRI Detection & Classification",
  description:
    "Pure client-side WebGL-accelerated 5-layer Convolutional Neural Network for brain MRI tumor detection (Glioma, Meningioma, Pituitary, No Tumor). Zero server uploads.",
  keywords: [
    "NeuroScan",
    "Brain Tumor MRI",
    "TensorFlow.js",
    "Client-Side AI",
    "Glioma",
    "Meningioma",
    "Pituitary",
    "Medical Imaging",
    "WebGL"
  ],
  authors: [{ name: "NeuroScan Team" }]
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-slate-900 selection:bg-cyan-500 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
