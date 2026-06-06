import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Priyanka & Lalith - Wedding Invitation",
  description: "Join Priyanka and Lalith as they celebrate their wedding.",
  metadataBase: new URL("https://www.lalithwedspriyanka.com"),
  openGraph: {
    title: "Priyanka & Lalith - Wedding Invitation",
    description: "Join Priyanka and Lalith as they celebrate their wedding.",
    url: "https://www.lalithwedspriyanka.com",
    siteName: "Priyanka & Lalith Wedding",
    images: [
      {
        url: "/link-preview.png",
        width: 1122,
        height: 1402,
        alt: "Priyanka and Lalith wedding portrait",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Priyanka & Lalith - Wedding Invitation",
    description: "Join Priyanka and Lalith as they celebrate their wedding.",
    images: ["/link-preview.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Great+Vibes&family=Noto+Serif+Telugu:wght@300;400;500&family=Montserrat:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
