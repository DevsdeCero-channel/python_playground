import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/ThemeProvider';

const appURL = 'https://python-playground.vercel.app'; 
const ogImageURL = `${appURL}/logo_devs.png`

export const metadata: Metadata = {
  title: 'Python Playground | DevsdeCero',
  description: 'Una aplicación web segura y robusta para aprender con ejercicios en Python, que utiliza Pyodide para ejecutar código en un entorno aislado (sandbox) del navegador.',
  
  openGraph: {
    title: 'Python Playground | DevsdeCero',
    description: 'Una aplicación web segura y robusta para aprender con ejercicios en Python, que utiliza Pyodide para ejecutar código en un entorno aislado (sandbox) del navegador.',
    url: appURL,
    siteName: 'Python Playground | DevsdeCero',
    images: [
      {
        url: ogImageURL,
        width: 512,
        height: 512,
        alt: 'Logo DevsdeCero',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Python Playground',
    description: 'Aprende Python de forma segura y directa, sin necesidad de instalación.', 
    images: [ogImageURL],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/x-icon" href="/fav.ico"></link>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
        <script src="https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js"></script>
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
