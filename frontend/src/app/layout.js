import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext"; // Import AuthProvider
import Navbar from "../components/layout/Navbar"; // Import Navbar

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AZ-Books E-commerce", // Updated title
  description: "Your one-stop shop for all stationary items.", // Updated description
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <AuthProvider> {/* Wrap children with AuthProvider */}
          <Navbar /> {/* Add Navbar */}
          <main className="flex-grow"> {/* Ensure children take up available space */}
            {children}
          </main>
          {/* Add a Footer component here later if needed */}
        </AuthProvider>
      </body>
    </html>
  );
}
