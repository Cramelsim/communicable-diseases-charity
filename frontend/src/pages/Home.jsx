import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { areas } from '../features/areas/areasSlice';
import { diseases } from '../features/diseases/diseasesSlice';
import { fetchTotals } from '../features/donations/donationsSlice';
import { selectUser } from '../features/auth/authSlice';
import { BarRow, StatTile, compact, fmt } from '../components/ui';

const STEPS = [
  ['1', 'Understand', 'Learn how each disease spreads, how to prevent it and where it is hitting hardest.'],
  ['2', 'Explore', 'Use the impact map to compare areas by reported cases and cases per 100,000 people.'],
  ['3', 'Act', 'Share ideas for how to help, or donate directly to an affected area.'],
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
        <span className="eyebrow">Communicable disease prevention</span>
        <h1>Stop preventable diseases, one community at a time.</h1>
        <p>
          Explore real-time case data, see which areas need help the most, and fund the response —
          all in one place, built to work on any phone.
        </p>
        <div className="actions">
          <Link className="btn accent" to={user ? '/donate' : '/register'}>{user ? 'Donate now' : 'Join the effort'}</Link>
          <Link className="btn ghost-light" to="/map">Explore the map</Link>
        </div>
      </section>

      <div className="stats" aria-label="Key figures">
        <StatTile label="Diseases tracked" value={diseaseList.length} />
        <StatTile label="Areas affected" value={areaList.length} />
        <StatTile label="Reported cases" value={compact(totalCases)} tone="danger" sub={`${fmt(totalCases)} in total`} />
        <StatTile label="Raised so far" value={`$${fmt(raised)}`} tone="good" sub={`${totals.reduce((n, t) => n + t.donations, 0)} donations`} />
      </div>

      <div className="split">
        <section>
          <div className="section-head"><h2>Most prevalent diseases</h2><Link to="/diseases">See all →</Link></div>
          <div className="card">
            {topDiseases.map((d) => (
              <BarRow key={d.id} label={<Link to={`/diseases/${d.id}`}>{d.name}</Link>} value={d.total_cases} max={topDiseases[0].total_cases} tone="danger" />
            ))}
          </div>
        </section>
        <section>
          <div className="section-head"><h2>Hardest-hit areas</h2><Link to="/areas">See all →</Link></div>
          <div className="card">
            {topAreas.map((a) => (
              <BarRow key={a.id} label={<Link to={`/areas/${a.id}`}>{a.name}, {a.country}</Link>} value={a.total_cases} max={topAreas[0].total_cases} />
            ))}
          </div>
        </section>
      </div>

      <h2>How it works</h2>
      <div className="steps">
        {STEPS.map(([n, title, text]) => (
          <div key={n} className="card">
            <div className="step-num">{n}</div>
            <h3>{title}</h3>
            <p className="muted">{text}</p>
          </div>
        ))}
      </div>
    </>
  );
}
