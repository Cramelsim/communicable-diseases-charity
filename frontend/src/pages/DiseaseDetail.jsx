import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import Status from '../components/Status';
import { diseases } from '../features/diseases/diseasesSlice';

const SECTIONS = [
  ['symptoms', 'Symptoms'],
  ['transmission', 'How it spreads'],
  ['prevention', 'Prevention'],
  ['treatment', 'Treatment'],
];

export default function DiseaseDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current: d, status, error } = useSelector((s) => s.diseases);

  useEffect(() => {
    dispatch(diseases.fetchOne(id));
  }, [dispatch, id]);

  return (
    <Status status={status} error={error}>
      {d && (
        <article>
          <h1>{d.name}</h1>
          <span className={`badge ${d.severity}`}>{d.severity}</span>
          <p>{d.description}</p>
          {SECTIONS.map(([key, label]) => d[key] && (
            <section key={key}>
              <h2>{label}</h2>
              <p>{d[key]}</p>
            </section>
          ))}
          <h2>Most affected areas</h2>
          <ul className="list">
            {[...d.areas].sort((a, b) => b.cases - a.cases).map((a) => (
              <li key={a.area} className="card">
                <Link to={`/areas/${a.area}`}>{a.area_name}</Link>
                <p className="muted">{a.cases.toLocaleString()} cases · {a.deaths.toLocaleString()} deaths · {a.recovered.toLocaleString()} recovered</p>
              </li>
            ))}
          </ul>
          <Link className="btn" to={`/map?disease=${d.id}`}>View on map</Link>
        </article>
      )}
    </Status>
  );
}
