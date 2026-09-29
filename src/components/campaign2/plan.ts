// moci-web: the two offers a request can be for, and the way the comparison table picks one for the form above it.
// The table's buttons send a window event; IntakeFlow listens, selects that plan and brings the form into view.

export type Plan = "free" | "premium";

/** Premium is the main offer: it comes first in the cards, the switch on the form and the table. */
export const PLANS: readonly Plan[] = ["premium", "free"];

export const CHOOSE_PLAN_EVENT = "moci:choose-plan";

export function choosePlan(plan: Plan) {
  window.dispatchEvent(new CustomEvent<Plan>(CHOOSE_PLAN_EVENT, { detail: plan }));
}
