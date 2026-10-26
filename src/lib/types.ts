export type OfferType = "dofinansowanie" | "kurs" | "spotkanie";

export type OfferStatus = "aktualny" | "planowany" | "zakonczony";

export type CategoryId =
  | "dzialalnosc"
  | "praca"
  | "kompetencje"
  | "firmy"
  | "jezyki"
  | "it"
  | "transport"
  | "technika"
  | "uroda"
  | "zdrowie"
  | "gastronomia"
  | "edukacja"
  | "spoleczne"
  | "ekologia"
  | "kultura"
  | "samorzad"
  | "rolnictwo"
  | "inne";

export interface Offer {
  id: string;
  title: string;
  url: string;
  sourceId: string;
  sourceName: string;
  type: OfferType;
  categories: CategoryId[];
  summary?: string;
  location?: string;
  publishedAt?: string;
  startDate?: string;
  endDate?: string;
  status?: OfferStatus;
  amount?: string;
  price?: string;
  details?: string[];
  free?: boolean;
  permanent?: boolean;
}

export interface SourceReport {
  id: string;
  name: string;
  url: string;
  count: number;
  ok: boolean;
}

export interface OffersResult {
  offers: Offer[];
  sources: SourceReport[];
  fetchedAt: string;
}
