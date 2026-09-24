import type { Metadata } from "next";

/**
 * Everything under /admin: no public chrome, never indexed, titles end in
 * "· Admin". The dashboard shell is added by (dashboard)/layout.tsx so that
 * /admin/login and /admin/preview stay outside it.
 */
export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin" },
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
