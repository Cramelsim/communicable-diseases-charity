import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import ReviewSection from '../components/ReviewSection';
import Status from '../components/Status';
import { areas } from '../features/areas/areasSlice';

export default function AreaDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current: a, status, error } = useSelector((s) => s.areas);

  useEffect(() => {
    dispatch(areas.fetchOne(id));
  }, [dispatch, id]);

  return (
    <Status status={status} error={error}>
      {a && (
        <article>
          <h1>{a.name}, {a.country}</h1>
          <p>{a.description}</p>
          <p className="muted">
            Population {a.population.toLocaleString()} · {a.total_cases.toLocaleString()} total cases
          </p>
          <h2>Diseases in this area</h2>
          <ul className="list">
            {[...a.diseases].sort((x, y) => y.cases - x.cases).map((d) => (
              <li key={d.disease} className="card">
                <Link to={`/diseases/${d.disease}`}>{d.disease_name}</Link>
                <p className="muted">{d.cases.toLocaleString()} cases · {d.deaths.toLocaleString()} deaths · {d.recovered.toLocaleString()} recovered</p>
              </li>
            ))}
          </ul>
          <div className="actions">
            <Link className="btn" to={`/map?area=${a.id}`}>View on map</Link>
            <Link className="btn secondary" to={`/donate?area=${a.id}`}>Donate</Link>
          </div>
          <ReviewSection areaId={a.id} diseaseOptions={a.diseases} />
        </article>
      )}
    </Status>
  );
}
