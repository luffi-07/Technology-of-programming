let count = 0;
export function getCount() { return count; }
export function changeCount(step) { count += step; return count; }
export function resetCount() { count = 0; return count; }