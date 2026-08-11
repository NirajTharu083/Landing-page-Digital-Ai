import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const origin = `${protocol}://${host}`;

  return {
    metadataBase: new URL(origin),
    title: "Free AI Marketing Consultation | Digital Niraj",
    description:
      "Book a free AI marketing consultation and get a customized marketing plan designed to help your business generate leads, improve marketing, and grow smarter.",
    openGraph: {
      title: "Get Your Free Customized AI Marketing Plan",
      description:
        "Struggling with inconsistent leads or sales? Book a free one-to-one AI marketing consultation and discover practical next steps for your business.",
      type: "website",
      images: [{ url: `${origin}/og.png`, width: 1536, height: 1024, alt: "Get Your Free Customized AI Marketing Plan" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Get Your Free Customized AI Marketing Plan",
      description:
        "Struggling with inconsistent leads or sales? Book a free one-to-one AI marketing consultation and discover practical next steps for your business.",
      images: [`${origin}/og.png`],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
