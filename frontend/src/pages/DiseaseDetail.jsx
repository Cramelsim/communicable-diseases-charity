import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import Status from '../components/Status';
import { BarRow, StatTile, fmt } from '../components/ui';
import { diseases } from '../features/diseases/diseasesSlice';

const SECTIONS = [
  ['symptoms', 'Symptoms'],
  ['transmission', 'How it spreads'],
  ['prevention', 'Prevention'],
  ['treatment', 'Treatment'],
];

const pct = (a, b) => (b ? `${((a / b) * 100).toFixed(1)}%` : '–');

export default function DiseaseDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current: d, status, error } = useSelector((s) => s.diseases);

  useEffect(() => {
    dispatch(diseases.fetchOne(id));
  }, [dispatch, id]);

  return (
    <Status status={status} error={error} skeletons={1}>
      {d && (() => {
        const deaths = d.areas.reduce((n, a) => n + a.deaths, 0);
        const recovered = d.areas.reduce((n, a) => n + a.recovered, 0);
        const areas = [...d.areas].sort((a, b) => b.cases - a.cases);
        return (
          <article>
            <Link to="/diseases" className="back">All diseases</Link>
            <div className={`banner sev-${d.severity}`}>
              <span className="sev">{d.severity} severity</span>
              <h1>{d.name}</h1>
              <p>{d.description}</p>
              <div className="actions">
                <Link className="btn" to={`/map?disease=${d.id}`}>View on map</Link>
                <Link className="btn secondary" to="/donate">Donate to an area</Link>
              </div>
            </div>

            <div className="stats">
              <StatTile label="Reported cases" value={fmt(d.total_cases)} tone="danger" />
              <StatTile label="Areas affected" value={d.areas_affected} />
              <StatTile label="Fatality rate" value={pct(deaths, d.total_cases)} sub={`${fmt(deaths)} deaths`} />
              <StatTile label="Recovery rate" value={pct(recovered, d.total_cases)} sub={`${fmt(recovered)} recovered`} tone="good" />
            </div>

            <div className="facts">
              {SECTIONS.map(([key, label]) => d[key] && (
                <section key={key}>
                  <h3>{label}</h3>
                  <p>{d[key]}</p>
                </section>
              ))}
            </div>

            <h2>Most affected areas</h2>
            <div className="ruled">
              {areas.map((a) => (
                <BarRow
                  key={a.area}
                  label={<Link to={`/areas/${a.area}`}>{a.area_name}</Link>}
                  value={a.cases}
                  max={areas[0].cases}
                  valueLabel={`${fmt(a.cases)} cases, ${fmt(a.deaths)} deaths`}
                  tone="danger"
                />
              ))}
              {!areas.length && <p className="muted">No reported cases yet.</p>}
            </div>
          </article>
        );
      })()}
    </Status>
  );
}
