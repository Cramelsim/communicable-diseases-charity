import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Status from '../components/Status';
import { Bar, PageHead, fmt } from '../components/ui';
import { areas } from '../features/areas/areasSlice';

export default function Areas() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((s) => s.areas);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const t = setTimeout(() => dispatch(areas.fetchList({ search })), 250);
    return () => clearTimeout(t);
  }, [dispatch, search]);

  const max = items[0]?.total_cases || 0;

  return (
    <section>
      <PageHead title="Most affected areas">
        Communities ranked by total reported cases. Open an area to see its diseases, share ideas and donate.
      </PageHead>
      <input type="search" placeholder="Search areas…" aria-label="Search areas" value={search} onChange={(e) => setSearch(e.target.value)} />
      <Status status={status} error={error} empty={status === 'succeeded' && !items.length && 'No areas match your search.'}>
        <div className="grid cards" style={{ marginTop: '1rem' }}>
          {items.map((a, i) => (
            <Link key={a.id} to={`/areas/${a.id}`} className="card entity">
              <div className="entity-top">
                <span className="rank">#{i + 1}</span>
                <h3>{a.name}</h3>
                <span className="badge">{a.country}</span>
              </div>
              <Bar value={a.total_cases} max={max} />
              <div className="entity-meta">
                <span>{fmt(a.total_cases)} cases</span>
                <span>{a.diseases_count} diseases</span>
              </div>
            </Link>
          ))}
        </div>
      </Status>
    </section>
  );
}
