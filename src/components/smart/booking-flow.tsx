"use client";

import * as React from "react";
import { AlertCircle, ArrowLeft, CalendarCheck, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBooking, type BookingState } from "@/app/b/[slug]/book/actions";
import { prettyTime, type BookableService, type Slot } from "@/lib/booking";
import { inr, cn } from "@/lib/utils";
import styles from "./booking-flow.module.css";

const initial: BookingState = { ok: false, message: null };

type DateOption = { date: string; label: string; weekday: string };

export function BookingFlow({
  slug,
  businessName,
  brandColor,
  services,
  dates,
  slotsByDate,
}: {
  slug: string;
  businessName: string;
  brandColor: string;
  services: BookableService[];
  dates: DateOption[];
  slotsByDate: Record<string, Slot[]>;
}) {
  const [service, setService] = React.useState<BookableService | null>(null);
  const [date, setDate] = React.useState<string>(dates[0]?.date ?? "");
  const [slot, setSlot] = React.useState<Slot | null>(null);
  const [state, action, pending] = React.useActionState(createBooking, initial);

  const slots = slotsByDate[date] ?? [];

  /* ------------------------------ confirmed ----------------------------- */
  if (state.ok && state.reference) {
    return (
      <div className={styles.confirmed} style={{ "--brand": brandColor } as React.CSSProperties}>
        <CheckCircle2 className={styles.confirmIcon} strokeWidth={1.5} />
        <h1 className={cn("display", styles.confirmTitle)}>You&apos;re booked</h1>
        <p className={styles.confirmDetail}>
          {service?.name} on {date} at {slot && prettyTime(slot.time)}
        </p>
        <p className={styles.reference}>
          {state.reference}
        </p>
        <p className={styles.confirmNote}>
          Keep this reference. {businessName} will call if anything needs to change.
        </p>
      </div>
    );
  }

  /* ------------------------------- details ------------------------------ */
  if (slot && service) {
    return (
      <form action={action}>
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="serviceId" value={service.id} />
        <input type="hidden" name="staffId" value={slot.staffId} />
        <input type="hidden" name="date" value={date} />
        <input type="hidden" name="time" value={slot.time} />

        <button
          type="button"
          onClick={() => setSlot(null)}
          className={styles.back}
        >
          <ArrowLeft className={styles.backIcon} /> Change time
        </button>

        <div className={styles.summary}>
          <p className={styles.summaryTitle}>{service.name}</p>
          <p className={styles.summaryLine}>
            {date} · {prettyTime(slot.time)} · {slot.staffName}
          </p>
          <p className={styles.summaryLine}>
            {service.duration} minutes{service.price ? ` · ${inr(service.price)}` : ""}
          </p>
        </div>

        <div className={styles.fields}>
          <div className={styles.field}>
            <Label htmlFor="name">Your name</Label>
            <Input id="name" name="name" required autoFocus placeholder="Kavya Suresh" />
          </div>
          <div className={styles.field}>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" type="tel" required placeholder="+91 98450 00000" />
          </div>
          <div className={styles.field}>
            <Label htmlFor="email">Email (for the confirmation)</Label>
            <Input id="email" name="email" type="email" placeholder="Optional" />
          </div>
          <div className={styles.field}>
            <Label htmlFor="notes">Anything we should know?</Label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              placeholder="Optional"
              className={styles.textarea}
            />
          </div>
        </div>

        {service.depositAmount && (
          <p className={styles.deposit}>
            This service needs a {inr(service.depositAmount)} deposit to hold the slot. We&apos;ll send
            a payment link after confirming.
          </p>
        )}

        {state.message && (
          <p className={styles.error}>
            <AlertCircle className={styles.errorIcon} />
            {state.message}
          </p>
        )}

        <Button type="submit" size="lg" disabled={pending} className={styles.submit}>
          {pending ? "Confirming…" : "Confirm booking"}
        </Button>
      </form>
    );
  }

  /* --------------------------- date and time ---------------------------- */
  if (service) {
    return (
      <div style={{ "--brand": brandColor } as React.CSSProperties}>
        <button
          type="button"
          onClick={() => setService(null)}
          className={styles.back}
        >
          <ArrowLeft className={styles.backIcon} /> Change service
        </button>

        <h2 className={cn("display", styles.serviceTitle)}>{service.name}</h2>
        <p className={styles.serviceMeta}>
          <Clock className={styles.metaIcon} /> {service.duration} minutes
          {service.price ? ` · ${inr(service.price)}` : ""}
        </p>

        <div className={cn("scroll-thin", styles.dates)}>
          {dates.map((d) => (
            <button
              key={d.date}
              onClick={() => { setDate(d.date); setSlot(null); }}
              className={cn(
                styles.date,
                date === d.date ? styles.dateSelected : styles.dateIdle
              )}
            >
              <span className={styles.weekday}>{d.weekday}</span>
              <span className={styles.dateLabel}>{d.label}</span>
            </button>
          ))}
        </div>

        <div className={styles.slots}>
          {slots.length === 0 ? (
            <p className={styles.noSlots}>
              Nothing free on this day. Try another date.
            </p>
          ) : (
            <div className={styles.slotGrid}>
              {slots.map((s) => (
                <button
                  key={`${s.time}-${s.staffId}`}
                  onClick={() => setSlot(s)}
                  className={styles.slot}
                >
                  {prettyTime(s.time)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ------------------------------ services ------------------------------ */
  return (
    <div style={{ "--brand": brandColor } as React.CSSProperties}>
      <CalendarCheck className={styles.introIcon} strokeWidth={1.6} />
      <h1 className={cn("display", styles.introTitle)}>Book at {businessName}</h1>
      <p className={styles.introLede}>What do you need?</p>

      <div className={styles.services}>
        {services.map((s) => (
          <button
            key={s.id}
            onClick={() => setService(s)}
            className={styles.service}
          >
            <span className={styles.serviceText}>
              <span className={styles.serviceName}>{s.name}</span>
              {s.description && (
                <span className={styles.serviceDescription}>{s.description}</span>
              )}
              <span className={styles.serviceDuration}>{s.duration} min</span>
            </span>
            {s.price && <span className={styles.servicePrice}>{inr(s.price)}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
