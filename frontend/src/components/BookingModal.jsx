import { useState } from 'react';
import { CalendarDays, X } from 'lucide-react';

const localDate = new Date(Date.now() + 86400000); localDate.setMinutes(0, 0, 0);
const minDate = new Date(Date.now() + 60 * 60 * 1000);
const localInput = (date) => { const d = new Date(date.getTime() - date.getTimezoneOffset() * 60000); return d.toISOString().slice(0, 16); };
export default function BookingModal({ service, onClose, onSubmit }) {
  const [when, setWhen] = useState(localInput(localDate)); const [notes, setNotes] = useState(''); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  const submit = async (event) => { event.preventDefault(); setBusy(true); setError(''); try { await onSubmit({ serviceSlug: service.slug, startsAt: new Date(when).toISOString(), notes }); onClose(); } catch (issue) { setError(issue.message); } finally { setBusy(false); } };
  return <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}><section className="modal booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-title"><button className="modal-close" onClick={onClose} aria-label="Close"><X /></button><span className={`service-icon ${service.color}`}>{service.icon}</span><span className="eyebrow">MAKE IT OFFICIAL</span><h2 id="booking-title">Book {service.title}</h2><p>A {service.durationMinutes}-minute session with {service.tutor} · ${service.price}</p>
    <form onSubmit={submit}><label>Date and time<input type="datetime-local" value={when} min={localInput(minDate)} onChange={(e) => setWhen(e.target.value)} required /></label><label>What would you like to work on?<textarea value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={500} rows={3} placeholder="Share a topic, question, or goal (optional)" /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button primary full" disabled={busy}><CalendarDays size={16} /> {busy ? 'Booking…' : 'Confirm session'}</button><small className="modal-note">You can cancel from My sessions.</small></form></section></div>;
}
