import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { areas } from '../features/areas/areasSlice';
import { diseases } from '../features/diseases/diseasesSlice';
import { fetchTotals } from '../features/donations/donationsSlice';
import { selectUser } from '../features/auth/authSlice';
import { BarRow, StatTile, compact, fmt } from '../components/ui';

const STEPS = [
  ['Read about a disease', 'how it spreads, how to prevent it, and which areas report the most cases.'],
  ['Compare areas on the map', 'by reported cases and by cases per 100,000 people.'],
  ['Share an idea or donate', 'to a specific area, with the gift recorded in that area\'s totals.'],
];

export default function Home() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const diseaseList = useSelector((s) => s.diseases.items);
  const areaList = useSelector((s) => s.areas.items);
  const totals = useSelector((s) => s.donations.totals);

  useEffect(() => {
    dispatch(diseases.fetchList());
    dispatch(areas.fetchList());
    dispatch(fetchTotals());
  }, [dispatch]);

  const totalCases = diseaseList.reduce((n, d) => n + (d.total_cases || 0), 0);
  const raised = totals.reduce((n, t) => n + Number(t.total || 0), 0);
  const topDiseases = diseaseList.slice(0, 5);
  const topAreas = areaList.slice(0, 5);

  return (
    <>
      <section className="hero">
        <h1>Reported cases of communicable diseases, by disease and by area</h1>
        <p>
          Health Aid collects case counts from affected communities, ranks diseases and areas by burden,
          and lets you donate to the area you choose.
        </p>
        <div className="actions">
          <Link className="btn" to={user ? '/donate' : '/register'}>{user ? 'Donate' : 'Create account'}</Link>
          <Link className="btn secondary" to="/map">Open the map</Link>
        </div>
      </section>

      <div className="stats" role="group" aria-label="Key figures">
        <StatTile label="Diseases tracked" value={diseaseList.length} />
        <StatTile label="Areas affected" value={areaList.length} />
        <StatTile label="Reported cases" value={compact(totalCases)} tone="danger" sub={`${fmt(totalCases)} in total`} />
        <StatTile label="Donations received" value={`$${fmt(raised)}`} tone="good" sub={`${totals.reduce((n, t) => n + t.donations, 0)} donations`} />
      </div>

      <div className="split">
        <section>
          <div className="section-head"><h2>Most prevalent diseases</h2><Link to="/diseases">All diseases</Link></div>
          <div className="ruled">
            {topDiseases.map((d) => (
              <BarRow key={d.id} label={<Link to={`/diseases/${d.id}`}>{d.name}</Link>} value={d.total_cases} max={topDiseases[0].total_cases} tone="danger" />
            ))}
          </div>
        </section>
        <section>
          <div className="section-head"><h2>Most affected areas</h2><Link to="/areas">All areas</Link></div>
          <div className="ruled">
            {topAreas.map((a) => (
              <BarRow key={a.id} label={<Link to={`/areas/${a.id}`}>{a.name}, {a.country}</Link>} value={a.total_cases} max={topAreas[0].total_cases} />
            ))}
          </div>
        </section>
      </div>

      <h2>Using the site</h2>
      <ol className="how">
        {STEPS.map(([title, text]) => (
          <li key={title}><strong>{title}</strong>: {text}</li>
        ))}
      </ol>
    </>
  );
}
