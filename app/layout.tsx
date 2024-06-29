export const revalidate = 0;

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Testimonials from "@/components/shared/Testimonials";
import { TestimonyCardProps } from "@/lib/types";
import { client } from "@/lib/sanity";
import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";

const FONT = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Chukwudubem Osegbe - NIPPY The Creator",
  description:
    "Software Developer, Cloud & Server Administrator, Cybesecurity Enthusiat",
};

// Fetch Testimonials
async function getTestimonials() {
  const query = `*[_type == "testimonials"] {
    _id,
    name,
   testimony,
    position,
    }`;

  const data = await client.fetch(query);
  return data;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const testimonials: TestimonyCardProps[] = await getTestimonials();

  return (
    <html lang="en" suppressHydrationWarning className={FONT.className}>
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="w-full py-5 lg:px-32 px-5">
            <Header />
            {children}
            <Testimonials testimonials={testimonials} />
            <Footer />
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
