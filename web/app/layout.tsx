import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Navbar } from "./Navbar";
import { createClient } from "@/utils/supabase/server";

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins'
});

export const metadata: Metadata = {
  title: "Football Weekly Picks",
  description: "Stay updated with the latest Football weekly picks",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="https://fav.farm/🏈" />
      </head>
      <body
        className={`${poppins.variable} antialiased`}
      >
        <Navbar user={data.user} />
        <div className="mx-12 h-[calc(100vh-116px)] pb-20">
          {children}
        </div>
      </body>
    </html>
  );
}