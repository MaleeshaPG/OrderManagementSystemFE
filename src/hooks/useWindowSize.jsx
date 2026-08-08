import { useState, useEffect } from "react";

export default function useWindowSize() {
  const isClient = typeof window === "object";
  const [width, setWidth] = useState(isClient ? window.innerWidth : 1080);

  useEffect(() => {
    if (!isClient) return;
    const handle = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, [isClient]);

  return { width };
}
