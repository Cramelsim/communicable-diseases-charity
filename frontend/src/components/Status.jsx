/** Shared loading / error / empty states for list and detail pages. */
export default function Status({ status, error, empty, children }) {
  if (status === 'loading') return <p aria-busy="true">Loading…</p>;
  if (status === 'failed') return <p role="alert" className="error">{error || 'Something went wrong.'}</p>;
  if (empty) return <p className="muted">{empty}</p>;
  return children;
}
