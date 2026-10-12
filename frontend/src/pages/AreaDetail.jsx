import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import ReviewSection from '../components/ReviewSection';
import Status from '../components/Status';
import { BarRow, StatTile, compact, fmt } from '../components/ui';
import { areas } from '../features/areas/areasSlice';

export default function AreaDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current: a, status, error } = useSelector((s) => s.areas);

  useEffect(() => {
    dispatch(areas.fetchOne(id));
  }, [dispatch, id]);

  return (
    <Status status={status} error={error} skeletons={1}>
      {a && (() => {
        const diseases = [...a.diseases].sort((x, y) => y.cases - x.cases);
        const deaths = diseases.reduce((n, d) => n + d.deaths, 0);
        return (
          <article>
            <Link to="/areas" className="back">All areas</Link>
            <div className="banner">
              <span className="sev">{a.country}</span>
              <h1>{a.name}</h1>
              {a.description && <p>{a.description}</p>}
              <div className="actions">
                <Link className="btn" to={`/donate?area=${a.id}`}>Donate to {a.name}</Link>
                <Link className="btn secondary" to={`/map?area=${a.id}`}>View on map</Link>
              </div>
            </div>

            <div className="stats">
              <StatTile label="Population" value={compact(a.population)} sub={fmt(a.population)} />
              <StatTile label="Total cases" value={compact(a.total_cases)} tone="danger" sub={a.population ? `${Math.round((a.total_cases * 100000) / a.population).toLocaleString()} per 100k` : undefined} />
              <StatTile label="Deaths" value={fmt(deaths)} />
              <StatTile label="Diseases" value={a.diseases_count} />
            </div>

            <h2>Diseases in this area</h2>
            <div className="ruled">
              {diseases.map((d) => (
                <BarRow
                  key={d.disease}
                  label={<Link to={`/diseases/${d.disease}`}>{d.disease_name}</Link>}
                  value={d.cases}
                  max={diseases[0].cases}
                  valueLabel={`${fmt(d.cases)} cases, ${fmt(d.deaths)} deaths`}
                  tone="danger"
                />
              ))}
            </div>

            <ReviewSection areaId={a.id} diseaseOptions={a.diseases} />
          </article>
        );
      })()}
    </Status>
  );
}
