import * as cheerio from "cheerio";
import { categorize } from "../categories";
import { fetchText } from "../http";
import { clean, parsePlDate } from "../text";
import type { Offer } from "../types";

const BASE = "https://uslugirozwojowe.parp.gov.pl";
const SEARCH = `${BASE}/wyszukiwarka/uslugi/szukaj?miejsceSzkolenia=podkarpackie&wojewodztwoId=9&per-page=100`;
const PAGES = 4;

export const BUR_SOURCE = {
  id: "bur",
  name: "Baza Usług Rozwojowych (PARP)",
  url: `${BASE}/wyszukiwarka/uslugi/szukaj?miejsceSzkolenia=podkarpackie&wojewodztwoId=9`,
};

function parse(html: string): Offer[] {
  const $ = cheerio.load(html);
  const offers: Offer[] = [];
  $("div[data-key]").each((_, el) => {
    const card = $(el);
    if (!/dofinansowania/i.test(card.find(".card-ribbon").text())) return;
    const link = card.find(".service h3 a").first();
    const title = clean(link.text());
    const href = link.attr("href");
    if (!title || !href) return;
    const provider = clean(card.find(".service-provider a").first().text());
    const price = clean(card.find(".prices .price").first().text());
    const props = card
      .find(".properties .text-with-icon span")
      .map((_, s) => clean($(s).text()))
      .get();
    const [city, kind, form, variant, hours, dates] = props;
    const [from, to] = (dates ?? "").split(" do ");
    offers.push({
      id: `bur-${card.attr("data-key")}`,
      title,
      url: new URL(href, BASE).toString(),
      sourceId: BUR_SOURCE.id,
      sourceName: BUR_SOURCE.name,
      type: "kurs",
      categories: categorize(title, ["kompetencje"]),
      summary: provider ? `Organizator: ${provider}` : undefined,
      location: city,
      startDate: parsePlDate(from),
      endDate: parsePlDate(to),
      price: price ? `${price} brutto, możliwość dofinansowania` : undefined,
      details: [kind, form, variant, hours ? `${hours} zajęć` : ""].filter(Boolean) as string[],
    });
  });
  return offers;
}

export async function fetchBur(): Promise<Offer[]> {
  const pages = await Promise.all(
    Array.from({ length: PAGES }, (_, i) =>
      fetchText(`${SEARCH}&page=${i + 1}`, 20000).catch(() => ""),
    ),
  );
  if (pages.every((p) => !p)) throw new Error("BUR niedostępny");
  const seen = new Set<string>();
  return pages.flatMap(parse).filter((o) => !seen.has(o.id) && seen.add(o.id));
}
