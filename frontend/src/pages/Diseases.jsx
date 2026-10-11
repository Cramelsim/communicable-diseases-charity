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
        placeholder="Search diseases…"
        aria-label="Search diseases"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Status status={status} error={error} empty={status === 'succeeded' && !items.length && 'No diseases match your search.'}>
        <div className="grid cards" style={{ marginTop: '1rem' }}>
          {items.map((d, i) => (
            <Link key={d.id} to={`/diseases/${d.id}`} className={`card entity sev-${d.severity}`}>
              <div className="entity-top">
                <span className="rank">#{i + 1}</span>
                <h3>{d.name}</h3>
                <span className={`badge ${d.severity}`}>{d.severity}</span>
              </div>
              <Bar value={d.total_cases} max={max} tone="danger" />
              <div className="entity-meta">
                <span>{fmt(d.total_cases)} reported cases</span>
                <span>{d.areas_affected} areas</span>
              </div>
            </Link>
          ))}
        </div>
      </Status>
    </section>
  );
}
