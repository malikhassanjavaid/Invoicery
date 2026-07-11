import { Fragment } from "react";

const STEPS = [
  { n: 1, label: "Company profile", desc: "Your business details" },
  { n: 2, label: "First client", desc: "Someone to invoice" },
  { n: 3, label: "Start invoicing", desc: "You're ready to bill" },
];

export function OnboardingSteps({ current }: { current: 1 | 2 | 3 }) {
  return (
    <div className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-5 sm:p-6">
      <ol className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-3">
        {STEPS.map((step, index) => {
          const done = step.n < current;
          const active = step.n === current;
          return (
            <Fragment key={step.n}>
              <li className="flex items-center gap-3">
                <span
                  className={`grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold ${
                    done
                      ? "bg-[var(--dash-primary)] text-[var(--dash-primary-text)]"
                      : active
                        ? "border-2 border-[var(--dash-primary)] bg-[var(--dash-panel)] text-[var(--dash-primary)]"
                        : "border-2 border-[var(--dash-border)] bg-[var(--dash-panel)] text-[var(--dash-muted)]"
                  }`}
                >
                  {done ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="size-4">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  ) : (
                    step.n
                  )}
                </span>
                <div className="min-w-0">
                  <p
                    className={`text-sm font-semibold ${
                      active || done ? "text-[var(--dash-text)]" : "text-[var(--dash-muted)]"
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-xs text-[var(--dash-muted)]">{step.desc}</p>
                </div>
              </li>
              {index < STEPS.length - 1 ? (
                <li aria-hidden className="hidden h-px flex-1 bg-[var(--dash-border)] sm:block" />
              ) : null}
            </Fragment>
          );
        })}
      </ol>
    </div>
  );
}
