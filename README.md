# Dofinansowania i darmowe kursy na Podkarpaciu

Aplikacja Next.js, która zbiera w jednym miejscu dofinansowania, dotacje, kursy z dofinansowaniem i bezpłatne szkolenia w województwie podkarpackim i dzieli je na kategorie.

## Źródła danych

Dane są pobierane automatycznie z oficjalnych serwisów i odświeżane co godzinę:

- Fundusze Europejskie dla Podkarpacia - nabory wniosków oraz szkolenia i spotkania informacyjne
- Wojewódzki Urząd Pracy w Rzeszowie i 21 powiatowych urzędów pracy - aktualności o dotacjach, KFS, stażach i szkoleniach
- Baza Usług Rozwojowych (PARP) - usługi z możliwością dofinansowania w woj. podkarpackim
- Stałe programy: PUP, KFS, Akademia PARP, WFOŚiGW w Rzeszowie

## Uruchomienie lokalne (Windows, PowerShell)

Wymagany Node.js 20 lub nowszy.

```powershell
git clone https://github.com/vWiewiorax/dofinansowania-podkarpacie.git
cd dofinansowania-podkarpacie
npm install
npm run dev
```

Potem otwórz http://localhost:3000

## Wdrożenie

Projekt działa na Vercel bez dodatkowej konfiguracji i zmiennych środowiskowych.
