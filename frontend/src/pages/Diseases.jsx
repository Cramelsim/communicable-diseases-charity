import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Status from '../components/Status';
import { diseases } from '../features/diseases/diseasesSlice';

export default function Diseases() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((s) => s.diseases);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const t = setTimeout(() => dispatch(diseases.fetchList({ search })), 250);
    return () => clearTimeout(t);
  }, [dispatch, search]);

  return (
    <section>
      <h1>Most prevalent communicable diseases</h1>
      <input
        type="search"
        placeholder="Search diseases…"
        aria-label="Search diseases"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Status status={status} error={error} empty={status === 'succeeded' && !items.length && 'No diseases found.'}>
        <ul className="list">
          {items.map((d, i) => (
            <li key={d.id} className="card">
              <Link to={`/diseases/${d.id}`}>
                <span className="rank">#{i + 1}</span> <strong>{d.name}</strong>
              </Link>
              <span className={`badge ${d.severity}`}>{d.severity}</span>
              <p className="muted">
                {d.total_cases?.toLocaleString()} reported cases · {d.areas_affected} areas
              </p>
            </li>
          ))}
        </ul>
      </Status>
    </section>
  );
}
