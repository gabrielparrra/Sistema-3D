import "./globals.css";
import TopNav from "./components/TopNav";
import { DM_Sans, JetBrains_Mono } from "next/font/google";

const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"], variable: '--font-dm-sans' });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], weight: ["400"], variable: '--font-jetbrains' });

export const metadata = {
  title: "Hiperfoco 3D",
  description: "Sistema para gerenciamento de vendas e estoque de impressão 3D.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${dmSans.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <div className="app-container">
          <TopNav />
          <main className="main-content">
            <div className="container-inner">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
