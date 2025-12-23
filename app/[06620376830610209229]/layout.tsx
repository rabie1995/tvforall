export const runtime = "nodejs";

import { AdminLayoutClient } from '@/components/admin/AdminLayoutClient';
interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}