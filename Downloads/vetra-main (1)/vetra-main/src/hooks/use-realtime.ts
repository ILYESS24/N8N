"use client";

import { useEffect, useState, useRef } from "react";

interface RealtimeEvent {
  type: string;
  data?: any;
  message?: string;
}

export function useRealtime() {
  const [events, setEvents] = useState<RealtimeEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    // Créer la connexion SSE
    const eventSource = new EventSource("/api/realtime");
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      setConnected(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setEvents((prev) => [...prev, data]);
      } catch (error) {
        console.error("Error parsing SSE message:", error);
      }
    };

    eventSource.onerror = () => {
      setConnected(false);
      // Tentative de reconnexion après 3 secondes
      setTimeout(() => {
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
        }
        const newEventSource = new EventSource("/api/realtime");
        eventSourceRef.current = newEventSource;
      }, 3000);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return { events, connected };
}

