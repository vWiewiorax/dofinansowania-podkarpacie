import * as cheerio from "cheerio";
import { categorize } from "../categories";
import { fetchText, mapLimit } from "../http";
import { clean, isFreeText, normalize, parsePlDate } from "../text";
import type { Offer, OfferType } from "../types";

export const LABOUR_OFFICES = [
  { host: "wuprzeszow", name: "Wojewódzki Urząd Pracy w Rzeszowie", area: "województwo podkarpackie" },
  { host: "brzozow", name: "PUP Brzozów", area: "powiat brzozowski" },
  { host: "debica", name: "PUP Dębica", area: "powiat dębicki" },
  { host: "jaroslaw", name: "PUP Jarosław", area: "powiat jarosławski" },
  { host: "jaslo", name: "PUP Jasło", area: "powiat jasielski" },
  { host: "kolbuszowa", name: "PUP Kolbuszowa", area: "powiat kolbuszowski" },
  { host: "krosno", name: "PUP Krosno", area: "Krosno i powiat krośnieński" },
  { host: "lesko", name: "PUP Lesko", area: "powiat leski" },
  { host: "lezajsk", name: "PUP Leżajsk", area: "powiat leżajski" },
  { host: "lubaczow", name: "PUP Lubaczów", area: "powiat lubaczowski" },
  { host: "lancut", name: "PUP Łańcut", area: "powiat łańcucki" },
  { host: "mielec", name: "PUP Mielec", area: "powiat mielecki" },
  { host: "nisko", name: "PUP Nisko", area: "powiat niżański" },
  { host: "przemysl", name: "PUP Przemyśl", area: "Przemyśl i powiat przemyski" },
  { host: "przeworsk", name: "PUP Przeworsk", area: "powiat przeworski" },
  { host: "ropczyce", name: "PUP Ropczyce", area: "powiat ropczycko-sędziszowski" },
  { host: "rzeszow", name: "PUP Rzeszów", area: "Rzeszów i powiat rzeszowski" },
  { host: "sanok", name: "PUP Sanok", area: "powiat sanocki" },
  { host: "stalowawola", name: "PUP Stalowa Wola", area: "powiat stalowowolski" },
  { host: "strzyzow", name: "PUP Strzyżów", area: "powiat strzyżowski" },
  { host: "tarnobrzeg", name: "PUP Tarnobrzeg", area: "Tarnobrzeg i powiat tarnobrzeski" },
  { host: "ustrzykidolne", name: "PUP Ustrzyki Dolne", area: "powiat bieszczadzki" },
];

export const PUP_SOURCE = {
  id: "pup",
  name: "Urzędy pracy (WUP Rzeszów i 21 PUP)",
  url: "https://wuprzeszow.praca.gov.pl/rynek-pracy/aktualnosci",
};

const RELEVANT =
  /nabor|dofinans|dotac|szkolen|kurs|bon|staz|kfs|refundac|projekt|warsztat|bezplat|grant|wsparci|program|srodk|dzialalnosc|aktywizac|kwalifikac|doradztw|prace interwencyjne|roboty publiczne/;
const IRRELEVANT = /gielda pracy|targi pracy|dzien otwarty|wynik|lista rankingow|zamkniecie|podsumowani|badani|ankiet|godziny pracy|nieczynn|komunikat|ostrzez|oszust/;

const ENDED = /zakonczon|zakonczeni|wstrzyman|brak srodkow|wyczerpan/;

function typeFor(text: string): OfferType {
  if (/targi|dni pracodawc|spotkani|konferenc|webinar|dzien otwart/.test(text)) return "spotkanie";
  if (/szkolen|kurs|warsztat|kwalifikac/.test(text) && !/nabor wnioskow|dofinans|refundac/.test(text)) {
    return "kurs";
  }
  return "dofinansowanie";
}

function parse(html: string, office: (typeof LABOUR_OFFICES)[number], base: string): Offer[] {
  const $ = cheerio.load(html);
  const offers: Offer[] = [];
  $(".nnk-article-list .row").each((_, el) => {
    const row = $(el);
    const link = row.find(".nnk-article-link-underline a").first();
    const title = clean(link.text());
    const href = link.attr("href");
    if (!title || !href) return;
    const summary = clean(row.find(".nnk-article-list-article-summary").text());
    const text = normalize(`${title} ${summary}`);
    if (!RELEVANT.test(text) || IRRELEVANT.test(normalize(title))) return;
    const url = new URL(href, base);
    url.search = "";
    offers.push({
      id: `pup-${office.host}-${url.pathname}`,
      title,
      url: url.toString(),
      sourceId: PUP_SOURCE.id,
      sourceName: office.name,
      type: typeFor(text),
      categories: categorize(`${title} ${summary}`),
      summary: summary || undefined,
      location: office.area,
      publishedAt: parsePlDate(row.find(".nnk-article-list-article-publish-date").text()),
      free: isFreeText(`${title} ${summary}`),
      status: ENDED.test(normalize(title)) ? "zakonczony" : undefined,
    });
  });
  return offers;
}

export async function fetchLabourOffices(): Promise<Offer[]> {
  const results = await mapLimit(LABOUR_OFFICES, 6, async (office) => {
    const base = `https://${office.host}.praca.gov.pl`;
    const html = await fetchText(`${base}/rynek-pracy/aktualnosci`, 12000);
    return parse(html, office, base);
  });
  const ok = results.filter((r) => r.status === "fulfilled");
  if (ok.length === 0) throw new Error("Urzędy pracy niedostępne");
  return ok.flatMap((r) => (r as PromiseFulfilledResult<Offer[]>).value);
}
