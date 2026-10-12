/** Small presentational building blocks shared across pages. */

export const fmt = (n) => Number(n ?? 0).toLocaleString();
export const compact = (n) => new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(Number(n ?? 0));

export function StatTile({ label, value, sub, tone }) {
  return (
    <div className={`stat ${tone || ''}`}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

/** Horizontal bar; `value` relative to `max`. */
export function Bar({ value, max, tone }) {
  const pct = max ? Math.max(2, Math.round((value / max) * 100)) : 0;
  return (
    <div className={`bar ${tone || ''}`} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
      <span style={{ width: `${pct}%` }} />
    </div>
  );
}

export function BarRow({ label, value, max, valueLabel, tone }) {
  return (
    <div className="bar-row">
      <span>{label}</span>
      <strong>{valueLabel ?? fmt(value)}</strong>
      <Bar value={value} max={max} tone={tone} />
    </div>
  );
}

export function PageHead({ title, children }) {
  return (
    <div className="page-head">
      <h1>{title}</h1>
      {children && <p>{children}</p>}
    </div>
  );
}

export function Empty({ children }) {
  return (
    <div className="empty">
      <p>{children}</p>
    </div>
  );
}
