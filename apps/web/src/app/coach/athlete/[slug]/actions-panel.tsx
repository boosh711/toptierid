"use client";

import { useRef, useState, useTransition } from "react";
import {
  toggleFavorite,
  saveCoachNote,
  saveVoiceNote,
  addCalendarWatch,
  contactAthlete,
} from "@/app/actions";

type Note = { id: string; body: string; visibility: string; createdAt: Date; transcript?: string | null };
type Event = { id: string; title: string; onCalendar: boolean };

export function CoachAthleteActions({
  athleteProfileId,
  slug,
  gradYear,
  isFavorited,
  scheduleEvents,
  notes,
}: {
  athleteProfileId: string;
  slug: string;
  gradYear: number | null;
  isFavorited: boolean;
  scheduleEvents: Event[];
  notes: Note[];
}) {
  const [pending, start] = useTransition();
  const [recording, setRecording] = useState(false);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [noteBody, setNoteBody] = useState("");
  const [visibility, setVisibility] = useState<"PRIVATE" | "PROGRAM">("PRIVATE");
  const [contactMsg, setContactMsg] = useState("");
  const [error, setError] = useState("");

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const fd = new FormData();
        fd.append("athleteProfileId", athleteProfileId);
        fd.append("visibility", visibility);
        fd.append("audio", blob, "note.webm");
        start(async () => {
          await saveVoiceNote(fd);
          window.location.reload();
        });
      };
      mediaRef.current = recorder;
      recorder.start();
      setRecording(true);
    } catch {
      alert("Microphone access required for voice notes");
    }
  };

  const stopRecording = () => {
    mediaRef.current?.stop();
    setRecording(false);
  };

  return (
    <div className="space-y-4">
      <div className="card space-y-3">
        <button
          type="button"
          disabled={pending}
          onClick={() => start(async () => { await toggleFavorite(athleteProfileId); })}
          className="btn-secondary w-full min-h-[44px]"
        >
          {isFavorited ? "★ Saved to My List" : "☆ Add to My List"}
        </button>
      </div>

      <div className="card space-y-3">
        <h2 className="font-semibold">Typed note</h2>
        <textarea
          value={noteBody}
          onChange={(e) => setNoteBody(e.target.value)}
          className="input min-h-[100px]"
          placeholder="Scouting notes..."
        />
        <select
          value={visibility}
          onChange={(e) => setVisibility(e.target.value as "PRIVATE" | "PROGRAM")}
          className="input"
        >
          <option value="PRIVATE">Private (only me)</option>
          <option value="PROGRAM">Share with program staff</option>
        </select>
        <button
          type="button"
          disabled={pending || !noteBody}
          className="btn-primary w-full min-h-[44px]"
          onClick={() =>
            start(async () => {
              await saveCoachNote({ body: noteBody, visibility, athleteProfileId });
              setNoteBody("");
              window.location.reload();
            })
          }
        >
          Save note
        </button>
      </div>

      <div className="card space-y-3">
        <h2 className="font-semibold">Voice note</h2>
        <p className="text-xs text-muted">Sideline-friendly — stub transcription after recording</p>
        {!recording ? (
          <button
            type="button"
            onClick={startRecording}
            className="btn-danger w-full min-h-[44px]"
          >
            ● Record voice note
          </button>
        ) : (
          <button
            type="button"
            onClick={stopRecording}
            className="btn-secondary w-full min-h-[44px] animate-pulse"
          >
            Stop recording
          </button>
        )}
      </div>

      <div className="card space-y-3">
        <h2 className="font-semibold">Add to calendar</h2>
        {scheduleEvents.map((e) => (
          <button
            key={e.id}
            type="button"
            disabled={e.onCalendar || pending}
            onClick={() =>
              start(async () => { await addCalendarWatch(e.id, athleteProfileId); })
            }
            className="btn-secondary w-full text-left text-sm min-h-[44px]"
          >
            {e.onCalendar ? "✓ " : "+ "}
            {e.title}
          </button>
        ))}
      </div>

      <div className="card space-y-3">
        <h2 className="font-semibold">Contact player</h2>
        <textarea
          value={contactMsg}
          onChange={(e) => setContactMsg(e.target.value)}
          className="input min-h-[80px]"
          placeholder="Intro message..."
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="button"
          disabled={pending || !contactMsg}
          className="btn-primary w-full min-h-[44px]"
          onClick={() =>
            start(async () => {
              const res = await contactAthlete(athleteProfileId, contactMsg);
              if (res?.error) setError(res.error);
              else {
                setContactMsg("");
                setError("");
                alert("Message sent (in-app + stub notification)");
              }
            })
          }
        >
          Send message
        </button>
      </div>

      <div className="card">
        <h2 className="font-semibold">Recent notes</h2>
        <ul className="mt-3 space-y-3 text-sm">
          {notes.map((n) => (
            <li key={n.id} className="border-b border-border pb-2">
              <p className="text-xs text-muted">{n.visibility}</p>
              <p>{n.body}</p>
            </li>
          ))}
          {notes.length === 0 && <p className="text-muted">No notes yet</p>}
        </ul>
      </div>
    </div>
  );
}
