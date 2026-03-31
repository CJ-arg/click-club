import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "Click Club — Comunidad LinkedIn",
  description: "Comunidad de devs que se apoyan mutuamente en LinkedIn. Comparte tu post, da likes, y mantené tu perfil activo.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={geist.variable}>
      <body>{children}</body>
    </html>
  );
}
