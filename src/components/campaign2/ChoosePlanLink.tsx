"use client";

import { ChevronChip } from "@/components/ui/ChevronChip";
import { campaign } from "@/content/campaign2";
import { cx } from "@/lib/cx";
import styles from "./Campaign.module.css";
import { choosePlan, type Plan } from "./plan";
import { START_ID } from "./StartLink";

/** A button in the comparison table's foot: selects its plan in the form above and takes the visitor there. Without
 *  script it is a plain anchor to the form. "Alege" on phones (the plan's name for screen readers), "Alege Premium"
 *  from 768px. */
export function ChoosePlanLink({ plan }: { plan: Plan }) {
  return (
    <a
      href={`#${START_ID}`}
      className={cx(styles.choosePlan, plan === "premium" && styles.choosePlanPremium, "type-control")}
      onClick={(event) => {
        event.preventDefault();
        choosePlan(plan);
        history.replaceState(null, "", `#${START_ID}`);
      }}
    >
      <span>
        {campaign.compare.choose}
        <span className={styles.choosePlanName}> {campaign.plans[plan].name}</span>
      </span>
      <ChevronChip className={styles.choosePlanChevron} />
    </a>
  );
}
