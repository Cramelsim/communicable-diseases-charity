import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Status from '../components/Status';
import { Bar, PageHead, fmt } from '../components/ui';
import { diseases } from '../features/diseases/diseasesSlice';

export default function Diseases() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((s) => s.diseases);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const t = setTimeout(() => dispatch(diseases.fetchList({ search })), 250);
    return () => clearTimeout(t);
  }, [dispatch, search]);

  const max = items[0]?.total_cases || 0;

  return (
    <section>
      <PageHead title="Most prevalent communicable diseases">
        Ranked by total reported cases across all affected areas. Select a disease to learn how it spreads and how to prevent it.
      </PageHead>
      <input
        type="search"
        placeholder="Search diseases"
        aria-label="Search diseases"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Status status={status} error={error} empty={status === 'succeeded' && !items.length && 'No diseases match your search.'}>
        <ol className="ledger">
          {items.map((d, i) => (
            <li key={d.id}>
              <Link to={`/diseases/${d.id}`} className={`ledger-row sev-${d.severity}`}>
                <span className="rank">#{i + 1}</span>
                <span className="ledger-main">
                  <span className="ledger-title">
                    <h3>{d.name}</h3>
                    <span className="sev">{d.severity} severity</span>
                  </span>
                  <Bar value={d.total_cases} max={max} tone="danger" />
                  <span className="ledger-meta">
                    <span>{fmt(d.total_cases)} reported cases</span>
                    <span>{d.areas_affected} areas</span>
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </Status>
    </section>
  );
}
