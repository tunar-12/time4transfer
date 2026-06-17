"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { Loader2, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PlaceResult } from "@/app/api/places/route";

type Props = {
  label: string;
  placeholder?: string;
  icon?: React.ReactNode;
  /** Controlled display text */
  value: string;
  /** Called on every keystroke */
  onTextChange: (text: string) => void;
  /** Called when a real place is picked (or cleared) */
  onSelect: (place: PlaceResult | null) => void;
  /** Selected place for hint display */
  selected: PlaceResult | null;
  className?: string;
};

export const PlaceAutocomplete = forwardRef<HTMLInputElement, Props>(
  function PlaceAutocomplete(
    { label, placeholder, icon, value, onTextChange, onSelect, selected, className },
    forwardedRef
  ) {
    const reactId = useId();
    const listboxId = `${reactId}-listbox`;
    const [results, setResults] = useState<PlaceResult[]>([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const wrapperRef = useRef<HTMLLabelElement>(null);
    const abortRef = useRef<AbortController | null>(null);
    const lastFetchedRef = useRef<string>("");

    // Debounced fetch
    useEffect(() => {
      const q = value.trim();
      // If the input matches the currently selected place's label exactly,
      // don't re-search (avoids reopening dropdown after selection).
      if (selected && q === selected.label) {
        return;
      }
      if (q.length < 2) {
        setResults([]);
        setOpen(false);
        return;
      }
      if (q === lastFetchedRef.current) return;

      const handle = window.setTimeout(async () => {
        abortRef.current?.abort();
        const ctrl = new AbortController();
        abortRef.current = ctrl;
        setLoading(true);
        try {
          const res = await fetch(`/api/places?q=${encodeURIComponent(q)}`, {
            signal: ctrl.signal,
          });
          if (!res.ok) throw new Error(`Search failed (${res.status})`);
          const data = (await res.json()) as { results: PlaceResult[] };
          lastFetchedRef.current = q;
          setResults(data.results ?? []);
          setOpen(true);
          setActiveIndex(data.results?.length ? 0 : -1);
        } catch (err) {
          if ((err as Error).name !== "AbortError") {
            setResults([]);
          }
        } finally {
          setLoading(false);
        }
      }, 350);

      return () => window.clearTimeout(handle);
    }, [value, selected]);

    // Click outside closes the dropdown
    useEffect(() => {
      function onDocClick(e: MouseEvent) {
        if (!wrapperRef.current) return;
        if (!wrapperRef.current.contains(e.target as Node)) {
          setOpen(false);
        }
      }
      document.addEventListener("mousedown", onDocClick);
      return () => document.removeEventListener("mousedown", onDocClick);
    }, []);

    const pick = useCallback(
      async (p: PlaceResult) => {
        onTextChange(p.label);
        setOpen(false);
        setActiveIndex(-1);

        // Predictions from Google don't include coordinates — resolve them on
        // pick via /api/places/details. Airport seeds and Nominatim already
        // carry lat/lng, so we short-circuit.
        if (p.lat != null && p.lng != null) {
          onSelect(p);
          return;
        }

        try {
          setLoading(true);
          const res = await fetch(
            `/api/places/details?placeId=${encodeURIComponent(p.id)}`
          );
          if (!res.ok) throw new Error(`details ${res.status}`);
          const data = (await res.json()) as { lat: number; lng: number };
          onSelect({ ...p, lat: data.lat, lng: data.lng });
        } catch {
          // Surface a soft failure: keep the label but mark as unresolved.
          onSelect(p);
        } finally {
          setLoading(false);
        }
      },
      [onSelect, onTextChange]
    );

    function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
      if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
        if (results.length > 0) setOpen(true);
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(results.length - 1, i + 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(0, i - 1));
      } else if (e.key === "Enter") {
        if (open && activeIndex >= 0 && results[activeIndex]) {
          e.preventDefault();
          pick(results[activeIndex]);
        }
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    }

    const showHint = !!selected && value === selected.label && !!selected.context;

    return (
      <label
        ref={wrapperRef}
        className={cn(
          "group relative flex min-w-0 flex-col gap-1.5 rounded-2xl border border-white/[0.07] bg-white/[0.04] px-4 py-3 transition-all duration-200 hover:border-gold/40 focus-within:border-gold/60 focus-within:bg-white/[0.06]",
          className
        )}
      >
        <span className="flex items-center gap-2 text-[10.5px] font-medium uppercase tracking-[0.16em] text-bone/55">
          {icon ? <span className="text-gold-soft/80">{icon}</span> : null}
          {label}
        </span>

        <div className="relative flex items-center">
          <input
            ref={forwardedRef}
            type="text"
            value={value}
            placeholder={placeholder}
            autoComplete="off"
            role="combobox"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-activedescendant={
              activeIndex >= 0 ? `${listboxId}-opt-${activeIndex}` : undefined
            }
            onChange={(e) => {
              onTextChange(e.target.value);
              // If user starts editing, the previously-selected place is stale
              if (selected && e.target.value !== selected.label) {
                onSelect(null);
              }
            }}
            onFocus={() => {
              if (results.length > 0) setOpen(true);
            }}
            onKeyDown={onKeyDown}
            style={{ colorScheme: "dark" }}
            className="w-full bg-transparent text-[15px] text-bone placeholder:text-bone/30 focus:outline-none pr-6"
          />
          {loading ? (
            <Loader2 className="absolute right-0 h-3.5 w-3.5 animate-spin text-bone/50" />
          ) : null}
        </div>

        {showHint ? (
          <span className="text-xs text-bone/45 truncate">{selected!.context}</span>
        ) : null}

        {open && results.length > 0 ? (
          <ul
            id={listboxId}
            role="listbox"
            className="absolute left-0 right-0 top-full z-50 mt-2 max-h-72 overflow-auto rounded-2xl border border-white/10 bg-charcoal/95 p-1.5 shadow-elevated backdrop-blur-xl"
          >
            {results.map((p, i) => {
              const active = i === activeIndex;
              return (
                <li
                  key={p.id}
                  id={`${listboxId}-opt-${i}`}
                  role="option"
                  aria-selected={active}
                  onMouseEnter={() => setActiveIndex(i)}
                  onMouseDown={(e) => {
                    // mousedown so the input doesn't blur before we pick
                    e.preventDefault();
                    pick(p);
                  }}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-xl px-3 py-2.5 transition-colors",
                    active ? "bg-gold/10" : "hover:bg-white/[0.05]"
                  )}
                >
                  <MapPin
                    className={cn(
                      "mt-0.5 h-3.5 w-3.5 shrink-0",
                      active ? "text-gold-soft" : "text-bone/40"
                    )}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm text-bone">{p.label}</p>
                    {p.context ? (
                      <p className="truncate text-xs text-bone/50">{p.context}</p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : open && !loading && value.trim().length >= 2 ? (
          <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-2xl border border-white/10 bg-charcoal/95 px-4 py-3 text-sm text-bone/55 shadow-elevated backdrop-blur-xl">
            No matches in Türkiye.
          </div>
        ) : null}
      </label>
    );
  }
);
