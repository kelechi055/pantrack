import { Inter } from "next/font/google";
import Head from 'next/head';
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"; // Ensure this is correctly installed

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Pantrack",
  description: "Your Ultimate Pantry Management Tool",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Analytics /> 
      </body>
    </html>
  );
}
