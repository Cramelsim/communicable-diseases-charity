import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { reviews } from '../features/reviews/reviewsSlice';
import { selectUser } from '../features/auth/authSlice';

/** Lists community reviews for an area and lets signed-in users share how they'd like to help. */
export default function ReviewSection({ areaId, diseaseOptions }) {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { items, error } = useSelector((s) => s.reviews);
  const [form, setForm] = useState({ disease: '', comment: '', rating: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(reviews.fetchList({ area: areaId }));
  }, [dispatch, areaId]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const body = { area: Number(areaId), disease: Number(form.disease), comment: form.comment };
    if (form.rating) body.rating = Number(form.rating);
    const result = await dispatch(reviews.create(body));
    setSubmitting(false);
    if (reviews.create.fulfilled.match(result)) setForm({ disease: '', comment: '', rating: '' });
  };

  return (
    <section>
      <h2>How would you like to help?</h2>
      {user ? (
        <form className="card form" onSubmit={onSubmit}>
          {error && <p role="alert" className="error">{error}</p>}
          <label>
            Disease
            <select name="disease" value={form.disease} onChange={onChange} required>
              <option value="">Select a disease</option>
              {diseaseOptions.map((d) => (
                <option key={d.disease} value={d.disease}>{d.disease_name}</option>
              ))}
            </select>
          </label>
          <label>
            Your idea
            <textarea name="comment" value={form.comment} onChange={onChange} required rows={3} />
          </label>
          <label>
            Priority (1–5, optional)
            <input name="rating" type="number" min="1" max="5" value={form.rating} onChange={onChange} />
          </label>
          <button className="btn" disabled={submitting}>Share</button>
        </form>
      ) : (
        <p><Link to="/login">Log in</Link> to share how you would like to help.</p>
      )}
      <ul className="list">
        {items.map((r) => (
          <li key={r.id} className="card">
            <strong>{r.username}</strong> on {r.disease_name}
            {r.rating && <span className="badge">priority {r.rating}/5</span>}
            <p>{r.comment}</p>
          </li>
        ))}
        {!items.length && <li className="muted">No ideas shared yet. Be the first!</li>}
      </ul>
    </section>
  );
}
