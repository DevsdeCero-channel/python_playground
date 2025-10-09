import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/ThemeProvider';

const appURL = 'https://python-playground.vercel.app'; 
const ogImageURL = `${appURL}/og-pp-banner.png`

export const metadata: Metadata = {
  title: 'Python Playground | DevsdeCero',
  description: 'Una aplicación web segura, divertida e interactiva para aprender con ejercicios en Python. ¡Empieza ya!',
  
  openGraph: {
    title: 'Python Playground | DevsdeCero',
    description: 'Una aplicación web segura, divertida e interactiva para aprender con ejercicios en Python. ¡Empieza ya!',
    url: appURL,
    siteName: 'Python Playground | DevsdeCero',
    images: [
      {
        url: ogImageURL,
        width: 1200,
        height: 630,
        alt: 'Logo DevsdeCero',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Python Playground | DevsdeCero',
    description: 'Una aplicación web segura, divertida e interactiva para aprender con ejercicios en Python. ¡Empieza ya!', 
    images: [ogImageURL],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-ES" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/x-icon" href="/fav.ico"></link>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
        <script src="https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js"></script>
        <script 
          type="application/ld+json" 
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage", 
              "name": "Python Playground | DevsdeCero",
              "description": "Una aplicación web segura, divertida e interactiva para aprender con ejercicios en Python. ¡Empieza ya!",
              "url": "https://python-playground-theta.vercel.app/", 
            })
          }}/>
      </head>
      <body>
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
