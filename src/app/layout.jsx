import './globals.css';
import Script from 'next/script';
import Providers from './providers';

export const metadata = {
  title: 'Avrora Dazzle Textiles | Luxury Sri Lankan Fashion & Couture',
  description: "Avrora Dazzle - Premium Sri Lankan designer fashion, ladies wear, gents wear, bridal couture, gym wear, and luxury accessories.",
  icons: {
    icon: '/assets/avrora_logo.jpeg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800;900&family=Syne:wght@500;600;700;800&family=Outfit:wght@300;400;500;600;700;800&family=Manrope:wght@300;400;500;600;700;800&family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="theme-avrora" suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
        <Script
          src="https://www.payhere.lk/lib/payhere.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
