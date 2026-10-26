import { BUR_SOURCE, fetchBur } from "./sources/bur";
import { FEP_SOURCE, fetchFep } from "./sources/fep";
import { FEP_EVENTS_SOURCE, fetchFepEvents } from "./sources/fepEvents";
import { PUP_SOURCE, fetchLabourOffices } from "./sources/pup";
import { PROGRAMS, PROGRAMS_SOURCE } from "./sources/programs";
import type { Offer, OffersResult, SourceReport } from "./types";

const LIVE_SOURCES = [
  { meta: FEP_SOURCE, load: fetchFep },
  { meta: PUP_SOURCE, load: fetchLabourOffices },
  { meta: BUR_SOURCE, load: fetchBur },
  { meta: FEP_EVENTS_SOURCE, load: fetchFepEvents },
];

export async function getOffers(): Promise<OffersResult> {
  const results = await Promise.allSettled(LIVE_SOURCES.map((s) => s.load()));
  const offers: Offer[] = [...PROGRAMS];
  const sources: SourceReport[] = [
    { ...PROGRAMS_SOURCE, count: PROGRAMS.length, ok: true },
  ];
  results.forEach((r, i) => {
    const { meta } = LIVE_SOURCES[i];
    if (r.status === "fulfilled") {
      offers.push(...r.value);
      sources.push({ ...meta, count: r.value.length, ok: true });
    } else {
      console.error(`[${meta.id}]`, r.reason);
      sources.push({ ...meta, count: 0, ok: false });
    }
  });
  const seen = new Set<string>();
  return {
    offers: offers.filter((o) => !seen.has(o.id) && seen.add(o.id)),
    sources,
    fetchedAt: new Date().toISOString(),
  };
}
