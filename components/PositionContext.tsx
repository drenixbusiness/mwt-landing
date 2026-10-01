"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Position } from "@/lib/site";

type Ctx = { position: Position; setPosition: (p: Position) => void };

const PositionContext = createContext<Ctx | null>(null);

/** Keeps the Positions toggle and the application form's Position field in sync. */
export function PositionProvider({ children, initial = "company" }: { children: ReactNode; initial?: Position }) {
  const [position, setPosition] = useState<Position>(initial);
  return (
    <PositionContext.Provider value={{ position, setPosition }}>{children}</PositionContext.Provider>
  );
}

export function usePosition() {
  const ctx = useContext(PositionContext);
  if (!ctx) throw new Error("usePosition must be used inside <PositionProvider>");
  return ctx;
}
