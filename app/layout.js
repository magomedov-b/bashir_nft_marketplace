'use client'
import Script from 'next/script';
import { ThemeProvider } from 'next-themes';

import { Navbar, Footer } from '@/components';
import './globals.css';


const RootLayout = ({ children }) => (
  <html lang="en" suppressHydrationWarning>
    <body>
      <ThemeProvider attribute="class">
        <div className='dark:bg-nft-dark bg-white min-h-screen'>
          <Navbar/>
          {children}
          <Footer/>
        </div>
        <Script src="https://kit.fontawesome.com/92f97cdb9f.js" crossOrigin="anonymous"/>
      </ThemeProvider>
    </body>
  </html>
);
export default RootLayout;
