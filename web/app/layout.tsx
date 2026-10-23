import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "About us · CarXprt",
  description: "Why CarXprt exists, how it fixes car buying, and how it compares.",
};

// Runs before paint so the saved theme never flashes.
const themeScript = `document.documentElement.classList.add('js');try{var t=localStorage.getItem('cx-theme');if(t)document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
