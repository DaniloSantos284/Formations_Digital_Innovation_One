import { useState, useCallback } from "react";

export function useLoading() {
  const [loading, setLoading] = useState<boolean>(false);

  const widthLoading = useCallback(async <T>(fn: () => Promise<T>) => {
    try {
      setLoading(true);
      return await fn();
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, widthLoading };
}