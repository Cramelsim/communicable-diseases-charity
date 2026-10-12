import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Status from './Status';

/**
 * Generic admin CRUD screen.
 * fields: [{ name, label, type?, options?, required?, multiline? }]
 */
export default function CrudManager({ title, noun, selector, thunks, fields, columns, empty }) {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector(selector);
  const [editing, setEditing] = useState(null); // null | 'new' | item
  const [form, setForm] = useState({});
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    dispatch(thunks.fetchList());
  }, [dispatch, thunks]);

  const open = (item) => {
    setEditing(item || 'new');
    setFormError(null);
    setForm(item ? Object.fromEntries(fields.map((f) => [f.name, item[f.name] ?? ''])) : empty);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const body = Object.fromEntries(Object.entries(form).filter(([k, v]) => !(editing !== 'new' && k === 'password' && v === '')));
    const action = editing === 'new' ? thunks.create(body) : thunks.update({ id: editing.id, ...body });
    const result = await dispatch(action);
    if (result.error) setFormError(result.payload || result.error.message);
    else setEditing(null);
  };

  const onDelete = (item) => {
    if (window.confirm(`Delete this ${noun}?`)) dispatch(thunks.remove(item.id));
  };

  return (
    <section>
      <div className="section-head">
        <h1>{title}</h1>
        <button className="btn" onClick={() => open(null)}>Add {noun}</button>
      </div>

      {editing && (
        <form className="panel form narrow" onSubmit={onSubmit} aria-label={`${editing === 'new' ? 'New' : 'Edit'} ${noun}`}>
          <h2>{editing === 'new' ? `New ${noun}` : `Edit ${noun}`}</h2>
          {formError && <p role="alert" className="error">{formError}</p>}
          {fields.map((f) => (
            <label key={f.name}>
              {f.label}
              {f.options ? (
                <select name={f.name} value={form[f.name] ?? ''} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}>
                  {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : f.multiline ? (
                <textarea name={f.name} rows={3} value={form[f.name] ?? ''} required={f.required} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} />
              ) : (
                <input
                  name={f.name}
                  type={f.type || 'text'}
                  step={f.type === 'number' ? 'any' : undefined}
                  value={form[f.name] ?? ''}
                  required={f.required && !(f.name === 'password' && editing !== 'new')}
                  onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                />
              )}
            </label>
          ))}
          <div className="actions">
            <button className="btn">Save</button>
            <button type="button" className="btn secondary" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </form>
      )}

      <Status status={status} error={error} empty={status === 'succeeded' && !items.length && `No ${noun}s yet.`}>
        <ul className="list">
          {items.map((item) => (
            <li key={item.id} className="row">
              <div>{columns(item)}</div>
              <div className="actions">
                <button className="btn small" onClick={() => open(item)}>Edit</button>
                <button className="btn small danger" onClick={() => onDelete(item)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </Status>
    </section>
  );
}
