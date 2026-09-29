// The priority-build terms (/terms) and the privacy notice (/privacy), from docs/priority-terms-draft.md (v5) and
// docs/privacy-notice-draft.md (v2).
//
// Nothing here may be invented. Every fact the owner or the accountant has to supply is listed in `legalFacts`, and a
// page is published only when all of its facts are filled in AND its wording is approved (`approved`). Until then:
// the page answers 404 in production, no link to it is shown anywhere, and public checkout cannot open in production
// (src/server/paypal.ts). In local development the page renders with each missing fact marked, for review.

type Fact = string | null;

// Only facts that can't be derived from the offer, the law or our own setup. Each must come from the owner.
export const legalFacts = {
  /** The date /terms goes live, e.g. "1 October 2026" (its "Last updated"). Set on publication. */
  termsPublishedOn: "27 September 2026" as Fact,
  /** The date /privacy goes live (its "Last updated"). Set on publication. */
  privacyPublishedOn: "28 September 2026" as Fact,
  // Verified by the owner, 27 Sep 2026. Splendessa is the brand; the seller is a named individual.
  /** The seller's name. */
  sellerLegalName: "Anatolie Botnaru" as Fact,
  /** The seller's postal address, exactly as confirmed (no street type added). */
  sellerAddress: "Dacia 6, scara 3, ap. 57, MD-2043, Chișinău" as Fact,
  /** The country the seller is established in. */
  sellerCountry: "Republic of Moldova" as Fact,
  /** Where customers write about orders, withdrawals and cancellations. */
  contactEmail: "hello@splendessa.com" as Fact,
  /** Where people write about their personal data. */
  privacyEmail: "privacy@splendessa.com" as Fact,
};

export type LegalFact = keyof typeof legalFacts;

/**
 * Publication: the owner's decision of 27 Sep 2026 to publish both pages and open the €99 checkout now, with the
 * accountant's and the transfer review to follow. A page is live when this is true and its verified facts are filled
 * in; it never waits on, or shows, anything in `unresolved` below.
 */
// moci-web: only `/` exists here (no /terms, no /privacy), so both stay unpublished and nothing links to them.
export const approved = { terms: false, privacy: false };

/**
 * Open legal questions, recorded here and in docs/launch-open-questions.md — never shown to customers and never
 * filled with a guess. Neither gates publication or checkout (owner's decision); both pages say only what is verified.
 */
export const unresolved = {
  /** The accountant's exact VAT treatment of the €99. Unknown: the terms state only that Splendessa charges €99 in total. */
  vatStatement: null as Fact,
  /**
   * A verified basis (Law 195/2024 ch. V) for transfers from Moldova to Vercel Inc., Databricks/Neon and Google (Gmail)
   * in the US. None as of 27 Sep 2026: Vercel's DPA (Schedule 3 §3) and Databricks' DPA v3 (§1.8, §8.1) apply the EU
   * SCCs only to transfers from the EEA, the UK and Switzerland; NCPDP Order 31/2026's Standard Contract is signed with
   * no provider; the Gmail inbox has none. /privacy states this gap.
   */
  transferSafeguards: null as Fact,
};

const NEEDS: Record<"terms" | "privacy", LegalFact[]> = {
  terms: ["termsPublishedOn", "sellerLegalName", "sellerAddress", "sellerCountry", "contactEmail"],
  privacy: ["privacyPublishedOn", "sellerLegalName", "sellerAddress", "sellerCountry", "privacyEmail"],
};

/** What still stops a page from being published: missing facts, then a missing approval. */
export function missingFor(page: "terms" | "privacy"): string[] {
  const missing: string[] = NEEDS[page].filter((key) => !legalFacts[key]?.trim());
  if (!approved[page]) missing.push(`approved.${page}`);
  return missing;
}

export const termsPublished = missingFor("terms").length === 0;
export const privacyPublished = missingFor("privacy").length === 0;

export const legalLinks = {
  terms: { label: "Terms", href: "/terms" },
  privacy: { label: "Privacy", href: "/privacy" },
} as const;

/** Links for the footers: only pages that are actually published. */
export const publishedLegalLinks = [
  ...(termsPublished ? [legalLinks.terms] : []),
  ...(privacyPublished ? [legalLinks.privacy] : []),
];

/** The request to start straight away, shown unticked before PayPal and stored with the payment request. */
export const START_REQUEST = {
  version: "2026-09-27",
  text: "I ask Splendessa to start work on my site as soon as my payment completes, before the 14-day withdrawal period ends. I understand that if I then withdraw, I pay for the work done up to that point.",
};

// ---- The text -----------------------------------------------------------------------------------------------------
// A paragraph is a list of pieces: plain text, or a fact to insert. A section is a heading and blocks (a paragraph or
// a bulleted list of paragraphs).

export type Piece = string | { fact: LegalFact };
export type Block = { p: Piece[] } | { list: Piece[][] };
export type Section = { heading: string; blocks: Block[] };
export type LegalDoc = { title: string; lead: string; updatedFact: LegalFact; sections: Section[] };

const f = (fact: LegalFact) => ({ fact });

export const terms: LegalDoc = {
  title: "Priority website build — terms",
  lead: "These terms cover the €99 priority website build offered on getsplendessa.com.",
  updatedFact: "termsPublishedOn",
  sections: [
    {
      heading: "Who you're dealing with",
      blocks: [
        {
          p: [
            "Splendessa is the brand of ",
            f("sellerLegalName"),
            ", an individual based in Moldova. Postal address: ",
            f("sellerAddress"),
            ", ",
            f("sellerCountry"),
            ". Email: ",
            f("contactEmail"),
            ".",
          ],
        },
      ],
    },
    {
      heading: "What the €99 buys",
      blocks: [
        {
          p: [
            "A one-time price for this campaign: Splendessa charges €99 in total, paid through PayPal, and adds no other charge at checkout. If you pay from a balance or card in another currency, PayPal or your bank may charge you for converting it. The €99 covers:",
          ],
        },
        {
          list: [
            ["a website designed and built for your business, working on phones as well as computers;"],
            ["12 months of hosting, counted from when your approved site is published on your domain;"],
            ["publishing the site on your own domain once you approve it;"],
            ["one round of changes within 30 days of the first working version (see Changes)."],
          ],
        },
        {
          p: [
            "Not included: registering and renewing the domain (you pay your registrar directly, and the domain stays yours), online shops with checkout, complex integrations and custom apps.",
          ],
        },
      ],
    },
    {
      heading: "Before you pay",
      blocks: [
        { p: ["We check that we have three things:"] },
        {
          list: [
            ["your business name;"],
            ["what your business is (a link to it, or a handle or city plus one line about what you do);"],
            ["one way to reach you."],
          ],
        },
        {
          p: [
            "Payment doesn't open until we have them. Logo, photos, colours and references are welcome at any time. They're never needed to start, and they never move the deadline.",
          ],
        },
      ],
    },
    {
      heading: "Starting straight away",
      blocks: [
        {
          p: [
            "The first working version is due within 12 hours, so we can only start straight away if you ask us to. Before the PayPal button there's a separate box, not ticked for you: “",
            START_REQUEST.text,
            "” Payment opens once you tick it; paying doesn't waive any of your rights.",
          ],
        },
      ],
    },
    {
      heading: "The first working version, within 12 hours",
      blocks: [
        {
          p: [
            "The clock starts when PayPal confirms your payment as completed: the time shown on your confirmation screen. If PayPal holds a payment as pending, the clock starts only when PayPal confirms it as completed, and nothing is due before then. Filling in the form, choosing the priority build or opening PayPal doesn't start it.",
          ],
        },
        {
          list: [
            [
              "What we send within the 12 hours: a private link to a working website adapted to your business. It works on phones and includes a working way for your customers to contact you. We send the link by the contact method you chose.",
            ],
            ["What follows: publishing the site on your own domain happens after your feedback and your approval."],
            [
              "Integrations that need access from you (for example a booking system or an account of yours): we finish them once you've given us that access. They don't hold up the first working version, and the 12 hours don't wait for them.",
            ],
          ],
        },
      ],
    },
    {
      heading: "If we miss the 12 hours",
      blocks: [
        {
          p: [
            "If we don't send you the private link to the first working version of your site within 12 hours of PayPal confirming your payment as completed, you can ask for a full refund of the €99 you paid. After a refund, we continue the build only if you and we both agree to.",
          ],
        },
      ],
    },
    {
      heading: "Your right to withdraw",
      blocks: [
        {
          p: [
            "If you buy as a consumer — for yourself, not for your business — you can withdraw from this contract within 14 days of the day it's made (the day your payment completes), without giving a reason. To withdraw, tell us clearly, for example by email to ",
            f("contactEmail"),
            ".",
          ],
        },
        {
          p: [
            "If you asked us to start straight away and then withdraw, you pay for the work done up to the moment you tell us, in proportion to the whole service, and we refund the rest. If you withdraw before we've started, we refund the full €99.",
          ],
        },
        { p: ["If you buy for your business, this consumer right doesn't apply; the rest of these terms do."] },
      ],
    },
    {
      heading: "Cancelling",
      blocks: [
        {
          p: [
            "You can ask to cancel at any time by writing to ",
            f("contactEmail"),
            ". Nothing in these terms limits any right that applicable law gives you.",
          ],
        },
      ],
    },
    {
      heading: "How refunds are paid",
      blocks: [
        {
          p: [
            "A refund goes back to the original PayPal payment, no later than 14 days after the refund is agreed or after we receive your withdrawal. A full refund returns the full amount you paid.",
          ],
        },
      ],
    },
    {
      heading: "Changes",
      blocks: [
        {
          p: [
            "Within 30 days of the first working version, you can send us one round of changes, collected in one list, and we make them.",
          ],
        },
        {
          list: [
            [
              "Our mistakes — something that doesn't work, or isn't what we agreed — we fix separately, at no cost; they don't use up your round of changes.",
            ],
            ["New features beyond what we agreed we quote separately, before doing any work."],
          ],
        },
      ],
    },
    {
      heading: "Hosting",
      blocks: [
        {
          p: [
            "Your site's hosting is included for 12 months, starting the day your approved site is published on your domain (not when we send the private preview link). At least 30 days before those 12 months end, we tell you the options:",
          ],
        },
        {
          list: [
            ["continue with us at a renewal price we give you then; or"],
            ["receive your site's files to move it to another host (see Your site's files)."],
          ],
        },
        { p: ["Nothing renews automatically, and we never charge you without your agreement."] },
      ],
    },
    {
      heading: "Your site's files",
      blocks: [
        {
          p: [
            "Every paid build is delivered so it can be moved to another host: its source code, its text, the images you're allowed to keep, and written instructions for building and publishing it elsewhere. What doesn't move with it: our hosting account and its settings (you set these up at your new host; the instructions list them), services we run for our own business, and any font or image whose licence doesn't allow you to keep it — we replace those before delivery or tell you which they are.",
          ],
        },
      ],
    },
    {
      heading: "Our gallery",
      blocks: [{ p: ["We show a priority build in our public gallery only if you agree."] }],
    },
    {
      heading: "Problems, and the law that applies",
      blocks: [
        {
          p: [
            "Write to ",
            f("contactEmail"),
            " first. You can also use PayPal's dispute process, or contact the consumer protection authority where you live. These terms are governed by the law of the ",
            f("sellerCountry"),
            "; if you buy as a consumer, you keep any protection the mandatory law of the country where you live gives you.",
          ],
        },
      ],
    },
  ],
};

export const privacy: LegalDoc = {
  title: "How we use your details",
  lead: "This notice covers applications made on getsplendessa.com, emails you send us, and payments for the priority build.",
  updatedFact: "privacyPublishedOn",
  sections: [
    {
      heading: "Who is responsible",
      blocks: [
        {
          p: [
            "Splendessa is the brand of ",
            f("sellerLegalName"),
            ", an individual based in Moldova (postal address: ",
            f("sellerAddress"),
            ", ",
            f("sellerCountry"),
            "), who decides how your details are used. Write to ",
            f("privacyEmail"),
            " about anything in this notice.",
          ],
        },
      ],
    },
    {
      heading: "What we collect",
      blocks: [
        { p: ["When you apply on getsplendessa.com, we keep what you type in the form:"] },
        {
          list: [
            ["your business name;"],
            ["your business links, or your city and a short description;"],
            ["the contact details you choose to give (Instagram handle, WhatsApp number and/or email) and your preferred method;"],
            ["any colours, must-haves or references you add."],
          ],
        },
        { p: ["We also record:"] },
        {
          list: [
            ["which option you chose and when, and whether you asked us to start straight away;"],
            ["whether you agreed to the gallery condition;"],
            ["where you came from (for example a link from one of our videos, or the page that sent you);"],
            ["the type of browser you used."],
          ],
        },
        {
          p: [
            "On getsplendessa.com we use the Meta Pixel, a script from Meta that helps us see which of our Facebook and Instagram ads bring visitors. When you open a page, it tells Meta which page it was, your IP address and your browser and device, and it sets a Meta cookie in your browser. With Meta's automatic advanced matching switched on, it also sends Meta a scrambled (hashed) form of contact details you enter in our form, such as your email address or phone number, so Meta can match the visit to a Facebook or Instagram account.",
          ],
        },
        {
          p: [
            "If you pay, PayPal tells us the order and transaction references, the amount and its status, and any refund. We never see your card or bank details.",
          ],
        },
        {
          p: [
            "If you email us, we keep your message and your email address.",
          ],
        },
      ],
    },
    {
      heading: "Why, and on what basis",
      blocks: [
        {
          list: [
            [
              "To review your application, contact you about it and, if you choose the priority build, take your payment and build and host your site: because you asked us to, before and under our contract (Law 195/2024, art. 6(1)(b)).",
            ],
            ["To keep payment records: because accounting and tax law require it (art. 6(1)(c))."],
            [
              "To know which of our videos and links bring applications, and to keep the form working: our legitimate interest in running the campaign (art. 6(1)(f)). You can object to this.",
            ],
            [
              "To measure our Facebook and Instagram ads through the Meta Pixel, including its automatic advanced matching: our legitimate interest in knowing which ads bring visitors and applications (art. 6(1)(f)). You can object to this.",
            ],
            [
              "To show your business name and website in our public gallery if a free build is selected: your consent, given with the gallery box (art. 6(1)(a)). You can withdraw it at any time; that doesn't affect what we did before.",
            ],
          ],
        },
        {
          p: [
            "Your business details and one way to reach you are needed to consider your application; without them we can't. We make no decisions about you by automated means alone.",
          ],
        },
      ],
    },
    {
      heading: "Who handles it for us",
      blocks: [
        {
          list: [
            ["Vercel Inc. (United States): runs this website and the form, and briefly keeps standard technical logs, such as IP addresses."],
            ["Databricks, Inc. and its subsidiary Neon, LLC (United States): our application database, hosted in the United States (AWS us-east-1)."],
            ["Google (Gmail, United States): emails you send to our @splendessa.com addresses are delivered to our Gmail inbox."],
            [
              "Telegram: our team's private channel is told only an application's reference number, what happened (for example a new application or a payment) and when — never your name, contact details, links or description.",
            ],
            ["PayPal: processes your payment as its own controller, under its own privacy statement."],
            [
              "Meta Platforms (Meta Platforms Ireland Ltd and Meta Platforms, Inc., United States): receives what the Meta Pixel sends, described under What we collect, to measure our ads, and also uses it under its own terms and privacy policy.",
            ],
          ],
        },
        { p: ["We don't sell your details. Apart from the Meta Pixel, we don't use them for advertising."] },
      ],
    },
    {
      heading: "Transfers outside Moldova",
      blocks: [
        {
          p: [
            "Vercel, Databricks/Neon and Google store and process the details described above in the United States. Moldovan law (Law 195/2024) requires a safeguard when personal data leave Moldova for a country without an adequacy decision. No such safeguard is in place yet with these providers: Vercel's and Databricks' current terms cover transfers from the European Economic Area, the United Kingdom and Switzerland, not from Moldova, and our Gmail inbox has none.",
          ],
        },
        {
          p: [
            "Meta also processes what the Meta Pixel sends in the United States, under its own terms.",
          ],
        },
        {
          p: [
            "If you'd rather your details not go to the United States, don't send the form, and keep the Meta Pixel from running (see Your rights). You can ask us at any time to delete an application you've already sent.",
          ],
        },
        {
          p: [
            "When you pay, you give your payment details to PayPal directly. PayPal handles them, including any transfers, as its own controller under its own privacy statement, and tells us only what's listed under What we collect.",
          ],
        },
      ],
    },
    {
      heading: "How long we keep it",
      blocks: [
        {
          list: [
            [
              "Applications: until we've dealt with them — for the free waitlist, until the campaign's selection is over; for a priority build, for as long as we build, host and support your site. Then we delete them.",
            ],
            ["Payment records: for as long as accounting and tax law require us to keep them."],
            ["Gallery: until you withdraw your consent or we take the gallery down."],
            ["Meta Pixel: Meta's cookie lasts up to 90 days in your browser; Meta keeps what the Pixel sends under its own policy."],
          ],
        },
      ],
    },
    {
      heading: "Your rights",
      blocks: [
        {
          p: [
            "You can ask to see your details, correct them, delete them, restrict how we use them, receive them in a portable form, or object to how we use them, by writing to ",
            f("privacyEmail"),
            ". We'll delete your application from our database; payment records we must keep by law stay for the period above.",
          ],
        },
        {
          p: [
            "To keep the Meta Pixel from running, block third-party cookies or scripts in your browser; you can also change how Meta uses this data in your Facebook or Instagram ad settings.",
          ],
        },
        {
          p: [
            "You can also complain to the National Center for Personal Data Protection of the Republic of Moldova: 48 Serghei Lazo Str., MD-2004 Chișinău; centru@datepersonale.md; datepersonale.md.",
          ],
        },
      ],
    },
  ],
};
