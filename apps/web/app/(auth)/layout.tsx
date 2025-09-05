// app/(auth)/layout.tsx
import GuestGuard from "@/components/GuestGuard"

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <GuestGuard>
        {children}
    </GuestGuard>
  );
}