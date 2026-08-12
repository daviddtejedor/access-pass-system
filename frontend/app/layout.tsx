import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import './globals.css';
import { Roboto } from 'next/font/google';
import { ThemeProvider } from './context/ThemeContext';

const roboto = Roboto({
  style: 'normal',
  weight: ['400', '500', '700'],
  subsets: ['latin'],
});

export default function RootLayout({ children, }: { children: React.ReactNode; }) {
  return (
    <html lang="es">
      <body className={`${roboto.className} dark:bg-zinc-900`}>
        <ThemeProvider>
          <AuthProvider>
            <UserProvider>
              {children}
            </UserProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
