import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import "react-loading-skeleton/dist/skeleton.css";
import { SkeletonTheme } from "react-loading-skeleton";
import Providers from "@/providers/Providers";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Graba y publica",
  description:
    "Genere un artículo listo para publicar a traves de una nota de voz",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`${inter.className} min-h-screen flex flex-col items-center`}
      >
        <SkeletonTheme baseColor="#eee" highlightColor="rgb(109, 40, 217, 0.1)">
          <Providers>{children}</Providers>
        </SkeletonTheme>
      </body>
    </html>
  );
}
