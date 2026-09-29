// The two sites' origins: the brand site (bytemochi.com) and the campaign site with the results (get.bytemochi.com).
// Both projects share this file. The defaults are the local dev servers (npm run dev in each project), so a local
// copy never links to a live domain; set both variables to the real domains before any deploy.
export const BRAND_URL = (process.env.NEXT_PUBLIC_BRAND_URL || "http://localhost:3100").replace(/\/$/, "");
export const GET_URL = (process.env.NEXT_PUBLIC_GET_URL || "http://localhost:3200").replace(/\/$/, "");
