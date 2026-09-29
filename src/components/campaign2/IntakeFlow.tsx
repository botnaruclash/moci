"use client";

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ChevronChip } from "@/components/ui/ChevronChip";
import { campaign, type ContactMethod } from "@/content/campaign2";
import { legalFacts, legalLinks, privacyPublished, termsPublished } from "@/content/legal";
import { cx } from "@/lib/cx";
import { demoMode } from "@/content/demoMode";
import {
  channelName,
  COLOUR_DIRECTIONS,
  emptyValues,
  missingEssentials,
  linkKind,
  MAX_LINKS,
  METHODS,
  preferredMethod,
  validate,
  type Field,
  type Values,
} from "./intake";
import styles from "./Intake.module.css";

// moci-web: a local demo. `post` below never leaves the browser — it validates exactly as the server did and answers
// with a reference made in the browser. No database, no Telegram, no PayPal, no Meta Pixel; every step says "Demo".
//
// Variant B. One form for everyone — essentials on the left, optional direction on the right on desktop — then two
// equal options in the same panel. Continuing saves the application on the server (/api/applications, idempotent on
// a key made once per visit); choosing Free (with the gallery consent) or €99 Priority records the choice
// (/api/applications/choose), and the server alerts the team on Telegram. Online payment is not connected: the €99
// screen says so, and its Pay button stays disabled. Three essentials — a name, one way to find the
// business, one working way to reach its owner — and everything else is optional and says so. Everything here is
// local: nothing is submitted, saved or charged, and the preview says so wherever the live page would act.

type Step = "form" | "choose" | "waitlist" | "checkout" | "paid";

const { form, choose, waitlistDone, checkout } = campaign;

const FIELD_ID: Record<Field, string> = {
  business: "f-business",
  "link-0": "f-link-0",
  city: "f-city",
  about: "f-about",
  methods: "f-method-instagram",
  "handle-instagram": "f-handle-instagram",
  "handle-whatsapp": "f-handle-whatsapp",
  "handle-email": "f-handle-email",
};

/** PayPal checkout, when the server has it configured; otherwise the €99 screen keeps its "not available yet" state. */
export type PayPalConfig = { clientId: string; env: "sandbox" | "live"; publicCheckout: boolean } | null;

export function IntakeFlow({ paypal = null }: { paypal?: PayPalConfig }) {
  const [values, setValues] = useState<Values>(emptyValues);
  const [step, setStep] = useState<Step>("form");
  const [attempted, setAttempted] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const moved = useRef(false);
  const added = useRef(false);
  /** One key per visit: every save and choice carries it, so double-clicks and retries update one record. */
  const clientKey = useRef<string | null>(null);
  const [busy, setBusy] = useState<null | "save" | "free" | "priority">(null);
  const [serverError, setServerError] = useState<{ where: "form" | "choose"; message: string } | null>(null);
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState(false);
  // The optional design questions fold away on phones (always open on desktop); their values are kept either way.
  const [optionalOpen, setOptionalOpen] = useState(false);
  const [publicId, setPublicId] = useState<string | null>(null);
  const [captureId] = useState<string | null>(null);
  const [dueAt] = useState<string | null>(null);
  const [savingEssentials, setSavingEssentials] = useState(false);
  const [essentialsError, setEssentialsError] = useState<string | null>(null);
  // Checked against what the server has saved, so PayPal never appears for details the server hasn't seen yet.
  const [savedValues, setSavedValues] = useState<Values | null>(null);
  const missing = missingEssentials(savedValues ?? values);
  // Ordinary visitors get PayPal only while public checkout is open (PAYPAL_PUBLIC_CHECKOUT; off in live by default).
  const checkoutOpen = !!paypal?.publicCheckout;
  // One key per visit, for the demo reference.
  const getClientKey = useCallback(() => (clientKey.current ??= crypto.randomUUID()), []);
  const honeypot = useRef<HTMLInputElement>(null);

  const errors = validate(values);
  const shown = attempted ? errors : {};
  const set = <K extends keyof Values>(key: K, value: Values[K]) => setValues((v) => ({ ...v, [key]: value }));

  // After each step change the new step's heading takes focus, so keyboard and screen-reader users land on it. Past
  // the form the page first drops its landing hero and art (Campaign.module.css reads html[data-flow-step]), then
  // scrolls, so the choices, checkout or result open at the top of the screen.
  useEffect(() => {
    document.documentElement.dataset.flowStep = step;
    if (!moved.current) return;
    const target = step === "form" ? document.getElementById("f-business") : heading.current;
    panel.current?.scrollIntoView({ block: "start" });
    target?.focus({ preventScroll: true });
  }, [step]);

  useEffect(
    () => () => {
      delete document.documentElement.dataset.flowStep;
    },
    [],
  );

  // A save or choice that failed says so where the reader can see it (on a phone it sits below the button).
  useEffect(() => {
    if (serverError) panel.current?.querySelector("[role=alert]")?.scrollIntoView({ block: "nearest" });
  }, [serverError]);

  // A link row added with the button gets the cursor.
  useEffect(() => {
    if (!added.current) return;
    added.current = false;
    document.getElementById(`f-link-${values.links.length - 1}`)?.focus();
  }, [values.links.length]);

  const go = (next: Step) => {
    moved.current = true;
    setStep(next);
  };

  // Demo only: the server's checks and its unsaved LOCAL-xxxxxx reference, without the server. Nothing is sent.
  const post = async (_path: string, payload: { values?: Values } & Record<string, unknown>) => {
    const key = getClientKey();
    await new Promise((resolve) => setTimeout(resolve, 350));
    const invalid = payload.values && Object.values(validate(payload.values))[0];
    if (invalid) throw new Error(invalid);
    return { ok: true, publicId: localReference(key) };
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setAttempted(true);
    const first = (Object.keys(FIELD_ID) as Field[]).find((field) => errors[field]);
    if (first) {
      document.getElementById(FIELD_ID[first])?.focus();
      return;
    }
    setBusy("save");
    setServerError(null);
    try {
      const params = new URLSearchParams(window.location.search);
      const utm = Object.fromEntries([...params].filter(([key]) => key.startsWith("utm_") || key === "ref"));
      const saved = await post("/api/applications", {
        values,
        source: { utm, referrer: document.referrer, landingUrl: window.location.href },
        website: honeypot.current?.value ?? "",
      });
      if (saved.publicId) {
        setPublicId(saved.publicId);
      }
      setSavedValues(values);
      go("choose");
    } catch (error) {
      setServerError({ where: "form", message: error instanceof Error ? error.message : form.saveFailed });
    } finally {
      setBusy(null);
    }
  };

  const chooseOption = async (option: "free" | "priority") => {
    if (busy) return;
    if (option === "free" && !consent) {
      setConsentError(true);
      document.getElementById("f-consent")?.focus();
      return;
    }
    setBusy(option);
    setServerError(null);
    try {
      await post("/api/applications/choose", { option, galleryConsent: option === "free" && consent });
      go(option === "free" ? "waitlist" : "checkout");
    } catch (error) {
      setServerError({ where: "choose", message: error instanceof Error ? error.message : form.saveFailed });
    } finally {
      setBusy(null);
    }
  };

  const toggleMethod = (method: ContactMethod, on: boolean) =>
    setValues((v) => {
      const methods = on ? [...v.methods, method] : v.methods.filter((m) => m !== method);
      const preferred = v.preferred && methods.includes(v.preferred) ? v.preferred : (methods[0] ?? null);
      return { ...v, methods, preferred };
    });

  const chosen = METHODS.filter((m) => values.methods.includes(m));

  return (
    <div ref={panel} className={styles.panel}>
      <h2 id="intake-title" className={cx(styles.kicker, step !== "form" && "sr-only", "type-meta")}>
        {step === "form" ? form.kicker : choose.title}
      </h2>

      {step === "form" && (
        <form className={styles.form} onSubmit={submit} noValidate>
          <div className={styles.colMain}>
            <TextField
              id="f-business"
              label={form.business.label}
              placeholder={form.business.placeholder}
              value={values.business}
              onChange={(v) => set("business", v)}
              error={shown.business}
              autoComplete="organization"
            />

            {/* ---- Where to find it ---- */}
            <div className={styles.group}>
              <p className={cx(styles.label, "type-control")} id="links-label">
                {form.links.label}
              </p>
              {!values.offline && (
                <>
                  <p className={cx(styles.hint, "type-small")} id="links-hint">
                    {form.links.hint}
                  </p>
                  <ul className={styles.links} aria-labelledby="links-label">
                    {values.links.map((link, index) => {
                      const kind = linkKind(link);
                      const error = index === 0 ? shown["link-0"] : undefined;
                      return (
                        <li key={index} className={styles.linkRow}>
                          <div className={styles.linkInput}>
                            <input
                              id={`f-link-${index}`}
                              className={cx(styles.input, kind && styles.inputTagged)}
                              value={link}
                              placeholder={index === 0 ? form.links.placeholder : ""}
                              aria-label={index === 0 ? undefined : `Link ${index + 1}`}
                              aria-labelledby={index === 0 ? "links-label" : undefined}
                              aria-describedby={cx("links-hint", error && "e-link-0") || undefined}
                              aria-invalid={!!error}
                              inputMode="url"
                              autoCapitalize="none"
                              autoCorrect="off"
                              spellCheck={false}
                              onChange={(e) =>
                                setValues((v) => ({ ...v, links: v.links.map((l, i) => (i === index ? e.target.value : l)) }))
                              }
                            />
                            {kind && (
                              <span className={cx(styles.kind, "type-meta")} aria-hidden="true">
                                {kind}
                              </span>
                            )}
                          </div>
                          {index > 0 && (
                            <button
                              type="button"
                              className={styles.remove}
                              aria-label={`${form.links.remove} ${index + 1}`}
                              onClick={() => setValues((v) => ({ ...v, links: v.links.filter((_, i) => i !== index) }))}
                            >
                              <span aria-hidden="true">×</span>
                            </button>
                          )}
                          {error && <FieldError id="e-link-0">{error}</FieldError>}
                        </li>
                      );
                    })}
                  </ul>
                  {values.links.length < MAX_LINKS && (
                    <button
                      type="button"
                      className={cx(styles.add, "type-control")}
                      onClick={() => {
                        added.current = true;
                        setValues((v) => ({ ...v, links: [...v.links, ""] }));
                      }}
                    >
                      <PixelPlus />
                      {form.links.add}
                    </button>
                  )}
                </>
              )}
              <label className={cx(styles.check, "type-small")}>
                <input type="checkbox" checked={values.offline} onChange={(e) => set("offline", e.target.checked)} />
                <span className={styles.checkBox} aria-hidden="true" />
                {form.links.noPresence}
              </label>
              {values.offline && (
                <div className={styles.reveal}>
                  <TextField
                    id="f-city"
                    label={form.links.city.label}
                    placeholder={form.links.city.placeholder}
                    value={values.city}
                    onChange={(v) => set("city", v)}
                    error={shown.city}
                    autoComplete="address-level2"
                  />
                  <TextField
                    id="f-about"
                    label={form.links.about.label}
                    placeholder={form.links.about.placeholder}
                    value={values.about}
                    onChange={(v) => set("about", v)}
                    error={shown.about}
                    multiline
                  />
                </div>
              )}
            </div>

            {/* ---- How to reach them ---- */}
            <fieldset className={styles.group} aria-describedby={cx("methods-hint", shown.methods && "e-methods")}>
              <legend className={cx(styles.label, "type-control")}>{form.contact.label}</legend>
              <p id="methods-hint" className={cx(styles.hint, "type-small")}>
                {form.contact.hint}
              </p>
              <div className={styles.methods}>
                {METHODS.map((method) => (
                  <label key={method} className={cx(styles.method, "type-control")}>
                    <input
                      id={`f-method-${method}`}
                      type="checkbox"
                      checked={values.methods.includes(method)}
                      onChange={(e) => toggleMethod(method, e.target.checked)}
                    />
                    <span>{form.contact.methods[method].label}</span>
                  </label>
                ))}
              </div>
              {shown.methods && <FieldError id="e-methods">{shown.methods}</FieldError>}
              {chosen.length > 0 && (
                <div className={styles.reveal}>
                  {chosen.map((method) => (
                    <TextField
                      key={method}
                      id={`f-handle-${method}`}
                      label={form.contact.methods[method].field}
                      placeholder={form.contact.methods[method].placeholder}
                      value={values.handles[method]}
                      onChange={(v) => setValues((s) => ({ ...s, handles: { ...s.handles, [method]: v } }))}
                      error={shown[`handle-${method}`]}
                      inputMode={form.contact.methods[method].inputMode}
                      autoComplete={method === "email" ? "email" : method === "whatsapp" ? "tel" : "off"}
                      type={method === "email" ? "email" : method === "whatsapp" ? "tel" : "text"}
                      aside={
                        chosen.length > 1 ? (
                          <label className={cx(styles.preferred, "type-meta")}>
                            <input
                              type="radio"
                              name="preferred"
                              checked={preferredMethod(values) === method}
                              onChange={() => set("preferred", method)}
                            />
                            <span className={styles.radioDot} aria-hidden="true" />
                            {form.contact.preferred}
                            <span className="sr-only"> — {form.contact.methods[method].label}</span>
                          </label>
                        ) : null
                      }
                    />
                  ))}
                </div>
              )}
            </fieldset>
          </div>

          {/* ---- Optional ---- */}
          <div className={styles.optional}>
            <p className={styles.optionalHead}>
              <span className="type-meta">{form.optional.title}</span>
              <span className="type-small">{form.optional.line}</span>
            </p>
            <button
              type="button"
              className={cx(styles.optionalToggle, "type-control")}
              aria-expanded={optionalOpen}
              aria-controls="optional-body"
              onClick={() => setOptionalOpen((open) => !open)}
            >
              {optionalOpen ? form.optional.hide : form.optional.show}
              <span aria-hidden="true">{optionalOpen ? "−" : "+"}</span>
            </button>
            <div id="optional-body" className={styles.optionalBody} data-open={optionalOpen}>

            <fieldset className={styles.group}>
              <legend className={cx(styles.label, "type-control")}>{form.colours.label}</legend>
              <div className={styles.chips}>
                {COLOUR_DIRECTIONS.map((key) => {
                  const direction = form.colours.directions[key];
                  return (
                    <label key={key} className={cx(styles.chip, "type-small")}>
                      <input
                        type="checkbox"
                        checked={values.colours.includes(key)}
                        onChange={(e) =>
                          setValues((v) => ({
                            ...v,
                            chooseColours: false,
                            colours: e.target.checked ? [...v.colours, key] : v.colours.filter((c) => c !== key),
                          }))
                        }
                      />
                      <span className={styles.swatch} aria-hidden="true">
                        {direction.swatch.map((colour) => (
                          <i key={colour} style={{ backgroundColor: colour }} />
                        ))}
                      </span>
                      {direction.label}
                    </label>
                  );
                })}
                <label className={cx(styles.chip, styles.chipAuto, "type-small")}>
                  <input
                    type="checkbox"
                    checked={values.chooseColours}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, chooseColours: e.target.checked, colours: e.target.checked ? [] : v.colours }))
                    }
                  />
                  {form.colours.chooseForMe}
                </label>
              </div>
              <TextField
                id="f-colour-note"
                label={form.colours.describe}
                placeholder={form.colours.describePlaceholder}
                value={values.colourNote}
                onChange={(v) => set("colourNote", v)}
                quiet
              />
            </fieldset>

            <TextField
              id="f-notes"
              label={form.notes.label}
              placeholder={form.notes.placeholder}
              value={values.notes}
              onChange={(v) => set("notes", v)}
              multiline
            />
            </div>
          </div>

          {/* A field people never see; bots that fill it are ignored by the server. */}
          <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className={styles.honeypot} />

          <div className={styles.submitRow}>
            <button type="submit" className={cx(styles.primary, "type-control")} disabled={busy === "save"} aria-busy={busy === "save"}>
              <span>{busy === "save" ? form.saving : form.submit}</span>
              <ChevronChip />
            </button>
            <p className={cx(styles.previewNote, "type-meta")}>{form.previewNote}</p>
            <p className={cx(styles.previewStamp, "type-meta")}>{demoMode.form}</p>
            {privacyPublished && (
              <p className={cx(styles.previewNote, "type-small")}>
                {campaign.privacyNote.text} <a href={legalLinks.privacy.href}>{campaign.privacyNote.link}</a>
              </p>
            )}
            {serverError?.where === "form" && (
              <p role="alert" className={cx(styles.error, styles.submitError, "type-small")}>
                {serverError.message}
              </p>
            )}
          </div>
        </form>
      )}

      {step === "choose" && (
        <div className={styles.choose}>
          <div className={styles.chooseHead}>
            <h3 ref={heading} tabIndex={-1} data-flow-heading className={cx(styles.chooseHeading, "type-h3")}>
              {choose.title}
            </h3>
            <p className={cx(styles.forLine, "type-small")}>
              <span className={styles.forName}>
                {choose.forLabel} <strong>{values.business.trim()}</strong>
              </span>
              <button type="button" className={cx(styles.edit, "type-control")} onClick={() => go("form")}>
                {choose.edit}
              </button>
            </p>
          </div>

          {/* Priority first on phones, on the left on desktop; Free stays a full option beside it. */}
          <div className={styles.options}>
            <article className={cx(styles.option, styles.optionPriority)} aria-labelledby="opt-paid">
              <div className={styles.optionHead}>
                <h4 id="opt-paid" className={cx(styles.optionName, "type-control")}>
                  {choose.paid.tag}
                </h4>
                <span className={cx(styles.price, "type-meta-l")}>{choose.paid.price}</span>
              </div>
              <p className={cx(styles.optionText, "type-small")}>{choose.paid.text}</p>
              <ul className={styles.facts}>
                {choose.paid.points.map((point) => (
                  <li key={point} className="type-small">
                    {point}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className={cx(styles.primary, "type-control")}
                disabled={busy !== null}
                aria-busy={busy === "priority"}
                onClick={() => chooseOption("priority")}
              >
                <span>{busy === "priority" ? choose.choosing : choose.paid.action}</span>
                <ChevronChip />
              </button>
            </article>

            <article className={styles.option} aria-labelledby="opt-free">
              <div className={styles.optionHead}>
                <h4 id="opt-free" className={cx(styles.optionName, "type-control")}>
                  {choose.free.tag}
                </h4>
                <span className={cx(styles.price, "type-meta-l")}>{choose.free.price}</span>
              </div>
              <p className={cx(styles.optionText, "type-small")}>{choose.free.text}</p>
              <ul className={styles.facts}>
                {choose.free.points.map((point) => (
                  <li key={point} className="type-small">
                    {point}
                  </li>
                ))}
              </ul>
              <label className={cx(styles.check, styles.consent, "type-small")}>
                <input
                  id="f-consent"
                  type="checkbox"
                  checked={consent}
                  aria-invalid={consentError && !consent}
                  aria-describedby={consentError && !consent ? "e-consent" : undefined}
                  onChange={(e) => {
                    setConsent(e.target.checked);
                    if (e.target.checked) setConsentError(false);
                  }}
                />
                <span className={styles.checkBox} aria-hidden="true" />
                <span>{choose.free.consent}</span>
              </label>
              {consentError && !consent && <FieldError id="e-consent">{choose.free.consentMissing}</FieldError>}
              <button
                type="button"
                className={cx(styles.secondary, "type-control")}
                disabled={busy !== null}
                aria-busy={busy === "free"}
                onClick={() => chooseOption("free")}
              >
                <span>{busy === "free" ? choose.choosing : choose.free.action}</span>
              </button>
            </article>
          </div>

          {serverError?.where === "choose" && (
            <p role="alert" className={cx(styles.error, "type-small")}>
              {serverError.message}
            </p>
          )}
          <p className={cx(styles.both, "type-small")}>{choose.both}</p>
        </div>
      )}

      {step === "waitlist" && (
        <div className={styles.result}>
          <h3 ref={heading} tabIndex={-1} data-flow-heading className="type-h3">
            {waitlistDone.title}
          </h3>
          <p className={cx(styles.resultText, "type-body")}>{waitlistDone.text(channelName(preferredMethod(values)))}</p>
          <p className={cx(styles.previewStamp, "type-meta")}>{demoMode.result}</p>
          {publicId && (
            <p className={cx(styles.reference, "type-meta")}>
              {waitlistDone.reference}: {publicId}
            </p>
          )}
          {checkoutOpen && (
            <div className={styles.upgrade}>
              <p className={cx(styles.upgradeTitle, "type-control")}>{waitlistDone.upgrade.title}</p>
              <p className={cx(styles.upgradeText, "type-small")}>{waitlistDone.upgrade.text}</p>
              <button
                type="button"
                className={cx(styles.secondary, "type-control")}
                disabled={busy !== null}
                aria-busy={busy === "priority"}
                onClick={() => chooseOption("priority")}
              >
                <span>{busy === "priority" ? choose.choosing : waitlistDone.upgrade.action}</span>
              </button>
              {serverError?.where === "choose" && (
                <p role="alert" className={cx(styles.error, "type-small")}>
                  {serverError.message}
                </p>
              )}
            </div>
          )}
          <button type="button" className={cx(styles.edit, "type-control")} onClick={() => go("choose")}>
            ← {waitlistDone.back}
          </button>
        </div>
      )}

      {step === "checkout" && (
        <div className={styles.result}>
          <div className={styles.checkoutTop}>
            {!(paypal?.env === "live" && checkoutOpen) && <p className={cx(styles.previewStamp, "type-meta")}>Preview</p>}
            <button type="button" className={cx(styles.edit, "type-control")} onClick={() => go("choose")}>
              ← {checkout.back}
            </button>
          </div>
          <h3 ref={heading} tabIndex={-1} data-flow-heading className="type-h3">
            {paypal?.env === "live" && checkoutOpen ? checkout.titleLive : checkout.title}
          </h3>
          <dl className={styles.summary}>
            <div>
              <dt className="type-small">{checkout.summary.forLabel}</dt>
              <dd className="type-small">{values.business.trim()}</dd>
            </div>
            <div className={styles.summaryTotal}>
              <dt className="type-control">{checkout.summary.total}</dt>
              <dd className="type-control">{checkout.summary.totalValue}</dd>
            </div>
            <div>
              <dt className="type-small">{checkout.summary.deadline}</dt>
              <dd className="type-small">{checkout.summary.deadlineValue}</dd>
            </div>
            <div>
              <dt className="type-small">{checkout.summary.domain}</dt>
              <dd className="type-small">{checkout.summary.domainValue}</dd>
            </div>
          </dl>
          {!checkoutOpen && (
            <p role="status" className={cx(styles.resultText, "type-small")}>
              {checkout.saved}
            </p>
          )}
          <p className={cx(styles.previewStamp, "type-meta")}>{demoMode.result}</p>
          {/* The short terms (content/legal.ts) stay before payment, with the full terms one tap away. */}
          <p className={cx(styles.draft, "type-small")}>
            {checkoutOpen ? checkout.note : checkout.noteClosed}
            {checkoutOpen && termsPublished && (
              <>
                {" "}
                <a href={legalLinks.terms.href}>{checkout.fullTerms}</a>
              </>
            )}
          </p>
          {/* Only if an essential is still missing: the three-item check and the one field to fix it. */}
          {checkoutOpen && missing.length > 0 && (
            <div className={styles.essentials}>
              <p className={cx(styles.essentialsTitle, "type-meta")}>{checkout.essentials.title}</p>
              <p className={cx(styles.essentialsIntro, "type-small")}>{checkout.essentials.intro}</p>
              <ul className={styles.essentialsList}>
                {(["business", "identity", "contact"] as const).map((key) => (
                  <li key={key} className="type-small" data-ok={!missing.includes(key)}>
                    <span className={styles.essentialsMark} aria-hidden="true" />
                    {checkout.essentials.items[key]}
                    <span className="sr-only">{missing.includes(key) ? " — missing" : " — done"}</span>
                  </li>
                ))}
              </ul>
              {missing.includes("identity") && !missing.includes("business") && !missing.includes("contact") && (
                <div className={styles.essentialsFix}>
                  <TextField
                    id="f-about-priority"
                    label={checkout.essentials.identityLabel}
                    hint={checkout.essentials.identityHint}
                    placeholder={checkout.essentials.identityPlaceholder}
                    value={values.about}
                    onChange={(v) => set("about", v)}
                    error={essentialsError ?? undefined}
                    multiline
                  />
                  <button
                    type="button"
                    className={cx(styles.secondary, "type-control")}
                    disabled={savingEssentials}
                    onClick={async () => {
                      if (values.about.trim().length < 8) return setEssentialsError("Add a sentence about what your business does.");
                      setSavingEssentials(true);
                      setEssentialsError(null);
                      try {
                        await post("/api/applications", { values, source: {} });
                        setSavedValues(values);
                      } catch (error) {
                        setEssentialsError(error instanceof Error ? error.message : form.saveFailed);
                      } finally {
                        setSavingEssentials(false);
                      }
                    }}
                  >
                    <span>{savingEssentials ? form.saving : checkout.essentials.save}</span>
                  </button>
                </div>
              )}
              {(missing.includes("business") || missing.includes("contact")) && (
                <button type="button" className={cx(styles.edit, "type-control")} onClick={() => go("form")}>
                  {checkout.essentials.edit}
                </button>
              )}
              <p className={cx(styles.essentialsOptional, "type-small")}>{checkout.essentials.optional}</p>
            </div>
          )}
          {!checkoutOpen && (
            <>
              <button type="button" className={cx(styles.primary, "type-control")} disabled aria-describedby="pay-off">
                <span>{checkout.pay}</span>
              </button>
              <p id="pay-off" className={cx(styles.previewNote, "type-meta")}>
                {checkout.payDisabled}
              </p>
            </>
          )}
          {checkoutOpen && (
            <p className={cx(styles.draft, "type-small")}>
              {checkout.sellerLabel}: {legalFacts.sellerLegalName} (Splendessa), {legalFacts.sellerAddress}, {legalFacts.sellerCountry} ·{" "}
              <a href={`mailto:${legalFacts.contactEmail}`}>{legalFacts.contactEmail}</a>
            </p>
          )}
          {publicId && (
            <p className={cx(styles.reference, "type-meta")}>
              {waitlistDone.reference}: {publicId}
            </p>
          )}
        </div>
      )}

      {step === "paid" && (
        <div className={styles.result}>
          {paypal?.env === "sandbox" && <p className={cx(styles.previewStamp, "type-meta")}>{checkout.sandboxNote}</p>}
          <h3 ref={heading} tabIndex={-1} data-flow-heading className="type-h3">
            {checkout.paidTitle}
          </h3>
          <p role="status" className={cx(styles.resultText, styles.savedNote, "type-body")}>
            {dueAt
              ? checkout.paidText(channelName(preferredMethod(values)), formatDeadline(dueAt))
              : checkout.paidTextNoDeadline(channelName(preferredMethod(values)))}
          </p>
          {publicId && (
            <p className={cx(styles.reference, "type-meta")}>
              {waitlistDone.reference}: {publicId}
            </p>
          )}
          {captureId && (
            <p className={cx(styles.reference, "type-meta")}>
              {checkout.captureLabel}: {captureId}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/** The site's 5×5 pixel plus (Accordion), at 2px per pixel. */
function PixelPlus() {
  return (
    <svg className={styles.plus} viewBox="0 0 5 5" width="10" height="10" shapeRendering="crispEdges" aria-hidden="true">
      <rect x="0" y="2" width="5" height="1" fill="currentColor" />
      <rect x="2" y="0" width="1" height="5" fill="currentColor" />
    </svg>
  );
}

function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className={cx(styles.error, "type-small")}>
      {children}
    </p>
  );
}

function TextField({
  id,
  label,
  hint,
  placeholder,
  value,
  onChange,
  error,
  multiline = false,
  quiet = false,
  aside,
  ...rest
}: {
  id: string;
  label: string;
  hint?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  multiline?: boolean;
  /** A secondary field: a lighter label. */
  quiet?: boolean;
  /** Sits at the end of the label row (the "Preferred" choice). */
  aside?: ReactNode;
  autoComplete?: string;
  inputMode?: "text" | "url" | "tel" | "email";
  type?: string;
}) {
  const hintId = useId();
  const errorId = `${id}-error`;
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(" ") || undefined;
  const common = {
    id,
    value,
    placeholder,
    "aria-invalid": !!error,
    "aria-describedby": describedBy,
    className: cx(styles.input, multiline && styles.textarea),
  };
  return (
    <div className={styles.field}>
      <div className={styles.labelRow}>
        <label htmlFor={id} className={cx(styles.label, quiet ? "type-small" : "type-control", quiet && styles.labelQuiet)}>
          {label}
        </label>
        {aside}
      </div>
      {hint && (
        <p id={hintId} className={cx(styles.hint, "type-small")}>
          {hint}
        </p>
      )}
      {multiline ? (
        <textarea {...common} rows={3} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input {...common} {...rest} onChange={(e) => onChange(e.target.value)} />
      )}
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  );
}

/** A deadline in the buyer's own time zone, e.g. "Saturday 27 September, 06:14 GMT+3". */
function formatDeadline(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZoneName: "short",
  }).format(new Date(iso));
}

/** The unsaved reference the server used to return (server/backend.ts offlinePublicId), made here instead. */
function localReference(clientKey: string) {
  let hash = 0;
  for (const char of clientKey) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return `LOCAL-${hash.toString(36).toUpperCase().padStart(6, "0").slice(-6)}`;
}
