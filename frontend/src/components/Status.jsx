import { Empty } from './ui';

/** Shared loading (skeleton) / error / empty states for list and detail pages. */
export default function Status({ status, error, empty, children, skeletons = 3 }) {
  if (status === 'loading' || status === 'idle') {
    return (
      <div aria-busy="true" aria-label="Loading">
        {Array.from({ length: skeletons }, (_, i) => <div key={i} className="skeleton" />)}
      </div>
    );
  }
  if (status === 'failed') return <p role="alert" className="error">{error || 'The data could not be loaded. Check your connection and reload the page.'}</p>;
  if (empty) return <Empty>{empty}</Empty>;
  return children;
}
