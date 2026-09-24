"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { ExternalLink, Inbox, LayoutDashboard, LogOut, Megaphone, Menu, Newspaper, Settings, UserCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/Logo";
import { signOut } from "@/lib/admin/actions/auth";
import { NewPostMenu } from "@/components/admin/NewPostMenu";
import { DialogRoot, DialogContent, DialogClose } from "@/components/admin/ui/Dialog";
import { TooltipProvider } from "@/components/admin/ui/Tooltip";

interface ShellProps {
  email: string;
  unread: number;
  children: ReactNode;
}

const NAV = [
  { href: "/admin", label: "Overview", Icon: LayoutDashboard, exact: true },
  { href: "/admin/posts", label: "Posts", Icon: Newspaper },
  { href: "/admin/ads", label: "Ads", Icon: Megaphone },
  { href: "/admin/messages", label: "Messages", Icon: Inbox, badge: true },
  { href: "/admin/settings", label: "Settings", Icon: Settings },
  { href: "/admin/account", label: "Account", Icon: UserCircle },
] as const;

/** Title + breadcrumb for the top bar, derived from the URL. */
function pageMeta(pathname: string): { title: string; crumbs: Array<{ label: string; href?: string }> } {
  if (pathname === "/admin") return { title: "Overview", crumbs: [] };
  if (pathname === "/admin/posts") return { title: "Posts", crumbs: [{ label: "Overview", href: "/admin" }] };
  if (pathname === "/admin/posts/new") return { title: "New post", crumbs: [{ label: "Posts", href: "/admin/posts" }] };
  if (pathname.startsWith("/admin/posts/")) return { title: "Edit post", crumbs: [{ label: "Posts", href: "/admin/posts" }] };
  const item = NAV.find((n) => pathname === n.href || pathname.startsWith(`${n.href}/`));
  return { title: item?.label ?? "Admin", crumbs: [{ label: "Overview", href: "/admin" }] };
}

function NavList({ pathname, unread, onNavigate }: { pathname: string; unread: number; onNavigate?: () => void }) {
  return (
    <nav aria-label="Admin" className="flex-1 py-3">
      <ul className="flex flex-col gap-0.5 px-2">
        {NAV.map(({ href, label, Icon, ...rest }) => {
          const exact = "exact" in rest && rest.exact;
          const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
          const badge = "badge" in rest && rest.badge && unread > 0 ? unread : 0;
          return (
            <li key={href}>
              <Link
                href={href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex min-h-[2.75rem] items-center gap-3 rounded-sm px-3 font-sans text-[0.9rem] font-medium transition-colors",
                  active ? "bg-paper-2/10 text-paper" : "text-paper/70 hover:bg-paper-2/5 hover:text-paper",
                )}
              >
                {active && <span aria-hidden="true" className="absolute inset-y-2 left-0 w-[3px] bg-saffron" />}
                <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} aria-hidden="true" />
                <span className="flex-1">{label}</span>
                {badge > 0 && (
                  <span className="inline-flex min-w-[1.4rem] items-center justify-center rounded-full bg-saffron px-1.5 py-0.5 font-sans text-[0.68rem] font-semibold text-ink">
                    {badge > 99 ? "99+" : badge}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function SidebarFooter({ email }: { email: string }) {
  return (
    <div className="border-t border-paper/10 px-2 py-3">
      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-[2.75rem] items-center gap-3 rounded-sm px-3 font-sans text-[0.9rem] font-medium text-paper/70 transition-colors hover:bg-paper-2/5 hover:text-paper"
      >
        <ExternalLink className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
        View site
      </a>
      <div className="mt-2 flex items-center gap-2 px-3 py-2">
        <span className="min-w-0 flex-1 truncate font-sans text-[0.78rem] text-paper/60" title={email}>
          {email}
        </span>
        <form action={signOut}>
          <button
            type="submit"
            aria-label="Sign out"
            title="Sign out"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-paper/70 transition-colors hover:bg-paper-2/10 hover:text-paper"
          >
            <LogOut className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
          </button>
        </form>
      </div>
    </div>
  );
}

export function Shell({ email, unread, children }: ShellProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { title, crumbs } = pageMeta(pathname);

  useEffect(() => setOpen(false), [pathname]);

  const sidebar = (
    <div className="flex h-full flex-col bg-ink text-paper">
      <div className="flex h-16 items-center justify-between border-b border-paper/10 px-4">
        <Link href="/admin" aria-label="Admin overview">
          <Logo tone="paper" size="nav" asSpan />
        </Link>
        <DialogClose asChild>
          <button type="button" aria-label="Close menu" className="inline-flex h-11 w-11 items-center justify-center rounded-full text-paper/70 hover:bg-paper-2/10 hover:text-paper lg:hidden">
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </DialogClose>
      </div>
      <NavList pathname={pathname} unread={unread} onNavigate={() => setOpen(false)} />
      <SidebarFooter email={email} />
    </div>
  );

  return (
    <TooltipProvider>
      <div className="flex min-h-screen w-full bg-paper text-ink">
        {/* Desktop sidebar */}
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-[240px] lg:block">
          <div className="flex h-full flex-col bg-ink text-paper">
            <div className="flex h-16 items-center border-b border-paper/10 px-4">
              <Link href="/admin" aria-label="Admin overview">
                <Logo tone="paper" size="nav" asSpan />
              </Link>
            </div>
            <NavList pathname={pathname} unread={unread} />
            <SidebarFooter email={email} />
          </div>
        </aside>

        {/* Mobile drawer */}
        <DialogRoot open={open} onOpenChange={setOpen}>
          <DialogContent title="Admin menu" hideTitle side="left" className="lg:hidden">
            {sidebar}
          </DialogContent>
        </DialogRoot>

        <div className="flex min-h-screen w-full min-w-0 flex-col lg:pl-[240px]">
          <header className="sticky top-0 z-30 border-b border-rule bg-paper/95 backdrop-blur">
            <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center gap-3 px-4 sm:px-6 lg:px-8">
              <button
                type="button"
                aria-label="Open menu"
                onClick={() => setOpen(true)}
                className="-ml-2 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full hover:bg-ink/5 lg:hidden"
              >
                <Menu className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
              </button>
              <div className="min-w-0 flex-1">
                {crumbs.length > 0 && (
                  <nav aria-label="Breadcrumb" className="hidden font-sans text-[0.72rem] uppercase tracking-[0.14em] text-muted sm:block">
                    {crumbs.map((c, i) => (
                      <span key={i}>
                        {c.href ? (
                          <Link href={c.href} className="hover:text-ink">
                            {c.label}
                          </Link>
                        ) : (
                          c.label
                        )}
                        <span aria-hidden="true" className="mx-1.5 text-rule">/</span>
                      </span>
                    ))}
                  </nav>
                )}
                <h1 className="truncate font-serif text-[1.35rem] font-semibold leading-tight text-ink sm:text-[1.5rem]">{title}</h1>
              </div>
              <NewPostMenu className="hidden sm:inline-flex" />
            </div>
          </header>

          <main id="admin-main" className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-6 pb-28 sm:px-6 lg:px-8 lg:pb-10">
            {children}
          </main>
        </div>

        <NewPostMenu variant="fab" />
      </div>
    </TooltipProvider>
  );
}
