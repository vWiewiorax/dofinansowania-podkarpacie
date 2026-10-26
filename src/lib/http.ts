const USER_AGENT =
  "Mozilla/5.0 (compatible; DofinansowaniaPodkarpacie/1.0; +https://github.com/vWiewiorax)";

export const REVALIDATE_SECONDS = 3600;

export async function fetchText(url: string, timeoutMs = 15000): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT, "Accept-Language": "pl-PL,pl;q=0.9" },
    signal: AbortSignal.timeout(timeoutMs),
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return res.text();
}

export async function mapLimit<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<PromiseSettledResult<R>[]> {
  const results: PromiseSettledResult<R>[] = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      try {
        results[i] = { status: "fulfilled", value: await fn(items[i]) };
      } catch (reason) {
        results[i] = { status: "rejected", reason };
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}
