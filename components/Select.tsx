"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Check, ChevronDown } from "lucide-react";

export type Option = { value: string; label: string };

type SelectProps = {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  invalid?: boolean;
  describedBy?: string;
  labelId?: string;
};

/**
 * Blueprint-styled listbox. Native <option> popups can't be styled, so this
 * renders its own panel and submits through a hidden input.
 */
export function Select({
  id,
  name,
  value,
  onChange,
  options,
  placeholder = "Select…",
  invalid,
  describedBy,
  labelId,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [dropUp, setDropUp] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typeahead = useRef({ text: "", t: 0 });
  const listId = useId();

  const selected = options.find((o) => o.value === value);
  const optionId = (i: number) => `${listId}-opt-${i}`;

  function openList() {
    const r = buttonRef.current?.getBoundingClientRect();
    if (r) {
      // Space not covered by the sticky nav / mobile bottom bar
      const navH = document.querySelector("header")?.getBoundingClientRect().height ?? 0;
      const barH = document.querySelector("[data-mobile-bar]")?.getBoundingClientRect().height ?? 0;
      const below = window.innerHeight - barH - r.bottom;
      const above = r.top - navH;
      setDropUp(below < 280 && above > below);
    }
    setActive(Math.max(0, options.findIndex((o) => o.value === value)));
    setOpen(true);
  }

  function close(refocus = true) {
    setOpen(false);
    if (refocus) buttonRef.current?.focus();
  }

  function choose(i: number) {
    onChange(options[i].value);
    close();
  }

  // Focus the list when it opens; close on outside click
  useEffect(() => {
    if (!open) return;
    listRef.current?.focus();
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  // Keep the active option in view
  useEffect(() => {
    if (open) document.getElementById(optionId(active))?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  function onButtonKey(e: KeyboardEvent) {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
      e.preventDefault();
      openList();
    }
  }

  function onListKey(e: KeyboardEvent) {
    const last = options.length - 1;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActive((a) => Math.min(last, a + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActive((a) => Math.max(0, a - 1));
        break;
      case "Home":
        e.preventDefault();
        setActive(0);
        break;
      case "End":
        e.preventDefault();
        setActive(last);
        break;
      case "PageDown":
        e.preventDefault();
        setActive((a) => Math.min(last, a + 8));
        break;
      case "PageUp":
        e.preventDefault();
        setActive((a) => Math.max(0, a - 8));
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        choose(active);
        break;
      case "Escape":
        e.preventDefault();
        close();
        break;
      case "Tab":
        close(false);
        break;
      default:
        if (e.key.length === 1 && /\S/.test(e.key)) {
          const now = Date.now();
          const t = typeahead.current;
          t.text = now - t.t > 700 ? e.key.toLowerCase() : t.text + e.key.toLowerCase();
          t.t = now;
          const i = options.findIndex((o) => o.label.toLowerCase().startsWith(t.text));
          if (i >= 0) setActive(i);
        }
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <input type="hidden" name={name} value={value} />
      <button
        ref={buttonRef}
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={labelId ? `${labelId} ${id}` : undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onClick={() => (open ? close() : openList())}
        onKeyDown={onButtonKey}
        className={`field flex items-center justify-between gap-3 text-left ${
          open ? "!border-accent outline-2 outline-accent" : ""
        }`}
      >
        <span className={selected ? "" : "text-ink/45"}>{selected?.label ?? placeholder}</span>
        <ChevronDown
          size={20}
          strokeWidth={1.5}
          aria-hidden
          className={`shrink-0 text-accent transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          tabIndex={-1}
          aria-labelledby={labelId}
          aria-activedescendant={optionId(active)}
          onKeyDown={onListKey}
          className={`absolute inset-x-0 z-30 max-h-[264px] overflow-y-auto border border-accent bg-bg py-1 shadow-[0_0_0_1px_var(--bg)] outline-none ${
            dropUp ? "bottom-full mb-1" : "top-full mt-1"
          }`}
        >
          {options.map((o, i) => {
            const isSel = o.value === value;
            const isActive = i === active;
            return (
              <li
                key={o.value}
                id={optionId(i)}
                role="option"
                aria-selected={isSel}
                onPointerMove={() => setActive(i)}
                onClick={() => choose(i)}
                className={`flex cursor-pointer items-center justify-between gap-3 border-l-2 px-3.5 py-2.5 text-[16px] ${
                  isActive ? "border-accent bg-accent-100" : "border-transparent"
                } ${isSel ? "font-semibold text-accent-700" : ""}`}
              >
                {o.label}
                {isSel && <Check size={18} strokeWidth={1.5} aria-hidden className="shrink-0 text-accent" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
