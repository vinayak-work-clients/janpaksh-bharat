/** @type {import('next').NextConfig} */

// Supabase Storage public URLs: next/image needs the project host allow-listed.
const supabaseHost = (() => {
  try {
    return process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname : null;
  } catch {
    return null;
  }
})();

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "videos.pexels.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
      // Any Supabase project host, so a preview/staging project also works.
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
      ...(supabaseHost && !supabaseHost.endsWith(".supabase.co")
        ? [{ protocol: "https", hostname: supabaseHost }]
        : []),
    ],
  },
};

export default nextConfig;
