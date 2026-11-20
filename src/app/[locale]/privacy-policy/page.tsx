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

type Copy = {
  title: string;
  description: string;
  home: string;
  nav: string;
  badge: string;
  h1: string;
  updated: string;
  s1Title: string;
  s1Body: string;
  s2Title: string;
  s2P1: string;
  s2P2: string;
  s3Title: string;
  s3P1: string;
  s3P2: string;
  s3P3: string;
  s4Title: string;
  s4Body: string;
  s5Title: string;
  s5Body: string;
  partnerSitesLabel: string;
};

const CONTACT = 'contact@ifro.pl';
const PARTNER_SITES = 'https://policies.google.com/technologies/partner-sites';

const COPY: Record<Locale, Copy> = {
  en: {
    title: 'Privacy policy',
    description:
      'Contact for ifro.pl, how Cloudflare processes connection data, Google Consent Mode v2, AdSense, and shop search links.',
    home: 'Home',
    nav: 'Privacy Policy',
    badge: 'Data notice',
    h1: 'Privacy Policy & Cookies Notice',
    updated: 'Last updated: November 21, 2026',
    s1Title: '1. Contact & Data Controller',
    s1Body:
      'For all inquiries regarding the operation of ifro.pl and personal data protection, you can contact the site administrator at:',
    s2Title: '2. What Happens to Your Data',
    s2P1:
      'The hardware calculator runs entirely client-side in your web browser. The website has no user accounts, maintains no user database, and does not transmit or store your selected PC specifications on an application server. Your chosen components remain encoded in the page URL only if you copy or share the link, and any saved interface preferences stay strictly within your browser’s local storage.',
    s2P2:
      'When you visit ifro.pl, our hosting and content delivery provider, Cloudflare, Inc., processes technical connection data (such as your IP address, browser type, and request headers) because the webpage cannot be delivered over the internet without this information. This processing is based on legitimate interest under Article 6(1)(f) of the GDPR (ensuring reliable delivery, performance, and security of the website). We do not maintain our own server access logs; any security or traffic logs retained by Cloudflare are governed by Cloudflare’s own privacy policy and retention schedules.',
    s3Title: '3. Cookies, Google Consent Mode v2, and Google AdSense',
    s3P1:
      'The website does not set its own first-party analytics or tracking cookies. We implement Google Consent Mode v2, which sets ad_storage, ad_user_data, ad_personalization, and analytics_storage to “denied” by default for all visitors.',
    s3P2:
      'The site integrates Google AdSense (provided by Google Ireland Limited) to display advertisements once approved. While storage consent remains denied, Google does not place advertising cookies on your device. Before personalized advertisements or advertising cookies are activated for visitors from the European Economic Area (EEA) or the United Kingdom, a GDPR-compliant Consent Management Platform (CMP) banner will be enabled to collect explicit user consent, and this policy will be updated with a detailed list of cookies.',
    s3P3: 'You can learn more about how Google processes data on partner sites at:',
    s4Title: '4. External Shop Links',
    s4Body:
      'Buttons linking to hardware retailers (such as x-kom, Morele.net, Media Expert, or Amazon) currently open standard search results for the respective component name. These links do not contain affiliate or referral tracking parameters, ifro.pl earns no commission from clicks or purchases, and we receive no information about your activity on external stores. Once you click an external link, the privacy policy and terms of the destination store apply.',
    s5Title: '5. Your Rights Under the GDPR',
    s5Body:
      'Under the General Data Protection Regulation (GDPR), you have the right to request access to your personal data, rectification, erasure, restriction of processing, data portability, and the right to object to processing. Because ifro.pl does not operate a user database, these rights primarily relate to technical connection data processed by our infrastructure provider. You also have the right to lodge a complaint with a supervisory authority, in particular the President of the Personal Data Protection Office in Poland (Prezes Urzędu Ochrony Danych Osobowych – UODO, ul. Stawki 2, 00-193 Warszawa, uodo.gov.pl). To exercise your rights or ask questions, contact',
    partnerSitesLabel: 'Google partner sites',
  },
  pl: {
    title: 'Polityka prywatności',
    description:
      'Kontakt do ifro.pl, dane połączenia u Cloudflare, Google Consent Mode v2, AdSense oraz zwykłe linki wyszukiwania w sklepach.',
    home: 'Strona główna',
    nav: 'Polityka prywatności',
    badge: 'Informacja o danych',
    h1: 'Polityka prywatności i plików cookies',
    updated: 'Ostatnia aktualizacja: 21 listopada 2026 r.',
    s1Title: '1. Kontakt i administrator danych',
    s1Body:
      'We wszystkich sprawach dotyczących działania ifro.pl oraz ochrony danych osobowych możesz skontaktować się z administratorem serwisu pod adresem:',
    s2Title: '2. Co dzieje się z Twoimi danymi',
    s2P1:
      'Kalkulator sprzętu działa w całości po stronie klienta, w przeglądarce. Serwis nie prowadzi kont użytkowników, nie utrzymuje bazy użytkowników i nie przesyła ani nie zapisuje wybranych podzespołów na serwerze aplikacji. Wybrane komponenty pozostają zakodowane w adresie URL tylko wtedy, gdy skopiujesz lub udostępnisz link, a ewentualne zapisane ustawienia interfejsu zostają wyłącznie w pamięci lokalnej przeglądarki.',
    s2P2:
      'Gdy odwiedzasz ifro.pl, nasz dostawca hostingu i dostarczania treści, Cloudflare, Inc., przetwarza techniczne dane połączenia (takie jak adres IP, typ przeglądarki i nagłówki żądania), ponieważ bez tych informacji strony nie da się dostarczyć przez internet. Podstawą przetwarzania jest prawnie uzasadniony interes z art. 6 ust. 1 lit. f RODO (niezawodne dostarczenie, wydajność i bezpieczeństwo serwisu). Nie prowadzimy własnych logów dostępu do serwera; wszelkie logi bezpieczeństwa lub ruchu przechowywane przez Cloudflare podlegają polityce prywatności Cloudflare i jego terminom przechowywania.',
    s3Title: '3. Cookies, Google Consent Mode v2 i Google AdSense',
    s3P1:
      'Serwis nie ustawia własnych cookies analitycznych ani śledzących. Wdrażamy Google Consent Mode v2, który domyślnie ustawia ad_storage, ad_user_data, ad_personalization i analytics_storage na „denied” dla wszystkich odwiedzających.',
    s3P2:
      'Serwis integruje Google AdSense (świadczony przez Google Ireland Limited), aby wyświetlać reklamy po zatwierdzeniu. Dopóki zgoda na przechowywanie pozostaje odmówiona, Google nie umieszcza na urządzeniu cookies reklamowych. Zanim spersonalizowane reklamy lub cookies reklamowe zostaną włączone dla odwiedzających z Europejskiego Obszaru Gospodarczego (EOG) lub Zjednoczonego Królestwa, zostanie uruchomiony baner platformy zarządzania zgodami (CMP) zgodny z RODO, a ta polityka zostanie uzupełniona o szczegółową listę cookies.',
    s3P3: 'Więcej o tym, jak Google przetwarza dane na stronach partnerów, znajdziesz tutaj:',
    s4Title: '4. Zewnętrzne linki do sklepów',
    s4Body:
      'Przyciski prowadzące do sklepów sprzętowych (takich jak x-kom, Morele.net, Media Expert lub Amazon) otwierają obecnie standardowe wyniki wyszukiwania nazwy danego podzespołu. Linki nie zawierają parametrów afiliacyjnych ani śledzących, ifro.pl nie zarabia prowizji od kliknięć ani zakupów i nie otrzymujemy informacji o Twojej aktywności w zewnętrznych sklepach. Po kliknięciu zewnętrznego linku obowiązują polityka prywatności i regulamin sklepu docelowego.',
    s5Title: '5. Twoje prawa wynikające z RODO',
    s5Body:
      'Na podstawie ogólnego rozporządzenia o ochronie danych (RODO) masz prawo żądać dostępu do swoich danych osobowych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia danych oraz prawo do sprzeciwu wobec przetwarzania. Ponieważ ifro.pl nie prowadzi bazy użytkowników, prawa te dotyczą głównie technicznych danych połączenia przetwarzanych przez naszego dostawcę infrastruktury. Masz też prawo wnieść skargę do organu nadzorczego, w szczególności do Prezesa Urzędu Ochrony Danych Osobowych (UODO, ul. Stawki 2, 00-193 Warszawa, uodo.gov.pl). Aby skorzystać z praw lub zadać pytanie, napisz na',
    partnerSitesLabel: 'Strony partnerskie Google',
  },
  de: {
    title: 'Datenschutzerklärung',
    description:
      'Kontakt zu ifro.pl, Verbindungsdaten bei Cloudflare, Google Consent Mode v2, AdSense und gewöhnliche Shop-Suchlinks.',
    home: 'Startseite',
    nav: 'Datenschutzerklärung',
    badge: 'Hinweis zu Daten',
    h1: 'Datenschutzerklärung & Cookies',
    updated: 'Zuletzt aktualisiert: 21. November 2026',
    s1Title: '1. Kontakt & Verantwortlicher',
    s1Body:
      'Für alle Anfragen zum Betrieb von ifro.pl und zum Schutz personenbezogener Daten können Sie den Seitenbetreiber kontaktieren unter:',
    s2Title: '2. Was mit Ihren Daten geschieht',
    s2P1:
      'Der Hardware-Rechner läuft vollständig clientseitig in Ihrem Browser. Die Website hat keine Benutzerkonten, führt keine Benutzerdatenbank und überträgt oder speichert Ihre ausgewählten PC-Komponenten nicht auf einem Anwendungsserver. Die gewählten Komponenten bleiben nur dann in der Seiten-URL kodiert, wenn Sie den Link kopieren oder teilen; gespeicherte Schnittstelleneinstellungen bleiben ausschließlich im lokalen Speicher Ihres Browsers.',
    s2P2:
      'Wenn Sie ifro.pl besuchen, verarbeitet unser Hosting- und CDN-Anbieter Cloudflare, Inc. technische Verbindungsdaten (wie IP-Adresse, Browsertyp und Anfrage-Header), weil die Seite ohne diese Informationen nicht über das Internet ausgeliefert werden kann. Rechtsgrundlage ist das berechtigte Interesse gemäß Art. 6 Abs. 1 lit. f DSGVO (zuverlässige Auslieferung, Leistung und Sicherheit der Website). Wir führen keine eigenen Server-Zugriffslogs; Sicherheits- oder Traffic-Logs bei Cloudflare unterliegen der Datenschutzrichtlinie und den Aufbewahrungsfristen von Cloudflare.',
    s3Title: '3. Cookies, Google Consent Mode v2 und Google AdSense',
    s3P1:
      'Die Website setzt keine eigenen First-Party-Analyse- oder Tracking-Cookies. Wir implementieren Google Consent Mode v2, der ad_storage, ad_user_data, ad_personalization und analytics_storage standardmäßig für alle Besucher auf „denied“ setzt.',
    s3P2:
      'Die Seite integriert Google AdSense (bereitgestellt von Google Ireland Limited), um nach Freigabe Werbung anzuzeigen. Solange die Speichereinwilligung verweigert bleibt, setzt Google keine Werbe-Cookies auf Ihrem Gerät. Bevor personalisierte Werbung oder Werbe-Cookies für Besucher aus dem Europäischen Wirtschaftsraum (EWR) oder dem Vereinigten Königreich aktiviert werden, wird ein DSGVO-konformes Consent-Management-Platform-(CMP)-Banner zur Einholung ausdrücklicher Einwilligung eingeschaltet, und diese Richtlinie wird um eine detaillierte Cookie-Liste ergänzt.',
    s3P3: 'Mehr dazu, wie Google Daten auf Partnerseiten verarbeitet, finden Sie hier:',
    s4Title: '4. Externe Shop-Links',
    s4Body:
      'Schaltflächen zu Hardware-Händlern (wie x-kom, Morele.net, Media Expert oder Amazon) öffnen derzeit normale Suchergebnisse für den jeweiligen Komponentenamen. Diese Links enthalten keine Affiliate- oder Referral-Parameter, ifro.pl verdient keine Provision aus Klicks oder Käufen, und wir erhalten keine Informationen über Ihre Aktivität in externen Shops. Nach dem Klick auf einen externen Link gelten die Datenschutzrichtlinie und die Bedingungen des Zielshops.',
    s5Title: '5. Ihre Rechte nach der DSGVO',
    s5Body:
      'Nach der Datenschutz-Grundverordnung (DSGVO) haben Sie das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch. Da ifro.pl keine Benutzerdatenbank betreibt, beziehen sich diese Rechte vor allem auf technische Verbindungsdaten unseres Infrastrukturanbieters. Sie haben außerdem das Recht, Beschwerde bei einer Aufsichtsbehörde einzulegen, insbesondere beim Präsidenten des Amtes für den Schutz personenbezogener Daten in Polen (Prezes Urzędu Ochrony Danych Osobowych – UODO, ul. Stawki 2, 00-193 Warszawa, uodo.gov.pl). Zur Ausübung Ihrer Rechte oder bei Fragen schreiben Sie an',
    partnerSitesLabel: 'Google-Partnerseiten',
  },
  fr: {
    title: 'Politique de confidentialité',
    description:
      'Contact ifro.pl, données de connexion chez Cloudflare, Google Consent Mode v2, AdSense et liens de recherche vers les boutiques.',
    home: 'Accueil',
    nav: 'Politique de confidentialité',
    badge: 'Avis sur les données',
    h1: 'Politique de confidentialité et cookies',
    updated: 'Dernière mise à jour : 21 novembre 2026',
    s1Title: '1. Contact et responsable du traitement',
    s1Body:
      'Pour toute question relative au fonctionnement d’ifro.pl et à la protection des données personnelles, vous pouvez contacter l’administrateur du site à :',
    s2Title: '2. Que deviennent vos données',
    s2P1:
      'Le calculateur matériel s’exécute entièrement côté client dans votre navigateur. Le site n’a pas de comptes utilisateurs, ne tient pas de base utilisateurs et ne transmet ni ne stocke vos configurations PC sur un serveur d’application. Les composants choisis restent encodés dans l’URL uniquement si vous copiez ou partagez le lien ; les préférences d’interface éventuelles restent strictement dans le stockage local de votre navigateur.',
    s2P2:
      'Lorsque vous visitez ifro.pl, notre hébergeur et fournisseur de diffusion de contenu, Cloudflare, Inc., traite des données techniques de connexion (adresse IP, type de navigateur, en-têtes de requête), car la page ne peut pas être livrée sur Internet sans ces informations. Ce traitement repose sur l’intérêt légitime au sens de l’article 6(1)(f) du RGPD (fiabilité, performance et sécurité du site). Nous ne tenons pas nos propres journaux d’accès serveur ; les journaux de sécurité ou de trafic conservés par Cloudflare sont régis par la politique de confidentialité et les délais de conservation de Cloudflare.',
    s3Title: '3. Cookies, Google Consent Mode v2 et Google AdSense',
    s3P1:
      'Le site n’installe pas ses propres cookies d’analyse ou de suivi first-party. Nous mettons en œuvre Google Consent Mode v2, qui définit par défaut ad_storage, ad_user_data, ad_personalization et analytics_storage sur « denied » pour tous les visiteurs.',
    s3P2:
      'Le site intègre Google AdSense (fourni par Google Ireland Limited) afin d’afficher des publicités une fois approuvées. Tant que le consentement au stockage reste refusé, Google ne place pas de cookies publicitaires sur votre appareil. Avant l’activation de publicités personnalisées ou de cookies publicitaires pour les visiteurs de l’Espace économique européen (EEE) ou du Royaume-Uni, une bannière de plateforme de gestion du consentement (CMP) conforme au RGPD sera activée pour recueillir un consentement explicite, et cette politique sera mise à jour avec une liste détaillée des cookies.',
    s3P3: 'Pour en savoir plus sur le traitement des données par Google sur les sites partenaires :',
    s4Title: '4. Liens externes vers les boutiques',
    s4Body:
      'Les boutons vers les revendeurs de matériel (tels que x-kom, Morele.net, Media Expert ou Amazon) ouvrent actuellement des résultats de recherche standard pour le nom du composant. Ces liens ne contiennent pas de paramètres d’affiliation ou de suivi, ifro.pl ne perçoit aucune commission sur les clics ou achats, et nous ne recevons aucune information sur votre activité dans les boutiques externes. Dès que vous cliquez sur un lien externe, la politique de confidentialité et les conditions de la boutique s’appliquent.',
    s5Title: '5. Vos droits au titre du RGPD',
    s5Body:
      'En vertu du règlement général sur la protection des données (RGPD), vous avez le droit de demander l’accès à vos données personnelles, leur rectification, leur effacement, la limitation du traitement, la portabilité, ainsi que le droit d’opposition. Comme ifro.pl n’exploite pas de base utilisateurs, ces droits concernent principalement les données techniques de connexion traitées par notre fournisseur d’infrastructure. Vous avez aussi le droit d’introduire une réclamation auprès d’une autorité de contrôle, notamment le Président de l’Office de protection des données personnelles en Pologne (Prezes Urzędu Ochrony Danych Osobowych – UODO, ul. Stawki 2, 00-193 Warszawa, uodo.gov.pl). Pour exercer vos droits ou poser une question, contactez',
    partnerSitesLabel: 'Sites partenaires Google',
  },
  es: {
    title: 'Política de privacidad',
    description:
      'Contacto de ifro.pl, datos de conexión en Cloudflare, Google Consent Mode v2, AdSense y enlaces de búsqueda a tiendas.',
    home: 'Inicio',
    nav: 'Política de privacidad',
    badge: 'Aviso de datos',
    h1: 'Política de privacidad y cookies',
    updated: 'Última actualización: 21 de noviembre de 2026',
    s1Title: '1. Contacto y responsable del tratamiento',
    s1Body:
      'Para cualquier consulta sobre el funcionamiento de ifro.pl y la protección de datos personales, puede contactar con el administrador del sitio en:',
    s2Title: '2. Qué ocurre con sus datos',
    s2P1:
      'La calculadora de hardware se ejecuta por completo en el lado del cliente, en su navegador. El sitio no tiene cuentas de usuario, no mantiene una base de usuarios y no transmite ni almacena sus componentes de PC seleccionados en un servidor de aplicación. Los componentes elegidos solo permanecen codificados en la URL si copia o comparte el enlace, y cualquier preferencia de interfaz guardada permanece únicamente en el almacenamiento local del navegador.',
    s2P2:
      'Cuando visita ifro.pl, nuestro proveedor de alojamiento y distribución de contenido, Cloudflare, Inc., trata datos técnicos de conexión (como la dirección IP, el tipo de navegador y las cabeceras de la solicitud), porque la página no puede entregarse por Internet sin esa información. Este tratamiento se basa en el interés legítimo del artículo 6(1)(f) del RGPD (entrega fiable, rendimiento y seguridad del sitio). No mantenemos nuestros propios registros de acceso al servidor; los registros de seguridad o de tráfico que conserve Cloudflare se rigen por su política de privacidad y sus plazos de conservación.',
    s3Title: '3. Cookies, Google Consent Mode v2 y Google AdSense',
    s3P1:
      'El sitio no establece cookies propias de análisis o seguimiento. Implementamos Google Consent Mode v2, que establece por defecto ad_storage, ad_user_data, ad_personalization y analytics_storage en «denied» para todos los visitantes.',
    s3P2:
      'El sitio integra Google AdSense (proporcionado por Google Ireland Limited) para mostrar anuncios una vez aprobados. Mientras el consentimiento de almacenamiento siga denegado, Google no coloca cookies publicitarias en su dispositivo. Antes de activar anuncios personalizados o cookies publicitarias para visitantes del Espacio Económico Europeo (EEE) o del Reino Unido, se habilitará un banner de plataforma de gestión del consentimiento (CMP) conforme al RGPD para recabar el consentimiento explícito, y esta política se actualizará con una lista detallada de cookies.',
    s3P3: 'Puede obtener más información sobre cómo Google trata los datos en sitios de socios en:',
    s4Title: '4. Enlaces externos a tiendas',
    s4Body:
      'Los botones hacia tiendas de hardware (como x-kom, Morele.net, Media Expert o Amazon) abren actualmente resultados de búsqueda estándar del nombre del componente. Estos enlaces no contienen parámetros de afiliación ni de seguimiento, ifro.pl no obtiene comisión por clics o compras y no recibimos información sobre su actividad en tiendas externas. Al hacer clic en un enlace externo, se aplican la política de privacidad y las condiciones de la tienda de destino.',
    s5Title: '5. Sus derechos según el RGPD',
    s5Body:
      'Conforme al Reglamento General de Protección de Datos (RGPD), tiene derecho a solicitar el acceso a sus datos personales, su rectificación, su supresión, la limitación del tratamiento, la portabilidad y el derecho de oposición. Como ifro.pl no opera una base de usuarios, estos derechos se refieren principalmente a los datos técnicos de conexión tratados por nuestro proveedor de infraestructura. También tiene derecho a presentar una reclamación ante una autoridad de control, en particular el Presidente de la Oficina de Protección de Datos Personales de Polonia (Prezes Urzędu Ochrony Danych Osobowych – UODO, ul. Stawki 2, 00-193 Warszawa, uodo.gov.pl). Para ejercer sus derechos o formular preguntas, contacte con',
    partnerSitesLabel: 'Sitios de socios de Google',
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const copy = COPY[(locale as Locale) in COPY ? (locale as Locale) : 'en'];
  const canonicalPath = locale === 'en' ? '/privacy-policy' : `/${locale}/privacy-policy`;

  return {
    title: copy.title,
    description: copy.description,
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
  const copy = COPY[locale as Locale];

  return (
    <StickyAdRails>
      <article className="py-8 md:py-12 flex flex-col gap-8 max-w-4xl mx-auto">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-content-muted">
          <Link href="/" className="hover:text-accent-teal transition-colors">
            {copy.home}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-content-secondary">{copy.nav}</span>
        </nav>

        <header className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-elevated border border-border-subtle text-xs font-mono text-content-secondary">
            <Lock className="w-3.5 h-3.5 text-accent-teal" />
            <span>{copy.badge}</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-content-primary tracking-tight">
            {copy.h1}
          </h1>

          <p className="text-xs font-mono text-content-muted">{copy.updated}</p>
        </header>

        <AdSlot slotId="privacy-top" format="leaderboard" />

        <div className="surface-card p-6 border border-border-subtle space-y-6 text-sm text-content-secondary leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-display font-bold text-base text-content-primary">{copy.s1Title}</h2>
            <p>
              {copy.s1Body}{' '}
              <a className="font-semibold text-content-primary underline" href={`mailto:${CONTACT}`}>
                {CONTACT}
              </a>
              .
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display font-bold text-base text-content-primary">{copy.s2Title}</h2>
            <p>{copy.s2P1}</p>
            <p>{copy.s2P2}</p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display font-bold text-base text-content-primary">{copy.s3Title}</h2>
            <p>{copy.s3P1}</p>
            <p>{copy.s3P2}</p>
            <p>
              {copy.s3P3}{' '}
              <a
                className="font-semibold text-content-primary underline"
                href={PARTNER_SITES}
                target="_blank"
                rel="noopener noreferrer"
              >
                {PARTNER_SITES}
              </a>
              .
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display font-bold text-base text-content-primary">{copy.s4Title}</h2>
            <p>{copy.s4Body}</p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display font-bold text-base text-content-primary">{copy.s5Title}</h2>
            <p>
              {copy.s5Body}{' '}
              <a className="font-semibold text-content-primary underline" href={`mailto:${CONTACT}`}>
                {CONTACT}
              </a>
              .
            </p>
          </section>
        </div>

        <AdSlot slotId="privacy-bottom" format="billboard" />
      </article>
    </StickyAdRails>
  );
}
