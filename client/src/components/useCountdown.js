import { useEffect, useState, useCallback } from 'react';

export default function useCountdown(initial = 30) {
  const [left, setLeft] = useState(initial);
  useEffect(() => {
    if (left <= 0) return;
    const id = setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => clearTimeout(id);
  }, [left]);
  const reset = useCallback((s = initial) => setLeft(s), [initial]);
  return [left, reset];
}
