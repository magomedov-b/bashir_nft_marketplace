'use client'
import Script from 'next/script';
import { ThemeProvider } from 'next-themes';

import { NFTProvider } from "@/context/NFTContext";
import { Navbar, Footer } from '@/components';
import './globals.css';


const RootLayout = ({ children }) => (

  <html lang="en" suppressHydrationWarning>
    <body>
    <NFTProvider>
      <ThemeProvider attribute="class">
        <div className='dark:bg-nft-dark bg-white min-h-screen'>
          <Navbar />
          <div className="pt-65">
            {children}
          </div>
          <Footer/>
        </div>
        <Script src="https://kit.fontawesome.com/92f97cdb9f.js" crossOrigin="anonymous"/>
      </ThemeProvider>
    </NFTProvider>

    </body>
  </html>
);
export default RootLayout;
