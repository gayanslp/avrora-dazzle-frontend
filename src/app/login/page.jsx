import { Suspense } from 'react';
import Login from '../../views/Login';
import LogoLoader from '../../components/LogoLoader';

export const metadata = {
  title: 'Sign In / Register | Avrora Dazzle Textiles',
  description: 'Sign in with your email and secure one-time passcode (OTP) to access your Avrora Dazzle account.',
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LogoLoader text="Loading Login..." /></div>}>
      <Login />
    </Suspense>
  );
}
