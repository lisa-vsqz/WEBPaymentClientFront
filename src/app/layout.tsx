import type { Metadata } from "next";
import "../styles/globals.css";
import "../styles/global.scss";
import Providers from "./Providers"; // Import the Providers component

export const metadata: Metadata = {
  title: "BusinessPayment",
  description: "Pay your invoices easily",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers> {/* Wrap your app with Providers to include SessionProvider */}
          <main>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
