'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Don't wrap login/signup pages
  if (pathname === '/admin/login' || pathname === '/admin/signup') {
    return children;
  }

  return children;
}
