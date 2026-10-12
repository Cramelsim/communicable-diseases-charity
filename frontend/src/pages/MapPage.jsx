import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import DiseaseMap from '../components/DiseaseMap';
import Status from '../components/Status';
import { Bar, PageHead, StatTile, compact, fmt } from '../components/ui';
import { diseases } from '../features/diseases/diseasesSlice';
import { fetchMap } from '../features/map/mapSlice';

export default function MapPage() {
  const dispatch = useDispatch();
  const [params, setParams] = useSearchParams();
  const disease = params.get('disease') || '';
  const area = params.get('area') || '';
  const { markers, status, error } = useSelector((s) => s.map);
  const diseaseList = useSelector((s) => s.diseases.items);

  useEffect(() => {
    dispatch(diseases.fetchList());
  }, [dispatch]);
  useEffect(() => {
    dispatch(fetchMap({ disease, area }));
  }, [dispatch, disease, area]);

  const onFilter = (e) => setParams(e.target.value ? { disease: e.target.value } : {});
  const totalCases = markers.reduce((n, m) => n + m.total_cases, 0);
  const totalDeaths = markers.reduce((n, m) => n + m.total_deaths, 0);
  const worst = [...markers].sort((a, b) => (b.cases_per_100k ?? 0) - (a.cases_per_100k ?? 0))[0];

  return (
    <section>
      <PageHead title="Disease impact map">
        Circle size and colour show reported cases. Select a circle for the breakdown by disease.
      </PageHead>
      <div className="toolbar">
        <label>
          Filter by disease
          <select value={disease} onChange={onFilter}>
            <option value="">All diseases</option>
            {diseaseList.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </label>
        {(disease || area) && <button className="btn secondary small" onClick={() => setParams({})}>Clear filters</button>}
      </div>
      <Status status={status} error={error} empty={status === 'succeeded' && !markers.length && 'No data for this selection.'} skeletons={1}>
        <div className="stats">
          <StatTile label="Areas shown" value={markers.length} />
          <StatTile label="Cases" value={compact(totalCases)} tone="danger" />
          <StatTile label="Deaths" value={fmt(totalDeaths)} />
          <StatTile label="Highest burden" value={worst?.name.split(',')[0] ?? 'None'} sub={worst?.cases_per_100k != null ? `${fmt(worst.cases_per_100k)} per 100k` : undefined} />
        </div>
        <DiseaseMap markers={markers} />
        <div className="legend" aria-label="Legend">
          <span><i style={{ background: '#d9a441' }} />Lower share of highest</span>
          <span><i style={{ background: '#c2562b' }} />Medium</span>
          <span><i style={{ background: '#8f2616' }} />Highest</span>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>Area</th><th className="num">Cases</th><th>Share of highest</th><th className="num">Per 100k</th></tr>
            </thead>
            <tbody>
              {markers.map((m) => (
                <tr key={m.area}>
                  <td><Link to={`/areas/${m.area}`}>{m.name}</Link></td>
                  <td className="num">{fmt(m.total_cases)}</td>
                  <td style={{ minWidth: 110 }}><Bar value={m.total_cases} max={markers[0].total_cases} tone="danger" /></td>
                  <td className="num">{m.cases_per_100k != null ? fmt(m.cases_per_100k) : 'None'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Status>
    </section>
  );
}
