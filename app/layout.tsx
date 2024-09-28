import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Fastspots",
  description:
    "Faster, easier playlist creation of your own saved playlists and songs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
