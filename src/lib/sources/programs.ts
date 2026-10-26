import type { Offer } from "../types";

export const PROGRAMS_SOURCE = {
  id: "programy",
  name: "Stałe programy wsparcia",
  url: "https://wuprzeszow.praca.gov.pl/rynek-pracy/programy-aktywizacyjne-i-projekty",
};

const base = {
  sourceId: PROGRAMS_SOURCE.id,
  permanent: true,
  location: "województwo podkarpackie",
} as const;

export const PROGRAMS: Offer[] = [
  {
    ...base,
    id: "program-pup-formy-wsparcia",
    title: "Wsparcie z powiatowego urzędu pracy: dotacja na własną firmę, staże, szkolenia",
    url: "https://wuprzeszow.praca.gov.pl/dla-bezrobotnych-i-poszukujacych-pracy/formy-wsparcia",
    sourceName: "Wojewódzki Urząd Pracy w Rzeszowie",
    type: "dofinansowanie",
    categories: ["dzialalnosc", "praca", "kompetencje"],
    summary:
      "Osoby zarejestrowane w urzędzie pracy mogą korzystać m.in. ze środków na podjęcie działalności gospodarczej, staży i szkoleń. Terminy naborów ogłasza właściwy powiatowy urząd pracy.",
  },
  {
    ...base,
    id: "program-kfs",
    title: "Krajowy Fundusz Szkoleniowy (KFS): aktualne nabory w województwie podkarpackim",
    url: "https://wuprzeszow.praca.gov.pl/aktualne-nabory-kfs-w-wojewodztwie-podkarpackim1",
    sourceName: "Wojewódzki Urząd Pracy w Rzeszowie",
    type: "dofinansowanie",
    categories: ["kompetencje", "firmy", "praca"],
    summary:
      "Środki na kształcenie ustawiczne pracowników i pracodawców. Wniosek składa pracodawca w powiatowym urzędzie pracy w czasie ogłoszonego naboru.",
  },
  {
    ...base,
    id: "program-szkolenia-pup",
    title: "Szkolenia i bony szkoleniowe z urzędu pracy",
    url: "https://wuprzeszow.praca.gov.pl/dla-pracodawcow-i-przedsiebiorcow/podnoszenie-kompetencji-i-kwalifikacji-pracownikow-i-kandydatow-do-pracy/szkolenia/-/asset_publisher/kfQIA8OcInMo/content/55479-szkolenia-i-bony-szkoleniowe/10240",
    sourceName: "Wojewódzki Urząd Pracy w Rzeszowie",
    type: "kurs",
    categories: ["kompetencje", "praca"],
    summary: "Zasady kierowania na szkolenia finansowane przez urząd pracy oraz informacje o bonach szkoleniowych.",
  },
  {
    ...base,
    id: "program-staze",
    title: "Staże i bony stażowe",
    url: "https://wuprzeszow.praca.gov.pl/dla-pracodawcow-i-przedsiebiorcow/podnoszenie-kompetencji-i-kwalifikacji-pracownikow-i-kandydatow-do-pracy/staze/-/asset_publisher/kfQIA8OcInMo/content/14523-staze-i-bony-stazowe/10240",
    sourceName: "Wojewódzki Urząd Pracy w Rzeszowie",
    type: "dofinansowanie",
    categories: ["praca"],
    summary: "Staż pozwala zdobyć doświadczenie u pracodawcy bez nawiązywania stosunku pracy. Szczegóły i nabory w powiatowych urzędach pracy.",
  },
  {
    ...base,
    id: "program-wup-projekty",
    title: "Programy aktywizacyjne i projekty WUP Rzeszów",
    url: "https://wuprzeszow.praca.gov.pl/rynek-pracy/programy-aktywizacyjne-i-projekty",
    sourceName: "Wojewódzki Urząd Pracy w Rzeszowie",
    type: "dofinansowanie",
    categories: ["praca", "kompetencje", "spoleczne"],
    summary: "Lista programów i projektów realizowanych przez Wojewódzki Urząd Pracy w Rzeszowie.",
  },
  {
    ...base,
    id: "program-bur",
    title: "Baza Usług Rozwojowych: kursy z dofinansowaniem na Podkarpaciu",
    url: "https://uslugirozwojowe.parp.gov.pl/wyszukiwarka/uslugi/szukaj?miejsceSzkolenia=podkarpackie&wojewodztwoId=9",
    sourceName: "Polska Agencja Rozwoju Przedsiębiorczości",
    type: "kurs",
    categories: ["kompetencje", "firmy"],
    summary:
      "Wyszukiwarka szkoleń, kursów i doradztwa. Usługi oznaczone jako „Możliwość dofinansowania” można opłacić ze środków publicznych w ramach projektów regionalnych.",
  },
  {
    ...base,
    id: "program-akademia-parp",
    title: "Akademia PARP: bezpłatne kursy online dla firm i pracowników",
    url: "https://akademia.parp.gov.pl/",
    sourceName: "Polska Agencja Rozwoju Przedsiębiorczości",
    type: "kurs",
    categories: ["kompetencje", "firmy", "it"],
    location: "online",
    summary: "Kursy e-learningowe z zakresu prowadzenia firmy, zarządzania i umiejętności cyfrowych.",
    free: true,
  },
  {
    ...base,
    id: "program-wfosigw",
    title: "Czyste Powietrze i programy ekologiczne WFOŚiGW w Rzeszowie",
    url: "https://www.wfosigw.rzeszow.pl/",
    sourceName: "WFOŚiGW w Rzeszowie",
    type: "dofinansowanie",
    categories: ["ekologia"],
    summary:
      "Dofinansowanie wymiany źródeł ciepła i termomodernizacji domów oraz inne programy środowiskowe dla mieszkańców, firm i gmin z Podkarpacia.",
  },
  {
    ...base,
    id: "program-fep",
    title: "Fundusze Europejskie dla Podkarpacia 2021-2027: harmonogram i nabory",
    url: "https://funduszeue.podkarpackie.pl/nabory",
    sourceName: "Fundusze Europejskie dla Podkarpacia",
    type: "dofinansowanie",
    categories: ["firmy", "samorzad", "edukacja", "spoleczne", "ekologia"],
    summary: "Wszystkie nabory wniosków z programu regionalnego, także planowane i zakończone.",
  },
];
