import { notFound } from "next/navigation";

/**
 * Catch-all so unmatched URLs render (site)/not-found.tsx inside the public
 * chrome. Real routes (static, dynamic and /admin) always take precedence.
 */
export default function CatchAll() {
  notFound();
}
