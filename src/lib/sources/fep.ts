import * as cheerio from "cheerio";
import { categorize } from "../categories";
import { fetchText } from "../http";
import { absoluteUrl, clean, isFreeText, parsePlDate } from "../text";
import type { Offer, OfferStatus } from "../types";

const BASE = "https://funduszeue.podkarpackie.pl";
export const FEP_SOURCE = {
  id: "fep",
  name: "Fundusze Europejskie dla Podkarpacia",
  url: `${BASE}/nabory`,
};

const STATUS: Record<string, OfferStatus> = {
  AKTUALNY: "aktualny",
  PLANOWANY: "planowany",
  "ZAKOŃCZONY": "zakonczony",
};

function parsePage(html: string): Offer[] {
  const $ = cheerio.load(html);
  const offers: Offer[] = [];
  $("li.jf-card").each((_, el) => {
    const card = $(el);
    const badge = clean(card.find(".jf-badge__text").first().text()).toUpperCase();
    const status = STATUS[badge];
    if (!status) return;
    const link = card.find("a.jf-card__link").first();
    const title = clean(link.text());
    const href = link.attr("href");
    if (!title || !href) return;
    const code = clean(card.find(".jf-card__topcode").text());

    const details: string[] = [];
    let amount: string | undefined;
    card.find(".jf-aside__label").each((_, l) => {
      const label = clean($(l).text());
      const value = clean($(l).next(".jf-aside__amount").text());
      if (!value) return;
      if (/MAKSYMALNA KWOTA/i.test(label)) amount = `do ${value}`;
      const pretty = label.charAt(0) + label.slice(1).toLowerCase();
      details.push(`${pretty}: ${value}`);
    });
    let startDate: string | undefined;
    let endDate: string | undefined;
    card.find(".jf-aside__dateblock").each((_, d) => {
      const label = clean($(d).find(".jf-aside__dateLabel").text());
      const val = parsePlDate($(d).find(".jf-aside__dateVal").text());
      if (/START/i.test(label)) startDate = val;
      if (/KONIEC/i.test(label)) endDate = val;
    });
    const pub = card.find(".jf-card__pubdate").text().match(/publikacji:\s*([\d.]+)/);

    offers.push({
      id: `fep-${code || href}`,
      title,
      url: absoluteUrl(href, BASE),
      sourceId: FEP_SOURCE.id,
      sourceName: FEP_SOURCE.name,
      type: "dofinansowanie",
      categories: categorize(title),
      summary: code ? `Nabór ${code} dla wnioskodawców z województwa podkarpackiego.` : undefined,
      location: "województwo podkarpackie",
      publishedAt: parsePlDate(pub?.[1]),
      startDate,
      endDate,
      status,
      amount,
      details,
      free: isFreeText(title),
    });
  });
  return offers;
}

export async function fetchFep(): Promise<Offer[]> {
  const pages = await Promise.all(
    [0, 50, 100].map((start) =>
      fetchText(`${BASE}/nabory${start ? `?start=${start}` : ""}`).catch(() => ""),
    ),
  );
  if (pages.every((p) => !p)) throw new Error("FEP niedostępne");
  const seen = new Set<string>();
  return pages.flatMap(parsePage).filter((o) => !seen.has(o.id) && seen.add(o.id));
}
