// app/customer/layout.tsx
import { Toaster } from '@/components/ui/toaster';
import Navbar from './components/Navbar';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Toaster />
    </>
  );
}
