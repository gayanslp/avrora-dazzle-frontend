'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import LogoLoader from './LogoLoader';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  const rolesKey = Array.isArray(allowedRoles) ? allowedRoles.join(',') : (allowedRoles || '');

  useEffect(() => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      const user = userStr ? JSON.parse(userStr) : null;

      if (!token || !user) {
        router.replace('/login');
        return;
      }

      if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        router.replace('/unauthorized');
        return;
      }

      setAuthorized(true);
    } catch (e) {
      router.replace('/login');
    } finally {
      setChecking(false);
    }
  }, [router, pathname, rolesKey]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LogoLoader text="Verifying Access..." />
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
