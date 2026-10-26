import type { CategoryId } from "./types";
import { normalize } from "./text";

export interface CategoryDef {
  id: CategoryId;
  label: string;
  description: string;
  keywords: string[];
}

export const CATEGORIES: CategoryDef[] = [
  {
    id: "dzialalnosc",
    label: "Założenie firmy",
    description: "Dotacje na start własnej działalności",
    keywords: ["podjecia dzialalnosci", "podjecie dzialalnosci", "podjeciu dzialalnosci", "wlasnej dzialalnosci", "wlasnej firmy", "zalozenie dzialalnosci", "zalozenia dzialalnosci", "start-up", "startup", "jednorazowych srodkow", "jednorazowe srodki"],
  },
  {
    id: "praca",
    label: "Praca i staże",
    description: "Wsparcie dla bezrobotnych i pracodawców",
    keywords: ["staz", "bezrobot", "zatrudnien", "stanowisk", "prace interwencyjne", "roboty publiczne", "aktywizac", "poszukujac", "refundac", "doposazen", "wyposazeni", "mlodocian", "rynku pracy", "aktywnosci zawodowej"],
  },
  {
    id: "kompetencje",
    label: "Szkolenia zawodowe",
    description: "KFS, kwalifikacje, uprawnienia",
    keywords: ["kfs", "krajowy fundusz szkoleniowy", "krajowego funduszu szkoleniowego", "szkolen", "kwalifikac", "kompetenc", "uprawnien", "certyfik", "ksztalceni"],
  },
  {
    id: "firmy",
    label: "Rozwój firmy",
    description: "Innowacje, inwestycje, zarządzanie",
    keywords: ["przedsiebiorst", "przedsiebiorc", "msp", "innowac", "badania i rozwoj", "b+r", "eksport", "konkurencyjn", "biznes", "zarzadzan", "marketing", "sprzedaz", "ksiegow", "kadr", "rachunkow", "podatk", "lider", "negocjac", "pracodawc"],
  },
  {
    id: "jezyki",
    label: "Języki obce",
    description: "Kursy językowe",
    keywords: ["jezyk", "angielsk", "niemieck", "hiszpansk", "wlosk", "francusk", "rosyjsk", "ukrainsk", "english"],
  },
  {
    id: "it",
    label: "Komputery i cyfryzacja",
    description: "IT, cyberbezpieczeństwo, umiejętności cyfrowe",
    keywords: ["cyfrow", "cyber", "informaty", "komputer", "excel", "programowan", "sztuczn", "inteligenc", "grafik", "office", "internet", "e-commerce", "social media", "python", "javascript", "autocad", "photoshop", "canva"],
  },
  {
    id: "transport",
    label: "Prawo jazdy i transport",
    description: "Kategorie prawa jazdy, wózki, kwalifikacje kierowców",
    keywords: ["prawo jazdy", "prawa jazdy", "kat. ", "kategorii c", "kategorii d", "kategorii b", "kwalifikacja wstepna", "kwalifikacji wstepnej", "wozk", "kierowc", "przewoz", "koparko", "ladowark", "suwnic", "dzwig", "podest"],
  },
  {
    id: "technika",
    label: "Technika i budownictwo",
    description: "Spawanie, elektryka, instalacje",
    keywords: ["spawa", "elektry", "sep ", "budow", "instalac", "fotowolt", "mechani", "cnc", "hydraul", "dekarz", "stolar", "murar", "malar", "automaty", "energetyk", "pomp ciepla", "chlodnic", "klimatyzac", "f-gaz", "obrabiar", "tokar"],
  },
  {
    id: "uroda",
    label: "Uroda i kosmetyka",
    description: "Stylizacja, kosmetyka, fryzjerstwo",
    keywords: ["paznok", "stylizac", "kosmet", "makijaz", "fryzjer", "rzesy", "rzes ", "rzesach", "rzesami", "brwi", "manicure", "pedicure", "wizaz", "beauty", "lash", "depilac", "podolog", "trycholog", "modelowani sylwetki"],
  },
  {
    id: "zdrowie",
    label: "Zdrowie i opieka",
    description: "Medycyna, opieka, terapia",
    keywords: ["zdrow", "medycz", "pielegn", "opiekun", "opieki", "terapi", "fizjoterap", "stomatolog", "rehabilit", "psycholog", "dietet", "ratown", "pierwszej pomocy", "masaz", "lekarz"],
  },
  {
    id: "gastronomia",
    label: "Gastronomia",
    description: "Kuchnia, barista, cukiernictwo",
    keywords: ["kuchar", "gastronom", "barista", "barman", "cukier", "piekar", "kuchni", "sommel", "catering", "kawy"],
  },
  {
    id: "edukacja",
    label: "Szkoły i edukacja",
    description: "Uczniowie, nauczyciele, przedszkola",
    keywords: ["szkolnictw", "uczni", "nauczyciel", "przedszkol", "edukac", "szkoly", "szkolach", "szkol podstawow", "szkoln", "mlodziez", "student", "uczelni", "wychowaw", "pedagog"],
  },
  {
    id: "spoleczne",
    label: "Pomoc społeczna i integracja",
    description: "Rodziny, seniorzy, osoby z niepełnosprawnościami",
    keywords: ["spoleczn", "integrac", "niepelnospraw", "wykluczen", "rodzin", "senior", "osob starszych", "cudzoziem", "ukrain", "pfron", "pozarzadow", "ekonomii spolecznej", "rownosci", "rownosciow"],
  },
  {
    id: "ekologia",
    label: "Ekologia i energia",
    description: "OZE, Czyste Powietrze, klimat",
    keywords: ["energ", " oze ", "(oze)", "klimat", "srodowisk", "czyste powietrze", "termomoderniz", "cieplo", "cieplne", " wodn", " wody", "retenc", "odpad", "obiegu zamknietego", "ekolog", "niskoemis", "dnsh", "przyrod", "bioroznorod"],
  },
  {
    id: "kultura",
    label: "Kultura, sport i turystyka",
    description: "Kultura, dziedzictwo, rekreacja",
    keywords: ["kultur", " sport", " sportow", "turyst", "dziedzict", "zabyt", "muze", "bibliot", "rekreac", "artyst", "muzyk", "teatr", "fotograf"],
  },
  {
    id: "samorzad",
    label: "Infrastruktura i samorządy",
    description: "Gminy, drogi, bezpieczeństwo",
    keywords: ["infrastrukt", "drog", "jst", "samorzad", "gmin", "transport publiczn", "rewitaliz", "mobilnosc", "bezpieczenstw", "gotowosci cywilnej", "kryzysow", "miejsk", "terytorial"],
  },
  {
    id: "rolnictwo",
    label: "Rolnictwo i wieś",
    description: "Rolnicy, obszary wiejskie, leśnictwo",
    keywords: ["roln", "obszarow wiejskich", "wsi ", "agro", "arimr", "gospodarstw", "lesn", "lgd", "pszczel", "ogrodni"],
  },
  {
    id: "inne",
    label: "Inne",
    description: "Pozostałe ogłoszenia",
    keywords: [],
  },
];

export const CATEGORY_BY_ID = Object.fromEntries(CATEGORIES.map((c) => [c.id, c])) as Record<
  CategoryId,
  CategoryDef
>;

export function categorize(text: string, extra: CategoryId[] = []): CategoryId[] {
  const haystack = ` ${normalize(text)} `;
  const found = new Set<CategoryId>(extra);
  for (const cat of CATEGORIES) {
    if (cat.keywords.some((k) => haystack.includes(k))) found.add(cat.id);
  }
  if (found.size === 0) found.add("inne");
  return CATEGORIES.map((c) => c.id).filter((id) => found.has(id));
}

export const TYPE_LABELS = {
  dofinansowanie: "Dofinansowania i dotacje",
  kurs: "Kursy i szkolenia",
  spotkanie: "Spotkania i wydarzenia",
} as const;
