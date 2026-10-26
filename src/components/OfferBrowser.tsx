"use client";

import { useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, ExternalLink, MapPin, Search, XCircle } from "lucide-react";
import CategoryIcon from "./CategoryIcon";
import { CATEGORIES, CATEGORY_BY_ID, TYPE_LABELS } from "@/lib/categories";
import { normalize } from "@/lib/text";
import type { CategoryId, Offer, OffersResult, OfferType } from "@/lib/types";

const PAGE_SIZE = 24;
const STALE_DAYS = 180;

type TypeFilter = OfferType | "all";
type Sort = "newest" | "deadline";

function formatDate(iso?: string) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

function isActive(o: Offer, today: string, staleBefore: string) {
  if (o.permanent) return true;
  if (o.status === "zakonczony") return false;
  if (o.endDate && o.endDate < today) return false;
  if (!o.endDate && !o.status && o.publishedAt && o.publishedAt < staleBefore) return false;
  return true;
}

function sortKey(o: Offer) {
  return o.publishedAt ?? o.startDate ?? "";
}

const STATUS_STYLE: Record<string, string> = {
  aktualny: "bg-emerald-100 text-emerald-800",
  planowany: "bg-amber-100 text-amber-800",
  zakonczony: "bg-slate-200 text-slate-600",
};
const STATUS_LABEL: Record<string, string> = {
  aktualny: "Nabór trwa",
  planowany: "Planowany",
  zakonczony: "Zakończony",
};
const TYPE_STYLE: Record<OfferType, string> = {
  dofinansowanie: "bg-brand-50 text-brand-800 ring-brand-100",
  kurs: "bg-sky-50 text-sky-800 ring-sky-100",
  spotkanie: "bg-violet-50 text-violet-800 ring-violet-100",
};
const TYPE_SHORT: Record<OfferType, string> = {
  dofinansowanie: "Dofinansowanie",
  kurs: "Kurs / szkolenie",
  spotkanie: "Spotkanie",
};

export default function OfferBrowser({ data }: { data: OffersResult }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<TypeFilter>("all");
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [onlyFree, setOnlyFree] = useState(false);
  const [showEnded, setShowEnded] = useState(false);
  const [sort, setSort] = useState<Sort>("deadline");
  const [limit, setLimit] = useState(PAGE_SIZE);

  const { today, staleBefore } = useMemo(() => {
    const now = new Date(data.fetchedAt);
    const stale = new Date(now.getTime() - STALE_DAYS * 86400000);
    return { today: now.toISOString().slice(0, 10), staleBefore: stale.toISOString().slice(0, 10) };
  }, [data.fetchedAt]);

  const indexed = useMemo(
    () =>
      data.offers.map((o) => ({
        offer: o,
        text: normalize(`${o.title} ${o.summary ?? ""} ${o.location ?? ""} ${o.sourceName}`),
      })),
    [data.offers],
  );

  const base = useMemo(() => {
    const terms = normalize(query).split(/\s+/).filter(Boolean);
    return indexed
      .filter(({ offer, text }) => {
        if (!showEnded && !isActive(offer, today, staleBefore)) return false;
        if (onlyFree && !offer.free) return false;
        return terms.every((t) => text.includes(t));
      })
      .map((x) => x.offer);
  }, [indexed, query, onlyFree, showEnded, today, staleBefore]);

  const typeCounts = useMemo(() => {
    const counts: Record<TypeFilter, number> = { all: 0, dofinansowanie: 0, kurs: 0, spotkanie: 0 };
    for (const o of base) {
      if (category && !o.categories.includes(category)) continue;
      counts.all++;
      counts[o.type]++;
    }
    return counts;
  }, [base, category]);

  const categoryCounts = useMemo(() => {
    const counts = new Map<CategoryId, number>();
    for (const o of base) {
      if (type !== "all" && o.type !== type) continue;
      for (const c of o.categories) counts.set(c, (counts.get(c) ?? 0) + 1);
    }
    return counts;
  }, [base, type]);

  const filtered = useMemo(() => {
    const list = base.filter(
      (o) => (type === "all" || o.type === type) && (!category || o.categories.includes(category)),
    );
    const programs = list.filter((o) => o.permanent);
    const items = list.filter((o) => !o.permanent);
    if (sort === "deadline") {
      const upcoming = (o: Offer) => {
        const d = o.type === "kurs" ? o.startDate : (o.endDate ?? o.startDate);
        return d && d >= today ? d : "9999";
      };
      items.sort((a, b) => upcoming(a).localeCompare(upcoming(b)) || sortKey(b).localeCompare(sortKey(a)));
    } else {
      items.sort(
        (a, b) =>
          (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "") ||
          (a.startDate ?? "9999").localeCompare(b.startDate ?? "9999"),
      );
    }
    return { programs, items };
  }, [base, type, category, sort, today]);

  const resetPaging = () => setLimit(PAGE_SIZE);
  const activeCategory = category ? CATEGORY_BY_ID[category] : null;

  return (
    <div className="min-h-screen">
      <header className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 text-white">
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-8 sm:px-6">
          <p className="text-sm font-medium uppercase tracking-wider text-emerald-200">Województwo podkarpackie</p>
          <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">
            Dofinansowania, darmowe kursy i szkolenia na Podkarpaciu
          </h1>
          <p className="mt-3 max-w-2xl text-emerald-50/90">
            Nabory wniosków, dotacje z urzędów pracy, kursy z dofinansowaniem i bezpłatne spotkania w jednym miejscu.
            Dane pobierane automatycznie z oficjalnych serwisów i odświeżane co godzinę.
          </p>
          <label className="relative mt-6 block max-w-2xl">
            <span className="sr-only">Szukaj</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                resetPaging();
              }}
              placeholder="Szukaj, np. prawo jazdy, Krosno, dotacja na firmę, angielski"
              className="w-full rounded-xl border-0 bg-white py-3.5 pl-12 pr-4 text-slate-900 shadow-lg outline-none ring-2 ring-transparent placeholder:text-slate-400 focus:ring-emerald-300"
            />
          </label>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Rodzaj">
          {(["all", "dofinansowanie", "kurs", "spotkanie"] as TypeFilter[]).map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={type === t}
              onClick={() => {
                setType(t);
                resetPaging();
              }}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                type === t
                  ? "bg-brand-700 text-white shadow"
                  : "bg-white text-slate-700 ring-1 ring-slate-200 hover:ring-brand-600"
              }`}
            >
              {t === "all" ? "Wszystko" : TYPE_LABELS[t]}
              <span className={`ml-2 text-xs ${type === t ? "text-emerald-100" : "text-slate-400"}`}>
                {typeCounts[t]}
              </span>
            </button>
          ))}
        </div>

        <section className="mt-6" aria-labelledby="kategorie">
          <h2 id="kategorie" className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Kategorie
          </h2>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {CATEGORIES.map((c) => {
              const count = categoryCounts.get(c.id) ?? 0;
              const selected = category === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setCategory(selected ? null : c.id);
                    resetPaging();
                  }}
                  disabled={count === 0 && !selected}
                  title={c.description}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition disabled:cursor-not-allowed disabled:opacity-40 ${
                    selected
                      ? "bg-brand-700 text-white shadow"
                      : "bg-white text-slate-800 ring-1 ring-slate-200 hover:ring-brand-600"
                  }`}
                >
                  <CategoryIcon id={c.id} className={`h-5 w-5 shrink-0 ${selected ? "text-white" : "text-brand-600"}`} />
                  <span className="min-w-0 flex-1 leading-tight">{c.label}</span>
                  <span className={`text-xs ${selected ? "text-emerald-100" : "text-slate-400"}`}>{count}</span>
                </button>
              );
            })}
          </div>
        </section>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-xl bg-white px-4 py-3 text-sm ring-1 ring-slate-200">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={onlyFree}
              onChange={(e) => {
                setOnlyFree(e.target.checked);
                resetPaging();
              }}
              className="h-4 w-4 accent-emerald-700"
            />
            Tylko oznaczone jako bezpłatne
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={showEnded}
              onChange={(e) => {
                setShowEnded(e.target.checked);
                resetPaging();
              }}
              className="h-4 w-4 accent-emerald-700"
            />
            Pokaż zakończone i starsze
          </label>
          <label className="ml-auto flex items-center gap-2">
            Sortuj:
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1"
            >
              <option value="deadline">najbliższy termin</option>
              <option value="newest">najnowsze ogłoszenia</option>
            </select>
          </label>
        </div>

        {activeCategory && (
          <p className="mt-4 text-sm text-slate-600">
            Kategoria: <strong>{activeCategory.label}</strong> ({activeCategory.description}).{" "}
            <button className="text-brand-700 underline" onClick={() => setCategory(null)}>
              Wyczyść
            </button>
          </p>
        )}

        {filtered.programs.length > 0 && (
          <section className="mt-8" aria-labelledby="programy">
            <h2 id="programy" className="text-xl font-semibold">Stałe programy wsparcia</h2>
            <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {filtered.programs.map((o) => (
                <a
                  key={o.id}
                  href={o.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col rounded-xl bg-white p-4 ring-1 ring-slate-200 transition hover:shadow-md hover:ring-brand-600"
                >
                  <span className="flex items-start justify-between gap-2 font-semibold leading-snug group-hover:text-brand-700">
                    {o.title}
                    <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  </span>
                  <span className="mt-2 text-sm text-slate-600">{o.summary}</span>
                  <span className="mt-auto pt-3 text-xs text-slate-500">{o.sourceName}</span>
                </a>
              ))}
            </div>
          </section>
        )}

        <section className="mt-10" aria-labelledby="ogloszenia">
          <div className="flex items-baseline justify-between">
            <h2 id="ogloszenia" className="text-xl font-semibold">Aktualne ogłoszenia</h2>
            <span className="text-sm text-slate-500">{filtered.items.length} wyników</span>
          </div>
          {filtered.items.length === 0 ? (
            <p className="mt-6 rounded-xl bg-white p-6 text-center text-slate-600 ring-1 ring-slate-200">
              Brak wyników dla wybranych filtrów. Spróbuj zmienić kategorię lub wyszukiwaną frazę.
            </p>
          ) : (
            <ul className="mt-4 grid gap-3">
              {filtered.items.slice(0, limit).map((o) => (
                <OfferCard key={o.id} offer={o} />
              ))}
            </ul>
          )}
          {filtered.items.length > limit && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setLimit((l) => l + PAGE_SIZE)}
                className="rounded-full bg-brand-700 px-6 py-2.5 text-sm font-medium text-white shadow hover:bg-brand-800"
              >
                Pokaż więcej ({filtered.items.length - limit})
              </button>
            </div>
          )}
        </section>
      </main>

      <footer className="mt-12 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-600 sm:px-6">
          <h2 className="font-semibold text-slate-800">Źródła danych</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {data.sources.map((s) => (
              <li key={s.id} className="flex items-center gap-2">
                {s.ok ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-rose-500" />
                )}
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-brand-700 hover:underline">
                  {s.name}
                </a>
                <span className="text-slate-400">{s.ok ? `(${s.count})` : "(chwilowo niedostępne)"}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            Ostatnia aktualizacja: {new Date(data.fetchedAt).toLocaleString("pl-PL", { timeZone: "Europe/Warsaw" })}.
            Serwis zbiera ogłoszenia automatycznie. Warunki, terminy i kwoty zawsze sprawdź na stronie źródłowej.
          </p>
        </div>
      </footer>
    </div>
  );
}

function OfferCard({ offer: o }: { offer: Offer }) {
  const dateLine =
    o.startDate || o.endDate
      ? `${o.type === "dofinansowanie" ? "Nabór" : "Termin"}: ${formatDate(o.startDate)}${
          o.endDate && o.endDate !== o.startDate ? ` - ${formatDate(o.endDate)}` : ""
        }`
      : o.publishedAt
        ? `Opublikowano: ${formatDate(o.publishedAt)}`
        : "";
  return (
    <li className="rounded-xl bg-white p-4 ring-1 ring-slate-200 transition hover:shadow-md sm:p-5">
      <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
        <span className={`rounded-full px-2.5 py-1 ring-1 ${TYPE_STYLE[o.type]}`}>{TYPE_SHORT[o.type]}</span>
        {o.status && <span className={`rounded-full px-2.5 py-1 ${STATUS_STYLE[o.status]}`}>{STATUS_LABEL[o.status]}</span>}
        {o.free && <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-white">Bezpłatne</span>}
        <span className="text-slate-500">{o.sourceName}</span>
      </div>
      <h3 className="mt-2 text-base font-semibold leading-snug sm:text-lg">
        <a href={o.url} target="_blank" rel="noopener noreferrer" className="hover:text-brand-700 hover:underline">
          {o.title}
        </a>
      </h3>
      {o.summary && <p className="mt-1.5 line-clamp-3 text-sm text-slate-600">{o.summary}</p>}
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-slate-600">
        {dateLine && (
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4 text-slate-400" />
            {dateLine}
          </span>
        )}
        {o.location && (
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-slate-400" />
            {o.location}
          </span>
        )}
        {o.amount && <span className="font-medium text-slate-800">Dotacja {o.amount}</span>}
        {o.price && <span className="font-medium text-slate-800">{o.price}</span>}
      </div>
      {o.details && o.details.length > 0 && (
        <p className="mt-2 text-xs text-slate-500">{o.details.join(" · ")}</p>
      )}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {o.categories.map((c) => (
          <span key={c} className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
            <CategoryIcon id={c} className="h-3.5 w-3.5 text-brand-600" />
            {CATEGORY_BY_ID[c].label}
          </span>
        ))}
      </div>
    </li>
  );
}
