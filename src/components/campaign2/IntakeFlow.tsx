"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ChevronChip } from "@/components/ui/ChevronChip";
import { campaign } from "@/content/campaign2";
import { demoMode } from "@/content/demoMode";
import { cx } from "@/lib/cx";
import { emptyValues, validate, type Field, type Values } from "./intake";
import styles from "./Intake.module.css";

// moci-web: the landing's free-site request (owner's copy, 29 Sep 2026), in the campaign form's panel and styles.
// Essentials on the left, the rest on the right on desktop, the button across the foot. A local demo: sending never
// leaves the browser — it validates, waits a moment and shows the confirmation, and every step says "Demo".
// No database, no alerts, no payment, no tracking.

type Step = "form" | "done";

const { form, done } = campaign;

const FIELD_ID: Record<Field, string> = {
  business: "f-business",
  services: "f-services",
  phone: "f-phone",
};

export function IntakeFlow() {
  const [values, setValues] = useState<Values>(emptyValues);
  const [step, setStep] = useState<Step>("form");
  const [attempted, setAttempted] = useState(false);
  const [busy, setBusy] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const moved = useRef(false);

  const errors = validate(values);
  const shown = attempted ? errors : {};
  const set = <K extends keyof Values>(key: K, value: Values[K]) => setValues((v) => ({ ...v, [key]: value }));

  // After each step change the new step's heading (or the first field) takes focus. Past the form the page drops the
  // form's headline and art (Campaign.module.css reads html[data-flow-step]), then scrolls the panel into view.
  useEffect(() => {
    document.documentElement.dataset.flowStep = step;
    if (!moved.current) return;
    const target = step === "form" ? document.getElementById(FIELD_ID.business) : heading.current;
    panel.current?.scrollIntoView({ block: "start" });
    target?.focus({ preventScroll: true });
  }, [step]);

  useEffect(
    () => () => {
      delete document.documentElement.dataset.flowStep;
    },
    [],
  );

  const go = (next: Step) => {
    moved.current = true;
    setStep(next);
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
    // Demo only: nothing is sent. A short pause, so the sending state can be reviewed.
    setBusy(true);
    await new Promise((resolve) => setTimeout(resolve, 350));
    setBusy(false);
    go("done");
  };

  return (
    <div ref={panel} className={styles.panel}>
      {step === "form" && (
        <form className={styles.form} onSubmit={submit} noValidate>
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
              <span>{busy ? form.sending : form.submit}</span>
              <ChevronChip />
            </button>
            <div className={styles.submitNotes}>
              <p className={cx(styles.steps, "type-small")}>{form.steps}</p>
              <p className={cx(styles.previewNote, "type-small")}>{form.free}</p>
            </div>
            <p className={cx(styles.previewStamp, styles.submitStamp, "type-meta")}>{demoMode.form}</p>
          </div>
        </form>
      )}

      {step === "done" && (
        <div className={styles.result}>
          <h3 ref={heading} tabIndex={-1} data-flow-heading className="type-h3">
            {done.title}
          </h3>
          <p role="status" className={cx(styles.resultText, "type-body")}>
            {done.text(values.phone.trim())}
          </p>
          <p className={cx(styles.previewStamp, "type-meta")}>{demoMode.result}</p>
          <button type="button" className={cx(styles.edit, "type-control")} onClick={() => go("form")}>
            ← {done.edit}
          </button>
        </div>
      )}
    </div>
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
