import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { Booking } from '../models/Booking.js';
import { demoStore, useDatabase } from '../data.js';
import { getService } from '../services/catalog.js';

const createBookingSchema = z.object({ serviceSlug: z.string().min(1), startsAt: z.string().datetime(), notes: z.string().max(500).optional().default('') });

export async function listBookings(req, res) {
  const items = useDatabase()
    ? await Booking.find({ user: req.user._id }).sort({ startsAt: 1 }).lean()
    : demoStore.bookings.filter((booking) => booking.user === String(req.user._id)).sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt));
  res.json({ bookings: items });
}

export async function createBooking(req, res) {
  const parsed = createBookingSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message || 'Check the booking details.' });
  const service = await getService(parsed.data.serviceSlug);
  if (!service) return res.status(404).json({ error: 'That tutoring session could not be found.' });
  const startsAt = new Date(parsed.data.startsAt);
  if (startsAt <= new Date()) return res.status(400).json({ error: 'Choose a future appointment time.' });
  const booking = useDatabase()
    ? await Booking.create({ user: req.user._id, serviceSlug: service.slug, serviceTitle: service.title, tutor: service.tutor, startsAt, notes: parsed.data.notes })
    : { _id: randomUUID(), user: String(req.user._id), serviceSlug: service.slug, serviceTitle: service.title, tutor: service.tutor, startsAt, notes: parsed.data.notes, status: 'upcoming', createdAt: new Date() };
  if (!useDatabase()) demoStore.bookings.push(booking);
  res.status(201).json({ booking });
}

export async function cancelBooking(req, res) {
  const booking = useDatabase()
    ? await Booking.findOne({ _id: req.params.id, user: req.user._id })
    : demoStore.bookings.find((item) => item._id === req.params.id && item.user === String(req.user._id));
  if (!booking) return res.status(404).json({ error: 'Booking not found.' });
  if (booking.status === 'cancelled') return res.status(409).json({ error: 'This booking is already cancelled.' });
  booking.status = 'cancelled';
  if (useDatabase()) await booking.save();
  res.json({ booking });
}
