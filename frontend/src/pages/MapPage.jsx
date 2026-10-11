import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import DiseaseMap from '../components/DiseaseMap';
import Status from '../components/Status';
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

  return (
    <section>
      <h1>Disease impact map</h1>
      <label>
        Filter by disease
        <select value={disease} onChange={onFilter}>
          <option value="">All diseases</option>
          {diseaseList.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </label>
      <Status status={status} error={error} empty={status === 'succeeded' && !markers.length && 'No data for this selection.'}>
        <DiseaseMap markers={markers} />
        <p className="muted">Larger, darker circles show areas with more reported cases.</p>
        <table className="table">
          <thead>
            <tr><th>Area</th><th>Cases</th><th>Per 100k</th></tr>
          </thead>
          <tbody>
            {markers.map((m) => (
              <tr key={m.area}>
                <td>{m.name}</td>
                <td>{m.total_cases.toLocaleString()}</td>
                <td>{m.cases_per_100k ?? '–'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Status>
    </section>
  );
}
