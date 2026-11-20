import { type Locale } from '@/i18n/routing';

export interface AffiliateLink {
  id: string;
  name: string;
  store: 'amazon' | 'x-kom' | 'morele' | 'media-expert';
  url: string;
  badge?: string;
  colorClass: string;
}

export interface AffiliateConfig {
  locale: Locale;
  componentName: string;
  query: string;
}

const AMAZON_DOMAINS: Record<string, string> = {
  en: 'https://www.amazon.com',
  de: 'https://www.amazon.de',
  fr: 'https://www.amazon.fr',
  es: 'https://www.amazon.es',
  pl: 'https://www.amazon.pl',
};

/** Plain shop search. No referral code and no commission. */
export function getAffiliateLinks(config: AffiliateConfig): AffiliateLink[] {
  const { locale, query } = config;
  const encodedQuery = encodeURIComponent(query);

  if (locale === 'pl') {
    return [
      {
        id: 'xkom',
        name: 'x-kom',
        store: 'x-kom',
        url: `https://www.x-kom.pl/szukaj?q=${encodedQuery}`,
        colorClass: 'hover:border-[#0082FF] hover:text-[#0082FF]',
      },
      {
        id: 'morele',
        name: 'Morele.net',
        store: 'morele',
        url: `https://www.morele.net/wyszukiwarka/?q=${encodedQuery}`,
        colorClass: 'hover:border-[#FF5A00] hover:text-[#FF5A00]',
      },
      {
        id: 'mediaexpert',
        name: 'Media Expert',
        store: 'media-expert',
        url: `https://www.mediaexpert.pl/szukaj?spark=${encodedQuery}`,
        colorClass: 'hover:border-[#FFD200] hover:text-[#FFD200]',
      },
      {
        id: 'amazon-pl',
        name: 'Amazon.pl',
        store: 'amazon',
        url: `https://www.amazon.pl/s?k=${encodedQuery}`,
        colorClass: 'hover:border-[#FF9900] hover:text-[#FF9900]',
      },
    ];
  }

  const domain = AMAZON_DOMAINS[locale] || AMAZON_DOMAINS.en;
  const name = locale === 'de' ? 'Amazon.de' : locale === 'fr' ? 'Amazon.fr' : locale === 'es' ? 'Amazon.es' : 'Amazon.com';

  return [
    {
      id: `amazon-${locale}`,
      name,
      store: 'amazon',
      url: `${domain}/s?k=${encodedQuery}`,
      colorClass: 'hover:border-[#FF9900] hover:text-[#FF9900]',
    },
  ];
}

/** Note under shop buttons. These are ordinary searches, not affiliate links. */
export function getAffiliateDisclosure(locale: Locale): string {
  if (locale === 'pl') {
    return 'Przycisk otwiera wyszukiwanie tej nazwy w sklepie. ifro.pl nie dodaje kodu polecającego i nie dostaje prowizji od kliknięcia. Cena i dostępność są na stronie sklepu.';
  }
  if (locale === 'de') {
    return 'Der Button öffnet die Suche nach diesem Namen im Shop. ifro.pl hängt keinen Partnercode an und erhält keine Provision. Preis und Verfügbarkeit stehen beim Händler.';
  }
  if (locale === 'fr') {
    return 'Le bouton ouvre la recherche de ce nom dans la boutique. ifro.pl n’ajoute pas de code de parrainage et ne touche pas de commission. Le prix et le stock sont chez le marchand.';
  }
  if (locale === 'es') {
    return 'El botón abre la búsqueda de ese nombre en la tienda. ifro.pl no añade un código de referido ni cobra comisión. El precio y la disponibilidad están en la tienda.';
  }
  return 'The button opens a search for this name at the shop. ifro.pl does not add a referral code and does not earn a commission on the click. Price and stock are on the shop’s site.';
}
