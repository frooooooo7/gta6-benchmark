\# IMPLEMENTATION\_PLAN.md — ifro.pl (GTA 6 PC Requirements, FPS \& Upgrade Calculator)



\## 1. Cel i wymagania nadrzędne

Zbuduj ultra-szybką, wielojęzyczną aplikację webową na domenę \*\*ifro.pl\*\* (wdrażaną na VPS w Dockerze za Caddy i Cloudflare CDN):

kalkulator wymagań sprzętowych, estymator FPS, analizator wąskiego gardła (CPU/GPU bottleneck) oraz doradcę modernizacji PC

pod nadchodzącą wersję PC gry Grand Theft Auto VI.



Kryteria sukcesu:

\- Wydajność: Lighthouse Performance 98+, CLS = 0.000, INP < 80 ms, TTFB < 50 ms (SSG).

\- Monetyzacja reklamowa: Layout przystosowany pod dużą liczbę wysoko widocznych jednostek reklamowych (6–8 desktop, 3–4 mobile)

&#x20; z sztywną rezerwacją miejsca (zero skakania layoutu) i strefami buforowymi min. 24px.

\- Wielojęzyczność (`next-intl`, `localePrefix: 'as-needed'`): `en` jako główny pod `https://ifro.pl/`, oraz `/pl/`, `/de/`, `/fr/`, `/es/`.

\- Hybrydowa afiliacja: Amazon Associates (`.com`, `.co.uk`, `.de`, `.fr`, `.es` + OneLink) dla rynków zagranicznych oraz

&#x20; polskie sklepy komputerowe (x-kom, Morele.net, Media Expert + Amazon.pl) dla `/pl/`.

\- Pełne bezpieczeństwo prawne: zero zastrzeżonych znaków towarowych Take-Two/Rockstar w domenie (`ifro.pl`), brak chronionych grafik/wycieków,

&#x20; zgodność z Google Consent Mode v2 (RODO/CMP), FTC oraz wytycznymi UOKiK.



\## 2. Zasady Design Engineering (4 Skille UI/UX)

1\. \*\*Taste Skill (`Leonxlnx/taste-skill`):\*\*

&#x20;  - Używaj `font-variant-numeric: tabular-nums` dla wszystkich liczb (FPS, VRAM, %, ceny).

&#x20;  - Maksymalnie 2 poziomy zagnieżdżenia powierzchni (`#090A0F` tło -> `#11131D` karta robocza -> separatory `1px solid rgba(255,255,255,0.08)`).

&#x20;  - Wyraźna hierarchia: wynik FPS i diagnoza wąskiego gardła muszą dominować wzrokowo nad formularzem wyboru sprzętu.

2\. \*\*Impeccable (`pbakaus/impeccable`):\*\*

&#x20;  - Zero „AI slopu” (żadnych fioletowych gradientów w tle, żadnych zbędnych akapitów wstępnych wypychających kalkulator poza pierwszy ekran).

3\. \*\*Emil Kowalski UI/UX (`emilkowalski/skill`):\*\*

&#x20;  - Natychmiastowa reaktywność (0 ms): brak przycisku „Oblicz”. Zmiana dowolnego parametru natychmiast przelicza wyniki.

&#x20;  - Animacje wyłącznie na `transform` i `opacity` z krzywą `cubic-bezier(0.22, 1, 0.36, 1)` (180–220 ms) i `active:scale-\[0.98]`.

4\. \*\*UI/UX Pro Max (`nextlevelbuilder/ui-ux-pro-max-skill`):\*\*

&#x20;  - Paleta "Clean Leonida": Tło `#090A0F`, karty `#11131D`, tekst `#F4F6FB` / `#949AB1` (kontrast >= 4.5:1 WCAG AA).

&#x20;  - Akcenty danych: Ocean Teal `#00E5C3` (60+ FPS Ready), Leonida Amber `#FF9E44` (Bottleneck / 8GB VRAM warning), Sunset Coral `#FF4D8D` (CTA).

&#x20;  - Izolacja slotów reklamowych (min. 24px odstępu od przycisków i dropdownów) + dyskretna etykieta `ADVERTISEMENT` / `REKLAMA`.



\## 3. Wymagane moduły i struktura

\- `src/data/gpus.ts`: min. 65 kart graficznych (NVIDIA GTX 16xx, RTX 20xx/30xx/40xx/50xx; AMD RX 5xxx/6xxx/7xxx/9xxx; Intel Arc) z polami:

&#x20; `id`, `name`, `brand`, `vramGB`, `rasterScore` (1-100), `rtScore` (1-100), `upscaler` (`'DLSS4'|'DLSS3'|'FSR3'|'XeSS'`), `tier`.

\- `src/data/cpus.ts`: min. 55 procesorów (AMD Ryzen 3000/5000/7000/9000 w tym modele X3D; Intel Core 10/11/12/13/14 gen. i Core Ultra) z polami:

&#x20; `id`, `name`, `brand`, `cores`, `gamingScore` (1-100), `has3DVcache` (boolean), `tier`.

\- `src/lib/estimator.ts`: Czysta funkcja obliczeniowa oparta o bazę PS5/XSX (Ryzen 7 3700X + RX 6700 @ 30 FPS z RT) oraz analizę GTA V Enhanced

&#x20; (DirectStorage 1.2, RTGI/RTAO). Zwraca FPS dla Low, Medium, High, Ultra, procentowy CPU/GPU bottleneck, ostrzeżenia VRAM/NVMe oraz rekomendację upgrade'u.

\- `src/lib/affiliate.ts`: Router linków partnerskich (Amazon US/UK/DE/FR/ES dla EN/DE/FR/ES oraz x-kom, Morele, Media Expert, Amazon.pl dla PL).

\- `src/components/ads/`: Komponenty `AdSlot.tsx` (sztywne `min-height`, tryb podglądu `NEXT\_PUBLIC\_AD\_PREVIEW=true`) oraz `StickyAdRails.tsx`.

\- `src/app/\[locale]/specs/\[slug]/page.tsx`: Statyczne generowanie (`generateStaticParams`) dla top 100 par GPU+CPU w 5 językach (500 podstron SEO).

\- Podstrony prawne i E-E-A-T: `/methodology`, `/privacy-policy`, `/terms`, plik `public/ads.txt`, pełne zastrzeżenia prawne Rockstar/Take-Two oraz UOKiK/FTC.

