const BASE = import.meta.env.VITE_API_URL || '';
export const api = (path, opts) => fetch(`${BASE}${path}`, opts);
