import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PostHogProvider } from "@/components/PostHogProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://bountydesk.vercel.app";
const SITE_TITLE = "BountyDesk — Bug Bounty Tracker & Report Builder";
const SITE_DESCRIPTION =
  "Track every bug bounty submission, payout, and program in one place. Generate clean Markdown reports that get accepted faster. Open source. Free + $7/mo Pro.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: [
    "bug bounty",
    "bug bounty tracker",
    "hackerone",
    "bugcrowd",
    "intigriti",
    "vulnerability tracker",
    "security",
    "infosec",
    "markdown report builder",
    "bounty hunter",
  ],
  authors: [{ name: "Kushagra Kartikey", url: "https://x.com/bountydesk" }],
  creator: "Kushagra Kartikey",
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "BountyDesk",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    creator: "@bountydesk",
    site: "@bountydesk",
  },
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
