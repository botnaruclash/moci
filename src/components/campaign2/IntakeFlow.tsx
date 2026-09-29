"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ChevronChip } from "@/components/ui/ChevronChip";
import { campaign } from "@/content/campaign2";
import { demoMode } from "@/content/demoMode";
import { cx } from "@/lib/cx";
import { emptyValues, validate, type Field, type Values } from "./intake";
import styles from "./Intake.module.css";
import { CHOOSE_PLAN_EVENT, PLANS, type Plan } from "./plan";

// moci-web: the landing's request (owner's brief, 29 Sep 2026), in the campaign form's panel and styles. It opens on
// two cards — Gratuit · 0 MDL and Premium · 1.999 MDL. Once one is chosen the same short form follows for both, with the
// choice kept on top of it as a two-way switch, so the plan can change without losing anything typed. The table's
// buttons (ChoosePlanLink) pick a plan from further down. A local demo: sending only validates, then says plainly that
// nothing was saved or sent. No database, no alerts, no payment, no tracking.

type Step = "form" | "done";
/** Where to take the visitor after a step change: the panel's top, then focus on the first empty field or the result. */
type Move = { to: "field" | "heading" };

const { plans, form, done } = campaign;

const FIELD_ID: Record<Field, string> = {
  business: "f-business",
  services: "f-services",
  phone: "f-phone",
};

export function IntakeFlow() {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [values, setValues] = useState<Values>(emptyValues);
  const [step, setStep] = useState<Step>("form");
  const [attempted, setAttempted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [move, setMove] = useState<Move | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  const errors = validate(values);
  const shown = attempted ? errors : {};
  const set = <K extends keyof Values>(key: K, value: Values[K]) => setValues((v) => ({ ...v, [key]: value }));

  // Past the form the page drops the form's headline and art (Campaign.module.css reads html[data-flow-step]).
  useEffect(() => {
    document.documentElement.dataset.flowStep = step;
  }, [step]);

  useEffect(
    () => () => {
      delete document.documentElement.dataset.flowStep;
    },
    [],
  );

  // After a move the panel comes into view and the new step's heading, or the first empty field, takes focus.
  useEffect(() => {
    if (!move || !panel.current) return;
    panel.current.scrollIntoView({ block: "start" });
    const fields = Array.from(panel.current.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("form input:not([type=radio]), form textarea"));
    const target = move.to === "heading" ? heading.current : (fields.find((field) => !field.value.trim()) ?? fields[0]);
    target?.focus({ preventScroll: true });
  }, [move]);

  const go = (next: Step, to: Move["to"]) => {
    setStep(next);
    setMove({ to });
  };

  const pick = (next: Plan) => {
    setPlan(next);
    go("form", "field");
  };

  // The comparison table's buttons pick a plan from further down the page.
  useEffect(() => {
    const onChoose = (event: Event) => {
      setPlan((event as CustomEvent<Plan>).detail);
      setStep("form");
      setMove({ to: "field" });
    };
    window.addEventListener(CHOOSE_PLAN_EVENT, onChoose);
    return () => window.removeEventListener(CHOOSE_PLAN_EVENT, onChoose);
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setAttempted(true);
    const first = (Object.keys(FIELD_ID) as Field[]).find((field) => errors[field]);
    if (first) {
      document.getElementById(FIELD_ID[first])?.focus();
      return;
    }
    // Demo only: nothing is sent. A short pause, so the sending state can be reviewed.
    setBusy(true);
    await new Promise((resolve) => setTimeout(resolve, 350));
    setBusy(false);
    go("done", "heading");
  };

  return (
    <div ref={panel} className={styles.panel}>
      {plan === null && <PlanCards onPick={pick} />}

      {plan !== null && step === "form" && (
        <form className={cx(styles.form, styles.reveal)} onSubmit={submit} noValidate>
          <PlanSwitch plan={plan} onChange={setPlan} />

          <div className={styles.colMain}>
            <TextField
              id={FIELD_ID.business}
              label={form.business.label}
              value={values.business}
              onChange={(v) => set("business", v)}
              error={shown.business}
              autoComplete="organization"
            />
            <TextField
              id={FIELD_ID.services}
              label={form.services.label}
              value={values.services}
              onChange={(v) => set("services", v)}
              error={shown.services}
              multiline
            />
            <TextField
              id="f-presence"
              label={form.presence.label}
              optional={form.presence.optional}
              value={values.presence}
              onChange={(v) => set("presence", v)}
              inputMode="url"
              autoCapitalize="none"
              spellCheck={false}
            />
          </div>

          <div className={styles.colMain}>
            <TextField
              id={FIELD_ID.phone}
              label={form.phone.label}
              value={values.phone}
              onChange={(v) => set("phone", v)}
              error={shown.phone}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
            />
            <TextField
              id="f-details"
              label={form.details.label}
              optional={form.details.optional}
              value={values.details}
              onChange={(v) => set("details", v)}
              multiline
            />
          </div>

          <div className={styles.submitRow}>
            <button type="submit" className={cx(styles.primary, "type-control")} disabled={busy} aria-busy={busy}>
              <span>{busy ? form.sending : plans[plan].submit}</span>
              <ChevronChip />
            </button>
            <div className={styles.submitNotes}>
              <p className={cx(styles.steps, "type-small")}>{form.steps}</p>
              <p className={cx(styles.previewNote, "type-small")}>{plans[plan].note}</p>
            </div>
            <p className={cx(styles.previewStamp, styles.submitStamp, "type-meta")}>{demoMode.form}</p>
          </div>
        </form>
      )}

      {plan !== null && step === "done" && (
        <div className={styles.result}>
          <h3 ref={heading} tabIndex={-1} data-flow-heading className="type-h3">
            {demoMode.result}
          </h3>
          <p role="status" className={cx(styles.resultText, "type-body")}>
            {done.text}
          </p>
          <dl className={cx(styles.summary, "type-small")}>
            <div>
              <dt>{done.summary.plan}</dt>
              <dd>
                {plans[plan].name} · {plans[plan].price}
              </dd>
            </div>
            <div>
              <dt>{done.summary.business}</dt>
              <dd>{values.business.trim()}</dd>
            </div>
            <div>
              <dt>{done.summary.phone}</dt>
              <dd>{values.phone.trim()}</dd>
            </div>
          </dl>
          <button type="button" className={cx(styles.edit, "type-control")} onClick={() => go("form", "field")}>
            ← {done.edit}
          </button>
        </div>
      )}
    </div>
  );
}

/** The first choice: two cards, side by side from 768px, one under the other on phones. */
function PlanCards({ onPick }: { onPick: (plan: Plan) => void }) {
  return (
    <div className={styles.choose}>
      <div className={styles.chooseHead}>
        <h3 className={cx(styles.chooseHeading, "type-h3")}>{plans.heading}</h3>
        <p className={cx(styles.optionText, "type-small")}>{plans.lead}</p>
      </div>
      <div className={styles.options}>
        {PLANS.map((id) => {
          const p = plans[id];
          return (
            <article key={id} className={cx(styles.option, id === "premium" && styles.optionPriority)} aria-labelledby={`plan-${id}`}>
              <div className={styles.optionHead}>
                <h4 id={`plan-${id}`} className={cx(styles.optionName, "type-control")}>
                  {p.name}
                </h4>
                <span className={cx(styles.price, "type-h3")}>{p.price}</span>
              </div>
              <ul className={cx(styles.facts, "type-small")}>
                {p.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              {p.fine && <p className={cx(styles.optionFine, "type-small")}>{p.fine}</p>}
              <button
                type="button"
                className={cx(id === "premium" ? styles.primary : styles.secondary, "type-control")}
                onClick={() => onPick(id)}
              >
                <span>{p.choose}</span>
                <ChevronChip />
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}

/** The chosen plan, on top of the form: two radios drawn as pills, and what the chosen one includes. */
function PlanSwitch({ plan, onChange }: { plan: Plan; onChange: (plan: Plan) => void }) {
  return (
    <fieldset className={cx(styles.group, styles.planSwitch)}>
      <legend className={cx(styles.label, styles.planLegend, "type-control")}>{plans.chosen}</legend>
      <div className={styles.planPills}>
        {PLANS.map((id) => (
          <label key={id} className={cx(styles.planPill, "type-control")}>
            <input type="radio" name="plan" value={id} checked={plan === id} onChange={() => onChange(id)} />
            <span>{plans[id].name}</span>
            <span className={styles.planPrice}>{plans[id].price}</span>
          </label>
        ))}
      </div>
      <p className={cx(styles.previewNote, "type-small")} aria-live="polite">
        {plans[plan].summary}
      </p>
    </fieldset>
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
  optional,
  value,
  onChange,
  error,
  multiline = false,
  ...rest
}: {
  id: string;
  label: string;
  /** Shown after the label, lighter: "(opțional)". */
  optional?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  multiline?: boolean;
  autoComplete?: string;
  autoCapitalize?: string;
  spellCheck?: boolean;
  inputMode?: "text" | "url" | "tel" | "email";
  type?: string;
}) {
  const hintId = useId();
  const errorId = `${id}-error`;
  const common = {
    id,
    value,
    "aria-invalid": !!error,
    "aria-describedby": error ? errorId : undefined,
    className: cx(styles.input, multiline && styles.textarea),
  };
  return (
    <div className={styles.field}>
      <div className={styles.labelRow}>
        <label htmlFor={id} className={cx(styles.label, "type-control")}>
          {label}
          {optional && (
            <span id={hintId} className={cx(styles.optionalMark, "type-small")}>
              {" "}
              {optional}
            </span>
          )}
        </label>
      </div>
      {multiline ? (
        <textarea {...common} rows={3} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input {...common} {...rest} onChange={(e) => onChange(e.target.value)} />
      )}
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  );
}
