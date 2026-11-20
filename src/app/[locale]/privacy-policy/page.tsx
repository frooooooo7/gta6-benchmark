import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { routing, type Locale, Link } from '@/i18n/routing';
import { AdSlot } from '@/components/ads/AdSlot';
import { StickyAdRails } from '@/components/ads/StickyAdRails';
import { ChevronRight, Lock } from 'lucide-react';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isPl = locale === 'pl';

  const title = isPl ? 'Polityka prywatności' : 'Privacy policy';

  const description = isPl
    ? 'Kto prowadzi ifro.pl, jakie dane widzi hosting i że kalkulator działa w przeglądarce. Sklepowe przyciski to zwykłe wyszukiwanie.'
    : 'Who runs ifro.pl, what the host can see, and that the calculator runs in the browser. Shop buttons are ordinary searches.';

  const canonicalPath = locale === 'en' ? '/privacy-policy' : `/${locale}/privacy-policy`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://ifro.pl${canonicalPath}`,
      languages: {
        en: 'https://ifro.pl/privacy-policy',
        pl: 'https://ifro.pl/pl/privacy-policy',
        de: 'https://ifro.pl/de/privacy-policy',
        fr: 'https://ifro.pl/fr/privacy-policy',
        es: 'https://ifro.pl/es/privacy-policy',
        'x-default': 'https://ifro.pl/privacy-policy',
      },
    },
  };
}

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const isPl = locale === 'pl';

  return (
    <StickyAdRails>
      <article className="py-8 md:py-12 flex flex-col gap-8 max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-content-muted">
          <Link href="/" className="hover:text-accent-teal transition-colors">
            {isPl ? 'Strona główna' : 'Home'}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-content-secondary">
            {isPl ? 'Polityka prywatności' : 'Privacy Policy'}
          </span>
        </nav>

        <header className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-elevated border border-border-subtle text-xs font-mono text-content-secondary">
            <Lock className="w-3.5 h-3.5 text-accent-teal" />
            <span>{isPl ? 'Informacja o danych' : 'Data notice'}</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-content-primary tracking-tight">
            {isPl ? 'Polityka prywatności i plików cookies' : 'Privacy Policy & Cookies Notice'}
          </h1>

          <p className="text-xs font-mono text-content-muted">
            {isPl ? 'Ostatnia aktualizacja: 20 listopada 2026 r.' : 'Last Updated: November 20, 2026'}
          </p>
        </header>

        <AdSlot slotId="privacy-top" format="leaderboard" />

        <div className="surface-card p-6 border border-border-subtle space-y-6 text-sm text-content-secondary leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-2">
            <h2 className="font-display font-bold text-base text-content-primary">
              {isPl ? '1. Administrator danych osobowych' : '1. Data Controller'}
            </h2>
            <p>
              {isPl
                ? 'Kontakt w sprawach serwisu i danych osobowych:'
                : 'Contact for the site and for personal data:'}{' '}
              <a className="font-semibold text-content-primary underline" href="mailto:froispro6969@gmail.com">
                froispro6969@gmail.com
              </a>
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-2">
            <h2 className="font-display font-bold text-base text-content-primary">
              {isPl ? '2. Co się dzieje z danymi' : '2. What happens to data'}
            </h2>
            <p>
              {isPl
                ? 'Kalkulator liczy FPS w przeglądarce. Serwis nie zakłada kont, nie ma własnej bazy użytkowników i nie zapisuje wyborów sprzętu na serwerze. Wybrany sprzęt zostaje w adresie strony, jeśli skopiujesz link. Dostawca hostingu, przy publikacji Cloudflare, widzi adres IP i dane techniczne połączenia, bo bez tego strona się nie otworzy. Podstawa to art. 6 ust. 1 lit. f RODO: dostarczenie strony i bezpieczeństwo połączenia. Nie ustalamy własnego terminu przechowywania logów. Jeśli hosting je zapisuje, robi to według swoich zasad.'
                : 'The calculator runs in the browser. The site has no accounts, no user database, and it does not store hardware choices on a server. The chosen parts stay in the page address if you copy the link. The host, Cloudflare when the site is published, sees the IP address and technical connection data, because the page cannot open without that. The basis is Article 6(1)(f) GDPR: delivering the page and keeping the connection safe. We do not set our own log retention period. If the host stores logs, it does so under its own rules.'}
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-2">
            <h2 className="font-display font-bold text-base text-content-primary">
              {isPl ? '3. Cookies i reklamy' : '3. Cookies and ads'}
            </h2>
            <p>
              {isPl
                ? 'Kod serwisu nie ustawia własnych cookies analitycznych ani reklamowych. W stronie jest tylko domyślna odmowa dla ad_storage, ad_user_data, ad_personalization i analytics_storage. Nie ma banera, który tę odmowę zmienia na zgodę. Miejsca z napisem „Reklama” są puste. Google AdSense nie jest podłączony. Zanim reklamy AdSense zostaną włączone dla odwiedzających z EOG, na stronie musi pojawić się baner zgody, a ten punkt zostanie uzupełniony o cookies Google.'
                : 'The site code does not set its own analytics or advertising cookies. The page only defaults ad_storage, ad_user_data, ad_personalization and analytics_storage to denied. There is no banner that changes that refusal into consent. The spaces marked “Advertisement” are empty. Google AdSense is not connected. Before AdSense is turned on for visitors from the EEA, the site needs a consent banner, and this section must then list Google’s cookies.'}
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-2">
            <h2 className="font-display font-bold text-base text-content-primary">
              {isPl ? '4. Linki do sklepów' : '4. Shop links'}
            </h2>
            <p>
              {isPl
                ? 'Przyciski sklepów otwierają zwykłe wyszukiwanie nazwy części w x-kom, Morele.net, Media Expert albo Amazon. Adres nie zawiera kodu polecającego. ifro.pl nie dostaje prowizji od tych kliknięć i nie widzi, co zostało kupione. Od momentu przejścia obowiązuje polityka prywatności sklepu.'
                : 'Shop buttons open an ordinary search for the part name at x-kom, Morele.net, Media Expert, or Amazon. The address has no referral code. ifro.pl does not earn a commission on these clicks and does not see what was bought. From the click onward, the shop’s privacy policy applies.'}
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-2">
            <h2 className="font-display font-bold text-base text-content-primary">
              {isPl ? '5. Prawa użytkownika na gruncie RODO' : '5. Your Rights Under the GDPR'}
            </h2>
            <p>
              {isPl
                ? 'Możesz żądać dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przeniesienia oraz wnieść sprzeciw. Serwis nie trzyma własnej bazy odwiedzin, więc część tych praw dotyczy głównie logów u dostawcy hostingu. Skargę można złożyć do Prezesa Urzędu Ochrony Danych Osobowych, ul. Stawki 2, 00-193 Warszawa, uodo.gov.pl. Wniosek o dane wyślij na froispro6969@gmail.com.'
                : 'You can ask for access, rectification, erasure, restriction, portability, and you can object. The site does not keep its own visit database, so some of these rights mostly concern logs held by the host. A complaint can be filed with the Polish data protection authority, President of UODO, ul. Stawki 2, 00-193 Warszawa, uodo.gov.pl. Send a data request to froispro6969@gmail.com.'}
            </p>
          </section>
        </div>

        <AdSlot slotId="privacy-bottom" format="billboard" />
      </article>
    </StickyAdRails>
  );
}
