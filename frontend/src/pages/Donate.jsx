import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { areas } from '../features/areas/areasSlice';
import { diseases } from '../features/diseases/diseasesSlice';
import { Empty, PageHead } from '../components/ui';
import { donate, fetchMyDonations, resetDonation } from '../features/donations/donationsSlice';

const PRESETS = [5, 10, 25, 50];

export default function Donate() {
  const dispatch = useDispatch();
  const [params] = useSearchParams();
  const areaList = useSelector((s) => s.areas.items);
  const diseaseList = useSelector((s) => s.diseases.items);
  const { mine, status, error, lastDonation } = useSelector((s) => s.donations);
  const [form, setForm] = useState({ area: params.get('area') || '', disease: '', amount: '10', message: '', anonymous: false });

  const selectedArea = areaList.find((a) => String(a.id) === String(form.area));

  useEffect(() => {
    dispatch(resetDonation());
    dispatch(areas.fetchList());
    dispatch(diseases.fetchList());
    dispatch(fetchMyDonations());
  }, [dispatch]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };
  const onSubmit = (e) => {
    e.preventDefault();
    const body = { ...form, area: Number(form.area), disease: form.disease ? Number(form.disease) : null };
    dispatch(donate(body));
  };

  return (
    <section>
      <PageHead title="Donate to an affected area">
        Choose where your gift goes. Every donation is recorded and shown in the area's totals.
      </PageHead>
      {lastDonation && (
        <p role="status" className="success">
          Your donation of {lastDonation.amount} {lastDonation.currency} to {lastDonation.area_name} was recorded. Thank you.
        </p>
      )}
      <div className="split">
      <form className="panel form" onSubmit={onSubmit}>
        {error && <p role="alert" className="error">{error}</p>}
        <label>
          Area
          <select name="area" value={form.area} onChange={onChange} required>
            <option value="">Select an area</option>
            {areaList.map((a) => (
              <option key={a.id} value={a.id}>{a.name}, {a.country}</option>
            ))}
          </select>
        </label>
        <label>
          Earmark for a disease (optional)
          <select name="disease" value={form.disease} onChange={onChange}>
            <option value="">Wherever it is needed most</option>
            {diseaseList.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </label>
        <div className="chips" role="group" aria-label="Preset amounts">
          {PRESETS.map((p) => (
            <button type="button" key={p} className={`chip ${form.amount === String(p) ? 'active' : ''}`} onClick={() => setForm({ ...form, amount: String(p) })}>
              ${p}
            </button>
          ))}
        </div>
        <label>
          Amount (USD)
          <div className="amount-input">
            <span>$</span>
            <input name="amount" type="number" min="1" step="0.01" value={form.amount} onChange={onChange} required />
          </div>
        </label>
        <label>
          Message (optional)
          <input name="message" maxLength={300} value={form.message} onChange={onChange} />
        </label>
        <label className="checkbox">
          <input name="anonymous" type="checkbox" checked={form.anonymous} onChange={onChange} /> Donate anonymously
        </label>
        <button className="btn" disabled={status === 'loading'}>{status === 'loading' ? 'Processing' : 'Donate'}</button>
      </form>
      <aside className="aside">
        <h3>Where your gift goes</h3>
        <div className="big-amount">${Number(form.amount || 0).toLocaleString()}</div>
        <p className="muted">{selectedArea ? `going to ${selectedArea.name}, ${selectedArea.country}` : 'Select an area to direct your gift.'}</p>
        <ul className="impact">
          <li>$10 can help provide insecticide-treated nets for a family</li>
          <li>$25 can fund safe water supplies and oral rehydration kits</li>
          <li>$50 can help vaccinate a community clinic day</li>
        </ul>
      </aside>
      </div>
      <h2>Your donations</h2>
      <ul className="list">
        {mine.map((d) => (
          <li key={d.id} className="row">
            <span><strong>${d.amount}</strong> to {d.area_name}{d.disease_name ? `, for ${d.disease_name}` : ''}</span>
            <span className="badge">{d.status}</span>
          </li>
        ))}
        {!mine.length && <li><Empty>You have not donated yet. Choose an area above and your gift will be listed here.</Empty></li>}
      </ul>
    </section>
  );
}
