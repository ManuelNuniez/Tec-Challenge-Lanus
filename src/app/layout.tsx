import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "GranaBank",
  description: "Con cada compra, sumás orgullo granate",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {/* Mobile-first: on wider screens the app stays a phone-width column. */}
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
