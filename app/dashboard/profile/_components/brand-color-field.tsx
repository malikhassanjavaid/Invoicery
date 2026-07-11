"use client";

const PRESETS = ["#4f46e5", "#1a1a2e", "#1f6f56", "#2563eb", "#db2777", "#ea580c", "#0d9488"];

export function BrandColorField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const color = value ?? "";

  return (
    <div className="grid gap-2 md:col-span-2">
      <span className="text-sm font-semibold text-[var(--dash-text)]">Invoice color</span>

      {/* Persists with the form's Server Action */}
      <input type="hidden" name="brandColor" value={color} />

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          {PRESETS.map((preset) => {
            const active = color.toLowerCase() === preset.toLowerCase();
            return (
              <button
                key={preset}
                type="button"
                onClick={() => onChange(preset)}
                aria-label={`Use ${preset}`}
                className={`size-8 rounded-full transition ${
                  active ? "ring-2 ring-[var(--dash-text)] ring-offset-2 ring-offset-[var(--dash-panel)]" : ""
                }`}
                style={{ backgroundColor: preset }}
              />
            );
          })}
        </div>

        <label className="flex items-center gap-2 rounded-xl border border-[var(--dash-border)] px-3 py-2">
          <input
            type="color"
            value={color}
            onChange={(event) => onChange(event.target.value)}
            aria-label="Custom color"
            className="size-6 cursor-pointer rounded border-0 bg-transparent p-0"
          />
          <span className="text-sm font-medium uppercase text-[var(--dash-subtle)]">{color}</span>
        </label>
      </div>

      <p className="text-xs text-[var(--dash-muted)]">Used as the accent color on your invoices.</p>
    </div>
  );
}
