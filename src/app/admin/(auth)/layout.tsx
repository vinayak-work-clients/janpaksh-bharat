/** Minimal centred layout for /admin/login: no shell, no public chrome. */
export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper-2 px-4 py-10">
      {children}
    </div>
  );
}
