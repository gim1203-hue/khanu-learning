import { ArrowUpRight, Clock3, Star } from 'lucide-react';

export default function ServiceCard({ service, onBook, recommended = false, reasons = [] }) {
  return <article className={`service-card ${service.color || 'lilac'} ${recommended ? 'recommended' : ''}`}>
    <div className="service-card-top"><span className="service-icon">{service.icon}</span><span className="service-category">{service.category}</span></div>
    <h3>{service.title}</h3><p className="service-description">{service.description}</p>
    <div className="service-tutor"><span className="tutor-avatar">{service.tutor.split(' ').map((part) => part[0]).join('')}</span><span><b>{service.tutor}</b><small>{service.level}</small></span><span className="rating"><Star size={13} fill="currentColor" /> {service.rating}</span></div>
    {reasons.length > 0 && <div className="match-reasons">{reasons.map((reason) => <span key={reason}>{reason}</span>)}</div>}
    <div className="service-footer"><span><Clock3 size={14} /> {service.durationMinutes} min <i /> ${service.price}</span><button onClick={() => onBook(service)} aria-label={`Book ${service.title}`}>Book a session <ArrowUpRight size={15} /></button></div>
  </article>;
}
