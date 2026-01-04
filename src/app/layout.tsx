import "./globals.css";
import { Inter, Montserrat } from "next/font/google";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Toaster } from 'sonner';

export const metadata = {
  title: "Ada: Healthcare Resource Locator",
};

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['100', '400'],
  variable: '--font-montserrat',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['100', '400'],
  variable: '--font-inter',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${inter.variable} flex flex-col min-h-screen bg-gradient-to-b from-[#fffbea] via-[#fffbea] to-[#3d9194]`}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
        <Toaster position="bottom-right" closeButton richColors />
      </body>
    </html>
  );
}
