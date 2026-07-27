import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteSlugs } from "@/data/sites";
import { getSiteBySlug, isValidSiteSlug } from "@/lib/site";
import { getPublicPath, getSitePath } from "@/lib/paths";
import { siteUsesPrivacyPolicy } from "@/lib/privacy-policy";

const CONTACT_EMAIL = "side.sleepers.admin@gmail.com";
const PAGE_TITLE = "Privacy Policy | Side Sleeper Guide";
const PAGE_DESCRIPTION =
  "Learn how Side Sleeper Guide collects, uses, and protects information, including our use of cookies, advertising services, and affiliate links.";

type PrivacyPolicyPageProps = {
  params: Promise<{ siteSlug: string }>;
};

export function generateStaticParams() {
  return siteSlugs
    .filter((siteSlug) => siteUsesPrivacyPolicy(siteSlug))
    .map((siteSlug) => ({ siteSlug }));
}

export async function generateMetadata({
  params,
}: PrivacyPolicyPageProps): Promise<Metadata> {
  const { siteSlug } = await params;

  if (!siteUsesPrivacyPolicy(siteSlug)) {
    return { title: "Privacy Policy" };
  }

  const path = getPublicPath(siteSlug, "/privacy-policy");

  return {
    title: {
      absolute: PAGE_TITLE,
    },
    description: PAGE_DESCRIPTION,
    alternates: {
      canonical: path,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      url: path,
      title: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      type: "website",
    },
  };
}

export default async function PrivacyPolicyPage({
  params,
}: PrivacyPolicyPageProps) {
  const { siteSlug } = await params;

  if (!isValidSiteSlug(siteSlug) || !siteUsesPrivacyPolicy(siteSlug)) {
    notFound();
  }

  const siteData = getSiteBySlug(siteSlug);
  if (!siteData) {
    notFound();
  }

  const affiliateHref = getSitePath(siteSlug, "/affiliate");

  return (
    <main className="py-12 md:py-16">
      <article className="mx-auto max-w-3xl px-4">
        <Link
          href={getSitePath(siteSlug)}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to home
        </Link>

        <header className="mt-6 border-b border-slate-200 pb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Side Sleeper Guide respects your privacy. This Privacy Policy
            explains what information may be collected when you visit
            side-sleepers.com, how that information may be used, and the choices
            available to you.
          </p>
          <p className="mt-4 text-sm text-slate-500">
            Last updated: July 27, 2026
          </p>
        </header>

        <div className="mt-10 space-y-10 text-base leading-relaxed text-slate-700">
          <section aria-labelledby="who-we-are">
            <h2
              id="who-we-are"
              className="text-xl font-semibold text-slate-900"
            >
              1. Who we are
            </h2>
            <p className="mt-3">
              Side Sleeper Guide is an independent research website covering
              mattresses, pillows, and sleep-related products for side sleepers.
            </p>
            <p className="mt-3">
              Website:{" "}
              <a
                href="https://side-sleepers.com"
                className="font-medium text-blue-600 underline-offset-2 hover:underline"
                rel="noopener noreferrer"
              >
                https://side-sleepers.com
              </a>
            </p>
            <p className="mt-3">
              Data controller and site operator:
              <br />
              Thomas Kronvold
            </p>
            <p className="mt-3">
              Contact:{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium text-blue-600 underline-offset-2 hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </section>

          <section aria-labelledby="information-we-collect">
            <h2
              id="information-we-collect"
              className="text-xl font-semibold text-slate-900"
            >
              2. Information we may collect
            </h2>
            <p className="mt-3">
              Depending on how you interact with the site, we may process the
              following categories of information:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              <li>
                Technical information automatically provided by your browser or
                device, such as IP address, browser type, device type, operating
                system, referring page, requested pages, and timestamps.
              </li>
              <li>Cookie and consent information.</li>
              <li>
                Information relating to advertising impressions, ad interactions,
                and outbound affiliate-link interactions.
              </li>
            </ul>
            <p className="mt-4">
              The on-site newsletter form currently does not submit or store
              email addresses. Contact is handled through the email address
              listed above; messages you send by email are processed so we can
              respond.
            </p>
          </section>

          <section aria-labelledby="how-we-use">
            <h2
              id="how-we-use"
              className="text-xl font-semibold text-slate-900"
            >
              3. How we use information
            </h2>
            <p className="mt-3">We may use information to:</p>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              <li>Operate, maintain, and secure the website.</li>
              <li>Diagnose errors and prevent fraud, spam, or misuse.</li>
              <li>Understand how visitors use the site.</li>
              <li>Respond to messages and requests.</li>
              <li>Display, measure, and manage advertising.</li>
              <li>Track eligible affiliate referrals.</li>
              <li>Comply with legal obligations.</li>
            </ul>
            <p className="mt-4">
              Where applicable, processing may be based on consent, legitimate
              interests in operating and securing the site, steps requested by
              the visitor, or legal obligations.
            </p>
          </section>

          <section aria-labelledby="cookies">
            <h2
              id="cookies"
              className="text-xl font-semibold text-slate-900"
            >
              4. Cookies and similar technologies
            </h2>
            <p className="mt-3">
              Side Sleeper Guide and its service providers may use cookies,
              local storage, pixels, and similar technologies.
            </p>
            <p className="mt-3">These technologies may be used for:</p>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              <li>Essential website functionality.</li>
              <li>Remembering privacy and consent choices.</li>
              <li>Security and fraud prevention.</li>
              <li>Advertising and advertising measurement.</li>
              <li>Analytics through Google Analytics.</li>
              <li>Affiliate referral tracking.</li>
            </ul>
            <p className="mt-4">
              Visitors can manage cookies through their browser settings.
              Blocking certain cookies may affect website functionality.
            </p>
          </section>

          <section aria-labelledby="advertising">
            <h2
              id="advertising"
              className="text-xl font-semibold text-slate-900"
            >
              5. Google AdSense and advertising
            </h2>
            <p className="mt-3">
              Side Sleeper Guide may display advertisements provided by Google
              AdSense.
            </p>
            <p className="mt-3">
              Third-party vendors, including Google, use cookies to serve ads
              based on a visitor&apos;s previous visits to this website or other
              websites.
            </p>
            <p className="mt-3">
              Google&apos;s use of advertising cookies enables Google and its
              partners to serve ads based on visits to Side Sleeper Guide and
              other websites on the internet.
            </p>
            <p className="mt-3">
              Depending on the visitor&apos;s location, settings, and consent
              choices, advertisements may be personalized or non-personalized.
            </p>
            <p className="mt-3">
              Visitors can manage or opt out of personalized Google advertising
              through Google Ads Settings:{" "}
              <a
                href="https://adssettings.google.com/"
                className="font-medium text-blue-600 underline-offset-2 hover:underline"
                rel="noopener noreferrer"
              >
                https://adssettings.google.com/
              </a>
            </p>
            <p className="mt-3">
              More information about how Google uses information from websites
              that use its services is available here:{" "}
              <a
                href="https://policies.google.com/technologies/partner-sites"
                className="font-medium text-blue-600 underline-offset-2 hover:underline"
                rel="noopener noreferrer"
              >
                https://policies.google.com/technologies/partner-sites
              </a>
            </p>
            <p className="mt-3">
              Information about Google&apos;s use of cookies is available here:{" "}
              <a
                href="https://policies.google.com/technologies/cookies"
                className="font-medium text-blue-600 underline-offset-2 hover:underline"
                rel="noopener noreferrer"
              >
                https://policies.google.com/technologies/cookies
              </a>
            </p>
          </section>

          <section aria-labelledby="consent">
            <h2
              id="consent"
              className="text-xl font-semibold text-slate-900"
            >
              6. Consent management
            </h2>
            <p className="mt-3">
              For visitors in the European Economic Area, the United Kingdom,
              Switzerland, and other applicable regions, Side Sleeper Guide uses
              Google&apos;s Consent Management Platform to request and record
              privacy choices where required.
            </p>
            <p className="mt-3">
              The consent message may allow visitors to:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              <li>Consent.</li>
              <li>Decline consent.</li>
              <li>Manage individual options.</li>
            </ul>
            <p className="mt-4">
              Visitors may change or withdraw their choices through the
              &quot;Privacy and cookie settings&quot; control available in the
              website footer on pages where advertising and consent scripts are
              loaded.
            </p>
          </section>

          <section aria-labelledby="affiliate">
            <h2
              id="affiliate"
              className="text-xl font-semibold text-slate-900"
            >
              7. Affiliate links
            </h2>
            <p className="mt-3">
              Side Sleeper Guide may use affiliate links to retailers or product
              manufacturers.
            </p>
            <p className="mt-3">
              When a visitor follows an affiliate link, the destination
              retailer, manufacturer, or affiliate network may use cookies,
              referral identifiers, or similar technologies to attribute a
              purchase or other action to Side Sleeper Guide.
            </p>
            <p className="mt-3">
              Side Sleeper Guide may receive a commission from eligible purchases
              at no additional cost to the visitor.
            </p>
            <p className="mt-3">
              The destination website processes information under its own
              privacy policy. Visitors should review the privacy policy of the
              relevant retailer, manufacturer, or affiliate network. See our{" "}
              <Link
                href={affiliateHref}
                className="font-medium text-blue-600 underline-offset-2 hover:underline"
              >
                Affiliate Disclosure
              </Link>{" "}
              for more information about how we work with brands.
            </p>
          </section>

          <section aria-labelledby="analytics">
            <h2
              id="analytics"
              className="text-xl font-semibold text-slate-900"
            >
              8. Analytics
            </h2>
            <p className="mt-3">
              Side Sleeper Guide uses Google Analytics to help understand how
              visitors use the website. Google Analytics may process technical
              information such as IP address, device and browser details, pages
              viewed, and interaction events.
            </p>
            <p className="mt-3">
              More information about Google Analytics is available from Google:{" "}
              <a
                href="https://policies.google.com/privacy"
                className="font-medium text-blue-600 underline-offset-2 hover:underline"
                rel="noopener noreferrer"
              >
                https://policies.google.com/privacy
              </a>
            </p>
            <p className="mt-3">
              Where required, analytics-related cookies and processing may be
              subject to the consent choices collected through Google&apos;s
              Consent Management Platform or managed through browser settings.
            </p>
          </section>

          <section aria-labelledby="forms">
            <h2
              id="forms"
              className="text-xl font-semibold text-slate-900"
            >
              9. Contact forms and newsletters
            </h2>
            <p className="mt-3">
              The website includes a newsletter signup form for collecting an
              email address. That form is currently a front-end placeholder and
              does not send submissions to a server, newsletter provider, or
              database.
            </p>
            <p className="mt-3">
              There is no separate contact form. Privacy and other requests can
              be sent by email to{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium text-blue-600 underline-offset-2 hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </section>

          <section aria-labelledby="providers">
            <h2
              id="providers"
              className="text-xl font-semibold text-slate-900"
            >
              10. Service providers and data sharing
            </h2>
            <p className="mt-3">
              We may share limited information with providers that help us
              operate the website, provide hosting, deliver advertisements,
              measure site usage, secure the site, or attribute affiliate
              referrals. Verified providers currently include Google for
              AdSense advertising, consent management, and Google Analytics.
            </p>
            <p className="mt-3">
              We do not sell personal information in the ordinary meaning of
              selling information directly for money.
            </p>
            <p className="mt-3">
              Advertising and affiliate technologies may still involve the
              collection or sharing of identifiers as described in this policy
              and in the consent interface.
            </p>
            <p className="mt-3">
              Information may also be disclosed when required by law or when
              reasonably necessary to protect the website, its visitors, or
              others.
            </p>
          </section>

          <section aria-labelledby="transfers">
            <h2
              id="transfers"
              className="text-xl font-semibold text-slate-900"
            >
              11. International data transfers
            </h2>
            <p className="mt-3">
              Some service providers may process information outside the
              visitor&apos;s country or outside the European Economic Area.
            </p>
            <p className="mt-3">
              Where required, such processing should be protected through
              applicable legal safeguards used by the relevant provider.
            </p>
          </section>

          <section aria-labelledby="retention">
            <h2
              id="retention"
              className="text-xl font-semibold text-slate-900"
            >
              12. Data retention
            </h2>
            <p className="mt-3">
              We retain personal information only for as long as reasonably
              necessary for the purpose for which it was collected, to operate
              and secure the website, or to comply with legal obligations.
            </p>
            <p className="mt-3">
              Retention periods may differ depending on the type of information
              and the provider involved.
            </p>
          </section>

          <section aria-labelledby="rights">
            <h2
              id="rights"
              className="text-xl font-semibold text-slate-900"
            >
              13. Your privacy rights
            </h2>
            <p className="mt-3">
              Depending on where you live, you may have rights concerning your
              personal information, including the right to:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              <li>Request access.</li>
              <li>Request correction.</li>
              <li>Request deletion.</li>
              <li>Restrict or object to certain processing.</li>
              <li>Request data portability where applicable.</li>
              <li>Withdraw consent.</li>
              <li>
                Submit a complaint to a relevant data-protection authority.
              </li>
            </ul>
            <p className="mt-4">
              Privacy requests can be submitted using the contact address listed
              above.
            </p>
            <p className="mt-3">
              Visitors in Sweden can find information about the Swedish
              Authority for Privacy Protection at:{" "}
              <a
                href="https://www.imy.se/"
                className="font-medium text-blue-600 underline-offset-2 hover:underline"
                rel="noopener noreferrer"
              >
                https://www.imy.se/
              </a>
            </p>
          </section>

          <section aria-labelledby="children">
            <h2
              id="children"
              className="text-xl font-semibold text-slate-900"
            >
              14. Children&apos;s privacy
            </h2>
            <p className="mt-3">
              Side Sleeper Guide is intended for a general adult audience and is
              not directed specifically at children.
            </p>
            <p className="mt-3">
              We do not knowingly request personal information from children. If
              you believe that a child has submitted personal information,
              contact us so the matter can be reviewed and addressed.
            </p>
          </section>

          <section aria-labelledby="security">
            <h2
              id="security"
              className="text-xl font-semibold text-slate-900"
            >
              15. Data security
            </h2>
            <p className="mt-3">
              We use reasonable technical and organizational measures intended to
              protect the website and information processed through it.
            </p>
            <p className="mt-3">
              However, no internet transmission or storage system can be
              guaranteed to be completely secure.
            </p>
          </section>

          <section aria-labelledby="external">
            <h2
              id="external"
              className="text-xl font-semibold text-slate-900"
            >
              16. External websites
            </h2>
            <p className="mt-3">
              Side Sleeper Guide contains links to third-party websites.
            </p>
            <p className="mt-3">
              We are not responsible for the content, availability, or privacy
              practices of those websites. Third-party websites are governed by
              their own terms and privacy policies.
            </p>
          </section>

          <section aria-labelledby="changes">
            <h2
              id="changes"
              className="text-xl font-semibold text-slate-900"
            >
              17. Changes to this policy
            </h2>
            <p className="mt-3">
              We may update this Privacy Policy when the website, its services,
              or applicable requirements change.
            </p>
            <p className="mt-3">
              The &quot;Last updated&quot; date at the top of this page will be
              revised when material changes are made.
            </p>
          </section>

          <section aria-labelledby="contact">
            <h2
              id="contact"
              className="text-xl font-semibold text-slate-900"
            >
              18. Contact
            </h2>
            <p className="mt-3">
              For questions or privacy-related requests, contact:
            </p>
            <address className="mt-3 not-italic">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium text-blue-600 underline-offset-2 hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
            </address>
          </section>
        </div>
      </article>
    </main>
  );
}
