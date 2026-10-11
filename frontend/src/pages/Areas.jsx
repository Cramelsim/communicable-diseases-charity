import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Status from '../components/Status';
import { areas } from '../features/areas/areasSlice';

export default function Areas() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((s) => s.areas);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const t = setTimeout(() => dispatch(areas.fetchList({ search })), 250);
    return () => clearTimeout(t);
  }, [dispatch, search]);

  return (
    <section>
      <h1>Most affected areas</h1>
      <input type="search" placeholder="Search areas…" aria-label="Search areas" value={search} onChange={(e) => setSearch(e.target.value)} />
      <Status status={status} error={error} empty={status === 'succeeded' && !items.length && 'No areas found.'}>
        <ul className="list">
          {items.map((a, i) => (
            <li key={a.id} className="card">
              <Link to={`/areas/${a.id}`}>
                <span className="rank">#{i + 1}</span> <strong>{a.name}</strong>, {a.country}
              </Link>
              <p className="muted">
                {a.total_cases?.toLocaleString()} cases · {a.diseases_count} diseases
              </p>
            </li>
          ))}
        </ul>
      </Status>
    </section>
  );
}
