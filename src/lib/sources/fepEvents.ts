import * as cheerio from "cheerio";
import { categorize } from "../categories";
import { fetchText } from "../http";
import { clean, isFreeText } from "../text";
import type { Offer } from "../types";

export const FEP_EVENTS_SOURCE = {
  id: "fep-szkolenia",
  name: "FEP: szkolenia i spotkania informacyjne",
  url: "https://funduszeue.podkarpackie.pl/szczegoly-programu/szkolenia-i-konferencje",
};

export async function fetchFepEvents(): Promise<Offer[]> {
  const xml = await fetchText(`${FEP_EVENTS_SOURCE.url}?format=feed&type=rss`);
  const $ = cheerio.load(xml, { xml: true });
  const offers: Offer[] = [];
  $("item").each((_, el) => {
    const item = $(el);
    const title = clean(item.find("title").text());
    const url = clean(item.find("link").text());
    if (!title || !url) return;
    const descHtml = item.find("description").text();
    const summary = clean(cheerio.load(descHtml).text()).slice(0, 280);
    const date = new Date(item.find("pubDate").text());
    offers.push({
      id: `fepsz-${url}`,
      title,
      url,
      sourceId: FEP_EVENTS_SOURCE.id,
      sourceName: "Fundusze Europejskie dla Podkarpacia",
      type: "spotkanie",
      categories: categorize(`${title} ${summary}`),
      summary: summary || undefined,
      location: "Rzeszów / online",
      publishedAt: Number.isNaN(date.getTime()) ? undefined : date.toISOString().slice(0, 10),
      free: isFreeText(`${title} ${summary}`),
    });
  });
  return offers;
}
