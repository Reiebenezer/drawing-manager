export function debounce<T extends Function>(fn: T, delay: number) {
  let timeoutId: NodeJS.Timeout;

  return function(this: unknown, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  } 
}