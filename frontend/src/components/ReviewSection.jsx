import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Empty } from './ui';
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
        <form className="card form narrow" onSubmit={onSubmit}>
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
          <li key={r.id} className="card review">
            <div className="review-head">
              <span className="avatar" aria-hidden="true">{r.username[0].toUpperCase()}</span>
              <div>
                <strong>{r.username}</strong>
                <div className="muted">on {r.disease_name} · {new Date(r.created_at).toLocaleDateString()}</div>
              </div>
              {r.rating && <span className="badge">priority {r.rating}/5</span>}
            </div>
            <p>{r.comment}</p>
          </li>
        ))}
        {!items.length && <li><Empty icon="💡">No ideas shared yet. Be the first!</Empty></li>}
      </ul>
    </section>
  );
}
