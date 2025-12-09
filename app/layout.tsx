import type { Metadata } from "next";
import { Inter, Architects_Daughter } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/footer";
import { getSiteSettings } from "@/lib/directus";
import { GoogleTagManagerHead, GoogleTagManagerBody } from "@/components/gtm";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "600"],
});

const architectsDaughter = Architects_Daughter({
  variable: "--font-architects-daughter",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "DewBob.com - Ask Uncle Bobby",
  description: "Straight talk, no sugarcoating - Uncle Bobby's got your back with advice that actually works.",
};

// Force ALL pages to be fully dynamic - no static generation at build time
export const dynamic = 'force-dynamic';
export const revalidate = 60;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings('dewbob');
  const gtmId = settings?.google_tag_manager_id;

  return (
    <html lang="en">
      <head>
        {gtmId && <GoogleTagManagerHead gtmId={gtmId} />}
      </head>
      <body
        className={`${inter.variable} ${architectsDaughter.variable} antialiased flex flex-col min-h-screen`}
      >
        {gtmId && <GoogleTagManagerBody gtmId={gtmId} />}
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
