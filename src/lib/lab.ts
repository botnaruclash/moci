/** /lab and the grid overlay run in development, or in a production build made with NEXT_PUBLIC_ENABLE_LAB=1. */
export const labEnabled =
  process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_ENABLE_LAB === "1";
