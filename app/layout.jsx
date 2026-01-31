import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({ weight: ["400", "500", "600", "700"], subsets: ["latin"], variable: "--font-poppins" });

export const metadata = {
  title: "PRG Attendance",
  description: "PRG Science College Dhule – Smart Attendance",
  icons: [{ rel: "icon", url: "/colleg-logo.png" }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
